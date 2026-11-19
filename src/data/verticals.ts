/**
 * verticals.ts, config-driven "אתר תדמית" vertical pages.
 *
 * Each industry page (lawyer, accountant, clinic, …) is pure DATA here. A single
 * route component (`VerticalBusinessWebsite.tsx`) looks up the slug and renders
 * the shared `ServicePageTemplate`, so adding a new vertical = add one object to
 * `VERTICALS` (src/pages/services/business-website/[vertical].astro builds a static page
 * for every key, and scripts/postbuild.mjs lists it in the sitemap). The layout
 * is reused; every page's COPY is genuinely unique (no spun/duplicated text).
 *
 * Hub-and-spoke: every vertical links UP to the business-website hub and across
 * to relevant services with descriptive Hebrew anchor text (never "לחץ כאן").
 */
import {
  Scale,
  ShieldCheck,
  FileText,
  Search,
  Lock,
  Layers,
  Smartphone,
} from "lucide-react";
import type {
  ServicePageConfig,
  ServiceFeature,
  ServiceStep,
  ServiceFaq,
  ServiceAudienceItem,
  ServiceDeepDiveBlock,
} from "@/components/ServicePageTemplate";
import serviceDevImg from "@/assets/service-dev.webp";
import { accountant } from "./verticals/accountant";
import { realEstate } from "./verticals/real-estate";
import { clinic } from "./verticals/clinic";
import { architect } from "./verticals/architect";
import { consultant } from "./verticals/consultant";
import { beauty } from "./verticals/beauty";
import { contractor } from "./verticals/contractor";

const BASE_URL = "https://nz-web.com";
const HUB = { name: "אתר תדמית לעסקים", path: "/services/business-website" } as const;

/** A vertical = the unique content; boilerplate (breadcrumb/schema/url) is derived. */
export interface VerticalContent {
  slug: string;
  /** breadcrumb leaf + nav label */
  navName: string;
  seo: { title: string; description: string };
  schemaServiceType: string;
  hero: ServicePageConfig["hero"];
  intro: ServicePageConfig["intro"];
  deepDive?: { title: string; blocks: ServiceDeepDiveBlock[] };
  whoFor?: { title: string; subtitle?: string; items: ServiceAudienceItem[] };
  features: ServiceFeature[];
  process: ServiceStep[];
  results: ServicePageConfig["results"];
  faqs: ServiceFaq[];
  cta: ServicePageConfig["cta"];
  image?: { src: string; alt: string; width: number; height: number };
  /** Signature artwork slug (src/content/art-manifest.json) for this page's hero. */
  art?: string;
  /** sideways / downward internal links (the hub link is added automatically). */
  related: { label: string; href: string }[];
}

/* ───────────────────────── LAWYER / עורך דין ───────────────────────── */
const lawyer: VerticalContent = {
  slug: "lawyer",
  art: "balance-dome",
  navName: "אתר תדמית לעורך דין",
  seo: {
    title: 'בניית אתר תדמית לעורך דין ולמשרד עורכי דין | NZ-web',
    description:
      'בניית אתר תדמית לעורך דין שמשרה ביטחון ומביא פניות איכותיות. עיצוב מקצועי, עמוד לכל תחום עיסוק, נגישות לפי חוק ו-SEO מובנה, בהתאם לכללי לשכת עורכי הדין.',
  },
  schemaServiceType: "Law Firm Website Development",
  hero: {
    badge: "אתר תדמית לעורכי דין",
    badgeIcon: Scale,
    title: "בניית אתר תדמית לעורך דין שמשרה ביטחון",
    highlight: "שמשרה ביטחון",
    subtitle:
      'לקוח שמחפש עורך דין נכנס קודם כל לאתר, ושם הוא מחליט אם אתם נראים כמו מי שאפשר לסמוך עליו. אנחנו בונים אתר תדמית מדויק למשרד עורכי דין: מקצועי, מאופק ובהתאם לכללי הלשכה, כזה שמסביר את תחומי העיסוק ומוביל לפנייה.',
    stats: [
      { value: "24/7", label: "זמין לפניות" },
      { value: "דיסקרטי", label: "מסלול פנייה מכבד" },
      { value: "עברית", label: "כתוב ומעוצב מימין לשמאל" },
    ],
    ctaText: "רוצה אתר למשרד",
  },
  intro: {
    title: "למה למשרד עורכי דין מגיע אתר תדמית אמיתי",
    paragraphs: [
      'בתחום המשפטי המוצר הוא אמון. לקוח שמתלבט אם להפקיד בידיכם תיק גירושין, עסקה במקרקעין או הליך פלילי לא קונה שירות, הוא קונה ביטחון. האתר הוא ההזדמנות הראשונה, ולעיתים היחידה, לשדר את אותו ביטחון עוד לפני שיחת הטלפון הראשונה.',
      'רוב מי שמחפש עורך דין מתחיל בגוגל: "עורך דין נדל\\"ן בתל אביב", "עורך דין משפחה בחיפה", "עורך דין מקרקעין בירושלים". מי שאין לו אתר תדמית פשוט לא קיים ברגע הקריטי הזה, והפנייה הולכת למתחרה שכן הופיע, גם אם הוא פחות מנוסה.',
      'אתר תדמית לעו"ד אינו "עוד אתר". הוא צריך לאזן בין מקצועיות שמרנית לבין בהירות שמדברת ללקוח שאינו משפטן, ולעמוד בכללי לשכת עורכי הדין בנוגע לפרסומת, בלי הבטחות תוצאה, בלי השוואות ראוותניות, אבל עם הצגה ברורה ומכובדת של הניסיון והתחומים שלכם.',
      'אנחנו בונים בדיוק את האתר הזה: עיצוב נקי ומכובד, מבנה שמסביר מי אתם ובמה אתם עוסקים, ומסלול פנייה דיסקרטי ונוח. אתר שעובד עבורכם מסביב לשעון, מסנן פניות לא רלוונטיות ומציג את המשרד במיטבו.',
    ],
  },
  deepDive: {
    title: "מה חשוב שיהיה באתר תדמית של עורך דין",
    blocks: [
      {
        heading: "עמוד נפרד לכל תחום עיסוק",
        body: 'משרד שעוסק בדיני משפחה, מקרקעין, נזיקין ודין מסחרי לא צריך עמוד שירותים אחד עמוס, אלא עמוד ייעודי לכל תחום. ללקוח זה נותן תשובה ממוקדת ("בדיוק מה שחיפשתי"), ולגוגל זה מאפשר לדרג אתכם בנפרד על כל ביטוי: "עורך דין מקרקעין", "עורך דין גירושין", "ייעוץ משפטי לעסקים". כל עמוד מנוסח סביב מה שלקוח אמיתי שואל, עם דוגמאות למצבים נפוצים מבלי לתת ייעוץ משפטי קונקרטי.',
      },
      {
        heading: "אמון ושקיפות, בלי המלצות ראוותניות",
        body: 'בתחום המשפטי אמון לא נבנה מסיסמאות. הוא נבנה משקיפות: הצגה עניינית של שנות הוותק והשכלה, תחומי ההתמחות, חברות בוועדות מקצועיות, ומאמרים או טורים שכתבתם. אנחנו מציבים את אותות האמון האמיתיים האלה במקום הנכון, מבלי לכלול חוות דעת לקוחות, דירוגים או לוגואים, שגם אינם תמיד עולים בקנה אחד עם כללי הפרסום בתחום.',
      },
      {
        heading: "דיסקרטיות ומסלול פנייה נוח",
        body: 'פונה משפטי רוצה ליצור קשר בלי להרגיש חשוף. לכן טופס יצירת הקשר קצר ומכבד, עם הבהרה שהפנייה נשמרת בסודיות ושאין בה כדי ליצור יחסי עו"ד–לקוח. לצד הטופס משולבים חיוג ישיר ו-וואטסאפ לכל מי שמעדיף ערוץ מהיר. המטרה אחת: להוריד את החיכוך בין הרגע שבו הלקוח החליט לפנות לרגע שבו הפנייה מגיעה אליכם.',
      },
      {
        heading: "עמידה בכללי לשכת עורכי הדין בפרסום",
        body: 'פרסום של עורכי דין בישראל כפוף לכללי לשכת עורכי הדין (פרסומת). בפועל זה אומר אתר ענייני ומאופק: בלי הבטחות לזכייה, בלי הצגה מטעה של "המשרד הטוב ביותר", ובלי השוואה פוגענית למתחרים. אנחנו מנסחים את התוכן כך שיהיה משכנע ומקצועי אך הולם, כדי שהאתר יקדם אתכם בלי לחשוף אתכם לחשיפה אתית מיותרת. (זו אינה חוות דעת משפטית; הניסוח הסופי תמיד באישורכם.)',
      },
    ],
  },
  whoFor: {
    title: "אתר תדמית לעו\"ד מתאים לכם אם...",
    subtitle: "מעו\"ד עצמאי בתחילת הדרך ועד משרד בוטיק ותיק, לכל אחד יש סיפור אמון לספר.",
    items: [
      { title: "עורך דין עצמאי", description: 'מקימים תיק לקוחות וצריכים אתר מקצועי שמשווה אתכם לעיני הלקוח למשרדים גדולים יותר.' },
      { title: "משרד בוטיק", description: 'מתמחים בתחום אחד או שניים ורוצים אתר שמשדר עומק והתמקצעות, לא "כל דבר לכולם".' },
      { title: "שותפות עורכי דין", description: 'מספר שותפים עם תחומים שונים, אתר שמציג כל שותף ותחום בנפרד אך שומר על מותג אחיד.' },
      { title: "מומחים לתחום ספציפי", description: 'נדל"ן, משפחה, פלילי, מסחרי, נזיקין או דיני עבודה, עמוד ייעודי שמדבר בשפת הלקוח של אותו תחום.' },
      { title: "משרד עם אתר ישן", description: 'אתר שנבנה לפני שנים, לא מותאם לנייד ולא משדר את הרצינות שהמשרד צבר מאז.' },
      { title: "עו\"ד בלי אתר", description: 'אם הלקוחות מגיעים רק מפה-לאוזן, אתם מפספסים את כל מי שמחפש בגוגל ברגע הצורך.' },
    ],
  },
  features: [
    { icon: Layers, title: "עמוד לכל תחום עיסוק", description: 'מבנה שמציג כל התמחות בנפרד, בהיר ללקוח וחזק ל-SEO על כל ביטוי חיפוש.', accent: "#3b82f6" },
    { icon: ShieldCheck, title: "עיצוב מכובד ומאופק", description: 'שפה ויזואלית שמרנית ונקייה שמשדרת רצינות ואמון, בלי גימיקים שפוגעים בתדמית.', accent: "#0ea5e9" },
    { icon: FileText, title: "תוכן ענייני והולם", description: 'טקסטים שמסבירים את הערך שלכם ועומדים בכללי הלשכה, משכנע אך לא ראוותני.', accent: "#8b5cf6" },
    { icon: Lock, title: "פנייה דיסקרטית", description: 'טופס מכבד עם הבהרת סודיות, לצד חיוג ו-וואטסאפ, מסלול נוח ובטוח לפונה.', accent: "#10b981" },
    { icon: Search, title: "SEO משפטי מקומי", description: 'אופטימיזציה לחיפושים כמו "עורך דין [תחום] ב[עיר]" כדי שתופיעו ברגע הנכון.', accent: "#f97316" },
    { icon: Smartphone, title: "מובייל ונגישות לפי חוק", description: 'הרבה פונים מגיעים מהנייד; האתר מותאם מובייל ונבנה לפי תקן הנגישות הישראלי.', accent: "#ec4899" },
  ],
  process: [
    { number: "01", title: "אפיון המשרד", description: 'שיחה על תחומי העיסוק, קהל הלקוחות, סגנון המשרד והאיזון הנכון בין מקצועיות לנגישות.' },
    { number: "02", title: "מבנה ותוכן", description: 'בונים את מפת העמודים (עמוד לכל תחום) ומנסחים תוכן ענייני התואם את כללי הלשכה.' },
    { number: "03", title: "עיצוב ואישור", description: 'מקאפ ויזואלי מלא כולל תצוגת מובייל. לא ממשיכים לפיתוח בלי אישורכם המלא.' },
    { number: "04", title: "פיתוח והשקה", description: 'פיתוח, בדיקות נגישות, SEO on-page, חיבור טופס ו-וואטסאפ ועלייה לאוויר.' },
  ],
  results: [
    { value: "גוגל", label: "שם מתחיל החיפוש", sub: "מי שאין לו אתר לא נמצא ברגע ההחלטה" },
    { value: "רושם ראשון", label: "נוצר באתר", sub: "עוד לפני השיחה הראשונה" },
    { value: "24/7", label: "נציג שלא נח", sub: "האתר מציג את המשרד גם כשאתם בדיון" },
  ],
  faqs: [
    {
      q: 'כמה עולה לבנות אתר תדמית לעורך דין?',
      a: 'אין חבילות ואין מחירון קבוע. ההצעה בנויה משני חלקים: תשלום חד-פעמי על ההקמה, ומנוי חודשי אופציונלי שכולל אחסון, תחזוקה ושינויים שוטפים. ההיקף קובע את המחיר: מספר תחומי העיסוק (עמוד לכל תחום), היקף התוכן ומה שהמשרד צריך מעבר לאתר עצמו. אחרי שיחה קצרה תקבלו בוואטסאפ הצעה אישית ומפורטת.',
    },
    {
      q: 'האם האתר יעמוד בכללי לשכת עורכי הדין בנוגע לפרסום?',
      a: 'אנחנו מנסחים את התוכן בגישה מאופקת ועניינית, בלי הבטחות תוצאה, בלי "המשרד הטוב ביותר" ובלי השוואה פוגענית למתחרים. הניסוח הסופי תמיד עובר את אישורכם. (זו אינה חוות דעת משפטית, האחריות האתית על הפרסום היא של עורך הדין.)',
    },
    {
      q: 'האם כדאי עמוד נפרד לכל תחום עיסוק?',
      a: 'מאוד. עמוד ייעודי לכל תחום ("עורך דין מקרקעין", "עורך דין משפחה") נותן ללקוח תשובה ממוקדת ומאפשר לגוגל לדרג אתכם על כל ביטוי בנפרד, מה שמרחיב משמעותית את כמות הפניות הרלוונטיות.',
    },
    {
      q: 'אתם מוסיפים המלצות לקוחות ודירוגים?',
      a: 'לא. אנחנו לא משלבים חוות דעת לקוחות, דירוגים או לוגואים, הן מטעמי התאמה לכללי הפרסום בתחום והן כי בתחום המשפטי אמון נבנה משקיפות אמיתית: ותק, התמחות, פרסומים מקצועיים והצגה עניינית של המשרד.',
    },
    {
      q: 'כמה זמן לוקח להקים את האתר?',
      a: 'משך העבודה תלוי בהיקף ובקצב שבו מגיעים התכנים והאישורים מצדכם, וזה בדרך כלל הגורם שמשפיע הכי הרבה. לוח זמנים מדויק מקבלים יחד עם ההצעה, אחרי שמגדירים את מבנה האתר.',
    },
    {
      q: 'הלקוחות שלי מגיעים מהנייד, האתר מותאם?',
      a: 'בהחלט. האתר נבנה mobile-first, נטען מהר גם ברשת סלולרית ונבנה לפי תקן הנגישות הישראלי, כך שכל פונה, מכל מכשיר, מקבל חוויה תקינה ונגישה.',
    },
    {
      q: 'אוכל לעדכן תכנים בעצמי, למשל להוסיף מאמר?',
      a: 'כן, אם תרצו. אפשר לבנות ממשק פשוט שבו תוכלו לעדכן טקסטים, להוסיף מאמרים ולערוך תחומי עיסוק בעצמכם, בלי לגעת בקוד, ונגדיר אותו כבר באפיון. במנוי החודשי אפשר גם פשוט לשלוח לנו את השינוי בוואטסאפ.',
    },
    {
      q: 'אני עובד באזור מסוים, אפשר להדגיש את זה?',
      a: 'כן. נשלב באופן טבעי את אזורי השירות שלכם (למשל תל אביב, גוש דן, חיפה והצפון או ירושלים) בתוך התוכן והנתונים המובְנים, כדי לחזק נראות בחיפושים מקומיים, בלי לייצר עמודי ערים מלאכותיים.',
    },
  ],
  cta: {
    title: "בואו נבנה למשרד אתר שמשדר את הרצינות שמגיעה לו",
    subtitle: "שיחה ראשונה בוואטסאפ, בדיסקרטיות מלאה. נשמח לשמוע על המשרד.",
    buttonText: "בואו נדבר",
  },
  image: {
    src: serviceDevImg,
    alt: "המחשה לבניית אתר תדמית לעורך דין, ממשק נקי, מכובד ומותאם מובייל",
    width: 1280,
    height: 720,
  },
  related: [
    { label: "ההצעה שלנו: הקמה ומנוי חודשי", href: "/packages/" },
    { label: "בניית אתרים מקצועיים לעסקים", href: "/services/web-development/" },
    { label: "דף נחיתה לקמפיין של המשרד", href: "/services/landing-page-development/" },
    { label: "צרו קשר לשיחת אפיון", href: "/contact/" },
  ],
};

/* ───────────────────────── registry ───────────────────────── */
export const VERTICALS: Record<string, VerticalContent> = {
  [lawyer.slug]: lawyer,
  [accountant.slug]: accountant,
  [realEstate.slug]: realEstate,
  [clinic.slug]: clinic,
  [architect.slug]: architect,
  [consultant.slug]: consultant,
  [beauty.slug]: beauty,
  [contractor.slug]: contractor,
};

/** Build a full ServicePageConfig from a vertical slug (null if unknown). */
export function buildVerticalConfig(slug: string): ServicePageConfig | null {
  const v = VERTICALS[slug];
  if (!v) return null;
  const path = `/services/business-website/${v.slug}`;
  return {
    seo: v.seo,
    breadcrumb: { name: v.navName, path, parent: { name: HUB.name, path: HUB.path } },
    schemaId: `service-schema-bw-${v.slug}`,
    schemaServiceType: v.schemaServiceType,
    schemaUrl: `${BASE_URL}${path}`,
    hero: v.hero,
    intro: v.intro,
    deepDive: v.deepDive,
    whoFor: v.whoFor,
    features: v.features,
    process: v.process,
    results: v.results,
    faqs: v.faqs,
    cta: v.cta,
    image: v.image,
    relatedLinks: [
      { label: "אתר תדמית לעסקים: כל התחומים", href: `${HUB.path}/` },
      ...v.related,
    ],
  };
}

/** All vertical paths (trailing slash), used by the hub page. */
export const VERTICAL_PATHS = Object.values(VERTICALS).map(
  (v) => `/services/business-website/${v.slug}/`,
);

/** Lightweight list for hub "industries" links. */
export const VERTICAL_LINKS = Object.values(VERTICALS).map((v) => ({
  label: v.navName,
  href: `/services/business-website/${v.slug}/`,
}));

/** Richer list (with a short description) for the hub "industries" grid. */
export const VERTICAL_CARDS = Object.values(VERTICALS).map((v) => ({
  label: v.navName,
  href: `/services/business-website/${v.slug}/`,
  desc: v.hero.badge,
  art: v.art,
}));
