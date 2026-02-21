import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | { ok: true; email: string; name?: string; message?: string }
  | { ok: false; errors: Record<string, string> };

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

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, email, name: name || undefined, message: message || undefined };
}

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.toLowerCase() !== "application/json") {
    return NextResponse.json(
      { errors: { email: "Content-Type must be application/json." } },
      { status: 400 }
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { email: "Invalid JSON." } },
      { status: 400 }
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  // Payload valid; storage not implemented — return success per contract.
  return NextResponse.json({ ok: true });
}
