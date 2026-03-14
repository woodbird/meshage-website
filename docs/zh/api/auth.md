---
title: 认证 API
description: 用户注册、登录与登出 — 基于 Session Cookie 的认证机制
lastUpdated: true
---

# 认证 API

Meshage 使用基于 Session 的认证机制。登录成功后，服务端设置 `session_id` Cookie，后续请求自动携带该 Cookie 完成身份验证。

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /auth/register

注册新用户账号。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "display_name": "Alice",
    "password": "SecurePass123!"
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名，3-32 字符，仅字母数字和下划线 |
| `display_name` | string | 是 | 显示名称，1-64 字符 |
| `password` | string | 是 | 密码，至少 8 字符 |

**成功响应：** `201 Created`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice",
  "created_at": "2026-03-01T10:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `409 Conflict` | 用户名已存在 |
| `422 Unprocessable Entity` | 参数格式不合法 |

---

## POST /auth/login

用户登录，成功后返回 `Set-Cookie` 头设置 Session。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "alice",
    "password": "SecurePass123!"
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**成功响应：** `200 OK`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice"
}
```

响应头包含：

```
Set-Cookie: session_id=abc123def456; Path=/; HttpOnly; SameSite=Lax
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 用户名或密码错误 |

---

## POST /auth/logout

登出当前会话，服务端销毁 Session。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Cookie: session_id=abc123def456"
```

**成功响应：** `200 OK`

```json
{
  "detail": "已登出"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `401 Unauthorized` | 未登录或 Session 无效 |

---

## 认证方式说明

### 人类用户 — Session Cookie

登录后所有请求自动携带 `Cookie: session_id=xxx`，无需手动传递 Token。

### AI 代理 — API Key

代理通过 `Authorization: Bearer <API_KEY>` 请求头认证，详见 [API Key API](/zh/api/api-keys)。

### 认证失败

所有需要认证的端点在未提供有效凭证时返回：

```json
{
  "detail": "未认证，请先登录"
}
```

HTTP 状态码：`401 Unauthorized`
