#!/usr/bin/env bash
# wb-traffic-retune.sh —— 把流量熔断阈值改到与"账户余额"匹配
#
# 为什么改：账单实测**带宽是按流量计费，0.8 元/GB**（计费项"流出流量"）,
# 而账户可用余额只有 **¥0.93** → 只够 **1.16 GB**。
# 原阈值 20GB（≈¥16）在这里等于没有保护：被打时 8Mbps 满速 ≈1MB/s，
# 约 **20 分钟**就能把余额跑成负数 → 欠费 → 实例被停。
#
# 改动：
#   ① guard 支持按 MB 设阈值（原来的写法只认整数 GB，设 0.5 会算错）
#   ② service 里设 WB_LIMIT_MB=1024 / WB_WARN_MB=512
#   ③ timer 从 10min 收紧到 2min（2min×8Mbps≈120MB 超调，10min 会超调 600MB）
LC_ALL=C
export LC_ALL

echo "===== 改造前：wb-traffic 长什么样 ====="
cat /usr/local/bin/wb-traffic 2>/dev/null || echo "(没有 wb-traffic)"
echo

echo "===== 写入新 wb-traffic-guard.sh（支持 MB 阈值，保留旧名兼容）====="
cp -a /usr/local/sbin/wb-traffic-guard.sh /usr/local/sbin/wb-traffic-guard.sh.pre-20260920
cat > /usr/local/sbin/wb-traffic-guard.sh <<'GEOF'
#!/bin/bash
# 月出网流量熔断：超过阈值就停 nginx，次月自动恢复。
# 阈值优先级：WB_LIMIT_MB / WB_WARN_MB（整数 MB）> WB_LIMIT_GB / WB_WARN_GB > 默认 20GB / 15GB
# ★ 2026-09-20：账户余额过低，service 里临时收紧到 1GB / 0.5GB，见该文件注释
set -u
STATE_DIR=/var/lib/wb-traffic
STATE_F=$STATE_DIR/state
LOG=/var/log/wb-traffic-guard.log
FLAG=$STATE_DIR/stopped
WARNF=$STATE_DIR/warned
LIMIT_GB=${WB_LIMIT_GB:-20}
WARN_GB=${WB_WARN_GB:-15}
LIMIT_MB=${WB_LIMIT_MB:-$(( LIMIT_GB * 1024 ))}
WARN_MB=${WB_WARN_MB:-$(( WARN_GB * 1024 ))}

mkdir -p "$STATE_DIR"

iface=$(ip route show default 2>/dev/null | awk '/default/ {print $5; exit}')
[ -z "$iface" ] && iface=eth0
tx=$(cat "/sys/class/net/$iface/statistics/tx_bytes" 2>/dev/null || echo 0)
month=$(date +%Y-%m)

base_month=""; base_tx=""
[ -f "$STATE_F" ] && . "$STATE_F"

# 跨月：重设基线，并在上月停过站时自动恢复
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

if [ "$used_mb" -ge "$LIMIT_MB" ] && [ ! -f "$FLAG" ]; then
  systemctl stop nginx 2>/dev/null || true
  touch "$FLAG"
  echo "$(date '+%F %T') [STOP] 本月出网 ${used_mb}MB 达上限 ${LIMIT_MB}MB，已停 nginx，次月自动恢复。手动恢复：systemctl start nginx && rm -f $FLAG" >> "$LOG"
elif [ "$used_mb" -ge "$WARN_MB" ] && [ ! -f "$WARNF" ]; then
  touch "$WARNF"
  echo "$(date '+%F %T') [WARN] 本月出网 ${used_mb}MB 已超警戒线 ${WARN_MB}MB" >> "$LOG"
fi

printf 'iface=%s\nmonth=%s\nused_bytes=%s\nused_mb=%s\nlimit_mb=%s\nwarn_mb=%s\nlimit_gb=%s\nwarn_gb=%s\nnginx_stopped=%s\nupdated=%s\n' \
  "$iface" "$month" "$used" "$used_mb" "$LIMIT_MB" "$WARN_MB" \
  "$(awk -v m="$LIMIT_MB" 'BEGIN{printf "%.2f", m/1024}')" \
  "$(awk -v m="$WARN_MB"  'BEGIN{printf "%.2f", m/1024}')" \
  "$( [ -f "$FLAG" ] && echo yes || echo no )" "$(date '+%F %T')" > "$STATE_DIR/status"
GEOF
chmod 755 /usr/local/sbin/wb-traffic-guard.sh
bash -n /usr/local/sbin/wb-traffic-guard.sh && echo "  [PASS] guard 语法通过" || echo "  [FAIL] 语法错误"

echo
echo "===== 写 timer（10min → 2min）/ service（阈值 1GB / 0.5GB）====="
cp -a /etc/systemd/system/wb-traffic-guard.timer   /etc/systemd/system/wb-traffic-guard.timer.pre-20260920
cp -a /etc/systemd/system/wb-traffic-guard.service /etc/systemd/system/wb-traffic-guard.service.pre-20260920
cat > /etc/systemd/system/wb-traffic-guard.timer <<'TEOF'
[Unit]
Description=Run WB traffic guard every 2 minutes
[Timer]
OnBootSec=1min
OnUnitActiveSec=2min
Persistent=true
[Install]
WantedBy=timers.target
TEOF
cat > /etc/systemd/system/wb-traffic-guard.service <<'SEOF'
[Unit]
Description=WB monthly egress traffic guard
After=network-online.target
[Service]
Type=oneshot
# ★ 临时收紧：账户余额 ¥0.93 ÷ 0.8元/GB = 只够 1.16GB。
#   充值后应把 WB_LIMIT_MB 改回 20480（20GB）、WB_WARN_MB 改回 15360（15GB）
Environment=WB_LIMIT_MB=1024
Environment=WB_WARN_MB=512
ExecStart=/usr/local/sbin/wb-traffic-guard.sh
SEOF
systemctl daemon-reload
systemctl restart wb-traffic-guard.timer
echo "  [PASS] daemon-reload + timer 已重启"

echo
echo "===== 立刻跑一次，确认新阈值生效 ====="
/usr/local/sbin/wb-traffic-guard.sh
echo "--- /var/lib/wb-traffic/status ---"
cat /var/lib/wb-traffic/status
echo
echo "===== 下次执行时间 ====="
systemctl list-timers wb-traffic-guard.timer --no-pager | head -3
echo
echo "===== 关键：nginx 必须还在跑（阈值 1GB 不能误停）====="
echo -n "nginx: "; systemctl is-active nginx
echo -n "站点标记 stopped: "; [ -f /var/lib/wb-traffic/stopped ] && echo "存在(异常!)" || echo "不存在(正常)"
