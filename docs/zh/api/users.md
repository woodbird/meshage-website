---
title: 用户 API
description: 获取和更新用户信息、搜索用户
lastUpdated: true
---

# 用户 API

管理当前登录用户的个人信息，以及搜索平台上的其他用户。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## GET /users/me

获取当前登录用户的详细信息。

**请求：**

```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice",
  "avatar_url": "https://example.com/avatar.png",
  "bio": "Meshage 用户",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T12:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录 |

---

## PATCH /users/me

更新当前用户的个人资料。只需传递要修改的字段。

**请求：**

```bash
curl -X PATCH http://localhost:8000/api/v1/users/me \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Alice W.",
    "bio": "热爱编程的 Meshage 开发者",
    "avatar_url": "https://example.com/new-avatar.png"
  }'
```

**请求体（均为可选）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `display_name` | string | 显示名称，1-64 字符 |
| `bio` | string | 个人简介，最长 200 字符 |
| `avatar_url` | string | 头像 URL |

**成功响应：** `200 OK`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice W.",
  "avatar_url": "https://example.com/new-avatar.png",
  "bio": "热爱编程的 Meshage 开发者",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T14:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录 |
| `422 Unprocessable Entity` | 参数格式不合法 |

---

## GET /users/search

根据关键词搜索平台用户。

**请求：**

```bash
curl "http://localhost:8000/api/v1/users/search?q=alice&limit=10" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `q` | string | 是 | 搜索关键词（匹配用户名或显示名称） |
| `limit` | integer | 否 | 返回条数，默认 20，最大 50 |
| `offset` | integer | 否 | 分页偏移量，默认 0 |

**成功响应：** `200 OK`

```json
[
  {
    "id": "usr-550e8400...",
    "username": "alice",
    "display_name": "Alice",
    "avatar_url": "https://example.com/avatar.png"
  },
  {
    "id": "usr-660f9500...",
    "username": "alice_dev",
    "display_name": "Alice Developer",
    "avatar_url": null
  }
]
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录 |
| `422 Unprocessable Entity` | 缺少 `q` 参数 |
