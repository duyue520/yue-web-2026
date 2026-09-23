#!/bin/bash
# 在服务器上验证 04-domain-https.sh 生成的那段 HTTPS 配置是否真的能被 nginx 解析。
# 做法：自签证书 + 一次性配置副本（复制真实 nginx.conf 再插一行 include），
#       用 nginx -t -c 指向副本做语法校验。完全不触碰 /etc/nginx 下的生产配置。
set -u

T=/tmp/wb-ssl-test
rm -rf "$T"
mkdir -p "$T"

echo "=== 0. nginx 版本 ==="
nginx -v 2>&1

echo
echo "=== 1. 生成自签证书（仅用于语法校验，CN 用真实域名）==="
openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
  -keyout "$T/privkey.pem" -out "$T/fullchain.pem" \
  -subj "/CN=heyiwei.tech" >/dev/null 2>&1 \
  && echo "  ✓ $T/fullchain.pem" || { echo "  ✗ 证书生成失败"; exit 1; }

echo
echo "=== 2. 写入待验证的 443/80 配置（与脚本第 5 步同源，nginx 1.24 分支）==="
cat > "$T/10-https.conf" <<'EOF'
server {
    listen       80;
    listen       [::]:80;
    server_name  heyiwei.tech www.heyiwei.tech;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme;
        default_type "text/plain";
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  heyiwei.tech www.heyiwei.tech;
    root         /var/www/site;

    ssl_certificate     /tmp/wb-ssl-test/fullchain.pem;
    ssl_certificate_key /tmp/wb-ssl-test/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:wb_ssl:10m;
    ssl_session_timeout 1d;
    ssl_prefer_server_ciphers off;

    include /etc/nginx/default.d/site.conf;
}
EOF
echo "  已写入 $T/10-https.conf"

echo
echo "=== 3. 构造一次性 nginx.conf（真实配置 + 插入 include）==="
cp /etc/nginx/nginx.conf "$T/nginx.conf"
sed -i "s#^\( *\)include /etc/nginx/conf.d/\*\.conf;#\1include /etc/nginx/conf.d/*.conf;\n\1include $T/10-https.conf;#" "$T/nginx.conf"
echo "  插入结果："
grep -n "include" "$T/nginx.conf" | sed 's/^/    /'

echo
echo "=== 4. nginx -t 语法校验（指向副本，不碰生产）==="
if nginx -t -c "$T/nginx.conf" 2>&1; then
  echo "  ✓ 配置可被 nginx 正常解析"
  RC=0
else
  echo "  ✗ 配置解析失败 —— 上面的报错就是上线时会炸的地方"
  RC=1
fi

echo
echo "=== 5. 对照：确认生产配置本身没被改动 ==="
nginx -t 2>&1 | tail -2
echo "  conf.d 实际内容："
ls -la /etc/nginx/conf.d/

echo
echo "=== 6. 清理 ==="
rm -rf "$T"
echo "  已删除 $T（未在 /etc/nginx 留下任何文件）"
exit $RC
