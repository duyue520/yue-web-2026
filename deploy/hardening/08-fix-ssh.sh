#!/bin/bash
# ============================================================
#  08 —— 修正 SSH 加固未生效的问题 + 修复 fail2ban jail
#
#  上一轮为什么没生效：
#    sshd 的配置是【先匹配先赢】（first-match-wins），不是后覆盖前。
#    06 脚本把 Include 追加到了 sshd_config 文件【末尾】，
#    而原文件第 147/148 行已经有 `PermitRootLogin yes` /
#    `PasswordAuthentication yes`，它们排在前面 → 胜出。
#    （MaxAuthTries / LoginGraceTime 生效了，因为原文件没显式设置它们。）
#
#  正确做法：① 把 Include 放到文件【最顶部】；② 同时就地改写主配置里的冲突行。
# ============================================================
set -uo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:$PATH

TS="$(date +%Y%m%d-%H%M%S)"
step() { echo; echo "########## $* ##########"; }

step "1 / 3  写入 sshd_config.d 加固片段并置顶 Include"
mkdir -p /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/99-wb-harden.conf <<'EOF'
# 由 08-fix-ssh.sh 生成 —— 只在密钥认证，彻底关闭密码登录
PermitRootLogin prohibit-password
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no

MaxAuthTries 3
MaxSessions 4
MaxStartups 10:30:60
LoginGraceTime 20

X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
PermitTunnel no

ClientAliveInterval 300
ClientAliveCountMax 2
TCPKeepAlive no
UseDNS no

AllowUsers root
EOF
echo "    ✓ /etc/ssh/sshd_config.d/99-wb-harden.conf"

cp -a /etc/ssh/sshd_config "/root/sshd_config.backup2-$TS"

# ① Include 置顶（这是关键）
if grep -qE '^\s*Include\s+/etc/ssh/sshd_config\.d/\*\.conf' /etc/ssh/sshd_config; then
  echo "    · Include 已存在，无需重复插入"
else
  sed -i '1i Include /etc/ssh/sshd_config.d/*.conf' /etc/ssh/sshd_config
  echo "    ✓ 已把 Include 插到 sshd_config 第 1 行"
fi

# ② 移除上一轮追加在末尾的无效 Include，并就地改掉冲突行
sed -i '\#^Include /etc/ssh/sshd_config\.wb-harden$#d' /etc/ssh/sshd_config
rm -f /etc/ssh/sshd_config.wb-harden
sed -i 's/^[[:space:]]*PermitRootLogin[[:space:]][[:space:]]*yes[[:space:]]*$/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^[[:space:]]*PasswordAuthentication[[:space:]][[:space:]]*yes[[:space:]]*$/PasswordAuthentication no/' /etc/ssh/sshd_config
echo "    ✓ 已就地改写主配置中的冲突行"

echo "    --- 关键行现状 ---"
grep -nE '^\s*(Include|PermitRootLogin|PasswordAuthentication)' /etc/ssh/sshd_config | sed 's/^/      /'

if ! sshd -t 2>/tmp/sshd-t2.err; then
  echo "    ✗ sshd -t 失败，回滚！"
  sed 's/^/      /' /tmp/sshd-t2.err
  cp -a "/root/sshd_config.backup2-$TS" /etc/ssh/sshd_config
  rm -f /etc/ssh/sshd_config.d/99-wb-harden.conf
  exit 1
fi
echo "    ✓ sshd -t 校验通过"

step "2 / 3  带自动回滚地重载 sshd"
cat > /root/ssh-unharden.sh <<'EOF'
#!/bin/bash
rm -f /etc/ssh/sshd_config.d/99-wb-harden.conf
sed -i '\#^Include /etc/ssh/sshd_config.d/\*\.conf$#d' /etc/ssh/sshd_config
sed -i 's/^PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
if sshd -t 2>/dev/null; then systemctl reload sshd; echo "$(date -Is) SSH 加固已自动回滚" >> /root/ssh-rollback.log; fi
EOF
chmod +x /root/ssh-unharden.sh
systemctl stop ssh-rollback.timer >/dev/null 2>&1
systemctl reset-failed ssh-rollback.service ssh-rollback.timer >/dev/null 2>&1
systemd-run --on-active=10min --unit=ssh-rollback /root/ssh-unharden.sh >/dev/null 2>&1 \
  && echo "    ✓ 10 分钟自动回滚保险已就位" || echo "    ⚠ 回滚保险未就位"

systemctl reload sshd && echo "    ✓ sshd 已重载"

echo "    --- 生效后的实际值（sshd -T）---"
sshd -T 2>/dev/null | grep -iE '^(permitrootlogin|passwordauthentication|pubkeyauthentication|maxauthtries|allowtcpforwarding|allowusers|x11forwarding|logingracetime)' | sed 's/^/      /'

step "3 / 3  修复 fail2ban 的 sshd-ddos jail"
# fail2ban 1.0.2 没有 filter.d/sshd-ddos，正确写法是复用 sshd 过滤器的 ddos 模式
sed -i 's#^\[sshd-ddos\]$#[sshd-ddos]\nfilter = sshd[mode=ddos]#' /etc/fail2ban/jail.d/99-wb.local
grep -A4 '\[sshd-ddos\]' /etc/fail2ban/jail.d/99-wb.local | sed 's/^/      /'
systemctl restart fail2ban >/dev/null 2>&1
sleep 5
if systemctl is-active --quiet fail2ban; then
  echo "    ✓ fail2ban 运行中，jail 列表："
  fail2ban-client status 2>/dev/null | sed 's/^/      /'
else
  echo "    ✗ fail2ban 未启动："
  journalctl -u fail2ban -n 12 --no-pager 2>/dev/null | sed 's/^/      /'
fi

echo
echo "============================================================"
echo " 完成。下一步必须实测验证："
echo "   1) 密钥登录仍可用（我会立刻用新连接验证）"
echo "   2) 密码登录被拒绝（用 PreferredAuthentications=password 探测）"
echo " 两项都通过后再取消回滚： systemctl stop ssh-rollback.timer"
echo "============================================================"
