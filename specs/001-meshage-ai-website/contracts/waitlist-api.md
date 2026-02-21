# Waitlist / Contact API Contract

**Feature**: 001-meshage-ai-website  
**Optional**: Used only if the implementation uses a custom Vercel serverless route instead of a third-party form service.

## Endpoint

`POST /api/waitlist` (or `POST /api/contact`)

## Request

**Content-Type**: `application/json`

| Field   | Type   | Required | Description                |
|---------|--------|----------|----------------------------|
| email   | string | yes      | Valid email address        |
| name    | string | no       | Submitter name             |
| message | string | no       | Optional message           |

**Example**:
```json
{
  "email": "user@example.com",
  "name": "Jane Doe",
  "message": "Interested in early access"
}
```

## Response

### 200 OK — success

Body is implementation-defined (e.g. `{ "ok": true }` or empty). Client should show the configured success state (e.g. thank-you message).

### 400 Bad Request — validation error

Body must include per-field errors so the client can show them inline.

**Example**:
```json
{
  "errors": {
    "email": "Invalid email address"
  }
}
```

### 429 / 5xx

Rate limit or server error. Client should show a generic retry message.

## Security

- No authentication required (public form).
- Implement rate limiting (e.g. by IP or email) to prevent abuse.
- Validate and sanitize input; do not expose internal errors in response body.
