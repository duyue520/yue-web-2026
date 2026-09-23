---
title: Leaf Personal Backend
emoji: 🌿
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 个人网站后端部署包（仅本机准备，未上线）

**状态：源码、模型、容器配置、初始迁移和测试已准备；真实 PostgreSQL、容器构建、云部署尚未完成。没有读取/复制原私人 app.db，没有公开推送。**

## 1. 免费免信用卡平台结论

核验时间：本次执行期间实时获取官方页面（政策会变化，创建界面优先）。

### 优先核验的 Hugging Face Docker Spaces：目前不满足新账号免卡免费要求

- [官方概览](https://huggingface.co/docs/hub/spaces-overview) 当前明确：创建 Gradio/Docker compute Space 需要个人 PRO 或组织 Team/Enterprise。CPU Basic 的 FREE 是**无按小时计算费**，不能据此声称新账号无需付费即可创建 Docker Space。Static Spaces 免费不能运行本后端。
- [官方源码](https://github.com/huggingface/hub-docs/blob/main/docs/hub/spaces-overview.md) 同时列出 CPU Basic 2 vCPU、16GB RAM、50GB 非持久磁盘。免费硬件空闲会休眠；历史文档常写 CPU Basic 48 小时，当前实际策略以账号为准，不保证常驻。
- 出站仅 80/443/8080；普通 PostgreSQL 5432 会被阻断。不能把 Neon 连接串端口改成 443 假装可连接：服务端必须真的支持该协议。此包使用 PostgreSQL wire protocol，**未实现 HTTPS 数据库网关**。
- [存储说明](https://huggingface.co/docs/hub/spaces-storage)：重启或停止后本地磁盘会丢失。禁止将 SQLite 放 /app 或未经证实的 /data；禁止定时提交私人数据库到公开仓库作为“持久化”。
- 因此 HF 仅保留容器兼容配置：以后已获得有效 compute 权益且数据库网络通路经真实验证，才可以使用。本次不购买、不创建、不发布。

### 具体备选：Render Free Docker + Neon Free PostgreSQL（条件方案）

- [Render 免费服务](https://render.com/docs/free)：Docker Web Service，`render.yaml` 明确 `plan: free`；15 分钟空闲休眠，下一请求唤醒约 1 分钟。容器磁盘非持久，免费时数/流量/构建额度有限。账号注册可能触发风控/付款方式验证；本次未登录，**不能保证本账号免卡可开通**。
- Render Free 小内存实例（通常 512MB）对 PyTorch + Grad-CAM 风险较高：当前保留全部功能的 CPU 容器仍须验证 RSS、OOM 和冷启动；未声称能在该规格稳定运行。不要自动切付费。后续如超内存，应另行批准 ONNX-only 精简（会失去当前 Grad-CAM），不是本包偷偷降级。
- [Neon Free 定价](https://neon.com/pricing) 实时页面明确 no credit card required、每项目 0.5GB；免费计算配额与 scale-to-zero 会带来冷启动。连接 PostgreSQL 时用 TLS。外置数据不会随 Web 容器重启丢失，但免费额度不等于无限存储/长期备份保证。
- 不选 Render 免费 PostgreSQL 作为长期数据保管方案；本包默认外部 Neon PostgreSQL。缩略图和头像仍在数据库里，0.5GB 很容易耗尽，应建立配额监控和独立备份。

**阻塞：没有 HF 登录、没有授权的持久化数据库连接串；Render 可用性/免卡状态、内存容量未验证。不存在已完成的免费线上后端。**

## 2. 包内内容与修正

只复制原 `server/**/*.py` 和 `weights/best_model.pth`，未复制 ONNX 重复权重、训练集、训练输出、管理员脚本、凭据、数据库、前端素材。

- FastAPI + SQLAlchemy；ResNet18 CPU，39 类、224×224，PBKDF2 密码、JWT。
- `best_model.pth` 44,865,675 bytes，SHA256：`e0b51e4c73cae7190986aaf8e6d0693609c96cae1c1d6323df28ed889b1cfc11`。
- 不把原注释的 99.4% 当本次测得准确率；仅验证模型实际加载和合成图片推理。类别顺序来自原 CLASS_CN，未来应与训练 class_to_idx 独立复核。
- 原 SECRET_KEY 有公开默认值：本包不保留回退，必须一次生成并持久保存 Secrets；启动时不能随机生成，否则重启让所有 JWT 失效。
- DATABASE_URL 必填，只允许 PostgreSQL，TLS require 或更强；缺失、SQLite、无 TLS 都拒绝启动。没有临时 SQLite 开关。
- 移除 blog/guestbook 路由导入即建表；初始迁移 `0001` 显式运行，启动只核对 revision，数据库坏了不能悄悄生成空库。
- 修复留言删除中未定义 user 和按可修改用户名判断归属；删除/修改依赖真实登录和用户 ID；移除博客硬编码用户名管理员特权（现仅作者权限）。
- 匿名博客评论 user_id 改 NULL，避免 PostgreSQL FK 拒绝原 0 值；保留匿名评论功能。
- 已登录诊断保存失败明确 503，不返回虚假的“保存成功”；纠错记录校验归属。
- 精确 HTTPS CORS、无 cookie credentials；限制总请求体 12MB、图片像素、批量 5 张、单进程写入全局 60 次/分钟。全局限流不是分布式 WAF，重启会重置计数；不能代替对公开服务的持续防滥用。
- 7860/PORT、0.0.0.0、非 root UID 1000、单 worker、CPU-only torch、headless OpenCV；健康检查同时检查模型与数据库连接。

## 3. 本地构建与迁移（下一步；没有自动执行云操作）

1. 先取得真正允许使用的 Neon Free 项目，使用**新空数据库**。将 connection string 放平台 Secret `DATABASE_URL`，使用 `postgresql+psycopg://USER:PASSWORD@HOST/DB?sslmode=require`；密码须 URL 编码。不把连接串放前端、git、日志或聊天。
2. 使用密码管理器生成不少于 32 字符的随机 SECRET_KEY，存为平台 Secret。设置 `CORS_ORIGINS=https://你的前端域名`，多个用逗号分隔；GitHub Pages 填 `https://用户名.github.io` 而非仓库子路径。
3. 创建本地 `.env`（参考 `.env.example`，已被忽略）。**不要提交它**。Docker Desktop Linux engine 启动后执行：

```powershell
cd 'F:\github好看网站\deployment-backend'
docker build -t leaf-personal-backend:local .
# 此命令修改目标数据库，只对新空库并在获准后运行一次：
docker run --rm --env-file .env leaf-personal-backend:local python -m alembic upgrade head
# 不含自动迁移；revision 不匹配则启动失败
docker run --rm --env-file .env -p 7860:7860 leaf-personal-backend:local
```

4. 审核变更和模型发布权后，再决定是否把**本部署目录**推到私有仓库并连接 Render Docker。此文档不是公开发布授权。本次无 push、无创建服务、无更改原项目。
5. Render 应使用平台分配的 HTTPS 后端 URL，`PORT` 已支持；健康路径 `/api/health`。数据库先完成迁移，后启动服务；不要自动 reset/stamp 旧库。
6. 前端原 `src/services/api.js` 已支持 `VITE_API_BASE`；构建时设 `VITE_API_BASE=https://你的后端域名`（不要末尾 /api，因为代码已添加 /api）。前端现 30 秒超时短于休眠冷启动，需要后续前端发布时增加首次唤醒提示/重试。此包不改前端。
7. 上线后验证 HTTPS health、CORS、注册/登录、留言、诊断/历史；创建一条专用测试记录，重启 Web 服务后复核仍在，再回收测试记录。未通过此步不能宣布持久化验收。

## 4. 数据迁移与备份

详见 `MIGRATION.md`。现仅根据源码得到 8 张业务表，**未读取原数据库 schema 或记录**，不确认其实际版本。新库迁移不等于旧用户数据迁移。旧库导入需要单独授权和私密备份/转换/校验，禁止直接上传 app.db。

## 5. 已验证 / 未验证

详见 `VERIFICATION.md`。测试命令：

```powershell
& 'D:\anaconda\envs\pythonproject\python.exe' tests/static_checks.py
& 'D:\anaconda\envs\pythonproject\python.exe' tests/smoke.py
```

`.test-deps` 仅本机隔离测试依赖，git/docker 都排除；既有 Python 环境未被 pip 修改。Docker 使用 requirements.txt。依赖只固定直接版本，非含 hash 的完整 lock；Linux 镜像必须实际 build 和安装审计后才算构建验收。
