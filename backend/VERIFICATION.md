# 验证记录

执行于本机，原源码和私人数据库未修改�?
## 工具与环�?
- 先加�?machine-tool-inventory 并运�?refresh。首个组合格式化命令出现 FormatEntryData 序列错误；分离文本查询后成功，后续完�?refresh 也完成�?- 当前工作目录通过 pwd 确认 D:\工作区\交接；后续命令显�?workdir�?- Python：D:\anaconda\envs\pythonproject\python.exe，Python 3.12，已存在 torch 2.11.0+cu128 / torchvision 0.26.0+cu128。测试显�?CPU，容器计�?CPU wheel�?- 缺少 psycopg/alembic，安装到本包 `.test-deps` 隔离目录；不修改原应用环境、不打进镜像�?- Docker CLI 29.3.1 �?C:\Program Files\Docker\Docker\resources\bin\docker.exe；Linux daemon pipe 不存在，故未 docker build/run。不是已成功构建镜像�?
## PASS

1. `tests/static_checks.py`�?6 �?Python 文件 AST 语法通过�?2. �?DATABASE_URL、SQLite URL、无 TLS PostgreSQL、空/默认 SECRET_KEY、通配 CORS 均抛 RuntimeError（fail-closed）�?3. 0001 初始迁移实际应用到合成内�?SQLite，并通过 Alembic compare_metadata �?ORM 一致；匿名评论外键允许 NULL�?4. `alembic upgrade head --sql`：成功离线生�?PostgreSQL 方言 SQL�? 张业务表/索引/外键�?revision。没有连�?localhost 或任何远�?PostgreSQL�?5. 复制权重 SHA256 一致；包内�?*.db / *.sqlite�?6. `tests/smoke.py` 使用完整 FastAPI lifespan、真�?PyTorch 模型和合成内存数据库：模型加�?推理、用户注册、JWT、留言 POST/GET/删除、另一用户禁止删除、坏 JWT、博客文章和匿名评论、CORS 预检、错�?origin、诊断落�?用户隔离、Excel 导出全部通过�?7. 另启动真�?Uvicorn TCP 回环监听、GET `/api/health`，实际响�?HTTP 200 `{"status":"ok","model_loaded":true}`；该进程仅替换内存测试数据库，不改生产配置。请求后正常停止，无遗留服务�?8. 原私�?app.db 未打开、未复制；没有公开发布�?
## 失败/未完成（不能算通过�?
- pip `--dry-run --ignore-installed -r requirements.txt` 在镜像下载依赖时 120 秒超时，已获取多项存在的 wheel，但完整解析未结束，不能声称依赖安装/容器构建已验收。现采用已安装同系列直接版本 + psycopg/alembic 固定版本；Linux CPU PyTorch、headless OpenCV 组合需要实�?build�?- TestClient 输出 StarletteDeprecationWarning（httpx 迁移�?httpx2）；测试仍通过，不是错误�?- PostgreSQL 真连接、TLS、事�?序列、迁移在线执行、外键完整性在�?PostgreSQL 上均未测试；没有持久化连接串和授权�?- 云端域名/HTTPS、空间创建权限、HF 443 出站路径、Render 512MB RSS/OOM 和冷启动、容器健康检查，未测试�?- 训练类别映射与准确率未重新评估；真实 Grad-CAM 输出和批量边界未测。原 PDF 导出仍为 501�?- 本地模型�?44.9MB 不代�?PyTorch 运行时只�?44.9MB，不能据此承诺小内存免费容器适配�?- 没有读取原旧�?schema 或记录；数据迁移没有发生。生产持久化重启测试仍是上线阻塞�?
## 本轮新增验证（前端已上线后）

- https://duyue520.github.io/ �?HTTP 200；`https://duyue520.github.io/api/health` �?**404**（Pages 无代理运行时、后端未部署，属预期，已写入 pages-proxy-plan.md）�?- Render 官方 llms-full.txt 实时抓取：Free web service �?persistent disk，restart/redeploy/spin-down 后文件全丢；Free Render Postgres 30 天过期（14 天宽限后**连数据删�?*）、无备份�?GB 上限；每工作区每�?750 免费 instance 小时�?- GitHub CLI 实测已登�?`duyue520`（与 Pages 同账号，scope �?repo/workflow）�?- 实际创建私有仓库 **github.com/duyue520/leaf-personal-backend**（visibility=PRIVATE �?API 确认），push 39 个文件含 44,865,675B 模型（API 校验 size 一致）；commit 前静态检查与 smoke 测试再次 PASS�?- Actions secrets 可写已验证（写入并删除占�?secret 成功）；当前 secret 列表为空�?*未存任何真实凭据**�?- Pages 源仓库为 `duyue520/duyue520.github.io`�?
## 本轮明确未做

- 未注�?登录 Render、Neon、Cloudflare（无凭据、审批禁用）；未创建任何云服务�?- 未设置真�?`DATABASE_URL`/`SECRET_KEY` secrets（等待用户提�?Neon 连接串并生成 key）�?- 未构�?Docker 镜像；未执行 `alembic upgrade head`；未做重启持久化验收�?- 未修�?`duyue520.github.io` 仓库内容�?

- C:\Users\34498\.cache\huggingface\token：不存在�?- C:\Users\34498\.cache\huggingface\stored_tokens：不存在�?- C:\Users\34498\.huggingface\token：不存在�?- HF_HOME/HF_TOKEN_PATH 没有提供额外文件；HF_TOKEN、HUGGING_FACE_HUB_TOKEN 均未设置�?- 因无凭据，没有调�?whoami；状态应为“未发现可用登录”，不是凭空认证成功或失效。未读取浏览器密�?别的服务凭据�?- DATABASE_URL 环境变量未设置。本次不扫描私人配置中的连接串，也不擅自开通持久化服务�?