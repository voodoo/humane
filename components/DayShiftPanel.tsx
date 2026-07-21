"use client";

import type { DemoVolunteer, PanelPhase, Shift } from "@/lib/types";
import { formatTimeRange } from "@/lib/calendar";
import { SignupForm } from "./SignupForm";

type Props = {
  phase: PanelPhase;
  selectedISO: string | null;
  shiftsForDay: Shift[];
  selectedShift: Shift | null;
  demoVolunteer: DemoVolunteer;
  onSelectShift: (shift: Shift) => void;
  onSubmitSignup: (volunteer: DemoVolunteer) => void;
  onCancelSignup: () => void;
  onDone: () => void;
};

export function DayShiftPanel({
  phase,
  selectedISO,
  shiftsForDay,
  selectedShift,
  demoVolunteer,
  onSelectShift,
  onSubmitSignup,
  onCancelSignup,
  onDone,
}: Props) {
  const dayLabel = selectedISO
    ? new Date(selectedISO + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  if (!selectedISO) {
    return (
      <aside className="rounded-lg border border-dashed border-border bg-background-elevated/50 p-6 text-muted">
        <p className="text-sm">
          Select a day on the calendar, then choose a shift to open the signup
          form.
        </p>
      </aside>
    );
  }

  return (
    <aside className="animate-panel-in flex flex-col gap-5 rounded-lg border border-border bg-background-elevated p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Open shifts
        </p>
        <h3 className="font-display text-lg text-foreground">{dayLabel}</h3>
      </div>

      {shiftsForDay.length === 0 ? (
        <p className="text-sm text-muted">No open shifts</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {shiftsForDay.map((shift) => {
            const active = selectedShift?.id === shift.id;
            return (
              <li key={shift.id}>
                <button
                  type="button"
                  onClick={() => onSelectShift(shift)}
                  className={[
                    "w-full rounded-md border px-3 py-3 text-left transition",
                    active
                      ? "border-accent bg-accent-soft/60 ring-1 ring-accent"
                      : "border-border bg-background hover:border-accent hover:bg-accent-soft/40",
                  ].join(" ")}
                >
                  <p className="font-semibold text-foreground">{shift.role}</p>
                  <p className="text-sm text-muted">
                    {formatTimeRange(shift.startTime, shift.endTime)} ·{" "}
                    {`${shift.spotsOpen} spot${shift.spotsOpen === 1 ? "" : "s"} left`}
                  </p>
                  <p className="text-xs text-muted">{shift.location}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {phase === "success" && selectedShift ? (
        <div className="flex flex-col gap-4 border-t border-border pt-5">
          <div className="rounded-md border border-accent/30 bg-accent-soft p-4">
            <p className="font-display text-xl text-accent-deep">
              You’re signed up
            </p>
            <p className="mt-1 text-sm text-foreground">
              Thanks for volunteering for{" "}
              <strong>{selectedShift.role}</strong> on {selectedShift.date} (
              {formatTimeRange(selectedShift.startTime, selectedShift.endTime)}
              ).
            </p>
            <p className="mt-2 text-xs text-muted">
              This is a demo — nothing was sent to a server. Sign out and open
              the email link again with the same address to return with these
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={onDone}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
          >
            Done
          </button>
        </div>
      ) : selectedShift && phase === "signup" ? (
        <div className="border-t border-border pt-5">
          <SignupForm
            shift={selectedShift}
            demoVolunteer={demoVolunteer}
            onSubmit={onSubmitSignup}
            onCancel={onCancelSignup}
            showCancel
          />
        </div>
      ) : shiftsForDay.length > 0 ? (
        <p className="border-t border-border pt-5 text-sm text-muted">
          Select a shift above to open the signup form.
        </p>
      ) : null}
    </aside>
  );
}
