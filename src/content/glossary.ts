/**
 * מילון מונחים (/glossary/) — web terms explained in plain Hebrew for business owners.
 *
 * Each term renders with id="term-<slug>" (articles link to /glossary/#term-<slug> on first use)
 * and feeds the page's DefinedTermSet JSON-LD with the SAME text. Definitions: 1–3 sentences,
 * no invented facts (thresholds quoted are Google's published ones, named as such).
 * `letter` = the index letter (Hebrew א–ת, then Latin A–Z); computed from `name` when omitted.
 */
export interface GlossaryTerm {
  slug: string;
  /** The term as people search it (index + heading). */
  name: string;
  /** The other name: the Latin expansion or the Hebrew equivalent. */
  alt?: string;
  /** Extra words the live search should match. */
  aliases?: string[];
  tag: GlossaryTag;
  definition: string;
  /** Related terms (slugs). */
  seeAlso?: string[];
  /** A magazine article that goes deeper. */
  article?: { slug: string; label: string };
}

export type GlossaryTag = "קידום" | "ביצועים" | "תשתית" | "עיצוב" | "נגישות" | "תוכן ושיווק" | "סוגי אתרים";

export const glossaryIntro = {
  title: "מילון מונחים לבניית אתרים",
  lead:
    "מילון מונחים לבניית אתרים הוא רשימה של המילים המקצועיות שתשמעו כשבונים או מקדמים אתר, מוסברות בעברית פשוטה: מה זה SEO, מה בודקים ב-Core Web Vitals, מה ההבדל בין דומיין לאחסון ולמה נגישות היא חובה. כל הגדרה קצרה, ומקושרת למאמר במגזין כשיש בו הרחבה.",
};

export const glossaryTerms: GlossaryTerm[] = [
  /* ── א ── */
  {
    slug: "hosting",
    name: "אחסון אתרים",
    alt: "Hosting",
    aliases: ["שרת", "הוסטינג"],
    tag: "תשתית",
    definition:
      "השרת שבו יושבים קבצי האתר, וממנו האתר נטען לכל גולש. אחסון טוב משפיע על המהירות, על הזמינות ועל האבטחה של האתר, וכולל גיבויים ועדכונים.",
    seeAlso: ["domain", "ssl"],
  },
  {
    slug: "indexing",
    name: "אינדוקס",
    alt: "Indexing",
    aliases: ["אינדקס", "סריקה"],
    tag: "קידום",
    definition:
      "השלב שבו מנוע חיפוש שומר עמוד במאגר שלו, כך שהעמוד יכול להופיע בתוצאות. עמוד שלא נכנס לאינדקס לא יופיע בחיפוש, גם אם הוא כתוב מצוין.",
    seeAlso: ["sitemap", "search-console", "indexnow"],
  },
  {
    slug: "web-spec",
    name: "אפיון",
    alt: "Discovery / Specification",
    aliases: ["מסמך אפיון", "תכנון"],
    tag: "תוכן ושיווק",
    definition:
      "השלב שלפני העיצוב: מגדירים את מטרת האתר, את קהל היעד, את רשימת העמודים ומה יופיע בכל עמוד. אפיון טוב חוסך שינויים יקרים באמצע העבודה.",
    seeAlso: ["ux", "business-website"],
    article: { slug: "5-things-before-building-website", label: "5 דברים שחייבים לדעת לפני שבונים אתר" },
  },
  {
    slug: "business-website",
    name: "אתר תדמית",
    alt: "Business website",
    aliases: ["אתר עסקי", "כרטיס ביקור"],
    tag: "סוגי אתרים",
    definition:
      "אתר שמציג את העסק: מה הוא עושה, למי, איך עובדים איתו ואיך פונים אליו. המטרה שלו היא להביא פניות ולבנות אמון, והעסקה עצמה נסגרת בשיחה או בפגישה.",
    seeAlso: ["landing-page", "online-store"],
    article: { slug: "business-website-guide", label: "המדריך לבניית אתר תדמית לעסק" },
  },
  /* ── ד ── */
  {
    slug: "domain",
    name: "דומיין",
    alt: "Domain",
    aliases: ["שם מתחם", "כתובת אתר"],
    tag: "תשתית",
    definition:
      "שם האתר: הכתובת שמקלידים בדפדפן, למשל nz‑web.com. רוכשים אותו לתקופה ומחדשים אותו, וכדאי שיהיה רשום על שם בעל העסק ולא על שם מי שבנה את האתר.",
    seeAlso: ["dns", "hosting"],
  },
  {
    slug: "landing-page",
    name: "דף נחיתה",
    alt: "Landing page",
    aliases: ["עמוד נחיתה"],
    tag: "סוגי אתרים",
    definition:
      "עמוד אחד עם מטרה אחת, שאליו מגיעים בדרך כלל מפרסומת או מקמפיין. אין בו תפריט שמסיח את הדעת, וכל העמוד מוביל לפעולה אחת, כמו השארת פרטים או שיחה.",
    seeAlso: ["cta", "conversion"],
    article: { slug: "landing-page-cost", label: "מה משפיע על בניית דף נחיתה" },
  },
  /* ── ה ── */
  {
    slug: "conversion",
    name: "המרה",
    alt: "Conversion",
    aliases: ["שיעור המרה", "קונברסיה"],
    tag: "תוכן ושיווק",
    definition:
      "הרגע שבו גולש עושה את מה שרציתם שיעשה: שולח פנייה, קובע תור, מתקשר או קונה. שיעור ההמרה הוא החלק מכלל המבקרים שעשו את הפעולה הזו.",
    seeAlso: ["cta", "landing-page"],
  },
  {
    slug: "accessibility-statement",
    name: "הצהרת נגישות",
    alt: "Accessibility statement",
    tag: "נגישות",
    definition:
      "עמוד באתר שמפרט באיזו רמה האתר נגיש, אילו התאמות נעשו, מה המגבלות הידועות ואיך פונים לרכז הנגישות. בישראל התקנות מחייבות לפרסם אותה באתר שחייב בנגישות.",
    seeAlso: ["web-accessibility", "israeli-standard-5568"],
  },
  /* ── ח ── */
  {
    slug: "online-store",
    name: "חנות אונליין",
    alt: "E-commerce",
    aliases: ["חנות וירטואלית", "איקומרס", "מסחר מקוון"],
    tag: "סוגי אתרים",
    definition:
      "אתר שבו הלקוח בוחר מוצר, משלם ומקבל אישור הזמנה בלי לדבר עם העסק. מעבר לבנייה, חנות דורשת תפעול שוטף: מלאי, משלוחים, החזרות ושירות לקוחות.",
    seeAlso: ["business-website", "conversion"],
    article: { slug: "business-website-or-online-store", label: "אתר תדמית או חנות אונליין" },
  },
  /* ── ט ── */
  {
    slug: "alt-text",
    name: "טקסט חלופי",
    alt: "Alt text",
    aliases: ["alt", "תיאור תמונה"],
    tag: "נגישות",
    definition:
      "תיאור קצר של תמונה שנכתב בקוד, ומוקרא למי שגולש עם קורא מסך. הוא מופיע גם כשהתמונה לא נטענת, ועוזר למנועי חיפוש להבין מה רואים בה.",
    seeAlso: ["screen-reader", "web-accessibility"],
  },
  /* ── מ ── */
  {
    slug: "keyword",
    name: "מילת מפתח",
    alt: "Keyword",
    aliases: ["ביטוי חיפוש", "מילות מפתח"],
    tag: "קידום",
    definition:
      "המילים שאנשים מקלידים בחיפוש כשהם מחפשים את מה שאתם מציעים, למשל \"רואה חשבון בחיפה\". כל עמוד באתר מתמקד בביטוי מרכזי אחד, ומשתמש בו בכותרת ובפסקה הראשונה.",
    seeAlso: ["seo", "internal-link"],
  },
  /* ── נ ── */
  {
    slug: "web-accessibility",
    name: "נגישות אתרים",
    alt: "Web accessibility",
    aliases: ["נגישות", "הנגשה", "אתר נגיש"],
    tag: "נגישות",
    definition:
      "התאמת האתר כך שגם אנשים עם מוגבלות יוכלו להשתמש בו: עם מקלדת בלבד, עם קורא מסך, עם הגדלת טקסט או עם ראייה חלשה. בישראל רוב העסקים שנותנים שירות לציבור מחויבים בה.",
    seeAlso: ["wcag", "israeli-standard-5568", "accessibility-statement"],
    article: { slug: "website-accessibility-israel", label: "נגישות אתרים לעסקים: מה החוק דורש" },
  },
  /* ── ס ── */
  {
    slug: "focus-indicator",
    name: "סימון פוקוס",
    alt: "Focus indicator",
    aliases: ["פוקוס", "מקלדת", "Tab"],
    tag: "נגישות",
    definition:
      "המסגרת או ההדגשה שמראה על איזה כפתור או קישור נמצא מי שגולש עם המקלדת. בלי סימון ברור, משתמש מקלדת לא יודע איפה הוא בעמוד.",
    seeAlso: ["web-accessibility", "wcag"],
  },
  /* ── ק ── */
  {
    slug: "screen-reader",
    name: "קורא מסך",
    alt: "Screen reader",
    aliases: ["NVDA", "VoiceOver"],
    tag: "נגישות",
    definition:
      "תוכנה שמקריאה בקול את מה שמופיע על המסך, ומאפשרת לאנשים עיוורים או לקויי ראייה לגלוש. היא נשענת על מבנה נכון: כותרות, תוויות לשדות וטקסט חלופי לתמונות.",
    seeAlso: ["alt-text", "web-accessibility"],
  },
  {
    slug: "internal-link",
    name: "קישור פנימי",
    alt: "Internal link",
    aliases: ["קישורים פנימיים", "מבנה קישורים"],
    tag: "קידום",
    definition:
      "קישור מעמוד אחד באתר לעמוד אחר באותו אתר. קישורים פנימיים עוזרים לגולשים להתמצא, ולמנועי חיפוש להבין אילו עמודים חשובים ואיך הם קשורים זה לזה.",
    seeAlso: ["seo", "sitemap"],
  },
  /* ── ר ── */
  {
    slug: "responsive",
    name: "רספונסיבי",
    alt: "Responsive design",
    aliases: ["מותאם לנייד", "מובייל", "עיצוב רספונסיבי"],
    tag: "עיצוב",
    definition:
      "אתר שמתאים את עצמו לכל גודל מסך, מטלפון ועד מסך מחשב רחב: הטקסט, התמונות והתפריט מסתדרים מחדש ונשארים נוחים. היום זו דרישת בסיס, כי חלק גדול מהגלישה נעשה מהטלפון.",
    seeAlso: ["ux", "ui"],
  },
  /* ── ת ── */
  {
    slug: "israeli-standard-5568",
    name: "ת\"י 5568",
    alt: "Israeli Standard 5568",
    aliases: ["תקן 5568", "תקן נגישות"],
    tag: "נגישות",
    definition:
      "התקן הישראלי לנגישות תכנים באינטרנט. הוא מאמץ את הנחיות WCAG ברמה AA, והוא הבסיס שלפיו בודקים אם אתר עומד בתקנות הנגישות בישראל.",
    seeAlso: ["wcag", "web-accessibility"],
  },
  /* ── Latin ── */
  {
    slug: "cls",
    name: "CLS",
    alt: "Cumulative Layout Shift",
    aliases: ["קפיצות בעמוד", "יציבות"],
    tag: "ביצועים",
    definition:
      "מדד שבודק כמה העמוד \"קופץ\" בזמן הטעינה, למשל כשתמונה נטענת ודוחפת את הטקסט למטה. לפי גוגל, ציון של 0.1 ומטה נחשב טוב, והפתרון הנפוץ הוא לשמור מראש מקום לתמונות.",
    seeAlso: ["core-web-vitals", "lcp", "inp"],
  },
  {
    slug: "cms",
    name: "CMS",
    alt: "Content Management System",
    aliases: ["מערכת ניהול תוכן", "וורדפרס", "WordPress"],
    tag: "תשתית",
    definition:
      "מערכת ניהול תוכן: ממשק שמאפשר לעדכן טקסטים, תמונות ועמודים באתר בלי לכתוב קוד. WordPress היא הדוגמה המוכרת, ויש גם מערכות שמתחברות לאתר שנכתב בקוד.",
    seeAlso: ["react", "hosting"],
    article: { slug: "react-vs-wordpress-2026", label: "React או WordPress" },
  },
  {
    slug: "core-web-vitals",
    name: "Core Web Vitals",
    alt: "המדדים החיוניים של גוגל",
    aliases: ["CWV", "מהירות אתר", "ביצועים"],
    tag: "ביצועים",
    definition:
      "שלושה מדדים של גוגל לחוויית הגולש: כמה מהר מופיע התוכן הראשי (LCP), כמה מהר העמוד מגיב ללחיצה (INP) וכמה הוא יציב בזמן הטעינה (CLS). גוגל מתייחסת אליהם כחלק מהערכת חוויית העמוד.",
    seeAlso: ["lcp", "inp", "cls"],
    article: { slug: "website-speed-fix", label: "למה האתר שלכם איטי, ואיך מתקנים" },
  },
  {
    slug: "crm",
    name: "CRM",
    alt: "Customer Relationship Management",
    aliases: ["ניהול לקוחות", "ניהול לידים"],
    tag: "תוכן ושיווק",
    definition:
      "מערכת לניהול קשרי לקוחות: מקום אחד שבו נשמרים הפניות, הלקוחות, השיחות והמשימות. חיבור של טופס האתר ל-CRM עוזר לוודא שאף פנייה לא הולכת לאיבוד.",
    seeAlso: ["conversion", "cta"],
  },
  {
    slug: "cta",
    name: "CTA",
    alt: "Call to Action · קריאה לפעולה",
    aliases: ["קריאה לפעולה", "כפתור"],
    tag: "תוכן ושיווק",
    definition:
      "קריאה לפעולה: הכפתור או המשפט שאומר לגולש מה לעשות עכשיו, למשל \"לשיחה בוואטסאפ\" או \"לקביעת תור\". CTA טוב ברור, בולט ומופיע במקום שבו הגולש כבר מוכן לפעול.",
    seeAlso: ["conversion", "landing-page"],
    article: { slug: "website-content-writing-guide", label: "איך לכתוב תוכן לאתר שמביא פניות" },
  },
  {
    slug: "dns",
    name: "DNS",
    alt: "Domain Name System",
    aliases: ["רשומות DNS", "הפניית דומיין"],
    tag: "תשתית",
    definition:
      "המערכת שמתרגמת שם דומיין לכתובת של השרת שבו האתר נמצא, מעין ספר טלפונים של האינטרנט. בהגדרות ה-DNS מחברים את הדומיין לאחסון של האתר ולתיבות הדואר.",
    seeAlso: ["domain", "hosting"],
  },
  {
    slug: "geo",
    name: "GEO",
    alt: "Generative Engine Optimization",
    aliases: ["קידום ב-AI", "ChatGPT", "Gemini", "AEO", "מנועי תשובות"],
    tag: "קידום",
    definition:
      "התאמת האתר והתוכן כך שמנועי תשובות מבוססי בינה מלאכותית, כמו ChatGPT, Gemini ו-Perplexity, יבינו את העסק ויוכלו לצטט אותו. הבסיס זהה ל-SEO טוב: תוכן ברור וישיר, נתונים מובנים ופרטי עסק עקביים.",
    seeAlso: ["seo", "schema", "llms-txt"],
    article: { slug: "geo-ai-search-guide", label: "מדריך GEO לעסקים" },
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile",
    alt: "פרופיל העסק בגוגל",
    aliases: ["גוגל מפות", "גוגל עסקים", "Google My Business"],
    tag: "קידום",
    definition:
      "הכרטיס של העסק בגוגל מפות ובתוצאות החיפוש המקומיות: כתובת, שעות, טלפון, תמונות וביקורות. הוא בחינם, ולעסק מקומי הוא לעיתים קרובות הדבר הראשון שלקוח רואה.",
    seeAlso: ["seo", "keyword"],
    article: { slug: "google-business-profile-guide", label: "המדריך ל-Google Business Profile" },
  },
  {
    slug: "search-console",
    name: "Google Search Console",
    alt: "הכלי של גוגל לבעלי אתרים",
    aliases: ["סרץ' קונסול", "GSC"],
    tag: "קידום",
    definition:
      "כלי חינמי של גוגל שמראה איך האתר מופיע בחיפוש: על אילו חיפושים הוא מוצג, כמה לוחצים עליו ואילו עמודים נכנסו לאינדקס. דרכו גם מגישים מפת אתר ומקבלים התראות על בעיות.",
    seeAlso: ["sitemap", "indexing"],
  },
  {
    slug: "indexnow",
    name: "IndexNow",
    alt: "פרוטוקול עדכון מהיר למנועי חיפוש",
    aliases: ["Bing", "אינדוקס מהיר"],
    tag: "קידום",
    definition:
      "פרוטוקול פתוח שבו האתר מודיע למנועי חיפוש ברגע שעמוד נוסף או השתנה, במקום לחכות שיגיעו לסרוק אותו. Bing ו-Yandex הם בין המנועים שתומכים בו.",
    seeAlso: ["indexing", "sitemap"],
  },
  {
    slug: "inp",
    name: "INP",
    alt: "Interaction to Next Paint",
    aliases: ["זמן תגובה", "תגובתיות"],
    tag: "ביצועים",
    definition:
      "מדד שבודק כמה מהר העמוד מגיב כשלוחצים, מקישים או מקלידים בו. הוא החליף ב-2024 את המדד FID, ולפי גוגל זמן של עד 200 אלפיות שנייה נחשב טוב.",
    seeAlso: ["core-web-vitals", "lcp", "cls"],
  },
  {
    slug: "lcp",
    name: "LCP",
    alt: "Largest Contentful Paint",
    aliases: ["זמן טעינה", "מהירות טעינה"],
    tag: "ביצועים",
    definition:
      "הזמן שעובר עד שהאלמנט הגדול ביותר במסך הראשון, בדרך כלל תמונה או כותרת, מוצג לגולש. לפי גוגל, עד 2.5 שניות נחשב טוב.",
    seeAlso: ["core-web-vitals", "inp", "cls"],
  },
  {
    slug: "llms-txt",
    name: "llms.txt",
    alt: "קובץ תקציר למודלי שפה",
    aliases: ["AI", "מודלי שפה"],
    tag: "קידום",
    definition:
      "קובץ טקסט בשורש האתר שמציג למודלי שפה תקציר מסודר: מי העסק, מה הוא עושה ואילו עמודים חשובים. זו הצעה פתוחה לתקן ולא דרישה של מנוע מסוים, אבל היא קלה ליישום.",
    seeAlso: ["geo", "robots-txt"],
  },
  {
    slug: "react",
    name: "React",
    alt: "ספריית ממשקים",
    aliases: ["ריאקט", "JavaScript", "פיתוח בקוד"],
    tag: "תשתית",
    definition:
      "ספריית JavaScript לבניית ממשקים מרכיבים קטנים שאפשר לשלב ולשנות. אתרים שנבנים בה, לרוב יחד עם כלי כמו Astro או Next.js, יכולים להיות מהירים מאוד ומותאמים לחלוטין לעסק.",
    seeAlso: ["cms", "core-web-vitals"],
    article: { slug: "react-vs-wordpress-2026", label: "React או WordPress" },
  },
  {
    slug: "robots-txt",
    name: "robots.txt",
    alt: "קובץ הנחיות לסורקים",
    aliases: ["רובוטים", "סורקים", "crawlers"],
    tag: "תשתית",
    definition:
      "קובץ בשורש האתר שאומר לסורקים של מנועי חיפוש ושל מערכות AI לאילו חלקים באתר מותר להם להיכנס. טעות בקובץ הזה יכולה להסתיר אתר שלם מגוגל, ולכן בודקים אותו בכל השקה.",
    seeAlso: ["sitemap", "llms-txt"],
  },
  {
    slug: "schema",
    name: "Schema",
    alt: "נתונים מובנים · JSON-LD",
    aliases: ["נתונים מובנים", "סכמה", "structured data", "JSON-LD"],
    tag: "קידום",
    definition:
      "קוד שמתאר למנועי חיפוש, בשפה מוסכמת, מה יש בעמוד: עסק, שירות, מאמר או שאלות נפוצות. הוא נכתב בדרך כלל בפורמט JSON-LD, לא נראה לגולש, ועוזר לגוגל ולמנועי AI להבין את התוכן.",
    seeAlso: ["seo", "geo"],
  },
  {
    slug: "seo",
    name: "SEO",
    alt: "Search Engine Optimization · קידום אורגני",
    aliases: ["קידום אתרים", "קידום אורגני", "גוגל"],
    tag: "קידום",
    definition:
      "קידום אתרים אורגני: העבודה שגורמת לאתר להופיע גבוה בתוצאות החיפוש הרגילות, שאינן ממומנות. היא כוללת תשתית טכנית תקינה, תוכן שעונה על מה שאנשים מחפשים, וקישורים ואזכורים מאתרים אחרים.",
    seeAlso: ["geo", "keyword", "schema"],
    article: { slug: "seo-2026-what-works", label: "SEO: מה באמת עובד" },
  },
  {
    slug: "sitemap",
    name: "Sitemap",
    alt: "מפת אתר",
    aliases: ["מפת אתר", "sitemap.xml"],
    tag: "קידום",
    definition:
      "קובץ XML שמפרט את העמודים באתר שרוצים שמנועי חיפוש יכירו, לפעמים עם תאריך העדכון האחרון של כל עמוד. מגישים אותו ב-Google Search Console כדי שעמודים חדשים יתגלו מהר יותר.",
    seeAlso: ["search-console", "indexing", "robots-txt"],
  },
  {
    slug: "ssl",
    name: "SSL",
    alt: "תעודת אבטחה · HTTPS",
    aliases: ["HTTPS", "TLS", "תעודת אבטחה", "מנעול"],
    tag: "תשתית",
    definition:
      "תעודת אבטחה שמצפינה את המידע שעובר בין הגולש לאתר, ומאפשרת לאתר להיטען בכתובת שמתחילה ב-https. דפדפנים מסמנים אתר בלי תעודה כ\"לא מאובטח\", ולכן היא הכרחית בכל אתר.",
    seeAlso: ["hosting", "domain"],
  },
  {
    slug: "ui",
    name: "UI",
    alt: "User Interface · ממשק משתמש",
    aliases: ["ממשק משתמש", "עיצוב ממשק"],
    tag: "עיצוב",
    definition:
      "ממשק המשתמש: מה שרואים על המסך, כמו כפתורים, טיפוגרפיה, צבעים ופריסה. ה-UI הוא השכבה החזותית של חוויית המשתמש, ושניהם צריכים לעבוד יחד.",
    seeAlso: ["ux", "responsive"],
  },
  {
    slug: "ux",
    name: "UX",
    alt: "User Experience · חוויית משתמש",
    aliases: ["חוויית משתמש", "חוויית גולש"],
    tag: "עיצוב",
    definition:
      "חוויית המשתמש: כמה קל לגולש להבין את האתר, למצוא את מה שחיפש ולעשות את מה שבא לעשות. UX טוב נבנה מאפיון, ממבנה עמודים הגיוני ומבדיקה עם אנשים אמיתיים.",
    seeAlso: ["ui", "web-spec"],
    article: { slug: "uiux-trends-2026", label: "UI/UX ב-2026" },
  },
  {
    slug: "wcag",
    name: "WCAG",
    alt: "Web Content Accessibility Guidelines",
    aliases: ["הנחיות נגישות", "AA"],
    tag: "נגישות",
    definition:
      "ההנחיות הבינלאומיות לנגישות תכנים באינטרנט, של ארגון W3C. הן מחולקות לשלוש רמות, A, AA ו-AAA, והתקן הישראלי מבוסס על רמה AA.",
    seeAlso: ["israeli-standard-5568", "web-accessibility"],
    article: { slug: "website-accessibility-israel", label: "נגישות אתרים לעסקים" },
  },
];

/* ───────────────────────── index helpers ───────────────────────── */

export const HEBREW_LETTERS = "אבגדהוזחטיכלמנסעפצקרשת".split("");

/** The index letter of a term: its first Hebrew letter, or its first Latin letter (upper case). */
export function termLetter(term: GlossaryTerm): string {
  const ch = term.name.trim().charAt(0);
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : ch;
}

/** Terms sorted: Hebrew א–ת first, then Latin A–Z (case-insensitive). */
export function sortedTerms(): GlossaryTerm[] {
  const isHeb = (t: GlossaryTerm) => !/[a-z]/i.test(t.name.charAt(0));
  return [...glossaryTerms].sort((a, b) => {
    if (isHeb(a) !== isHeb(b)) return isHeb(a) ? -1 : 1;
    return a.name.localeCompare(b.name, isHeb(a) ? "he" : "en", { sensitivity: "base" });
  });
}

/** Letters that have at least one term, in index order. */
export function usedLetters(): string[] {
  const set = new Set(sortedTerms().map(termLetter));
  const latin = [...set].filter((l) => /[A-Z]/.test(l)).sort();
  return [...HEBREW_LETTERS.filter((l) => set.has(l)), ...latin];
}

export const termHref = (slug: string) => `/glossary/#term-${slug}`;
