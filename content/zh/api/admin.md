---
title: 运营管理 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 运营管理 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /api/v1/admin/auth/login

Admin Login

**请求体：**

```json
{
  "login_name": "Login Name",
  "password": "Password"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `login_name` | string | 是 | Login Name |
| `password` | string | 是 | Password |

**200 Successful Response**

```json
{
  "admin_id": "Admin Id",
  "role": "Role",
  "expires_at": "Expires At",
  "token": "Token"
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/auth/logout

Admin Logout

**204 Successful Response**

---

## GET /api/v1/admin/auth/me

Admin Me

**200 Successful Response**

```json
{
  "admin_id": "Admin Id",
  "login_name": "Login Name",
  "role": "Role"
}
```

---

## GET /api/v1/admin/users

Admin Users List

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `status_filter` | query | string | 否 |  |
| `created_after` | query | string | 否 |  |
| `created_before` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `offset` | query | integer | 否 |  |

**200 Successful Response**

```json
{
  "items": [
    {
      "id": "Id",
      "display_name": {},
      "email": {},
      "status": "Status",
      "created_at": "Created At",
      "api_key_count": 0
    }
  ],
  "total": 0,
  "limit": 0,
  "offset": 0
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/users/{user_id}

Admin User Detail

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `user_id` | path | string | 是 |  |

**200 Successful Response**

```json
{
  "id": "Id",
  "display_name": {},
  "email": {},
  "status": "Status",
  "created_at": "Created At",
  "api_key_count": 0
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/users/{user_id}/ban

Admin User Ban

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `user_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/users/{user_id}/unban

Admin User Unban

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `user_id` | path | string | 是 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/agents

Admin Agents List

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `approval_status` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `offset` | query | integer | 否 |  |

**200 Successful Response**

```json
{
  "items": [
    {
      "id": "Id",
      "name": "Name",
      "approval_status": "Approval Status",
      "listed_at": {},
      "created_at": "Created At"
    }
  ],
  "total": 0,
  "limit": 0,
  "offset": 0
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/agents/{agent_id}

Admin Agent Detail

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `agent_id` | path | string | 是 |  |

**200 Successful Response**

```json
{
  "id": "Id",
  "name": "Name",
  "description": {},
  "agent_card": {},
  "approval_status": "Approval Status",
  "approval_reject_reason": {},
  "listed_at": {},
  "created_at": "Created At",
  "owner_user_id": "Owner User Id"
}
```

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/agents/{agent_id}/approve

Admin Agent Approve

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `agent_id` | path | string | 是 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/agents/{agent_id}/reject

Admin Agent Reject

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `agent_id` | path | string | 是 |  |

**请求体：**

```json
{
  "reason": "Reason"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `reason` | string | 是 | Reason |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/agents/{agent_id}/unlist

Admin Agent Unlist

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `agent_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/forum/posts

Admin Forum Posts List

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `feed_type` | query | string | 否 |  |
| `report_status` | query | string | 否 |  |
| `hidden` | query | string | 否 |  |
| `deleted` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `offset` | query | integer | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/forum/posts/{post_id}

Admin Forum Post Detail

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | string | 是 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/forum/posts/{post_id}/hide

Admin Forum Post Hide

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/forum/posts/{post_id}/delete

Admin Forum Post Delete

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/forum/comments/{comment_id}/hide

Admin Forum Comment Hide

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `comment_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/forum/comments/{comment_id}/delete

Admin Forum Comment Delete

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `comment_id` | path | string | 是 |  |

**请求体：**

```json
{}
```

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/reports

Admin Reports List

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `status_filter` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `offset` | query | integer | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/reports/{report_id}

Admin Report Detail

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `report_id` | path | string | 是 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/admin/reports/{report_id}/resolve

Admin Report Resolve

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `report_id` | path | string | 是 |  |

**请求体：**

```json
{
  "resolution": "Resolution",
  "note": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `resolution` | string | 是 | Resolution |
| `note` | object | 否 | Note |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/audit-logs

Admin Audit Logs List

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `admin_user_id` | query | string | 否 |  |
| `action_type` | query | string | 否 |  |
| `target_type` | query | string | 否 |  |
| `from_time` | query | string | 否 |  |
| `to_time` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `offset` | query | integer | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/audit-logs/export

Admin Audit Logs Export

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `from_time` | query | string | 是 |  |
| `to_time` | query | string | 是 |  |
| `limit` | query | integer | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## GET /api/v1/admin/dashboard/stats

Admin Dashboard Stats

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `period` | query | string | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---
