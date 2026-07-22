const ADMIN_SIGNUPS_KEY = "humane.adminSignupRecords";

export type AdminSignupSource = "shift-signup" | "orientation-signup";

export type AdminSignupRecord = {
  id: string;
  email: string;
  name: string;
  phone: string;
  notes: string;
  source: AdminSignupSource;
  form: string;
  date: string;
  createdAt: number;
  month: string;
};

type NewAdminSignupRecord = Omit<AdminSignupRecord, "id" | "createdAt" | "month">;

type AdminSignupUpdate = Partial<
  Pick<AdminSignupRecord, "email" | "name" | "phone" | "notes" | "source" | "form" | "date">
>;

function readJson(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private-mode failures for this demo app.
  }
}

function toMonthKey(createdAt: number): string {
  return new Date(createdAt).toISOString().slice(0, 7);
}

function normalizeText(value: string): string {
  return value.trim();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isSource(value: unknown): value is AdminSignupSource {
  return value === "shift-signup" || value === "orientation-signup";
}

function isSignupRecord(value: unknown): value is AdminSignupRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.email === "string" &&
    typeof v.name === "string" &&
    typeof v.phone === "string" &&
    typeof v.notes === "string" &&
    isSource(v.source) &&
    typeof v.form === "string" &&
    typeof v.date === "string" &&
    typeof v.createdAt === "number" &&
    typeof v.month === "string"
  );
}

function readAll(): AdminSignupRecord[] {
  const parsed = readJson(ADMIN_SIGNUPS_KEY);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(isSignupRecord)
    .sort((a, b) => b.createdAt - a.createdAt);
}

function writeAll(records: AdminSignupRecord[]): void {
  writeJson(ADMIN_SIGNUPS_KEY, records);
}

export function loadAdminSignupRecords(): AdminSignupRecord[] {
  return readAll();
}

export function addAdminSignupRecord(record: NewAdminSignupRecord): AdminSignupRecord {
  const now = Date.now();
  const next: AdminSignupRecord = {
    id: crypto.randomUUID(),
    email: normalizeEmail(record.email),
    name: normalizeText(record.name),
    phone: normalizeText(record.phone),
    notes: normalizeText(record.notes),
    source: record.source,
    form: normalizeText(record.form),
    date: normalizeText(record.date),
    createdAt: now,
    month: toMonthKey(now),
  };
  const existing = readAll();
  const updated = [next, ...existing];
  writeAll(updated);
  return next;
}

export function updateAdminSignupRecord(
  id: string,
  update: AdminSignupUpdate,
): AdminSignupRecord | null {
  const existing = readAll();
  const index = existing.findIndex((record) => record.id === id);
  if (index === -1) return null;

  const current = existing[index];
  const next: AdminSignupRecord = {
    ...current,
    email:
      update.email === undefined
        ? current.email
        : normalizeEmail(update.email),
    name: update.name === undefined ? current.name : normalizeText(update.name),
    phone:
      update.phone === undefined ? current.phone : normalizeText(update.phone),
    notes:
      update.notes === undefined ? current.notes : normalizeText(update.notes),
    source: update.source ?? current.source,
    form: update.form === undefined ? current.form : normalizeText(update.form),
    date: update.date === undefined ? current.date : normalizeText(update.date),
  };

  const updated = [...existing];
  updated[index] = next;
  writeAll(updated);
  return next;
}

export function formatMonthLabel(month: string): string {
  const [year, monthIndex] = month.split("-").map(Number);
  if (!year || !monthIndex) return month;
  return new Date(Date.UTC(year, monthIndex - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
