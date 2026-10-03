#!/bin/bash
# ============================================================
#  越的网站 · 一键部署脚本（幂等，可重复执行）
#  用法： sudo bash deploy/install.sh
#  适用： Alibaba Cloud Linux 3 / CentOS 8+ / Ubuntu 22.04
#  前置： 域名已解析到本机；仓库已 clone 到 /root/repo/yue-web-2026
# ============================================================
set -euo pipefail

REPO_DIR="${REPO_DIR:-/root/repo/yue-web-2026}"
APP_DIR="${APP_DIR:-/opt/wb-api}"
SITE_DIR="${SITE_DIR:-/var/www/site}"
DB_NAME="${DB_NAME:-wb_campus}"
DB_USER="${DB_USER:-wbuser}"
DOMAIN="${DOMAIN:-heyiwei.tech}"

say() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m[!] %s\033[0m\n' "$*"; }

[ "$(id -u)" = "0" ] || { warn "请用 root 运行"; exit 1; }
[ -d "$REPO_DIR" ] || { warn "找不到仓库目录 $REPO_DIR（先 git clone）"; exit 1; }

# ---------- 0. 探测包管理器 ----------
if command -v dnf >/dev/null; then PKG=dnf; elif command -v yum >/dev/null; then PKG=yum; elif command -v apt >/dev/null; then PKG=apt; else warn "未知包管理器"; exit 1; fi
echo "包管理器: $PKG"

# ---------- 1. 系统依赖 ----------
say "1/8 安装系统依赖"
if [ "$PKG" = "apt" ]; then
  apt update -y
  apt install -y python3 python3-venv python3-dev gcc g++ make nginx postgresql postgresql-contrib git curl fail2ban || true
else
  $PKG install -y python3 python3-devel gcc gcc-c++ make nginx postgresql-server postgresql git curl fail2ban || true
  [ -d /var/lib/pgsql/data ] || postgresql-setup --initdb || true
fi
systemctl enable --now nginx postgresql

# ---------- 2. 数据库 ----------
say "2/8 初始化数据库 $DB_NAME"
DB_PASS="$(head -c 18 /dev/urandom | base64 | tr -d '/+=' | head -c 20)"
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
  sudo -u postgres psql "$DB_NAME" < "$REPO_DIR/deploy/db/schema.sql"
  echo " 已建库：$DB_NAME  用户：$DB_USER  密码：$DB_PASS  （请记录！）"
else
  echo " 数据库已存在，跳过建库"
fi

# ---------- 3. 后端代码 ----------
say "3/8 部署后端到 $APP_DIR"
mkdir -p "$APP_DIR"
if [ -d "$REPO_DIR/backend" ]; then
  cp -r "$REPO_DIR/backend/." "$APP_DIR/"
fi
[ -f "$APP_DIR/.env" ] || cp "$REPO_DIR/deploy/.env.example" "$APP_DIR/.env"

# ---------- 4. venv 与依赖 ----------
say "4/8 安装 Python 依赖（首次约 2~5 分钟）"
python3 -m venv "$APP_DIR/venv"
"$APP_DIR/venv/bin/pip" install -U pip -q
REQ="$APP_DIR/requirements.txt"; [ -f "$REQ" ] || REQ="$APP_DIR/server/requirements.txt"
"$APP_DIR/venv/bin/pip" install -r "$REQ" -q
chmod go-w "$APP_DIR"   # 注意：不要 644，会打断 venv 执行位

# ---------- 5. systemd ----------
say "5/8 安装 systemd 服务与定时器"
cp -f "$REPO_DIR"/deploy/systemd/*.service /etc/systemd/system/ 2>/dev/null || true
cp -f "$REPO_DIR"/deploy/systemd/*.timer   /etc/systemd/system/ 2>/dev/null || true
systemctl daemon-reload
systemctl enable --now wb-api.service
for t in wb-backup wb-watchdog wb-attack-monitor wb-traffic-guard; do
  [ -f "/etc/systemd/system/$t.timer" ] && systemctl enable --now "$t.timer" || true
done

# ---------- 6. nginx ----------
say "6/8 配置 nginx"
mkdir -p /etc/nginx/snippets /var/www/acme
cp -f "$REPO_DIR"/deploy/nginx/*.conf /etc/nginx/conf.d/ 2>/dev/null || true
if [ -f /etc/nginx/conf.d/wb-api-proxy.conf ]; then
  cp -f /etc/nginx/conf.d/wb-api-proxy.conf /etc/nginx/snippets/wb-api-proxy.conf
fi
nginx -t && systemctl reload nginx || warn "nginx 配置校验失败，请检查 /etc/nginx/conf.d"

# ---------- 7. 前端 ----------
say "7/8 构建并发布前端到 $SITE_DIR"
mkdir -p "$SITE_DIR"
if [ -d "$REPO_DIR/frontend" ] && command -v npm >/dev/null; then
  ( cd "$REPO_DIR/frontend" && (npm ci --silent || npm install --silent) && npm run build --silent ) || warn "前端构建失败（可稍后手工执行）"
  [ -d "$REPO_DIR/frontend/dist" ] && cp -r "$REPO_DIR/frontend/dist/." "$SITE_DIR/"
  chown -R nginx:nginx "$SITE_DIR" 2>/dev/null || chown -R www-data:www-data "$SITE_DIR" 2>/dev/null || true
else
  warn "未找到前端目录或 npm，跳过（可手工 build 后拷到 $SITE_DIR）"
fi

# ---------- 8. 验证 ----------
say "8/8 验证"
sleep 5
systemctl is-active wb-api && echo "  wb-api: OK"
curl -s -m 10 "http://127.0.0.1:${PORT:-7860}/api/health" || warn "健康检查无响应（检查 .env 的 PORT 与 DATABASE_URL）"
[ -f "$REPO_DIR/deploy/scripts/verify-assets.sh" ] && bash "$REPO_DIR/deploy/scripts/verify-assets.sh" || true

cat <<EOF

============================================================
 部署完成 ✅
 下一步（必须手工）：
   1) 编辑 $APP_DIR/.env —— 填 DATABASE_URL(=上面密码)/SECRET_KEY/AI_GW_ADMIN_TOKEN
   2) systemctl restart wb-api
   3) 配置 HTTPS：certbot --nginx -d $DOMAIN -d www.$DOMAIN
   4) 注入 AI 上游（豆包 sessionid 或 OpenAI 兼容 Key）→ 见 deploy/README.md 第 10 节
   5) 数据恢复（如有旧备份）：bash deploy/scripts/restore-all.sh <备份目录>
============================================================
EOF
