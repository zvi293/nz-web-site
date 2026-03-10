export interface AboutAccordionItem {
  title: string;
  desc: string;
}

export interface AboutColumn {
  title: string;
  items: AboutAccordionItem[];
}

export interface AboutPageData {
  // Hero
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroQuote: string;

  // Services section
  servicesTitle: string;
  columns: [AboutColumn, AboutColumn, AboutColumn];

  // Vision section
  visionTitle: string;
  visionParagraphs: string[];

  // CTA section
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

const LS_KEY = "nz-web-about";

const defaultData: AboutPageData = {
  heroSubtitle: "הסיפור שלנו",
  heroTitle: "מי אנחנו?",
  heroDescription: "אנחנו לא סתם בונים אתרים — אנחנו יוצרים נכסים דיגיטליים שמייצרים תוצאות.\nהחזון שלכם פוגש את הטכנולוגיה והעיצוב שלנו, בדרך למוצר מנצח.",
  heroQuote: "בכל פרויקט שאנחנו בונים, אנחנו משאירים חלק מעצמנו. העיצוב הוא השפה שדרכה אנחנו מספרים לעולם מה באמת חשוב לנו, בלי לומר מילה.",
  servicesTitle: "השירותים שלנו",
  columns: [
    {
      title: "פיתוח ופתרונות טכנולוגיים",
      items: [
        { title: "פיתוח אתרי Full-Stack", desc: "בניית אפליקציות ווב מקצה לקצה בטכנולוגיות המתקדמות ביותר (React, Node.js)." },
        { title: "מערכות ניהול ו-Dashboard", desc: "פיתוח ממשקי ניהול חכמים (Admin Panels) המחוברים למסדי נתונים מתקדמים כמו Supabase." },
        { title: "דפי נחיתה ממירים", desc: "עיצוב ובנייה של דפי נחיתה בסטנדרט גבוה, מותאמים לקידום ושיווק דיגיטלי." },
        { title: "אינטגרציות API", desc: "חיבור האתר לשירותים חיצוניים, מערכות תשלומים וכלים אוטומטיים לניהול העסק." },
      ],
    },
    {
      title: "עיצוב חוויית משתמש (UX/UI)",
      items: [
        { title: "עיצוב ממשק משתמש (UI)", desc: "יצירת שפה ויזואלית ייחודית, נקייה ומודרנית שתואמת את ערכי המותג." },
        { title: "אפיון חווית משתמש (UX)", desc: "תכנון מסלול לקוח אינטואיטיבי שממקסם המרות ושומר על פשטות תפעולית." },
        { title: "התאמה רספונסיבית מלאה", desc: "הבטחה שהאתר ייראה ויעבוד מושלם בכל מכשיר - ממחשב שולחני ועד לסמארטפון." },
        { title: "עיצוב אב-טיפוס (Prototyping)", desc: "המחשה ויזואלית של הפרויקט עוד לפני שלב הקוד כדי להבטיח דיוק בציפיות." },
      ],
    },
    {
      title: "פתרונות חכמים ואוטומציות AI",
      items: [
        { title: "הטמעת צ'אטבוטים מבוססי AI", desc: "שילוב עוזרים חכמים באתר שנותנים מענה ללקוחות 24/7, מבוססים על המידע של העסק שלך." },
        { title: "אוטומציה של תהליכי עבודה", desc: "חיבור האתר למערכות חיצוניות (כמו CRM או Google Sheets) כדי לחסוך זמן יקר על משימות ידניות." },
        { title: "יצירת תוכן חכם ב-AI", desc: "פיתוח כלים פנימיים המאפשרים לייצר פוסטים, תיאורי מוצרים או מאמרים בלחיצת כפתור אחת." },
        { title: "ניהול נתונים מתקדם (Supabase)", desc: "הקמת מסדי נתונים מאובטחים המאפשרים ניהול משתמשים, הרשאות ומידע עסקי רגיש בצורה יעילה." },
        { title: "אופטימיזציה למנועי חיפוש (SEO)", desc: "הגדרה טכנית מתקדמת (Indexing) כדי לוודא שהאתר שלך יופיע בתוצאות הראשונות בגוגל." },
        { title: "מערכות Dashboards ודוחות", desc: "בניית ממשקים ויזואליים המציגים נתונים בזמן אמת על ביצועי העסק והמכירות." },
      ],
    },
  ],
  visionTitle: "החזון שלכם ראוי לביטוי המדויק ביותר.",
  visionParagraphs: [
    "אתם חיים את המותג שלכם יום-יום. אתם יודעים בדיוק מה הערך שאתם מביאים לעולם ומכירים את הקהל שלכם הכי טוב שיש. אבל בתוך עומס העשייה, לפעמים קשה לעצור ולזקק את כל זה למשהו ויזואלי, חד ומשכנע. זה טבעי – למי יש זמן לרדת לרמת הפיקסל כשיש עסק לנהל?",
    "ובשביל זה NZ WEB כאן. אנחנו לא רק מעצבים או בונים אתרים; אנחנו חושבים יחד אתכם. אנחנו הופכים רעיונות מורכבים לתוצרים חכמים עם נוכחות – מאתרים וממשקי משתמש ועד למצגות שסוגרות עסקאות. אנחנו כאן כדי לוודא שכל מה שיוצא תחת הידיים שלכם ייראה וידבר בדיוק בשפה שלכם.",
  ],
  ctaTitle: "מוכנים להתחיל?",
  ctaSubtitle: "צרו איתנו קשר ונבנה יחד משהו שיזכרו",
  ctaButtonText: "צור קשר",
  ctaButtonLink: "/contact",
};

export function fetchAboutData(): AboutPageData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveAboutData(data: AboutPageData): void {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// Recycle bin for about page items (columns items, vision paragraphs)
export interface DeletedAboutItem {
  id: string;
  type: "column-item" | "vision-paragraph";
  label: string;
  data: any;
  deletedAt: number;
}

const DELETED_ABOUT_KEY = "nz-web-about-deleted";
const RETENTION_DAYS = 30;

function getDeletedAboutItems(): DeletedAboutItem[] {
  try {
    const raw = localStorage.getItem(DELETED_ABOUT_KEY);
    const items: DeletedAboutItem[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return items.filter(i => i.deletedAt > cutoff);
  } catch {
    return [];
  }
}

function saveDeletedAboutItems(items: DeletedAboutItem[]) {
  localStorage.setItem(DELETED_ABOUT_KEY, JSON.stringify(items));
}

export function fetchDeletedAboutItems(): DeletedAboutItem[] {
  return getDeletedAboutItems();
}

export function addDeletedAboutItem(item: Omit<DeletedAboutItem, "id" | "deletedAt">): void {
  const bin = getDeletedAboutItems();
  bin.push({ ...item, id: crypto.randomUUID(), deletedAt: Date.now() });
  saveDeletedAboutItems(bin);
}

export function permanentlyDeleteAboutItem(id: string): void {
  saveDeletedAboutItems(getDeletedAboutItems().filter(i => i.id !== id));
}

export function getDeletedAboutItem(id: string): DeletedAboutItem | undefined {
  return getDeletedAboutItems().find(i => i.id === id);
}
