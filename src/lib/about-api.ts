import { getSupabaseClient } from "@/lib/supabase";
import { formatRepositoryError } from "@/lib/repository-error";
import type { Database } from "@/lib/supabase-types";

export interface AboutAccordionItem {
  title: string;
  desc: string;
}

export interface AboutColumn {
  title: string;
  items: AboutAccordionItem[];
}

export interface AboutPageData {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroQuote: string;
  servicesTitle: string;
  columns: [AboutColumn, AboutColumn, AboutColumn];
  visionTitle: string;
  visionParagraphs: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface DeletedAboutItem {
  id: string;
  type: "column-item" | "vision-paragraph";
  label: string;
  data: unknown;
  deletedAt: number;
}

type AboutRow = Database["public"]["Tables"]["about_content"]["Row"];
type AboutInsert = Database["public"]["Tables"]["about_content"]["Insert"];

const ABOUT_ROW_ID = "default";
const RETENTION_DAYS = 30;

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

class AboutRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`About repository failed to ${action}: ${message}`);
    this.name = "AboutRepositoryError";
  }
}

function wrapAboutError(action: string, error: unknown): never {
  throw new AboutRepositoryError(action, formatRepositoryError(error));
}

function cloneAboutData(data: AboutPageData): AboutPageData {
  return JSON.parse(JSON.stringify(data)) as AboutPageData;
}

function cloneDeletedItems(items: DeletedAboutItem[]): DeletedAboutItem[] {
  return JSON.parse(JSON.stringify(items)) as DeletedAboutItem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeAccordionItem(value: unknown): AboutAccordionItem {
  if (!isRecord(value)) {
    return { title: "", desc: "" };
  }

  return {
    title: typeof value.title === "string" ? value.title : "",
    desc: typeof value.desc === "string" ? value.desc : "",
  };
}

function normalizeColumn(value: unknown, fallback: AboutColumn): AboutColumn {
  if (!isRecord(value)) {
    return {
      title: fallback.title,
      items: fallback.items.map((item) => ({ ...item })),
    };
  }

  const items = Array.isArray(value.items) ? value.items.map(normalizeAccordionItem) : fallback.items;
  return {
    title: typeof value.title === "string" ? value.title : fallback.title,
    items,
  };
}

function normalizeColumns(value: unknown): [AboutColumn, AboutColumn, AboutColumn] {
  const fallback = defaultData.columns;
  if (!Array.isArray(value)) {
    return cloneAboutData(defaultData).columns;
  }

  return [
    normalizeColumn(value[0], fallback[0]),
    normalizeColumn(value[1], fallback[1]),
    normalizeColumn(value[2], fallback[2]),
  ];
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return value.map((item, index) => (typeof item === "string" ? item : fallback[index] ?? ""));
}

function normalizeDeletedItem(value: unknown): DeletedAboutItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = value.type === "column-item" || value.type === "vision-paragraph" ? value.type : null;
  if (!type) {
    return null;
  }

  return {
    id: typeof value.id === "string" && value.id ? value.id : crypto.randomUUID(),
    type,
    label: typeof value.label === "string" ? value.label : "",
    data: value.data ?? null,
    deletedAt: typeof value.deletedAt === "number" ? value.deletedAt : Date.now(),
  };
}

function normalizeDeletedItems(value: unknown): DeletedAboutItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return value
    .map(normalizeDeletedItem)
    .filter((item): item is DeletedAboutItem => Boolean(item && item.deletedAt > cutoff));
}

function mergeAboutData(input: unknown): AboutPageData {
  const source = isRecord(input) ? input : {};

  return {
    heroSubtitle: typeof source.heroSubtitle === "string" ? source.heroSubtitle : defaultData.heroSubtitle,
    heroTitle: typeof source.heroTitle === "string" ? source.heroTitle : defaultData.heroTitle,
    heroDescription: typeof source.heroDescription === "string" ? source.heroDescription : defaultData.heroDescription,
    heroQuote: typeof source.heroQuote === "string" ? source.heroQuote : defaultData.heroQuote,
    servicesTitle: typeof source.servicesTitle === "string" ? source.servicesTitle : defaultData.servicesTitle,
    columns: normalizeColumns(source.columns),
    visionTitle: typeof source.visionTitle === "string" ? source.visionTitle : defaultData.visionTitle,
    visionParagraphs: normalizeStringArray(source.visionParagraphs, defaultData.visionParagraphs),
    ctaTitle: typeof source.ctaTitle === "string" ? source.ctaTitle : defaultData.ctaTitle,
    ctaSubtitle: typeof source.ctaSubtitle === "string" ? source.ctaSubtitle : defaultData.ctaSubtitle,
    ctaButtonText: typeof source.ctaButtonText === "string" ? source.ctaButtonText : defaultData.ctaButtonText,
    ctaButtonLink: typeof source.ctaButtonLink === "string" ? source.ctaButtonLink : defaultData.ctaButtonLink,
  };
}

function mapAboutRow(row: AboutRow | null): AboutPageData {
  if (!row) {
    return cloneAboutData(defaultData);
  }

  return mergeAboutData(row.content);
}

function mapDeletedItemsRow(row: AboutRow | null): DeletedAboutItem[] {
  if (!row) {
    return [];
  }

  return normalizeDeletedItems(row.deleted_items);
}

function mapAboutInsert(data: AboutPageData, deletedItems: DeletedAboutItem[]): AboutInsert {
  return {
    id: ABOUT_ROW_ID,
    content: data as unknown as Database["public"]["Tables"]["about_content"]["Insert"]["content"],
    deleted_items: deletedItems as unknown as Database["public"]["Tables"]["about_content"]["Insert"]["deleted_items"],
  };
}

async function fetchAboutRow(): Promise<AboutRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("about_content").select("*").eq("id", ABOUT_ROW_ID).maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

async function saveAboutRow(data: AboutPageData, deletedItems: DeletedAboutItem[]): Promise<AboutRow> {
  const supabase = getSupabaseClient();
  const { data: row, error } = await supabase
    .from("about_content")
    .upsert(mapAboutInsert(data, deletedItems), { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return row;
}

export async function fetchAboutData(): Promise<AboutPageData> {
  try {
    return mapAboutRow(await fetchAboutRow());
  } catch (error) {
    return wrapAboutError("fetch About content", error);
  }
}

export async function saveAboutData(data: AboutPageData): Promise<AboutPageData> {
  try {
    const existingRow = await fetchAboutRow();
    const row = await saveAboutRow(mergeAboutData(data), mapDeletedItemsRow(existingRow));
    return mapAboutRow(row);
  } catch (error) {
    return wrapAboutError("save About content", error);
  }
}

export async function fetchDeletedAboutItems(): Promise<DeletedAboutItem[]> {
  try {
    return mapDeletedItemsRow(await fetchAboutRow());
  } catch (error) {
    return wrapAboutError("fetch deleted About items", error);
  }
}

export async function addDeletedAboutItem(item: Omit<DeletedAboutItem, "id" | "deletedAt">): Promise<DeletedAboutItem[]> {
  try {
    const row = await fetchAboutRow();
    const deletedItems = mapDeletedItemsRow(row);
    deletedItems.push({ ...item, id: crypto.randomUUID(), deletedAt: Date.now() });
    const savedRow = await saveAboutRow(mapAboutRow(row), deletedItems);
    return mapDeletedItemsRow(savedRow);
  } catch (error) {
    return wrapAboutError("add an About item to the recycle bin", error);
  }
}

export async function permanentlyDeleteAboutItem(id: string): Promise<DeletedAboutItem[]> {
  try {
    const row = await fetchAboutRow();
    const deletedItems = mapDeletedItemsRow(row).filter((item) => item.id !== id);
    const savedRow = await saveAboutRow(mapAboutRow(row), deletedItems);
    return mapDeletedItemsRow(savedRow);
  } catch (error) {
    return wrapAboutError("permanently delete an About recycle-bin item", error);
  }
}

export async function getDeletedAboutItem(id: string): Promise<DeletedAboutItem | undefined> {
  const items = await fetchDeletedAboutItems();
  return cloneDeletedItems(items).find((item) => item.id === id);
}

export function getDefaultAboutData(): AboutPageData {
  return cloneAboutData(defaultData);
}
