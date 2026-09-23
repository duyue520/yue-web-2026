#!/bin/bash
UA="Mozilla/5.0 (compatible; wb-check/1.0)"
echo "### 1. fail2ban wb-nginx jail 状态"
fail2ban-client status wb-nginx 2>&1
echo
echo "### 2. nginx 日志路径确认"
nginx -T 2>/dev/null | grep -c "access_log" | sed 's/^/  access_log 指令条数: /'
ls -l /var/log/nginx/access.log 2>&1 | sed 's/^/  /'

echo
echo "### 3. 最近的 444 记录（应为扫描器留下的）"
grep -c " 444 " /var/log/nginx/access.log 2>/dev/null | sed 's/^/  今日 444 条数: /'
grep " 444 " /var/log/nginx/access.log 2>/dev/null | tail -5 | cut -c1-140

echo
echo "### 4. 最近 429（接口限流）"
grep -c " 429 " /var/log/nginx/access.log 2>/dev/null | sed 's/^/  今日 429 条数: /'

echo
echo "### 5. 自己发 25 次扫描触发封禁测试"
for i in $(seq 1 25); do
  curl -sk -o /dev/null -m 5 "https://heyiwei.tech/wp-login.php" >/dev/null 2>&1
done
echo "  已发送 25 次 /wp-login.php"
sleep 8
fail2ban-client status wb-nginx 2>&1 | sed 's/^/  /'

echo
echo "### 6. 外网可达性复测（多国节点）"
RESP=$(curl -s -m 25 -A "$UA" -H 'Accept: application/json' \
  "https://check-host.net/check-http?host=https://heyiwei.tech/&max_nodes=4" 2>/dev/null)
RID=$(printf '%s' "$RESP" | sed -n 's/.*"request_id":"\([^"]*\)".*/\1/p')
if [ -n "$RID" ]; then
  sleep 15
  curl -s -m 25 -A "$UA" -H 'Accept: application/json' \
    "https://check-host.net/check-result/$RID" 2>/dev/null | tr '}' '}\n' | head -10
else
  echo "  提交失败: ${RESP:0:200}"
fi

echo
echo "### 7. 当前熔断器 / 服务状态"
cat /var/lib/wb-traffic/status 2>/dev/null
for s in nginx wb-api postgresql fail2ban firewalld wb-traffic-guard.timer; do
  printf '  %-24s %s\n' "$s" "$(systemctl is-active $s 2>/dev/null)"
done
