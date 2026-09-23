#!/bin/bash
set -u
T=198.51.100.7
echo "### 1. 执行封禁"
fail2ban-client set wb-nginx banip $T 2>&1 | sed 's/^/  /'
sleep 3

echo
echo "### 2. iptables 里是否出现该 IP（firewalld 最终落到 iptables/nftables）"
iptables -S 2>/dev/null | grep -c "$T" | sed 's/^/  iptables 命中条数: /'
iptables -S 2>/dev/null | grep "$T" | head -4 | sed 's/^/    /'
nft list ruleset 2>/dev/null | grep -c "$T" | sed 's/^/  nftables 命中条数: /'

echo
echo "### 3. 各 zone 的 rich rule"
firewall-cmd --list-all-zones 2>/dev/null | grep -B3 -A3 "rich rules" | grep -v "^--$" | head -30 | sed 's/^/  /'
echo "  -- 直接查 public zone --"
firewall-cmd --zone=public --list-rich-rules 2>/dev/null | sed 's/^/    /'

echo
echo "### 4. fail2ban 日志里的 action 报错"
grep -iE "wb-nginx|ERROR|WARNING" /var/log/fail2ban.log 2>/dev/null | tail -12 | sed 's/^/  /'

echo
echo "### 5. 解封并确认清理干净"
fail2ban-client set wb-nginx unbanip $T 2>&1 | sed 's/^/  /'
sleep 2
iptables -S 2>/dev/null | grep -c "$T" | sed 's/^/  解封后残留: /'
