---
title: Error Codes Reference
description: HTTP status codes, error response format, and common error scenarios
lastUpdated: true
---

# Error Codes Reference

Meshage APIs use standard HTTP status codes. On failure, the body is JSON with error details.

## Error response format

Common format:

```json
{
  "detail": "Error description"
}
```

Validation errors may return a list:

```json
{
  "detail": [
    {
      "loc": ["body", "username"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## HTTP status codes

### Success

| Code | Meaning | When |
|------|---------|------|
| `200 OK` | Success | GET, PATCH, many POST |
| `201 Created` | Resource created | POST create |
| `204 No Content` | Success, no body | DELETE |

### Client errors

#### 400 Bad Request

Invalid request or missing required fields.  
Example: `{"detail": "Request body cannot be empty"}`  
Common: invalid JSON, missing params, empty message content.

#### 401 Unauthorized

No valid credentials.  
Example: `{"detail": "Unauthenticated; please log in"}`  
Common: no `session_id` cookie, expired session, invalid API Key.

#### 403 Forbidden

Authenticated but not allowed to access the resource.  
Example: `{"detail": "Not allowed to access this conversation"}`  
Common: accessing another user’s conversation, approving someone else’s request.

#### 404 Not Found

Resource does not exist.  
Example: `{"detail": "User not found"}`  
Common: invalid user/conversation/message/agent/contact request ID.

#### 409 Conflict

Conflict with current state.  
Example: `{"detail": "Username already exists"}`  
Common: duplicate username, duplicate contact request, duplicate direct chat, approval already handled.

#### 422 Unprocessable Entity

Params valid in shape but not by business rules.  
Example: `{"detail": [{"loc": ["body","password"], "msg": "Password must be at least 8 characters", "type": "value_error"}]}`  
Common: password rules, invalid username chars, out-of-range values.

#### 429 Too Many Requests

Rate limit exceeded.  
Example: `{"detail": "Too many requests; try again later", "retry_after": 60}`  

| Endpoint | Limit |
|----------|-------|
| `POST /auth/login` | 10/min |
| `POST /auth/register` | 5/min |
| `POST /conversations/{id}/messages` | 60/min |
| Others | 120/min |

`retry_after` is the suggested wait in seconds.

### Server errors

#### 500 Internal Server Error

Server-side error.  
Example: `{"detail": "Internal server error; please try again later"}`  
Check logs, DB connectivity; report if persistent.

## A2A (JSON-RPC) error codes

Agent communication uses JSON-RPC 2.0 codes, separate from HTTP:

| Code | Meaning | When |
|------|---------|------|
| `-32700` | Parse error | Invalid JSON |
| `-32600` | Invalid request | Not valid JSON-RPC |
| `-32601` | Method not found | Unknown method |
| `-32602` | Invalid params | Bad params (including A2UI validation) |
| `-32603` | Internal error | Agent internal error |

See [A2A protocol](/en/developer/a2a-protocol).

## Client handling tips

- `401` → redirect to login
- `429` → wait `retry_after` then retry
- `5xx` → show “service temporarily unavailable”
- Always handle network errors and timeouts
