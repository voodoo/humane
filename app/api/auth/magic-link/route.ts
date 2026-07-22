import { Resend } from "resend";
import { createMagicLinkToken } from "@/lib/magic-link-token";

type MagicLinkRequest = {
  email?: unknown;
  next?: unknown;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const secret = process.env.MAGIC_LINK_SECRET;

  const missing = [
    !resendKey ? "RESEND_API_KEY" : null,
    !fromEmail ? "RESEND_FROM_EMAIL" : null,
    !secret ? "MAGIC_LINK_SECRET" : null,
  ].filter(Boolean);

  if (missing.length > 0) {
    return Response.json(
      {
        error: `Missing required env vars: ${missing.join(", ")}`,
      },
      { status: 500 },
    );
  }
  const resendKeyValue = resendKey as string;
  const fromEmailValue = fromEmail as string;
  const secretValue = secret as string;

  let body: MagicLinkRequest;
  try {
    body = (await request.json()) as MagicLinkRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.email !== "string") {
    return Response.json({ error: "Email is required." }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const next = safeNextPath(body.next);
  const token = createMagicLinkToken(email, secretValue);
  const verifyUrl = new URL("/auth/verify", request.url);
  verifyUrl.searchParams.set("email", email);
  verifyUrl.searchParams.set("token", token);
  verifyUrl.searchParams.set("next", next);

  const resend = new Resend(resendKeyValue);
  const { error } = await resend.emails.send({
    from: fromEmailValue,
    to: [email],
    subject: "Your Humane Society sign-in link",
    html: [
      "<p>Hi there,</p>",
      "<p>Use the secure link below to sign in to the volunteer app:</p>",
      `<p><a href="${verifyUrl.toString()}">Continue to the app</a></p>`,
      "<p>This link expires in 30 minutes.</p>",
    ].join(""),
    text: [
      "Hi there,",
      "",
      "Use this secure sign-in link:",
      verifyUrl.toString(),
      "",
      "This link expires in 30 minutes.",
    ].join("\n"),
  });

  if (error) {
    return Response.json(
      { error: "Unable to send magic link email right now. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
