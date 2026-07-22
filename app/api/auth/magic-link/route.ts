import { Resend } from "resend";
import { createMagicLinkToken } from "@/lib/magic-link-token";
import { getServerMagicLinkConfig } from "@/lib/magic-link-config";

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
  const config = getServerMagicLinkConfig();

  if (!config) {
    // Local/demo mode: client renders a clickable preview email and verifies locally.
    return Response.json({ ok: true, mode: "demo" });
  }

  const token = createMagicLinkToken(email, config.secret);
  const verifyUrl = new URL("/auth/verify", request.url);
  verifyUrl.searchParams.set("email", email);
  verifyUrl.searchParams.set("token", token);
  verifyUrl.searchParams.set("next", next);

  const resend = new Resend(config.resendKey);
  const { error } = await resend.emails.send({
    from: config.fromEmail,
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
    console.error("Resend magic-link send failed:", {
      name: error.name,
      message: error.message,
      from: config.fromEmail,
    });
    const detail =
      typeof error.message === "string" && error.message.trim().length > 0
        ? error.message.trim()
        : "Unable to send magic link email right now. Please try again.";
    return Response.json({ error: detail }, { status: 502 });
  }

  // Also return the verify URL so the client can show an in-app copy of the email.
  return Response.json({
    ok: true,
    previewUrl: verifyUrl.toString(),
    fromEmail: config.fromEmail,
  });
}
