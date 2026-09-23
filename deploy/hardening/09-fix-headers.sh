#!/bin/bash
# ============================================================
#  09 —— 修正 nginx 安全响应头"丢失"问题
#
#  现象：`curl -I https://heyiwei.tech/` 只看到 server: nginx，
#        看不到 X-Frame-Options / HSTS 等。
#
#  真因（nginx 的经典坑）：add_header 是【子块一旦自己写了 add_header，
#  父级的所有 add_header 全部失效】，不是叠加。
#    site.conf 里有 4 个 location 各自写了 add_header Cache-Control，
#    而 `/` 会内部重定向到 `/index.html`，正好命中 `location = /index.html`
#    → 这个 location 有自己的 add_header → 服务器级的 5 个安全头被丢弃。
#
#  修法：把安全头抽成 snippet，凡是写了 add_header 的地方都 include 一份。
# ============================================================
set -uo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:$PATH

TS="$(date +%Y%m%d-%H%M%S)"
SITECONF=/etc/nginx/default.d/site.conf
SNIP=/etc/nginx/snippets/wb-security-headers.conf
MARK_BEGIN="# >>> wb-security begin >>>"
MARK_END="# <<< wb-security end <<<"

echo "########## 1. 抽出安全响应头 snippet ##########"
mkdir -p /etc/nginx/snippets
cat > "$SNIP" <<'EOF'
# 由 09-fix-headers.sh 生成 —— 安全响应头统一定义处
# 注意：必须被 include 到每一个"自己写了 add_header"的 location 里，
#       否则 nginx 的 add_header 继承规则会让它们失效。
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options        "SAMEORIGIN" always;
add_header Referrer-Policy        "strict-origin-when-cross-origin" always;
add_header Permissions-Policy     "geolocation=(), microphone=(), camera=(), payment=()" always;
add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;
EOF
echo "    ✓ $SNIP"

echo
echo "########## 2. 服务器级：把内联的 5 行换成 include ##########"
cp -a "$SITECONF" "/root/site.conf.backup3-$TS"
echo "    ✓ 已备份 → /root/site.conf.backup3-$TS"

# 用 python 做精确文本处理，避免 sed 在跨行/特殊字符上出错
python3 - "$SITECONF" "$MARK_BEGIN" "$MARK_END" <<'PY'
import sys, re
path, mb, me = sys.argv[1], sys.argv[2], sys.argv[3]
src = open(path, encoding='utf-8').read()

# a) 服务器级内联的 add_header 全部换成一行 include
inline = re.compile(r'^add_header (?:X-Content-Type-Options|X-Frame-Options|Referrer-Policy|Permissions-Policy|Strict-Transport-Security)[^\n]*\n', re.M)
src, n1 = inline.subn('', src)
src = src.replace(mb + '\n', mb + '\ninclude /etc/nginx/snippets/wb-security-headers.conf;\n', 1)

# b) 每个自带 add_header 的 location，补一份 include（避免继承被截断）
lines = src.split('\n')
out, n2 = [], 0
for ln in lines:
    out.append(ln)
    if re.match(r'\s*add_header\s+Cache-Control', ln):
        out.append('    include /etc/nginx/snippets/wb-security-headers.conf;')
        n2 += 1
src = '\n'.join(out)

open(path, 'w', encoding='utf-8').write(src)
print("    移除了 %d 行内联安全头 -> 改为服务器级 include" % n1)
print("    为 %d 个自带 add_header 的 location 补上了 include" % n2)
PY

echo
echo "########## 3. 校验并重载 ##########"
if nginx -t 2>&1 | sed 's/^/    /'; then
  systemctl reload nginx && echo "    ✓ nginx 已重载"
else
  echo "    ✗ nginx -t 失败，回滚"
  cp -a "/root/site.conf.backup3-$TS" "$SITECONF"
  rm -f "$SNIP"
  nginx -t && systemctl reload nginx && echo "    ✓ 已回滚"
  exit 1
fi

echo
echo "########## 4. 验证：逐个位置都应看到 5 个安全头 ##########"
for p in / /index.html /campus/ /salarycat/ /img/campus.webp; do
  n=$(curl -sSI -m 8 --resolve heyiwei.tech:443:127.0.0.1 "https://heyiwei.tech$p" 2>/dev/null \
      | grep -ciE 'strict-transport-security|x-content-type-options|x-frame-options|referrer-policy|permissions-policy')
  printf "    %-22s 安全头数量 = %s %s\n" "$p" "$n" "$([ "$n" -ge 4 ] && echo '✓' || echo '✗ 缺失')"
done

echo
echo "    --- 首页完整响应头 ---"
curl -sSI -m 8 --resolve heyiwei.tech:443:127.0.0.1 https://heyiwei.tech/ 2>/dev/null | sed 's/^/      /'
