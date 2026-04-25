# **Mesh**age

**Next Gen IM with A2A&A2UI**

**Mesh**age 是面向未来的下一代即时通讯与协作平台：原生支持 **A2A（Agent-to-Agent）** 与 **A2UI（Agent-to-User Interface）**，将 IM 从「聊天工具」升级为**多代理协作的操作系统**。

本仓库是 [meshage.ai](https://meshage.ai) 的官网与文档中心源代码（Next.js 14 + Nextra 4）。

## 仓库结构

| 目录 | 用途 |
| --- | --- |
| `src/app/` | App Router 页面：首页、`/docs/[lang]/...` 文档、`/api/waitlist` 后端路由 |
| `src/components/` | 首页 Hero / Features / CTA / Header / Footer，以及文档反馈、语言切换组件 |
| `src/lib/` | 站点常量、文档主题文案 |
| `content/zh/`、`content/en/` | **官方文档源**（MDX/MD），由 Nextra 渲染。`_meta.js` 控制侧栏顺序与标题。 |
| `public/` | 图片、Logo、`_pagefind` 搜索索引（构建产物）。 |
| `specs/001-meshage-ai-website/` | 官网需求、计划、任务、waitlist API 契约。 |

> 唯一的文档发布源是 `content/`。早期的 `docs/` 目录（VitePress 残留）已经删除，请勿再创建。

## 本地开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。文档默认重定向到 `/docs/zh`，英文在 `/docs/en`。

## 构建与预览

```bash
npm run build        # next build；postbuild 生成 pagefind 搜索索引
npm run start        # 本地预览生产构建
```

## Waitlist 后端

`POST /api/waitlist` 校验请求体后写入 JSONL 文件并可选地转发到 Webhook。

| 环境变量 | 说明 |
| --- | --- |
| `MESHAGE_WAITLIST_FILE` | 完整的 JSONL 文件路径（最高优先级） |
| `MESHAGE_WAITLIST_DIR` | 仅指定目录，文件名固定为 `waitlist.jsonl` |
| `MESHAGE_WAITLIST_WEBHOOK` | 可选的 HTTPS Webhook，用于转发到 Slack/飞书/Resend 等 |

默认行为：开发环境写入 `./.data/waitlist.jsonl`（已加入 `.gitignore`），生产环境写入 `/tmp/meshage-waitlist.jsonl`。生产建议同时设置 Webhook，避免容器重启时丢失。

附带防滥用：每个 IP 60 秒内最多 5 次提交，单次请求体最大 4 KB。

## 部署到 Vercel

1. 在 Vercel 中导入仓库，框架选 **Next.js**。
2. 构建命令保持默认 `next build`，输出目录默认 `.next/`。
3. 在 **Project Settings → Environment Variables** 中按需配置：
   - `MESHAGE_WAITLIST_WEBHOOK`：把 waitlist 提交转发到外部存储或通知。
   - `NEXT_PUBLIC_API_BASE`：文档反馈组件调用的 MeshChat 后端 API 基址（默认 `http://localhost:8000`）。
4. 绑定自定义域名 `meshage.ai`（或子域名）。

## 文档维护约定

- 添加或修改文档：直接编辑 `content/zh` 或 `content/en` 下的 MD/MDX 文件，并同步 `_meta.js`。
- API 文档（`content/{lang}/api/`）来自 MeshChat 后端的 OpenAPI，可在主仓库执行：
  ```bash
  python scripts/generate-api-docs.py --url http://localhost:8000 --out-dir ../meshage-website/content
  ```
- 文档反馈按钮 (`DocFeedback`) 会调 MeshChat 后端 `POST /api/v1/docs/feedback`，需要 `NEXT_PUBLIC_API_BASE` 指向真实后端。

## 了解更多

- 官网：[https://meshage.ai](https://meshage.ai)
- 文档中心：官网内「Docs」或访问 `/docs/zh`、`/docs/en`
- 加入等待名单：访问首页底部表单
