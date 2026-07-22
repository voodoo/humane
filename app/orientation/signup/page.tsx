import type { Metadata } from "next";
import { MonthlyOrientationSignupForm } from "@/components/MonthlyOrientationSignupForm";
import { formatMonthLabel, startOfMonth } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Humane Society · Orientation signup form",
  description:
    "Monthly volunteer orientation signup form for the Humane Society.",
};

export default function OrientationSignupPage() {
  const monthLabel = formatMonthLabel(startOfMonth(new Date()));

  return <MonthlyOrientationSignupForm monthLabel={monthLabel} />;
}
