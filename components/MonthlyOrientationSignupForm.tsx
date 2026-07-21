"use client";

import { useEffect, useState } from "react";
import type { DemoOrientationSignup } from "@/lib/types";
import {
  clearSession,
  displayNameFor,
  loadSession,
  loadVolunteerProfile,
  profileToOrientationSignup,
  saveVolunteerProfile,
  type VolunteerSession,
} from "@/lib/local-volunteer";
import { EmailSignIn } from "./EmailSignIn";

type Props = {
  monthLabel: string;
};

export function MonthlyOrientationSignupForm({ monthLabel }: Props) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<VolunteerSession | null>(null);
  const [form, setForm] = useState<DemoOrientationSignup>({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    howHeard: "Friend / family",
  });
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedSession = loadSession();
    const stored = loadVolunteerProfile();

    const emptyFallback: DemoOrientationSignup = {
      name: "",
      email: storedSession?.email ?? "",
      phone: "",
      emergencyContact: "",
      howHeard: "Friend / family",
    };
    const profile =
      stored &&
      (!storedSession ||
        stored.email.trim().toLowerCase() ===
          storedSession.email.trim().toLowerCase())
        ? { ...stored, email: storedSession?.email ?? stored.email }
        : storedSession
          ? { name: "", email: storedSession.email, phone: "" }
          : null;

    queueMicrotask(() => {
      setSession(storedSession);
      setForm(profileToOrientationSignup(profile, emptyFallback));
      setWelcomeName(displayNameFor(profile, storedSession));
      setReady(true);
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveVolunteerProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      emergencyContact: form.emergencyContact,
      howHeard: form.howHeard,
    });
    setWelcomeName(form.name || form.email);
    setSubmitted(true);
  }

  if (!ready) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (!session) {
    return (
      <EmailSignIn
        embedded
        title="Sign in with email"
        subtitle="Enter your email — no password. You’ll get a demo message with a link back to orientation signup."
        returnPath="/orientation/signup"
      />
    );
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent-soft p-6">
        <p className="font-display text-2xl text-accent-deep">You’re signed up</p>
        <p className="mt-2 text-sm text-foreground">
          Thanks for registering for <strong>{monthLabel}</strong> volunteer
          orientation. This is a demo — nothing was sent to a server. This
          browser will remember your details next time you open the email link.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Edit form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-background-elevated p-5 shadow-sm sm:p-6"
      aria-label="Monthly orientation signup"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {welcomeName ? (
          <p className="text-sm text-accent-deep">Signed in as {welcomeName}</p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => {
            clearSession();
            setSession(null);
            setWelcomeName(null);
          }}
          className="text-sm font-medium text-muted transition hover:text-accent-deep"
        >
          Sign out
        </button>
      </div>

      <div className="rounded-md border border-border bg-accent-soft/50 p-3 text-sm">
        <p className="font-semibold text-accent-deep">
          Volunteer orientation · {monthLabel}
        </p>
        <p className="text-muted">
          One signup covers this month’s orientation offerings at Main Shelter.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">Name</span>
        <input
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input
          type="email"
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">Phone</span>
        <input
          type="tel"
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">Emergency contact</span>
        <input
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.emergencyContact}
          onChange={(e) =>
            setForm({ ...form, emergencyContact: e.target.value })
          }
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-foreground">
          How did you hear about us?
        </span>
        <select
          className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.howHeard}
          onChange={(e) => setForm({ ...form, howHeard: e.target.value })}
        >
          <option>Friend / family</option>
          <option>Social media</option>
          <option>Shelter website</option>
          <option>Event / flyer</option>
          <option>Other</option>
        </select>
      </label>

      <p className="text-xs text-muted">
        Details stay on this device only — nothing is sent to a server.
      </p>

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
      >
        Sign up for {monthLabel}
      </button>
    </form>
  );
}
