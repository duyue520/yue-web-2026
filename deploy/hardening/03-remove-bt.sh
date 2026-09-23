#!/bin/bash
# 彻底移除宝塔面板（BT-Panel v13.0.0）
# 原则：先断言站点不依赖 -> 先备份 -> 停服务 -> 迁 swap -> 清 cron/防火墙 -> 删目录 -> 终检
# 保留项：1GB swap（迁到 /swapfile），因为 2GB 内存的机器需要它
set -u
LOG=/root/remove-bt.log
: > "$LOG"
exec > >(tee -a "$LOG") 2>&1

echo "############ $(date) 移除宝塔开始 ############"

echo
echo "### 0. 前置断言"
# 注意：/var/www/site 里含 "/www" 子串，断言必须排除这种前缀，否则会误中止
if grep -rnE '(^|[^a-zA-Z0-9_.-])/www(/|$)' /etc/nginx/nginx.conf /etc/nginx/conf.d/ /etc/nginx/default.d/ 2>/dev/null; then
  echo "!! 中止：nginx 配置引用了 /www"
  exit 1
fi
echo "ok  nginx 未引用 /www（/var/www/site 已排除）"
if [ -n "$(ls -A /www/wwwroot 2>/dev/null)" ]; then
  echo "!! 中止：/www/wwwroot 非空，可能已有站点托管"
  ls -la /www/wwwroot
  exit 1
fi
echo "ok  /www/wwwroot 为空（无宝塔托管站点）"
echo "--- 删除前基线 ---"
df -h / | tail -1
free -m | head -2
curl -s -o /dev/null -w "  before: root=%{http_code}\n" http://127.0.0.1/

echo
echo "### 1. 备份宝塔配置 -> /root/bt-backup-$(date +%Y%m%d).tar.gz"
tar czf "/root/bt-backup-$(date +%Y%m%d).tar.gz" \
  /www/server/panel/data /www/server/panel/vhost /www/server/panel/ssl \
  /www/backup /etc/init.d/bt 2>/dev/null
ls -la /root/bt-backup-*.tar.gz

echo
echo "### 2. 停止并禁用宝塔自启"
/etc/init.d/bt stop 2>&1 | tail -5
systemctl disable bt 2>&1 | tail -2
systemctl stop bt 2>&1 | tail -2
pkill -f "BT-Panel" 2>/dev/null
pkill -f "BT-Task" 2>/dev/null
pkill -f "/www/server/panel" 2>/dev/null
sleep 4
echo "--- 第1次检查残留进程 ---"
ps aux | grep -iE "BT-Panel|BT-Task|/www/server" | grep -v grep || echo "(无)"
sleep 4
echo "--- 第2次检查（防看门狗拉起）---"
ps aux | grep -iE "BT-Panel|BT-Task|/www/server" | grep -v grep || echo "(无)"

echo
echo "### 3. 迁移 swap: /www/swap -> /swapfile（保留，2GB 机器需要）"
swapoff /www/swap 2>&1 || echo "(swapoff 提示可忽略)"
if [ -f /www/swap ]; then
  mv /www/swap /swapfile
  chmod 600 /swapfile
  echo "已移动 /www/swap -> /swapfile"
fi
sed -i 's|^/www/swap\s|/swapfile |' /etc/fstab
echo "--- fstab swap 行 ---"
grep -n swap /etc/fstab
swapon /swapfile 2>&1 || echo "(swapon 失败)"
echo "--- 当前 swap ---"
swapon --show

echo
echo "### 4. 清理宝塔 cron"
crontab -l 2>/dev/null | grep -v "/www/server/cron/" > /tmp/ct.new
if [ -s /tmp/ct.new ]; then crontab /tmp/ct.new; else crontab -r 2>/dev/null; fi
echo "--- 剩余 crontab ---"
crontab -l 2>&1 || echo "(空)"

echo
echo "### 5. 移除宝塔添加的防火墙端口"
for p in 20/tcp 21/tcp 8888/tcp 37829/tcp 39000-40000/tcp; do
  firewall-cmd --permanent --remove-port=$p >/dev/null 2>&1 && echo "removed $p"
done
firewall-cmd --reload >/dev/null 2>&1
echo "--- 剩余开放端口 ---"
firewall-cmd --list-ports
echo "--- 剩余 service ---"
firewall-cmd --list-services

echo
echo "### 6. 删除宝塔文件"
echo "--- 删除前 /www 体积 ---"
du -sh /www 2>/dev/null
rm -rf /www/server /www/wwwroot /www/wwwlogs /www/backup /www/.Recycle_bin
rm -f /www/disk.pl /www/reserve_space.pl
rm -f /etc/init.d/bt /usr/bin/bt /usr/sbin/bt
rm -f /usr/lib/systemd/system/bt.service /etc/systemd/system/bt.service
rm -f /run/systemd/generator*/bt.service /run/systemd/generator.late*/bt.service
systemctl daemon-reload
echo "--- 删除后 /www ---"
ls -la /www/ 2>&1
du -sh /www 2>/dev/null

echo
echo "### 7. 终检"
echo "-- BT 进程 --"
ps aux | grep -iE "BT-Panel|BT-Task|/www/server" | grep -v grep || echo "(无)"
echo "-- 相关 systemd 单元 --"
systemctl list-unit-files 2>/dev/null | grep -i "^bt" || echo "(无)"
systemctl list-timers --all 2>/dev/null | grep -i bt || echo "(无 bt 定时器)"
echo "-- 监听端口 --"
ss -lntp
echo "-- nginx --"
systemctl is-active nginx
nginx -t 2>&1 | tail -2
echo "-- HTTP（服务器本机）--"
curl -s -o /dev/null -w "  root=%{http_code}\n"      http://127.0.0.1/
curl -s -o /dev/null -w "  campus=%{http_code}\n"    http://127.0.0.1/campus/
curl -s -o /dev/null -w "  qingming=%{http_code}\n"  http://127.0.0.1/qingming/
curl -s -o /dev/null -w "  photo=%{http_code}\n"     http://127.0.0.1/campus/photos/library-front.jpg
echo "-- 内存 --"
free -m
echo "-- 磁盘 --"
df -h / | tail -1

echo
echo "############ $(date) 移除宝塔完成 ############"
