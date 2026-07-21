"use client";

import { formatMonthLabel, toISODate, buildMonthGrid } from "@/lib/calendar";

type Props = {
  month: Date;
  selectedISO: string | null;
  counts: Record<string, number>;
  onPrev: () => void;
  onNext: () => void;
  onSelectDay: (iso: string) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar({
  month,
  selectedISO,
  counts,
  onPrev,
  onNext,
  onSelectDay,
}: Props) {
  const cells = buildMonthGrid(month);
  const monthKey = `${month.getFullYear()}-${month.getMonth()}`;

  return (
    <section className="w-full" aria-label="Volunteer shift calendar">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md border border-border bg-background-elevated px-3 py-1.5 text-sm text-foreground transition hover:border-accent hover:text-accent-deep"
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
          {formatMonthLabel(month)}
        </h2>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md border border-border bg-background-elevated px-3 py-1.5 text-sm text-foreground transition hover:border-accent hover:text-accent-deep"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div
        key={monthKey}
        className="animate-fade-slide overflow-hidden rounded-lg border border-border bg-background-elevated/80 shadow-sm"
      >
        <div className="grid grid-cols-7 border-b border-border bg-accent-soft/40">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(({ date, inMonth }) => {
            const iso = toISODate(date);
            const count = counts[iso] ?? 0;
            const selected = selectedISO === iso;
            const isToday = iso === toISODate(new Date());

            return (
              <button
                key={iso + String(inMonth)}
                type="button"
                disabled={!inMonth}
                onClick={() => onSelectDay(iso)}
                className={[
                  "relative flex min-h-[4.25rem] flex-col items-start gap-1 border-b border-r border-border p-2 text-left transition sm:min-h-[5rem]",
                  inMonth
                    ? "hover:bg-accent-soft/50"
                    : "cursor-default bg-background/40 text-muted/40",
                  selected ? "bg-accent-soft ring-2 ring-inset ring-accent" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-sm font-medium",
                    isToday && inMonth ? "text-accent-deep" : "",
                    selected ? "text-accent-deep" : "",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>
                {inMonth && count > 0 && (
                  <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-white/90"
                      aria-hidden
                    />
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
