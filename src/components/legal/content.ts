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

/**
 * nobrParts + contact links: an email becomes a mailto: link and an Israeli phone number
 * ("058-7292029") a tel: link, so a reader of the clause can act on it right there.
 */
export function linkParts(text: string): { t: string; nobr: boolean; ltr: boolean; long: boolean; href?: string }[] {
  const phone = /(0\d{1,2}-\d{7})/;
  return nobrParts(text).flatMap((p) => {
    if (p.ltr) return [/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(p.t) ? { ...p, href: `mailto:${p.t}` } : p];
    return p.t
      .split(phone)
      .filter(Boolean)
      .map((t) =>
        phone.test(t) && /^0\d{1,2}-\d{7}$/.test(t)
          ? { t, ltr: true, nobr: true, long: false, href: `tel:+972${t.slice(1).replace("-", "")}` }
          : { t, ltr: false, nobr: false, long: false },
      );
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
        "המדיניות נכתבה לפי חוק הגנת הפרטיות, כולל תיקון 13. האחראי על המידע הוא NZ-web, של צבי משה, והעיקרון פשוט: אוספים רק את מה שבאמת צריך.",
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
        "Netlify מארח את האתר, וואטסאפ ו-Gmail מעבירים את ההודעות, ו-Google ו-Meta מודדים רק אם אישרתם. המידע עשוי להישמר מחוץ לישראל.",
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
  services: "אין חבילות ואין מחירון. מה בדיוק נעשה, מתי ובאיזו תמורה, נקבע רק בהצעה אישית ובהסכם.",
  ip: "העיצוב, הקוד והיצירות באתר שלנו. רוצים להשתמש בתמונה? מבקשים רישיון בכתב ונותנים קרדיט עם קישור.",
  use: "משתמשים באתר בהגינות: לא פורצים, לא מעמיסים ולא מתחזים.",
  links: "קישור שיוצא מהאתר מוביל לאתר של מישהו אחר. מה שקורה שם באחריות של מי שמפעיל אותו.",
  liability: "אנחנו משתדלים לדייק, אבל לפני החלטה חשובה כדאי להתייעץ עם איש מקצוע ולא לסמוך רק על האתר.",
  changes: "אם התנאים ישתנו, הנוסח החדש יופיע כאן עם תאריך.",
  law: "חל החוק הישראלי, ובתי המשפט בישראל. שאלה על התנאים? כתבו לנו במייל ונענה.",
};

/** One plain-language line per section of the privacy policy (the document's margin notes). */
export const privacyPlain: Record<string, string> = {
  general: "האחראי על המידע הוא NZ-web, ואוספים רק מה שצריך, לפי חוק הגנת הפרטיות.",
  collected: "מה שאתם שולחים בעצמכם. מדידה רק אחרי שאישרתם.",
  use: "לענות לכם ולעבוד איתכם. לא מוכרים, לא משווקים הלאה.",
  cookies: "האתר לא שותל עוגיות משלו. עוגיות מדידה רק אחרי שאישרתם.",
  "third-parties": "Netlify מארח, וואטסאפ ו-Gmail מעבירים, ומדידה רק באישור שלכם.",
  retention: "פרטי פנייה נשמרים רק כל עוד צריך אותם.",
  security: "חיבור מוצפן, ואין באתר מאגר של פרטי פונים.",
  rights: "לראות, לתקן, למחוק, לבטל הסכמה. מתי שתרצו.",
  children: "האתר מיועד לעסקים, לא לילדים.",
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
    name: "הנחיות WCAG ברמה AA",
    line: "ההנחיות הבינלאומיות של W3C. התקן מבוסס על גרסה 2.0, ואנחנו עובדים לפי 2.1, שכוללת אותה ומוסיפה עליה.",
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

/* ── /privacy/ §04 — what is kept in the browser, and the cookies of the measurement tools ──── */
export interface StorageItem {
  /** The key or cookie name, exactly as the browser shows it (Latin, rendered LTR). */
  name: string;
  /** Where it lives. */
  where: string;
  what: string;
  /** How long it stays. */
  life: string;
  /** When it is written at all. */
  when: string;
}

/**
 * Verified against the code (Nov 2026): CookieConsent.tsx (the two consent keys), a11y-store.ts
 * ("a11y-settings-v2", written only on a change), blog/ArticleBlocks.astro (checklist ticks),
 * offer/ScopeBubble.tsx + pages/thank-you.astro ("nz-wa-brief", sessionStorage, written on send),
 * lib/analytics.ts (GA4 / Meta Pixel, injected only after "accepted"). Third-party lifetimes are
 * the providers' documented defaults. Keep this list in sync when a key is added or removed.
 */
export const storageOwn: StorageItem[] = [
  {
    name: "nz_web_cookie_consent",
    where: "localStorage",
    what: "הבחירה שלכם בבאנר העוגיות: אישור או רק חיוניות.",
    life: "עד שתמחקו אותו בדפדפן",
    when: "כשבוחרים בבאנר",
  },
  {
    name: "nz_web_cookie_preferences",
    where: "localStorage",
    what: "אותה בחירה, לפי סוג: חיוניות, מדידה, שיווק.",
    life: "עד שתמחקו אותו בדפדפן",
    when: "כשבוחרים בבאנר",
  },
  {
    name: "a11y-settings-v2",
    where: "localStorage",
    what: "ההגדרות שבחרתם בתפריט הנגישות, כמו גודל טקסט וניגודיות.",
    life: "עד שתמחקו אותו בדפדפן",
    when: "רק אם שיניתם הגדרה",
  },
  {
    name: "nz-check:<מאמר>:<רשימה>",
    where: "localStorage",
    what: "הסימונים שלכם ברשימות הבדיקה שבמאמרים.",
    life: "עד שתמחקו אותו בדפדפן",
    when: "רק אם סימנתם פריט",
  },
  {
    name: "nz-wa-brief",
    where: "sessionStorage",
    what: "ההודעה שניסחתם בעמוד ההצעה, כדי שעמוד התודה יוכל לפתוח אותה שוב בוואטסאפ.",
    life: "עד שסוגרים את הלשונית",
    when: "כשלוחצים לשלוח",
  },
];

export const storageThird: StorageItem[] = [
  {
    name: "_ga, _ga_<מזהה>",
    where: "עוגייה של Google",
    what: "Google Analytics: מבחין בין ביקורים כדי לספור אותם, בלי לזהות אתכם בשם.",
    life: "לפי Google: עד שנתיים",
    when: "רק אחרי אישור",
  },
  {
    name: "_fbp, _fbc",
    where: "עוגייה של Meta",
    what: "Meta Pixel: מדידת קמפיינים ופרסום ב-Facebook וב-Instagram.",
    life: "לפי Meta: עד 90 יום",
    when: "רק אחרי אישור",
  },
];
