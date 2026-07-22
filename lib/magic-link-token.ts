import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 1000 * 60 * 30;

type MagicLinkPayload = {
  email: string;
  exp: number;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createMagicLinkToken(
  email: string,
  secret: string,
  now = Date.now(),
): string {
  const payload: MagicLinkPayload = {
    email,
    exp: now + TOKEN_TTL_MS,
  };
  const payloadEncoded = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadEncoded, secret);
  return `${payloadEncoded}.${signature}`;
}

export function verifyMagicLinkToken(
  token: string,
  email: string,
  secret: string,
  now = Date.now(),
): { ok: true; email: string } | { ok: false; error: string } {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  const expected = signPayload(payloadEncoded, secret);
  const actualBytes = Buffer.from(signature, "base64url");
  const expectedBytes = Buffer.from(expected, "base64url");
  if (
    actualBytes.length !== expectedBytes.length ||
    !timingSafeEqual(actualBytes, expectedBytes)
  ) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  const payloadRaw = fromBase64Url(payloadEncoded);
  if (!payloadRaw) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  let payload: MagicLinkPayload;
  try {
    payload = JSON.parse(payloadRaw) as MagicLinkPayload;
  } catch {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  if (
    !payload ||
    typeof payload.email !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  if (payload.exp < now) {
    return {
      ok: false,
      error: "This sign-in link expired or was already used. Request a new one.",
    };
  }

  if (payload.email !== email) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  return { ok: true, email };
}
