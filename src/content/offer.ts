/**
 * "ההצעה" — the single, tailored offer (SITE-PLAYBOOK iron rules 2–3).
 * No prices, no tiers, no packages. Used by the home page and meant to be reused
 * by /packages/ (ההצעה) — import { offer, offerFaq } from "@/content/offer".
 */

export interface OfferPart {
  /** Short label, e.g. "הקמה". */
  kicker: string;
  title: string;
  body: string;
}

export interface ScopeGroup {
  title: string;
  items: string[];
}

/** "כרטיס הכניסה" — the admission ticket that explains the model (home signature). */
export interface OfferTicket {
  admit: string;
  venue: string;
  /** Decorative serial printed on the ticket (not a count of anything). */
  serial: string;
  main: { kicker: string; title: string; stages: string[]; note: string };
  stub: { kicker: string; title: string; items: string[]; note: string };
  stamp: string;
  tearHint: string;
  tearButton: string;
  reattachButton: string;
  tornNote: string;
  announceTorn: string;
  announceAttached: string;
}

export interface OfferFaqItem {
  question: string;
  answer: string;
}

export const offer = {
  eyebrow: "ההצעה",
  title: "הצעה אחת, בהתאמה אישית",
  lede:
    "אין אצלנו חבילות מוכנות מראש. כל עסק מקבל הצעה אחת שנבנית סביב מה שהוא באמת צריך: ההיקף קובע את ההצעה, ואתם מחליטים מה נכנס לאתר.",
  parts: [
    {
      kicker: "הקמה",
      title: "תשלום חד־פעמי על בניית האתר",
      body: "אפיון, עיצוב, פיתוח והשקה של האתר. ההיקף שבחרתם הוא שקובע את ההצעה, ואין רכיבים שנכנסים בלי שביקשתם.",
    },
    {
      kicker: "מנוי חודשי, לבחירתכם",
      title: "שקט נפשי אחרי ההשקה",
      body: "אחסון, תחזוקה שוטפת, עדכוני אבטחה וגיבויים, כדי שהאתר יישאר מהיר, מאובטח ותקין לאורך זמן.",
    },
    {
      kicker: "הצעה אישית",
      title: "מתחילים בשיחה בוואטסאפ",
      body: "מספרים לנו בכמה מילים על העסק ועל מה שאתם צריכים, ואנחנו חוזרים אליכם עם הצעה מסודרת לפי ההיקף.",
    },
  ] satisfies OfferPart[],
  /** The admission ticket (home): the main ticket is the setup, the tear-off stub is the optional subscription. */
  ticket: {
    admit: "כרטיס כניסה",
    venue: "הגלריה · NZ-web",
    serial: "0001",
    main: {
      kicker: "הקמה · תשלום חד־פעמי",
      title: "בניית האתר שלכם",
      stages: ["אפיון", "עיצוב", "פיתוח", "השקה"],
      note: "ההיקף שבחרתם קובע את ההצעה. אין רכיבים שנכנסים בלי שביקשתם.",
    },
    stub: {
      kicker: "ספח · לבחירתכם",
      title: "מנוי חודשי",
      items: ["אחסון", "תחזוקה שוטפת", "עדכוני אבטחה", "גיבויים", "מענה לשאלות"],
      note: "שומר על האתר מהיר, מאובטח ותקין אחרי ההשקה.",
    },
    stamp: "הצעה אישית",
    tearHint: "משכו את הספח הצידה: המנוי לבחירתכם",
    tearButton: "לתלוש את הספח",
    reattachButton: "להחזיר את הספח",
    tornNote: "הספח נתלש. המנוי הוא לבחירתכם, ואת הפרטים המדויקים נסגור יחד בהצעה.",
    announceTorn: "הספח של המנוי החודשי נתלש מהכרטיס. ההקמה נשארת.",
    announceAttached: "הספח של המנוי החודשי חזר לכרטיס.",
  } satisfies OfferTicket,
  /** The line beside the ticket: how you get one. */
  howTo: {
    title: "איך מקבלים כרטיס?",
    body: "מספרים לנו בכמה מילים על העסק ועל מה שאתם צריכים, ואנחנו חוזרים אליכם עם הצעה מסודרת לפי ההיקף.",
  },
  scopeTitle: "אבני הבניין שאפשר לבחור",
  scopeNote: "בוחרים רק את מה שהעסק צריך עכשיו. אפשר להוסיף עוד בהמשך.",
  scope: [
    {
      title: "סוג האתר",
      items: ["אתר תדמית לעסק", "דף נחיתה לקמפיין", "אתר תוכן ומגזין", "חנות אונליין"],
    },
    {
      title: "עמודים ותוכן",
      items: ["עמודי שירות", "גלריית עבודות", "עמוד אודות", "שאלות נפוצות", "בלוג / מגזין"],
    },
    {
      title: "יכולות",
      items: ["טופס פנייה לוואטסאפ", "מערכת קביעת תורים", "תזכורות אוטומטיות", "אזור ניהול"],
    },
    {
      title: "יסודות",
      items: ["עיצוב מותאם אישית", "התאמה מלאה למובייל", "נגישות לפי ת״י 5568", "תשתית SEO", "חיבור לגוגל אנליטיקס"],
    },
  ] satisfies ScopeGroup[],
  cta: { label: "לפרטים על ההצעה", href: "/packages/" },
  whatsappMessage: "היי, הגעתי מהאתר של NZ-web ואשמח לקבל הצעה אישית לאתר לעסק שלי.",
};

/** Short FAQ about the process and the offer — rendered on the home page with FAQPage JSON-LD. */
export const offerFaq: OfferFaqItem[] = [
  {
    question: "למה אין אצלכם חבילות או מחירון?",
    answer:
      "כי כל עסק צריך משהו אחר. במקום לדחוס אתכם לחבילה, אנחנו בונים הצעה אחת לפי ההיקף שבחרתם: סוג האתר, העמודים והיכולות. כך אתם משלמים על מה שהעסק באמת צריך.",
  },
  {
    question: "ממה מורכבת ההצעה?",
    answer:
      "מתשלום חד־פעמי על הקמת האתר (אפיון, עיצוב, פיתוח והשקה), ומנוי חודשי לבחירתכם שכולל אחסון, תחזוקה שוטפת, עדכוני אבטחה וגיבויים.",
  },
  {
    question: "חייבים לקחת את המנוי החודשי?",
    answer:
      "המנוי הוא לבחירתכם. הוא נועד לשמור על האתר מהיר, מאובטח ותקין אחרי ההשקה, בלי שתצטרכו לטפל בזה בעצמכם. את הפרטים המדויקים נסגור יחד בהצעה.",
  },
  {
    question: "איך נראה התהליך מהשיחה הראשונה ועד ההשקה?",
    answer:
      "מתחילים בשיחה קצרה ובאפיון, ממשיכים לעיצוב שאתם מאשרים, עוברים לפיתוח ובדיקות במובייל ובמחשב, ומסיימים בהשקה, חיבור לכלי גוגל וליווי אחריה.",
  },
  {
    question: "איך מקבלים הצעה?",
    answer:
      "שולחים לנו הודעה בוואטסאפ עם כמה מילים על העסק ועל מה שאתם צריכים. נחזור אליכם עם שאלות קצרות ועם הצעה מסודרת לפי ההיקף.",
  },
];
