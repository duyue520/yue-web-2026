#!/bin/bash
# wb-harden2.sh —— 补两个缺口：① /api/ 专用严格限流 ② fail2ban 封禁 nginx 扫描器
# 安全策略：改前备份 → nginx -t 校验 → 失败自动回滚
set -u
TS=$(date +%Y%m%d-%H%M%S)
BAK=/root/wb-harden-bak-$TS
mkdir -p "$BAK"
echo "备份目录: $BAK"

cp -a /etc/nginx/conf.d/00-wb-limits.conf       "$BAK/"
cp -a /etc/nginx/snippets/wb-api-proxy.conf     "$BAK/"

# ---------- ① 接口专用限流 zone ----------
if grep -q "zone=wb_api" /etc/nginx/conf.d/00-wb-limits.conf; then
  echo "[1] api 限流 zone 已存在，跳过"
else
  cat >> /etc/nginx/conf.d/00-wb-limits.conf <<'EOF'

# 接口专用：AI 推理很吃 CPU，单 IP 必须更严
limit_req_zone  $binary_remote_addr zone=wb_api:10m      rate=5r/s;
limit_conn_zone $binary_remote_addr zone=wb_apiconn:10m;
EOF
  echo "[1] 已追加 wb_api 限流 zone"
fi

# ---------- ② 重写 api 反代片段，加入限流指令 ----------
cat > /etc/nginx/snippets/wb-api-proxy.conf <<'EOF'
# 由 12-nginx-api.sh 生成；2026-09-19 追加接口专用限流
# 只被 10-https.conf 的 443 server 块 include —— 明文 HTTP 上不暴露接口。

location ^~ /api/ {
    # 后端允许单张最大 10MB，上层 site.conf 是 4m，这里单独放宽
    client_max_body_size 12m;

    # ---- 接口专用限流：单 IP 5 请求/秒、最多 8 条并发 ----
    # 正常用户点几下远远用不到；脚本刷接口会被 429 挡住
    limit_req  zone=wb_api burst=10 nodelay;
    limit_conn wb_apiconn 8;
    limit_req_status  429;
    limit_conn_status 429;

    proxy_pass         http://127.0.0.1:7860;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Connection        "";

    proxy_connect_timeout 5s;
    proxy_send_timeout    60s;
    proxy_read_timeout    60s;
    proxy_buffering       on;

    # 后端没起来时，前端只认 JSON，别给它 nginx 的 HTML 错误页
    error_page 502 504 = @wb_api_down;

    include /etc/nginx/snippets/wb-security-headers.conf;
}

location @wb_api_down {
    default_type application/json;
    add_header Cache-Control "no-store" always;
    return 503 '{"detail":"服务暂时不可用，请稍后重试"}';
}
EOF
echo "[2] 已重写 wb-api-proxy.conf（含接口限流）"

# ---------- ③ fail2ban：封禁 nginx 扫描器 ----------
cat > /etc/fail2ban/filter.d/wb-nginx.conf <<'EOF'
# 本站 nginx 对扫描器/危险方法/垃圾路径主动返回 444（直接断连）
[Definition]
failregex = ^<HOST> -.*"(?:GET|POST|HEAD|PUT|DELETE|OPTIONS|PATCH|CONNECT|PROPFIND|TRACE)[^"]*"\s+444\s
ignoreregex =
EOF

cat > /etc/fail2ban/jail.d/99-wb-nginx.conf <<'EOF'
[wb-nginx]
enabled  = true
filter   = wb-nginx
logpath  = /var/log/nginx/access.log
maxretry = 20
findtime = 120
bantime  = 3600
action   = firewallcmd-rich-rules[actiontype=<multiport>]
EOF
echo "[3] 已写入 fail2ban 过滤器与 jail"

# ---------- ④ 校验 nginx，失败回滚 ----------
if nginx -t 2>/tmp/ngt; then
  echo "[4] nginx -t 通过"
  systemctl reload nginx
  echo "    已 reload"
else
  echo "[4] ✗ nginx -t 失败，正在回滚！"
  cat /tmp/ngt
  cp -a "$BAK/00-wb-limits.conf"   /etc/nginx/conf.d/00-wb-limits.conf
  cp -a "$BAK/wb-api-proxy.conf"   /etc/nginx/snippets/wb-api-proxy.conf
  rm -f /etc/fail2ban/jail.d/99-wb-nginx.conf
  nginx -t 2>&1 | tail -3
  exit 1
fi

# ---------- ⑤ 重启 fail2ban ----------
systemctl restart fail2ban
sleep 3
echo -n "[5] fail2ban 状态: "; systemctl is-active fail2ban
fail2ban-client status 2>/dev/null | head -6

echo
echo "=============== 自测 ==============="
echo "-- 首页（应 200）--"
curl -sk -o /dev/null -w '  /                -> %{http_code}\n' https://heyiwei.tech/
echo "-- 接口健康检查（应 200）--"
curl -sk -o /dev/null -w '  /api/health      -> %{http_code}\n' https://heyiwei.tech/api/health
echo "-- 连打接口 40 次（应出现 429）--"
for i in $(seq 1 40); do
  curl -sk -o /dev/null -w '%{http_code} ' https://heyiwei.tech/api/health
done
echo
echo "-- 扫描器路径（应 444）--"
for p in /wp-login.php /.env /admin/ ; do
  printf '  %-18s -> %s\n' "$p" "$(curl -sk -o /dev/null -w '%{http_code}' https://heyiwei.tech$p)"
done
echo "-- 空 UA（应 444）--"
curl -sk -o /dev/null -w '  空UA             -> %{http_code}\n' -H 'User-Agent;' https://heyiwei.tech/
echo
echo "备份留在: $BAK"
