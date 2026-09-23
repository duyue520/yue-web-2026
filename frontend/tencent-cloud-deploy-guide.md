# 🚀 Leleo 个人主页 - 腾讯云免费部署指南

> 本项目基于 Vite + Vue 3，属于纯前端静态项目。
> **腾讯云有免费额度！不用花钱也能部署！** 🎉

---

## 📋 目录

- [腾讯云免费资源一览](#腾讯云免费资源一览)
- [方案一：CloudBase 云开发（免费，推荐）](#方案一cloudbase-云开发免费推荐)
- [方案二：COS + CDN（新用户免费6个月）](#方案二cos--cdn新用户免费6个月)
- [方案三：CVM 云服务器 + Nginx](#方案三cvm-云服务器--nginx)
- [构建项目](#构建项目)
- [常见问题](#常见问题)

---

## 腾讯云免费资源一览

| 服务 | 免费额度 | 有效期 |
|-----|---------|-------|
| 🌩️ **CloudBase 云开发** | 静态托管 **5GB 流量/月** + **2GB 存储** + 2万次调用/月 | **长期免费** |
| 📦 **COS 对象存储** | **50GB 存储** + **10GB CDN 流量** | 新用户 **6个月** |
| 🔒 **SSL 证书** | 免费申请 DV 证书 | **1年**，到期可续 |

> 💡 **推荐策略**：先注册腾讯云，用 CloudBase 免费额度部署，完全零成本！


---

## 构建项目

无论哪种方案，首先需要构建生产版本：

```bash
# 进入项目目录
cd leleo-home-page-main

# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，里面就是需要部署的静态文件。

---

## 🌟 方案一：CloudBase 云开发（长期免费，强烈推荐）

### 免费额度
| 资源 | 免费额度 |
|-----|---------|
| 静态网站托管 | **5GB 流量/月** + **2GB 存储空间** |
| 云函数调用 | **2万次/月** |
| CDN 加速 | 自带 CDN，无额外费用 |
| HTTPS | 免费 SSL 证书 |

> 个人主页流量很小，**免费额度完全够用，永远不收费**！

### 适用场景
- ✅ 想**一分钱不花**部署网站
- ✅ 纯前端静态站点
- ✅ 未来可能需要云函数、数据库
- ✅ 想要自动 CI/CD

### 步骤

#### 1. 注册腾讯云（已有账号跳过）

1. 访问 [腾讯云官网](https://cloud.tencent.com)
2. 微信扫码注册即可

#### 2. 开通 CloudBase

1. 访问 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 点击 **新建环境**
3. 计费方式选择 **按量计费**（免费额度内不扣费）
4. 环境名称：`leleo-home-page`
5. 点击确定，等待创建完成

#### 3. 安装 CloudBase CLI 并部署

```bash
# 安装 CloudBase CLI
npm install -g @cloudbase/cli

# 登录腾讯云（会弹出浏览器扫码）
tcb login

# 部署静态网站到你的环境
tcb hosting deploy dist/ -e 你的环境ID
```

#### 4. 配置托管路由（解决 SPA 刷新 404）

1. 在控制台进入 **云开发** > **静态网站托管**
2. 点击 **路由配置**
3. 添加规则：
   ```
   来源URL: /*
   目标URL: /index.html
   状态码: 200
   ```
4. 获取默认访问域名（如 `https://xxx-xxx.tcloudbaseapp.com`）
5. ✅ 现在你的网站已经可以访问了！

#### 5. 绑定自定义域名（可选，有域名的话）

1. 在 **静态网站托管** > **域名管理**
2. 点击 **添加域名**
3. 输入你的域名（如 `www.leleo.top`）
4. 在 DNS 解析中添加 CNAME 记录
5. **免费开启 HTTPS**：一键配置

#### 6. 配置 GitHub 自动部署（一劳永逸）

1. 在 CloudBase 控制台，进入 **云开发** > **应用**
2. 点击 **新建应用** > **从 GitHub 导入**
3. 授权 GitHub，选择你的仓库
4. 配置构建参数：
   | 参数 | 值 |
   |-----|----|
   | 构建命令 | `npm install && npm run build` |
   | 输出目录 | `dist` |
5. 之后每次 `git push` 代码，自动构建部署 ✨

---

## 方案二：COS + CDN（新用户免费6个月，也很划算）

### 免费额度（新用户专享）
| 资源 | 免费额度 |
|-----|---------|
| COS 存储 | **50GB 标准存储** |
| CDN 流量 | **10GB/月** |
| 有效期 | **6个月** |

> 你的个人主页总共才几十 MB，50GB 够用很久很久！

### 费用（免费额度用完后）
- COS 存储：约 0.099 元/GB/月
- CDN 流量：约 0.18 元/GB
- **实际费用**：按你的网站浏览量，可能一年也就几块钱

### 步骤

#### 1. 创建 COS 存储桶

1. 登录 [腾讯云 COS 控制台](https://console.cloud.tencent.com/cos)
2. 点击 **创建存储桶**
3. 配置如下：
   - **名称**：`leleo-home-page`（自定义）
   - **所属地域**：选择离你最近的地域（如 `成都`）
   - **访问权限**：选择 **公有读私有写**
   - **服务端加密**：关闭
4. 点击 **确定**

#### 2. 上传静态文件

**方式一：控制台直接上传（最简单）**
1. 进入刚创建的存储桶
2. 点击 **上传文件**，选择 `dist/` 目录下所有文件
3. 确保 `index.html` 在根目录

**方式二：使用 COSCMD 工具（适合后续更新）**
```bash
# 安装 COSCMD
pip install coscmd

# 配置
coscmd config -a 你的SecretId -s 你的SecretKey -b leleo-home-page -r ap-chengdu

# 上传
coscmd upload -r dist/ /
```

#### 3. 开启静态网站托管

1. 在存储桶 **基础配置** > **静态网站**
2. 点击 **编辑**，开启静态网站
3. 配置：
   - **索引文档**：`index.html`
   - **错误文档**：`index.html`（重要！解决 SPA 刷新 404）
4. 点击 **保存**
5. 记录 **访问域名**，直接打开就能看到你的网站了！

#### 4. 配置 CDN 加速 + 免费 HTTPS

1. 进入 [CDN 控制台](https://console.cloud.tencent.com/cdn)
2. 点击 **添加域名**
3. 配置：
   - **域名**：你的自定义域名（如 `www.leleo.top`）
   - **源站类型**：选择 **COS源**
   - **源站地址**：选择刚才创建的存储桶
4. 在 **HTTPS 配置** 中 **免费申请 SSL 证书**
5. 在域名 DNS 服务商处添加 CNAME 记录

---

## 方案三：CVM 云服务器 + Nginx（不推荐，需付费）

### 适用场景
- 已有云服务器
- 需要更多服务器控制权
- 需要部署后端服务

### 步骤

#### 1. 购买 CVM 云服务器

1. 进入 [CVM 控制台](https://console.cloud.tencent.com/cvm)
2. 点击 **新建**
3. 推荐配置（最低成本）：
   - **计费模式**：按量计费（或包年包月）
   - **地域**：离你近的
   - **实例**：2核2G（够用）
   - **镜像**：Ubuntu 22.04 / CentOS 7.9
   - **带宽**：按流量计费

#### 2. 安装 Nginx 并部署

```bash
# 通过 SSH 连接到你的服务器
ssh root@你的服务器IP

# 安装 Nginx
# Ubuntu:
apt update && apt install -y nginx

# CentOS:
yum install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx

# 配置防火墙（如果开启了）
ufw allow 80
ufw allow 443
```

#### 3. 上传项目文件

**方式一：SCP 上传**
```bash
# 本地执行（在 dist 目录所在路径）
scp -r dist/* root@你的服务器IP:/var/www/html/
```

**方式二：使用 FileZilla / WinSCP**

#### 4. 配置 Nginx

```bash
# 编辑 Nginx 配置
vim /etc/nginx/sites-available/leleo

# 写入以下配置
server {
    listen 80;
    server_name www.leleo.top;  # 改为你的域名或 IP
    root /var/www/html;
    index index.html;

    # 重要：SPA 路由重定向
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|webm|mp4)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# 启用配置
ln -s /etc/nginx/sites-available/leleo /etc/nginx/sites-enabled/
nginx -t  # 测试配置是否正确
systemctl reload nginx
```

#### 5. 配置 HTTPS（使用 Certbot）

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
certbot --nginx -d www.leleo.top

# 自动续期测试
certbot renew --dry-run
```

---

## 域名配置总结

无论哪种方案，都需要配置域名 DNS：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | www | CDN/COS/CloudBase 分配的 CNAME 域名 |
| CNAME | @ | 同上（如果根域名也要）|

---

## 常见问题

### Q1: 页面刷新后 404？
SPA 路由问题，需要将所有路径指向 `index.html`：
- **COS 方案**：错误文档设置为 `index.html`
- **CloudBase 方案**：配置路由规则 `/* -> index.html`
- **Nginx 方案**：添加 `try_files $uri $uri/ /index.html;`

### Q2: 配置文件中使用了本地路径图片，部署后失效？
检查 `config.js` 中的图片路径：
- 如果是相对路径（如 `/img/avatar.jpg`），确保文件已上传
- 建议将大文件上传至 COS 或图床，使用 CDN 链接

### Q3: 音乐播放功能异常？
音乐播放器依赖 MetingJS API，确保：
- 在浏览器中测试时没有跨域问题
- 如需稳定使用，建议自建 Meting API 服务

### Q4: 如何配置自己的域名？
1. 首先在腾讯云购买域名（或使用已有域名）
2. 根据所选方案，在相应服务中添加域名绑定
3. 在域名 DNS 解析中添加 CNAME 记录
4. 配置 SSL 证书

---

## 🎯 推荐选择

| 方案 | 成本 | 免费额度 | 推荐场景 |
|-----|------|---------|---------|
| 🌟 **CloudBase 云开发** | **免费** 🆓 | **5GB流量/月 + 2GB存储（长期）** | **首选！纯静态站点，零成本永久使用** |
| 📦 **COS + CDN** | 约¥0.1/月起 | 新用户50GB存储+10GB流量（6个月） | 有自定义域名，需要更灵活的配置 |
| 💻 **CVM + Nginx** | ¥50+/月起 | 无免费 | 已有服务器或需要部署后端 |

---

## 💡 小提示

1. **备案问题**：如果域名指向中国大陆服务器，需要 ICP 备案
2. **SEO 优化**：Vue SPA 默认对搜索引擎不友好，如需 SEO 可考虑 Vite SSR/SSG
3. **图床建议**：大图片建议上传至 COS 或第三方图床，减少服务器负载
4. **监控告警**：可以配置腾讯云云监控，查看访问量和异常

> 攻略制作于 2026 年，价格和操作可能因腾讯云更新而有所变化。
