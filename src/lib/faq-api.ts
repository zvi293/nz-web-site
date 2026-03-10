export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
  order: number;
}

const LS_KEY = "nz-web-faq-items";

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

export function fetchFaqItems(): FaqItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const items = JSON.parse(raw) as FaqItem[];
      return items.sort((a, b) => a.order - b.order);
    }
    return defaultFaqItems;
  } catch {
    return defaultFaqItems;
  }
}

export function saveFaqItems(items: FaqItem[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getDefaultFaqItems(): FaqItem[] {
  return defaultFaqItems;
}
