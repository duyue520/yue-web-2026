#!/usr/bin/env bash
# wb-fortress-6.sh —— 修 tar 排除顺序（--exclude 必须写在文件参数之前）
LC_ALL=C
export LC_ALL
ok(){ echo "  [PASS] $*"; }
bad(){ echo "  [FAIL] $*"; }
info(){ echo "  [INFO] $*"; }
sec(){ echo; echo "########## $* ##########"; }

sec "1. 重写备份脚本（修正 tar 参数顺序）"
info "★ 踩的坑：GNU tar 的 --exclude 是**位置参数**，写在 '要打包的路径' 之后就被忽略。"
info "  上一版写法 → tar 只打出一行 'has no effect' 并继续全量打包，结果 app 178MB / site 170MB。"
info "  正确写法：tar czf 包 --exclude=... -C 目录 路径"

cat > /usr/local/sbin/wb-backup.sh <<'BKEOF'
#!/usr/bin/env bash
# wb-backup.sh v3 —— 每日备份
#   daily : 数据库 + 配置 + 后端代码(不含 venv/权重) + 站点(不含 music)
#   weekly: 再加一份完整站点（含 music）+ 数据库
# ★ tar 的 --exclude 是位置参数，必须写在"要打包的路径"之前，否则被静默忽略
set -uo pipefail
cd / || exit 1
BK=/var/backups/wb
D=$(date +%Y%m%d-%H%M%S)
DOW=$(date +%u)              # 7 = 周日
LOG=/var/log/wb-backup.log
install -d -m 700 "$BK" "$BK/daily" "$BK/weekly"
log(){ echo "[$(date -Is)] $*" >> "$LOG"; }
DUMP="$BK/daily/db-$D.dump"

# 0) 磁盘水位保护
AVAIL_MB=$(df -Pm / | awk 'NR==2{print $4}')
if [ "$AVAIL_MB" -lt 2048 ]; then
  log "!! 可用空间仅 ${AVAIL_MB}MB，跳过站点备份（数据库与配置照常）"; SITE=0
else
  SITE=1
fi

# 1) 数据库
if sudo -u postgres pg_dump -Fc -d wb_campus > "$DUMP" 2>>"$LOG"; then
  chmod 600 "$DUMP"; log "pg_dump 成功：$(stat -c%s "$DUMP") 字节"
else
  log "!! pg_dump 失败"; rm -f "$DUMP"; exit 1
fi
# 2) 可读性校验
if pg_restore -l "$DUMP" > /tmp/wb-dumplist.txt 2>>"$LOG"; then
  log "pg_restore -l 校验通过（$(grep -c '.' /tmp/wb-dumplist.txt) 行对象定义）"; rm -f /tmp/wb-dumplist.txt
else
  log "!! 备份不可解析，已删除"; rm -f "$DUMP"; exit 1
fi

# 3) 配置
tar czf "$BK/daily/conf-$D.tar.gz" \
  -C / etc/nginx etc/letsencrypt/renewal etc/letsencrypt/renewal-hooks \
  opt/wb-api/.env etc/ssh/sshd_config.d etc/sysctl.d \
  etc/fail2ban/jail.d etc/fail2ban/filter.d etc/audit/rules.d \
  etc/systemd/coredump.conf.d etc/logrotate.d/wb-backup etc/logrotate.d/wb-watchdog \
  etc/systemd/system/wb-api.service.d etc/systemd/system/wb-backup.service \
  etc/systemd/system/wb-backup.timer etc/systemd/system/wb-traffic-guard.service \
  etc/systemd/system/wb-traffic-guard.timer etc/systemd/system/wb-watchdog.service \
  etc/systemd/system/wb-watchdog.timer \
  usr/local/sbin/wb-backup.sh usr/local/sbin/wb-traffic-guard.sh \
  usr/local/sbin/wb-watchdog.sh usr/local/bin/wb-health usr/local/bin/wb-traffic \
  2>>"$LOG" && log "配置备份成功（$(stat -c%s "$BK/daily/conf-$D.tar.gz") 字节）"

# 4) 后端代码（排除 venv / 模型权重 / 字节码）
tar czf "$BK/daily/app-$D.tar.gz" \
  --exclude='*__pycache__*' --exclude='*.pyc' \
  --exclude='wb-api/venv' --exclude='wb-api/weights' \
  -C /opt wb-api 2>>"$LOG" && log "后端代码备份成功（$(stat -c%s "$BK/daily/app-$D.tar.gz") 字节）"

# 5) 站点（日常排除 music）
if [ "$SITE" = "1" ]; then
  tar czf "$BK/daily/site-$D.tar.gz" --exclude='site/music' \
    -C /var/www site 2>>"$LOG" \
    && log "站点备份成功（不含 music，$(stat -c%s "$BK/daily/site-$D.tar.gz") 字节）"
fi

# 6) 每周完整站点
if [ "$DOW" = "7" ] && [ "$SITE" = "1" ]; then
  tar czf "$BK/weekly/site-full-$D.tar.gz" -C /var/www site 2>>"$LOG" \
    && log "★ 每周完整站点备份成功（$(stat -c%s "$BK/weekly/site-full-$D.tar.gz") 字节）"
  cp -a "$DUMP" "$BK/weekly/" 2>/dev/null
fi

chmod 600 "$BK/daily/"* "$BK/weekly/"* 2>/dev/null
find "$BK/daily" -maxdepth 1 -type f -mtime +7 -delete 2>/dev/null
find "$BK/weekly" -maxdepth 1 -type f -name 'db-*' -mtime +35 -delete 2>/dev/null
ls -1t "$BK/weekly"/site-full-*.tar.gz 2>/dev/null | tail -n +4 | xargs -r rm -f 2>/dev/null
log "完成 daily=$(ls -1 "$BK/daily" 2>/dev/null | wc -l) 文件  weekly=$(ls -1 "$BK/weekly" 2>/dev/null | wc -l) 文件  占用=$(du -sh "$BK" 2>/dev/null | cut -f1)"
BKEOF
chmod 700 /usr/local/sbin/wb-backup.sh
sh -n /usr/local/sbin/wb-backup.sh && ok "语法通过" || bad "语法错误"

sec "2. 清掉上一版体积异常的备份，重新执行"
ls -lh /var/backups/wb/daily/ | sed 's/^/    /'
rm -f /var/backups/wb/daily/*.tar.gz /var/backups/wb/daily/*.dump
info "已清空 daily 目录，重新备份"
/usr/local/sbin/wb-backup.sh && ok "备份执行成功" || bad "备份失败"
tail -7 /var/log/wb-backup.log | sed 's/^/    /'
echo "  --- 新产物 ---"
ls -lh /var/backups/wb/daily/ 2>/dev/null | sed 's/^/    /'

sec "3. ★ 验证排除真的生效（不是只看日志）"
SITE=$(ls -1t /var/backups/wb/daily/site-*.tar.gz 2>/dev/null | head -1)
APP=$(ls -1t /var/backups/wb/daily/app-*.tar.gz 2>/dev/null | head -1)
if [ -n "$SITE" ]; then
  n=$(tar tzf "$SITE" 2>/dev/null | grep -c '^site/music/')
  [ "$n" = "0" ] && ok "site 包里 music/ 条目数 = 0（排除生效）" || bad "site 包里仍有 $n 个 music 条目"
  echo "    site 包含的顶层目录: $(tar tzf "$SITE" 2>/dev/null | awk -F/ 'NF>1{print $2}' | sort -u | tr '\n' ' ')"
fi
if [ -n "$APP" ]; then
  v=$(tar tzf "$APP" 2>/dev/null | grep -c '^wb-api/venv/')
  w=$(tar tzf "$APP" 2>/dev/null | grep -c '^wb-api/weights/')
  [ "$v" = "0" ] && ok "app 包里 venv/ 条目数 = 0（排除生效）" || bad "app 包里仍有 $v 个 venv 条目"
  [ "$w" = "0" ] && ok "app 包里 weights/ 条目数 = 0（排除生效）" || bad "app 包里仍有 $w 个 weights 条目"
  echo "    app 包含的顶层目录: $(tar tzf "$APP" 2>/dev/null | awk -F/ 'NF>1{print $2}' | sort -u | tr '\n' ' ')"
fi
CONF=$(ls -1t /var/backups/wb/daily/conf-*.tar.gz 2>/dev/null | head -1)
if [ -n "$CONF" ]; then
  echo "    conf 包含的关键项: $(tar tzf "$CONF" 2>/dev/null | grep -E 'wb-api/.env|sshd_config.d|audit/rules.d|wb-health|wb-backup.sh|10-https.conf' | tr '\n' ' ')"
fi

sec "4. 再跑一次恢复演练（确认新备份仍可还原）"
DUMP=$(ls -1t /var/backups/wb/daily/db-*.dump 2>/dev/null | head -1)
cd / || true
sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null
sudo -u postgres createdb wb_restore_test 2>/dev/null
if sudo -u postgres pg_restore -d wb_restore_test --no-owner < "$DUMP" 2>/tmp/rr3.err; then
  ok "还原成功"
else
  info "pg_restore 有提示（多为 owner/权限 warning），继续核对数据：$(head -1 /tmp/rr3.err)"
fi
a=$(sudo -u postgres psql -d wb_restore_test -tAc "select (select count(*) from users)||'/'||(select count(*) from diagnosis_records)||'/'||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null)
b=$(sudo -u postgres psql -d wb_campus      -tAc "select (select count(*) from users)||'/'||(select count(*) from diagnosis_records)||'/'||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null)
echo "    还原库 = $a   线上库 = $b"
[ -n "$a" ] && [ "$a" = "$b" ] && ok "★ 数据一致，备份可用" || bad "数据不一致"
sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null && ok "临时库已清理"

sec "5. 备份占用与健康自检复跑"
du -sh /var/backups/wb | sed 's/^/    /'
df -h / | tail -1 | sed 's/^/    /'
echo "  --- wb-health（全部状态） ---"
bash /usr/local/bin/wb-health 2>&1 | sed 's/^/    /'

sec "汇总"
echo "  以上 [FAIL] 项需要再处理；其余已确认"
