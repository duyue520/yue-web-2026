#!/usr/bin/env bash
# wb-traffic-selftest.sh —— 验证改造后的熔断器"停站"路径仍然能走通
#
# 手法：把 STATE_DIR / LOG 重定向到 /tmp，并伪造一个"已用 2MB"的基线，
#       再用 WB_LIMIT_MB=1 触发停站。这样真实日志与状态文件**一点没被污染**，
#       但跑的是**真实的那个脚本**、nginx 也是**真的会被停**。
LC_ALL=C
export LC_ALL

echo "===== 1. 造一个隔离副本（只改 STATE_DIR / LOG 两行）====="
mkdir -p /tmp/wbtest
sed -e 's#^STATE_DIR=/var/lib/wb-traffic#STATE_DIR=/tmp/wbtest#' \
    -e 's#^LOG=/var/log/wb-traffic-guard.log#LOG=/tmp/wbtest/test.log#' \
    /usr/local/sbin/wb-traffic-guard.sh > /tmp/wbtest/copy.sh
grep -nE '^(STATE_DIR|LOG)=' /tmp/wbtest/copy.sh
echo "  [OK] 副本已生成"

echo
echo "===== 2. 伪造状态：本月已用 2MB ====="
tx=$(cat /sys/class/net/eth0/statistics/tx_bytes)
printf 'base_month=%s\nbase_tx=%s\n' "$(date +%Y-%m)" "$(( tx - 2097152 ))" > /tmp/wbtest/state
cat /tmp/wbtest/state

echo
echo "===== 3. 停站前 ====="
echo -n "  nginx: "; systemctl is-active nginx
echo -n "  真实 stopped 标记: "; [ -f /var/lib/wb-traffic/stopped ] && echo "存在" || echo "不存在"

echo
echo "===== 4. 用阈值 1MB 触发（真实脚本逻辑）====="
WB_LIMIT_MB=1 WB_WARN_MB=1 bash /tmp/wbtest/copy.sh
echo -n "  停站后 nginx: "; systemctl is-active nginx
echo "  隔离日志内容："; sed 's/^/    /' /tmp/wbtest/test.log
echo -n "  隔离 stopped 标记: "; [ -f /tmp/wbtest/stopped ] && echo "已生成（说明停站路径有效）" || echo "未生成（异常！）"

echo
echo "===== 5. 恢复并清理 ====="
systemctl start nginx
rm -f /tmp/wbtest/stopped /tmp/wbtest/state
sleep 1
echo -n "  nginx: "; systemctl is-active nginx

echo
echo "===== 6. 确认真实状态文件完全没被污染 ====="
cat /var/lib/wb-traffic/status
echo "  真实目录内容："; ls -1 /var/lib/wb-traffic/ | sed 's/^/    /'
echo -n "  真实 stopped 标记: "; [ -f /var/lib/wb-traffic/stopped ] && echo "存在(异常!)" || echo "不存在(正确)"
echo -n "  真实 guard 日志行数: "; wc -l < /var/log/wb-traffic-guard.log

rm -rf /tmp/wbtest
echo
echo "===== 7. 再通过 systemd 跑一次真实服务，确认回到正常值 ====="
systemctl start wb-traffic-guard.service
sleep 1
grep -E '^(limit_mb|warn_mb|used_mb|nginx_stopped)=' /var/lib/wb-traffic/status
echo -n "  nginx: "; systemctl is-active nginx
