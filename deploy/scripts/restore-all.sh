#!/bin/bash
# ============================================================
#  越的网站 · 从备份恢复
#  用法： bash deploy/scripts/restore-all.sh <备份目录> [--db-only|--site-only]
#  备份目录由 backup-all.sh 生成（含 db.dump / env.backup / site.tar.gz / conf.tar.gz）
# ============================================================
set -euo pipefail

SRC="${1:-}"
MODE="${2:-all}"
DB_NAME="${DB_NAME:-wb_campus}"
APP_DIR="${APP_DIR:-/opt/wb-api}"
SITE_DIR="${SITE_DIR:-/var/www/site}"

[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "用法: $0 <备份目录> [--db-only|--site-only]"; exit 1; }
[ "$(id -u)" = "0" ] || { echo "请用 root 运行"; exit 1; }

echo "== 从 $SRC 恢复（模式: $MODE）"

restore_db() {
  [ -f "$SRC/db.dump" ] || { echo " - 无 db.dump，跳过"; return; }
  echo " - 停止后端以避免写入冲突"
  systemctl stop wb-api 2>/dev/null || true
  echo " - 恢复数据库 $DB_NAME"
  sudo -u postgres pg_restore -d "$DB_NAME" --clean --if-exists --no-owner "$SRC/db.dump" 2>/dev/null \
    || pg_restore -d "$DB_NAME" --clean --if-exists --no-owner "$SRC/db.dump"
  echo "   完成"
}

restore_env() {
  [ -f "$SRC/env.backup" ] || { echo " - 无 env.backup，跳过"; return; }
  echo " - 恢复 .env（原文件会另存 .bak）"
  [ -f "$APP_DIR/.env" ] && cp "$APP_DIR/.env" "$APP_DIR/.env.bak.$(date +%s)"
  cp "$SRC/env.backup" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
}

restore_site() {
  [ -f "$SRC/site.tar.gz" ] || { echo " - 无 site.tar.gz，跳过"; return; }
  echo " - 恢复站点文件到 $SITE_DIR"
  mkdir -p "$SITE_DIR"
  tar xzf "$SRC/site.tar.gz" -C "$SITE_DIR"
  chown -R nginx:nginx "$SITE_DIR" 2>/dev/null || chown -R www-data:www-data "$SITE_DIR" 2>/dev/null || true
}

restore_conf() {
  [ -f "$SRC/conf.tar.gz" ] || { echo " - 无 conf.tar.gz，跳过"; return; }
  echo " - 恢复 nginx/systemd/证书配置"
  tar xzf "$SRC/conf.tar.gz" -C / 2>/dev/null || echo "   [!] 部分文件恢复失败（可能路径不同）"
  systemctl daemon-reload
  nginx -t && systemctl reload nginx || echo "   [!] nginx 校验失败，请手工检查"
}

case "$MODE" in
  --db-only)   restore_db ;;
  --site-only) restore_site ;;
  *)           restore_db; restore_env; restore_site; restore_conf ;;
esac

echo " - 启动后端"
systemctl start wb-api 2>/dev/null || true
sleep 5
systemctl is-active wb-api && echo "   wb-api: OK" || echo "   [!] wb-api 未启动，检查 journalctl -u wb-api -n 50"

cat <<'EOF'
== 恢复完成。请验证：
   curl -s localhost:7860/api/health
   bash deploy/scripts/verify-assets.sh
   curl -s localhost:7860/api/ai-gw/upstream-health -H "X-Admin-Token: <token>"
   注意：AI 上游凭证若已过期，需按 deploy/README.md 第 10 节重新注入
EOF
