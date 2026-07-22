"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Admin" },
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
      className="mb-6 overflow-x-auto rounded-lg border border-border bg-background-elevated shadow-sm"
      aria-label="Primary"
    >
      <ul className="flex w-max min-w-full flex-wrap gap-1 p-1 sm:w-full">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href;
          return (
            <li key={link.href} className="min-w-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "block whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-accent-soft hover:text-accent-deep",
                ].join(" ")}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
