#!/bin/bash
# ============================================================
#  为域名开通 HTTPS
#
#  前提（缺一不可）：
#    1. 域名已在【国内持牌注册商】注册（否则无法实名认证 → 无法备案）
#    2. 域名已完成实名认证
#    3. 已在阿里云完成 ICP 备案 —— 未备案时阿里云在网络层 reset 请求，
#       Let's Encrypt 的 HTTP-01 校验也拿不到文件，证书签不下来
#    4. DNS A 记录已指向本机
#
#  用法：
#    LE_EMAIL=you@example.com bash 04-domain-https.sh heyiyiwei.tech www.heyiyiwei.tech
#
#  设计要点：
#    - 【只新增】配置，不碰 80 端口的默认 server → IP 直接访问继续可用
#    - 域名的 80 请求单独用 server_name 命中并 301 到 https，
#      因此「http://115.29.242.211/」不会被跳转、也不会撞上证书域名不匹配
#    - 幂等：重复执行会重新签发并覆盖
# ============================================================
set -euo pipefail

PRIMARY="${1:?用法: LE_EMAIL=you@x.com bash 04-domain-https.sh <主域名> [更多域名...]}"
shift
ALL_DOMAINS=("$PRIMARY" "$@")

PUBIP="${PUBIP:-115.29.242.211}"
WEBROOT="${WEBROOT:-/var/www/site}"
ACME_DIR=/var/www/acme
SSL_DIR="/etc/nginx/ssl/$PRIMARY"
LE_EMAIL="${LE_EMAIL:-}"
SITE_CONF=/etc/nginx/default.d/site.conf
HTTPS_CONF=/etc/nginx/conf.d/10-https.conf
ACME_HOME="$HOME/.acme.sh/acme.sh"

DOMAIN_ARGS=()
for d in "${ALL_DOMAINS[@]}"; do DOMAIN_ARGS+=(-d "$d"); done

echo "主域名  : $PRIMARY"
echo "全部域名: ${ALL_DOMAINS[*]}"
echo "本机公网: $PUBIP"
echo "站根目录: $WEBROOT"
echo

# ---------------- 0. 前置断言 ----------------
echo "########## 0. 前置检查 ##########"

[ -n "$LE_EMAIL" ] || { echo "✗ 未设置 LE_EMAIL（证书到期通知邮箱），中止"; exit 1; }

BAD=0
for d in "${ALL_DOMAINS[@]}"; do
  R="$(getent ahostsv4 "$d" 2>/dev/null | awk '{print $1}' | sort -u | tr '\n' ' ' || true)"
  if [ -z "$R" ]; then
    echo "  ✗ $d  无 A 记录 → 先去域名控制台加解析"
    BAD=1
  elif ! printf ' %s ' "$R" | grep -q " $PUBIP "; then
    echo "  ✗ $d  解析到 [$R]，不含 $PUBIP"
    BAD=1
  else
    echo "  ✓ $d -> $R"
  fi
done
[ "$BAD" = 0 ] || { echo; echo "DNS 未就绪，中止（改完解析等 TTL 生效再跑）。"; exit 1; }

echo "  ✓ DNS 全部指向本机"

# ---------------- 1. 备份 ----------------
echo
echo "########## 1. 备份现有 nginx 配置 ##########"
BK="/root/nginx-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BK" /etc/nginx/nginx.conf /etc/nginx/default.d /etc/nginx/conf.d 2>/dev/null || true
echo "  已备份 -> $BK"

# ---------------- 2. ACME 校验目录 ----------------
echo
echo "########## 2. 放行 ACME 校验路径（80 端口）##########"
mkdir -p "$ACME_DIR"
chown -R root:root "$ACME_DIR"

if grep -q 'acme-challenge' "$SITE_CONF" 2>/dev/null; then
  echo "  已配置过，跳过"
else
  cat >> "$SITE_CONF" <<'EOF'

# ACME HTTP-01 校验目录（Let's Encrypt / ZeroSSL 签发时读取）
location ^~ /.well-known/acme-challenge/ {
    root /var/www/acme;
    default_type "text/plain";
    allow all;
}
EOF
  echo "  已追加到 $SITE_CONF"
fi

nginx -t
systemctl reload nginx
echo "  nginx 已重载"

# ---------------- 3. 安装 acme.sh ----------------
echo
echo "########## 3. 安装 acme.sh ##########"
if [ -x "$ACME_HOME" ]; then
  echo "  已安装，尝试升级"
  "$ACME_HOME" --upgrade --auto-upgrade >/dev/null 2>&1 || true
else
  curl -fsSL https://get.acme.sh | sh -s email="$LE_EMAIL"
fi
# ZeroSSL 在国内偶有抽风，默认切到 Let's Encrypt
"$ACME_HOME" --set-default-ca --server letsencrypt >/dev/null
echo "  acme.sh 就绪：$("$ACME_HOME" --version 2>/dev/null | head -1)"

# ---------------- 4. 签发证书 ----------------
echo
echo "########## 4. 申请证书（webroot 模式）##########"
"$ACME_HOME" --issue --webroot "$ACME_DIR" "${DOMAIN_ARGS[@]}" --server letsencrypt

mkdir -p "$SSL_DIR"
"$ACME_HOME" --install-cert -d "$PRIMARY" \
  --key-file       "$SSL_DIR/privkey.pem" \
  --fullchain-file "$SSL_DIR/fullchain.pem" \
  --reloadcmd      "nginx -t && systemctl reload nginx"
echo "  证书已安装到 $SSL_DIR"
ls -la "$SSL_DIR"

# ---------------- 5. 写 443 server + 域名 80 跳转 ----------------
echo
echo "########## 5. 生成 nginx HTTPS 配置 ##########"

# nginx 1.25.1 起才有独立的 http2 指令；1.24 只能把 http2 写在 listen 参数里。
# 本机是 1.24.0，混用会导致 nginx -t 直接报 unknown directive。
NGX_VER="$(nginx -v 2>&1 | sed -n 's#.*nginx/\([0-9][0-9.]*\).*#\1#p')"
# 注意 sort -V -C 的语义：判断"是否已升序"，所以要把【下界】放前面。
# 写成 printf '%s\n1.25.1' 会把 1.24.0 判成 >=1.25.1（曾踩过，已单测）。
if printf '1.25.1\n%s\n' "$NGX_VER" | sort -V -C 2>/dev/null; then
  L443="    listen       443 ssl;"
  L443_6="    listen       [::]:443 ssl;"
  HTTP2_LINE="
    http2        on;"
  echo "  nginx $NGX_VER >= 1.25.1 → 使用独立 http2 指令"
else
  L443="    listen       443 ssl http2;"
  L443_6="    listen       [::]:443 ssl http2;"
  HTTP2_LINE=""
  echo "  nginx $NGX_VER < 1.25.1 → http2 写在 listen 参数里"
fi

SERVER_NAMES="$PRIMARY"
for d in "${ALL_DOMAINS[@]:1}"; do SERVER_NAMES="$SERVER_NAMES $d"; done

cat > "$HTTPS_CONF" <<EOF
# 由 04-domain-https.sh 生成 —— 域名 HTTPS + 80 跳转
# 注意：80 端口的【默认 server】（server_name _）仍然提供明文 HTTP，
#       所以 IP 直接访问不受影响；只有带域名 Host 的 80 请求会被跳转。

server {
    listen       80;
    listen       [::]:80;
    server_name  $SERVER_NAMES;

    # 证书续期的 ACME 校验必须走明文，不能跳转
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

    # 复用 80 端口那份 gzip / 缓存 / 限流策略，避免两边漂移
    include /etc/nginx/default.d/site.conf;

    # 确认站点正常后再打开 HSTS：一旦生效，浏览器会强制走 https，
    # 若证书出问题将无法回退到 http。首次上线建议先注释掉。
    # add_header Strict-Transport-Security "max-age=31536000" always;
}
EOF

echo "  已写入 $HTTPS_CONF"
nginx -t
systemctl reload nginx
echo "  nginx 已重载"

# ---------------- 6. 终检 ----------------
echo
echo "########## 6. 终检 ##########"
for d in "${ALL_DOMAINS[@]}"; do
  echo "  --- $d ---"
  echo -n "    http  -> "; curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "http://$d/" || true
  echo -n "    https -> "; curl -sS -o /dev/null -w '%{http_code}\n' "https://$d/" || true
  echo -n "    证书   -> "; echo | openssl s_client -connect "$d:443" -servername "$d" 2>/dev/null \
      | openssl x509 -noout -subject -dates 2>/dev/null | tr '\n' ' ' || echo "取证书失败"
  echo
done

echo "端口监听："
ss -lntp | grep -E ':(80|443)\b' || true
echo
echo "完成。证书每 60 天由 acme.sh 自动续期（已装 cron）。"
echo "若 https 返回错误，先看：tail -30 /var/log/nginx/error.log"
