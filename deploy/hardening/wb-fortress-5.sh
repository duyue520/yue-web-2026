#!/usr/bin/env bash
# wb-fortress-5.sh —— 备份策略优化（排除可复现素材）+ wb-health 自检 + 看门狗
LC_ALL=C
export LC_ALL
ok()   { echo "  [PASS] $*"; }
bad()  { echo "  [FAIL] $*"; }
info() { echo "  [INFO] $*"; }
sec()  { echo; echo "########## $* ##########"; }

# ============ 1. 备份脚本 v2 ============
sec "1. 备份策略优化"
info "★ 上一版把 143MB 的 music/*.mp3 天天全量备（本地仓库里本来就有）→ 改为："
info "  日常 = db + 配置 + 后端代码 + 站点(排除 music)；每周 = 再加一份完整站点（含 music）"
cat > /usr/local/sbin/wb-backup.sh <<'BKEOF'
#!/usr/bin/env bash
# wb-backup.sh v2 —— 每日备份
#   daily : 数据库 + 配置 + 后端代码 + 站点(不含 music/*.mp3，该部分本地仓库可复现)
#   weekly: 再加一份完整站点（含 music）+ 数据库
# 注意：必须在可 chdir 的目录里跑（sudo -u postgres 会 chdir 到当前目录）
set -uo pipefail
cd / || exit 1
BK=/var/backups/wb
D=$(date +%Y%m%d-%H%M%S)
DOW=$(date +%u)              # 7 = 周日
LOG=/var/log/wb-backup.log
install -d -m 700 "$BK" "$BK/daily" "$BK/weekly"
log(){ echo "[$(date -Is)] $*" >> "$LOG"; }
DUMP="$BK/daily/db-$D.dump"

# 0) 磁盘水位保护：低于 2GB 可用就不做站点备份，避免把盘写满
AVAIL_MB=$(df -Pm / | awk 'NR==2{print $4}')
if [ "$AVAIL_MB" -lt 2048 ]; then
  log "!! 可用空间仅 ${AVAIL_MB}MB，跳过站点备份（数据库与配置照常）"
  SITE=0
else
  SITE=1
fi

# 1) 数据库
if sudo -u postgres pg_dump -Fc -d wb_campus > "$DUMP" 2>>"$LOG"; then
  chmod 600 "$DUMP"; log "pg_dump 成功：$(stat -c%s "$DUMP") 字节"
else
  log "!! pg_dump 失败"; rm -f "$DUMP"; exit 1
fi
# 2) 可读性校验（root 跑 -l，不连库）
if pg_restore -l "$DUMP" > /tmp/wb-dumplist.txt 2>>"$LOG"; then
  log "pg_restore -l 校验通过（$(grep -c '.' /tmp/wb-dumplist.txt) 行对象定义）"; rm -f /tmp/wb-dumplist.txt
else
  log "!! 备份不可解析，已删除"; rm -f "$DUMP"; exit 1
fi

# 3) 配置（含本次加固新增的所有配置）
tar czf "$BK/daily/conf-$D.tar.gz" \
  /etc/nginx /etc/letsencrypt/renewal /etc/letsencrypt/renewal-hooks \
  /opt/wb-api/.env /etc/ssh/sshd_config.d /etc/sysctl.d \
  /etc/fail2ban/jail.d /etc/fail2ban/filter.d /etc/audit/rules.d \
  /etc/systemd/coredump.conf.d /etc/logrotate.d/wb-backup \
  /etc/systemd/system/wb-api.service.d /etc/systemd/system/wb-backup.service \
  /etc/systemd/system/wb-backup.timer /etc/systemd/system/wb-traffic-guard.service \
  /etc/systemd/system/wb-traffic-guard.timer /etc/systemd/system/wb-watchdog.service \
  /etc/systemd/system/wb-watchdog.timer /usr/local/sbin/wb-backup.sh \
  /usr/local/sbin/wb-traffic-guard.sh /usr/local/bin/wb-health \
  2>/dev/null && log "配置备份成功"

# 4) 后端代码（排除 venv 与可复现的模型权重）
tar czf "$BK/daily/app-$D.tar.gz" -C /opt wb-api \
  --exclude='wb-api/venv' --exclude='wb-api/weights' --exclude='wb-api/**/__pycache__' \
  2>>"$LOG" && log "后端代码备份成功"

# 5) 站点（日常排除 music）
if [ "$SITE" = "1" ]; then
  tar czf "$BK/daily/site-$D.tar.gz" -C /var/www site --exclude='site/music' 2>>"$LOG" \
    && log "站点备份成功（不含 music，$(stat -c%s "$BK/daily/site-$D.tar.gz") 字节）"
fi

# 6) 每周：完整站点
if [ "$DOW" = "7" ] && [ "$SITE" = "1" ]; then
  tar czf "$BK/weekly/site-full-$D.tar.gz" -C /var/www site 2>>"$LOG" \
    && log "★ 每周完整站点备份成功（$(stat -c%s "$BK/weekly/site-full-$D.tar.gz") 字节）"
  cp -a "$DUMP" "$BK/weekly/" 2>/dev/null
fi

chmod 600 "$BK/daily/"* "$BK/weekly/"* 2>/dev/null
# 7) 保留策略：日常 7 天 / 周备数据库 5 周 / 周备完整站点 3 份
find "$BK/daily" -maxdepth 1 -type f -mtime +7 -delete 2>/dev/null
find "$BK/weekly" -maxdepth 1 -type f -name 'db-*' -mtime +35 -delete 2>/dev/null
ls -1t "$BK/weekly"/site-full-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f 2>/dev/null
log "完成 daily=$(ls -1 "$BK/daily" 2>/dev/null | wc -l) 文件  weekly=$(ls -1 "$BK/weekly" 2>/dev/null | wc -l) 文件  占用=$(du -sh "$BK" 2>/dev/null | cut -f1)"
BKEOF
chmod 700 /usr/local/sbin/wb-backup.sh
sh -n /usr/local/sbin/wb-backup.sh && ok "脚本语法通过" || bad "语法错误"
/usr/local/sbin/wb-backup.sh && ok "备份执行成功" || bad "备份失败"
tail -6 /var/log/wb-backup.log | sed 's/^/    /'
echo "  --- 产物 ---"
ls -lh /var/backups/wb/daily/ 2>/dev/null | sed 's/^/    /'
echo "  --- 总体占用 ---"
du -sh /var/backups/wb 2>/dev/null | sed 's/^/    /'
df -h / | tail -1 | sed 's/^/    磁盘: /'

# ============ 2. wb-health 一行自检 ============
sec "2. wb-health —— 一条命令看全站健康"
cat > /usr/local/bin/wb-health <<'HLTHEOF'
#!/usr/bin/env bash
# wb-health —— 一屏查看网站与服务器健康状态
cd /
B=$(printf '\033[1m'); N=$(printf '\033[0m'); G=$(printf '\033[32m'); R=$(printf '\033[31m'); Y=$(printf '\033[33m')
st(){ if systemctl is-active --quiet "$1"; then echo "${G}active${N}"; else echo "${R}DOWN${N}"; fi; }
echo "${B}== 服务 ==${N}"
printf '  %-22s %s\n' nginx "$(st nginx)" wb-api "$(st wb-api)" postgresql "$(st postgresql)"
printf '  %-22s %s\n' fail2ban "$(st fail2ban)" firewalld "$(st firewalld)" auditd "$(st auditd)"
printf '  %-22s %s\n' wb-traffic-guard.timer "$(st wb-traffic-guard.timer)" wb-backup.timer "$(st wb-backup.timer)" wb-watchdog.timer "$(st wb-watchdog.timer)"

echo "${B}== 监听端口 ==${N}"
ss -lntp 2>/dev/null | awk 'NR>1{print "  "$4"  "$6}' | sort -u

echo "${B}== 站点自测 ==${N}"
for p in / /campus/ /qingming/ /salarycat/ /api/health; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  if [ "$c" = "200" ]; then printf '  %-16s %s200%s\n' "$p" "$G" "$N"; else printf '  %-16s %s%s%s\n' "$p" "$R" "$c" "$N"; fi
done

echo "${B}== 证书 ==${N}"
cr=/etc/nginx/ssl/heyiwei.tech/fullchain.pem
if [ -f "$cr" ]; then
  exp=$(openssl x509 -in "$cr" -noout -enddate 2>/dev/null | cut -d= -f2)
  days=$(( ( $(date -d "$exp" +%s) - $(date +%s) ) / 86400 ))
  if [ "$days" -gt 21 ]; then printf '  到期 %s（剩 %s 天）%s\n' "$exp" "$days" "$G"; else printf '  到期 %s（剩 %s 天）%s\n' "$exp" "$days" "$Y"; fi
  systemctl list-timers certbot-renew.timer --no-pager 2>/dev/null | sed -n 2p | awk '{print "  自动续期下次: "$1" "$2" "$3}'
fi

echo "${B}== 攻击拦截（今日）==${N}"
printf '  被 444 断连: %s 次\n' "$(grep -c ' 444 ' /var/log/nginx/access.log 2>/dev/null || echo 0)"
printf '  被 429 限流: %s 次\n' "$(grep -c ' 429 ' /var/log/nginx/access.log 2>/dev/null || echo 0)"
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  printf '  %-16s 当前封禁 %s\n' "$j" "$(fail2ban-client status $j 2>/dev/null | awk -F'\t' '/Currently banned/{print $2}')"
done

echo "${B}== 审计 ==${N}"
if systemctl is-active --quiet auditd; then
  printf '  auditd %senabled=%s pid=%s 规则=%s 条%s\n' "$G" "$(auditctl -s 2>/dev/null | awk '/^enabled/{print $2}')" "$(auditctl -s 2>/dev/null | awk '/^pid/{print $2}')" "$(auditctl -l 2>/dev/null | grep -c wb_)" "$N"
else
  printf '  auditd %s未运行%s\n' "$R" "$N"
fi

echo "${B}== 资源 ==${N}"
free -m | awk 'NR==2{printf "  内存 用 %sMB / 共 %sMB（可用 %sMB）\n",$3,$2,$7}'
df -h / | awk 'NR==2{printf "  磁盘 %s 已用 / %s（%s）%s\n",$3,$2,$5,$6}'
printf '  负载 %s\n' "$(cut -d' ' -f1-3 /proc/loadavg)"

echo "${B}== 流量与备份 ==${N}"
if [ -f /var/lib/wb-traffic/state ]; then
  . /var/lib/wb-traffic/state 2>/dev/null
  tx=$(cat /sys/class/net/eth0/statistics/tx_bytes 2>/dev/null)
  used=$(( (tx - ${base_tx:-0}) / 1048576 ))
  printf '  本月已用 %s MB / 免费额度 20480 MB（%s%%）\n' "$used" "$(( used * 100 / 20480 ))"
  [ -f /var/lib/wb-traffic/stopped ] && printf '  %s⚠ 流量守卫已停站%s\n' "$R" "$N" || printf '  流量守卫正常（未停站）\n'
fi
last=$(ls -1t /var/backups/wb/daily/db-*.dump 2>/dev/null | head -1)
[ -n "$last" ] && printf '  最近数据库备份: %s（%s）\n' "$(basename "$last")" "$(stat -c%y "$last" | cut -d. -f1)"
printf '  备份占用: %s\n' "$(du -sh /var/backups/wb 2>/dev/null | cut -f1)"
[ -f /var/log/wb-watchdog.log ] && tail -2 /var/log/wb-watchdog.log | sed 's/^/  看门狗: /'

echo "${B}== 待重启 ==${N}"
if command -v needs-restarting >/dev/null 2>&1; then
  needs-restarting -r >/dev/null 2>&1 && echo "  无需重启（已装齐安全更新）" || echo "  ⚠ 有更新待重启生效"
fi
HLTHEOF
chmod 755 /usr/local/bin/wb-health
bash /usr/local/bin/wb-health > /tmp/h.out 2>&1 && ok "wb-health 可执行" || bad "wb-health 报错"
echo "  --- 输出预览 ---"
head -26 /tmp/h.out | sed 's/^/    /'

# ============ 3. 看门狗 ============
sec "3. 看门狗（每 5 分钟自检，异常自动恢复并记账）"
cat > /usr/local/sbin/wb-watchdog.sh <<'WDEOF'
#!/usr/bin/env bash
# wb-watchdog.sh —— 每 5 分钟自检；网站或接口异常则尝试恢复；带冷却，避免重启风暴
cd / || exit 1
LOG=/var/log/wb-watchdog.log
COOL=/var/lib/wb-watchdog.cooldown
log(){ echo "[$(date -Is)] $*" >> "$LOG"; }

# 流量守卫主动停站时不要跟它对着干
[ -f /var/lib/wb-traffic/stopped ] && exit 0

check(){ curl -s -o /dev/null -w '%{http_code}' -k --max-time 10 "https://127.0.0.1$1" -H 'Host: heyiwei.tech'; }

# 1) 静态站
c=$(check /)
if [ "$c" != "200" ]; then
  log "静态站 / 返回 $c → 尝试 reload/restart nginx"
  systemctl reload nginx 2>>"$LOG" || systemctl restart nginx 2>>"$LOG"
  sleep 3
  log "恢复后 / 返回 $(check /)"
fi

# 2) 后端接口（带 30 分钟冷却，防止重启风暴）
c=$(check /api/health)
if [ "$c" != "200" ]; then
  now=$(date +%s)
  last=0; [ -f "$COOL" ] && last=$(cat "$COOL" 2>/dev/null || echo 0)
  if [ $(( now - last )) -gt 1800 ]; then
    log "接口 /api/health 返回 $c → 重启 wb-api"
    systemctl restart wb-api >>"$LOG" 2>&1
    echo "$now" > "$COOL"
    sleep 6
    log "恢复后 /api/health 返回 $(check /api/health)"
  else
    log "接口 /api/health 仍返回 $c（冷却中，$((1800-(now-last)))s 后再试）"
  fi
fi

# 3) 日志不要无限长
if [ -f "$LOG" ] && [ "$(stat -c%s "$LOG")" -gt 1048576 ]; then
  tail -500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
WDEOF
chmod 700 /usr/local/sbin/wb-watchdog.sh
cat > /etc/systemd/system/wb-watchdog.service <<'S'
[Unit]
Description=wb 站点看门狗
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/wb-watchdog.sh
S
cat > /etc/systemd/system/wb-watchdog.timer <<'T'
[Unit]
Description=wb 看门狗定时器（每 5 分钟）
[Timer]
OnBootSec=3min
OnUnitActiveSec=5min
[Install]
WantedBy=timers.target
T
cat > /etc/logrotate.d/wb-watchdog <<'LR'
/var/log/wb-watchdog.log {
    weekly
    rotate 8
    compress
    missingok
    notifempty
    create 600 root root
}
LR
systemctl daemon-reload
systemctl enable --now wb-watchdog.timer >/dev/null 2>&1
systemctl is-active --quiet wb-watchdog.timer && ok "wb-watchdog.timer 已启用" || bad "timer 未启用"
echo "  --- 手动跑一次做功能验证 ---"
/usr/local/sbin/wb-watchdog.sh
if [ -f /var/log/wb-watchdog.log ]; then
  info "看门狗日志: $(wc -l < /var/log/wb-watchdog.log) 行（无输出=站点一直正常，这是期望结果）"
  tail -3 /var/log/wb-watchdog.log | sed 's/^/    /'
else
  ok "站点与接口均正常，看门狗未触发任何动作（期望结果）"
fi
echo "  --- 验证它能发现异常：临时把 nginx 停 3 秒，看它是否自动拉起 ---"
ORIG=$(systemctl is-active nginx)
systemctl stop nginx >/dev/null 2>&1
sleep 1
/usr/local/sbin/wb-watchdog.sh
sleep 1
now=$(systemctl is-active nginx)
[ "$now" = "active" ] && ok "★ nginx 被停后，看门狗自动拉活了（$ORIG → $now）" || bad "看门狗未能自动恢复（$now）"
tail -3 /var/log/wb-watchdog.log | sed 's/^/    /'
echo "  --- 站点最终自测 ---"
for p in / /campus/ /api/health; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  [ "$c" = "200" ] && ok "GET $p → 200" || bad "GET $p → $c"
done

sec "汇总"
echo "  以上 [FAIL] 项需要再处理；其余已确认"
