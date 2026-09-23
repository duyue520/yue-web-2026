#!/bin/bash
# ============================================================
#  07 —— 应用层加固：nginx 反扫描 / 安全响应头 / 文件权限 / 自动安全更新
#
#  为什么分两步（06 / 07）：
#    06 动的是网络与登录链路，改错了会失联，所以单独一步、带回滚；
#    07 动的是应用层，改错了顶多 nginx 报错，nginx -t 能立刻发现。
# ============================================================
set -uo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:$PATH

TS="$(date +%Y%m%d-%H%M%S)"
SITE=/var/www/site
SITECONF=/etc/nginx/default.d/site.conf
MAPSCONF=/etc/nginx/conf.d/01-wb-security.conf
MARK_BEGIN="# >>> wb-security begin >>>"
MARK_END="# <<< wb-security end <<<"

step() { echo; echo "########## $* ##########"; }

# ============================================================
step "1 / 6  nginx 反扫描：map 规则（http 上下文）"
# ============================================================
cat > "$MAPSCONF" <<'EOF'
# 由 07-harden-nginx.sh 生成 —— 必须放在 http 上下文（conf.d 正好是）

# 只放行主流方法，其余一律 444（不返回任何内容，最省资源，扫描器拿不到信息）
map $request_method $wb_bad_method {
    default  1;
    GET      0;
    HEAD     0;
    POST     0;
}

# 空 User-Agent 与常见扫描/利用工具的特征串
map $http_user_agent $wb_bad_ua {
    default  0;
    ""       1;
    ~*(?:masscan|nmap|nikto|sqlmap|acunetix|nessus|openvas|zgrab|gobuster|dirbuster|wpscan|nuclei|xray|hydra|fuzz)  1;
}
EOF
echo "    ✓ 已写入 $MAPSCONF"

# ============================================================
step "2 / 6  nginx 服务级规则：拒绝隐藏文件 / 恶意后缀 / 加安全响应头"
# ============================================================
cp -a "$SITECONF" "/root/site.conf.backup-$TS"
echo "    ✓ 已备份 → /root/site.conf.backup-$TS"

# 幂等：先删掉上一次写入的标记块
if grep -qF "$MARK_BEGIN" "$SITECONF"; then
  sed -i "/$(printf '%s' "$MARK_BEGIN" | sed 's/[][\.*^$/]/\\&/g')/,/$(printf '%s' "$MARK_END" | sed 's/[][\.*^$/]/\\&/g')/d" "$SITECONF"
  echo "    · 已清理上一次的规则块"
fi

cat >> "$SITECONF" <<'EOF'

# >>> wb-security begin >>>
# ---- 方法白名单（静态站最严；/api/ 由 12-nginx-api.sh 单独放行 PUT/DELETE）+ 拒绝空 UA 与扫描器 UA ----
if ($wb_bad_method) { return 444; }
if ($wb_bad_ua)     { return 444; }

# ---- 禁止访问隐藏文件（.git/.env/.htaccess…），但放行 ACME 校验目录 ----
location ~ /\.(?!well-known) { deny all; }

# ---- 丢垃圾后缀与常见后台/源码路径（本站是纯静态站，这些一律不存在） ----
location ~* \.(?:php\d?|asp|aspx|jsp|cgi|pl|py|rb|sh|bak|old|orig|swp|swo|sql|ini|conf|log|env|git|svn|DS_Store)$ { return 444; }
location ~* ^/(?:wp-admin|wp-login|wp-content|phpmyadmin|pma|adminer|admin|manager|\.git|\.svn|\.env|vendor/phpunit|actuator|console) { return 444; }

# ---- 安全响应头（HSTS 让浏览器以后自动走 https，正好绕开 80 端口被拦） ----
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options        "SAMEORIGIN" always;
add_header Referrer-Policy        "strict-origin-when-cross-origin" always;
add_header Permissions-Policy     "geolocation=(), microphone=(), camera=(), payment=()" always;
add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;
# <<< wb-security end <<<
EOF

# client_max_body_size 64m 对纯静态站毫无必要，反而是"大体积慢速上传"攻击的入口
if grep -q 'client_max_body_size 64m' "$SITECONF"; then
  sed -i 's/client_max_body_size 64m;/client_max_body_size 4m;/' "$SITECONF"
  echo "    ✓ client_max_body_size: 64m → 4m"
fi
# 超时收紧，缓解 slowloris 慢速攻击
if ! grep -q 'client_header_timeout' "$SITECONF"; then
  sed -i 's/^keepalive_timeout  30s;/client_header_timeout 15s;\nclient_body_timeout   15s;\nsend_timeout          15s;\nkeepalive_timeout  30s;/' "$SITECONF"
  echo "    ✓ 已加入 client_header_timeout / client_body_timeout / send_timeout"
fi

echo "--- 校验 nginx 配置 ---"
if nginx -t 2>&1 | sed 's/^/    /'; then
  systemctl reload nginx && echo "    ✓ nginx 已重载"
else
  echo "    ✗ nginx -t 失败！回滚 site.conf"
  cp -a "/root/site.conf.backup-$TS" "$SITECONF"
  rm -f "$MAPSCONF"
  nginx -t && systemctl reload nginx && echo "    ✓ 已回滚并恢复"
  exit 1
fi

# ============================================================
step "3 / 6  文件权限收紧（world-writable 是提权跳板）"
# ============================================================
WW=$(find "$SITE" -type f -perm -0002 2>/dev/null | wc -l)
echo "    改动前：可被任意用户写入的文件 = $WW 个"
chown -R root:root "$SITE" 2>/dev/null
find "$SITE" -type d -exec chmod 755 {} + 2>/dev/null
find "$SITE" -type f -exec chmod 644 {} + 2>/dev/null
echo "    改动后：可被任意用户写入的文件 = $(find "$SITE" -type f -perm -0002 2>/dev/null | wc -l) 个"

# 证书私钥目录只留给 root
chmod 700 /etc/letsencrypt/live /etc/letsencrypt/archive 2>/dev/null || true
chmod 700 /etc/nginx/ssl 2>/dev/null || true
[ -f /root/.ali-creds ] && chmod 600 /root/.ali-creds

# ============================================================
step "4 / 6  自动安全更新（只打安全补丁，不追新版本）"
# ============================================================
if ! command -v dnf-automatic >/dev/null 2>&1; then
  dnf install -y dnf-automatic >/dev/null 2>&1 && echo "    ✓ 已安装 dnf-automatic"
fi
if command -v dnf-automatic >/dev/null 2>&1; then
  CONF=/etc/dnf/automatic.conf
  cp -a "$CONF" "/root/automatic.conf.backup-$TS" 2>/dev/null
  sed -i 's/^upgrade_type *=.*/upgrade_type = security/' "$CONF"
  sed -i 's/^apply_updates *=.*/apply_updates = yes/'   "$CONF"
  sed -i 's/^random_sleep *=.*/random_sleep = 300/'     "$CONF"
  grep -qE '^apply_updates' "$CONF" || printf '\napply_updates = yes\n' >> "$CONF"
  grep -qE '^random_sleep'  "$CONF" || printf 'random_sleep = 300\n'   >> "$CONF"
  systemctl enable --now dnf-automatic.timer >/dev/null 2>&1 \
    && echo "    ✓ dnf-automatic.timer 已启用（只装 security 类更新）" \
    || echo "    ✗ 启用失败，请手工检查"
  systemctl list-timers dnf-automatic.timer --no-pager 2>/dev/null | head -3 | sed 's/^/      /'
else
  echo "    ✗ dnf-automatic 不可用，跳过"
fi

# ============================================================
step "5 / 6  日志持久化（重启后还能查，攻击取证必需）"
# ============================================================
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/99-wb.conf <<'EOF'
[Journal]
Storage=persistent
SystemMaxUse=200M
SystemMaxFileSize=50M
EOF
systemctl restart systemd-journald >/dev/null 2>&1 && echo "    ✓ journald 已改为持久化（上限 200M）"

# ============================================================
step "6 / 6  攻击面总览"
# ============================================================
echo "--- 对外监听端口（应该只有 22 / 80 / 443）---"
ss -lntp 2>/dev/null | awk 'NR==1 || /LISTEN/ {print "    " $0}'
echo
echo "--- nginx 现在对可疑请求的响应（自测）---"
for t in "GET /index.php" "GET /.env" "GET /wp-admin/" "GET /.git/config" "GET /index.html"; do
  printf "    %-24s → " "$t"
  curl -sS -o /dev/null -m 6 -w '%{http_code}\n' --resolve heyiwei.tech:443:127.0.0.1 \
       -H "User-Agent: Mozilla/5.0" "https://heyiwei.tech$(echo "$t" | awk '{print $2}')" 2>&1
done
printf "    %-24s → " "空 User-Agent"
curl -sS -o /dev/null -m 6 -w '%{http_code}\n' --resolve heyiwei.tech:443:127.0.0.1 \
     -H "User-Agent;" "https://heyiwei.tech/" 2>&1
echo "    （444 = 直接断连不给任何信息，是期望结果）"
echo
echo "--- 安全响应头自测 ---"
curl -sSI -m 8 --resolve heyiwei.tech:443:127.0.0.1 https://heyiwei.tech/ 2>/dev/null \
  | grep -iE 'strict-transport|x-content-type|x-frame|referrer|permissions|server:' | sed 's/^/    /'

echo
echo "============================================================"
echo " 应用层加固完成。"
echo "============================================================"
