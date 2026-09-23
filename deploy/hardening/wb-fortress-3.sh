#!/usr/bin/env bash
# wb-fortress-3.sh —— 收尾：ctrl-alt-del、TLS 重做、备份体系、隔离残留
LC_ALL=C
export LC_ALL
ok()   { echo "  [PASS] $*"; }
bad()  { echo "  [FAIL] $*"; }
info() { echo "  [INFO] $*"; }
sec()  { echo; echo "########## $* ##########"; }

# ============ 1. ctrl-alt-del（上次失败原因：默认已是软链，mask 拒绝覆盖） ============
sec "1. 关闭本地控制台 Ctrl-Alt-Del"
if [ -L /etc/systemd/system/ctrl-alt-del.target ]; then
  info "默认是软链 → $(readlink /etc/systemd/system/ctrl-alt-del.target)（指向 reboot，所以 VNC 里 Ctrl-Alt-Del 会重启）"
  rm -f /etc/systemd/system/ctrl-alt-del.target
fi
ln -sf /dev/null /etc/systemd/system/ctrl-alt-del.target
systemctl daemon-reload
st=$(systemctl is-enabled ctrl-alt-del.target 2>&1)
echo "    is-enabled = $st"
[ "$st" = "masked" ] && ok "已 mask（VNC 控制台里 Ctrl-Alt-Del 不再重启）" || bad "状态异常：$st"
info "（systemctl reboot / 控制台的关机按钮仍正常可用，只是屏蔽了键盘组合键）"

# ============ 2. TLS 重做 ============
sec "2. TLS 加密参数收紧（重做）"
HF=/etc/nginx/conf.d/10-https.conf
cp -a "$HF" /root/10-https.conf.pre-tls3
CERT=/etc/nginx/ssl/heyiwei.tech/fullchain.pem
OCSP=$(openssl x509 -in "$CERT" -noout -ocsp_uri 2>/dev/null)
[ -n "$OCSP" ] && info "证书带 OCSP：$OCSP" || info "证书无 OCSP URL（LE 已停发 OCSP）→ 不启 stapling"

apply() {
  cp -a /root/10-https.conf.pre-tls3 "$HF"
  sed -i 's/^\([[:space:]]*\)ssl_prefer_server_ciphers[[:space:]]\+off;/\1ssl_prefer_server_ciphers on;/' "$HF"
  local ins='    ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n    ssl_session_tickets off;'
  if [ -n "$1" ]; then
    ins="$ins\\n    ssl_ecdh_curve $1;"
  fi
  sed -i "s|^\([[:space:]]*ssl_protocols[^;]*;\)|\1\n$ins|" "$HF"
}

TRIED=""
if apply "X25519:prime256v1:secp384r1" && nginx -t >/tmp/n1.err 2>&1; then
  TRIED="X25519:prime256v1:secp384r1"; ok "nginx -t 通过（含 ssl_ecdh_curve=$TRIED）"
else
  info "带 ssl_ecdh_curve 失败：$(head -1 /tmp/n1.err)"
  info "→ 去掉 ssl_ecdh_curve（OpenSSL 1.1.1 的默认曲线组本来就是 X25519+P-256+P-384，不设也安全）"
  if apply "" && nginx -t >/tmp/n2.err 2>&1; then
    ok "nginx -t 通过（不含 ssl_ecdh_curve）"
  else
    bad "仍失败，整体回滚：$(head -1 /tmp/n2.err)"
    cp -a /root/10-https.conf.pre-tls3 "$HF"; nginx -t >/dev/null 2>&1 && systemctl reload nginx
  fi
fi
echo "  --- 生效的 TLS 段 ---"
nginx -T 2>/dev/null | grep -E 'ssl_protocols|ssl_ciphers|ssl_prefer_server_ciphers|ssl_session_tickets|ssl_session_cache' | sed 's/^/    /'
systemctl reload nginx && ok "nginx 已 reload" || bad "reload 失败"
sleep 2
echo "  --- TLS 协商实测 ---"
for v in tls1_2 tls1_3; do
  r=$(echo | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -$v 2>/dev/null | grep -E 'Protocol|Cipher' | tr -d ' ' | tr '\n' ' ')
  [ -n "$r" ] && ok "$v → $r" || bad "$v 不可用"
done
n11=$(echo | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_1 2>&1 | grep -cE '^\s*(Protocol|Cipher)\s*:')
[ "$n11" = "0" ] && ok "TLSv1.1 已被拒绝" || bad "TLSv1.1 仍可协商"
echo "  --- 弱套件探测（TLS1.2 + AES128-CBC，应失败） ---"
r=$(echo | timeout 8 openssl s_client -connect 127.0.0.1:443 -servername heyiwei.tech -tls1_2 -cipher 'AES128-SHA' 2>&1 | grep -cE '^\s*Cipher\s*:')
[ "$r" = "0" ] && ok "CBC/SHA1 旧套件已被拒绝" || bad "旧套件仍可用"
echo "  --- 站点回归 ---"
for p in / /index.html /campus/ /qingming/ /salarycat/ /api/health; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -k "https://127.0.0.1$p" -H 'Host: heyiwei.tech')
  [ "$code" = "200" ] && ok "GET $p → 200" || bad "GET $p → $code"
done
echo "  --- 安全头复核 ---"
curl -s -o /dev/null -D - -k https://127.0.0.1/ -H 'Host: heyiwei.tech' 2>/dev/null | grep -iE 'strict-transport|x-content-type|x-frame|referrer|permissions|server:' | sed 's/^/    /'

# ============ 3. 备份体系 ============
sec "3. 建立定时备份（数据库 / 站点 / 配置）"
cat > /usr/local/sbin/wb-backup.sh <<'BKEOF'
#!/usr/bin/env bash
# wb-backup.sh —— 每日备份：PostgreSQL 逻辑备份 + 站点 + 关键配置
set -uo pipefail
BK=/var/backups/wb
D=$(date +%Y%m%d-%H%M%S)
DOW=$(date +%u)          # 7 = 周日
LOG=/var/log/wb-backup.log
install -d -m 700 "$BK" "$BK/daily" "$BK/weekly"
log(){ echo "[$(date -Is)] $*" >> "$LOG"; }

# 1) 数据库
if sudo -u postgres pg_dump -Fc -d wb_campus > "$BK/daily/db-$D.dump" 2>>"$LOG"; then
  log "pg_dump 成功：$(stat -c%s "$BK/daily/db-$D.dump") 字节"
else
  log "!! pg_dump 失败"; rm -f "$BK/daily/db-$D.dump"; exit 1
fi
# 可读性校验（备份能列目录 = 没坏）
if sudo -u postgres pg_restore -l "$BK/daily/db-$D.dump" >/dev/null 2>>"$LOG"; then
  log "pg_restore -l 校验通过"
else
  log "!! 备份不可解析，已删除"; rm -f "$BK/daily/db-$D.dump"; exit 1
fi

# 2) 站点文件与配置
tar czf "$BK/daily/site-$D.tar.gz" -C /var/www site 2>>"$LOG" && log "site 备份成功"
tar czf "$BK/daily/conf-$D.tar.gz" \
  /etc/nginx /etc/letsencrypt/renewal /etc/letsencrypt/renewal-hooks \
  /opt/wb-api/.env /etc/ssh/sshd_config.d /etc/sysctl.d \
  /etc/fail2ban/jail.d /etc/fail2ban/filter.d /etc/audit/rules.d 2>>"$LOG" && log "配置备份成功"
chmod 600 "$BK/daily/"* 2>/dev/null

# 3) 保留策略：日备 7 天，周备 5 周
find "$BK/daily" -maxdepth 1 -type f -mtime +7 -delete 2>/dev/null
if [ "$DOW" = "7" ]; then
  cp -a "$BK/daily/db-$D.dump" "$BK/weekly/" 2>/dev/null
  find "$BK/weekly" -maxdepth 1 -type f -mtime +35 -delete 2>/dev/null
fi
log "完成 daily=$(ls -1 "$BK/daily" 2>/dev/null | wc -l) weekly=$(ls -1 "$BK/weekly" 2>/dev/null | wc -l)"
BKEOF
chmod 700 /usr/local/sbin/wb-backup.sh
cat > /etc/systemd/system/wb-backup.service <<'SVCEOF'
[Unit]
Description=wb 每日备份（数据库+站点+配置）
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/wb-backup.sh
SVCEOF
cat > /etc/systemd/system/wb-backup.timer <<'TMREOF'
[Unit]
Description=wb 每日备份定时器
[Timer]
OnCalendar=*-*-* 03:30:00
RandomizedDelaySec=600
Persistent=true
[Install]
WantedBy=timers.target
TMREOF
cat > /etc/logrotate.d/wb-backup <<'LREOF'
/var/log/wb-backup.log {
    weekly
    rotate 8
    compress
    missingok
    notifempty
    create 600 root root
}
LREOF
systemctl daemon-reload
systemctl enable --now wb-backup.timer >/dev/null 2>&1
systemctl is-active --quiet wb-backup.timer && ok "wb-backup.timer 已启用" || bad "timer 未启用"
systemctl list-timers wb-backup.timer --no-pager 2>/dev/null | sed -n '1,3p' | sed 's/^/    /'
echo "  --- 立刻跑一次 ---"
if /usr/local/sbin/wb-backup.sh; then ok "备份脚本执行成功"; else bad "备份脚本失败"; fi
tail -8 /var/log/wb-backup.log 2>/dev/null | sed 's/^/    /'
echo "  --- 产物 ---"
ls -lh /var/backups/wb/daily/ 2>/dev/null | sed 's/^/    /'
echo "  --- 权限（应 600，目录 700） ---"
stat -c '%a %U:%G %n' /var/backups/wb /var/backups/wb/daily 2>/dev/null | sed 's/^/    /'
stat -c '%a %n' /var/backups/wb/daily/* 2>/dev/null | head -5 | sed 's/^/    /'

# ============ 4. ★ 恢复演练（证明备份真的能还原） ============
sec "4. 恢复演练 —— 把备份还原到一个临时库并核对数据"
DUMP=$(ls -1t /var/backups/wb/daily/db-*.dump 2>/dev/null | head -1)
info "使用备份：$DUMP"
sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null
if sudo -u postgres createdb wb_restore_test 2>/tmp/rd.err; then
  ok "临时库 wb_restore_test 已创建"
else
  bad "建库失败：$(cat /tmp/rd.err)"
fi
if sudo -u postgres pg_restore -d wb_restore_test --no-owner "$DUMP" 2>/tmp/rr.err; then
  ok "pg_restore 还原成功（无错误）"
else
  bad "还原报错："; head -5 /tmp/rr.err | sed 's/^/    /'
fi
echo "  --- 还原后的实际数据 ---"
sudo -u postgres psql -d wb_restore_test -tAc \
  "select 'users='||(select count(*) from users)
        ||' diagnosis_records='||(select count(*) from diagnosis_records)
        ||' tables='||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null | sed 's/^/    /'
echo "  --- 与线上库对照（应完全一致） ---"
sudo -u postgres psql -d wb_campus -tAc \
  "select 'users='||(select count(*) from users)
        ||' diagnosis_records='||(select count(*) from diagnosis_records)
        ||' tables='||(select count(*) from pg_tables where schemaname='public');" 2>/dev/null | sed 's/^/    /'
sudo -u postgres dropdb --if-exists wb_restore_test 2>/dev/null && ok "临时库已清理（未在生产库留痕）"

# ============ 5. 隔离历史残留 ============
sec "5. 隔离历史残留（宝塔备份等）"
install -d -m 700 /root/quarantine
for f in /root/bt-backup-20260918.tar.gz /root/nginx-backup-20260919-010021.tar.gz /root/nginx-backup-20260919-011146.tar.gz; do
  if [ -f "$f" ]; then
    chmod 600 "$f"
    mv "$f" /root/quarantine/ && info "已隔离 $(basename "$f")（内容为已卸载的宝塔面板数据/旧 nginx 配置）"
  fi
done
echo "  --- /root/quarantine 现状 ---"
ls -lh /root/quarantine/ 2>/dev/null | sed 's/^/    /'
stat -c '%a %n' /root/quarantine 2>/dev/null | sed 's/^/    /'
info "★ 这些是历史残留数据，需要你确认后才能永久删除（我没有直接删）"

sec "汇总"
echo "  以上 [FAIL] 项需要再处理；其余已确认"
