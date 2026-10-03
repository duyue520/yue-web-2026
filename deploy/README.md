# 部署手册（全新服务器一键恢复）· 越的网站 heyiwei.tech

> 目标：**在一台全新服务器上，按本文档从零把站点部署回来**；服务器挪作他用后也能随时重建。
> 本文档与仓库内 `deploy/` 目录配套：脚本、systemd 单元、nginx 配置、DB schema 都已入库。

---

## 0. 架构总览

```
                    用户
                     │  https://heyiwei.tech
                     ▼
        ┌────────────────────────────┐
        │        nginx (443/80)      │
        │  静态站点 + /api 反向代理   │
        └───────┬──────────┬─────────┘
                │          │
      /var/www/site     /api/ → 127.0.0.1:7860
      (前端 dist)              │
                               ▼
                  ┌─────────────────────────┐
                  │  wb-api (FastAPI+uvicorn)│  systemd: wb-api.service
                  │  /opt/wb-api             │
                  │  · 病害诊断(ONNX)        │
                  │  · 博客/留言/反馈        │
                  │  · AI 网关(/v1) + 分身   │
                  │  · 音乐/用户/鉴权        │
                  └────────┬────────────────┘
                           │ SQLAlchemy
                           ▼
                  PostgreSQL  wb_campus (14 张表)
                           │
        后台守护（systemd timers）：
        wb-backup(03:30 备份) · wb-watchdog(5min) · wb-attack-monitor(2min) · wb-traffic-guard(流量熔断)
```

关键路径：

| 项 | 路径 |
|---|---|
| 后端代码 + venv + .env | `/opt/wb-api` |
| 前端静态产物 | `/var/www/site` |
| 服务单元 | `/etc/systemd/system/wb-*.service|.timer` |
| nginx 站点配置 | `/etc/nginx/conf.d/*.conf` + `/etc/nginx/snippets/wb-api-proxy.conf` |
| 数据库 | PostgreSQL 库 `wb_campus` |
| 备份产物 | `/var/backups/wb` |

---

## 1. 前置条件

- 服务器：2 核 2GB 起（本站在 2C/1870MB 上运行；1GB 内存会吃紧）
- 系统：Alibaba Cloud Linux 3 / CentOS 8+ / Ubuntu 22.04
- 域名解析到本机公网 IP（国内节点需**ICP 备案**，否则 80/443 会被拦）
- 开放端口：22 / 80 / 443（其余一律关闭）
- 一份 **TLS 证书**（certbot 申请，或阿里云签发后放 `/etc/nginx/ssl/`）

---

## 2. 系统依赖

```bash
# 以 Alibaba Cloud Linux 3 / CentOS 系为例
dnf install -y python3.11 python3.11-devel gcc gcc-c++ make nginx postgresql-server postgresql \
               git curl vim fail2ban audit firewalld
# Ubuntu: apt install -y python3.11 python3.11-venv nginx postgresql git curl fail2ban auditd ufw

systemctl enable --now nginx postgresql
postgresql-setup --initdb 2>/dev/null || true     # CentOS 首次需初始化
systemctl restart postgresql
```

---

## 3. 拉取代码

```bash
mkdir -p /root/repo && cd /root/repo
git clone https://github.com/duyue520/yue-web-2026.git
# 目录结构：frontend/（Vue 源码） backend/（FastAPI） deploy/（本部署包）
```

---

## 4. 数据库

```bash
sudo -u postgres psql -c "CREATE USER wbuser WITH PASSWORD '换成强密码';"
sudo -u postgres psql -c "CREATE DATABASE wb_campus OWNER wbuser;"

# 建表（结构来自仓库 deploy/db/schema.sql，14 张表）
sudo -u postgres psql wb_campus < /root/repo/yue-web-2026/deploy/db/schema.sql

# 若从旧机恢复数据（有 dump 时）
# sudo -u postgres pg_restore -d wb_campus --clean --if-exists /path/wb_campus.dump
```

⚠️ **哪些数据必须自己保管**（不会进仓库）：
- `users`（注册用户与口令哈希）
- `blog_articles` / `blog_comments` / `guestbook_messages` / `feedbacks` / `diagnosis_records`
- ⚠️ `ai_upstreams`（豆包网页 sessionid 等上游凭证）、`ai_keys`（用户 API 密钥哈希）—— **属机密**，只放服务器，不进仓库

---

## 5. 后端

```bash
mkdir -p /opt/wb-api && cd /opt/wb-api
# 方式 A：从仓库拷（推荐）
cp -r /root/repo/yue-web-2026/backend/* .
cp /root/repo/yue-web-2026/deploy/.env.example .env    # 然后按注释填值

# 方式 B：git 子目录检出
# git -C /root/repo/yue-web-2026 archive HEAD backend | tar -x -C /opt/wb-api --strip-components=1

python3.11 -m venv venv
./venv/bin/pip install -U pip
./venv/bin/pip install -r requirements.txt        # 或 server/requirements.txt

# 放置模型（病害诊断用，42MB）
mkdir -p weights && cp /root/repo/yue-web-2026/backend/weights/* weights/ 2>/dev/null || true

# 权限（注意：不要 chmod 644，会打断 venv 执行位）
chown -R wbapi:wbapi /opt/wb-api 2>/dev/null || true
chmod go-w /opt/wb-api
```

### 5.1 `.env`（后端配置）

见 `deploy/.env.example`。**必填**：
- `DATABASE_URL`（PostgreSQL 连接串）
- `SECRET_KEY`（JWT 签名，务必随机：`python -c "import secrets;print(secrets.token_urlsafe(48))"`）
- `PORT=7860`、`PREDICT_BACKEND=onnx`
- AI 相关：`AI_DOUBAO_*`、`AI_GW_ADMIN_TOKEN`

> ⚠️ **值里含 `|` 必须加双引号**（systemd EnvironmentFile 与 shell source 双兼容）。

---

## 6. systemd 服务与守护

```bash
cp /root/repo/yue-web-2026/deploy/systemd/*.service /etc/systemd/system/
cp /root/repo/yue-web-2026/deploy/systemd/*.timer   /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now wb-api.service
systemctl enable --now wb-backup.timer wb-watchdog.timer wb-attack-monitor.timer wb-traffic-guard.timer

systemctl is-active wb-api          # 应为 active
curl -s localhost:7860/api/health   # 应返回 ok
```

---

## 7. nginx + HTTPS

```bash
cp /root/repo/yue-web-2026/deploy/nginx/*.conf /etc/nginx/conf.d/
mkdir -p /etc/nginx/snippets
cp /root/repo/yue-web-2026/deploy/nginx/wb-api-proxy.conf /etc/nginx/snippets/ 2>/dev/null || true

# 证书（任选其一）
certbot --nginx -d heyiwei.tech -d www.heyiwei.tech      # 自动签发 + 续期
# 或手工放置：/etc/nginx/ssl/fullchain.pem + privkey.pem

nginx -t && systemctl reload nginx
```

要点（已在配置里体现，改造时勿删）：
- `include /etc/nginx/snippets/wb-api-proxy.conf`：`/api/` 反代到 `127.0.0.1:7860`
- `/api/auth/` 单独限流区 `wb_auth`（防撞库）；`/v1/` 为 `wb_ai`（5r/s，且 **SSE 不缓冲**）
- **gzip 只压 json/js/css，绝不含 `text/event-stream`**（否则会破坏 SSE 流式）
- 安全响应头统一定义在 `01-wb-security.conf`，每个自写 `add_header` 的 location 都要 include 它

---

## 8. 前端构建与发布

```bash
cd /root/repo/yue-web-2026/frontend
npm ci                       # 或 npm install
npm run build                # 产物 dist/

mkdir -p /var/www/site
cp -r dist/* /var/www/site/
chown -R nginx:nginx /var/www/site
```

> 图片素材：仓库 `frontend/public/img/`；线上若做过 WebP 优化，注意 **config 中引用的扩展名要与线上文件名一致**，否则首页会卡在加载遮罩。

---

## 9. 部署后验证清单

```bash
bash /root/repo/yue-web-2026/deploy/scripts/verify-assets.sh   # 前端资源完整性（index→主分块→懒加载分块）
python3 /root/repo/yue-web-2026/deploy/scripts/site-health.py  # 全站接口 + 静态 + 日志体检

curl -s https://heyiwei.tech/api/health
curl -sI https://heyiwei.tech/ | head -5      # 应 200/301→200
```

人工核对：首页卡片显示、登录/注册、叶片诊断（上传一张图看结果与热力图）、博客、留言、AI 分身对话、AI 网关密钥页。

---

## 10. AI 上游（分身 / 网关）恢复

分身依赖 **豆包网页版会话**（cookie 里的 `sessionid`），该凭证**不在仓库**，需重新获取：

1. 浏览器登录 https://www.doubao.com
2. F12 → Application → Cookies → `https://www.doubao.com` → 复制 **整条 cookie**（至少含 `sessionid`）
3. 注入到池子：

```bash
# 追加一个网页会话账号（可多个轮换）
/opt/wb-api/venv/bin/python - <<'PY'
import json, os, psycopg
dsn = [l.split("=",1)[1].strip() for l in open("/opt/wb-api/.env") if l.startswith("DATABASE_URL")][0]
dsn = dsn.replace("postgresql+psycopg://","postgresql://")
c = psycopg.connect(dsn); cur = c.cursor()
cur.execute("SELECT id, accounts FROM ai_upstreams WHERE kind='doubao-web' LIMIT 1")
row = cur.fetchone()
sid = "这里粘贴完整 cookie"
if row:
    accs = row[1] if isinstance(row[1], list) else json.loads(row[1] or "[]")
    accs.append(sid)
    cur.execute("UPDATE ai_upstreams SET accounts=CAST(%s AS jsonb), enabled=true WHERE id=%s", (json.dumps(accs), row[0]))
else:
    cur.execute("INSERT INTO ai_upstreams (name,kind,base_url,accounts,models) VALUES ('豆包网页版','doubao-web','',CAST(%s AS jsonb),CAST(%s AS jsonb))",
                (json.dumps([sid]), json.dumps(["doubao-web"])))
c.commit(); print("账号数:", len(accs) if row else 1)
PY
systemctl restart wb-api
```

健康检查（管理端，需 `X-Admin-Token`）：

```bash
curl -s localhost:7860/api/ai-gw/upstream-health -H "X-Admin-Token: <AI_GW_ADMIN_TOKEN>"
# 关注：healthy_accounts > 0、cooling 为空、watchdog.started = true
```

> 更稳的替代方案：给网关挂一个 **OpenAI 兼容的 API Key 上游**（火山方舟 / 任意中转），
> `deploy/scripts/add-openai-upstream.sh` 已备好脚本，无需依赖网页会话。

---

## 11. 备份与恢复

```bash
bash deploy/scripts/backup-all.sh      # 数据库 + .env + 站点 + 证书 → /var/backups/wb
bash deploy/scripts/restore-all.sh <备份目录>   # 恢复到当前机器
```

备份内容与频率：`wb-backup.timer` 每日 03:30 自动执行，保留最近 N 份。

---

## 12. 常见坑（踩过的，别再踩）

1. **`.env` 值含 `|` 必须加引号**，否则 systemd EnvironmentFile 解析失败、服务起不来
2. **`@app.on_event("startup")` 在 `lifespan=` 模式下会被忽略** —— 启动钩子要写进 lifespan 里（本项目 AI 看门狗就踩过这个）
3. **nginx gzip 不能压 `text/event-stream`**，否则分身/网关的流式输出会断
4. **部署分块要校验完整性**：`index.html → 主分块 → 懒加载分块` 任一缺失就是白屏，用 `verify-assets.sh` 兜底
5. **`index.html` 不缓存**（`no-cache`），分块用哈希名长期缓存
6. **pg_dump 要用 `sudo -u postgres`**，否则权限不足导出为空
7. **服务器上的部署密钥（deploy key）是按仓库授权的**：换仓库要重新在该仓库 Settings → Deploy keys 添加并勾选 write
8. **不要 `chmod 644 /opt/wb-api`**，会打断 venv 内可执行文件权限
9. 内存只有 2GB 时**别装 torch**（本站病害诊断走 ONNX，无需 torch）

---

## 13. 迁移到新服务器（本次场景）

```bash
# 旧机
bash deploy/scripts/backup-all.sh                 # 产出 /var/backups/wb/<时间戳>/
scp -r /var/backups/wb/<时间戳> 新机:/tmp/wb-backup

# 新机（按第 2~9 步装好基础环境后）
bash deploy/scripts/restore-all.sh /tmp/wb-backup
systemctl restart wb-api nginx
bash deploy/scripts/verify-assets.sh
```

DNS 切到新机 IP → 等 TTL 生效 → 旧机可下线（保留一次全量备份至少 30 天）。
