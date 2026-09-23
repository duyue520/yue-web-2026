# 后端部署步骤（Render Free Docker + Neon Free PostgreSQL）

> 状态：本机准备完成，以下步骤包含需要用户登录/授权才能执行的动作，本次未执行任何云端操作。
> 前提：前端已在 https://duyue520.github.io/ 上线（本次实测 200）；`https://duyue520.github.io/api/health` 实测 404，说明后端与代理尚未打通。

## 0. 需要用户完成的前置（无法代做）

1. 注册/登录 Render 账号（https://dashboard.render.com）。官方 Free 档不强制信用卡，但新账号可能触发邮箱/手机/风控验证——以实际注册界面为准。
2. 注册 Neon 账号（https://neon.com，明确 no credit card required），创建项目与新空数据库。
3. 决定发布方式：将本目录推送到**私有** GitHub 仓库（本包未推送，见 §4），或用 Deploy from image。此文档不构成公开发布授权。

## 1. Neon Free PostgreSQL（数据持久层）

1. Neon Dashboard → 新建 Project（区域选离用户近的，如 Singapore）。
2. 复制 connection string，改写为本包要求的格式（密码需 URL 编码，`@`→`%40` 等）：
   ```
   postgresql+psycopg://<USER>:<PASSWORD>@<HOST>/<DBNAME>?sslmode=require
   ```
3. 该串即为 Secret `DATABASE_URL`。只放进 Render 环境变量/本地 `.env`，不进 git、日志、聊天、前端。

## 2. SECRET_KEY 生成（一次生成，永久保存）

本机 PowerShell 生成 64 位十六进制（约 256 bit）：

```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

- 粘贴到 Render 环境变量 `SECRET_KEY`。
- 生成后**不得更换**：HS256 用它签发 JWT，换 key 等于把所有已登录用户踢下线。
- 不提交 `.env`（已在 .gitignore），不写进代码、日志、聊天。

## 3. CORS_ORIGINS 与后端 URL

- `CORS_ORIGINS=https://duyue520.github.io`（render.yaml 已带此默认值；多前端用逗号分隔）。
- Render 部署完成后会得到形如 `https://<service-name>.onrender.com` 的 URL——这就是公开后端 URL，填入前端构建或代理配置（见 §6 / pages-proxy-plan.md）。

## 4. Render Free Web Service（Docker）

1. Render Dashboard → New → Web Service → 连接私有仓库（选本部署目录），或 Deploy an existing image。
2. Runtime: Docker；`dockerfilePath: ./Dockerfile`；Plan: **Free**。
3. Advanced → Environment Variables：
   - `DATABASE_URL` = §1 的连接串
   - `SECRET_KEY` = §2 生成值
   - `CORS_ORIGINS` = `https://duyue520.github.io`
   - `PORT` = `7860`（render.yaml 已带）
4. Health Check Path: `/api/health`。
5. Create Web Service → 等首次构建（CPU PyTorch 镜像构建较久，属预期）。

已知限制（官方 llms-full.txt 实测摘录）：
- Free 实例 **15 分钟无入站流量即休眠**，下一请求唤醒约 1 分钟。
- Free Web Service **无 persistent disk**：容器文件系统每次 restart/redeploy/spin-down 全部清空。
- 免费 Postgres **30 天过期**（过期后 14 天宽限期，之后连数据一起删除）、无备份——**不用于本包数据层**。
- 每月 750 免费 instance 小时；单 worker。

## 5. 数据库迁移（一次性，顺序固定）

迁移先于服务启动。免费层没有 Shell，可在本机对 Neon 执行（网络可达即可）：

```powershell
cd 'F:\github好看网站\deployment-backend'
Copy-Item .env.example .env   # 填入真实 DATABASE_URL / SECRET_KEY
docker build -t leaf-personal-backend:local .        # 需 Docker Desktop Linux engine
docker run --rm --env-file .env leaf-personal-backend:local python -m alembic upgrade head
```

或不用 Docker：`pip install -r requirements.txt` 后 `python -m alembic upgrade head`。
服务启动时只校验 `alembic_version=0001`；库不对、版本不对都会**拒绝启动**（防静默空库）。

## 6. 前端接回（二选一）

- **A. 同源代理（推荐，需自有域名+Cloudflare）**：按 `pages-proxy-plan.md` 配 Worker 反代 `/api/*`，前端零改动（无 `VITE_API_BASE` 即同源）。
- **B. 直连 + CORS（快速）**：前端构建时设 `VITE_API_BASE=https://<render-service>.onrender.com` 重新发布 Pages；Render 端 CORS 已放行 Pages 域。注意前端 30s 超时 < 休眠唤醒 ~1min，首次请求可能报超时。

## 7. 上线验收（必须逐项通过）

1. `curl https://<render-url>/api/health` → 200 `{"status":"ok","model_loaded":true}`。
2. 页面注册 → 登录 → 上传诊断 → 历史可见。
3. **持久化验收**：新建一条测试留言 → Render Dashboard 手动 Restart Service → 复查留言仍在 → 删除测试数据。未通过此项不得宣布“数据不丢”。
4. 休眠唤醒：等 15 分钟后首请求，确认 ~1 分钟内恢复 200。

## 8. 本次未执行/未验证

- 未注册/登录 Render、Neon、Cloudflare；未创建任何云资源；未 push 仓库。
- Docker 镜像未构建（本机 Linux daemon 未运行）；Linux 下依赖安装未验证。
- 真实 PostgreSQL 连接、TLS、迁移执行、重启持久化——全部待用户授权后执行。
