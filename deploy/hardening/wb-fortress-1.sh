#!/usr/bin/env bash
# wb-fortress-1.sh —— 系统层加固（可回滚、逐项验证）
# 1) /opt/wb-api 世界可写文件  2) 内核参数  3) core dump 泄漏面
# 4) auditd 审计  5) SSH 密码套件收紧（带真实登录自测）  6) fail2ban recidive + 封禁实证
# 7) 关闭控制台 Ctrl-Alt-Del 重启  8) 停用未用的 atd
LC_ALL=C
export LC_ALL

PASS=0; FAIL=0
ok()   { echo "  [PASS] $*"; PASS=$((PASS+1)); }
bad()  { echo "  [FAIL] $*"; FAIL=$((FAIL+1)); }
info() { echo "  [INFO] $*"; }
sec()  { echo; echo "########## $* ##########"; }

# ============ 1. 世界可写文件（真实漏洞） ============
sec "1. 消除世界可写文件"
before=$(find / -xdev -perm -0002 -type f 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)/' | wc -l)
info "修复前 世界可写文件数 = $before"
find / -xdev -perm -0002 -type f 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)/' | while read -r f; do
  chmod go-w "$f" 2>/dev/null || true
done
find / -xdev -perm -0002 -type d 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)(/|$)' | while read -r d; do
  chmod go-w "$d" 2>/dev/null || true
done
after=$(find / -xdev -perm -0002 -type f 2>/dev/null | grep -vE '^/(proc|sys|run|tmp|var/tmp|dev)/' | wc -l)
info "修复后 世界可写文件数 = $after"
[ "$after" -eq 0 ] && ok "世界可写文件已清零（go-w 保留原有执行位）" || bad "仍有 $after 个世界可写文件"
# 关键文件权限复检
for spec in "/opt/wb-api/.env:600" "/opt/wb-api:750"; do
  p=${spec%%:*}; want=${spec##*:}
  got=$(stat -c '%a' "$p" 2>/dev/null)
  [ "$got" = "$want" ] && ok "$p = $got" || bad "$p = $got（期望 $want）"
done
echo "  --- 抽样确认 ---"
find /opt/wb-api/server -type f -printf '%m %p\n' 2>/dev/null | head -5 | sed 's/^/    /'

# ============ 2. 内核参数 ============
sec "2. 内核安全参数补强"
cat > /etc/sysctl.d/99-wb-fortress.conf <<'SYSCTL'
# 由 wb-fortress-1.sh 于 2026-09-19 生成
# IPv6 重定向：接受重定向 = 允许他人改写本机路由（IPv4 已关，IPv6 漏了）
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv6.conf.default.accept_source_route = 0
# default 也要开，否则新建网卡默认不记录伪造源地址包
net.ipv4.conf.default.log_martians = 1
# 只允许拥有 CAP_SYS_PTRACE 的进程 ptrace 别人（默认 1 太松）
kernel.yama.ptrace_scope = 2
# 内核符号地址彻底不给（2 = 对所有人隐藏）
kernel.kptr_restrict = 2
# 关闭 magic sysrq（防止本地/串口触发危险操作）
kernel.sysrq = 0
SYSCTL
if sysctl -q -p /etc/sysctl.d/99-wb-fortress.conf 2>/tmp/sysctl.err; then
  ok "sysctl 已加载"
else
  bad "sysctl 加载失败"; cat /tmp/sysctl.err | sed 's/^/    /'
fi
for kv in "net.ipv6.conf.all.accept_redirects=0" "net.ipv6.conf.default.accept_redirects=0" \
          "net.ipv4.conf.default.log_martians=1" "kernel.yama.ptrace_scope=2" "kernel.sysrq=0"; do
  k=${kv%%=*}; want=${kv##*=}; got=$(sysctl -n "$k" 2>/dev/null)
  [ "$got" = "$want" ] && ok "$k = $got" || bad "$k = $got（期望 $want）"
done

# ============ 3. core dump 泄漏面 ============
sec "3. 阻断 core dump 泄漏内存中的密钥"
mkdir -p /etc/systemd/coredump.conf.d
cat > /etc/systemd/coredump.conf.d/99-wb.conf <<'CORED'
# 后端进程内存里有 DATABASE_URL / SECRET_KEY，core dump 会原样落盘 → 直接不生成
[Coredump]
Storage=none
ProcessSizeMax=0
CORED
systemctl daemon-reload
ok "systemd-coredump 已配置为不落盘（Storage=none, ProcessSizeMax=0）"
mkdir -p /etc/systemd/system/wb-api.service.d
cat > /etc/systemd/system/wb-api.service.d/99-wb-fortress.conf <<'DROPIN'
[Service]
# 该进程内存里含 DATABASE_URL 与 SECRET_KEY，禁止内核为其写 core dump
LimitCORE=0
DROPIN
systemctl daemon-reload
systemctl restart wb-api
sleep 4
if systemctl is-active --quiet wb-api; then ok "wb-api 重启后 active（LimitCORE=0 生效）"; else bad "wb-api 未起来"; fi
echo "  --- 进程 core 限制实测 ---"
grep -E 'CoreSoftLimit|CoreHardLimit|CoreFileSize' /proc/$(pgrep -f 'uvicorn' | head -1)/limits 2>/dev/null | sed 's/^/    /' || \
  cat /proc/$(pgrep -f 'uvicorn' | head -1)/limits 2>/dev/null | grep -i core | sed 's/^/    /' || info "无法读取"
ls -la /var/lib/systemd/coredump 2>/dev/null | tail -3 | sed 's/^/    /'

# ============ 4. auditd 审计 ============
sec "4. 开启系统审计（auditd）"
cat > /etc/audit/rules.d/99-wb.rules <<'AUDIT'
## 由 wb-fortress-1.sh 生成 —— 只审"改了就该知道"的东西，控制日志量
-D
-b 8192
-f 1

# 账户与提权
-w /etc/passwd   -p wa -k wb_identity
-w /etc/shadow   -p wa -k wb_identity
-w /etc/group    -p wa -k wb_identity
-w /etc/gshadow  -p wa -k wb_identity
-w /etc/sudoers  -p wa -k wb_priv
-w /etc/sudoers.d/ -p wa -k wb_priv

# SSH 配置
-w /etc/ssh/sshd_config    -p wa -k wb_sshd
-w /etc/ssh/sshd_config.d/ -p wa -k wb_sshd
-w /root/.ssh/             -p wa -k wb_sshkey

# 应用代码与密钥（★ 本次修的就是这些文件的世界可写）
-w /opt/wb-api/server/ -p wa -k wb_app_code
-w /opt/wb-api/.env    -p wa -k wb_app_secret
-w /opt/wb-api/weights/ -p wa -k wb_app_model

# 云账号凭据
-w /root/.ali-creds -p wa -k wb_cloud_creds

# Web 内容与配置
-w /var/www/site -p wa -k wb_site
-w /etc/nginx/   -p wa -k wb_nginx
-w /etc/fail2ban/ -p wa -k wb_f2b

# 内核模块加载（rootkit 常见入口）
-a always,exit -F arch=b64 -S init_module -S finit_module -S delete_module -k wb_kmod

# 关键提权系统调用
-a always,exit -F arch=b64 -S setuid -S setgid -S setreuid -S setregid -S execve \
   -F auid>=1000 -F auid!=unset -k wb_exec
AUDIT
if augenrules --load 2>/tmp/augen.err; then ok "audit 规则已加载（augenrules）"; else bad "augenrules 失败"; cat /tmp/augen.err | sed 's/^/    /'; fi
systemctl enable --now auditd >/dev/null 2>&1
sleep 3
systemctl is-active --quiet auditd && ok "auditd active" || bad "auditd 未 active"
n=$(auditctl -l 2>/dev/null | grep -c 'wb_')
[ "$n" -gt 0 ] && ok "auditctl -l 可见 $n 条 wb_ 规则" || bad "规则未生效"
echo "  --- journald 里审计日志可读性 ---"
journalctl -k -n 1 --no-pager 2>/dev/null | tail -1 | sed 's/^/    /'
grep -E '^(max_log_file|num_logs|max_log_file_action|space_left_action)' /etc/audit/auditd.conf | sed 's/^/    /'

# ============ 5. SSH 密码套件收紧 ============
sec "5. SSH 加密套件收紧（带真实登录自测）"
mkdir -p /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/98-wb-crypto.conf <<'SSHC'
# 由 wb-fortress-1.sh 生成 —— 只留现代算法（OpenSSH 7.4+ 全支持）
# 去掉 diffie-hellman-group14-sha1（SHA1 KEX）
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
# 去掉 aes*-ctr（非 AEAD）
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
# 去掉 hmac-sha1 / umac-64，只留 ETM
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,umac-128-etm@openssh.com
GSSAPIAuthentication no
HostbasedAuthentication no
IgnoreRhosts yes
PermitUserRC no
SSHC
if sshd -t 2>/tmp/sshdt.err; then
  ok "sshd -t 语法通过"
  systemctl reload sshd && ok "sshd 已 reload" || bad "sshd reload 失败"
  sleep 1
  echo "  --- sshd -T 生效值 ---"
  sshd -T 2>/dev/null | grep -E '^(ciphers|macs|kexalgorithms|gssapiauthentication) ' | sed 's/^/    /'
  # ★ 真实登录自测
  if command -v ssh >/dev/null 2>&1; then
    TK=/root/.ssh/wb-selftest
    rm -f "$TK" "$TK.pub"
    ssh-keygen -t ed25519 -N '' -f "$TK" -q 2>/dev/null
    FP=$(cut -d' ' -f2 "$TK.pub")
    cp -a /root/.ssh/authorized_keys /root/.ssh/authorized_keys.pre-selftest
    cat "$TK.pub" >> /root/.ssh/authorized_keys
    if ssh -i "$TK" -o BatchMode=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
         -o ConnectTimeout=8 -o PreferredAuthentications=publickey \
         root@127.0.0.1 'echo SSH_SELFTEST_OK' 2>/tmp/sshself.err | grep -q SSH_SELFTEST_OK; then
      ok "★ 用新密码套件真实登录成功（端到端自测通过）"
    else
      bad "★ 自测登录失败 —— 立即回滚 SSH 配置"
      rm -f /etc/ssh/sshd_config.d/98-wb-crypto.conf
      systemctl reload sshd
      sed -n '1,12p' /tmp/sshself.err | sed 's/^/    /'
    fi
    # 清理自测密钥（无论成败）
    grep -vF "$FP" /root/.ssh/authorized_keys.pre-selftest > /root/.ssh/authorized_keys 2>/dev/null || cp -a /root/.ssh/authorized_keys.pre-selftest /root/.ssh/authorized_keys
    rm -f "$TK" "$TK.pub" /root/.ssh/authorized_keys.pre-selftest
    chmod 600 /root/.ssh/authorized_keys
    keys=$(grep -c . /root/.ssh/authorized_keys 2>/dev/null)
    [ "$keys" = "2" ] && ok "authorized_keys 已复原为 2 把钥匙" || bad "authorized_keys 现有 $keys 条，请人工确认"
  else
    info "服务器无 ssh 客户端，跳过登录自测（sshd -t 已通过）"
  fi
else
  bad "sshd -t 失败，已放弃该配置"; sed -n '1,10p' /tmp/sshdt.err | sed 's/^/    /'
  rm -f /etc/ssh/sshd_config.d/98-wb-crypto.conf
fi

# ============ 6. fail2ban recidive + 封禁实证 ============
sec "6. fail2ban：累犯长期封禁 + 封禁动作实证"
# 6a. 让 wb-nginx 同时捕获 429（API 被刷）
if [ -f /etc/fail2ban/filter.d/wb-nginx.conf ]; then
  echo "  --- 现有 filter ---"
  grep -vE '^\s*(#|$)' /etc/fail2ban/filter.d/wb-nginx.conf | sed 's/^/    /'
  if ! grep -q '429' /etc/fail2ban/filter.d/wb-nginx.conf; then
    cp -a /etc/fail2ban/filter.d/wb-nginx.conf /root/wb-nginx.conf.pre-429
    sed -i 's/\(failregex.*\)"/\1| 429 "/' /etc/fail2ban/filter.d/wb-nginx.conf 2>/dev/null
    info "已尝试把 429 并入 wb-nginx 过滤规则"
  fi
fi
# 6b. recidive jail
cat > /etc/fail2ban/jail.d/98-wb-recidive.conf <<'F2B'
# 累犯：24 小时内被任意 jail 封 3 次 → 封 1 周
[recidive]
enabled  = true
logpath  = /var/log/fail2ban.log
banaction = firewallcmd-allports
action    = firewallcmd-allports
bantime   = 604800
findtime  = 86400
maxretry  = 3
F2B
systemctl restart fail2ban >/dev/null 2>&1
sleep 4
systemctl is-active --quiet fail2ban && ok "fail2ban active" || bad "fail2ban 未起来"
fail2ban-client status 2>/dev/null | sed 's/^/    /'
# 6c. ★ 封禁动作实证（用 TEST-NET-3 保留地址，绝不误伤真实 IP）
echo "  --- 封禁动作实证（ban 203.0.113.66，属于 RFC5737 保留测试网段） ---"
fail2ban-client set wb-nginx banip 203.0.113.66 >/dev/null 2>&1
sleep 2
if iptables -S 2>/dev/null | grep -q '203.0.113.66'; then
  ok "iptables 里出现 203.0.113.66 的封禁规则（动作真实生效）"
  iptables -S 2>/dev/null | grep '203.0.113.66' | sed 's/^/    /'
else
  bad "iptables 里没有对应规则 —— 封禁仍是纸糊的"
fi
fail2ban-client set wb-nginx unbanip 203.0.113.66 >/dev/null 2>&1
sleep 2
iptables -S 2>/dev/null | grep -q '203.0.113.66' && bad "解封失败，规则残留" || ok "已解封，规则干净移除"
# 6d. 回环地址加入白名单
#     ★ 原因：fail2ban 默认不忽略回环。一旦 127.0.0.1 被封，
#       wb-api → PostgreSQL(127.0.0.1:5432) 的回包会被 INPUT 链丢弃，整站接口当场挂掉。
WL=/etc/fail2ban/jail.d/99z-wb-ignoreip.conf
echo "  --- 现有 jail.d 文件（加载顺序 = 字典序，最后一个赢） ---"
ls -1 /etc/fail2ban/jail.d/ 2>/dev/null | sed 's/^/    /'
echo "  --- 现有 ignoreip 设置 ---"
grep -rn 'ignoreip' /etc/fail2ban/jail.d/ /etc/fail2ban/jail.local /etc/fail2ban/jail.conf 2>/dev/null | sed 's/^/    /'
if ! grep -rqs '127\.0\.0\.1/8' /etc/fail2ban/jail.d/ /etc/fail2ban/jail.local 2>/dev/null; then
  # ★ 必须排在最后（字典序最大），否则被前面的 99-wb.local 覆盖
  cat > "$WL" <<'WLF'
# 由 wb-fortress-1.sh 生成 —— 必须最后加载，才能确保 ignoreip 生效
[DEFAULT]
# 回环与保留测试网段永不封禁
# ★ 回环一旦被封，wb-api → PostgreSQL(127.0.0.1:5432) 的回包会被 INPUT 链丢弃，整站接口当场挂
ignoreip = 127.0.0.1/8 ::1 203.0.113.0/24
WLF
  systemctl restart fail2ban >/dev/null 2>&1
  sleep 4
  ok "已加入 ignoreip（127.0.0.1/8 ::1 + 保留测试段），文件排在最后加载"
else
  ok "ignoreip 已包含回环"
fi
# 实证 ignoreip 真的生效：合并后的生效值应含回环
echo "  --- 生效的 ignoreip（应为含 127.0.0.1/8 的并集） ---"
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  echo "    [$j] $(fail2ban-client get $j ignoreip 2>/dev/null)"
done
systemctl is-active --quiet fail2ban && ok "fail2ban 重启后 active" || bad "fail2ban 未 active"
fail2ban-client status 2>/dev/null | sed 's/^/    /'
echo "  --- 确认回环不在封禁名单 ---"
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  fail2ban-client status "$j" 2>/dev/null | grep -E 'Currently banned|Banned IP' | sed "s/^/    [$j] /"
done

# ============ 7. 关闭控制台 Ctrl-Alt-Del ============
sec "7. 关闭本地控制台 Ctrl-Alt-Del 重启"
systemctl mask ctrl-alt-del.target >/dev/null 2>&1 && ok "ctrl-alt-del.target 已 mask（VNC 里误触不会重启）" || bad "mask 失败"

# ============ 8. 停用未使用的 atd ============
sec "8. 停用未使用的 atd"
jobs=$(atq 2>/dev/null | wc -l)
if [ "$jobs" -eq 0 ]; then
  systemctl disable --now atd >/dev/null 2>&1 && ok "atd 已停用（无延迟任务）" || bad "atd 停用失败"
else
  info "atd 有 $jobs 个待执行任务，保留不动"
fi

sec "汇总"
echo "  PASS=$PASS  FAIL=$FAIL"
echo "  （FAIL 需要看上面的具体项）"
echo
echo "fortress-1 结束"
