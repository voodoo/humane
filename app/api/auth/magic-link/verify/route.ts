import { verifyMagicLinkToken } from "@/lib/magic-link-token";

type VerifyRequest = {
  email?: unknown;
  token?: unknown;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    return Response.json(
      { error: "Missing required env var: MAGIC_LINK_SECRET" },
      { status: 500 },
    );
  }

  let body: VerifyRequest;
  try {
    body = (await request.json()) as VerifyRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.email !== "string" || typeof body.token !== "string") {
    return Response.json(
      { error: "Email and token are required." },
      { status: 400 },
    );
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const verification = verifyMagicLinkToken(body.token, email, secret);
  if (!verification.ok) {
    return Response.json({ error: verification.error }, { status: 401 });
  }

  return Response.json({ ok: true, email: verification.email });
}
