/**
 * Legal pages — page copy that is not in src/content/site-settings.ts (which holds the
 * sections themselves): leads, the "בקצרה" constellations, the accessibility diagrams.
 * Rules: no prices, no invented facts, Hebrew written for people.
 */
import type { LegalPageSection } from "@/content/types";

/* ── Rendering the settings' `content` strings ───────────────────────────── */
export type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

/** "\n" separates paragraphs; lines starting with "- " are list items. */
export function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(line.slice(2));
      else blocks.push({ type: "ul", items: [line.slice(2)] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }
  return blocks;
}

/**
 * Splits text into Hebrew runs and Latin runs ("Google Analytics", "nz-web.com", "WCAG 2.1", an
 * email). Latin runs are rendered in <bdi dir="ltr"> so punctuation around them (parentheses,
 * commas) stays in Hebrew order; single tokens (a domain, an email) also never break.
 */
export function nobrParts(text: string): { t: string; nobr: boolean; ltr: boolean; long: boolean }[] {
  const re = /([A-Za-z][\w.@+-]*(?:[ ][A-Za-z0-9][\w.@+-]*)*[\w])/;
  return text
    .split(re)
    .filter(Boolean)
    .map((t) => {
      const ltr = re.test(t) && /^[A-Za-z]/.test(t);
      return { t, ltr, nobr: ltr && !/\s/.test(t), long: t.length > 14 };
    });
}

/** Reading time in whole minutes (≈ 180 Hebrew words a minute). */
export function readingMinutes(sections: LegalPageSection[]): number {
  const words = sections.reduce((n, s) => n + `${s.title} ${s.content}`.split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.round(words / 180));
}

/** "כדקה" / "כ-2 דקות" — Hebrew reading-time label. */
export function readingLabel(minutes: number): string {
  return minutes === 1 ? "כדקה אחת" : `כ-${minutes} דקות`;
}

/* ── /privacy/ — "קבוצת המנעול": the summary as a padlock drawn in stars ──── */
export interface LockStar {
  /** The section this star summarises (its id on the page). */
  section: string;
  name: string;
  summary: string;
  /** Position in the sky, 0–100 on both axes (physical: x from the left). */
  x: number;
  y: number;
  /** Where the name sits next to the star. */
  side: "top" | "bottom" | "left" | "right";
}

export interface LockData {
  stars: LockStar[];
  /** The padlock's edges (indexes into `stars`); `shackle` = the U drawn through both ends. */
  edges: { a: number; b: number; shackle?: boolean }[];
}

/**
 * Six stars on a padlock: 01–02 on the shackle's shoulders, 03–06 at the corners of its body.
 * Traced in order, the finger draws the lock; any order works.
 */
export const privacyLock: LockData = {
  stars: [
    {
      section: "general",
      name: "החוק",
      summary:
        "המדיניות נכתבה לפי חוק הגנת הפרטיות. העיקרון פשוט: אוספים רק את מה שבאמת צריך כדי לענות לכם ולעבוד איתכם.",
      x: 64,
      y: 32,
      side: "right",
    },
    {
      section: "collected",
      name: "מה נאסף",
      summary:
        "רק מה שאתם בוחרים לשלוח: הודעה בוואטסאפ, שיחה או מייל. הטופס באתר מנסח את ההודעה ולא שומר אותה בשום שרת. כלי מדידה נטענים רק אחרי שאישרתם עוגיות.",
      x: 36,
      y: 32,
      side: "left",
    },
    {
      section: "use",
      name: "בשביל מה",
      summary: "כדי לחזור אליכם, להכין הצעה ולתאם עבודה. לא מוכרים מידע ולא מעבירים אותו לאף אחד לצורכי שיווק.",
      x: 25,
      y: 54,
      side: "left",
    },
    {
      section: "third-parties",
      name: "שירותים חיצוניים",
      summary:
        "Netlify מארח את האתר, וואטסאפ מעביר את ההודעות, ו-Google ו-Meta מודדים רק אם אישרתם. לכל אחד מהם מדיניות פרטיות משלו.",
      x: 25,
      y: 84,
      side: "bottom",
    },
    {
      section: "security",
      name: "אבטחה",
      summary: "האתר מוגש בחיבור מוצפן, ופרטי פנייה נשמרים רק כל עוד צריך אותם בשביל הפנייה או העבודה.",
      x: 75,
      y: 84,
      side: "bottom",
    },
    {
      section: "rights",
      name: "הזכויות שלכם",
      summary:
        "אפשר לבקש לראות את המידע, לתקן או למחוק אותו, ולבטל את ההסכמה לעוגיות בכל רגע. פונים לצבי במייל או בטלפון.",
      x: 75,
      y: 54,
      side: "right",
    },
  ],
  /* the shackle (a U over the body, through stars 01–02) + the body's four sides */
  edges: [
    { a: 0, b: 1, shackle: true },
    { a: 2, b: 5 },
    { a: 2, b: 3 },
    { a: 3, b: 4 },
    { a: 4, b: 5 },
  ],
};

/* ── /terms/ — "הכתב הקטן": the plain words under the magnifier ──────────── */
/** One plain-language line per section of the terms (keyed by section id). */
export const termsPlain: Record<string, string> = {
  general: "האתר שייך ל-NZ-web, של צבי משה. מי שגולש בו מסכים לתנאים האלה.",
  services: "מה שכתוב באתר הוא מידע כללי. מה בדיוק נעשה, מתי ובאיזו תמורה, נקבע רק בהצעה אישית ובהסכם.",
  ip: "העיצוב, הקוד והיצירות באתר שלנו. רוצים להשתמש בתמונה? מבקשים רישיון בכתב ונותנים קרדיט עם קישור.",
  links: "קישור שיוצא מהאתר מוביל לאתר של מישהו אחר. מה שקורה שם באחריות של מי שמפעיל אותו.",
  liability: "אנחנו משתדלים לדייק, אבל לפני החלטה חשובה כדאי להתייעץ עם איש מקצוע ולא לסמוך רק על האתר.",
  law: "חל החוק הישראלי. שאלה על התנאים? כתבו לנו במייל ונענה.",
};

/** One plain-language line per section of the privacy policy (the document's margin notes). */
export const privacyPlain: Record<string, string> = {
  general: "אוספים רק מה שצריך, לפי חוק הגנת הפרטיות.",
  collected: "מה שאתם שולחים בעצמכם. מדידה רק אחרי שאישרתם.",
  use: "לענות לכם ולעבוד איתכם. לא מוכרים, לא משווקים הלאה.",
  "third-parties": "Netlify מארח, וואטסאפ מעביר, ומדידה רק באישור שלכם.",
  security: "חיבור מוצפן, ופרטים נשמרים רק כל עוד צריך.",
  rights: "לראות, לתקן, למחוק, לבטל הסכמה. מתי שתרצו.",
  changes: "אם משהו ישתנה, הנוסח החדש יופיע כאן עם תאריך.",
};

/* ── /accessibility/ ─────────────────────────────────────────────────────── */

/** WCAG's four principles (W3C), in plain Hebrew. */
export const pour = [
  { name: "ניתן לתפיסה", line: "אפשר לקלוט את התוכן: לראות, לשמוע, או לשמוע בקורא מסך." },
  { name: "ניתן להפעלה", line: "כל כפתור וקישור עובדים גם בלי עכבר, רק במקלדת." },
  { name: "מובן", line: "הטקסט ברור, והאתר מתנהג כמו שמצפים ממנו." },
  { name: "עמיד", line: "עובד בדפדפנים שונים ועם טכנולוגיות מסייעות." },
];

/** The layers behind "רמת הנגישות והתקן": law → standard → guidelines. */
export const layers = [
  {
    tag: "החוק",
    name: "תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013",
    line: "מחייבות מי שנותן שירות לציבור להנגיש גם את האתר שלו.",
  },
  {
    tag: "התקן",
    name: "ת״י 5568",
    line: "התקן הישראלי לנגישות תכנים באינטרנט, שהתקנות מפנות אליו.",
  },
  {
    tag: "ההנחיות",
    name: "הנחיות WCAG 2.1 ברמה AA",
    line: "ההנחיות הבינלאומיות של W3C, שעליהן התקן מבוסס. מכאן נגזרות הבדיקות בכל עמוד.",
  },
];

/**
 * A small specimen per item of "מה עשינו באתר" (same order as the list in site-settings).
 * Unknown / extra items simply get none.
 */
export const specimens = [
  "headings",
  "skip",
  "focus",
  "contrast",
  "alt",
  "labels",
  "motion",
  "widget",
  "nojs",
] as const;
export type Specimen = (typeof specimens)[number];
