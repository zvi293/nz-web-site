/**
 * pricing.ts — config-driven אתר-תדמית packages (C7).
 *
 * Single source of truth for the 3 plans + pricing FAQ. Edit prices/features
 * here without touching markup. The PricingSection renders this.
 *
 * Rules baked in: month-to-month, NO minimum commitment (site stays live while
 * the subscription is paid), and no VAT wording anywhere. CTAs are
 * lead capture only — no checkout/payment flow.
 *
 * Values marked "(proposed)" in SEO-PHASE2-report.md are fill-ins for Zvi to
 * confirm; prices, the management-panel concept and the SEO/AI/support/pages
 * tiering are per his instructions.
 */
export type PlanSlug = "basic" | "standard" | "premium";

export interface PlanFeature {
  label: string;
  /** true → included (✓), false → not included (✗), string → shown as text. */
  value: boolean | string;
}

export interface PricingPlan {
  slug: PlanSlug;
  name: string;
  tagline: string;
  /** one-time setup fee, formatted (no VAT wording). */
  setup: string;
  /** monthly retainer, formatted. */
  monthly: string;
  featured?: boolean;
  badge?: string;
  ctaText: string;
  features: PlanFeature[];
}

/* Same feature order across all plans so the cards line up visually. */
const FEATURE_ORDER = [
  "פאנל ניהול לעריכה עצמית (תוכן, באנרים, שירותים)",
  "מספר עמודים",
  "אחסון, SSL, תחזוקה שוטפת וגיבויים",
  "התאמה למובייל, RTL ונגישות לפי חוק",
  "טופס יצירת קשר + חיבור וואטסאפ",
  "עדכוני תוכן על ידי NZ-web",
  "קידום אורגני (SEO)",
  'אופטימיזציה למנועי AI (ChatGPT / Gemini / Perplexity)',
  "תמיכה",
  "דוח ביצועים חודשי",
  "אנליטיקס ומעקב לידים",
] as const;

const basic: PricingPlan = {
  slug: "basic",
  name: "בסיסית",
  tagline: "נוכחות דיגיטלית מקצועית להתחלה נכונה",
  setup: "1,200 ₪",
  monthly: "199 ₪",
  ctaText: "בחירת החבילה הבסיסית",
  features: [
    { label: FEATURE_ORDER[0], value: false },
    { label: FEATURE_ORDER[1], value: "עד 5 עמודים" },
    { label: FEATURE_ORDER[2], value: true },
    { label: FEATURE_ORDER[3], value: true },
    { label: FEATURE_ORDER[4], value: true },
    { label: FEATURE_ORDER[5], value: "עד עדכון אחד בחודש" },
    { label: FEATURE_ORDER[6], value: "בסיסי (on-page)" },
    { label: FEATURE_ORDER[7], value: false },
    { label: FEATURE_ORDER[8], value: "רגילה" },
    { label: FEATURE_ORDER[9], value: false },
    { label: FEATURE_ORDER[10], value: "בסיסי" },
  ],
};

const standard: PricingPlan = {
  slug: "standard",
  name: "סטנדרט",
  tagline: "עם פאנל ניהול לעריכה עצמית של האתר",
  setup: "2,590 ₪",
  monthly: "390 ₪",
  featured: true,
  badge: "הכי פופולרי",
  ctaText: "בחירת חבילת סטנדרט",
  features: [
    { label: FEATURE_ORDER[0], value: true },
    { label: FEATURE_ORDER[1], value: "עד 8 עמודים" },
    { label: FEATURE_ORDER[2], value: true },
    { label: FEATURE_ORDER[3], value: true },
    { label: FEATURE_ORDER[4], value: true },
    { label: FEATURE_ORDER[5], value: "עד 3 עדכונים בחודש" },
    { label: FEATURE_ORDER[6], value: "משופר" },
    { label: FEATURE_ORDER[7], value: "בסיסי" },
    { label: FEATURE_ORDER[8], value: "רגילה" },
    { label: FEATURE_ORDER[9], value: false },
    { label: FEATURE_ORDER[10], value: true },
  ],
};

const premium: PricingPlan = {
  slug: "premium",
  name: "פרימיום",
  tagline: "עם פאנל ניהול, קידום חזק ונראות ב-AI",
  setup: "2,590 ₪",
  monthly: "590 ₪",
  ctaText: "בחירת חבילת פרימיום",
  features: [
    { label: FEATURE_ORDER[0], value: true },
    { label: FEATURE_ORDER[1], value: "עד 12 עמודים" },
    { label: FEATURE_ORDER[2], value: true },
    { label: FEATURE_ORDER[3], value: true },
    { label: FEATURE_ORDER[4], value: true },
    { label: FEATURE_ORDER[5], value: "עדיפות + עד 5 עדכונים בחודש" },
    { label: FEATURE_ORDER[6], value: "חזק ומתמשך" },
    { label: FEATURE_ORDER[7], value: "מלא" },
    { label: FEATURE_ORDER[8], value: "מועדפת (זמן תגובה מהיר)" },
    { label: FEATURE_ORDER[9], value: true },
    { label: FEATURE_ORDER[10], value: "מתקדם" },
  ],
};

export const PRICING_PLANS: PricingPlan[] = [basic, standard, premium];

/** Positive, clear commitment message (no VAT wording). */
export const PRICING_COMMITMENT =
  "ללא התחייבות. המודל חודשי לחלוטין — האתר נשאר באוויר כל עוד המנוי החודשי פעיל, ואפשר לעצור בכל חודש.";

export const PRICING_FAQS: { q: string; a: string }[] = [
  {
    q: "האם יש התחייבות?",
    a: "אין התחייבות. המודל חודשי לחלוטין, והאתר נשאר באוויר כל עוד המנוי החודשי פעיל. אפשר לעצור בכל חודש — בלי קנסות ובלי תקופת מינימום.",
  },
  {
    q: "מה ההבדל בין החבילות?",
    a: 'הבסיסית היא אתר מקצועי לניהול על ידינו. בסטנדרט ובפרימיום נוסף פאנל ניהול לעריכה עצמית, יותר עמודים וקידום אורגני חזק יותר. הפרימיום מוסיפה על הסטנדרט: עדיפות בתמיכה עם זמן תגובה מהיר, קידום אורגני חזק ומתמשך, אופטימיזציה מלאה למנועי AI (הופעה ב-ChatGPT/Gemini/Perplexity), דוח ביצועים חודשי ויותר עדכוני תוכן.',
  },
  {
    q: "מה כולל הריטיינר החודשי?",
    a: "התשלום החודשי כולל אחסון, SSL, תחזוקה שוטפת, גיבויים ותמיכה — ובחבילות הגבוהות גם קידום אורגני, אופטימיזציה למנועי AI, אנליטיקס ומכסת עדכוני תוכן חודשית.",
  },
  {
    q: "מהי עלות ההקמה?",
    a: "עלות ההקמה היא תשלום חד-פעמי בתחילת הפרויקט, עבור הבנייה והעיצוב של האתר. לאחר ההשקה משלמים רק את המנוי החודשי.",
  },
  {
    q: "מה זה פאנל הניהול?",
    a: "ממשק פשוט בעברית שמאפשר לכם לערוך בעצמכם תכנים, באנרים ושירותים באתר — בלי לגעת בקוד ובלי תלות בנו. כלול בחבילות סטנדרט ופרימיום, עם הדרכה מלאה.",
  },
];

export const PLAN_LABELS: Record<PlanSlug, string> = {
  basic: "בסיסית",
  standard: "סטנדרט",
  premium: "פרימיום",
};

/** Map a ?plan= slug to its Hebrew label (for contact-form pre-fill). */
export function getPlanLabel(slug?: string | null): string | null {
  if (!slug) return null;
  return PLAN_LABELS[slug as PlanSlug] ?? null;
}
