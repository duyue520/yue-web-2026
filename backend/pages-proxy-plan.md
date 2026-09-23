# Pages 同源代理方案：GitHub Pages /api/* → Render 后端

## 前提

- 前端已上线 https://duyue520.github.io/（验证 200）。
- `src/services/api.js` 无 `VITE_API_BASE` 时 `getApiBase()` 返回 `''`，即同源 `/api/...`。
- 本次实测：`https://duyue520.github.io/api/health` 返回 **HTTP 404**。GitHub Pages 是纯静态托管，没有函数/代理运行时，**不能在 Pages 本身实现 /api/* 转发**；该 404 正是当前未打通的证据。
- 已验证的后端源码服务在本机合成测试通过；云端后端 URL 尚未创建，此文档中的 `https://leaf-personal-backend.onrender.com` 为占位，部署后以 Render 面板实际 URL 为准。

## 方案对比

| 方案 | 可行性 | 结论 |
| --- | --- | --- |
| Pages `_redirects`/proxy 规则 | Pages 无该机制（Netlify/Cloudflare 才有），重定向会改变浏览器可见 URL，fetch 也会跨域 | 不可行 |
| Pages Functions / GitHub Actions runtime | GitHub Pages 没有函数运行时 | 不可行 |
| **自定义域名 + Cloudflare（推荐）** | 把 duyue520.github.io 绑定自有域名接入 Cloudflare，用 Worker/Origin Rules 把 `/api/*` 转发到 Render；根路径走 GitHub Pages | 可行且免费，需要用户自有域名与 DNS 操作 |
| Cloudflare Worker 专属入口 | 前端仍托管 Pages，但 Worker 绑定独立路由（如 api.example.com）反代 Render | 可行；但这样又回到跨域，与“同源代理”目标冲突 |
| Vercel/Netlify 承载前端 + 平台函数代理 | 原生支持 `/api/*` rewrite；但需迁移前端托管，非本次范围 | 备选 |

**推荐路径**：用户在 Cloudflare 添加自有域名 → CNAME 到 `duyue520.github.io` → Pages 绑定该自定义域 → 建 Worker 路由 `自定义域/api/*` 反代 `https://<render-app>.onrender.com/api/*`。浏览器始终同源请求 `/api/...`，Worker 在服务端转发，无 CORS 问题；`CORS_ORIGINS` 仍保留 Pages 域做纵深防御。

## Worker 示例（Cloudflare Dashboard → Workers → Create）

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'leaf-personal-backend.onrender.com'; // 部署后替换为真实 Render 域名
    const upstream = new Request(url, request);
    const response = await fetch(upstream);
    const out = new Response(response.body, response);
    out.headers.set('X-Proxied-By', 'pages-api-worker');
    return out;
  },
};
```

路由绑定（Workers → 你的 Worker → Triggers → Routes）：`your-domain.com/api/*`。

## 迁移后验证清单

1. `https://your-domain.com/api/health` 返回 200 且 `{"status":"ok","model_loaded":true}`。
2. 页面注册/登录/诊断功能可用（请求 URL 保持同源 `/api/...`）。
3. `curl -s -o /dev/null -w '%{http_code}' https://your-domain.com/api/health` 为 200。
4. Render 免费档 15 分钟空闲会休眠，首次请求唤醒约 1 分钟，属预期；不视为代理故障。

## 若不迁移域名

保持 `CORS_ORIGINS=https://duyue520.github.io`，前端构建时设 `VITE_API_BASE=https://<render-app>.onrender.com`，走 CORS 而非同源代理。代价：浏览器直连 Render，冷启动 1 分钟内前端 30 秒超时可能先报错（`api.js` 已有 30s timeout），且离开本“同源代理”目标。两方案并列写入 README，部署时二选一。

## 本次未做

- 未创建 Cloudflare 账号/Worker/DNS 记录。
- 未修改 `leleo-home-page-main` 前端源码。
- 未申请自定义域名。
