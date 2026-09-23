#!/bin/bash
# ============================================================
#  一条命令完成：DNS 记录 + 证书 + HTTPS
#
#  与 04-domain-https.sh 的区别：
#    04  用 webroot(HTTP-01) 验证 → 需要域名能公网访问，会被备案拦截拖住
#    04b 用 DNS-01 验证          → 只需要能改 DNS，不需要域名可访问，
#                                  所以【不必等备案】就能先拿到证书
#
#  用法：
#    export Ali_Key=xxx Ali_Secret=yyy
#    bash 04b-domain-https-dns.sh heyiwei.tech www.heyiwei.tech
#
#  幂等：可重复执行；已有记录会更新，已有证书会续期。
# ============================================================
set -euo pipefail

[ $# -ge 1 ] || { echo "用法: Ali_Key=... Ali_Secret=... bash $0 <主域名> [更多域名...]"; exit 1; }
PRIMARY="$1"; shift
ALL_DOMAINS=("$PRIMARY" "$@")

: "${Ali_Key:?需要环境变量 Ali_Key}"
: "${Ali_Secret:?需要环境变量 Ali_Secret}"
export Ali_Key Ali_Secret

PUBIP="${PUBIP:-115.29.242.211}"
WEBROOT="${WEBROOT:-/var/www/site}"
SSL_DIR="/etc/nginx/ssl/$PRIMARY"
HTTPS_CONF=/etc/nginx/conf.d/10-https.conf
ACME_HOME="$HOME/.acme.sh/acme.sh"
ALIDNS_PY=/root/alidns.py
LE_EMAIL="${LE_EMAIL:-admin@$PRIMARY}"

DOMAIN_ARGS=()
for d in "${ALL_DOMAINS[@]}"; do DOMAIN_ARGS+=(-d "$d"); done

echo "主域名  : $PRIMARY"
echo "全部域名: ${ALL_DOMAINS[*]}"
echo "本机公网: $PUBIP"
echo

# ---------------- 0. 前置 ----------------
echo "########## 0. 前置检查 ##########"
[ -f "$ALIDNS_PY" ] || { echo "✗ 缺少 $ALIDNS_PY"; exit 1; }
python3 "$ALIDNS_PY" accounts >/dev/null && echo "  ✓ 阿里云凭据有效，云解析 API 可用"

BK="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BK" /etc/nginx/nginx.conf /etc/nginx/default.d /etc/nginx/conf.d 2>/dev/null || true
echo "  ✓ 已备份 nginx 配置 -> $BK"

# ---------------- 1. 写 A 记录 ----------------
echo
echo "########## 1. 配置 DNS A 记录 ##########"
for d in "${ALL_DOMAINS[@]}"; do
  if [ "$d" = "$PRIMARY" ]; then RR="@"; else RR="${d%%.*}"; fi
  python3 "$ALIDNS_PY" check "$PRIMARY" "$RR" "$PUBIP" 600
done

# ---------------- 2. acme.sh ----------------
echo
echo "########## 2. 准备 acme.sh ##########"
if [ -x "$ACME_HOME" ]; then
  "$ACME_HOME" --upgrade --auto-upgrade >/dev/null 2>&1 || true
  echo "  ✓ 已存在，已尝试升级"
else
  curl -fsSL https://get.acme.sh | sh -s email="$LE_EMAIL"
  echo "  ✓ 安装完成"
fi
"$ACME_HOME" --set-default-ca --server letsencrypt >/dev/null
echo "  ✓ 默认 CA 切到 Let's Encrypt"

# ---------------- 3. DNS-01 签证书 ----------------
echo
echo "########## 3. 用 DNS 验证签发证书（不需要域名可访问）##########"
"$ACME_HOME" --issue --dns dns_ali "${DOMAIN_ARGS[@]}" --server letsencrypt

mkdir -p "$SSL_DIR"
"$ACME_HOME" --install-cert -d "$PRIMARY" \
  --key-file       "$SSL_DIR/privkey.pem" \
  --fullchain-file "$SSL_DIR/fullchain.pem" \
  --reloadcmd      "nginx -t && systemctl reload nginx"
echo "  ✓ 证书就位："
ls -la "$SSL_DIR"

# ---------------- 4. nginx HTTPS ----------------
echo
echo "########## 4. 配置 nginx 443 ##########"

# nginx 1.25.1 起才有独立 http2 指令；1.24 只能写在 listen 参数里
NGX_VER="$(nginx -v 2>&1 | sed -n 's#.*nginx/\([0-9][0-9.]*\).*#\1#p')"
if printf '1.25.1\n%s\n' "$NGX_VER" | sort -V -C 2>/dev/null; then
  L443="    listen       443 ssl;"; L443_6="    listen       [::]:443 ssl;"
  HTTP2_LINE="
    http2        on;"
else
  L443="    listen       443 ssl http2;"; L443_6="    listen       [::]:443 ssl http2;"
  HTTP2_LINE=""
fi
echo "  nginx $NGX_VER → http2 用 $( [ -n "$HTTP2_LINE" ] && echo '独立指令' || echo 'listen 参数' )"

SERVER_NAMES="$PRIMARY"
for d in "${ALL_DOMAINS[@]:1}"; do SERVER_NAMES="$SERVER_NAMES $d"; done

cat > "$HTTPS_CONF" <<EOF
# 由 04b-domain-https-dns.sh 生成
# 80 端口的【默认 server】(server_name _) 仍提供明文 HTTP → IP 直接访问不受影响

server {
    listen       80;
    listen       [::]:80;
    server_name  $SERVER_NAMES;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
$L443
$L443_6$HTTP2_LINE
    server_name  $SERVER_NAMES;
    root         $WEBROOT;

    ssl_certificate     $SSL_DIR/fullchain.pem;
    ssl_certificate_key $SSL_DIR/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:wb_ssl:10m;
    ssl_session_timeout 1d;
    ssl_prefer_server_ciphers off;

    include /etc/nginx/default.d/site.conf;

    # HSTS 等站点稳定几天后再开，开了就退不回 http
    # add_header Strict-Transport-Security "max-age=31536000" always;
}
EOF

mkdir -p /var/www/acme
nginx -t
systemctl reload nginx
echo "  ✓ nginx 已重载"

# ---------------- 5. 终检 ----------------
echo
echo "########## 5. 终检 ##########"
echo "端口监听："
ss -lntp | grep -E ':(80|443)\b' || true
echo
for d in "${ALL_DOMAINS[@]}"; do
  echo "  --- $d ---"
  echo -n "    DNS  : "; getent ahostsv4 "$d" | awk '{print $1}' | sort -u | tr '\n' ' '; echo
  echo -n "    http  : "; curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "http://$d/" || true
  echo -n "    https : "; curl -sS -o /dev/null -w '%{http_code}\n' "https://$d/" || true
  echo -n "    证书  : "; echo | openssl s_client -connect "$d:443" -servername "$d" 2>/dev/null \
      | openssl x509 -noout -subject -dates 2>/dev/null | tr '\n' ' ' || echo "(取证书失败)"
  echo
done
echo "完成。证书由 acme.sh 自动续期（已写 cron）。"
