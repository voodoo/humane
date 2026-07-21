export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function buildMonthGrid(
  month: Date,
): { date: Date; inMonth: boolean }[] {
  const first = startOfMonth(month);
  const startOffset = first.getDay(); // Sunday = 0
  const gridStart = new Date(
    first.getFullYear(),
    first.getMonth(),
    1 - startOffset,
  );

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    cells.push({
      date,
      inMonth: date.getMonth() === month.getMonth(),
    });
  }
  return cells;
}

export function shiftsOnDate<T extends { date: string }>(
  items: T[],
  iso: string,
): T[] {
  return items.filter((s) => s.date === iso);
}

export function countByDate(items: { date: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.date] = (counts[item.date] ?? 0) + 1;
  }
  return counts;
}

export function formatMonthLabel(month: Date): string {
  return month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "pm" : "am";
    const hour = h % 12 || 12;
    return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
  };
  return `${fmt(start)}–${fmt(end)}`;
}
