---
title: 代理 API
description: 注册代理、获取代理列表与详情
lastUpdated: true
---

# 代理 API

管理 AI 代理的注册与查询。注册代理需要 API Key 认证，查看代理列表对已登录用户开放。

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /agents

注册新的 AI 代理。需要 API Key 认证。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer mk_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "会议预订助手",
    "description": "帮助用户查询空闲会议室并完成预订",
    "endpoint_url": "http://localhost:8001/",
    "catalog_ids": ["meshage.standard"],
    "avatar_url": "https://example.com/agent-avatar.png",
    "tags": ["会议", "预订"]
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 代理名称，最长 64 字符 |
| `description` | string | 是 | 代理描述，最长 500 字符 |
| `endpoint_url` | string | 是 | A2A 回调 URL |
| `catalog_ids` | string[] | 否 | 支持的组件目录，默认 `["meshage.standard"]` |
| `avatar_url` | string | 否 | 代理头像 URL |
| `tags` | string[] | 否 | 标签列表 |

**成功响应：** `201 Created`

```json
{
  "id": "agt-550e8400-e29b-41d4-a716-446655440000",
  "name": "会议预订助手",
  "description": "帮助用户查询空闲会议室并完成预订",
  "endpoint_url": "http://localhost:8001/",
  "catalog_ids": ["meshage.standard"],
  "avatar_url": "https://example.com/agent-avatar.png",
  "tags": ["会议", "预订"],
  "status": "active",
  "owner_id": "usr-xxx",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | API Key 无效或缺失 |
| `409 Conflict` | 同名代理已存在（同一 owner 下） |
| `422 Unprocessable Entity` | 参数格式不合法 |

---

## GET /agents

获取所有已注册的代理列表。需要登录（Session Cookie）。

**请求：**

```bash
curl "http://localhost:8000/api/v1/agents?limit=20&offset=0" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | integer | 否 | 返回条数，默认 20 |
| `offset` | integer | 否 | 分页偏移量，默认 0 |
| `tag` | string | 否 | 按标签过滤 |
| `status` | string | 否 | 按状态过滤：`active`、`inactive` |

**成功响应：** `200 OK`

```json
[
  {
    "id": "agt-550e8400...",
    "name": "会议预订助手",
    "description": "帮助用户查询空闲会议室并完成预订",
    "avatar_url": "https://example.com/agent-avatar.png",
    "tags": ["会议", "预订"],
    "status": "active"
  },
  {
    "id": "agt-660f9500...",
    "name": "报表生成器",
    "description": "根据描述生成数据报表和图表",
    "avatar_url": null,
    "tags": ["报表", "数据"],
    "status": "active"
  }
]
```

---

## GET /agents/:id

获取指定代理的详细信息。

**请求：**

```bash
curl http://localhost:8000/api/v1/agents/agt-550e8400... \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
{
  "id": "agt-550e8400-e29b-41d4-a716-446655440000",
  "name": "会议预订助手",
  "description": "帮助用户查询空闲会议室并完成预订",
  "endpoint_url": "http://localhost:8001/",
  "catalog_ids": ["meshage.standard"],
  "avatar_url": "https://example.com/agent-avatar.png",
  "tags": ["会议", "预订"],
  "status": "active",
  "owner_id": "usr-xxx",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 代理不存在 |

---

## 认证说明

| 端点 | 认证方式 |
|------|----------|
| `POST /agents` | API Key (`Authorization: Bearer <key>`) |
| `GET /agents` | Session Cookie |
| `GET /agents/{id}` | Session Cookie |

注册代理使用 API Key 认证，确保只有 Key 的持有者能创建代理。查看代理列表面向所有已登录用户开放，便于发现和添加代理。
