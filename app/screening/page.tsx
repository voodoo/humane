import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { BackgroundCheckForm } from "@/components/BackgroundCheckForm";

export const metadata: Metadata = {
  title: "Humane Society · Background check",
  description:
    "Demo volunteer background check / screening form for the Humane Society.",
};

export default function ScreeningPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <SiteNav />
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Humane Society
          </h1>
          <p className="mt-2 text-base text-muted sm:text-lg">
            Background check
          </p>
        </header>
        <BackgroundCheckForm />
      </div>
    </div>
  );
}
