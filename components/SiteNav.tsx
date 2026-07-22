"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadSession } from "@/lib/local-volunteer";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/admin", label: "Admin", adminOnly: true },
  { href: "/orientation/signup", label: "Orientation form" },
  { href: "/orientation", label: "Start orientation" },
  { href: "/", label: "Shifts" },
  { href: "/donate", label: "Donate" },
  { href: "/screening", label: "Background check" },
] as const;

function isAdminEmail(email: string | undefined): boolean {
  return Boolean(email?.trim().toLowerCase().startsWith("admin"));
}

export function SiteNav() {
  const pathname = usePathname();
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setShowAdmin(isAdminEmail(loadSession()?.email));
    });
  }, [pathname]);

  const visibleLinks = links.filter(
    (link) => !("adminOnly" in link && link.adminOnly) || showAdmin,
  );

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b border-border bg-background-elevated/95 shadow-sm backdrop-blur-sm"
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-2 sm:px-4">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex w-max min-w-full gap-1 py-1.5 sm:w-full">
            {visibleLinks.map((link) => {
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
        <ThemeToggle />
      </div>
    </nav>
  );
}
