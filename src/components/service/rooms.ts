/**
 * The services wing — ONE list of the core service pages ("rooms"), used by the /services/ floor
 * plan (מפת האולמות), the wayfinding signs (ServiceRelated) and each page's room plaque
 * ("אולם 03 · חדר 01"). Room numbers are stable: a page shows its own number in the hero.
 * Art = the page's signature slug from the art map (SITE-PLAYBOOK §3.5) — as a thumbnail only.
 */
export interface ServiceRoom {
  /** "01" … "08" — the room number on the floor plan and in the page's plaque. */
  num: string;
  /** Full name (link text). */
  name: string;
  /** Short name for the plan (fits in a small room). */
  short: string;
  href: string;
  art: string;
  /** One quiet line: what the room is for. */
  line: string;
  /** "חומרים" — what the work is made of. */
  medium: string;
}

/** The wing number of /services/ in the site's room scheme (SITE-PLAYBOOK §11). */
export const SERVICES_WING = "03";

export const SERVICE_ROOMS: ServiceRoom[] = [
  {
    num: "01",
    name: "אתר תדמית לעסק",
    short: "אתר תדמית",
    href: "/services/business-website/",
    art: "titanium-ribbon",
    line: "האתר שמציג את העסק, עונה על השאלות ומביא פניות.",
    medium: "עמוד בית, עמוד לכל שירות, אודות, עבודות ויצירת קשר",
  },
  {
    num: "02",
    name: "בניית אתרים מקצועיים",
    short: "בניית אתרים",
    href: "/services/web-development/",
    art: "mobius-brick",
    line: "מהסקיצה הראשונה ועד אתר חי, מהיר ונגיש בכל מסך.",
    medium: "אפיון, עיצוב, פיתוח, נגישות ו-SEO בתהליך אחד",
  },
  {
    num: "03",
    name: "פיתוח אתרים",
    short: "פיתוח",
    href: "/services/website-development/",
    art: "shell-staircases",
    line: "מערכות, חיבורים ולוגיקה על בסיס קוד שמחזיק שנים.",
    medium: "ממשקי ניהול, חיבור למערכות קיימות ומסדי נתונים",
  },
  {
    num: "04",
    name: "בניית דפי נחיתה",
    short: "דף לקמפיין",
    href: "/services/landing-pages/",
    art: "coral-ladders",
    line: "עמוד אחד, מסר אחד ופעולה אחת לכל קמפיין.",
    medium: "מסר ממוקד, טופס קצר, מדידה וחיבור לפרסום",
  },
  {
    num: "05",
    name: "פיתוח דף נחיתה",
    short: "לפי מטרה",
    href: "/services/landing-page-development/",
    art: "paper-plane",
    line: "דפי נחיתה לפי מטרה: קמפיין, לידים ובעלי מקצוע.",
    medium: "דף לקמפיין, דף לאיסוף לידים ודף לבעלי מקצוע",
  },
  {
    num: "06",
    name: "מערכת ניהול תורים",
    short: "ניהול תורים",
    href: "/services/appointment-system/",
    art: "brass-clockwork",
    line: "לקוחות קובעים תור לבד, מקבלים תזכורת ומגיעים.",
    medium: "יומן אונליין, תזכורות אוטומטיות וניהול שעות",
  },
  {
    num: "07",
    name: "פיתוח React",
    short: "React",
    href: "/services/react-development/",
    art: "indigo-loom",
    line: "ממשקים ואפליקציות ווב מהירים, בקוד מסודר.",
    medium: "React ו-TypeScript, רכיבים לשימוש חוזר וחיבור ל-API",
  },
  {
    num: "08",
    name: "שיפור מהירות אתר",
    short: "מהירות",
    href: "/services/website-performance/",
    art: "lime-prism",
    line: "מאתרים מה מאט את האתר ומתקנים את זה.",
    medium: "Core Web Vitals, תמונות, קוד וטעינה",
  },
];

/** The room for a page path (with or without trailing slash), or undefined. */
export function roomFor(path: string): ServiceRoom | undefined {
  const norm = (p: string) => p.replace(/\/+$/, "");
  return SERVICE_ROOMS.find((r) => norm(r.href) === norm(path));
}

/** "אולם 03 · חדר 01" for a service path (falls back to the wing only). */
export function roomPlaque(path: string): { wing: string; room?: string } {
  return { wing: SERVICES_WING, room: roomFor(path)?.num };
}
