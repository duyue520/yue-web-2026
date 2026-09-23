#!/bin/bash
# ============================================================
#  05 —— certbot + DNS-01 签发证书，并配置 nginx HTTPS
#
#  为什么不用 acme.sh：
#    本机 raw.githubusercontent.com 实测被墙（code=000，5s 超时），
#    而 acme.sh 的安装脚本和 dnsapi 插件都从 GitHub 拉取 → 装不上。
#    certbot 走 EPEL（国内镜像），依赖仅 1.6MB，秒装。
#
#  为什么用 DNS-01 而不是 HTTP-01：
#    域名未做 ICP 备案，80/443 入向被阿里云 Beaver 网关拦截：
#      HTTP/1.1 403 Forbidden / Server: Beaver
#      <title>Non-compliance ICP Filing</title>
#    → Let's Encrypt 的 HTTP-01 校验必然失败。
#      DNS-01 只查 DNS，不受该拦截影响，所以能先把证书拿到手。
#
#  用法:
#    LE_EMAIL=you@xx.com bash 05-certbot-dns01.sh heyiwei.tech www.heyiwei.tech
#
#  幂等：可重复执行，已有证书会走续期逻辑。
# ============================================================
set -euo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:$PATH

PRIMARY="${1:?用法: bash $0 <主域名> [更多域名...]}"; shift || true
ALL=("$PRIMARY")
for d in "$@"; do ALL+=("$d"); done
[ ${#ALL[@]} -gt 1 ] || ALL+=("www.$PRIMARY")

WEBROOT=/var/www/site
SSL_DIR="/etc/nginx/ssl/$PRIMARY"
HTTPS_CONF=/etc/nginx/conf.d/10-https.conf
LE_EMAIL="${LE_EMAIL:-admin@$PRIMARY}"
LIVE_DIR="/etc/letsencrypt/live/$PRIMARY"

DOM=(); for d in "${ALL[@]}"; do DOM+=(-d "$d"); done

step() { echo; echo "########## $* ##########"; }

echo "主域名  : $PRIMARY"
echo "全部域名: ${ALL[*]}"
echo "邮箱    : $LE_EMAIL"

step "0. 前置检查"
for f in /root/alidns.py /root/dnsq.py /root/ali-dns-auth.sh /root/ali-dns-cleanup.sh /root/.ali-creds; do
  [ -f "$f" ] || { echo "  ✗ 缺少 $f"; exit 1; }
done
chmod +x /root/ali-dns-auth.sh /root/ali-dns-cleanup.sh
command -v certbot >/dev/null || { echo "  ✗ certbot 未安装"; exit 1; }
echo "  ✓ certbot $(certbot --version 2>&1 | awk '{print $NF}')"

BK="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BK" /etc/nginx/nginx.conf /etc/nginx/default.d /etc/nginx/conf.d 2>/dev/null || true
echo "  ✓ nginx 配置已备份 -> $BK"

step "1. 签发证书（DNS-01：不需要域名可访问，绕开备案拦截）"
set -a; . /root/.ali-creds; set +a
export ACME_ZONE="$PRIMARY"
CERTBOT_LOG=/root/certbot-issue.log

if [ -d "$LIVE_DIR" ]; then
  echo "  已存在 /etc/letsencrypt/live/$PRIMARY，走续期："
  certbot renew --cert-name "$PRIMARY" --force-renewal 2>&1 | tee "$CERTBOT_LOG"
else
  certbot certonly \
    --manual --preferred-challenges dns \
    --manual-auth-hook   /root/ali-dns-auth.sh \
    --manual-cleanup-hook /root/ali-dns-cleanup.sh \
    --non-interactive --agree-tos --no-eff-email \
    --email "$LE_EMAIL" \
    --cert-name "$PRIMARY" \
    "${DOM[@]}" 2>&1 | tee "$CERTBOT_LOG"
fi

[ -f "$LIVE_DIR/fullchain.pem" ] || { echo "  ✗ 证书未生成，见 $CERTBOT_LOG"; exit 1; }
echo "  ✓ 证书已签发："
openssl x509 -in "$LIVE_DIR/fullchain.pem" -noout -subject -issuer -dates | sed 's/^/    /'

step "2. 部署钩子：续期后自动同步到 nginx 并重载"
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/00-copy-to-nginx.sh <<HOOK
#!/bin/bash
set -e
SSL_DIR="$SSL_DIR"
mkdir -p "\$SSL_DIR"
install -m 600 "$LIVE_DIR/privkey.pem"   "\$SSL_DIR/privkey.pem"
install -m 644 "$LIVE_DIR/fullchain.pem" "\$SSL_DIR/fullchain.pem"
nginx -t && systemctl reload nginx
echo "[\$(date -Is)] 证书已同步到 \$SSL_DIR 并重载 nginx"
HOOK
chmod +x /etc/letsencrypt/renewal-hooks/deploy/00-copy-to-nginx.sh
/etc/letsencrypt/renewal-hooks/deploy/00-copy-to-nginx.sh

step "3. 配置 nginx 443 + 80 跳转"
# nginx 1.25.1 起才有独立的 http2 指令；1.24 只能写在 listen 参数里
NGX_VER="$(nginx -v 2>&1 | sed -n 's#.*nginx/\([0-9][0-9.]*\).*#\1#p')"
if printf '1.25.1\n%s\n' "$NGX_VER" | sort -V -C 2>/dev/null; then
  L443="    listen       443 ssl;"; L443_6="    listen       [::]:443 ssl;"
  HTTP2_LINE="
    http2        on;"
  MODE="独立 http2 指令"
else
  L443="    listen       443 ssl http2;"; L443_6="    listen       [::]:443 ssl http2;"
  HTTP2_LINE=""
  MODE="listen 参数"
fi
echo "  nginx $NGX_VER → http2 用 $MODE"

SERVER_NAMES="$PRIMARY"
for d in "${ALL[@]:1}"; do SERVER_NAMES="$SERVER_NAMES $d"; done

cat > "$HTTPS_CONF" <<EOF
# 由 05-certbot-dns01.sh 生成
# nginx.conf 里 80 端口的默认 server（server_name _）保持不变，
# 所以用 IP 直接访问的行为完全不受影响。

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

    # 后端 FastAPI 反代。只写在这一个 443 server 里 —— 明文 HTTP 上不暴露接口。
    # 片段内容见 .workbuddy/deploy/api/12-nginx-api.sh；
    # 手动改片段后 `nginx -t && systemctl reload nginx` 即可，不要重跑本脚本去覆盖它。
    include /etc/nginx/snippets/wb-api-proxy.conf;

    # HSTS 等备案通过、站点稳定运行几天后再开（开了就退不回 http）
    # add_header Strict-Transport-Security "max-age=31536000" always;
}
EOF

mkdir -p /var/www/acme
nginx -t
systemctl reload nginx
echo "  ✓ nginx 已重载"

step "4. 自动续期"
if systemctl list-unit-files 2>/dev/null | grep -q '^certbot-renew.timer'; then
  systemctl enable --now certbot-renew.timer >/dev/null 2>&1 && echo "  ✓ certbot-renew.timer 已启用"
else
  echo "  未找到 certbot-renew.timer，写 cron 兜底"
  printf '17 3,15 * * * root certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/00-copy-to-nginx.sh\n' \
    > /etc/cron.d/certbot-renew
  chmod 644 /etc/cron.d/certbot-renew
  echo "  ✓ /etc/cron.d/certbot-renew 已写入（每天 03:17 / 15:17 两次尝试）"
fi

step "5. 本机终检（绕过外部拦截，直接打 127.0.0.1）"
echo "端口监听："
ss -lntp 2>/dev/null | grep -E ':(80|443)\b' || true
echo
for d in "${ALL[@]}"; do
  echo "  --- $d ---"
  printf "    http  -> "; curl -sS -o /dev/null -m 8 -w '%{http_code} → %{redirect_url}\n' \
      --resolve "$d:80:127.0.0.1" "http://$d/" || true
  printf "    https -> "; curl -sS -o /dev/null -m 8 -w '%{http_code}\n' \
      --resolve "$d:443:127.0.0.1" "https://$d/" || true
  printf "    证书  -> "; echo | openssl s_client -connect 127.0.0.1:443 -servername "$d" 2>/dev/null \
      | openssl x509 -noout -subject -dates 2>/dev/null | tr '\n' ' '; echo
done

echo
echo "============================================================"
echo " 完成。证书有效期 90 天，已配置自动续期。"
echo " ⚠ 注意：从公网访问 https://$PRIMARY 仍会被阿里云备案网关拦截"
echo "   （403 / Server: Beaver / Non-compliance ICP Filing），"
echo "   与证书无关，必须等 ICP 备案通过。"
echo "============================================================"
