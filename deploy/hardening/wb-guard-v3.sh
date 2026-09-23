#!/usr/bin/env bash
# wb-guard-v3 —— ①熔断器改用 iptables 只计「公网出网字节」②阈值回 20GB ③恢复被误停的 nginx
#
# 事故复盘（2026-09-23）：
#   v2 用 eth0 tx_bytes 总量计数，把阿里云内部流量（100.100.x.x：云助手/审计/备份代理）全算了进去，
#   9/20~9/23 累计 ~1.08GB 触发 1GB 阈值 → 09:03 自动停 nginx（误停 2.5 小时）。
#   而 9 月真实计费公网流量仅 0.0947GB（¥0.076），且 CDT 20GB 免费额度已生效。
#   根因：计数口径与计费口径不一致。
LC_ALL=C
export LC_ALL

echo "===== 1. 恢复被误停的 nginx ====="
rm -f /var/lib/wb-traffic/stopped
systemctl start nginx
sleep 1
echo -n "  nginx: "; systemctl is-active nginx

echo
echo "===== 2. 写入 v3 熔断器（只计公网出网字节）====="
cp -a /usr/local/sbin/wb-traffic-guard.sh /usr/local/sbin/wb-traffic-guard.sh.v2.bak 2>/dev/null
cat > /usr/local/sbin/wb-traffic-guard.sh <<'GEOF'
#!/bin/bash
# 月公网出网流量熔断 v3 —— 只统计「公网目的地址」的出网字节，与阿里云计费口径对齐
# v2 的教训：eth0 tx_bytes 含内部流量，9/23 误停站点 2.5 小时
# 阈值：WB_LIMIT_MB / WB_WARN_MB（整数 MB）> WB_LIMIT_GB / WB_WARN_GB > 默认 20GB / 15GB
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
CHAIN=WBPUB_TX

mkdir -p "$STATE_DIR"

# ---- 公网出网计数链（幂等自愈；firewalld reload 后会自动重建并重置基线）----
new_chain=0
if ! iptables -nL "$CHAIN" >/dev/null 2>&1; then
  iptables -N "$CHAIN"
  new_chain=1
fi
if [ "$(iptables -nL "$CHAIN" 2>/dev/null | grep -c RETURN)" -lt 5 ]; then
  iptables -F "$CHAIN"
  new_chain=1
fi
if [ "$new_chain" = 1 ]; then
  iptables -A "$CHAIN" -d 10.0.0.0/8     -j RETURN
  iptables -A "$CHAIN" -d 172.16.0.0/12  -j RETURN
  iptables -A "$CHAIN" -d 192.168.0.0/16 -j RETURN
  iptables -A "$CHAIN" -d 100.64.0.0/10  -j RETURN
  iptables -A "$CHAIN" -j RETURN
fi
iptables -C OUTPUT -j "$CHAIN" 2>/dev/null || iptables -I OUTPUT 1 -j "$CHAIN"

# 最后一条 catch-all RETURN 的字节计数 = 公网出网字节（私有网段在它之前就被 RETURN 掉了）
pub_bytes=$(iptables -vnL "$CHAIN" -x 2>/dev/null | awk '$3=="RETURN"' | tail -1 | awk '{print $2}')
[ -z "$pub_bytes" ] && pub_bytes=0

month=$(date +%Y-%m)
base_month=""; base_tx=""
[ -f "$STATE_F" ] && . "$STATE_F"

if [ "${base_month:-}" != "$month" ] || [ -z "${base_tx:-}" ] || [ "$new_chain" = 1 ]; then
  base_month=$month; base_tx=$pub_bytes
  printf 'base_month=%s\nbase_tx=%s\n' "$base_month" "$base_tx" > "$STATE_F"
  rm -f "$WARNF"
  echo "$(date '+%F %T') [RESET] 公网计数基线 $month pub_tx=$base_tx (chain_new=$new_chain)" >> "$LOG"
  if [ -f "$FLAG" ]; then
    systemctl start nginx 2>/dev/null && rm -f "$FLAG"
    echo "$(date '+%F %T') [RESUME] 已恢复 nginx" >> "$LOG"
  fi
fi

used=$(( pub_bytes - base_tx )); [ "$used" -lt 0 ] && used=0
used_mb=$(( used / 1048576 ))
eth_tx=$(cat /sys/class/net/eth0/statistics/tx_bytes 2>/dev/null || echo 0)

if [ "$used_mb" -ge "$LIMIT_MB" ] && [ ! -f "$FLAG" ]; then
  systemctl stop nginx 2>/dev/null || true
  touch "$FLAG"
  echo "$(date '+%F %T') [STOP] 本月公网出网 ${used_mb}MB 达上限 ${LIMIT_MB}MB，已停 nginx，次月自动恢复。手动恢复：systemctl start nginx && rm -f $FLAG" >> "$LOG"
elif [ "$used_mb" -ge "$WARN_MB" ] && [ ! -f "$WARNF" ]; then
  touch "$WARNF"
  echo "$(date '+%F %T') [WARN] 本月公网出网 ${used_mb}MB 已超警戒线 ${WARN_MB}MB" >> "$LOG"
fi

printf 'iface=%s\nmonth=%s\npub_bytes=%s\nused_bytes=%s\nused_mb=%s\nlimit_mb=%s\nwarn_mb=%s\nlimit_gb=%s\nwarn_gb=%s\neth_tx_total=%s\nnginx_stopped=%s\nupdated=%s\n' \
  "$iface" "$month" "$pub_bytes" "$used" "$used_mb" "$LIMIT_MB" "$WARN_MB" \
  "$(awk -v m="$LIMIT_MB" 'BEGIN{printf "%.2f", m/1024}')" \
  "$(awk -v m="$WARN_MB"  'BEGIN{printf "%.2f", m/1024}')" \
  "$eth_tx" \
  "$( [ -f "$FLAG" ] && echo yes || echo no )" "$(date '+%F %T')" > "$STATE_DIR/status"
GEOF
chmod 755 /usr/local/sbin/wb-traffic-guard.sh
bash -n /usr/local/sbin/wb-traffic-guard.sh && echo "  [PASS] v3 语法通过" || { echo "  [FAIL] 语法错误"; exit 1; }

echo
echo "===== 3. 阈值改回 20GB / 15GB（CDT 20GB 免费额度内 ¥0）====="
sed -i 's/^Environment=.*/Environment=WB_LIMIT_MB=20480\nEnvironment=WB_WARN_MB=15360/' /etc/systemd/system/wb-traffic-guard.service
grep -n Environment /etc/systemd/system/wb-traffic-guard.service
systemctl daemon-reload
systemctl restart wb-traffic-guard.timer

echo
echo "===== 4. 通过 systemd 真实跑一次 ====="
systemctl start wb-traffic-guard.service
sleep 1
cat /var/lib/wb-traffic/status
echo
echo "--- iptables 计数链 ---"
iptables -vnL WBPUB_TX -x | head -8
echo
echo "--- guard 日志尾部 ---"
tail -4 /var/log/wb-traffic-guard.log
echo
echo "===== 5. 最终检查 ====="
echo -n "nginx: "; systemctl is-active nginx
echo -n "wb-api: "; systemctl is-active wb-api
echo -n "stopped 标记: "; [ -f /var/lib/wb-traffic/stopped ] && echo "存在(异常!)" || echo "不存在(正常)"
