export type Shift = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  role: "Dog Walking" | "Cat Care" | "Front Desk" | "Kennel Help";
  spotsOpen: number;
  location: string;
};

export type OrientationSession = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  spotsOpen: number;
  location: string;
};

export type DemoVolunteer = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type DemoOrientationSignup = {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  howHeard: string;
};

export type PanelPhase = "day" | "signup" | "success";
