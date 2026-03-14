---
title: 联系人 API
description: 添加联系人、管理联系人列表、处理联系人请求
lastUpdated: true
---

# 联系人 API

管理用户的联系人关系，包括添加、删除联系人，以及处理联系人请求。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## POST /contacts/by-id

通过用户 ID 发送添加联系人请求。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/contacts/by-id \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr-660f9500-xxxx",
    "message": "你好，我是 Alice"
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `user_id` | string | 是 | 目标用户 ID |
| `message` | string | 否 | 附言 |

**成功响应：** `201 Created`

```json
{
  "request_id": "creq-001",
  "from_user_id": "usr-550e8400...",
  "to_user_id": "usr-660f9500...",
  "status": "pending",
  "message": "你好，我是 Alice",
  "created_at": "2026-03-01T10:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 目标用户不存在 |
| `409 Conflict` | 已是联系人或已发送过请求 |

---

## GET /contacts

获取当前用户的联系人列表。

**请求：**

```bash
curl "http://localhost:8000/api/v1/contacts?limit=20&offset=0" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | integer | 否 | 返回条数，默认 20 |
| `offset` | integer | 否 | 分页偏移量，默认 0 |

**成功响应：** `200 OK`

```json
[
  {
    "id": "contact-001",
    "user": {
      "id": "usr-660f9500...",
      "username": "bob",
      "display_name": "Bob",
      "avatar_url": null
    },
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

---

## DELETE /contacts/:id {#delete-contact}

删除指定联系人。

**请求：**

```bash
curl -X DELETE http://localhost:8000/api/v1/contacts/contact-001 \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `204 No Content`

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 联系人不存在 |

---

## GET /contacts/resolve

根据用户名或手机号解析用户信息（用于添加联系人前的查找）。

**请求：**

```bash
curl "http://localhost:8000/api/v1/contacts/resolve?username=bob" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 目标用户名 |

**成功响应：** `200 OK`

```json
{
  "id": "usr-660f9500...",
  "username": "bob",
  "display_name": "Bob",
  "avatar_url": null
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 用户不存在 |

---

## POST /contacts/requests {#post-contacts-requests}

发送联系人请求（通用方式）。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/contacts/requests \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "to_user_id": "usr-660f9500...",
    "message": "请加我为好友"
  }'
```

**成功响应：** `201 Created`

```json
{
  "request_id": "creq-002",
  "status": "pending",
  "created_at": "2026-03-01T10:00:00Z"
}
```

---

## GET /contacts/requests {#get-contacts-requests}

获取收到的联系人请求列表。

**请求：**

```bash
curl http://localhost:8000/api/v1/contacts/requests \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
[
  {
    "request_id": "creq-003",
    "from_user": {
      "id": "usr-770a6600...",
      "username": "charlie",
      "display_name": "Charlie"
    },
    "message": "你好！",
    "status": "pending",
    "created_at": "2026-03-01T11:00:00Z"
  }
]
```

---

## PATCH /contacts/requests/:id {#patch-contact-request}

处理联系人请求（接受或拒绝）。

**请求：**

```bash
curl -X PATCH http://localhost:8000/api/v1/contacts/requests/creq-003 \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"action": "accept"}'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action` | string | 是 | `accept`（接受）或 `reject`（拒绝） |

**成功响应：** `200 OK`

```json
{
  "request_id": "creq-003",
  "status": "accepted",
  "updated_at": "2026-03-01T12:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 请求不存在 |
| `409 Conflict` | 请求已处理 |
