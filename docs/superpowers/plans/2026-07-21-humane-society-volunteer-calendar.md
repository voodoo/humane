# Humane Society Volunteer Calendar Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Spec: `docs/superpowers/specs/2026-07-21-humane-society-volunteer-calendar-design.md`. No automated test suite (per approved spec); verify manually. Do not commit unless the user asks.

**Goal:** Build a Next.js frontend demo where volunteers browse a month calendar of open Humane Society shifts and complete a prefilled stub signup to a success state.

**Architecture:** Single App Router page with a client orchestrator holding selected month/day/shift and panel phase. Mock shifts and demo volunteer live in TypeScript modules. No API, auth, or persistence.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Google fonts (serif display + humanist sans)

---

## File map

| Path | Responsibility |
| --- | --- |
| `app/layout.tsx` | Root layout, fonts, metadata |
| `app/page.tsx` | Renders `VolunteerApp` |
| `app/globals.css` | CSS variables, texture backdrop, motion utilities |
| `lib/types.ts` | `Shift`, `DemoVolunteer`, panel phase types |
| `lib/mock-data.ts` | ~20 shifts for current month + demo volunteer |
| `lib/calendar.ts` | Month grid cells, date helpers, shifts-by-day |
| `components/VolunteerApp.tsx` | Client state + layout composition |
| `components/MonthCalendar.tsx` | Month nav + day grid |
| `components/DayShiftPanel.tsx` | Day list / empty / hosts signup+success |
| `components/SignupForm.tsx` | Prefill form + success view |

---

### Task 1: Scaffold Next.js app

**Files:**
- Create: project root via `create-next-app`

- [ ] **Step 1: Scaffold**

```bash
cd /Users/paul/dev/v0-vet
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes
```

Expected: `package.json`, `app/`, `tailwind` config present. If directory is non-empty (docs/), create in temp and move app files into repo root, keeping `docs/`.

- [ ] **Step 2: Add `.gitignore` entry for `.superpowers/`** if missing

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Expected: app loads at localhost:3000

---

### Task 2: Types, mock data, calendar helpers

**Files:**
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`
- Create: `lib/calendar.ts`

- [ ] **Step 1: Types**

```ts
// lib/types.ts
export type Shift = {
  id: string
  date: string // YYYY-MM-DD
  startTime: string
  endTime: string
  role: "Dog Walking" | "Cat Care" | "Front Desk" | "Kennel Help"
  spotsOpen: number
  location: string
}

export type DemoVolunteer = {
  name: string
  email: string
  phone: string
  notes: string
}

export type PanelPhase = "day" | "signup" | "success"
```

- [ ] **Step 2: Mock data** — export `demoVolunteer` and `shifts: Shift[]` with 15–25 entries dated relative to “today” (spread across current calendar month). Use roles above; `location: "Main Shelter"`.

- [ ] **Step 3: Calendar helpers**

```ts
// lib/calendar.ts — implement:
// toISODate(d: Date): string
// startOfMonth(d: Date): Date
// addMonths(d: Date, n: number): Date
// buildMonthGrid(month: Date): { date: Date; inMonth: boolean }[]  // 6x7 weeks, Sun-start
// shiftsOnDate(shifts: Shift[], iso: string): Shift[]
// countByDate(shifts: Shift[]): Record<string, number>
```

---

### Task 3: Global theme and layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: CSS variables** in `globals.css` — warm-gray background, sage/forest accent, subtle noise/texture via CSS, serif/sans font CSS vars. Avoid purple and cream+#terracotta.

- [ ] **Step 2: `layout.tsx`** — load fonts (e.g. Fraunces or Libre Baskerville + Source Sans 3 via `next/font/google`), set metadata title “Humane Society · Volunteer Shifts”, apply body classes.

- [ ] **Step 3: `page.tsx`** — render `<VolunteerApp />` only (placeholder until Task 4).

---

### Task 4: Month calendar component

**Files:**
- Create: `components/MonthCalendar.tsx`

- [ ] **Step 1: Implement** client component props:

```ts
type Props = {
  month: Date
  selectedISO: string | null
  counts: Record<string, number>
  onPrev: () => void
  onNext: () => void
  onSelectDay: (iso: string) => void
}
```

Render month label, prev/next, 7-column weekday headers, day cells. In-month days with `counts[iso]` show green indicator + count. Selected day visually emphasized. Light fade/slide on month change via CSS transition on key={month}.

---

### Task 5: Signup form + day panel

**Files:**
- Create: `components/SignupForm.tsx`
- Create: `components/DayShiftPanel.tsx`

- [ ] **Step 1: `SignupForm`** — on mount/reset, set fields from `demoVolunteer`. Props: `shift`, `onSubmit`, `onCancel`. Submit prevents default and calls `onSubmit` (no fetch).

- [ ] **Step 2: Success block** — either inside `SignupForm` via `phase` prop or sibling in panel: message “You’re signed up for {role}” + Done button.

- [ ] **Step 3: `DayShiftPanel`** — given `phase`, `shiftsForDay`, `selectedShift`, handlers: list shifts (role, time, spots, location); empty copy “No open shifts”; wire signup/success.

---

### Task 6: Orchestrator + polish

**Files:**
- Create: `components/VolunteerApp.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `VolunteerApp`** — brand header (“Humane Society” serif + “Volunteer shifts”), state for `month`, `selectedISO`, `selectedShiftId`, `phase`. Compose calendar + panel (side-by-side desktop; stacked mobile). Panel open transition (slide/fade).

- [ ] **Step 2: Wire page** — import client `VolunteerApp`.

- [ ] **Step 3: Manual verify**

1. `npm run dev` — brand + month grid visible  
2. Click day with shifts — list appears  
3. Click empty day — “No open shifts”  
4. Select shift — form prefilled  
5. Submit — success; Done returns to day/calendar  
6. Narrow viewport — stacked layout usable  

---

## Done when

Volunteer can complete the calendar → day → prefilled signup → success path locally with no env vars or backend.
