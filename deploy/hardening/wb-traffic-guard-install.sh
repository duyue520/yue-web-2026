#!/bin/bash
# wb-traffic-guard-install.sh —— 在 ECS 上安装「月出网流量熔断」守护
# 目的：保证公网出流量不超 CDT 免费额度（20GB/月），从而流量费恒为 0
set -e

cat > /usr/local/sbin/wb-traffic-guard.sh <<'GUARD'
#!/bin/bash
# 月出网流量熔断：超过 LIMIT_GB 就停 nginx，次月自动恢复。可用 WB_LIMIT_GB 覆盖。
set -u
STATE_DIR=/var/lib/wb-traffic
STATE_F=$STATE_DIR/state
LOG=/var/log/wb-traffic-guard.log
FLAG=$STATE_DIR/stopped
WARNF=$STATE_DIR/warned
LIMIT_GB=${WB_LIMIT_GB:-20}
WARN_GB=${WB_WARN_GB:-15}

mkdir -p "$STATE_DIR"

iface=$(ip route show default 2>/dev/null | awk '/default/ {print $5; exit}')
[ -z "$iface" ] && iface=eth0
tx=$(cat "/sys/class/net/$iface/statistics/tx_bytes" 2>/dev/null || echo 0)
month=$(date +%Y-%m)

base_month=""; base_tx=""
[ -f "$STATE_F" ] && . "$STATE_F"

if [ "${base_month:-}" != "$month" ] || [ -z "${base_tx:-}" ]; then
  base_month=$month; base_tx=$tx
  printf 'base_month=%s\nbase_tx=%s\n' "$base_month" "$base_tx" > "$STATE_F"
  rm -f "$WARNF"
  echo "$(date '+%F %T') [RESET] 新账期 $month 基线 tx=$tx iface=$iface" >> "$LOG"
  if [ -f "$FLAG" ]; then
    systemctl start nginx 2>/dev/null && rm -f "$FLAG"
    echo "$(date '+%F %T') [RESUME] 新账期已恢复 nginx" >> "$LOG"
  fi
fi

used=$(( tx - base_tx )); [ "$used" -lt 0 ] && used=0
used_mb=$(( used / 1048576 ))
limit_mb=$(( LIMIT_GB * 1024 ))
warn_mb=$(( WARN_GB * 1024 ))

if [ "$used_mb" -ge "$limit_mb" ] && [ ! -f "$FLAG" ]; then
  systemctl stop nginx 2>/dev/null || true
  touch "$FLAG"
  echo "$(date '+%F %T') [STOP] 本月出网 ${used_mb}MB 达上限 ${limit_mb}MB，已停 nginx，次月自动恢复。手动恢复：systemctl start nginx && rm -f $FLAG" >> "$LOG"
elif [ "$used_mb" -ge "$warn_mb" ] && [ ! -f "$WARNF" ]; then
  touch "$WARNF"
  echo "$(date '+%F %T') [WARN] 本月出网 ${used_mb}MB 已超警戒线 ${warn_mb}MB" >> "$LOG"
fi

printf 'iface=%s\nmonth=%s\nused_bytes=%s\nused_mb=%s\nlimit_gb=%s\nwarn_gb=%s\nnginx_stopped=%s\nupdated=%s\n' \
  "$iface" "$month" "$used" "$used_mb" "$LIMIT_GB" "$WARN_GB" \
  "$( [ -f "$FLAG" ] && echo yes || echo no )" "$(date '+%F %T')" > "$STATE_DIR/status"
GUARD
chmod 755 /usr/local/sbin/wb-traffic-guard.sh

cat > /usr/local/sbin/wb-traffic <<'ST'
#!/bin/bash
echo "=== 本月出网流量 ==="
if [ -f /var/lib/wb-traffic/status ]; then
  cat /var/lib/wb-traffic/status
else
  echo "尚未产生状态，等计时器首次运行（最多 10 分钟）"
fi
echo "=== 最近日志 ==="
tail -n 10 /var/log/wb-traffic-guard.log 2>/dev/null || echo "(暂无)"
ST
chmod 755 /usr/local/sbin/wb-traffic

cat > /etc/systemd/system/wb-traffic-guard.service <<'SVC'
[Unit]
Description=WB monthly egress traffic guard
After=network-online.target
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/wb-traffic-guard.sh
SVC

cat > /etc/systemd/system/wb-traffic-guard.timer <<'TMR'
[Unit]
Description=Run WB traffic guard every 10 minutes
[Timer]
OnBootSec=2min
OnUnitActiveSec=10min
Persistent=true
[Install]
WantedBy=timers.target
TMR

systemctl daemon-reload
systemctl enable --now wb-traffic-guard.timer >/dev/null 2>&1
sleep 2
/usr/local/sbin/wb-traffic-guard.sh
echo "=== 安装完成 ==="
echo -n "timer: "; systemctl is-active wb-traffic-guard.timer
/usr/local/sbin/wb-traffic
