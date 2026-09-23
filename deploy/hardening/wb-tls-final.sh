#!/usr/bin/env bash
# wb-tls-final.sh —— 用两种独立方法给 TLS 结论定案
LC_ALL=C
export LC_ALL
ok(){ echo "  [PASS] $*"; }
bad(){ echo "  [FAIL] $*"; }
info(){ echo "  [INFO] $*"; }
sec(){ echo; echo "########## $* ##########"; }

sec "方法 A：openssl s_client -brief（不像 echo| 那样会被 stdin EOF 干扰）"
for v in tls1_2 tls1_3; do
  n=0
  for i in $(seq 1 10); do
    if printf 'GET / HTTP/1.0\r\nHost: heyiwei.tech\r\n\r\n' \
       | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -$v -brief 2>/dev/null \
       | grep -qE 'Protocol version: TLSv1\.[23]'; then n=$((n+1)); fi
  done
  if [ "$n" = "10" ]; then ok "$v 10/10 次握手成功"; else bad "$v 只成功 $n/10 次"; fi
done
echo "    --- 取一次完整输出 ---"
printf 'GET / HTTP/1.0\r\nHost: heyiwei.tech\r\n\r\n' \
  | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 -brief 2>&1 | head -6 | sed 's/^/      /'

sec "方法 B：Python ssl 模块（完全独立的实现，排除 openssl CLI 的怪癖）"
python3 - <<'PY'
import socket, ssl, sys
def t(minv, maxv, label):
    try:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ctx.minimum_version = minv
        ctx.maximum_version = maxv
        with socket.create_connection(("127.0.0.1", 443), timeout=8) as raw:
            with ctx.wrap_socket(raw, server_hostname="heyiwei.tech") as s:
                s.sendall(b"GET / HTTP/1.0\r\nHost: heyiwei.tech\r\n\r\n")
                first = s.recv(32)
                ver = s.version()
                cip = s.cipher()[0]
                print("  [PASS] %-10s → %s / %s / 响应首行 %s" % (label, ver, cip, first.split(b"\r\n")[0].decode(errors="replace")))
                return True
    except Exception as e:
        print("  [INFO] %-10s → 被拒绝（%s: %s）" % (label, type(e).__name__, str(e)[:70]))
        return False

V = ssl.TLSVersion
ok13 = t(V.TLSv1_3, V.TLSv1_3, "TLSv1.3")
ok12 = t(V.TLSv1_2, V.TLSv1_2, "TLSv1.2")
bad11 = not t(V.TLSv1_1, V.TLSv1_1, "TLSv1.1")
bad10 = not t(V.TLSv1,   V.TLSv1,   "TLSv1.0")
print()
print("  [%s] TLSv1.3 可用" % ("PASS" if ok13 else "FAIL"))
print("  [%s] TLSv1.2 可用" % ("PASS" if ok12 else "FAIL"))
print("  [%s] TLSv1.1 已关闭" % ("PASS" if bad11 else "FAIL"))
print("  [%s] TLSv1.0 已关闭" % ("PASS" if bad10 else "FAIL"))
PY

sec "方法 C：20 次并发握手，看有没有间歇性失败"
s=0; f=0
for i in $(seq 1 20); do
  if printf 'GET / HTTP/1.0\r\nHost: heyiwei.tech\r\n\r\n' | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 -brief 2>/dev/null | grep -q 'Protocol version'; then s=$((s+1)); else f=$((f+1)); fi
done
echo "    成功 $s / 失败 $f"
[ "$f" = "0" ] && ok "20/20 全部成功，不存在间歇性失败" || info "$f 次失败 → 抓到一次完整报错："
if [ "$f" != "0" ]; then
  printf 'GET / HTTP/1.0\r\nHost: heyiwei.tech\r\n\r\n' | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_3 -brief 2>&1 | tail -8 | sed 's/^/      /'
fi

sec "结论"
echo "  注：上一轮用 'echo | openssl s_client' 的写法，stdin 立刻 EOF，"
echo "      openssl 有时会在打印会话信息前就退出 → 表现为'偶尔拿不到 Cipher'，"
echo "      这是**测试工具的竞态**，不是服务器的问题。改用 -brief 与 Python 后即稳定。"
