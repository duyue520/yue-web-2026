# 越的网站 · heyiwei.tech

个人主页 + AI 农业病虫害诊断平台的完整源码与运维资产。

> 在线访问：**https://heyiwei.tech**
>
> 备案号：湘ICP备2026043109号-1

---

## ✨ 项目组成

| 模块 | 说明 | 目录 |
|------|------|------|
| 前端主站 | Vue 3 个人主页：壁纸切换、在线音乐、技能雷达图、项目卡片、打字机、粒子背景 | [`frontend/`](frontend/) |
| 病害诊断后端 | FastAPI + ONNX Runtime，39 类作物病害识别、Grad-CAM 热力图、严重度评估 | [`backend/`](backend/) |
| 运维与加固 | 服务器初始化、TLS、fail2ban、审计、完整性校验、流量熔断等脚本 | [`deploy/`](deploy/) |
| 文档 | 加固验收报告等 | [`docs/`](docs/) |

### 站点内的子应用

- `/campus/` — 三维云游校园（Three.js，建筑体量按公开卫星影像判读估算）
- `/qingming/` — 汴河图卷：宋代水市聚落生成器
- `/salarycat/` — 月薪喵互动页
- `/romance/*` — 节日互动小页面（烟花、雪花爱心等）

---

## 🎵 在线音乐（本站亮点）

前端在「音乐盒」中既支持本地歌单，也能**全网搜歌**：

- 搜索 / 歌词走网易公开接口，播放地址**官方接口优先 + 第三方解析器池兜底**
- 后端提供 `/api/music/search | song | lyric | stream`
- `/stream` 为 **HMAC 签名转发**（30 分钟有效期 + 域名白名单 + Range 支持），
  既解决了 HTTPS 页面无法播放 HTTP 直链的混合内容问题，也避免接口被当作开放代理盗刷
- 前端播放器为沉浸式设计：封面高斯模糊背景、点按封面/歌词切换、播放模式（顺序/单曲/随机）、播放队列抽屉
- 全部音乐接口需登录，并按 IP 限流（30 次/分钟）

> 解析器池通过环境变量 `MUSIC_RESOLVERS` 配置（`名称|URL模板`，`{id}`/`{level}` 占位），
> 失效可热插拔替换，无需改代码。

---

## 🌿 AI 病虫害诊断

- 模型：ResNet18（39 类），推理由 **ONNX Runtime** 承载（不依赖 PyTorch，2C/2G 小机器也能跑）
- 前端拍照/上传 → 后端返回 Top-3 病害、置信度、Grad-CAM 热力图与严重度分级
- 用户体系：JWT（7 天免登录）、诊断历史、个人中心、博客、留言板

---

## 🛠 技术栈

**前端**：Vue 3 · Vuetify 3 · Vite 5 · Three.js（粒子背景/三维校园）· Chart.js（技能雷达图）

**后端**：FastAPI · SQLAlchemy 2 · Alembic · PostgreSQL · ONNX Runtime · JWT(python-jose)

**部署**：Nginx（TLS 1.2/1.3 + gzip_static + 限流）· systemd · auditd · fail2ban · 自建完整性校验

---

## 🚀 本地运行

### 前端

```bash
cd frontend
npm install
npm run dev          # 开发（默认代理 /api → localhost:8000）
npm run build        # 生产构建 → dist/
```

站点外观、壁纸、歌单等全部集中在 `frontend/src/config.js`。

### 后端

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 必需的环境变量（绝不入库）
export DATABASE_URL="postgresql+psycopg://user:pass@host:5432/db?sslmode=require"
export SECRET_KEY="<至少 32 位随机字符串>"

python start.py              # 或：uvicorn server.main:app --host 127.0.0.1 --port 7860
```

接口文档：`http://127.0.0.1:7860/docs`

### 部署

`deploy/hardening/` 收录了从服务器初始化到加固验收的全套脚本（需按自己的环境修改域名、
路径与告警地址后使用）。生产环境建议：Nginx 反代 + systemd 守护 + 仅监听回环地址。

---

## 🔐 安全说明

本仓库**不包含任何生产凭据**：

- 数据库口令、`SECRET_KEY` 一律通过环境变量注入，仓库内只保留 `.env.example` 占位模板
- SSH 私钥、云端 AccessKey、服务商密钥文件均不在仓库内
- 加固脚本中的域名/路径为站点实际值，凭据类参数一律通过参数或环境变量传入

如果你的部署环境与本仓库结构一致，请务必自行生成全新的随机密钥，不要复用示例值。

---

## 📄 授权与致谢

- 前端基于开源个人主页模板二次开发（原模板说明见 `frontend/README.md`），遵循其原始许可（见 `frontend/LICENSE`）
- 站内壁纸、音乐等素材版权归原作者所有，仅供个人学习与展示使用
- 后端与运维脚本为本项目自研，可自由参考

---

## 📬 联系

- 站点留言板：https://heyiwei.tech
- GitHub：[@duyue520](https://github.com/duyue520)


---

## 📦 素材说明

为控制仓库体积与版权风险，**以下素材未纳入版本库**：

- `frontend/public/music/*.mp3`（本地歌单音频）
- `frontend/public/img/wallpaper/dynamic*/*`（动态壁纸视频）

站点在缺失这些文件时仍可正常运行（本地歌单为空、动态壁纸回退为静态图）。
如需完整体验，请自行将自有素材放入对应目录。在线搜歌功能不依赖这些文件。
