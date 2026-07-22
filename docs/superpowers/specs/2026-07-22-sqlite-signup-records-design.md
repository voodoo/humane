# SQLite signup records — design

**Date:** 2026-07-22  
**Status:** Approved for planning  
**Scope:** Persist shift and orientation signup records (with dates) in a local SQLite database, replacing browser `localStorage` admin records.

## Goals

- Store signup records in SQLite at `data/humane.db` so they survive across browsers/devices on the same server.
- Keep the existing `/admin` UI behavior (list, month filter, inline edit).
- Have shift and orientation signup flows write to the database via HTTP APIs.

## Non-goals

- Login / auth audit logging
- Hosted SQLite (Turso) or Vercel serverless persistence
- Migrating existing `localStorage` signup rows
- Changing magic-link auth or volunteer session/profile storage (those stay in `localStorage`)
- Hardening API auth beyond the current demo model

## Decisions

| Decision | Choice |
| --- | --- |
| What to store | Shift + orientation signup records (dates included) |
| Replace vs dual-write | Replace `humane.adminSignupRecords` localStorage |
| DB location | Local file `data/humane.db` |
| Migration of old local data | None — start fresh |
| Stack | `better-sqlite3` + thin Next.js route handlers (no Drizzle for this slice) |

## Architecture

```
Shift / orientation submit
        │
        ▼
POST /api/signups  ──► lib/signups.ts ──► lib/db.ts ──► data/humane.db
                                                          │
Admin /admin UI ◄── GET /api/signups (?month=) ◄──────────┘
        │
        └── PATCH /api/signups/[id]
```

- `lib/db.ts` opens the DB (create `data/` if needed), runs `CREATE TABLE IF NOT EXISTS`, exposes a singleton connection for Node route handlers.
- `lib/signups.ts` holds typed create / list / update helpers and shared record types.
- Client code stops calling `lib/local-admin-signups.ts` for runtime persistence (module can be removed or left unused after cutover).

## Schema

Table `signups` (mirrors current `AdminSignupRecord`):

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PRIMARY KEY | UUID |
| `email` | TEXT NOT NULL | |
| `name` | TEXT NOT NULL | |
| `phone` | TEXT NOT NULL | |
| `notes` | TEXT NOT NULL | |
| `source` | TEXT NOT NULL | `shift-signup` \| `orientation-signup` |
| `form` | TEXT NOT NULL | Role or “Monthly orientation” |
| `date` | TEXT NOT NULL | `YYYY-MM-DD` (shift/event date) |
| `created_at` | INTEGER NOT NULL | Unix ms |
| `month` | TEXT NOT NULL | `YYYY-MM` derived from `created_at` (admin filter) |

Indexes: `month`, `date` (optional but useful for filters).

## API

### `GET /api/signups`

- Optional query: `month=YYYY-MM`
- Response: `{ records: SignupRecord[] }` ordered by `created_at` desc

### `POST /api/signups`

- Body: `{ email, name, phone, notes?, source, form, date }`
- Validates required fields and `source`
- Inserts row; returns `{ record }` with generated `id`, `created_at`, `month`
- Status: `201` / `400` / `500`

### `PATCH /api/signups/[id]`

- Body: partial `{ email, name, phone, notes, source, form, date }`
- Recalculates `month` if needed only from `created_at` (unchanged on edit) — same as today
- Status: `200` / `400` / `404` / `500`

### Auth (demo)

- UI: `/admin` remains gated by signed-in session + email starting with `admin` (client-side, as today).
- API: no new auth for this slice (local demo server). Documented limitation; tighten later if needed.

## UI changes

- **VolunteerApp / MonthlyOrientationSignupForm:** on successful signup, `POST /api/signups` instead of `addAdminSignupRecord`. On failure, show inline error; do not claim success if the write failed (success panel only after `201`).
- **AdminSignupRecords:** load with `GET`; save edits with `PATCH`; remove localStorage dependency. Surface load/save errors clearly.
- **Theme / sessions / profiles:** unchanged.

## Error handling

- Invalid payload → `400` with short message
- Missing id → `404`
- DB open/write failure → `500`, log server-side; no silent fallback to localStorage
- Ensure `data/` exists before open

## Testing

- Manual: submit shift signup + orientation signup → rows appear in `/admin` → edit → refresh persists from SQLite
- Confirm `data/humane.db` is created and gitignored
- Confirm old `humane.adminSignupRecords` is no longer written

## Files (expected)

| Path | Action |
| --- | --- |
| `lib/db.ts` | Add |
| `lib/signups.ts` | Add |
| `app/api/signups/route.ts` | Add |
| `app/api/signups/[id]/route.ts` | Add |
| `components/VolunteerApp.tsx` | Use API |
| `components/MonthlyOrientationSignupForm.tsx` | Use API |
| `components/AdminSignupRecords.tsx` | Use API |
| `lib/local-admin-signups.ts` | Remove or deprecate after cutover |
| `.gitignore` | Ignore `data/*.db`, `data/*.db-*` |
| `package.json` | Add `better-sqlite3` (+ types) |

## Risks

- **Native module:** `better-sqlite3` requires a working build toolchain; Node runtime only (not Edge).
- **Deploy:** local file DB will not work on typical Vercel serverless without a later move to hosted SQLite.
- **Open write API:** acceptable for local demo; not production-safe.
