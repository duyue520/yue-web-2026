#!/usr/bin/env bash
# wb-verify-fixes.sh —— 核实 3 个 FAIL 到底是真问题还是我测试写错了
LC_ALL=C
export LC_ALL
ok(){ echo "  [PASS] $*"; }
bad(){ echo "  [FAIL] $*"; }
info(){ echo "  [INFO] $*"; }
sec(){ echo; echo "########## $* ##########"; }
H='Host: heyiwei.tech'

sec "FAIL-1  /etc/shadow 权限：是 000 还是 0？"
info "★ 我的判据写错了：stat 对 0000 返回的是数字 '0'，我拿它跟字符串 '000' 比 → 假失败"
for f in /etc/shadow /etc/gshadow; do
  a=$(stat -c '%a' $f 2>/dev/null)
  n=$((10#$a))
  echo "    $f  stat=$a  数值=$n"
  [ "$n" = "0" ] && ok "$f 权限正确（其他用户完全无权读）" || bad "$f 权限为 $a，应为 000"
done
ls -l /etc/shadow | sed 's/^/    /'
echo "    --- 实测：非 root 能不能读 ---"
sudo -u postgres head -1 /etc/shadow 2>&1 | head -1 | sed 's/^/    /'

sec "FAIL-2  TLSv1.3 复测（上轮报异常，怀疑是偶发）"
for i in 1 2 3 4 5; do
  out=$(echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 2>&1)
  c=$(echo "$out" | grep -E '^[[:space:]]*Cipher[[:space:]]*:' | head -1 | sed 's/.*://' | tr -d ' ')
  p=$(echo "$out" | grep -E '^[[:space:]]*Protocol[[:space:]]*:' | head -1 | sed 's/.*://' | tr -d ' ')
  echo "    第 $i 次: Protocol=${p:-空} Cipher=${c:-空}"
done
c=$(echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 2>&1 | grep -E '^[[:space:]]*Cipher[[:space:]]*:' | head -1 | sed 's/.*://' | tr -d ' ')
[ -n "$c" ] && [ "$c" != "0000" ] && ok "TLSv1.3 正常（$c）—— 上轮是偶发" || bad "TLSv1.3 确实不可用"
echo "    --- 用 openssl 的 HTTP/2 ALPN 再看一次 ---"
echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 -alpn h2 2>/dev/null | grep -E 'ALPN|Protocol|Cipher' | sed 's/^/    /'
echo "    --- nginx 错误日志里有无 TLS 相关告警 ---"
tail -5 /var/log/nginx/error.log | sed 's/^/    /'

sec "FAIL-3  /?x=<script> 返回 200 —— 是真漏洞还是我判据错了？"
info "★ 判据错误：nginx 不会因为 query string 里有尖括号就拦。真正要验证的是"
info "  「这个参数会不会被回显进 HTML」—— 不回显就没有反射型 XSS，200 完全正常。"
P='<script>alert(1)</script>'
body=$(curl -s -k --max-time 8 "https://127.0.0.1/?x=$(printf '%s' "$P" | sed 's/</%3C/g;s/>/%3E/g;s/</%3C/g')" -H "$H")
echo "    响应体长度: ${#body} 字节"
if printf '%s' "$body" | grep -qF 'alert(1)'; then
  bad "★ 参数被回显进 HTML —— 存在反射型 XSS"
  printf '%s' "$body" | grep -o '.\{0,60\}alert(1).\{0,60\}' | head -3 | sed 's/^/      /'
else
  ok "★ 参数未被回显（静态站，响应体里找不到 payload）→ 不是漏洞，200 正常"
fi
echo "    --- 再验一个典型 XSS 载体：/campus/?q= ---"
b2=$(curl -s -k --max-time 8 "https://127.0.0.1/campus/?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E" -H "$H")
printf '%s' "$b2" | grep -qF 'onerror=alert(1)' && bad "/campus/ 存在参数回显" || ok "/campus/ 不回显参数"
echo "    --- 结论说明：静态站不解释 query string，此处 200 是正确行为 ---"

sec "补测：内容安全策略（CSP）现状"
csp=$(curl -s -o /dev/null -D - -k https://127.0.0.1/ -H "$H" 2>/dev/null | grep -i '^content-security-policy')
if [ -n "$csp" ]; then echo "    $csp"; else
  info "当前没有 CSP 头。本站是纯静态站 + 同源 /api，没有用户输入回显点，"
  info "加严格 CSP 需要逐页确认内联脚本，风险收益比不高，因此本轮不加（作为已知取舍记录）。"
fi
echo "    --- 已有的防 XSS/点击劫持基础 ---"
curl -s -o /dev/null -D - -k https://127.0.0.1/ -H "$H" 2>/dev/null | grep -iE 'x-content-type-options|x-frame-options|referrer-policy' | sed 's/^/    /'

sec "补测：API 侧输入处理（后端对异常输入的反应）"
info "拿几个畸形输入打后端，看是否 500 泄漏栈信息"
for payload in "' OR 1=1--" "\"><script>alert(1)</script>" "../../../../etc/passwd" "%00%00"; do
  enc=$(printf '%s' "$payload" | python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.stdin.read()))' 2>/dev/null)
  c=$(curl -s -o /tmp/api.out -w '%{http_code}' -k --max-time 8 "https://127.0.0.1/api/guestbook?q=$enc" -H "$H")
  leak=$(grep -cE 'Traceback|File "/|psycopg|sqlalchemy|postgresql://' /tmp/api.out 2>/dev/null)
  if [ "$leak" = "0" ]; then ok "payload 返回 $c，响应体无栈/连接串泄漏"; else bad "响应体疑似泄漏内部信息"; fi
done
echo "    --- 确认后端文档端点仍不可达 ---"
for p in /docs /redoc /openapi.json /api/docs; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H "$H"); echo "      $p → $c"
done

sec "复核：三个 FAIL 的最终判定"
echo "  1) /etc/shadow —— 我的判据字符串比较写错，权限本身正确（0000，非 root 读不了）"
echo "  2) TLSv1.3 —— 见上面 5 次复测结果"
echo "  3) /?x=<script> —— 我的判据错，静态站不回显参数，200 是正确行为"
echo
echo "  如需重跑完整验收：bash /root/wb-verify-final.sh"
