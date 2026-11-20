/**
 * Site navigation — the single list used by the header, the mobile menu and the
 * footer. Each service carries its signature artwork (SITE-PLAYBOOK art map), which
 * the header's services panel previews on hover/focus.
 */
export interface ServiceNavItem {
  label: string;
  href: string;
  /** One quiet line under the name. */
  desc: string;
  art: string;
}

export const serviceNav: ServiceNavItem[] = [
  { label: "אתר תדמית לעסק", href: "/services/business-website/", desc: "האתר שמציג את העסק ומביא פניות", art: "titanium-ribbon" },
  { label: "בניית אתרים מקצועיים", href: "/services/web-development/", desc: "מהסקיצה ועד ההשקה, בכל מסך", art: "mobius-brick" },
  { label: "פיתוח אתרים", href: "/services/website-development/", desc: "מערכות, חיבורים וקוד שמחזיק שנים", art: "shell-staircases" },
  { label: "בניית דפי נחיתה", href: "/services/landing-pages/", desc: "עמוד אחד, מטרה אחת, פניות", art: "coral-ladders" },
  { label: "פיתוח דף נחיתה", href: "/services/landing-page-development/", desc: "לפי המטרה: קמפיין, לידים, בעלי מקצוע", art: "paper-plane" },
  { label: "מערכת ניהול תורים", href: "/services/appointment-system/", desc: "הזמנה אונליין ותזכורות אוטומטיות", art: "brass-clockwork" },
  { label: "פיתוח React", href: "/services/react-development/", desc: "ממשקים ואפליקציות ווב מהירים", art: "indigo-loom" },
  { label: "שיפור מהירות אתר", href: "/services/website-performance/", desc: "מאתרים מה מאט ומתקנים", art: "lime-prism" },
];

export interface MainNavItem {
  label: string;
  href: string;
}

/** Desktop header order (שירותים is the panel trigger and is rendered separately). */
export const mainNav: MainNavItem[] = [
  { label: "עבודות", href: "/projects/" },
  { label: "ההצעה", href: "/packages/" },
  { label: "מגזין", href: "/blog/" },
  { label: "אודות", href: "/about/" },
  { label: "שאלות נפוצות", href: "/faq/" },
];

/** Mobile menu — numbered, large serif. */
export const mobileNav: MainNavItem[] = [
  { label: "דף הבית", href: "/" },
  { label: "שירותים", href: "/services/" },
  { label: "עבודות", href: "/projects/" },
  { label: "ההצעה", href: "/packages/" },
  { label: "מגזין", href: "/blog/" },
  { label: "אודות", href: "/about/" },
  { label: "שאלות נפוצות", href: "/faq/" },
  { label: "צור קשר", href: "/contact/" },
];

/** Footer "הסטודיו" column (the glossary sits with the magazine: reading material). */
export const studioNav: MainNavItem[] = [
  { label: "עבודות", href: "/projects/" },
  { label: "ההצעה", href: "/packages/" },
  { label: "מגזין", href: "/blog/" },
  { label: "מילון מונחים", href: "/glossary/" },
  { label: "אודות", href: "/about/" },
  { label: "שאלות נפוצות", href: "/faq/" },
  { label: "צור קשר", href: "/contact/" },
];

export const legalNav: MainNavItem[] = [
  { label: "הצהרת נגישות", href: "/accessibility/" },
  { label: "מדיניות פרטיות", href: "/privacy/" },
  { label: "תנאי שימוש", href: "/terms/" },
];

/** Studio facts (SITE-PLAYBOOK §2). */
export const studio = {
  email: "zstore.ai295@gmail.com",
  /** Render as: {days} <bdi dir="ltr">{time}</bdi> — the time range must stay LTR. */
  days: "א׳–ה׳",
  time: "09:00–19:00",
  /** The Google Business Profile (Knowledge Graph id); also Organization.sameAs in src/lib/site-graph.ts. */
  googleProfile: "https://www.google.com/search?kgmid=/g/11nq8wcnzc",
};

/** Normalises a path for "current page" checks ("/about" ≡ "/about/"). */
export const samePath = (a: string, b: string) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

/** Room numbers — the order of the site map (mobile menu, then the legal pages). */
const ROOMS = [...mobileNav.slice(1), ...legalNav].map((item) => item.href);

/** "/privacy/" → 10 (01-based), or undefined for pages outside the map. */
export function roomFor(path?: string): number | undefined {
  if (!path) return undefined;
  const top = `/${path.split("/").filter(Boolean)[0] ?? ""}/`;
  const i = ROOMS.indexOf(top);
  return i >= 0 ? i + 1 : undefined;
}
