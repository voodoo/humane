"use client";

import { useEffect, useState } from "react";
import { demoBackgroundCheck } from "@/lib/mock-data";

export function BackgroundCheckForm() {
  const [form, setForm] = useState(demoBackgroundCheck);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(demoBackgroundCheck);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="rounded-lg border border-accent/30 bg-accent-soft p-5 shadow-sm">
        <p className="font-display text-xl text-accent-deep">
          Background check submitted
        </p>
        <p className="mt-1 text-sm text-foreground">
          Demo only — no screening vendor was contacted and no SSN was stored.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Edit form
        </button>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border border-border bg-background-elevated p-5 shadow-sm"
      aria-labelledby="bg-check-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Volunteer onboarding
      </p>
      <h2
        id="bg-check-heading"
        className="font-display text-2xl text-foreground"
      >
        Background check
      </h2>
      <p className="mt-1 text-sm text-muted">
        Required for most shelter roles. This form is stubbed with mock data.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Legal full name</span>
          <input
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.legalName}
            onChange={(e) => setForm({ ...form, legalName: e.target.value })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Date of birth</span>
            <input
              type="date"
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              SSN (last 4 only)
            </span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.ssnLastFour}
              onChange={(e) =>
                setForm({ ...form, ssnLastFour: e.target.value })
              }
              maxLength={4}
              inputMode="numeric"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Street address</span>
          <input
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm sm:col-span-1">
            <span className="font-medium text-foreground">City</span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">State</span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              maxLength={2}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">ZIP</span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
            />
          </label>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.consent}
            onChange={(e) =>
              setForm({ ...form, consent: e.target.checked })
            }
          />
          <span className="text-muted">
            I authorize the Humane Society to run a volunteer background check
            for shelter safety (demo consent — not submitted anywhere).
          </span>
        </label>

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Submit background check
        </button>
      </form>
    </section>
  );
}
