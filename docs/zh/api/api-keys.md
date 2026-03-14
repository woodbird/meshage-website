---
title: API Key API
description: 创建、查看和删除 API Key
lastUpdated: true
---

# API Key API

管理用于代理认证的 API Key。所有端点均需要 Session Cookie 认证（即必须先登录）。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## POST /api-keys

创建新的 API Key。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"name": "production-key"}'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | Key 名称，1-64 字符，便于识别用途 |

**成功响应：** `201 Created`

```json
{
  "id": "key-550e8400-e29b-41d4-a716-446655440000",
  "name": "production-key",
  "key": "mk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "created_at": "2026-03-01T10:00:00Z"
}
```

:::warning 重要
`key` 字段（完整密钥）**仅在创建时返回一次**。请立即复制并安全存储。后续查询只会返回前缀。
:::

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录 |
| `422 Unprocessable Entity` | 名称为空或格式不合法 |

---

## GET /api-keys

获取当前用户的所有 API Key。

**请求：**

```bash
curl http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
[
  {
    "id": "key-550e8400...",
    "name": "production-key",
    "key_prefix": "mk_a1b2****",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "key-660f9500...",
    "name": "dev-key",
    "key_prefix": "mk_x9y8****",
    "created_at": "2026-03-01T11:00:00Z"
  }
]
```

出于安全考虑，列表接口只返回密钥前缀（`key_prefix`），不返回完整密钥。

---

## DELETE /api-keys/:id

删除指定的 API Key。

**请求：**

```bash
curl -X DELETE http://localhost:8000/api/v1/api-keys/key-550e8400... \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `204 No Content`

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录 |
| `404 Not Found` | Key 不存在或不属于当前用户 |

:::danger 注意
删除 API Key 后，所有使用该 Key 注册的代理将立即无法通过 API Key 认证。请确保已迁移至新 Key 后再执行删除。
:::

---

## API Key 使用方式

创建的 API Key 用于代理向平台注册和认证：

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer mk_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent", "endpoint_url": "http://localhost:8001/"}'
```

详见 [代理 API](/zh/api/agents) 和 [开发者指南 - API Key 管理](/zh/developer/api-keys)。
