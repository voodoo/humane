"use client";

import { useEffect, useMemo, useState } from "react";
import { EmailSignIn } from "@/components/EmailSignIn";
import { SiteNav } from "@/components/SiteNav";
import {
  formatMonthLabel as formatAdminMonthLabel,
  loadAdminSignupRecords,
  type AdminSignupRecord,
  type AdminSignupSource,
  updateAdminSignupRecord,
} from "@/lib/local-admin-signups";
import {
  clearSession,
  loadSession,
  type VolunteerSession,
} from "@/lib/local-volunteer";

type EditDraft = Pick<
  AdminSignupRecord,
  "email" | "name" | "phone" | "notes" | "source" | "form" | "date"
>;

const SOURCE_OPTIONS: Array<{ value: AdminSignupSource; label: string }> = [
  { value: "shift-signup", label: "Volunteer shift signup" },
  { value: "orientation-signup", label: "Orientation signup" },
];

function formatCreatedAt(createdAt: number): string {
  return new Date(createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminSignupRecords() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<VolunteerSession | null>(null);
  const [records, setRecords] = useState<AdminSignupRecord[]>([]);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);

  useEffect(() => {
    const storedSession = loadSession();
    const storedRecords = loadAdminSignupRecords();
    queueMicrotask(() => {
      setSession(storedSession);
      setRecords(storedRecords);
      setReady(true);
    });
  }, []);

  const months = useMemo(() => {
    return [...new Set(records.map((record) => record.month))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (monthFilter === "all") return records;
    return records.filter((record) => record.month === monthFilter);
  }, [monthFilter, records]);

  const groupedRecords = useMemo(() => {
    return filteredRecords.reduce<Record<string, AdminSignupRecord[]>>(
      (groups, record) => {
        if (!groups[record.month]) groups[record.month] = [];
        groups[record.month].push(record);
        return groups;
      },
      {},
    );
  }, [filteredRecords]);

  function exitEditing() {
    setEditingId(null);
    setDraft(null);
  }

  useEffect(() => {
    if (monthFilter !== "all" && months.includes(monthFilter)) return;
    if (monthFilter === "all") return;
    exitEditing();
    setMonthFilter("all");
  }, [monthFilter, months]);

  function startEditing(record: AdminSignupRecord) {
    setEditingId(record.id);
    setDraft({
      email: record.email,
      name: record.name,
      phone: record.phone,
      notes: record.notes,
      source: record.source,
      form: record.form,
      date: record.date,
    });
  }

  function cancelEditing() {
    exitEditing();
  }

  function saveEditing() {
    if (!editingId || !draft) return;
    const updated = updateAdminSignupRecord(editingId, draft);
    if (!updated) return;
    setRecords((prev) =>
      prev.map((record) => (record.id === editingId ? updated : record)),
    );
    exitEditing();
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
      <div className="flex flex-1 flex-col">
        <SiteNav />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <EmailSignIn
            embedded
            title="Sign in to admin"
            subtitle="Use your volunteer email sign-in to access local signup records."
            returnPath="/admin"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Admin signup records
          </h1>
          <p className="mt-2 text-muted">
            Local, per-device record log for shift and orientation signups.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearSession();
            setSession(null);
          }}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:border-accent hover:text-accent-deep"
        >
          Sign out
        </button>
      </header>

      <section className="mb-5 rounded-lg border border-border bg-background-elevated p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <span className="font-medium">Month</span>
            <select
              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={monthFilter}
              onChange={(event) => {
                const nextMonth = event.target.value;
                if (nextMonth !== monthFilter) {
                  exitEditing();
                }
                setMonthFilter(nextMonth);
              }}
            >
              <option value="all">All months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatAdminMonthLabel(month)}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-muted">
            Showing {filteredRecords.length} record
            {filteredRecords.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      {filteredRecords.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background-elevated/50 p-6 text-sm text-muted">
          No signup records yet. Submit a shift signup or orientation signup to
          populate this admin list.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([month, monthRecords]) => (
            <section key={month}>
              <h2 className="mb-3 font-display text-2xl text-foreground">
                {formatAdminMonthLabel(month)}
              </h2>
              <ul className="space-y-3">
                {monthRecords.map((record) => {
                  const isEditing = editingId === record.id;
                  return (
                    <li
                      key={record.id}
                      className="rounded-lg border border-border bg-background-elevated p-4 shadow-sm"
                    >
                      {isEditing && draft ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Email
                            </span>
                            <input
                              type="email"
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.email}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  email: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Name
                            </span>
                            <input
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.name}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  name: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Phone
                            </span>
                            <input
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.phone}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  phone: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Date
                            </span>
                            <input
                              type="date"
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.date}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  date: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Source
                            </span>
                            <select
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.source}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  source: event.target
                                    .value as AdminSignupSource,
                                })
                              }
                            >
                              {SOURCE_OPTIONS.map((option) => (
                                <option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Form
                            </span>
                            <input
                              className="rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.form}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  form: event.target.value,
                                })
                              }
                            />
                          </label>
                          <label className="md:col-span-2 flex flex-col gap-1 text-sm">
                            <span className="font-medium text-foreground">
                              Notes
                            </span>
                            <textarea
                              className="min-h-[5rem] rounded-md border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                              value={draft.notes}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  notes: event.target.value,
                                })
                              }
                            />
                          </label>
                          <div className="md:col-span-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={saveEditing}
                              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-deep"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-accent-deep"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                                {record.source === "shift-signup"
                                  ? "Shift signup"
                                  : "Orientation signup"}
                              </p>
                              <p className="font-semibold text-foreground">
                                {record.email}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => startEditing(record)}
                              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted transition hover:border-accent hover:text-accent-deep"
                            >
                              Edit
                            </button>
                          </div>
                          <dl className="grid gap-2 text-sm md:grid-cols-2">
                            <div>
                              <dt className="text-muted">Name</dt>
                              <dd className="text-foreground">{record.name || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted">Phone</dt>
                              <dd className="text-foreground">{record.phone || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted">Form</dt>
                              <dd className="text-foreground">{record.form || "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted">Date</dt>
                              <dd className="text-foreground">{record.date || "—"}</dd>
                            </div>
                            <div className="md:col-span-2">
                              <dt className="text-muted">Notes</dt>
                              <dd className="whitespace-pre-wrap text-foreground">
                                {record.notes || "—"}
                              </dd>
                            </div>
                            <div className="md:col-span-2">
                              <dt className="text-muted">Created</dt>
                              <dd className="text-foreground">
                                {formatCreatedAt(record.createdAt)}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
