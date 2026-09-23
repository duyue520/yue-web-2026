#!/usr/bin/env bash
# wb-fortress-4.sh —— 修备份脚本 + 重做 TLS 协议/套件探测（上一版探测方法本身是错的）
LC_ALL=C
export LC_ALL
ok()   { echo "  [PASS] $*"; }
bad()  { echo "  [FAIL] $*"; }
info() { echo "  [INFO] $*"; }
sec()  { echo; echo "########## $* ##########"; }

# ============ 1. 重做 TLS 协议与套件探测 ============
sec "1. TLS 协议与套件探测（正确方法）"
info "★ 上一版误判原因：openssl s_client 在握手被拒时**仍会打印** 'Protocol : TLSv1.1' 与 'Cipher : 0000'，"
info "  所以 grep 'Protocol|Cipher' 会假阳性。正确判据是看 Cipher 的值是不是 0000 / (NONE)。"

probe() {  # $1=标志 $2=套件(可空)  → 输出 Cipher 值
  local extra=""
  [ -n "$2" ] && extra="-cipher $2"
  echo | timeout 10 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech "$1" $extra 2>/dev/null \
    | grep -E '^[[:space:]]*Cipher[[:space:]]*:' | head -1 | sed 's/.*://' | tr -d ' '
}

c=$(probe "-tls1_2"); info "TLSv1.2（默认套件） → Cipher=$c"
[ -n "$c" ] && [ "$c" != "0000" ] && [ "$c" != "(NONE)" ] && ok "TLSv1.2 正常可用" || bad "TLSv1.2 异常"
c=$(probe "-tls1_3"); info "TLSv1.3（默认套件） → Cipher=$c"
[ -n "$c" ] && [ "$c" != "0000" ] && [ "$c" != "(NONE)" ] && ok "TLSv1.3 正常可用" || bad "TLSv1.3 异常"

for v in tls1_1 tls1; do
  c=$(probe "-$v")
  if [ -z "$c" ] || [ "$c" = "0000" ] || [ "$c" = "(NONE)" ]; then
    ok "$v 已被服务器拒绝（Cipher=${c:-空}）"
  else
    bad "$v 仍可协商（Cipher=$c）"
  fi
done
for suite in AES128-SHA AES256-SHA ECDHE-RSA-AES128-SHA DES-CBC3-SHA; do
  c=$(probe "-tls1_2" "$suite")
  if [ -z "$c" ] || [ "$c" = "0000" ] || [ "$c" = "(NONE)" ]; then
    ok "旧套件 $suite 已被拒绝（Cipher=${c:-空}）"
  else
    bad "旧套件 $suite 仍可用（Cipher=$c）"
  fi
done
echo "  --- 确认 ssl_ecdh_curve 已写入 ---"
nginx -T 2>/dev/null | grep -E 'ssl_ecdh_curve|ssl_ciphers|ssl_prefer_server_ciphers|ssl_session_tickets' | grep -v '^\s*#' | sed 's/^/    /'

# ============ 2. 修备份脚本 ============
sec "2. 修备份脚本（sudo 的 chdir 与文件可读性）"
info "★ 两个真因："
info "  a) sudo -u postgres 会尝试 chdir 到调用者的 cwd(/root)，postgres 无权进入 → 每次都刷 Permission denied"
info "  b) 备份文件是 600 root 且在 700 root 目录里，postgres 读不到 → pg_restore 校验必然失败"
info "  修法：脚本开头 cd /；校验用 root 自己跑 pg_restore -l；恢复演练用 stdin 重定向喂给 postgres"

cat > /usr/local/sbin/wb-backup.sh <<'BKEOF'
#!/usr/bin/env bash
# wb-backup.sh —— 每日备份：PostgreSQL 逻辑备份 + 站点 + 关键配置
# 注意：必须在别人能 chdir 进去的目录里跑（sudo 到 postgres 会 chdir 到当前目录）
set -uo pipefail
cd / || exit 1
BK=/var/backups/wb
D=$(date +%Y%m%d-%H%M%S)
DOW=$(date +%u)          # 7 = 周日
LOG=/var/log/wb-backup.log
install -d -m 700 "$BK" "$BK/daily" "$BK/weekly"
log(){ echo "[$(date -Is)] $*" >> "$LOG"; }
DUMP="$BK/daily/db-$D.dump"

# 1) 数据库逻辑备份
if sudo -u postgres pg_dump -Fc -d wb_campus > "$DUMP" 2>>"$LOG"; then
  chmod 600 "$DUMP"
  log "pg_dump 成功：$(stat -c%s "$DUMP") 字节"
else
  log "!! pg_dump 失败"; rm -f "$DUMP"; exit 1
fi
# 2) 可读性校验：用 root 跑（-l 只需读文件，不连库），避免 postgres 读不到 600 文件
if pg_restore -l "$DUMP" > /tmp/wb-dumplist.txt 2>>"$LOG"; then
  log "pg_restore -l 校验通过（备份可解析，内含 $(grep -c '.' /tmp/wb-dumplist.txt) 行对象定义）"
  rm -f /tmp/wb-dumplist.txt
else
  log "!! 备份不可解析，已删除"; rm -f "$DUMP"; exit 1
fi

# 3) 站点与配置
tar czf "$BK/daily/site-$D.tar.gz" -C /var/www site 2>>"$LOG" && log "site 备份成功"
tar czf "$BK/daily/conf-$D.tar.gz" \
  /etc/nginx /etc/letsencrypt/renewal /etc/letsencrypt/renewal-hooks \
  /opt/wb-api/.env /etc/ssh/sshd_config.d /etc/sysctl.d \
  /etc/fail2ban/jail.d /etc/fail2ban/filter.d /etc/audit/rules.d 2>>"$LOG" && log "配置备份成功"
chmod 600 "$BK/daily/"* 2>/dev/null

# 4) 保留策略：日备 7 天，周备 5 周
find "$BK/daily" -maxdepth 1 -type f -mtime +7 -delete 2>/dev/null
if [ "$DOW" = "7" ]; then
  cp -a "$DUMP" "$BK/weekly/" 2>/dev/null
  find "$BK/weekly" -maxdepth 1 -type f -mtime +35 -delete 2>/dev/null
fi
log "完成 daily=$(ls -1 "$BK/daily" 2>/dev/null | wc -l) 个文件 weekly=$(ls -1 "$BK/weekly" 2>/dev/null | wc -l) 个"
BKEOF
chmod 700 /usr/local/sbin/wb-backup.sh
sh -n /usr/local/sbin/wb-backup.sh && ok "备份脚本语法通过" || bad "语法错误"

echo "  --- 立刻执行 ---"
/usr/local/sbin/wb-backup.sh && ok "备份执行成功" || bad "备份执行失败（见下）"
tail -8 /var/log/wb-backup.log 2>/dev/null | sed 's/^/    /'
echo "  --- 产物与权限 ---"
ls -lh /var/backups/wb/daily/ 2>/dev/null | sed 's/^/    /'
stat -c '%a %U:%G %n' /var/backups/wb/daily/* 2>/dev/null | head -6 | sed 's/^/    /'

# ============ 3. 恢复演练 ============
sec "3. 恢复演练 —— 真还原一个临时库，证明备份能用"
DUMP=$(ls -1t /var/backups/wb/daily/db-*.dump 2>/dev/null | head -1)
if [ -z "$DUMP" ]; then
  bad "没有可用的备份文件，跳过演练"
else
  info "使用备份：$DUMP（$(stat -c%s "$DUMP") 字节）"
  sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null
  sudo -u postgres createdb wb_restore_test && ok "临时库已建" || bad "建库失败"
  # 用 stdin 喂数据，绕开 postgres 读不到 600 文件的问题
  if sudo -u postgres pg_restore -d wb_restore_test --no-owner < "$DUMP" 2>/tmp/rr2.err; then
    ok "pg_restore 还原成功"
  else
    n=$(wc -l < /tmp/rr2.err)
    info "有 $n 行提示，前 3 行："; head -3 /tmp/rr2.err | sed 's/^/      /'
    info "（pg_restore 对 owner/权限类差异会输出 warning，只要数据行数一致即视为成功）"
  fi
  echo "  --- 还原库 vs 线上库 数据对照 ---"
  a=$(sudo -u postgres psql -d wb_restore_test -tAc "select (select count(*) from users)||'/'||(select count(*) from diagnosis_records)||'/'||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null)
  b=$(sudo -u postgres psql -d wb_campus      -tAc "select (select count(*) from users)||'/'||(select count(*) from diagnosis_records)||'/'||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null)
  echo "    备份还原库 users/diagnosis/tables = $a"
  echo "    线上生产库 users/diagnosis/tables = $b"
  [ -n "$a" ] && [ "$a" = "$b" ] && ok "★ 数据完全一致 —— 备份确认可用" || bad "数据不一致，备份有问题"
  sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null && ok "临时库已删除（生产库无残留）"
  echo "  --- 确认生产库未受影响 ---"
  sudo -u postgres psql -d wb_campus -tAc "select count(*) from users;" 2>/dev/null | sed 's/^/    线上 users 行数: /'
fi

# ============ 4. 定时器状态 ============
sec "4. 定时器与整体状态"
systemctl list-timers --no-pager 2>/dev/null | grep -E 'wb-backup|wb-traffic|certbot|dnf-automatic' | sed 's/^/    /'
echo "  --- 备份目录总占用 ---"
du -sh /var/backups/wb 2>/dev/null | sed 's/^/    /'

sec "汇总"
echo "  以上 [FAIL] 项需要再处理；其余已确认"
