import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { MonthlyOrientationSignupForm } from "@/components/MonthlyOrientationSignupForm";
import { formatMonthLabel, startOfMonth } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Humane Society · Orientation signup form",
  description:
    "Monthly volunteer orientation signup form for the Humane Society.",
};

export default function OrientationSignupPage() {
  const monthLabel = formatMonthLabel(startOfMonth(new Date()));

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <SiteNav />
      <p className="mb-4">
        <Link
          href="/orientation"
          className="text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          ← Start of this process
        </Link>
      </p>
      <header className="mb-6">
        <h1 className="font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          Orientation signup
        </h1>
        <p className="mt-2 text-muted">
          One form for {monthLabel}
        </p>
      </header>
      <MonthlyOrientationSignupForm monthLabel={monthLabel} />
    </div>
  );
}
