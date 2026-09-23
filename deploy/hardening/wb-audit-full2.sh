#!/usr/bin/env bash
# 补充体检（只读）
LC_ALL=C
export LC_ALL
hr() { echo; echo "===== $* ====="; }

hr "A. sysctl 完整清单（关键项）"
sysctl -a 2>/dev/null | grep -E '^(kernel\.(core_pattern|core_uses_pid|yama|perf_event_paranoid|unprivileged_bpf_disabled|modules_disabled|panic_on_oops|sysrq|randomize_va_space)|fs\.(suid_dumpable|protected_symlinks|protected_hardlinks|protected_fifos|protected_regular|protect_suid|pipe-max-size)|net\.ipv4\.(tcp_(syncookies|rfc1337|max_syn_backlog|fin_timeout|keepalive_time|tw_reuse|timestamps|sack)|icmp_(echo_ignore_broadcasts|ignore_bogus_error_responses)|conf\.(all|default)\.(rp_filter|accept_redirects|send_redirects|secure_redirects|accept_source_route|log_martians|icmp_echo_ignore_all)|ip_forward)|net\.ipv6\.conf\.(all|default)\.(accept_ra|accept_redirects|accept_source_route)) ' | sort

hr "B. 账户清单"
echo "--- 全部账户（含 shell） ---"
awk -F: '{printf "%-22s uid=%-6s shell=%s\n",$1,$3,$7}' /etc/passwd
echo "--- uid=0 ---"
awk -F: '$3==0{print $1}' /etc/passwd
echo "--- 空/无口令 ---"
awk -F: '($2==""||$2=="!"||$2=="*"){print $1" -> "$2}' /etc/shadow | head -20
echo "--- wheel 组成员 ---"
getent group wheel
echo "--- wbapi 账户 ---"
getent passwd wbapi
echo "--- 最近成功登录 ---"
last -i -n 8 2>/dev/null

hr "C. /opt/wb-api 权限详情（世界可写统计）"
echo "世界可写文件数: $(find /opt/wb-api -type f -perm -0002 2>/dev/null | wc -l)"
echo "世界可写目录数: $(find /opt/wb-api -type d -perm -0002 2>/dev/null | wc -l)"
echo "总文件数: $(find /opt/wb-api -type f 2>/dev/null | wc -l)"
echo "权限分布:"
find /opt/wb-api -type f -printf '%m\n' 2>/dev/null | sort | uniq -c | sort -rn | head -10
echo "--- 抽样 10 个 ---"
find /opt/wb-api -type f -perm -0002 2>/dev/null | head -10 | xargs -r stat -c '%a %U:%G %n' 2>/dev/null
echo "--- venv 是否也在其中 ---"
echo "venv 里世界可写文件数: $(find /opt/wb-api/venv -type f -perm -0002 2>/dev/null | wc -l)"
echo "venv 外世界可写文件数: $(find /opt/wb-api -path /opt/wb-api/venv -prune -o -type f -perm -0002 -print 2>/dev/null | wc -l)"
echo "--- 目录权限 ---"
stat -c '%a %U:%G %n' /opt/wb-api /opt/wb-api/server /opt/wb-api/weights 2>/dev/null

hr "D. /root 里谁在读 .ali-creds"
grep -rl 'ali-creds' /root /usr/local/bin /usr/local/sbin /etc 2>/dev/null | head -10 || echo "(无引用)"
echo "--- .ali-creds 内容键名（值隐藏） ---"
sed -E 's/=.*/=<hidden>/' /root/.ali-creds 2>/dev/null | sed 's/^/   /'
echo "--- certbot 续期用的认证脚本 ---"
cat /etc/letsencrypt/renewal/heyiwei.tech.conf 2>/dev/null | grep -vE '^\s*(#|$)' | sed 's/^/   /'
ls -l /etc/letsencrypt/renewal-hooks/deploy/ 2>/dev/null | sed 's/^/   /'
echo "--- ali-dns-auth.sh 是否含明文密钥 ---"
grep -cE 'LTAI|AccessKeySecret' /root/ali-dns-auth.sh 2>/dev/null || echo 0
grep -cE 'source|\. /root/\.ali-creds' /root/ali-dns-auth.sh 2>/dev/null || echo 0

hr "E. /root 与服务器上的脚本是否含凭据"
for f in /root/*.sh /root/*.py; do
  [ -f "$f" ] || continue
  n=$(grep -cE 'LTAI[0-9A-Za-z]{10,}|AccessKeySecret|password\s*=' "$f" 2>/dev/null || echo 0)
  [ "$n" -gt 0 ] && echo "$f -> 命中 $n 处"
done
echo "--- bt-backup 内容（只列顶层） ---"
tar tzf /root/bt-backup-20260918.tar.gz 2>/dev/null | head -20
echo "--- bt-backup 里是否含凭据文件名 ---"
tar tzf /root/bt-backup-20260918.tar.gz 2>/dev/null | grep -iE 'pass|secret|key|cred|\.conf$|mysql|panel' | head -15 || echo "(无匹配)"

hr "F. nginx 运行身份与临时目录"
ps -o user=,pid=,cmd= -C nginx 2>/dev/null | head -5
nginx -V 2>&1 | head -3
nginx -T 2>/dev/null | grep -nE 'client_body_temp_path|proxy_temp_path|user |fastcgi_temp_path' | sort -u
echo "--- logrotate ---"
ls -1 /etc/logrotate.d/ 2>/dev/null
cat /etc/logrotate.d/nginx 2>/dev/null | head -15

hr "G. 系统审计能力"
rpm -q audit 2>/dev/null || echo "(未装 audit)"
systemctl is-active auditd 2>/dev/null
ls -1 /etc/audit/rules.d/ 2>/dev/null || echo "(无 audit rules.d)"
echo "--- AIDE / 完整性工具 ---"
rpm -q aide 2>/dev/null || echo "(未装 aide)"
command -v aide >/dev/null 2>&1 && echo "aide 存在" || echo "aide 不存在"
command -v rpm >/dev/null 2>&1 && echo "可用: rpm -Va（RPM 完整性校验）"

hr "H. 自动快照 / HBR 备份"
systemctl is-active hbrclient 2>/dev/null
ls -la /opt/hbr 2>/dev/null | head -5
ls -la /usr/local/hbr* 2>/dev/null | head -5
ps -o cmd= -C hbrclient 2>/dev/null
echo "--- 是否存在备份数据目录 ---"
find / -xdev -maxdepth 4 -type d -iname '*hbr*' 2>/dev/null | head -5
rpm -qa 2>/dev/null | grep -iE 'aliyun|hbr|assist|cloudmonitor' 

hr "I. HTTP 响应头实测（走 TLS）"
curl -s -o /dev/null -D - -k https://127.0.0.1/ -H 'Host: heyiwei.tech' 2>/dev/null | head -20 | sed 's/^/   /'

hr "J. 关键配置文件的权限"
for f in /etc/ssh/sshd_config /etc/passwd /etc/shadow /etc/group /etc/sudoers /etc/fstab /etc/crontab \
         /opt/wb-api/.env /root/.ali-creds /etc/nginx/nginx.conf /var/lib/pgsql/data/pg_hba.conf \
         /var/lib/pgsql/data/postgresql.conf; do
  [ -e "$f" ] && stat -c '%a %U:%G %n' "$f"
done
echo "--- /etc/ssh/sshd_config.d ---"
ls -la /etc/ssh/sshd_config.d/ 2>/dev/null

hr "K. 防火墙与安全组（服务器侧视图）"
iptables -L -n --line-numbers 2>/dev/null | head -40

hr "L. 磁盘 inode 与预留"
df -i 2>/dev/null | grep -vE 'tmpfs'
echo "--- 时间同步 ---"
chronyc tracking 2>/dev/null | head -5 || timedatectl 2>/dev/null | head -8

hr "M. 服务清单（非系统必需）"
systemctl list-unit-files --state=enabled --no-pager 2>/dev/null | grep -vE '^(systemd|dbus|getty|network|sshd|chronyd|crond|firewalld|rsyslog|auditd|irqbalance|kdump|mdmonitor|NetworkManager|tuned|sssd|nfs|rpc|gssproxy|lvm|microcode|dnf|dnf-makecache|raise-network|selinux|grub|kdump|kmod|plymouth|remote-fs|rsyslog|sshd-keygen|systemd-|user@|wb-|nginx|postgresql|fail2ban)' | head -30

echo
echo "===== 结束 ====="
