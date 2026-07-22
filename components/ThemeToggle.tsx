"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  loadTheme,
  saveTheme,
  THEMES,
  type ThemeId,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>("spring");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setTheme(loadTheme());
      setMounted(true);
    });
  }, []);

  const index = THEMES.findIndex((t) => t.id === theme);
  const current = THEMES[index] ?? THEMES[0];
  const next = THEMES[(index + 1) % THEMES.length] ?? THEMES[0];

  function handleClick() {
    setTheme(next.id);
    applyTheme(next.id);
    saveTheme(next.id);
  }

  return (
    <button
      type="button"
      aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
      title={`Theme: ${current.label}`}
      onClick={handleClick}
      className="rounded-full p-1.5 text-sm leading-none transition hover:bg-accent-soft"
    >
      <span aria-hidden="true">{mounted ? current.icon : THEMES[0].icon}</span>
    </button>
  );
}
