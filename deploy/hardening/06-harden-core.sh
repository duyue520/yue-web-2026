#!/bin/bash
# ============================================================
#  06 —— 核心加固：SSH / firewalld / fail2ban / 内核
#
#  设计原则：
#   1. 每一项改动前都备份，改完立刻自检
#   2. SSH 改动带【自动回滚定时器】——10 分钟内没取消就自动还原，
#      这是防"把自己关在门外"的行业标准做法
#   3. 幂等：可重复执行
# ============================================================
set -uo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:$PATH

TS="$(date +%Y%m%d-%H%M%S)"
ADMIN_KEY_FILE="${ADMIN_KEY_FILE:-/root/.ssh/wb_deploy_ed25519.pub}"
WHITELIST_IP="${WHITELIST_IP:-127.0.0.1/8 ::1 172.25.123.64 223.160.113.95}"

step() { echo; echo "########## $* ##########"; }

# ============================================================
step "1 / 4  firewalld 收敛"
# ============================================================
echo "--- 改动前 ---"
firewall-cmd --list-all 2>/dev/null | sed 's/^/    /'

# cockpit(9090) 与 dhcpv6-client 都是用不到的默认放行项，去掉缩小攻击面
for svc in cockpit dhcpv6-client; do
  firewall-cmd --permanent --remove-service="$svc" >/dev/null 2>&1 \
    && echo "    ✓ 已移除无用服务: $svc" || echo "    · 本就未开启: $svc"
done
# 显式端口与 http/https/ssh 服务重复，保留服务、去掉端口（语义更清晰）
for port in 22/tcp 80/tcp 443/tcp; do
  firewall-cmd --permanent --remove-port="$port" >/dev/null 2>&1 \
    && echo "    ✓ 已移除重复端口规则: $port" || true
done
# 确保三个必要服务在
for svc in ssh http https; do
  firewall-cmd --permanent --add-service="$svc" >/dev/null 2>&1 && echo "    ✓ 确保放行: $svc"
done
firewall-cmd --reload >/dev/null 2>&1
echo "--- 改动后 ---"
firewall-cmd --list-all 2>/dev/null | sed 's/^/    /'

# ============================================================
step "2 / 4  内核参数（抗 SYN-flood / 反欺骗 / 内核加固）"
# ============================================================
SYSCTL_CONF=/etc/sysctl.d/99-wb-harden.conf
cat > "$SYSCTL_CONF" <<'EOF'
# ---- SYN flood / 连接洪水 ----
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_max_syn_backlog = 4096
net.core.somaxconn = 1024
net.core.netdev_max_backlog = 4096
net.ipv4.tcp_rfc1337 = 1

# ---- 本机不做路由器，关掉转发 ----
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# ---- 反 IP 欺骗 / 反 ICMP 重定向 ----
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.log_martians = 1

# ---- ICMP 滥用防护 ----
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1

# ---- 连接回收（释放 TIME_WAIT 占用） ----
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.ip_local_port_range = 10240 65000

# ---- 内核自身加固 ----
kernel.randomize_va_space = 2
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.sysrq = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.suid_dumpable = 0
fs.protected_fifos = 2
fs.protected_regular = 2
EOF

FAILED=""
while IFS= read -r line; do
  case "$line" in ''|\#*) continue ;; esac
  k="${line%%=*}"; v="${line#*=}"
  k="$(echo "$k" | xargs)"; v="$(echo "$v" | xargs)"
  [ -n "$k" ] || continue
  sysctl -w "$k=$v" >/dev/null 2>&1 || FAILED="$FAILED $k"
done < "$SYSCTL_CONF"

if [ -n "$FAILED" ]; then
  echo "    ⚠ 以下参数本内核不支持（已跳过，不影响其他项）:$FAILED"
else
  echo "    ✓ 全部内核参数已生效"
fi
echo "    抽检："
for k in net.ipv4.tcp_syncookies net.ipv4.conf.all.rp_filter net.ipv4.conf.all.send_redirects kernel.kptr_restrict; do
  printf "      %-40s = %s\n" "$k" "$(sysctl -n "$k" 2>/dev/null)"
done

# ============================================================
step "3 / 4  fail2ban（SSH 暴力破解自动封禁）"
# ============================================================
if ! command -v fail2ban-client >/dev/null 2>&1; then
  echo "    安装 fail2ban ..."
  dnf install -y fail2ban python3-systemd >/dev/null 2>&1 && echo "    ✓ 安装完成" || echo "    ✗ 安装失败"
fi
if command -v fail2ban-client >/dev/null 2>&1; then
  JB=/etc/fail2ban/jail.d/99-wb.local
  cat > "$JB" <<EOF
# 由 06-harden-core.sh 生成
[DEFAULT]
# 白名单：本机、内网、以及管理员自己的出口 IP（不要把自己封了）
ignoreip = $WHITELIST_IP
backend  = systemd
banaction = firewallcmd-rich-rules
banaction_allports = firewallcmd-allports
# 首次封 1 小时，再犯翻倍，最长 1 周
bantime  = 1h
findtime = 10m
maxretry = 4
bantime.increment = true
bantime.factor    = 2
bantime.maxtime   = 1w

[sshd]
enabled  = true
port     = 22
maxretry = 4
findtime = 10m
bantime  = 1d

[sshd-ddos]
enabled  = true
port     = 22
maxretry = 6
findtime = 1m
bantime  = 1h
EOF
  echo "    ✓ 已写入 $JB"
  systemctl enable fail2ban >/dev/null 2>&1
  systemctl restart fail2ban >/dev/null 2>&1
  sleep 4
  if systemctl is-active --quiet fail2ban; then
    echo "    ✓ fail2ban 运行中："
    fail2ban-client status 2>/dev/null | sed 's/^/      /'
    fail2ban-client status sshd 2>/dev/null | sed 's/^/      /'
  else
    echo "    ✗ fail2ban 未启动，最近日志："
    journalctl -u fail2ban -n 15 --no-pager 2>/dev/null | sed 's/^/      /'
  fi
else
  echo "    ✗ fail2ban 不可用，跳过"
fi

# ============================================================
step "4 / 4  SSH 加固（带自动回滚保险）"
# ============================================================
echo "--- 改动前 ---"
sshd -T 2>/dev/null | grep -iE '^(permitrootlogin|passwordauthentication|maxauthtries|x11forwarding|logingracetime|allowtcpforwarding)' | sed 's/^/    /'

cp -a /etc/ssh/sshd_config "/root/sshd_config.backup-$TS"
echo "    ✓ 已备份 /etc/ssh/sshd_config → /root/sshd_config.backup-$TS"

# 确保有一个可用的公钥，否则禁止密码登录会把自己锁死
if [ ! -s /root/.ssh/authorized_keys ]; then
  echo "    ✗ /root/.ssh/authorized_keys 为空！禁止密码登录会导致无法登录，已中止 SSH 部分。"
  exit 0
fi
echo "    ✓ authorized_keys 中有 $(grep -c . /root/.ssh/authorized_keys) 个公钥"
mkdir -p /root/.ssh && chmod 700 /root/.ssh && chmod 600 /root/.ssh/authorized_keys

HARDEN=/etc/ssh/sshd_config.d/99-wb-harden.conf
USE_INCLUDE=0
grep -qE '^\s*Include\s+/etc/ssh/sshd_config\.d/\*\.conf' /etc/ssh/sshd_config && USE_INCLUDE=1

if [ "$USE_INCLUDE" = 1 ]; then
  TARGET="$HARDEN"
else
  TARGET=/etc/ssh/sshd_config.wb-harden
fi

cat > "$TARGET" <<'EOF'
# ==== 由 06-harden-core.sh 生成的安全加固配置 ====
# 认证方式：只认密钥，彻底关掉密码（密码是暴力破解的唯一入口）
PermitRootLogin prohibit-password
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
# 拿不到密码，AuthenticationMethods 不必额外限定

# 暴破减速
MaxAuthTries 3
MaxSessions 4
MaxStartups 10:30:60
LoginGraceTime 20

# 减少无谓的转发与图形通道（缩小可被滥用的功能面）
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
PermitTunnel no

# 会话保活（同时踢掉挂死的连接，防占用）
ClientAliveInterval 300
ClientAliveCountMax 2
TCPKeepAlive no

# 登录时不反查 DNS（避免 DNS 被拖慢/污染导致登录卡顿）
UseDNS no

# 只允许 root 登录（本机没有其他业务账号）
AllowUsers root
EOF

if [ "$USE_INCLUDE" = 0 ]; then
  # 老式配置：直接追加到主配置
  if ! grep -q 'wb-harden' /etc/ssh/sshd_config; then
    printf '\nInclude /etc/ssh/sshd_config.wb-harden\n' >> /etc/ssh/sshd_config
  fi
fi
echo "    ✓ 已写入 $TARGET"

if ! sshd -t 2>/tmp/sshd-t.err; then
  echo "    ✗ sshd 配置校验失败，已回滚："
  sed 's/^/      /' /tmp/sshd-t.err
  rm -f "$TARGET"
  [ "$USE_INCLUDE" = 0 ] && sed -i '/wb-harden/d' /etc/ssh/sshd_config
  exit 1
fi
echo "    ✓ sshd -t 校验通过"

# ---------- 自动回滚保险：10 分钟后若未取消，自动还原 ----------
cat > /root/ssh-unharden.sh <<'EOF'
#!/bin/bash
# 自动回滚：把 SSH 加固配置撤掉
rm -f /etc/ssh/sshd_config.d/99-wb-harden.conf /etc/ssh/sshd_config.wb-harden
sed -i '/wb-harden/d' /etc/ssh/sshd_config
if sshd -t 2>/dev/null; then systemctl reload sshd; echo "$(date -Is) SSH 加固已自动回滚" >> /root/ssh-rollback.log; fi
EOF
chmod +x /root/ssh-unharden.sh
systemctl stop ssh-rollback.timer >/dev/null 2>&1
systemctl reset-failed ssh-rollback.service ssh-rollback.timer >/dev/null 2>&1
systemd-run --on-active=10min --unit=ssh-rollback /root/ssh-unharden.sh >/dev/null 2>&1 \
  && echo "    ✓ 已启动 10 分钟自动回滚保险（unit: ssh-rollback.timer）" \
  || echo "    ⚠ 自动回滚未启动（systemd-run 不可用），请人工确认后再断开"

systemctl reload sshd && echo "    ✓ sshd 已重载（当前会话不受影响）"

echo "--- 改动后 ---"
sshd -T 2>/dev/null | grep -iE '^(permitrootlogin|passwordauthentication|maxauthtries|x11forwarding|logingracetime|allowtcpforwarding|allowusers)' | sed 's/^/    /'

echo
echo "============================================================"
echo " 核心加固完成。"
echo " ⚠ 接下来必须【另开一个终端】验证还能不能 SSH 登录；"
echo "   确认能登录后执行： systemctl stop ssh-rollback.timer"
echo "   若登录不上：什么都不用做，10 分钟后自动还原。"
echo "============================================================"
