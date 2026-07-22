"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { completeMagicLinkSignIn, verifyMagicLink } from "@/lib/local-volunteer";

type VerifyApiPayload = {
  email?: string;
  error?: string;
};

function readParam(
  searchParams: { get: (name: string) => string | null },
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) return value;
  }
  return null;
}

function normalizeEmailFromQuery(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed.includes("@")) return trimmed;
  // Some old/shared links decode "+" aliases as spaces.
  return trimmed.replace(/ /g, "+");
}

function isLikelyLocalDemoToken(token: string): boolean {
  if (token.startsWith("demo_")) return true;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    token,
  );
}

function verifyLocally(email: string, token: string): boolean {
  const fallback = verifyMagicLink(email, token);
  return fallback.ok;
}

function shouldUseLocalFallback(
  response: Response,
  payload: VerifyApiPayload,
): boolean {
  if (response.status === 503) return true;
  return payload.error === "Server-side link verification is unavailable.";
}

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      const emailRaw = readParam(searchParams, ["email", "e"]);
      const token = readParam(searchParams, ["token", "t", "code"]);
      const email = emailRaw ? normalizeEmailFromQuery(emailRaw) : null;
      const next = readParam(searchParams, ["next", "redirect"]) || "/";
      const safeNext =
        next.startsWith("/") && !next.startsWith("//") ? next : "/";

      if (!email || !token) {
        queueMicrotask(() => setError("This sign-in link is missing details."));
        return;
      }

      if (isLikelyLocalDemoToken(token)) {
        if (verifyLocally(email, token)) {
          router.replace(safeNext);
          return;
        }
      }

      try {
        const response = await fetch("/api/auth/magic-link/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        });
        const payload = (await response.json()) as VerifyApiPayload;

        if (response.ok && typeof payload.email === "string") {
          completeMagicLinkSignIn(payload.email);
          router.replace(safeNext);
          return;
        }

        if (shouldUseLocalFallback(response, payload)) {
          if (verifyLocally(email, token)) {
            router.replace(safeNext);
            return;
          }
        }

        const apiError =
          typeof payload.error === "string" && payload.error.length > 0
            ? payload.error
            : "This sign-in link is not valid.";
        queueMicrotask(() => setError(apiError));
      } catch {
        if (verifyLocally(email, token)) {
          router.replace(safeNext);
          return;
        }
        queueMicrotask(() =>
          setError("Unable to verify this link right now. Please try again."),
        );
      }
    };

    void run();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-lg border border-border bg-background-elevated p-5 shadow-sm sm:p-6">
          <p className="font-display text-2xl text-foreground">
            Link didn’t work
          </p>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-sm text-muted">Signing you in…</p>
    </div>
  );
}

export default function AuthVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm text-muted">Signing you in…</p>
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
