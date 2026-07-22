type ServerMagicLinkConfig = {
  resendKey: string;
  fromEmail: string;
  secret: string;
};

function readEnv(name: "RESEND_API_KEY" | "RESEND_FROM_EMAIL" | "MAGIC_LINK_SECRET"): string | null {
  const value = process.env[name];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getServerMagicLinkConfig(): ServerMagicLinkConfig | null {
  const resendKey = readEnv("RESEND_API_KEY");
  const fromEmail = readEnv("RESEND_FROM_EMAIL");
  const secret = readEnv("MAGIC_LINK_SECRET");

  if (!resendKey || !fromEmail || !secret) {
    return null;
  }

  return { resendKey, fromEmail, secret };
}
