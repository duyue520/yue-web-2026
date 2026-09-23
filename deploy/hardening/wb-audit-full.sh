#!/usr/bin/env bash
# 全量安全体检（只读，不改任何配置）
# 用法：bash wb-audit-full.sh
LC_ALL=C
export LC_ALL

hr() { echo; echo "==================== $* ===================="; }

hr "0. 系统信息"
cat /etc/os-release 2>/dev/null | grep -E '^(NAME|VERSION)=' 
uname -r
echo "uptime: $(uptime -p 2>/dev/null)"
echo "time  : $(date -Is)"

hr "1. SSH 生效配置（sshd -T）"
sshd -T 2>/dev/null | grep -Ei '^(permitrootlogin|passwordauthentication|pubkeyauthentication|permitemptypasswords|x11forwarding|allowagentforwarding|allowtcpforwarding|maxauthtries|logingracetime|clientaliveinterval|clientalivecountmax|maxsessions|usepam|kbdinteractiveauthentication|challengeresponseauthentication|gssapiauthentication|permituserenvironment|allowusers|addressfamily|protocol|ciphers|macs|kexalgorithms) ' | sort
echo "--- 有效 AllowUsers/Port ---"
sshd -T 2>/dev/null | grep -Ei '^(port|allowusers|listenaddress) '

hr "2. 防火墙"
firewall-cmd --state 2>/dev/null
echo "--- default zone ---"
firewall-cmd --get-default-zone 2>/dev/null
echo "--- --list-all ---"
firewall-cmd --list-all 2>/dev/null
echo "--- 显式放行的其他 zone ---"
for z in $(firewall-cmd --get-zones 2>/dev/null); do
  if [ "$z" != "$(firewall-cmd --get-default-zone 2>/dev/null)" ]; then
    n=$(firewall-cmd --zone="$z" --list-all 2>/dev/null | grep -cE '^\s+(ports|services|rich rules)')
    [ "$n" -gt 0 ] && echo "[$z] $(firewall-cmd --zone=$z --list-all 2>/dev/null | tr '\n' '|')"
  fi
done

hr "3. 监听端口（全部）"
ss -lntup 2>/dev/null | sed 's/  */ /g'

hr "4. 内核安全参数（sysctl 实际值）"
for k in net.ipv4.tcp_syncookies net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter \
         net.ipv4.conf.all.accept_redirects net.ipv4.conf.all.send_redirects \
         net.ipv4.conf.all.accept_source_route net.ipv4.conf.all.log_martians \
         net.ipv4.icmp_echo_ignore_broadcasts net.ipv4.icmp_ignore_bogus_error_responses \
         kernel.kptr_restrict kernel.dmesg_restrict kernel.randomize_va_space \
         fs.protected_symlinks fs.protected_hardlinks fs.protected_fifos fs.protected_regular \
         kernel.yama.ptrace_scope kernel.sysrq kernel.core_pattern \
         net.ipv4.tcp_max_syn_backlog net.core.somaxconn \
         net.ipv6.conf.all.accept_redirects net.ipv6.conf.all.accept_source_route \
         kernel.unprivileged_bpf_disabled net.ipv4.ip_forward; do
  v=$(sysctl -n "$k" 2>/dev/null)
  [ -n "$v" ] && printf '%-52s = %s\n' "$k" "$v"
done

hr "5. 账户与提权面"
echo "--- 可登录 shell 的账户 ---"
awk -F: '$7 !~ /(nologin|false|sync|shutdown|halt)$/ {print $1" uid="$3" shell="$7}' /etc/passwd
echo "--- uid=0 账户 ---"
awk -F: '$3==0 {print $1}' /etc/passwd
echo "--- 空口令账户 ---"
awk -F: '($2==""){print $1}' /etc/shadow
echo "--- sudoers 摘要 ---"
grep -rhvE '^\s*(#|$)' /etc/sudoers /etc/sudoers.d/ 2>/dev/null
echo "--- authorized_keys ---"
for f in /root/.ssh/authorized_keys /home/*/.ssh/authorized_keys; do
  [ -f "$f" ] && echo "[$f] $(grep -c . "$f" 2>/dev/null) 条" && awk '{print "   " $1 " ... " $3}' "$f"
done
echo "--- sshd 登录失败 Top ---"
lastb -i 2>/dev/null | head -5

hr "6. SUID / SGID / 世界可写"
echo "--- SUID 非标准项（排除常见基线） ---"
find / -xdev -perm -4000 -type f 2>/dev/null | grep -vE '^/(usr/bin|usr/sbin|bin|sbin)/(passwd|chage|chsh|crontab|gpasswd|mount|newgrp|su|umount|sudo|pkexec|fusermount|fusermount3|unix_chkpwd|write|at|ssh-keysign|dbus-daemon-launch-helper|newuidmap|newgidmap|polkit-agent-helper-1|grub2-set-bootflag|vmware-user-suid-wrapper)$' | head -20
echo "--- SGID 非标准项 ---"
find / -xdev -perm -2000 -type f 2>/dev/null | grep -vE '^/(usr/bin|usr/sbin|bin|sbin|usr/lib|usr/libexec)/' | head -20
echo "--- 世界可写文件（排除 /proc /sys /run /tmp /var/tmp /dev） ---"
find / -xdev -perm -0002 -type f 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)/' | head -20
echo "--- 世界可写目录（排除 /tmp 等） ---"
find / -xdev -perm -0002 -type d 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)(/|$)' | head -20
echo "--- /tmp 挂载参数 ---"
findmnt -no OPTIONS /tmp 2>/dev/null || echo "(独立分区: 无)"

hr "7. nginx 关键配置（nginx -T 汇总）"
echo "--- server_tokens ---"
nginx -T 2>/dev/null | grep -n 'server_tokens' || echo "(未设置 → 默认 on，会暴露版本号)"
echo "--- ssl 指令 ---"
nginx -T 2>/dev/null | grep -nE 'ssl_protocols|ssl_ciphers|ssl_prefer_server_ciphers|ssl_session_cache|ssl_session_timeout|ssl_session_tickets|ssl_stapling|ssl_ecdh_curve' | sort -u
echo "--- 限流/限连 ---"
nginx -T 2>/dev/null | grep -nE 'limit_req_zone|limit_conn_zone|limit_req |limit_conn |limit_req_status|limit_conn_status' | sort -u
echo "--- 安全响应头 ---"
nginx -T 2>/dev/null | grep -nE 'add_header' | sort -u
echo "--- 请求体与超时 ---"
nginx -T 2>/dev/null | grep -nE 'client_max_body_size|client_body_timeout|client_header_timeout|send_timeout|keepalive_timeout|client_body_buffer_size|large_client_header_buffers|client_header_buffer_size'
echo "--- autoindex / 隐藏文件 ---"
nginx -T 2>/dev/null | grep -nE 'autoindex|deny all'
echo "--- 证书路径 ---"
nginx -T 2>/dev/null | grep -nE 'ssl_certificate'

hr "8. TLS 证书"
for d in /etc/letsencrypt/live/*/; do
  crt="$d/fullchain.pem"
  [ -f "$crt" ] || continue
  echo "[$crt]"
  openssl x509 -in "$crt" -noout -subject -issuer -dates 2>/dev/null | sed 's/^/   /'
  openssl x509 -in "$crt" -noout -ext subjectAltName 2>/dev/null | tail -1 | sed 's/^/   SAN:/'
done
echo "--- 续期定时器 ---"
systemctl list-timers --all 2>/dev/null | grep -iE 'certbot|renew' || echo "(无)"
certbot certificates 2>/dev/null | grep -E 'Certificate Name|Expiry|Domains' | sed 's/^/   /'

hr "9. fail2ban"
fail2ban-client status 2>/dev/null
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  echo "--- jail: $j ---"
  fail2ban-client status "$j" 2>/dev/null | grep -E 'Currently banned|Total banned|Banned IP|findtime|maxretry|action'
done
echo "--- iptables 里的 f2b 链 ---"
iptables -S 2>/dev/null | grep f2b || echo "(无 f2b 规则！)"
echo "--- nft (若用) ---"
nft list ruleset 2>/dev/null | grep -c 'f2b' || true

hr "10. 自动安全更新"
rpm -q dnf-automatic 2>/dev/null || echo "(dnf-automatic 未安装)"
echo "--- dnf-automatic.conf（有效项） ---"
grep -vE '^\s*(#|$)' /etc/dnf/automatic.conf 2>/dev/null | sed 's/^/   /'
systemctl is-enabled dnf-automatic.timer 2>/dev/null
echo "--- 已安装但需重启的内核/库 ---"
if command -v needs-restarting >/dev/null 2>&1; then
  needs-restarting -r >/dev/null 2>&1 && echo "无需重启" || echo "⚠ 需要重启以完成更新"
fi
echo "--- 当前内核 vs 已安装内核 ---"
echo "running: $(uname -r)"
rpm -q kernel --last 2>/dev/null | head -3
echo "--- 最后安全更新记录 ---"
rpm -qa --last 2>/dev/null | head -5

hr "11. PostgreSQL"
sudo -u postgres psql -tAc "show listen_addresses; show ssl; show password_encryption; show port;" 2>/dev/null | sed 's/^/   /'
echo "--- pg_hba（非注释，掩码密码） ---"
grep -vE '^\s*(#|$)' /var/lib/pgsql/data/pg_hba.conf 2>/dev/null | sed 's/^/   /'
echo "--- 角色 ---"
sudo -u postgres psql -tAc "select rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin from pg_roles where rolname not like 'pg\_%';" 2>/dev/null | sed 's/^/   /'
echo "--- 库大小 ---"
sudo -u postgres psql -tAc "select datname, pg_size_pretty(pg_database_size(datname)) from pg_database where datistemplate=false;" 2>/dev/null | sed 's/^/   /'
echo "--- 表与行数 ---"
sudo -u postgres psql -d wb_campus -tAc "select relname, n_live_tup from pg_stat_user_tables order by n_live_tup desc limit 12;" 2>/dev/null | sed 's/^/   /'

hr "12. 应用（wb-api）"
systemctl is-active wb-api 2>/dev/null
systemctl show wb-api -p MemoryCurrent -p NRestarts -p ProtectSystem -p ProtectHome -p NoNewPrivileges -p PrivateTmp -p ReadWritePaths 2>/dev/null | sed 's/^/   /'
echo "--- .env 权限 ---"
ls -l /opt/wb-api/.env 2>/dev/null
stat -c '%a %U:%G %n' /opt/wb-api/.env 2>/dev/null
echo "--- .env 键名（值已隐藏） ---"
sed 's/=.*/=<hidden>/' /opt/wb-api/.env 2>/dev/null | sed 's/^/   /'
echo "--- /opt/wb-api 权限 ---"
stat -c '%a %U:%G %n' /opt/wb-api 2>/dev/null
echo "--- 后端暴露的文档端点 ---"
for p in /docs /redoc /openapi.json /api/docs /api/openapi.json; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  echo "   $p -> $code"
done
echo "--- /api/ 未授权访问抽查 ---"
for p in /api/health /api/auth/login /api/predict/health /api/guestbook; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  echo "   $p -> $code"
done
echo "--- CORS 回显测试 ---"
curl -s -o /dev/null -D - -k "https://127.0.0.1/api/health" -H 'Host: heyiwei.tech' -H 'Origin: https://evil.com' 2>/dev/null | grep -i 'access-control' | sed 's/^/   /' || echo "   (无 CORS 头)"
echo "--- 后端日志里的异常 ---"
journalctl -u wb-api -n 20 --no-pager 2>/dev/null | tail -20 | sed 's/^/   /'

hr "13. 站点文件"
echo "--- /var/www/site 权限概览 ---"
stat -c '%a %U:%G %n' /var/www/site 2>/dev/null
echo "世界可写文件数: $(find /var/www/site -type f -perm -0002 2>/dev/null | wc -l)"
echo "非 root 属主文件数: $(find /var/www/site ! -user root 2>/dev/null | wc -l)"
echo "--- 站点里是否混入敏感文件 ---"
find /var/www -type f \( -name '*.env' -o -name '*.key' -o -name '*.pem' -o -name '*.sql' -o -name '*.bak' -o -name '.git*' -o -name '*.log' -o -name 'id_rsa*' -o -name '*secret*' \) 2>/dev/null | head -20 || echo "(无)"
echo "--- 目录内容 ---"
ls -la /var/www/site 2>/dev/null | head -25

hr "14. 磁盘 / 内存 / 日志"
df -h 2>/dev/null | grep -vE 'tmpfs|overlay'
echo "--- 内存 ---"
free -m
echo "--- swap ---"
swapon --show 2>/dev/null || echo "(无 swap)"
echo "--- journal 占用 ---"
journalctl --disk-usage 2>/dev/null
echo "--- 大日志文件 Top5 ---"
du -ah /var/log 2>/dev/null | sort -rh | head -5
echo "--- nginx 日志大小 ---"
ls -lh /var/log/nginx/*.log 2>/dev/null

hr "15. 定时任务与备份"
echo "--- root crontab ---"
crontab -l 2>/dev/null || echo "(空)"
echo "--- /etc/cron.d ---"
ls -1 /etc/cron.d 2>/dev/null
echo "--- systemd timers ---"
systemctl list-timers --all --no-pager 2>/dev/null | head -20
echo "--- 是否存在备份文件 ---"
ls -lh /root/*.tar.gz /root/backup* /var/backups/* 2>/dev/null | head -10 || echo "(无备份文件)"
echo "--- 自动快照/备份服务 ---"
systemctl is-active hbrclient 2>/dev/null || echo "hbrclient 未运行"
rpm -qa 2>/dev/null | grep -iE 'hbr|backup' | head -5

hr "16. 流量守卫"
systemctl is-active wb-traffic-guard.timer 2>/dev/null
cat /var/lib/wb-traffic/state 2>/dev/null | sed 's/^/   /'
bash /usr/local/sbin/wb-traffic-guard.sh --dry-run 2>/dev/null | sed 's/^/   /' || echo "   (无 dry-run 支持)"
/usr/local/bin/wb-traffic 2>/dev/null | sed 's/^/   /' || echo "   (无 wb-traffic 命令)"

hr "17. 残留敏感物"
echo "--- /root 目录 ---"
ls -la /root 2>/dev/null | head -30
echo "--- 全盘搜密钥类文件（只列名） ---"
find /root /opt /home /srv /var/www -type f \( -name '*AccessKey*' -o -name '*.csv' -o -name '*credential*' -o -name '*secret*' -o -name '.ali-creds*' \) 2>/dev/null | head -20 || echo "(无)"
echo "--- 历史命令里是否含密钥 ---"
grep -riE 'LTAI|AccessKeySecret|aliyun_pk' /root/.bash_history 2>/dev/null | head -5 || echo "(无或不可读)"

hr "18. 容器/其他运行时"
command -v docker >/dev/null 2>&1 && docker ps 2>/dev/null || echo "(无 docker)"
command -v bt >/dev/null 2>&1 && echo "⚠ 宝塔仍存在" || echo "(无宝塔)"
command -v ttyd >/dev/null 2>&1 && echo "⚠ ttyd 存在" || echo "(无 ttyd)"

echo
echo "==================== 体检结束 ===================="
