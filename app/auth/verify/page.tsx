"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMagicLink } from "@/lib/local-volunteer";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const next = searchParams.get("next") || "/";
    const safeNext =
      next.startsWith("/") && !next.startsWith("//") ? next : "/";

    const result = verifyMagicLink(email, token);
    if (!result.ok) {
      queueMicrotask(() => setError(result.error));
      return;
    }

    router.replace(safeNext);
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
