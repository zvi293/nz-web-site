import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
  order: number;
}

interface FetchFaqItemsOptions {
  includeHidden?: boolean;
}

type FaqRow = Database["public"]["Tables"]["faq_items"]["Row"];
type FaqInsert = Database["public"]["Tables"]["faq_items"]["Insert"];

const defaultFaqItems: FaqItem[] = [

  { id: "1", question: "כמה זמן לוקח לבנות אתר ממוצע?", answer: "זה מאוד תלוי במורכבות, אבל אתר תדמית או דף נחיתה איכותי בדרך כלל מוכן תוך 7-14 ימי עסקים. פרויקטים מורכבים יותר (Full-Stack) דורשים אפיון מדויק, ואנחנו נבנה יחד לוח זמנים שמתאים לכם.", visible: true, order: 0 },
  { id: "2", question: "האם האתר יהיה נגיש ורספונסיבי?", answer: 'חד משמעית כן. כל אתר של NZ-web נבנה בסטנדרט "Perfect in every Pixel" – הוא ייראה מדהים בנייד, בטאבלט ובמחשב, ויכלול הצהרת נגישות ותפריט נגישות מלא לפי החוק.', visible: true, order: 1 },
  { id: "3", question: "מה זה אומר אוטומציות AI ואיך זה עוזר לעסק שלי?", answer: "אנחנו לא רק בונים אתר, אנחנו בונים כלי עבודה. זה יכול להיות צ'אטבוט חכם שעונה ללקוחות ב-WhatsApp, או מערכת שמעדכנת אתכם אוטומטית על כל ליד חדש. המטרה היא לחסוך לכם זמן יקר על פעולות ידניות.", visible: true, order: 2 },
  { id: "4", question: "באילו טכנולוגיות אתם משתמשים?", answer: "אנחנו עובדים עם חזית הטכנולוגיה: React ו-Tailwind CSS לנראות מושלמת, ו-Node.js עם Supabase לניהול נתונים מאובטח ומהיר. הכל כדי שהאתר שלכם יהיה מהיר, יציב וניתן להרחבה בעתיד.", visible: true, order: 3 },
  { id: "5", question: "מה קורה אחרי שהאתר באוויר? אתם נעלמים?", answer: "ממש לא. אנחנו מאמינים בשותפות לטווח ארוך. אנחנו כאן לכל עדכון, תחזוקה או הדרכה שתצטרכו כדי לתפעל את האתר בקלות.", visible: true, order: 4 },
  { id: "6", question: "איך נראה תהליך העבודה איתך? מאיפה מתחילים?", answer: "הכל מתחיל בשיחת אפיון שבה אנחנו מבינים מה המטרות שלכם. משם אנחנו עוברים לעיצוב (UI/UX), פיתוח הקוד, בדיקות איכות קפדניות ולבסוף – העלאה לאוויר וחגיגות.", visible: true, order: 5 },
  { id: "7", question: "האם אוכל לעדכן תוכן באתר בעצמי?", answer: "בטח. אנחנו בונים מערכות ניהול תוכן נוחות (מבוססות Supabase), כך שתוכלו לשנות טקסטים, להוסיף מוצרים או להעלות תמונות בקלות, בלי שום ידע בקוד.", visible: true, order: 6 },
  { id: "8", question: "העיצוב הוא 'תבנית' או משהו מותאם אישית?", answer: "אנחנו לא מאמינים בתבניות משוכפלות. כל אתר ב-NZ-web מקבל טיפול ויזואלי ייחודי לפי עקרונות העיצוב המתקדמים של Styler, כדי לוודא שהמותג שלכם בולט מעל כולם.", visible: true, order: 7 },
  { id: "9", question: "האם האתר יהיה בבעלותי המלאה?", answer: "ב-100%. כל הקוד, חשבונות האחסון ומסדי הנתונים הם שלכם. אנחנו רק עוזרים לכם לבנות ולנהל אותם בצורה המקצועית ביותר.", visible: true, order: 8 },
  { id: "10", question: "מה לגבי אבטחת מידע? המידע שלי ושל הלקוחות בטוח?", answer: "אבטחה היא בראש סדר העדיפויות שלנו. שימוש בטכנולוגיות כמו Supabase מאפשר לנו להטמיע פרוטוקולי אבטחה מחמירים, ניהול הרשאות והצפנת נתונים ברמה הגבוהה ביותר.", visible: true, order: 9 },
  { id: "11", question: "מה אם בעתיד ארצה להוסיף אפליקציה או חנות לאתר?", answer: "זו בדיוק הסיבה שאנחנו עובדים עם React. האתר שלכם נבנה בצורה מודולרית, מה שמאפשר לנו להרחיב אותו בכל רגע נתון – מחנות דיגיטלית ועד למערכת ניהול מורכבת – בלי להרוס את מה שכבר נבנה.", visible: true, order: 10 },
];

class FaqRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`Faq repository failed to ${action}: ${message}`);
    this.name = "FaqRepositoryError";
  }
}

function wrapFaqError(action: string, error: unknown): never {
  if (error instanceof Error) {
    throw new FaqRepositoryError(action, error.message);
  }

  throw new FaqRepositoryError(action, "Unknown error");
}

function cloneFaqItems(items: FaqItem[]): FaqItem[] {
  return items.map((item) => ({ ...item }));
}

function mapFaqRow(row: FaqRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    visible: row.is_published,
    order: row.display_order,
  };
}

function mapFaqInsert(item: FaqItem): FaqInsert {
  return {
    id: item.id,
    question: item.question.trim(),
    answer: item.answer.trim(),
    is_published: item.visible,
    display_order: item.order,
  };
}

function normalizeFaqItems(items: FaqItem[]): FaqItem[] {
  return items.map((item, index) => ({
    ...item,
    question: item.question.trim(),
    answer: item.answer.trim(),
    order: index,
  }));
}

export async function fetchFaqItems(options: FetchFaqItemsOptions = {}): Promise<FaqItem[]> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("faq_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!options.includeHidden) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapFaqRow);
  } catch (error) {
    return wrapFaqError("fetch FAQ items", error);
  }
}

export async function saveFaqItems(items: FaqItem[]): Promise<FaqItem[]> {
  try {
    const normalizedItems = normalizeFaqItems(items);
    const supabase = getSupabaseClient();

    const { data: existingRows, error: existingError } = await supabase.from("faq_items").select("id");
    if (existingError) {
      throw existingError;
    }

    const incomingIds = new Set(normalizedItems.map((item) => item.id));
    const idsToDelete = (existingRows ?? [])
      .map((row) => row.id)
      .filter((id) => !incomingIds.has(id));

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase.from("faq_items").delete().in("id", idsToDelete);
      if (deleteError) {
        throw deleteError;
      }
    }

    if (normalizedItems.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from("faq_items")
      .upsert(normalizedItems.map(mapFaqInsert), { onConflict: "id" })
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapFaqRow);
  } catch (error) {
    return wrapFaqError("save FAQ items", error);
  }
}

export function getDefaultFaqItems(): FaqItem[] {
  return cloneFaqItems(defaultFaqItems);
}
