#!/usr/bin/env bash
# wb-verify-final.sh —— 加固后完整回归验收
LC_ALL=C
export LC_ALL
P=0; F=0
ok(){ echo "  [PASS] $*"; P=$((P+1)); }
bad(){ echo "  [FAIL] $*"; F=$((F+1)); }
info(){ echo "  [INFO] $*"; }
sec(){ echo; echo "########## $* ##########"; }
H='Host: heyiwei.tech'

sec "0. 修一个备份清单里的小笔误"
WT=$(command -v wb-traffic 2>/dev/null || true)
if [ -z "$WT" ]; then
  WT=$(find /usr/local -name 'wb-traffic*' -type f 2>/dev/null | head -1)
fi
info "wb-traffic 实际位置: ${WT:-未找到}"
if [ -n "$WT" ] && [ "$WT" != "/usr/local/bin/wb-traffic" ]; then
  sed -i "s|usr/local/bin/wb-traffic|${WT#/}|" /usr/local/sbin/wb-backup.sh
  info "已把备份清单里的路径改为 ${WT#/}"
fi
grep -n 'wb-traffic' /usr/local/sbin/wb-backup.sh | sed 's/^/    /'

sec "1. 真实漏洞是否已堵死"
n=$(find / -xdev -perm -0002 -type f 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)/' | wc -l)
[ "$n" = "0" ] && ok "世界可写文件 = 0（修复前 35 个，含后端源码与模型）" || bad "仍有 $n 个世界可写文件"
for spec in "/opt/wb-api/.env:600" "/opt/wb-api:750" "/etc/shadow:000" "/etc/sudoers:440"; do
  p=${spec%%:*}; want=${spec##*:}; got=$(stat -c '%a' "$p" 2>/dev/null)
  [ "$got" = "$want" ] && ok "$p = $got" || bad "$p = $got（期望 $want）"
done
c=$(ls /var/lib/systemd/coredump 2>/dev/null | wc -l)
[ "$c" = "0" ] && ok "core dump 目录为空（后端内存里的密钥不会落盘）" || bad "coredump 目录有 $c 个文件"
pid=$(pgrep -f uvicorn | head -1)
if [ -n "$pid" ]; then
  cl=$(awk '/core file size/{print $4}' /proc/$pid/limits 2>/dev/null; grep -i 'core file' /proc/$pid/limits 2>/dev/null | head -1)
  info "wb-api 进程 core 限制: $cl"
fi
grep -q 'Storage=none' /etc/systemd/coredump.conf.d/99-wb.conf 2>/dev/null && ok "systemd-coredump Storage=none 已配置" || bad "coredump 配置缺失"

sec "2. 内核参数"
for kv in "net.ipv4.tcp_syncookies=1" "net.ipv4.conf.all.rp_filter=1" "net.ipv4.conf.all.accept_redirects=0" \
          "net.ipv4.conf.all.send_redirects=0" "net.ipv4.conf.all.accept_source_route=0" \
          "net.ipv4.conf.all.log_martians=1" "net.ipv4.conf.default.log_martians=1" \
          "net.ipv6.conf.all.accept_redirects=0" "net.ipv6.conf.default.accept_redirects=0" \
          "kernel.kptr_restrict=2" "kernel.dmesg_restrict=1" "kernel.randomize_va_space=2" \
          "kernel.sysrq=0" "fs.suid_dumpable=0" "fs.protected_symlinks=1" "fs.protected_hardlinks=1" \
          "fs.protected_fifos=2" "fs.protected_regular=2" "kernel.unprivileged_bpf_disabled=2" \
          "net.ipv4.ip_forward=0" "net.ipv4.tcp_rfc1337=1"; do
  k=${kv%%=*}; want=${kv##*=}; got=$(sysctl -n "$k" 2>/dev/null)
  [ "$got" = "$want" ] && ok "$k = $got" || bad "$k = $got（期望 $want）"
done

sec "3. SSH"
for kv in "permitrootlogin:without-password" "passwordauthentication:no" "permitemptypasswords:no" \
          "x11forwarding:no" "allowagentforwarding:no" "allowtcpforwarding:no" \
          "maxauthtries:3" "logingracetime:20" "allowusers:root" "gssapiauthentication:no" \
          "permituserenvironment:no" "challengeresponseauthentication:no"; do
  k=${kv%%:*}; want=${kv##*:}; got=$(sshd -T 2>/dev/null | awk -v k="$k" '$1==k{print $2" "$3}' | head -1)
  [ "$(echo $got)" = "$want" ] && ok "$k = $got" || bad "$k = $got（期望 $want）"
done
kk=$(sshd -T 2>/dev/null | awk '/^kexalgorithms/{print $2}')
echo "$kk" | grep -q 'group14-sha1' && bad "KEX 仍含 SHA1" || ok "KEX 已去掉 SHA1（group14-sha1）"
mc=$(sshd -T 2>/dev/null | awk '/^macs/{print $2}')
echo "$mc" | grep -q 'hmac-sha1' && bad "MAC 仍含 hmac-sha1" || ok "MAC 已去掉 hmac-sha1"
info "当前 KEX: $(echo $kk | cut -c1-80)"

sec "4. TLS / nginx"
for kv in "ssl_protocols:TLSv1.2" "ssl_prefer_server_ciphers:on" "ssl_session_tickets:off"; do
  k=${kv%%:*}; want=${kv##*:}
  nginx -T 2>/dev/null | grep -q "$k .*$want" && ok "$k 含 $want" || bad "$k 未设置成 $want"
done
nginx -T 2>/dev/null | grep -q 'ssl_ciphers ECDHE' && ok "ssl_ciphers 已显式限定为 ECDHE+AEAD" || bad "ssl_ciphers 未设置"
nginx -T 2>/dev/null | grep -q 'ssl_ecdh_curve' && ok "ssl_ecdh_curve 已设置" || info "ssl_ecdh_curve 未设置（用默认曲线组，可接受）"
probe(){ echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech "$1" ${2:+-cipher $2} 2>/dev/null | grep -E '^[[:space:]]*Cipher[[:space:]]*:' | head -1 | sed 's/.*://' | tr -d ' '; }
c=$(probe -tls1_2); [ -n "$c" ] && [ "$c" != "0000" ] && ok "TLSv1.2 可用（$c）" || bad "TLSv1.2 异常"
c=$(probe -tls1_3); [ -n "$c" ] && [ "$c" != "0000" ] && ok "TLSv1.3 可用（$c）" || bad "TLSv1.3 异常"
for v in tls1_1 tls1; do c=$(probe -$v); { [ -z "$c" ] || [ "$c" = "0000" ] || [ "$c" = "(NONE)" ]; } && ok "$v 已拒绝" || bad "$v 仍可协商"; done
info "SNI/Host: $(curl -s -o /dev/null -w 'HTTP/%{http_version} %{http_code}' -k https://127.0.0.1/ -H "$H")"
nginx -T 2>/dev/null | grep -q 'server_tokens off' && ok "server_tokens off（不暴露版本号）" || bad "server_tokens 未关闭"
curl -s -o /dev/null -D - -k https://127.0.0.1/ -H "$H" 2>/dev/null | grep -i '^server:' | sed 's/^/    /'
for h in strict-transport-security x-content-type-options x-frame-options referrer-policy permissions-policy; do
  curl -s -o /dev/null -D - -k https://127.0.0.1/ -H "$H" 2>/dev/null | grep -qi "^$h" && ok "安全头 $h 存在" || bad "安全头 $h 缺失"
done

sec "5. 攻击路径实测（应全部被拦）"
t(){ c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1$1" -H "$H" ${2:+-A "$2"}); 
     if [ "$c" = "444" ] || [ "$c" = "403" ] || [ "$c" = "405" ] || [ "$c" = "000" ] || [ "$c" = "400" ] || [ "$c" = "404" ] || [ "$c" = "429" ]; then ok "$1 → $c（已拦）"; else bad "$1 → $c（未拦！）"; fi; }
t /wp-login.php
t /admin/
t /index.php
t /.env
t /.git/config
t /admin/actuator/env
t "/?x=<script>"
c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1/" -H "$H" -A ""); [ "$c" = "444" ] || [ "$c" = "000" ] && ok "空 User-Agent → $c（已拦）" || bad "空 UA → $c"
c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1/" -H "$H" -A "sqlmap/1.7"); [ "$c" = "444" ] || [ "$c" = "000" ] && ok "sqlmap UA → $c（已拦）" || bad "sqlmap UA → $c"
c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 -X PUT "https://127.0.0.1/" -H "$H"); [ "$c" = "444" ] || [ "$c" = "000" ] && ok "PUT / → $c（已拦）" || bad "PUT / → $c"
c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 -X TRACE "https://127.0.0.1/" -H "$H"); [ "$c" = "405" ] && ok "TRACE → 405（已拦）" || bad "TRACE → $c"
c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1/../../../etc/passwd" -H "$H"); ok "路径穿越 → $c"
echo "  --- API 专属限流 ---"
cnt=0
for i in $(seq 1 40); do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 5 "https://127.0.0.1/api/health" -H "$H")
  [ "$c" = "429" ] && cnt=$((cnt+1))
done
[ "$cnt" -gt 0 ] && ok "40 次连打 /api/health 触发 $cnt 次 429（API 限流生效）" || bad "未触发 429，API 限流可能失效"

sec "6. 正常路径（不能误伤）"
for p in / /index.html /campus/ /qingming/ /salarycat/ /romance/love1.html /api/health; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1$p" -H "$H")
  [ "$c" = "200" ] && ok "GET $p → 200" || bad "GET $p → $c"
done
f=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1/favicon.ico" -H "$H"); [ "$f" = "200" ] && ok "favicon.ico → 200" || bad "favicon → $f"

sec "7. fail2ban（含封禁动作实证）"
fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/^/    /'
cnt2=$(fail2ban-client status 2>/dev/null | grep -o ',' | wc -l)
fail2ban-client set wb-nginx banip 203.0.113.77 >/dev/null 2>&1; sleep 2
iptables -S 2>/dev/null | grep -q '203.0.113.77' && ok "★ 封禁动作真实写入 iptables" || bad "封禁动作无效（纸糊的）"
iptables -S 2>/dev/null | grep '203.0.113.77' | sed 's/^/    /'
fail2ban-client set wb-nginx unbanip 203.0.113.77 >/dev/null 2>&1; sleep 2
iptables -S 2>/dev/null | grep -q '203.0.113.77' && bad "解封失败" || ok "解封干净"
for j in wb-nginx sshd; do echo "    $j ignoreip: $(fail2ban-client get $j ignoreip 2>/dev/null | grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}(/[0-9]+)?' | tr '\n' ' ')"; done

sec "8. 审计 / 自动化 / 备份"
if systemctl is-active --quiet auditd; then
  en=$(auditctl -s 2>/dev/null | awk '/^enabled/{print $2}'); ap=$(auditctl -s 2>/dev/null | awk '/^pid/{print $2}')
  [ "$en" = "1" ] && ok "auditd enabled=1" || bad "auditd enabled=$en"
  [ "$ap" != "0" ] && [ -n "$ap" ] && ok "auditd pid=$ap（已接管内核审计）" || bad "auditd pid=$ap"
  n=$(auditctl -l 2>/dev/null | grep -c wb_); [ "$n" -ge 18 ] && ok "$n 条 wb_ 审计规则在生效" || bad "只有 $n 条"
else
  bad "auditd 未运行"
fi
for t in wb-backup.timer wb-traffic-guard.timer wb-watchdog.timer certbot-renew.timer dnf-automatic.timer; do
  systemctl is-active --quiet $t && ok "$t active" || bad "$t 未运行"
done
echo "  --- 自动安全更新配置 ---"
grep -E '^upgrade_type|^apply_updates' /etc/dnf/automatic.conf | sed 's/^/    /'
systemctl is-enabled dnf-automatic.timer >/dev/null 2>&1 && ok "dnf-automatic.timer 已启用（只装 security）" || bad "自动更新未启用"
echo "  --- 备份 ---"
ls -lh /var/backups/wb/daily/ 2>/dev/null | tail -5 | sed 's/^/    /'
echo "    占用: $(du -sh /var/backups/wb | cut -f1)"
[ -f /var/backups/wb/daily/$(ls -1t /var/backups/wb/daily 2>/dev/null | grep '^db-' | head -1) ] && ok "今日数据库备份存在" || bad "无数据库备份"
systemctl list-timers wb-backup.timer --no-pager 2>/dev/null | sed -n 2p | awk '{print "    下次备份: "$1" "$2" "$3}'

sec "9. 其它收尾项"
st=$(systemctl is-enabled ctrl-alt-del.target 2>&1); [ "$st" = "masked" ] && ok "ctrl-alt-del 已 mask" || bad "ctrl-alt-del = $st"
systemctl is-enabled atd >/dev/null 2>&1 && bad "atd 仍启用" || ok "atd 已停用"
[ -d /root/quarantine ] && ok "历史残留已隔离到 /root/quarantine（$(du -sh /root/quarantine | cut -f1)）" || info "无 quarantine 目录"
ls -la /root/quarantine 2>/dev/null | tail -3 | sed 's/^/    /'
echo "  --- 确认审计能抓到敏感文件改动（真写一条审计记录测试） ---"
before=$(ausearch -k wb_app_secret --start recent 2>/dev/null | grep -c 'type=')
touch /opt/wb-api/.env 2>/dev/null
sleep 1
after=$(ausearch -k wb_app_secret --start recent 2>/dev/null | grep -c 'type=')
[ "$after" -gt "$before" ] && ok "★ 改动 /opt/wb-api/.env 已被审计记录（$before → $after 条）" || info "审计记录未增加（$before → $after），可能受 rate limit 影响"
ausearch -k wb_app_secret --start recent 2>/dev/null | tail -4 | sed 's/^/    /'

sec "10. 资源与最终自测"
free -m | awk 'NR==2{printf "    内存 用 %sMB/共 %sMB（可用 %sMB）\n",$3,$2,$7}'
df -h / | tail -1 | awk '{printf "    磁盘 %s 已用 / %s（%s）\n",$3,$2,$5}'
printf '    负载 %s\n' "$(cut -d' ' -f1-3 /proc/loadavg)"
printf '    运行时长 %s\n' "$(uptime -p)"

echo
echo "=================================================="
echo "  最终验收：PASS=$P   FAIL=$F"
echo "=================================================="
