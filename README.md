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

---

## 🚀 部署与恢复（换服务器也能一键重建）

完整部署手册见 **[deploy/README.md](deploy/README.md)**，配套脚本与配置已全部入库：

| 文件 | 用途 |
|---|---|
|  | 全新服务器从零部署手册（依赖/数据库/服务/nginx/HTTPS/验证/常见坑/迁移清单） |
| 包管理器: dnf

[1;36m== 1/8 安装系统依赖[0m
Last metadata expiration check: 7:12:12 ago on Sat 03 Oct 2026 04:20:58 AM CST.
Package python36-3.6.8-38.module+al8+10+4ba10e20.x86_64 is already installed.
Package gcc-10.2.1-3.9.al8.x86_64 is already installed.
Package make-1:4.2.1-11.0.1.al8.x86_64 is already installed.
Package nginx-1:1.24.0-3.0.1.2.al8.1.x86_64 is already installed.
Package postgresql-server-13.23-3.0.1.al8.x86_64 is already installed.
Package postgresql-13.23-3.0.1.al8.x86_64 is already installed.
Package git-2.43.7-1.0.1.al8.x86_64 is already installed.
Package curl-7.61.1-35.0.2.al8.13.x86_64 is already installed.
Package fail2ban-1.0.2-3.el8.noarch is already installed.
Dependencies resolved.
================================================================================
 Package            Arch      Version                  Repository          Size
================================================================================
Installing:
 gcc-c++            x86_64    10.2.1-3.9.al8           alinux3-updates     12 M
 python3-devel      x86_64    3.6.8-78.0.1.1.al8       alinux3-updates     69 k
Installing dependencies:
 libstdc++-devel    x86_64    10.2.1-3.9.al8           alinux3-updates    2.2 M

Transaction Summary
================================================================================
Install  3 Packages

Total download size: 14 M
Installed size: 42 M
Downloading Packages:
(1/3): python3-devel-3.6.8-78.0.1.1.al8.x86_64. 2.7 MB/s |  69 kB     00:00    
(2/3): libstdc++-devel-10.2.1-3.9.al8.x86_64.rp  19 MB/s | 2.2 MB     00:00    
(3/3): gcc-c++-10.2.1-3.9.al8.x86_64.rpm         36 MB/s |  12 MB     00:00    
--------------------------------------------------------------------------------
Total                                            43 MB/s |  14 MB     00:00     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1 
  Installing       : libstdc++-devel-10.2.1-3.9.al8.x86_64                  1/3 
  Installing       : gcc-c++-10.2.1-3.9.al8.x86_64                          2/3 
  Installing       : python3-devel-3.6.8-78.0.1.1.al8.x86_64                3/3 
  Running scriptlet: python3-devel-3.6.8-78.0.1.1.al8.x86_64                3/3 
  Verifying        : gcc-c++-10.2.1-3.9.al8.x86_64                          1/3 
  Verifying        : libstdc++-devel-10.2.1-3.9.al8.x86_64                  2/3 
  Verifying        : python3-devel-3.6.8-78.0.1.1.al8.x86_64                3/3 

Installed:
  gcc-c++-10.2.1-3.9.al8.x86_64           libstdc++-devel-10.2.1-3.9.al8.x86_64
  python3-devel-3.6.8-78.0.1.1.al8.x86_64

Complete!

[1;36m== 2/8 初始化数据库 wb_campus[0m
 数据库已存在，跳过建库

[1;36m== 3/8 部署后端到 /opt/wb-api[0m

[1;36m== 4/8 安装 Python 依赖（首次约 2~5 分钟）[0m

[1;36m== 5/8 安装 systemd 服务与定时器[0m

[1;36m== 6/8 配置 nginx[0m
[1;33m[!] nginx 配置校验失败，请检查 /etc/nginx/conf.d[0m

[1;36m== 7/8 构建并发布前端到 /var/www/site[0m
[1;33m[!] 未找到前端目录或 npm，跳过（可手工 build 后拷到 /var/www/site）[0m

[1;36m== 8/8 验证[0m
active
  wb-api: OK
{"status":"ok","model_loaded":true}== 资源完整性校验 ==
  主分块 OK: index-CATHZmVW.js (475658 字节)
  懒加载分块 OK: AiChat-C9kbY3C4.js
  懒加载分块 OK: AiGateway-CSVLn6S8.js
  懒加载分块 OK: ApproveDialog-Csh6_ZPm.js
  懒加载分块 OK: BlogPage-CbMpAzly.js
  懒加载分块 OK: chart-edwR_I7k.js
  懒加载分块 OK: DiseaseMain-G9xW2mzu.js
  懒加载分块 OK: Guestbook-CpDF97Ct.js
  懒加载分块 OK: polarchart-BEprCSYN.js
  懒加载分块 OK: ProfileDialog-CG4u8Z7R.js
  懒加载分块 OK: three.module-BUAXwejV.js
  懒加载分块 OK: vendor-B5k_eIJ3.js
  懒加载分块 OK: vuetify-Cj6MZGMR.js
VERIFY_OK 资源完整

============================================================
 部署完成 ✅
 下一步（必须手工）：
   1) 编辑 /opt/wb-api/.env —— 填 DATABASE_URL(=上面密码)/SECRET_KEY/AI_GW_ADMIN_TOKEN
   2) systemctl restart wb-api
   3) 配置 HTTPS：certbot --nginx -d heyiwei.tech -d www.heyiwei.tech
   4) 注入 AI 上游（豆包 sessionid 或 OpenAI 兼容 Key）→ 见 deploy/README.md 第 10 节
   5) 数据恢复（如有旧备份）：bash deploy/scripts/restore-all.sh <备份目录>
============================================================ | 一键安装（幂等，可重复执行）：依赖 → 建库 → venv → systemd → nginx → 前端构建 → 验证 |
|  | 后端环境变量模板（占位符，无真实密钥） |
|  | wb-api 服务 + 4 个守护定时器（备份/看门狗/攻击监控/流量熔断） |
|  | 站点、反代、限流、安全头、gzip 全套配置 |
|  | 数据库结构（14 张表），新机建库直接导入 |
| == 备份到 /var/backups/wb/20261003-113330
 - 数据库 wb_campus
   96K
 - .env（含密钥）
 - 站点文件 /var/www/site
 - 配置与证书
 - 源码版本: 2aad24f
== 完成：/var/backups/wb/20261003-113330
   恢复： bash deploy/scripts/restore-all.sh /var/backups/wb/20261003-113330 | 全量备份：DB + .env + 站点 + 配置证书 |
| 用法: deploy/scripts/restore-all.sh <备份目录> [--db-only|--site-only] | 从备份恢复（支持 --db-only / --site-only） |
| == 资源完整性校验 ==
  主分块 OK: index-CATHZmVW.js (475658 字节)
  懒加载分块 OK: AiChat-C9kbY3C4.js
  懒加载分块 OK: AiGateway-CSVLn6S8.js
  懒加载分块 OK: ApproveDialog-Csh6_ZPm.js
  懒加载分块 OK: BlogPage-CbMpAzly.js
  懒加载分块 OK: chart-edwR_I7k.js
  懒加载分块 OK: DiseaseMain-G9xW2mzu.js
  懒加载分块 OK: Guestbook-CpDF97Ct.js
  懒加载分块 OK: polarchart-BEprCSYN.js
  懒加载分块 OK: ProfileDialog-CG4u8Z7R.js
  懒加载分块 OK: three.module-BUAXwejV.js
  懒加载分块 OK: vendor-B5k_eIJ3.js
  懒加载分块 OK: vuetify-Cj6MZGMR.js
VERIFY_OK 资源完整 | 前端资源完整性校验（防白屏） |
| ==========================================================================
一、接口层
========================================================================== | 全站接口 + 静态 + 日志体检 |

**换服务器三步**：
== 备份到 /var/backups/wb/20261003-113340
 - 数据库 wb_campus
   96K
 - .env（含密钥）
 - 站点文件 /var/www/site
 - 配置与证书
 - 源码版本: 2aad24f
== 完成：/var/backups/wb/20261003-113340
   恢复： bash deploy/scripts/restore-all.sh /var/backups/wb/20261003-113340

> ⚠️ 不进仓库的东西（需自己保管）：、数据库里的用户数据、AI 上游凭证（豆包 sessionid）。
