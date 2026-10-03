#!/bin/bash
# ============================================================
#  越的网站 · 全量备份（数据库 + 环境变量 + 站点 + nginx/systemd 配置）
#  用法： bash deploy/scripts/backup-all.sh [备份根目录]
#  产出： <备份根>/<时间戳>/  → 可直接用于 restore-all.sh
# ============================================================
set -euo pipefail

DEST_ROOT="${1:-/var/backups/wb}"
TS="$(date +%Y%m%d-%H%M%S)"
DEST="$DEST_ROOT/$TS"
DB_NAME="${DB_NAME:-wb_campus}"

mkdir -p "$DEST"
echo "== 备份到 $DEST"

# 1) 数据库（自定义格式，可选择性恢复）
echo " - 数据库 $DB_NAME"
if command -v pg_dump >/dev/null; then
  sudo -u postgres pg_dump -Fc "$DB_NAME" > "$DEST/db.dump" 2>/dev/null \
    || pg_dump -Fc "$DB_NAME" > "$DEST/db.dump"
  sudo -u postgres pg_dump --schema-only --no-owner --no-privileges "$DB_NAME" > "$DEST/db-schema.sql" 2>/dev/null || true
  echo "   $(du -h "$DEST/db.dump" | cut -f1)"
else
  echo "   [!] 未找到 pg_dump，跳过"
fi

# 2) 环境变量（含密钥，注意保管）
echo " - .env（含密钥）"
cp /opt/wb-api/.env "$DEST/env.backup" 2>/dev/null && chmod 600 "$DEST/env.backup" || echo "   [!] 无 /opt/wb-api/.env"

# 3) 站点静态产物
echo " - 站点文件 /var/www/site"
[ -d /var/www/site ] && tar czf "$DEST/site.tar.gz" -C /var/www/site . 2>/dev/null || true

# 4) 配置（nginx / systemd / 证书）
echo " - 配置与证书"
tar czf "$DEST/conf.tar.gz" \
  -C / etc/nginx/conf.d etc/nginx/snippets etc/systemd/system/wb-api.service \
  etc/letsencrypt 2>/dev/null || \
tar czf "$DEST/conf.tar.gz" -C / etc/nginx/conf.d etc/systemd/system 2>/dev/null || true

# 5) 源码快照（当前仓库 HEAD）
if [ -d /root/repo/yue-web-2026/.git ]; then
  git -C /root/repo/yue-web-2026 rev-parse HEAD > "$DEST/repo-head.txt" 2>/dev/null || true
  echo " - 源码版本: $(cat "$DEST/repo-head.txt" 2>/dev/null | cut -c1-7)"
fi

# 6) 校验清单
( cd "$DEST" && ls -lh > MANIFEST.txt 2>/dev/null ) || true

# 7) 保留最近 14 份
ls -1dt "$DEST_ROOT"/*/ 2>/dev/null | tail -n +15 | xargs -r rm -rf

echo "== 完成：$DEST"
echo "   恢复： bash deploy/scripts/restore-all.sh $DEST"
