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
      className="sticky top-0 z-40 w-full border-b border-border bg-background-elevated/95 shadow-sm backdrop-blur-sm"
      aria-label="Primary"
    >
      <div className="mx-auto w-full max-w-6xl overflow-x-auto px-2 sm:px-4">
        <ul className="flex w-max min-w-full gap-1 py-1.5 sm:w-full">
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
      </div>
    </nav>
  );
}
