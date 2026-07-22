export type ThemeId =
  | "spring"
  | "summer"
  | "fall"
  | "winter"
  | "light"
  | "dark";

export const THEME_STORAGE_KEY = "humane-theme";

export const THEMES: { id: ThemeId; icon: string; label: string }[] = [
  { id: "spring", icon: "\u{1F331}", label: "Spring" },
  { id: "summer", icon: "\u{1F33B}", label: "Summer" },
  { id: "fall", icon: "\u{1F342}", label: "Fall" },
  { id: "winter", icon: "\u{2744}\u{FE0F}", label: "Winter" },
  { id: "light", icon: "\u{2600}\u{FE0F}", label: "Light" },
  { id: "dark", icon: "\u{1F319}", label: "Dark" },
];

const THEME_IDS = new Set<string>(THEMES.map((t) => t.id));

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && THEME_IDS.has(value);
}

export function loadTheme(): ThemeId {
  if (typeof window === "undefined") return "spring";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(stored) ? stored : "spring";
  } catch {
    return "spring";
  }
}

export function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme: ThemeId) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}
