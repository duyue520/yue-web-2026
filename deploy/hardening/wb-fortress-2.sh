#!/usr/bin/env bash
# wb-fortress-2.sh —— 修掉 fortress-1 的 4 个 FAIL + 补 nginx/TLS 层
LC_ALL=C
export LC_ALL
ok()   { echo "  [PASS] $*"; }
bad()  { echo "  [FAIL] $*"; }
info() { echo "  [INFO] $*"; }
sec()  { echo; echo "########## $* ##########"; }

# ============ 1. 修 sysctl：本内核没有 YAMA ============
sec "1. 修 sysctl（kernel.yama.ptrace_scope 在本内核不存在）"
if [ -e /proc/sys/kernel/yama/ptrace_scope ]; then
  ok "本机有 YAMA，保留该项"
else
  info "本机内核未编译 YAMA → 摘掉该项，避免 sysctl -p 整条报错中断"
  sed -i '/yama.ptrace_scope/d' /etc/sysctl.d/99-wb-fortress.conf
fi
if sysctl -q -p /etc/sysctl.d/99-wb-fortress.conf 2>/tmp/sysctl2.err; then
  ok "sysctl 全部加载成功（无报错）"
else
  bad "仍有报错："; sed 's/^/    /' /tmp/sysctl2.err
fi
echo "  --- 生效值复核 ---"
for k in net.ipv6.conf.all.accept_redirects net.ipv6.conf.default.accept_redirects \
         net.ipv4.conf.default.log_martians kernel.sysrq kernel.kptr_restrict; do
  printf '    %-48s = %s\n' "$k" "$(sysctl -n $k 2>/dev/null)"
done

# ============ 2. 修 auditd 规则 ============
sec "2. 修 auditd 规则并确认审计真的开着"
cat > /etc/audit/rules.d/99-wb.rules <<'AUDIT'
## 由 wb-fortress 生成
## ★ audit 规则**不支持反斜杠续行**，每条必须完整写在一行（上一版就栽在这）
-D
-b 8192
-f 1

# 账户与提权
-w /etc/passwd -p wa -k wb_identity
-w /etc/shadow -p wa -k wb_identity
-w /etc/group -p wa -k wb_identity
-w /etc/gshadow -p wa -k wb_identity
-w /etc/sudoers -p wa -k wb_priv
-w /etc/sudoers.d/ -p wa -k wb_priv

# SSH
-w /etc/ssh/sshd_config -p wa -k wb_sshd
-w /etc/ssh/sshd_config.d/ -p wa -k wb_sshd
-w /root/.ssh/ -p wa -k wb_sshkey

# 应用代码 / 密钥 / 模型（本次修掉世界可写的正是这些）
-w /opt/wb-api/server/ -p wa -k wb_app_code
-w /opt/wb-api/.env -p wa -k wb_app_secret
-w /opt/wb-api/weights/ -p wa -k wb_app_model

# 云账号凭据
-w /root/.ali-creds -p wa -k wb_cloud_creds

# Web 内容与配置
-w /var/www/site -p wa -k wb_site
-w /etc/nginx/ -p wa -k wb_nginx
-w /etc/fail2ban/ -p wa -k wb_f2b

# 内核模块加载（rootkit 常见入口）
-a always,exit -F arch=b64 -S init_module -S finit_module -S delete_module -k wb_kmod

# 非 root 会话发起的提权与执行
-a always,exit -F arch=b64 -S setuid -S setgid -S setreuid -S setregid -F auid>=1000 -F auid!=unset -k wb_privcall
-a always,exit -F arch=b64 -S execve -F auid>=1000 -F auid!=unset -k wb_exec
AUDIT
if augenrules --load 2>/tmp/augen2.err; then
  ok "augenrules --load 成功"
else
  bad "augenrules 仍失败："; sed 's/^/    /' /tmp/augen2.err
  echo "    --- 生成文件 1..30 行（定位用） ---"
  nl -ba /etc/audit/audit.rules 2>/dev/null | sed -n '1,30p' | sed 's/^/    /'
fi
systemctl restart auditd >/dev/null 2>&1
sleep 3
systemctl is-active --quiet auditd && ok "auditd active" || bad "auditd 未 active"
echo "  --- auditctl -s（enabled 必须 1、pid 必须非 0 才算真在审） ---"
auditctl -s 2>/dev/null | head -6 | sed 's/^/    /'
en=$(auditctl -s 2>/dev/null | awk '/^enabled/{print $2}')
apid=$(auditctl -s 2>/dev/null | awk '/^pid/{print $2}')
[ "$en" = "1" ] && ok "审计已启用 enabled=1" || bad "enabled=$en（0=未启用）"
[ -n "$apid" ] && [ "$apid" != "0" ] && ok "auditd 已接管 pid=$apid" || bad "pid=$apid（0=没人接管）"
n=$(auditctl -l 2>/dev/null | grep -c 'wb_')
[ "$n" -ge 18 ] && ok "已加载 $n 条 wb_ 规则" || bad "只加载 $n 条（期望 ≥18）"

# ============ 3. 修 ctrl-alt-del mask ============
sec "3. 关闭本地控制台 Ctrl-Alt-Del"
systemctl is-enabled ctrl-alt-del.target 2>&1 | sed 's/^/    改前 is-enabled: /'
if systemctl mask ctrl-alt-del.target 2>/tmp/mask.err; then
  ok "mask 成功"
else
  bad "mask 失败，原始报错："; sed 's/^/    /' /tmp/mask.err
fi
systemctl is-enabled ctrl-alt-del.target 2>&1 | sed 's/^/    改后 is-enabled: /'
ls -l /etc/systemd/system/ctrl-alt-del.target 2>/dev/null | sed 's/^/    /'

# ============ 4. fail2ban 过滤器整理（444 / 429 分表） ============
sec "4. fail2ban 过滤器：444 与 429 分开，避免误伤正常访客"
cat > /etc/fail2ban/filter.d/wb-nginx.conf <<'F1'
# 只匹配 nginx 返回 444（反扫描断连）—— 纯恶意信号
[Definition]
failregex = ^<HOST> -.*"(?:GET|POST|HEAD|PUT|DELETE|OPTIONS|PATCH|CONNECT|PROPFIND|TRACE)[^"]*"\s+444\s
ignoreregex =
F1
cat > /etc/fail2ban/filter.d/wb-nginx-flood.conf <<'F2'
# 只匹配 nginx 返回 429（限流触发）—— 正常访客突发加载资源也可能触发，
# 所以单独一张表、阈值放宽到 30 次/10 分钟，不沿用 444 的 10 次
[Definition]
failregex = ^<HOST> -.*"(?:GET|POST|HEAD|PUT|DELETE|OPTIONS|PATCH|CONNECT|PROPFIND|TRACE)[^"]*"\s+429\s
ignoreregex =
F2
cat > /etc/fail2ban/jail.d/98b-wb-nginx-flood.conf <<'F3'
[wb-nginx-flood]
enabled   = true
filter    = wb-nginx-flood
logpath   = /var/log/nginx/access.log
port      = http,https
banaction = firewallcmd-allports
action    = firewallcmd-allports
maxretry  = 30
findtime  = 600
bantime   = 3600
ignoreip  = 127.0.0.1/8 ::1 115.29.242.211 223.160.113.95
F3
systemctl restart fail2ban >/dev/null 2>&1
sleep 5
systemctl is-active --quiet fail2ban && ok "fail2ban active" || bad "fail2ban 未起来"
fail2ban-client status 2>/dev/null | sed 's/^/    /'
echo "  --- 两个过滤器各拿真实格式日志行自检 ---"
for ch in 444 429; do
  line="203.0.113.9 - - [19/Sep/2026:23:40:00 +0800] \"GET /wp-login.php HTTP/1.1\" $ch 0 \"-\" \"sqlmap\""
  if [ "$ch" = 444 ]; then tgt=wb-nginx; else tgt=wb-nginx-flood; fi
  out=$(fail2ban-regex "$line" "/etc/fail2ban/filter.d/$tgt.conf" 2>/dev/null | grep -E '^\s*Lines:')
  echo "$out" | grep -qE '1 matched' && ok "$tgt 匹配 $ch → $out" || bad "$tgt 未匹配 $ch"
done

# ============ 5. nginx / TLS 收紧（★必须改 server 块，http 层会被覆盖） ============
sec "5. nginx 与 TLS 收紧"
HF=/etc/nginx/conf.d/10-https.conf
cp -a "$HF" /root/10-https.conf.pre-tls
CERT=/etc/nginx/ssl/heyiwei.tech/fullchain.pem
OCSP=$(openssl x509 -in "$CERT" -noout -ocsp_uri 2>/dev/null)
if [ -n "$OCSP" ]; then info "证书带 OCSP：$OCSP"; else info "证书无 OCSP URL（LE 已停发）→ 不启 stapling"; fi

# 5a. server 块里 prefer_server_ciphers off → on
sed -i 's/^\([[:space:]]*\)ssl_prefer_server_ciphers[[:space:]]\+off;/\1ssl_prefer_server_ciphers on;/' "$HF"
# 5b. 在 server 块的 ssl_protocols 行后整体插入 TLS 参数
#     ★ 用 s 命令（而非 a 命令）插入，避免 sed 把插入文本里的分号当成命令分隔符
if ! grep -q 'ssl_ciphers' "$HF"; then
  INS='    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n    ssl_ecdh_curve X25519:secp256r1:secp384r1;\n    ssl_session_tickets off;'
  if [ -n "$OCSP" ]; then
    INS="$INS\\n    ssl_stapling on;\\n    ssl_stapling_verify on;\\n    ssl_trusted_certificate /etc/nginx/ssl/heyiwei.tech/fullchain.pem;\\n    resolver 100.100.2.136 100.100.2.138 valid=300s;\\n    resolver_timeout 5s;"
  fi
  sed -i "s|^\([[:space:]]*ssl_protocols[^;]*;\)|\1\n$INS|" "$HF"
fi
echo "  --- 改动后的 TLS 段（生效值） ---"
nginx -T 2>/dev/null | grep -E 'ssl_protocols|ssl_ciphers|ssl_prefer_server_ciphers|ssl_ecdh_curve|ssl_session_tickets|ssl_stapling' | sed 's/^/    /'

if nginx -t 2>/tmp/ngt.err; then
  ok "nginx -t 通过"
  systemctl reload nginx && ok "nginx 已 reload" || bad "reload 失败"
  sleep 2
  echo "  --- 实测 TLS 协商 ---"
  for v in tls1_2 tls1_3; do
    r=$(echo | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -$v 2>/dev/null | grep -E 'Protocol|Cipher' | tr -d ' ' | tr '\n' ' ')
    [ -n "$r" ] && ok "$v → $r" || bad "$v 不可用"
  done
  r=$(echo | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_1 2>&1 | grep -cE '^\s*(Protocol|Cipher)\s*:')
  [ "$r" = "0" ] && ok "TLSv1.1 已拒绝" || bad "TLSv1.1 仍可协商"
  echo "  --- 站点回归 ---"
  for p in / /index.html /campus/ /api/health; do
    code=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
    [ "$code" = "200" ] && ok "GET $p → $code" || bad "GET $p → $code"
  done
else
  bad "nginx -t 失败，回滚该文件："; sed 's/^/    /' /tmp/ngt.err
  cp -a /root/10-https.conf.pre-tls "$HF"
  nginx -t >/dev/null 2>&1 && systemctl reload nginx
  info "已回滚到改动前"
fi

sec "汇总"
echo "  以上 [FAIL] 项需要再处理；其余已确认"
