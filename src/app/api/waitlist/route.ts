import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Force Node runtime so we can write to the filesystem in local/dev or any
// host that mounts a writable disk (e.g. self-hosted, Railway, Fly.io). On
// Vercel serverless this still works for /tmp; for production you should set
// MESHAGE_WAITLIST_WEBHOOK so submissions are forwarded to a real store.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 4 * 1024;
const RATE_WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

type ValidationResult =
  | { ok: true; email: string; name?: string; message?: string }
  | { ok: false; errors: Record<string, string> };

function defaultStorePath(): string {
  if (process.env.MESHAGE_WAITLIST_FILE) return process.env.MESHAGE_WAITLIST_FILE;
  if (process.env.NODE_ENV === "production" && !process.env.MESHAGE_WAITLIST_DIR) {
    return path.join("/tmp", "meshage-waitlist.jsonl");
  }
  const dir = process.env.MESHAGE_WAITLIST_DIR ?? path.join(process.cwd(), ".data");
  return path.join(dir, "waitlist.jsonl");
}

function validate(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, errors: { email: "Invalid request." } };
  }
  const o = body as Record<string, unknown>;
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : undefined;
  const message = typeof o.message === "string" ? o.message.trim() : undefined;

  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Invalid email address.";
  if (email.length > 254) errors.email = "Email too long.";
  if (name && name.length > 100) errors.name = "Name too long.";
  if (message && message.length > 1000) errors.message = "Message too long.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, email, name: name || undefined, message: message || undefined };
}

// In-memory IP rate limit. Suitable for low-traffic marketing site; for higher
// volume swap with Upstash, KV, or platform-native middleware.
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

async function appendToFile(entry: Record<string, unknown>): Promise<void> {
  const file = defaultStorePath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, JSON.stringify(entry) + "\n", "utf8");
}

async function notifyWebhook(entry: Record<string, unknown>): Promise<void> {
  const url = process.env.MESHAGE_WAITLIST_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // Non-fatal; we still keep the local file as the source of truth.
  }
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.toLowerCase() !== "application/json") {
    return NextResponse.json(
      { errors: { email: "Content-Type must be application/json." } },
      { status: 400 }
    );
  }

  const ip = clientIp(request);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { errors: { email: "Too many submissions. Please wait a minute." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ errors: { email: "Payload too large." } }, { status: 413 });
    }
    body = raw ? JSON.parse(raw) : null;
  } catch {
    return NextResponse.json({ errors: { email: "Invalid JSON." } }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const entry = {
    ts: new Date().toISOString(),
    ip,
    user_agent: request.headers.get("user-agent") ?? "",
    email: result.email,
    name: result.name ?? null,
    message: result.message ?? null,
  };

  try {
    await appendToFile(entry);
  } catch (err) {
    // If disk is read-only and no webhook is configured the lead would be lost.
    // Surface a 500 so the user can retry; we still try the webhook below.
    await notifyWebhook(entry);
    return NextResponse.json(
      { errors: { email: "Could not save submission. Please try again later." } },
      { status: 500 }
    );
  }
  await notifyWebhook(entry);
  return NextResponse.json({ ok: true });
}
