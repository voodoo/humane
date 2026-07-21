import type { DemoOrientationSignup, DemoVolunteer } from "./types";

const PROFILE_KEY = "humane.volunteerProfile";
const SESSION_KEY = "humane.session";
const PENDING_LINK_KEY = "humane.pendingMagicLink";

export type VolunteerProfile = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  emergencyContact?: string;
  howHeard?: string;
};

export type VolunteerSession = {
  email: string;
};

export type PendingMagicLink = {
  email: string;
  token: string;
  createdAt: number;
};

const LINK_TTL_MS = 1000 * 60 * 30;

function isProfile(value: unknown): value is VolunteerProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.name === "string" &&
    typeof v.email === "string" &&
    typeof v.phone === "string"
  );
}

function isSession(value: unknown): value is VolunteerSession {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.email === "string" && v.email.includes("@");
}

function isPendingLink(value: unknown): value is PendingMagicLink {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.email === "string" &&
    typeof v.token === "string" &&
    typeof v.createdAt === "number"
  );
}

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
    // Ignore quota / private-mode failures; demo still works in-memory.
  }
}

function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadVolunteerProfile(): VolunteerProfile | null {
  const parsed = readJson(PROFILE_KEY);
  return isProfile(parsed) ? parsed : null;
}

export function saveVolunteerProfile(
  update: Pick<VolunteerProfile, "name" | "email" | "phone"> &
    Partial<Omit<VolunteerProfile, "name" | "email" | "phone">>,
): void {
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
  writeJson(PROFILE_KEY, next);
}

export function loadSession(): VolunteerSession | null {
  const parsed = readJson(SESSION_KEY);
  return isSession(parsed) ? parsed : null;
}

export function clearSession(): void {
  removeKey(SESSION_KEY);
}

export function createMagicLink(email: string): PendingMagicLink {
  const normalized = email.trim().toLowerCase();
  const pending: PendingMagicLink = {
    email: normalized,
    token: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  writeJson(PENDING_LINK_KEY, pending);
  return pending;
}

export function loadPendingMagicLink(): PendingMagicLink | null {
  const parsed = readJson(PENDING_LINK_KEY);
  if (!isPendingLink(parsed)) return null;
  if (Date.now() - parsed.createdAt > LINK_TTL_MS) {
    removeKey(PENDING_LINK_KEY);
    return null;
  }
  return parsed;
}

export function clearPendingMagicLink(): void {
  removeKey(PENDING_LINK_KEY);
}

export function magicLinkHref(pending: PendingMagicLink): string {
  const params = new URLSearchParams({
    email: pending.email,
    token: pending.token,
  });
  return `/auth/verify?${params.toString()}`;
}

export type VerifyMagicLinkResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

export function verifyMagicLink(
  email: string | null,
  token: string | null,
): VerifyMagicLinkResult {
  if (!email || !token) {
    return { ok: false, error: "This sign-in link is missing details." };
  }

  const pending = loadPendingMagicLink();
  if (!pending) {
    return {
      ok: false,
      error: "This sign-in link expired or was already used. Request a new one.",
    };
  }

  const normalized = email.trim().toLowerCase();
  if (pending.email !== normalized || pending.token !== token) {
    return { ok: false, error: "This sign-in link is not valid." };
  }

  writeJson(SESSION_KEY, { email: normalized } satisfies VolunteerSession);

  const existing = loadVolunteerProfile();
  const existingEmail = existing?.email.trim().toLowerCase() ?? "";

  if (existing && existingEmail === normalized) {
    // Same email — keep name/phone/notes; only normalize the email string.
    if (existing.email !== normalized) {
      saveVolunteerProfile({ ...existing, email: normalized });
    }
  } else if (!existing) {
    saveVolunteerProfile({
      name: "",
      email: normalized,
      phone: "",
    });
  } else {
    // Different email on this device — start a fresh profile for the new identity.
    saveVolunteerProfile({
      name: "",
      email: normalized,
      phone: "",
    });
  }

  clearPendingMagicLink();
  return { ok: true, email: normalized };
}

export function profileToDemoVolunteer(
  profile: VolunteerProfile | null,
  fallback: DemoVolunteer,
): DemoVolunteer {
  if (!profile) return fallback;
  return {
    name: profile.name || fallback.name,
    email: profile.email || fallback.email,
    phone: profile.phone || fallback.phone,
    notes: profile.notes ?? fallback.notes,
  };
}

export function profileToOrientationSignup(
  profile: VolunteerProfile | null,
  fallback: DemoOrientationSignup,
): DemoOrientationSignup {
  if (!profile) return fallback;
  return {
    name: profile.name || fallback.name,
    email: profile.email || fallback.email,
    phone: profile.phone || fallback.phone,
    emergencyContact: profile.emergencyContact ?? fallback.emergencyContact,
    howHeard: profile.howHeard ?? fallback.howHeard,
  };
}

export function displayNameFor(
  profile: VolunteerProfile | null,
  session: VolunteerSession | null,
): string | null {
  if (profile?.name?.trim()) return profile.name.trim();
  if (session?.email) return session.email;
  if (profile?.email) return profile.email;
  return null;
}
