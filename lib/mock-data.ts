import type {
  DemoOrientationSignup,
  DemoVolunteer,
  OrientationSession,
  Shift,
} from "./types";
import { toISODate } from "./calendar";

export const demoVolunteer: DemoVolunteer = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "(555) 214-8830",
  notes: "Available weekday mornings; happy to help with dogs.",
};

export const demoDonation = {
  amount: "50",
  frequency: "One-time" as const,
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  cardNumber: "4242 4242 4242 4242",
  expiry: "08/28",
  cvc: "123",
  zip: "97201",
};

export const demoBackgroundCheck = {
  legalName: "Alexandra Marie Rivera",
  dateOfBirth: "1992-04-18",
  ssnLastFour: "4821",
  address: "1420 Hawthorne Blvd",
  city: "Portland",
  state: "OR",
  zip: "97201",
  consent: true,
};

export const demoOrientationSignup: DemoOrientationSignup = {
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "(555) 214-8830",
  emergencyContact: "Jordan Rivera · (555) 214-9901",
  howHeard: "Friend / family",
};

const ROLES: Shift["role"][] = [
  "Dog Walking",
  "Cat Care",
  "Front Desk",
  "Kennel Help",
];

function buildShiftsForMonth(anchor: Date): Shift[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const templates: {
    day: number;
    startTime: string;
    endTime: string;
    role: Shift["role"];
    spotsOpen: number;
  }[] = [
    { day: 2, startTime: "09:00", endTime: "11:00", role: "Dog Walking", spotsOpen: 2 },
    { day: 3, startTime: "13:00", endTime: "15:00", role: "Cat Care", spotsOpen: 1 },
    { day: 5, startTime: "10:00", endTime: "14:00", role: "Front Desk", spotsOpen: 3 },
    { day: 5, startTime: "15:00", endTime: "17:00", role: "Kennel Help", spotsOpen: 2 },
    { day: 8, startTime: "09:00", endTime: "11:00", role: "Dog Walking", spotsOpen: 2 },
    { day: 8, startTime: "11:00", endTime: "13:00", role: "Cat Care", spotsOpen: 1 },
    { day: 10, startTime: "08:00", endTime: "12:00", role: "Front Desk", spotsOpen: 2 },
    { day: 12, startTime: "14:00", endTime: "16:00", role: "Kennel Help", spotsOpen: 1 },
    { day: 14, startTime: "09:00", endTime: "11:00", role: "Dog Walking", spotsOpen: 3 },
    { day: 15, startTime: "10:00", endTime: "12:00", role: "Cat Care", spotsOpen: 2 },
    { day: 15, startTime: "13:00", endTime: "17:00", role: "Front Desk", spotsOpen: 1 },
    { day: 17, startTime: "09:00", endTime: "12:00", role: "Kennel Help", spotsOpen: 2 },
    { day: 19, startTime: "08:00", endTime: "10:00", role: "Dog Walking", spotsOpen: 2 },
    { day: 19, startTime: "10:00", endTime: "12:00", role: "Dog Walking", spotsOpen: 1 },
    { day: 21, startTime: "13:00", endTime: "15:00", role: "Cat Care", spotsOpen: 2 },
    { day: 22, startTime: "09:00", endTime: "13:00", role: "Front Desk", spotsOpen: 2 },
    { day: 24, startTime: "14:00", endTime: "16:00", role: "Kennel Help", spotsOpen: 1 },
    { day: 26, startTime: "09:00", endTime: "11:00", role: "Dog Walking", spotsOpen: 2 },
    { day: 26, startTime: "11:00", endTime: "13:00", role: "Cat Care", spotsOpen: 1 },
    { day: 28, startTime: "10:00", endTime: "14:00", role: "Front Desk", spotsOpen: 3 },
    { day: Math.min(29, daysInMonth), startTime: "15:00", endTime: "17:00", role: "Kennel Help", spotsOpen: 2 },
  ];

  return templates
    .filter((t) => t.day <= daysInMonth)
    .map((t, i) => ({
      id: `shift-${year}-${month + 1}-${t.day}-${i}`,
      date: toISODate(new Date(year, month, t.day)),
      startTime: t.startTime,
      endTime: t.endTime,
      role: t.role ?? ROLES[i % ROLES.length],
      spotsOpen: t.spotsOpen,
      location: "Main Shelter",
    }));
}

/** Shifts for the calendar month containing `month` (defaults to today). */
export function getShiftsForMonth(month: Date = new Date()): Shift[] {
  return buildShiftsForMonth(month);
}

/** All mock shifts for the current month at module load (demo default). */
export const shifts: Shift[] = getShiftsForMonth(new Date());

function buildOrientationForMonth(anchor: Date): OrientationSession[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const templates: {
    day: number;
    startTime: string;
    endTime: string;
    title: string;
    spotsOpen: number;
  }[] = [
    {
      day: 4,
      startTime: "10:00",
      endTime: "12:00",
      title: "New Volunteer Orientation",
      spotsOpen: 12,
    },
    {
      day: 7,
      startTime: "18:00",
      endTime: "20:00",
      title: "Evening Orientation",
      spotsOpen: 8,
    },
    {
      day: 11,
      startTime: "10:00",
      endTime: "12:00",
      title: "New Volunteer Orientation",
      spotsOpen: 10,
    },
    {
      day: 16,
      startTime: "09:00",
      endTime: "11:00",
      title: "Shelter Tour & Signup",
      spotsOpen: 15,
    },
    {
      day: 20,
      startTime: "18:00",
      endTime: "20:00",
      title: "Evening Orientation",
      spotsOpen: 8,
    },
    {
      day: 23,
      startTime: "10:00",
      endTime: "12:00",
      title: "New Volunteer Orientation",
      spotsOpen: 12,
    },
    {
      day: 27,
      startTime: "14:00",
      endTime: "16:00",
      title: "Weekend Orientation",
      spotsOpen: 20,
    },
    {
      day: Math.min(30, daysInMonth),
      startTime: "10:00",
      endTime: "12:00",
      title: "New Volunteer Orientation",
      spotsOpen: 10,
    },
  ];

  return templates
    .filter((t) => t.day <= daysInMonth)
    .map((t, i) => ({
      id: `orient-${year}-${month + 1}-${t.day}-${i}`,
      date: toISODate(new Date(year, month, t.day)),
      startTime: t.startTime,
      endTime: t.endTime,
      title: t.title,
      spotsOpen: t.spotsOpen,
      location: "Education Room · Main Shelter",
    }));
}

export function getOrientationSessionsForMonth(
  month: Date = new Date(),
): OrientationSession[] {
  return buildOrientationForMonth(month);
}
