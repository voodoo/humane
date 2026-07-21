# Humane Society Volunteer Calendar — Design Spec

Date: 2026-07-21  
Status: Approved for implementation planning

## Goal

A frontend demo app for the Humane Society that lets volunteers browse open shifts on a month calendar and sign up for a shift. Forms are stubbed and autofilled with demo data; submit shows success only (no persistence).

## Scope

### In scope

- Month-grid calendar of volunteer shifts
- Day selection → list of that day’s open shifts
- Shift selection → signup form (prefilled) → success confirmation
- Static mock shift data for the current month
- Responsive layout (calendar above panel on small screens)

### Out of scope

- Authentication / accounts
- Database or API persistence
- Email / SMS notifications
- Admin tools to create or edit shifts
- “My shifts” history across sessions
- Vet clinic / animal appointment scheduling

## Architecture

- **Framework:** Next.js App Router, TypeScript, Tailwind CSS
- **UI:** Lightweight primitives (button, input, textarea, panel/dialog) — no full design-system overhaul
- **Data:** Local TypeScript module exporting mock `Shift[]` and a demo volunteer profile
- **State:** Client-side only — selected month, selected day, selected shift, form/success phase
- **Routing:** Single primary page (`/`) with calendar + side panel (or modal on narrow viewports)

```
User → MonthCalendar → select day → DayShiftList → select shift
     → SignupForm (autofilled) → Success → back to calendar
```

## Screens & interaction

1. **Calendar home**
   - Brand-forward header: Humane Society wordmark + short line (“Volunteer shifts”)
   - Month navigation (prev / next / current label)
   - Grid of days; days with open shifts show a count indicator
2. **Day panel**
   - Lists shifts: role, time range, spots open, location
   - Empty state: “No open shifts”
3. **Signup**
   - Shift summary + form fields (name, email, phone, optional notes)
   - Fields load with demo volunteer data on open
   - Submit → success message; Done closes panel; mock calendar unchanged

## Data model

### Shift

| Field | Type | Notes |
| --- | --- | --- |
| id | string | Stable mock id |
| date | string | ISO date `YYYY-MM-DD` |
| startTime | string | e.g. `09:00` |
| endTime | string | e.g. `11:00` |
| role | string | Dog Walking, Cat Care, Front Desk, Kennel Help |
| spotsOpen | number | Display only |
| location | string | e.g. Main Shelter |

### Demo volunteer (form autofill)

- name, email, phone, notes (optional)

### Mock volume

About 15–25 shifts spread across the viewed month so the grid feels populated.

## Visual design

- Calm shelter aesthetic: soft sage / forest green accents on a light warm-gray backdrop with subtle texture (not flat white; avoid purple and cream+terracotta clichés)
- Serif display for brand title; humanist sans for UI and calendar
- First viewport: brand + one supporting line + month calendar as dominant surface — no stat strips or hero cards
- Motion: month transition, day-select highlight, panel open (2–3 intentional motions)

## Error handling & demo behavior

- No network calls; submit cannot fail for server reasons
- Empty days and full UI states covered with copy
- Light client checks only as needed for demo feel (fields present)

## Testing

- Manual: browse month, open day with shifts, complete signup to success, empty day, mobile width
- No automated test suite required for this stub demo

## Success criteria

- Volunteer can find an open shift on the month grid and complete a prefilled signup to a success state in under a minute
- App runs locally with `npm run dev` and needs no env vars or backend
