/**
 * Accessibility settings — ONE source of truth for the floating widget (AccessibilityWidget.tsx)
 * and the statement page's switchboard (legal/Switchboard.tsx).
 *
 * Contract with BaseLayout's inline boot script (keep in sync — it runs before first paint):
 *   localStorage "a11y-settings-v2" = JSON of A11ySettings
 *   body classes: see BODY_CLASS below (+ a11y-high-contrast-dark | a11y-high-contrast-light)
 *   html.style.fontSize = "<n>%" when fontSize !== 100
 * The motion gate (src/lib/motion.ts) watches body.a11y-pause-animations by itself.
 *
 * Every change is broadcast as a window CustomEvent "nz:a11y" (detail = the new settings), so
 * two islands stay in sync even if they were bundled into different chunks. Other tabs sync
 * through the "storage" event.
 */
import { useCallback, useEffect, useState } from "react";

export interface A11ySettings {
  fontSize: number;
  readableFont: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  highContrastDark: boolean;
  highContrastLight: boolean;
  grayscale: boolean;
  invertColors: boolean;
  pauseAnimations: boolean;
  bigCursor: boolean;
  readingGuide: boolean;
  focusOutline: boolean;
}

export type A11yToggle = Exclude<keyof A11ySettings, "fontSize">;

export const A11Y_STORAGE_KEY = "a11y-settings-v2";
export const A11Y_EVENT = "nz:a11y";
/** Ask the floating widget to open its panel (e.g. from the statement page). */
export const A11Y_OPEN_EVENT = "nz:a11y-open";

export const FONT_MIN = 80;
export const FONT_MAX = 200;
export const FONT_STEP = 10;

export const DEFAULT_A11Y: A11ySettings = {
  fontSize: 100,
  readableFont: false,
  highlightLinks: false,
  highlightTitles: false,
  highContrastDark: false,
  highContrastLight: false,
  grayscale: false,
  invertColors: false,
  pauseAnimations: false,
  bigCursor: false,
  readingGuide: false,
  focusOutline: false,
};

/** Same map as the boot script in BaseLayout.astro. */
const BODY_CLASS: Partial<Record<A11yToggle, string>> = {
  readableFont: "a11y-readable-font",
  highlightLinks: "a11y-highlight-links",
  highlightTitles: "a11y-highlight-titles",
  grayscale: "a11y-grayscale",
  invertColors: "a11y-invert-colors",
  pauseAnimations: "a11y-pause-animations",
  bigCursor: "a11y-big-cursor",
  readingGuide: "a11y-reading-guide-active",
  focusOutline: "a11y-focus-outline",
};

/** Hebrew names, shared by the widget, the switchboard and their announcements. */
export const A11Y_LABELS: Record<A11yToggle, string> = {
  readableFont: "גופן קריא",
  highlightLinks: "הדגשת קישורים",
  highlightTitles: "הדגשת כותרות",
  highContrastDark: "ניגודיות כהה",
  highContrastLight: "ניגודיות בהירה",
  grayscale: "גווני אפור",
  invertColors: "היפוך צבעים",
  pauseAnimations: "עצירת אנימציות",
  bigCursor: "סמן גדול",
  readingGuide: "קו עזר לקריאה",
  focusOutline: "מסגרת מיקוד",
};

function sanitize(raw: unknown): A11ySettings {
  const out: A11ySettings = { ...DEFAULT_A11Y };
  if (!raw || typeof raw !== "object") return out;
  const r = raw as Record<string, unknown>;
  for (const key of Object.keys(DEFAULT_A11Y) as (keyof A11ySettings)[]) {
    if (key === "fontSize") {
      const n = Number(r.fontSize);
      if (Number.isFinite(n)) out.fontSize = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(n / FONT_STEP) * FONT_STEP));
    } else if (typeof r[key] === "boolean") {
      out[key] = r[key] as boolean;
    }
  }
  if (out.highContrastDark && out.highContrastLight) out.highContrastLight = false;
  return out;
}

export function readA11y(): A11ySettings {
  if (typeof window === "undefined") return { ...DEFAULT_A11Y };
  try {
    return sanitize(JSON.parse(localStorage.getItem(A11Y_STORAGE_KEY) || "{}"));
  } catch {
    return { ...DEFAULT_A11Y };
  }
}

/** Writes the settings onto <html>/<body> (classes + root font size). */
export function applyA11y(s: A11ySettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;
  root.style.fontSize = s.fontSize === 100 ? "" : `${s.fontSize}%`;
  for (const [key, cls] of Object.entries(BODY_CLASS) as [A11yToggle, string][]) {
    body.classList.toggle(cls, s[key]);
  }
  body.classList.toggle("a11y-high-contrast-dark", s.highContrastDark);
  body.classList.toggle("a11y-high-contrast-light", !s.highContrastDark && s.highContrastLight);
}

export function isDefaultA11y(s: A11ySettings): boolean {
  return (Object.keys(DEFAULT_A11Y) as (keyof A11ySettings)[]).every((k) => s[k] === DEFAULT_A11Y[k]);
}

export function countActive(s: A11ySettings): number {
  return (Object.keys(A11Y_LABELS) as A11yToggle[]).filter((k) => s[k]).length + (s.fontSize !== 100 ? 1 : 0);
}

/** The last committed settings (so quick successive changes never build on a stale render). */
let latest: A11ySettings | null = null;

/** Apply + persist + broadcast. */
export function commitA11y(next: A11ySettings): A11ySettings {
  const clean = sanitize(next);
  latest = clean;
  applyA11y(clean);
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    /* storage blocked: the settings last for this page only */
  }
  window.dispatchEvent(new CustomEvent<A11ySettings>(A11Y_EVENT, { detail: clean }));
  return clean;
}

/** Flip a switch. The two contrast modes are interlocked (only one can be on). */
export function toggled(s: A11ySettings, key: A11yToggle, value = !s[key]): A11ySettings {
  const next = { ...s, [key]: value };
  if (key === "highContrastDark" && value) next.highContrastLight = false;
  if (key === "highContrastLight" && value) next.highContrastDark = false;
  return next;
}

export function withFontSize(s: A11ySettings, size: number): A11ySettings {
  return { ...s, fontSize: Math.min(FONT_MAX, Math.max(FONT_MIN, size)) };
}

export type A11yUpdate = A11ySettings | ((prev: A11ySettings) => A11ySettings);

/**
 * React hook: [settings, update, ready]. `update` takes the next settings or an updater that
 * receives the LATEST committed settings. Server render + first client render use the defaults
 * (identical markup → clean hydration); the saved settings are read right after mounting.
 */
export function useA11ySettings(): [A11ySettings, (next: A11yUpdate) => A11ySettings, boolean] {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_A11Y);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(readA11y());
    setReady(true);
    const onChange = (e: Event) => setSettings((e as CustomEvent<A11ySettings>).detail ?? readA11y());
    const onStorage = (e: StorageEvent) => {
      if (e.key !== A11Y_STORAGE_KEY) return;
      const s = readA11y();
      latest = s;
      applyA11y(s);
      setSettings(s);
    };
    window.addEventListener(A11Y_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(A11Y_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const set = useCallback((next: A11yUpdate) => {
    const base = latest ?? readA11y();
    const committed = commitA11y(typeof next === "function" ? next(base) : next);
    setSettings(committed);
    return committed;
  }, []);
  return [settings, set, ready];
}
