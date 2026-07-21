import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { formatMonthLabel, startOfMonth } from "@/lib/calendar";

export const metadata: Metadata = {
  title: "Humane Society · Start orientation",
  description:
    "Start the Humane Society volunteer orientation signup process.",
};

export default function OrientationStartPage() {
  const monthLabel = formatMonthLabel(startOfMonth(new Date()));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <SiteNav />
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          Humane Society
        </h1>
        <p className="mt-2 text-base text-muted sm:text-lg">
          Start of orientation signup
        </p>
      </header>

      <section className="rounded-lg border border-border bg-background-elevated p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Step 1
        </p>
        <h2 className="mt-1 font-display text-2xl text-foreground">
          {monthLabel} orientation
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
          New volunteers complete a single signup for this month. You’ll get
          orientation details after you submit the form — this demo does not
          send email or save data.
        </p>
        <Link
          href="/orientation/signup"
          className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          Continue to signup form
        </Link>
      </section>
    </div>
  );
}
