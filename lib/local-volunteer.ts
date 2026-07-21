import type { DemoOrientationSignup, DemoVolunteer } from "./types";

const STORAGE_KEY = "humane.volunteerProfile";

export type VolunteerProfile = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  emergencyContact?: string;
  howHeard?: string;
};

function isProfile(value: unknown): value is VolunteerProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    typeof v.email === "string" &&
    typeof v.phone === "string"
  );
}

export function loadVolunteerProfile(): VolunteerProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveVolunteerProfile(
  update: Pick<VolunteerProfile, "name" | "email" | "phone"> &
    Partial<Omit<VolunteerProfile, "name" | "email" | "phone">>,
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadVolunteerProfile();
    const next: VolunteerProfile = {
      name: update.name,
      email: update.email,
      phone: update.phone,
      notes: update.notes ?? existing?.notes,
      emergencyContact:
        update.emergencyContact ?? existing?.emergencyContact,
      howHeard: update.howHeard ?? existing?.howHeard,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures; demo still works in-memory.
  }
}

export function profileToDemoVolunteer(
  profile: VolunteerProfile | null,
  fallback: DemoVolunteer,
): DemoVolunteer {
  if (!profile) return fallback;
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    notes: profile.notes ?? fallback.notes,
  };
}

export function profileToOrientationSignup(
  profile: VolunteerProfile | null,
  fallback: DemoOrientationSignup,
): DemoOrientationSignup {
  if (!profile) return fallback;
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    emergencyContact: profile.emergencyContact ?? fallback.emergencyContact,
    howHeard: profile.howHeard ?? fallback.howHeard,
  };
}
