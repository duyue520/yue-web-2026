#!/bin/bash
echo "===== 1. nginx 版本与状态 ====="
nginx -v 2>&1; echo -n "active: "; systemctl is-active nginx

echo "===== 2. 配置文件清单 ====="
echo "-- conf.d --"; ls -1 /etc/nginx/conf.d/ 2>/dev/null
echo "-- snippets --"; ls -1 /etc/nginx/snippets/ 2>/dev/null

echo "===== 3. 限流/限连/限速 配置 ====="
grep -rn "limit_req\|limit_conn\|limit_rate" /etc/nginx/ 2>/dev/null | grep -v "^Binary"

echo "===== 4. 监听与 server_name ====="
grep -rn "listen \|server_name " /etc/nginx/conf.d/ /etc/nginx/nginx.conf 2>/dev/null

echo "===== 5. 安全响应头 ====="
grep -rn "add_header" /etc/nginx/snippets/ 2>/dev/null | head -20

echo "===== 6. 反扫描 / 危险方法 拦截 ====="
grep -rn "444\|deny\|map .*UA\|wb_bad_method\|return 40" /etc/nginx/conf.d/*.conf 2>/dev/null | head -25

echo "===== 7. 防火墙 ====="
firewall-cmd --state 2>/dev/null; firewall-cmd --list-all 2>/dev/null

echo "===== 8. fail2ban ====="
echo -n "active: "; systemctl is-active fail2ban 2>/dev/null
fail2ban-client status 2>/dev/null
fail2ban-client status sshd 2>/dev/null | head -12

echo "===== 9. SSH 加固实况 ====="
sshd -T 2>/dev/null | grep -E "^(permitrootlogin|passwordauthentication|maxauthtries|logingracetime|allowusers|x11forwarding|permitemptypasswords|kbdinteractiveauthentication)"

echo "===== 10. 内核参数 ====="
for k in net.ipv4.tcp_syncookies net.ipv4.conf.all.rp_filter net.ipv4.conf.all.send_redirects kernel.kptr_restrict kernel.dmesg_restrict; do
  printf '%-42s %s\n' "$k" "$(sysctl -n $k 2>/dev/null)"
done

echo "===== 11. 云盾 / 安骑士 ====="
pgrep -a AliYunDun 2>/dev/null | head -2
pgrep -a aliyun-service 2>/dev/null | head -2

echo "===== 12. 服务状态 ====="
for s in nginx wb-api postgresql fail2ban firewalld wb-traffic-guard.timer; do
  printf '%-24s %s\n' "$s" "$(systemctl is-active $s 2>/dev/null)"
done

echo "===== 13. 资源 ====="
free -m | head -2; df -h / | tail -1; uptime

echo "===== 14. 连接概况 ====="
ss -s
echo "-- 80/443 当前连接数 --"
ss -tn state established '( sport = :443 or sport = :80 )' 2>/dev/null | wc -l

echo "===== 15. 本月出网（熔断器）====="
cat /var/lib/wb-traffic/status 2>/dev/null
