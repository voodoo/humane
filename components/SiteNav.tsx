"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/orientation/signup", label: "Orientation form" },
  { href: "/orientation", label: "Start orientation" },
  { href: "/", label: "Shifts" },
  { href: "/donate", label: "Donate" },
  { href: "/screening", label: "Background check" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex flex-wrap gap-2"
      aria-label="Primary"
    >
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-accent text-white"
                : "border border-border bg-background-elevated text-muted hover:border-accent hover:text-accent-deep",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
