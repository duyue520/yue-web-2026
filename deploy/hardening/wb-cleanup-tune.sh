#!/usr/bin/env bash
# wb-cleanup-tune.sh —— 清掉测试写进生产库的假用户 + 限流参数微调 + 收尾自检
LC_ALL=C
export LC_ALL
ok(){ echo "  [PASS] $*"; }
bad(){ echo "  [FAIL] $*"; }
info(){ echo "  [INFO] $*"; }
sec(){ echo; echo "########## $* ##########"; }
cd /

sec "1. 清理测试写入的假用户"
info "★ 我在验证注册接口时用了 __probe__ 这个用户名，它真的写进了生产库 → 必须删掉"
echo "  --- 清理前的相关数据 ---"
sudo -u postgres psql -d wb_campus -tAc \
 "select 'users_total='||(select count(*) from users)
       ||' probe='||(select count(*) from users where username like '%__probe__%')
       ||' diag='||(select count(*) from diagnosis_records)
       ||' gb='||(select count(*) from guestbook_messages);" 2>/dev/null | sed 's/^/    /'
echo "  --- 该用户是否留下了关联数据 ---"
sudo -u postgres psql -d wb_campus -tAc \
 "select 'id='||id||' username='||username||' created='||created_at from users where username like '%__probe__%';" 2>/dev/null | sed 's/^/    /'
PID=$(sudo -u postgres psql -d wb_campus -tAc "select id from users where username like '%__probe__%';" 2>/dev/null | tr -d ' ' | head -1)
if [ -n "$PID" ]; then
  for t in diagnosis_records feedbacks guestbook_messages corrected_labels; do
    n=$(sudo -u postgres psql -d wb_campus -tAc "select count(*) from $t where user_id=$PID;" 2>/dev/null)
    [ -n "$n" ] && echo "    $t 关联行数: $n"
  done
  sudo -u postgres psql -d wb_campus -c "delete from diagnosis_records where user_id=$PID;" 2>/dev/null | sed 's/^/    /'
  sudo -u postgres psql -d wb_campus -c "delete from feedbacks where user_id=$PID;" 2>/dev/null | sed 's/^/    /'
  sudo -u postgres psql -d wb_campus -c "delete from guestbook_messages where user_id=$PID;" 2>/dev/null | sed 's/^/    /'
  sudo -u postgres psql -d wb_campus -c "delete from corrected_labels where user_id=$PID;" 2>/dev/null | sed 's/^/    /'
  sudo -u postgres psql -d wb_campus -c "delete from users where id=$PID;" 2>/dev/null | sed 's/^/    /'
  ok "已删除测试用户及其关联数据"
else
  info "没找到测试用户（可能已被清理）"
fi
echo "  --- 清理后核对（users 必须回到 1） ---"
sudo -u postgres psql -d wb_campus -tAc \
 "select 'users_total='||(select count(*) from users)
       ||' diag='||(select count(*) from diagnosis_records)
       ||' gb='||(select count(*) from guestbook_messages)
       ||' fb='||(select count(*) from feedbacks)
       ||' corr='||(select count(*) from corrected_labels);" 2>/dev/null | sed 's/^/    /'
u=$(sudo -u postgres psql -d wb_campus -tAc "select count(*) from users;" 2>/dev/null | tr -d ' ')
[ "$u" = "1" ] && ok "users = 1（只剩真实用户，生产数据已复原）" || bad "users = $u，需要人工确认"
echo "  --- 真实用户仍在（只显示用户名，不显示其他字段） ---"
sudo -u postgres psql -d wb_campus -tAc "select username from users;" 2>/dev/null | sed 's/^/    /'

sec "2. 限流参数微调：降低共享出口 IP 被误限的概率"
info "★ 依据：日志里静态站限流返回的是 503，且观测到同一出口 IP 高频访问。"
info "  校园/运营商 NAT 下大量真实访客共用一个公网 IP，60r/s 对'一屋子学生同时打开'偏紧。"
info "  调整：静态站 60r/s burst 200 → 100r/s burst 300（仍是单机人力的几十倍，且 8Mbps 出口本就封顶）"
info "  保持 503 状态码不变 —— 这是刻意的：静态限流是'软刹车'，不该触发 fail2ban 封禁真实访客。"
F=/etc/nginx/conf.d/00-wb-limits.conf
cp -a "$F" /root/00-wb-limits.conf.pre-tune
sed -i 's|zone=wb_perip:10m rate=60r/s|zone=wb_perip:10m rate=100r/s|' "$F"
sed -i 's|limit_req  zone=wb_perip burst=200 nodelay;|limit_req  zone=wb_perip burst=300 nodelay;|' "$F"
if nginx -t >/tmp/nt.err 2>&1; then
  systemctl reload nginx && ok "nginx 已 reload" || bad "reload 失败"
else
  bad "nginx -t 失败，回滚：$(head -1 /tmp/nt.err)"
  cp -a /root/00-wb-limits.conf.pre-tune "$F"; nginx -t >/dev/null 2>&1 && systemctl reload nginx
fi
echo "  --- 生效值 ---"
nginx -T 2>/dev/null | grep -E 'limit_req_zone|limit_conn_zone|limit_req |limit_conn ' | sed 's/^/    /'

sec "3. 收尾自检（服务全在、站点全通、无封禁）"
for s in nginx wb-api postgresql fail2ban firewalld auditd; do
  systemctl is-active --quiet $s && ok "$s active" || bad "$s 未运行"
done
for t in wb-backup.timer wb-traffic-guard.timer wb-watchdog.timer certbot-renew.timer dnf-automatic.timer; do
  systemctl is-active --quiet $t && ok "$t active" || bad "$t 未运行"
done
echo "  --- 站点与接口 ---"
for p in / /index.html /campus/ /qingming/ /salarycat/ /api/health /api/guestbook; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -k --max-time 8 "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  [ "$c" = "200" ] && ok "GET $p → 200" || bad "GET $p → $c"
done
echo "  --- 确认没有封禁任何 IP ---"
for j in $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://;s/,//g'); do
  echo "    [$j] 当前封禁: $(fail2ban-client status $j 2>/dev/null | awk -F'\t' '/Currently banned/{print $2}')"
done
iptables -S 2>/dev/null | grep -E 'f2b.*REJECT' && info "有封禁规则（见上）" || ok "iptables 中无任何封禁规则（无误伤）"

sec "4. 最终健康总览"
bash /usr/local/bin/wb-health 2>&1 | sed 's/^/  /'
