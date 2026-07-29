/**
 * pricing.ts — the אתר-תדמית packages.
 *
 * Single source of truth for the 3 plans + the pricing FAQ. Edit prices and
 * features here without touching markup — PricingSection renders this file.
 *
 * The tiers are cumulative: פרו is "everything in סמארט, plus…" and עילית is
 * "everything in פרו, plus…", so each card lists only what it adds
 * (`inheritsNote` + `features`).
 *
 * Rules baked in: month-to-month, NO minimum commitment (the site stays live
 * while the subscription is paid), and no VAT wording anywhere. CTAs are lead
 * capture only — no checkout/payment flow.
 */
export type PlanSlug = "smart" | "pro" | "elite";

/**
 * Icon key for a detail group / included item. Mapped to a Lucide icon in the
 * packages page (see ICONS there) — kept as a plain string so this file stays
 * pure data.
 */
export type PlanIconKey =
  | "pages"
  | "content"
  | "seo"
  | "shield"
  | "support"
  | "panel"
  | "leads"
  | "analytics"
  | "ai"
  | "globe"
  | "lock"
  | "mobile"
  | "accessibility"
  | "speed";

/** A titled group of bullets inside a package's full breakdown. */
export interface PlanDetailGroup {
  title: string;
  icon: PlanIconKey;
  items: string[];
}

/** Long-form content for the package page (/packages/#<slug>). */
export interface PlanDetails {
  /** Opening paragraph of the package section. */
  intro: string;
  /** "למי זה מתאים" line. */
  audience: string;
  /** Short chips summarising the package at a glance. */
  highlights: string[];
  /** The "איך זה עובד?" explainer box. */
  howItWorks: string;
  /** The full breakdown, grouped by topic. */
  groups: PlanDetailGroup[];
  /** WhatsApp CTA label at the end of the section. */
  ctaText: string;
  /** Closing line shown after the section (comparison / nudge to the next tier). */
  closingNote?: string;
}

export interface PricingPlan {
  slug: PlanSlug;
  name: string;
  /** short nickname shown under the name, e.g. ״נוכחות״. */
  nickname: string;
  tagline: string;
  /** one-time setup fee, formatted (no VAT wording). */
  setup: string;
  /** what the setup fee covers. */
  setupNote: string;
  /** monthly retainer, formatted. */
  monthly: string;
  /** what the monthly retainer covers. */
  monthlyNote: string;
  featured?: boolean;
  badge?: string;
  ctaText: string;
  /** "everything in the previous plan, plus:" line — omitted on the entry plan. */
  inheritsNote?: string;
  /** what this plan adds. */
  features: string[];
  /** full breakdown rendered on the packages page. */
  details: PlanDetails;
}

const smart: PricingPlan = {
  slug: "smart",
  name: "סמארט",
  nickname: "״נוכחות״",
  tagline: "הצעד הראשון ל״יש לי נוכחות מקצועית בגוגל״, מהר ובלי סיכון.",
  setup: "2,500 ₪",
  setupNote: "תשלום אחד: בניית האתר מא׳ ועד ת׳",
  monthly: "199 ₪",
  monthlyNote: "אחסון, אבטחה, תחזוקה וקידום שוטף",
  ctaText: "אני רוצה את החבילה הזו",
  features: [
    "עד 5 עמודים מעוצבים אישית",
    "אתר סטטי מהיר במיוחד מרשת CDN",
    "קידום אורגני בסיסי: עד 5 ביטויי מפתח",
    "עדכון תוכן חודשי בשירות מלא בוואטסאפ",
    "אבטחה, גיבויים וניטור זמינות",
    "14 יום ליווי צמוד אחרי העלייה לאוויר",
  ],
  details: {
    intro:
      "הצעד הראשון ל״יש לי נוכחות מקצועית בגוגל״. אתר מהיר, מאובטח ותקין, שמוכן לעבוד בלי שתצטרכו ללמוד או לתחזק דבר.",
    audience:
      "לעסק קטן, לעצמאי או לנותן שירות שצריך כרטיס ביקור דיגיטלי אמיתי, מהר ובלי סיכון.",
    highlights: ["עד 5 עמודים", "SEO בסיסי: 5 ביטויים", "עדכון חודשי כלול", "ליווי 14 יום"],
    howItWorks:
      "משלמים 2,500 ₪ פעם אחת על בניית האתר, ואז 199 ₪ בחודש, שכוללים אחסון, אבטחה, גיבויים, תמיכה וכל שירותי הקידום של החבילה. בלי עלויות נסתרות, והאתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל.",
    groups: [
      {
        title: "היקף האתר",
        icon: "pages",
        items: [
          "עד 5 עמודים: בית, אודות, שירותים, גלריה, צור קשר",
          "ארכיטקטורת Static מהירה: האתר מוגש כקבצים מוכנים מרשת ה-CDN. התוצאה: זמני טעינה כמעט מיידיים ומשטח תקיפה מינימלי",
        ],
      },
      {
        title: "ניהול התוכן",
        icon: "content",
        items: [
          "עדכוני תוכן בשירות מלא: עד עדכון אחד בחודש (החלפת טקסט, תמונה, מחיר או פרטי קשר)",
          "שולחים הודעה בוואטסאפ ואנחנו מבצעים. אין מה ללמוד, אין מה לתחזק, ואין סיכוי לשבור משהו",
        ],
      },
      {
        title: "קידום אורגני בסיסי",
        icon: "seo",
        items: [
          "אופטימיזציה על-עמודית מלאה לכל 5 העמודים",
          "עד 5 ביטויי מפתח מרכזיים, כולל מיפוי ביטוי-לעמוד",
          "סימון Schema בסיסי: LocalBusiness + Organization, כך גוגל מבין מה העסק שלכם ואיפה הוא נמצא",
          "אופטימיזציית תמונות וטקסטים חלופיים ממוקדי מילות מפתח",
        ],
      },
      {
        title: "תחזוקה שוטפת",
        icon: "shield",
        items: [
          "עדכוני אבטחה שוטפים",
          "סריקת אבטחה ובדיקת קישורים שבורים פעם ברבעון",
          "גיבויים אוטומטיים וניטור זמינות",
        ],
      },
      {
        title: "תמיכה וליווי",
        icon: "support",
        items: [
          "תמיכה בוואטסאפ ובמייל: מענה תוך עד 2 ימי עסקים",
          "14 יום ליווי צמוד לאחר עליית האתר לאוויר",
        ],
      },
    ],
    ctaText: "רוצה את חבילת ״נוכחות״? דברו איתי",
    closingNote:
      "מתאים למי שצריך נוכחות. למי שרוצה שהאתר יביא לקוחות באופן פעיל: חבילת פרו.",
  },
};

const pro: PricingPlan = {
  slug: "pro",
  name: "פרו",
  nickname: "״מובילות״",
  tagline: "האתר הופך מנכס תדמיתי למכונת לידים, עם שליטה מלאה שלכם ומספרים על השולחן.",
  setup: "4,600 ₪",
  setupNote: "תשלום אחד: בניית האתר מא׳ ועד ת׳",
  monthly: "390 ₪",
  monthlyNote: "אחסון, אבטחה, תחזוקה וקידום שוטף",
  featured: true,
  badge: "הנבחרת ביותר",
  ctaText: "אני רוצה את החבילה הזו",
  inheritsNote: "כל מה שבחבילת סמארט, ובנוסף:",
  features: [
    "פאנל ניהול אישי: עריכה עצמית בכל שעה",
    "מערכת ניהול לידים + ייצוא לאקסל",
    "עד 8 עמודים + בלוג עסקי",
    "SEO מתקדם: מחקר מילים ועד 15 ביטויים",
    "מפות חום, הקלטות גלישה ודוח חודשי",
    "בקשת שינוי חודשית + 30 יום ליווי צמוד",
  ],
  details: {
    intro:
      "האתר עובר מלהיות כרטיס ביקור לנכס שמייצר לידים. אתם שולטים בו במלואו, הוא צומח עם התוכן שלכם, ואתם יודעים בדיוק מה עובד ומה לא. זו החבילה שרוב הלקוחות שלנו בוחרים, ולא במקרה.",
    audience:
      "לעסק שרוצה שהאתר יעבוד בשבילו: יביא פניות, ידורג בגוגל ויספר לו את האמת במספרים.",
    highlights: [
      "עד 8 עמודים + בלוג",
      "פאנל ניהול אישי",
      "ניהול לידים",
      "SEO מתקדם: 15 ביטויים",
      "דוח חודשי",
      "ליווי 30 יום",
    ],
    howItWorks:
      "משלמים 4,600 ₪ פעם אחת על בניית האתר, ואז 390 ₪ בחודש, שכוללים אחסון, אבטחה, פאנל ניהול, דוחות וכל שירותי הקידום. בלי עלויות נסתרות, והאתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל.",
    groups: [
      {
        title: "שליטה מלאה: פאנל ניהול אישי",
        icon: "panel",
        items: [
          "פאנל ניהול אישי: עורכים טקסטים, מחליפים תמונות, מוסיפים פוסטים ומעדכנים מחירים בעצמכם, בכל שעה ומכל מכשיר",
          "מערכת ניהול לידים מובנית: כל פנייה נשמרת בפאנל עם תאריך, מקור וסטטוס טיפול. שום ליד לא נעלם בתיבת המייל",
          "ייצוא לידים לאקסל בלחיצה",
        ],
      },
      {
        title: "היקף האתר",
        icon: "pages",
        items: [
          "עד 8 עמודים + בלוג עסקי. הבלוג הוא המנוע שממשיך להביא תנועה אורגנית חודש אחרי חודש, גם כשאתם לא עושים כלום",
        ],
      },
      {
        title: "קידום אורגני מתקדם",
        icon: "seo",
        items: [
          "מחקר מילות מפתח מלא בתחום שלכם ובאזור שלכם",
          "עד 15 ביטויי מפתח עם מיפוי ביטוי-לעמוד",
          "סימון Schema מורחב: LocalBusiness, Service, FAQ, Breadcrumb. כך גוגל מציג את התשובות שלכם ישירות בעמוד החיפוש",
          "אופטימיזציית קישור פנימי: מפזרת את כוח הדירוג בין העמודים ומחזיקה גולשים באתר",
          "אופטימיזציית תוכן קיים לביטויי היעד",
        ],
      },
      {
        title: "מדידה ותובנות",
        icon: "analytics",
        items: [
          "מפות חום והקלטות גלישה: רואים בפועל איפה גולשים לוחצים, עד לאן הם גוללים ואיפה הם נוטשים",
          "דוח ביצועים חודשי: כמה נכנסו, מאיפה הגיעו, מה חיפשו, כמה לידים נכנסו ואיפה אתם מדורגים",
        ],
      },
      {
        title: "תחזוקה שוטפת",
        icon: "shield",
        items: [
          "סריקת אבטחה חודשית + עדכוני ספריות",
          "בדיקת מהירות וביצועים חודשית, כולל תיקון ירידות",
          "בדיקת קישורים שבורים חודשית",
        ],
      },
      {
        title: "ליווי שוטף",
        icon: "support",
        items: [
          "בקשת שינוי או שיפור אחת בחודש, עד 60 דקות עבודה. עיצוב, תוכן או פונקציה קטנה. אתם מבקשים, אנחנו מבצעים",
          "מענה תוך יום עסקים אחד",
          "30 יום ליווי צמוד לאחר העלייה לאוויר",
        ],
      },
    ],
    ctaText: "רוצה את חבילת ״מובילות״? דברו איתי",
    closingNote:
      "הפרש של 2,100 ₪ בהקמה לעומת חבילת סמארט, ובתמורה אתר שאתם שולטים בו, בלוג שממשיך להביא לקוחות, ודוח חודשי שאומר לכם בדיוק אם ההשקעה עובדת.",
  },
};

const elite: PricingPlan = {
  slug: "elite",
  name: "עילית",
  nickname: "״פסגה״",
  tagline: "לא רק להופיע בגוגל, אלא להיות התשובה. גם בחיפוש וגם כשלקוח שואל את ChatGPT.",
  setup: "5,000 ₪",
  setupNote: "תשלום אחד: בניית האתר מא׳ ועד ת׳",
  monthly: "590 ₪",
  monthlyNote: "אחסון, אבטחה, תחזוקה, קידום AI ושוטף",
  ctaText: "אני רוצה את החבילה הזו",
  inheritsNote: "כל מה שבחבילת פרו, ובנוסף:",
  features: [
    "קידום במנועי AI: GEO / AEO מלא",
    "דוח אזכורים חודשי ב-ChatGPT, Gemini ו-Perplexity",
    "עד 10 עמודים + בלוג + עמודי אזור גיאוגרפי",
    "פאנל ניהול עם הרשאות מרובות",
    "שתי בקשות שינוי בחודש + ביקורת SEO רבעונית",
    "60 יום ליווי צמוד אחרי העלייה לאוויר",
  ],
  details: {
    intro:
      "לא להסתפק בלהיות בגוגל, אלא להיות התשובה. גם במנועי החיפוש, וגם ברגע שלקוח שואל את ChatGPT או Gemini ״מי הכי טוב בתחום הזה באזור שלי?״.",
    audience:
      "לעסק שמתייחס לאתר כערוץ הצמיחה המרכזי שלו, ורוצה יתרון על מתחרים שעוד לא הבינו שהחיפוש השתנה.",
    highlights: [
      "עד 10 עמודים + בלוג",
      "קידום במנועי AI",
      "עמודי אזור גיאוגרפי",
      "דוח משולב",
      "2 בקשות שינוי בחודש",
      "ליווי 60 יום",
    ],
    howItWorks:
      "משלמים 5,000 ₪ פעם אחת על בניית האתר, ואז 590 ₪ בחודש, שכוללים את כל שירותי חבילת פרו + קידום במנועי AI ודוח אזכורים חודשי. בלי עלויות נסתרות, והאתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל.",
    groups: [
      {
        title: "קידום במנועי AI: GEO / AEO",
        icon: "ai",
        items: [
          "הטמעת סכמת ישויות (Entity Schema): מלמדת את מודלי ה-AI מי אתם בדיוק, מה אתם מציעים, באיזה אזור, ולמה לסמוך עליכם",
          "קובץ llms.txt וקונפיגורציה מלאה לסורקי AI: פותחת את האתר בפני GPTBot, PerplexityBot ו-Google-Extended, במקום לחסום אותם בטעות כמו שקורה ברוב האתרים",
          "בניית תוכן במבנה שאלה-תשובה: הפורמט שמנועי ה-AI מצטטים ממנו בפועל",
          "חיזוק ישות המותג: קישוריות בין האתר, פרופיל גוגל והנוכחות הדיגיטלית שלכם למקור סמכות אחד ומזוהה",
          "דוח אזכורים חודשי במנועי AI: האם המותג שלכם עולה בתשובות של ChatGPT, Gemini ו-Perplexity, ובאיזה הקשר",
        ],
      },
      {
        title: "היקף האתר",
        icon: "pages",
        items: [
          "עד 10 עמודים + בלוג",
          "עמודי אזור גיאוגרפי: עמודים ממוקדים לערים ולשכונות שאתם משרתים. אחד הכלים החזקים ביותר בקידום מקומי",
          "פאנל ניהול עם הרשאות מרובות: אפשר לצרף עובד או מנהל תוכן בהרשאה מוגבלת",
        ],
      },
      {
        title: "מדידה בדרג עליון",
        icon: "analytics",
        items: [
          "דוח משולב: מיקומים אורגניים + אזכורי AI + לידים. תמונה אחת מלאה של כל ערוצי הצמיחה",
        ],
      },
      {
        title: "תחזוקה שוטפת",
        icon: "shield",
        items: [
          "סריקת אבטחה, בדיקת מהירות ובדיקת נגישות בכל חודש",
          "ביקורת SEO טכנית רבעונית",
        ],
      },
      {
        title: "ליווי בדרג עליון",
        icon: "support",
        items: [
          "שתי בקשות שינוי או שיפור בחודש, עד 60 דקות כל אחת",
          "60 יום ליווי צמוד לאחר העלייה לאוויר",
        ],
      },
    ],
    ctaText: "רוצה את חבילת ״פסגה״? דברו איתי",
    closingNote:
      "ההקמה יקרה ב-400 ₪ בלבד מחבילת פרו. כל ההבדל האמיתי הוא ברמת הליווי החודשי ובנוכחות במקום שאף אחד מהמתחרים שלכם עוד לא נמצא בו.",
  },
};

export const PRICING_PLANS: PricingPlan[] = [smart, pro, elite];

/** Sub-heading under the section title. */
export const PRICING_INTRO =
  "מנוכחות מקצועית ראשונה ועד מובילות מלאה בגוגל ובמנועי ה-AI. בוחרים את הקצב שלכם.";

/** What every plan includes, as a strip of items (packages page). */
export const PRICING_INCLUDED_ITEMS: { icon: PlanIconKey; label: string }[] = [
  { icon: "globe", label: "דומיין מחובר" },
  { icon: "lock", label: "תעודת SSL" },
  { icon: "mobile", label: "התאמה מלאה למובייל" },
  { icon: "accessibility", label: "נגישות לפי התקן" },
  { icon: "speed", label: "טעינה מהירה במיוחד" },
];

/** Footnote under the cards — what every plan includes (homepage section). */
export const PRICING_INCLUDED_NOTE =
  "כל החבילות כוללות: דומיין מחובר, תעודת SSL, התאמה מלאה למובייל, נגישות לפי התקן וזמני טעינה מהירים. האתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל.";

/** Nudge shown next to the WhatsApp link under the cards. */
export const PRICING_COMMITMENT =
  "לא בטוחים איזו חבילה מתאימה? ספרו לנו על העסק בהודעה קצרה, ותקבלו המלצה מקצועית שמדויקת למטרות ולתקציב שלכם.";

export const PRICING_FAQS: { q: string; a: string }[] = [
  {
    q: "האם יש התחייבות?",
    a: "אין התחייבות. המודל חודשי לחלוטין, והאתר נשאר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל. אפשר לעצור בכל חודש — בלי קנסות ובלי תקופת מינימום.",
  },
  {
    q: "מה ההבדל בין החבילות?",
    a: "סמארט היא נוכחות מקצועית ראשונה: עד 5 עמודים, אתר סטטי מהיר וקידום אורגני בסיסי. פרו מוסיפה פאנל ניהול לעריכה עצמית, מערכת ניהול לידים, עד 8 עמודים ובלוג עסקי, SEO מתקדם ודוח חודשי עם מפות חום. עילית מוסיפה על פרו קידום מלא במנועי AI (GEO/AEO) עם דוח אזכורים ב-ChatGPT, Gemini ו-Perplexity, עד 10 עמודים כולל עמודי אזור גיאוגרפי, הרשאות מרובות בפאנל וביקורת SEO רבעונית.",
  },
  {
    q: "מה כולל התשלום החודשי?",
    a: "התשלום החודשי כולל אחסון, תעודת SSL, אבטחה, גיבויים, ניטור זמינות, תחזוקה שוטפת וקידום — ובחבילות הגבוהות גם אופטימיזציה למנועי AI, דוחות ביצועים ומכסת בקשות שינוי חודשית.",
  },
  {
    q: "מהי עלות ההקמה?",
    a: "עלות ההקמה היא תשלום חד-פעמי בתחילת הפרויקט, עבור בניית האתר ועיצובו מא׳ ועד ת׳. לאחר ההשקה משלמים רק את המנוי החודשי.",
  },
  {
    q: "מה זה פאנל הניהול?",
    a: "ממשק פשוט בעברית שמאפשר לכם לערוך בעצמכם טקסטים, תמונות ותכנים באתר בכל שעה — בלי לגעת בקוד ובלי תלות בנו, וכולל מערכת לניהול הלידים שנכנסים. כלול בחבילות פרו ועילית, עם הדרכה מלאה.",
  },
  {
    q: "מה זה קידום במנועי AI (GEO/AEO)?",
    a: "לקוחות שואלים היום את ChatGPT, Gemini ו-Perplexity מי מומלץ בתחום. בחבילת עילית אנחנו בונים את האתר כך שמנועי ה-AI יזהו אתכם וימליצו עליכם: סכמת ישויות, קובץ llms.txt וגישה לסורקי AI, תוכן במבנה שאלה-תשובה, ודוח חודשי שמראה אם והיכן המותג שלכם עולה בתשובות.",
  },
];

/** The dedicated packages page (/packages/), linked from every plan card. */
export const PACKAGES_PAGE = {
  path: "/packages",
  eyebrow: "אתרי תדמית",
  title: "בניית אתר תדמית שעובד בשביל העסק שלך",
  subtitle:
    "שלוש חבילות, מטרה אחת: שהעסק שלך ייראה מצוין ברשת ויקבל מזה לקוחות. כל החבילות כוללות עיצוב אישי מאפס, התאמה מלאה למובייל, נגישות לפי התקן וזמני טעינה מהירים במיוחד.",
  seoTitle: "בניית אתר תדמית לעסק: חבילות ומחירים | NZ-web",
  seoDescription:
    "חבילות אתר תדמית של NZ-web: סמארט מ-2,500 ₪ הקמה ו-199 ₪ לחודש, פרו עם פאנל ניהול ובלוג, ועילית עם קידום במנועי AI. מה כלול בכל חבילה — בלי עלויות נסתרות.",
  ctaTitle: "עדיין מתלבטים?",
  ctaSubtitle:
    "ספרו לנו על העסק בהודעה קצרה, ותקבלו המלצה מקצועית על החבילה שמתאימה לכם, בלי התחייבות.",
  ctaButton: "לשאול בוואטסאפ",
} as const;

/** Anchor link for a plan's full breakdown, e.g. /packages/#pro. */
export function getPlanDetailsHref(slug: PlanSlug): string {
  return `${PACKAGES_PAGE.path}/#${slug}`;
}

/** FAQ shown on the packages page (separate from the homepage pricing FAQ). */
export const PACKAGES_FAQS: { q: string; a: string }[] = [
  {
    q: "כמה עולה לבנות אתר תדמית לעסק?",
    a: "אצלנו אתר תדמית מתחיל ב-2,500 ₪ הקמה חד-פעמית + 199 ₪ לחודש (חבילת סמארט ״נוכחות״), 4,600 ₪ + 390 ₪ לחודש לחבילת פרו ״מובילות״ עם פאנל ניהול ובלוג, ו-5,000 ₪ + 590 ₪ לחודש לחבילת עילית ״פסגה״ עם קידום במנועי AI. המנוי החודשי כולל אחסון, אבטחה, תחזוקה וקידום, בלי עלויות נסתרות.",
  },
  {
    q: "איזו חבילת אתר תדמית מתאימה לעסק שלי?",
    a: "אם צריך כרטיס ביקור דיגיטלי מקצועי: חבילת סמארט ״נוכחות״. אם רוצים שהאתר יביא לידים ושתוכלו לערוך אותו בעצמכם: חבילת פרו ״מובילות״ (הנבחרת ביותר). אם האתר הוא ערוץ הצמיחה המרכזי ורוצים להופיע גם בתשובות של ChatGPT ו-Gemini: חבילת עילית ״פסגה״.",
  },
  {
    q: "תוך כמה זמן אתר התדמית עולה לאוויר?",
    a: "בדרך כלל תוך 7–14 ימי עסקים מרגע קבלת החומרים, כולל עיצוב אישי, כתיבת תוכן ממוקד קידום והטמעת SEO מלאה.",
  },
  {
    q: "האם אפשר לערוך את האתר לבד?",
    a: "כן, מחבילת פרו ומעלה מקבלים פאנל ניהול אישי בעברית: עריכת טקסטים, החלפת תמונות, פרסום פוסטים ועדכון מחירים בעצמכם, בכל שעה. בחבילת סמארט אנחנו מבצעים עבורכם עדכון חודשי בשירות מלא דרך וואטסאפ.",
  },
  {
    q: "האם יש התחייבות?",
    a: "אין התחייבות ואין תקופת מינימום. האתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל, ואפשר לעצור בכל חודש בלי קנסות.",
  },
];

export const PLAN_LABELS: Record<PlanSlug, string> = {
  smart: "סמארט",
  pro: "פרו",
  elite: "עילית",
};

/** Older ?plan= values that used to appear in shared links, kept working. */
const LEGACY_PLAN_SLUGS: Record<string, PlanSlug> = {
  basic: "smart",
  standard: "pro",
  premium: "elite",
};

/** Map a ?plan= slug to its Hebrew label (for contact-form pre-fill). */
export function getPlanLabel(slug?: string | null): string | null {
  if (!slug) return null;
  const resolved = LEGACY_PLAN_SLUGS[slug] ?? (slug as PlanSlug);
  return PLAN_LABELS[resolved] ?? null;
}
