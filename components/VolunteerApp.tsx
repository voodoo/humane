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
  loadVolunteerProfile,
  profileToDemoVolunteer,
  saveVolunteerProfile,
} from "@/lib/local-volunteer";
import { demoVolunteer, getShiftsForMonth } from "@/lib/mock-data";
import { MonthCalendar } from "./MonthCalendar";
import { DayShiftPanel } from "./DayShiftPanel";
import { SiteNav } from "./SiteNav";

export function VolunteerApp() {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedISO, setSelectedISO] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [phase, setPhase] = useState<PanelPhase>("day");
  const [volunteer, setVolunteer] = useState<DemoVolunteer>(demoVolunteer);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadVolunteerProfile();
    if (!stored) return;
    setVolunteer(profileToDemoVolunteer(stored, demoVolunteer));
    setWelcomeName(stored.name);
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
    setVolunteer(form);
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <SiteNav />
      <header className="mb-6 sm:mb-8">
        <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          Humane Society
        </h1>
        <p className="mt-2 max-w-md text-base text-muted sm:text-lg">
          Volunteer shifts
        </p>
        {welcomeName ? (
          <p className="mt-1 text-sm text-accent-deep">
            Welcome back, {welcomeName}
          </p>
        ) : null}
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
  );
}
