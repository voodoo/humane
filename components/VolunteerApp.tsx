"use client";

import { useEffect, useMemo, useState } from "react";
import type { DemoVolunteer, PanelPhase, Shift } from "@/lib/types";
import {
  addMonths,
  countByDate,
  shiftsOnDate,
  startOfMonth,
} from "@/lib/calendar";
import {
  clearSession,
  displayNameFor,
  loadSession,
  loadVolunteerProfile,
  profileToDemoVolunteer,
  saveVolunteerProfile,
  type VolunteerSession,
} from "@/lib/local-volunteer";
import { addAdminSignupRecord } from "@/lib/local-admin-signups";
import { getShiftsForMonth } from "@/lib/mock-data";
import { MonthCalendar } from "./MonthCalendar";
import { DayShiftPanel } from "./DayShiftPanel";
import { EmailSignIn } from "./EmailSignIn";
import { SiteNav } from "./SiteNav";

export function VolunteerApp() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<VolunteerSession | null>(null);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [phase, setPhase] = useState<PanelPhase>("day");
  const [volunteer, setVolunteer] = useState<DemoVolunteer>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = loadSession();
    const stored = loadVolunteerProfile();

    const emptyFallback: DemoVolunteer = {
      name: "",
      email: storedSession?.email ?? "",
      phone: "",
      notes: "",
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
      setVolunteer(profileToDemoVolunteer(profile, emptyFallback));
      setWelcomeName(displayNameFor(profile, storedSession));
      setReady(true);
    });
  }, []);

  const shifts = useMemo(() => getShiftsForMonth(month), [month]);
  const counts = useMemo(() => countByDate(shifts), [shifts]);
  const shiftsForDay = selectedISO
    ? shiftsOnDate(shifts, selectedISO)
    : [];

  function handleSelectDay(iso: string) {
    setSelectedISO(iso);
    setSelectedShift(null);
    setPhase("day");
  }

  function handleSelectShift(shift: Shift) {
    setSelectedShift(shift);
    setPhase("signup");
  }

  function handleSubmitSignup(form: DemoVolunteer) {
    saveVolunteerProfile(form);
    if (selectedShift) {
      addAdminSignupRecord({
        email: form.email,
        name: form.name,
        phone: form.phone,
        notes: form.notes,
        source: "shift-signup",
        form: selectedShift.role,
        date: selectedShift.date,
      });
    }
    setVolunteer(form);
    setWelcomeName(form.name || form.email);
    setPhase("success");
  }

  function handleCancelSignup() {
    setSelectedShift(null);
    setPhase("day");
  }

  function handleDone() {
    setSelectedShift(null);
    setPhase("day");
  }

  function handleMonthChange(next: Date) {
    setMonth(next);
    setSelectedISO(null);
    setSelectedShift(null);
    setPhase("day");
  }

  function handleSignOut() {
    clearSession();
    setSession(null);
    setWelcomeName(null);
  }

  if (!ready) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <EmailSignIn
        title="Sign in with email"
        subtitle="Enter your email — no password. We’ll send a secure link back to volunteer shifts."
        returnPath="/"
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
                Humane Society
              </h1>
              <p className="mt-2 max-w-md text-base text-muted sm:text-lg">
                Volunteer shifts
              </p>
              {welcomeName ? (
                <p className="mt-1 text-sm text-accent-deep">
                  Signed in as {welcomeName}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:border-accent hover:text-accent-deep"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.95fr)] lg:items-start">
          <MonthCalendar
            month={month}
            selectedISO={selectedISO}
            counts={counts}
            onPrev={() => handleMonthChange(addMonths(month, -1))}
            onNext={() => handleMonthChange(addMonths(month, 1))}
            onSelectDay={handleSelectDay}
          />
          <DayShiftPanel
            phase={phase}
            selectedISO={selectedISO}
            shiftsForDay={shiftsForDay}
            selectedShift={selectedShift}
            demoVolunteer={volunteer}
            onSelectShift={handleSelectShift}
            onSubmitSignup={handleSubmitSignup}
            onCancelSignup={handleCancelSignup}
            onDone={handleDone}
          />
        </div>
      </div>
    </div>
  );
}
