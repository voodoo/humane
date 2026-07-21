"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  createMagicLink,
  loadVolunteerProfile,
  magicLinkHref,
  type PendingMagicLink,
} from "@/lib/local-volunteer";

type Props = {
  title?: string;
  subtitle?: string;
  returnPath?: string;
  /** When true, skip outer page chrome (for nesting under an existing layout). */
  embedded?: boolean;
};

export function EmailSignIn({
  title = "Continue with email",
  subtitle = "No password. We’ll show a demo email with a link back to the app.",
  returnPath = "/",
  embedded = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<PendingMagicLink | null>(null);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);

  useEffect(() => {
    const stored = loadVolunteerProfile();
    if (!stored?.email) return;
    queueMicrotask(() => {
      setEmail(stored.email);
      setHasSavedProfile(Boolean(stored.name.trim() || stored.phone.trim()));
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    const link = createMagicLink(trimmed);
    const stored = loadVolunteerProfile();
    const sameEmail =
      stored?.email.trim().toLowerCase() === link.email &&
      Boolean(stored.name.trim() || stored.phone.trim());
    setHasSavedProfile(sameEmail);
    setPending(link);
  }

  const shell = (child: ReactNode) =>
    embedded ? (
      child
    ) : (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        {child}
      </div>
    );

  if (pending) {
    const href = `${magicLinkHref(pending)}&next=${encodeURIComponent(returnPath)}`;

    return shell(
      <div className="rounded-lg border border-border bg-background-elevated p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Check your email
        </p>
        <h1 className="mt-1 font-display text-3xl text-foreground">
          Open the link we sent
        </h1>
        <p className="mt-2 text-sm text-muted">
          Demo only — nothing was emailed. Click the button in the message below
          to return to the app as{" "}
          <strong className="text-foreground">{pending.email}</strong>
          {hasSavedProfile
            ? " with your saved volunteer details."
            : "."}
        </p>

        <article
          className="mt-6 rounded-md border border-border bg-background"
          aria-label="Demo sign-in email"
        >
          <header className="border-b border-border px-4 py-3 text-sm">
            <p className="text-muted">
              From{" "}
              <span className="text-foreground">
                volunteers@humanesociety.demo
              </span>
            </p>
            <p className="text-muted">
              To <span className="text-foreground">{pending.email}</span>
            </p>
            <p className="mt-1 font-medium text-foreground">
              Your Humane Society sign-in link
            </p>
          </header>
          <div className="space-y-3 px-4 py-4 text-sm text-foreground">
            <p>Hi there,</p>
            <p>
              Tap the button below to finish signing in. No password needed —
              this link brings you back to the volunteer app
              {hasSavedProfile
                ? " and restores the details you’ve already saved on this device"
                : ""}
              .
            </p>
            <p>
              <Link
                href={href}
                className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
              >
                Continue to the app
              </Link>
            </p>
            <p className="text-xs text-muted">
              If the button doesn’t work, open this URL:
              <br />
              <span className="break-all text-accent-deep">{href}</span>
            </p>
          </div>
        </article>

        <button
          type="button"
          onClick={() => {
            setPending(null);
            setEmail(pending.email);
          }}
          className="mt-4 text-sm font-medium text-muted transition hover:text-accent-deep"
        >
          Use a different email
        </button>
      </div>,
    );
  }

  return shell(
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-background-elevated p-5 shadow-sm sm:p-6"
      aria-label="Email sign-in"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Sign in
      </p>
      <h1 className="mt-1 font-display text-3xl text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>

      <label className="mt-6 flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
      >
        Email me a sign-in link
      </button>

      <p className="mt-3 text-xs text-muted">
        No password. In this demo, the “email” appears on the next screen with a
        link back into the app
        {hasSavedProfile ? " — your saved details will come with you" : ""}.
      </p>
    </form>,
  );
}
