"use client";

import { useEffect, useState } from "react";
import { demoDonation } from "@/lib/mock-data";

const amounts = ["25", "50", "100", "250"];

export function DonatePane() {
  const [form, setForm] = useState(demoDonation);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(demoDonation);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="rounded-lg border border-accent/30 bg-accent-soft p-5 shadow-sm">
        <p className="font-display text-xl text-accent-deep">Thank you</p>
        <p className="mt-1 text-sm text-foreground">
          Your ${form.amount} {form.frequency.toLowerCase()} gift is recorded
          in this demo only — nothing was charged.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Donate again
        </button>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border border-border bg-background-elevated p-5 shadow-sm"
      aria-labelledby="donate-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Support the shelter
      </p>
      <h2
        id="donate-heading"
        className="font-display text-2xl text-foreground"
      >
        Donate
      </h2>
      <p className="mt-1 text-sm text-muted">
        Demo pane — payment fields are prefilled with mock data and never
        process a real charge.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">
            Amount
          </legend>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setForm({ ...form, amount: amt })}
                className={[
                  "rounded-md border px-3 py-2 text-sm font-semibold transition",
                  form.amount === amt
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-background text-foreground hover:border-accent",
                ].join(" ")}
              >
                ${amt}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Frequency</span>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.frequency}
            onChange={(e) =>
              setForm({
                ...form,
                frequency: e.target.value as typeof form.frequency,
              })
            }
          >
            <option>One-time</option>
            <option>Monthly</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Name on card</span>
          <input
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Email receipt</span>
          <input
            type="email"
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground">Card number</span>
          <input
            className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
            inputMode="numeric"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Expiry</span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">CVC</span>
            <input
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={form.cvc}
              onChange={(e) => setForm({ ...form, cvc: e.target.value })}
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

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Give ${form.amount}
        </button>
      </form>
    </section>
  );
}
