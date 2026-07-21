"use client";

import { useEffect, useState } from "react";
import type { DemoVolunteer, Shift } from "@/lib/types";
import { formatTimeRange } from "@/lib/calendar";

type Props = {
  shift: Shift;
  demoVolunteer: DemoVolunteer;
  onSubmit: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
};

export function SignupForm({
  shift,
  demoVolunteer,
  onSubmit,
  onCancel,
  showCancel = true,
}: Props) {
  const [form, setForm] = useState(demoVolunteer);

  useEffect(() => {
    setForm(demoVolunteer);
  }, [demoVolunteer, shift.id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      aria-label="Volunteer signup"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Sign up for this shift
        </p>
        <div className="mt-2 rounded-md border border-border bg-accent-soft/50 p-3 text-sm">
          <p className="font-semibold text-accent-deep">{shift.role}</p>
          <p className="text-muted">
            {shift.date} · {formatTimeRange(shift.startTime, shift.endTime)}
          </p>
          <p className="text-muted">{shift.location}</p>
        </div>
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
        <span className="font-medium text-foreground">Notes (optional)</span>
        <textarea
          className="min-h-[4.5rem] rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </label>

      <p className="text-xs text-muted">
        Demo form — fields are prefilled with mock volunteer data.
      </p>

      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Sign up
        </button>
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent-deep"
          >
            Back
          </button>
        )}
      </div>
    </form>
  );
}
