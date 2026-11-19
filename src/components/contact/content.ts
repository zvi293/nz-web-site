/**
 * /contact/ — every word on the page (contact facts: SITE-PLAYBOOK §2 only).
 * The signature "השפופרת" is a short phone conversation: צבי asks one question per turn,
 * the visitor answers, and the answers become the WhatsApp message. Keep texts short,
 * human and neutral.
 */

export const contactSeo = {
  title: "צור קשר: הצעה אישית לבניית אתר לעסק | NZ-web",
  description:
    "צרו קשר עם NZ-web לבניית אתר לעסק: וואטסאפ וטלפון 058-7292029 או דוא״ל. עונים על כמה שאלות קצרות, ההודעה מתנסחת לבד, ומקבלים הצעה אישית אחרי שיחה.",
};

export const contactHero = {
  room: "אולם 00 · צור קשר",
  /** Two set lines; "על" is tied to "האתר" (no-break space) so it never ends a line. */
  h1: ["צרו קשר, ונדבר", "על\u00A0"],
  h1Accent: "האתר שלכם.",
  /** Answer-first lead (speakable). The number is wrapped LTR; email and hours live in the switchboard below. */
  leadBefore: "הדרך הכי מהירה היא הודעת וואטסאפ ל-",
  leadEnd: "את ההודעה קורא צבי משה, שגם מעצב ובונה את האתר, כך שהתשובה מגיעה ישר ממי שיעבוד איתכם.",
  art: { slug: "ceramic-handsets", prefix: "מוצג", index: 1, medium: "קרמיקה וזכוכית · שתי שפופרות, שיחה אחת" },
};

/** The switchboard: the direct lines (one number for WhatsApp and calls). */
export const contactLines = {
  label: "קווים ישירים",
  phone: { k: "וואטסאפ וטלפון", write: "לכתוב", call: "לחייג" },
  email: { k: "דוא״ל", action: "לשלוח" },
  hours: { k: "שעות", note: "מענה בימי העבודה" },
};

export interface TurnOption {
  id: string;
  /** What the visitor "says" (their bubble). */
  label: string;
  /** How the answer is phrased inside the WhatsApp message. */
  text: string;
}

export interface Turn {
  id: "type" | "goal" | "timing" | "who" | "note";
  /** צבי's question. */
  q: string;
  kind: "choice" | "text";
  options?: TurnOption[];
  /** text turns */
  field?: { label: string; placeholder: string; multiline?: boolean };
  skip?: string;
}

export const call = {
  room: "אולם 01",
  label: "השפופרת",
  title: "שיחה של דקה, והודעה אחת מוכנה",
  lede: "במקום טופס: צבי שואל, אתם עונים בלחיצה, ומהתשובות נכתבת הודעת וואטסאפ שאפשר לערוך לפני השליחה.",
  how: [
    { k: "מרימים", v: "את השפופרת, והשיחה מתחילה" },
    { k: "עונים", v: "על חמש שאלות קצרות, אחת בכל פעם" },
    { k: "שולחים", v: "את ההודעה שנכתבה, בוואטסאפ או בדוא״ל" },
  ],
  who: "צבי משה · NZ-web",
  state: { idle: "על הכן", dialing: "מחייג…", live: "על הקו", typing: "מקליד…", done: "ההודעה מוכנה" },
  lift: "להרים את השפופרת",
  started: "השיחה התחילה ·",
  startedNote: "חמש שאלות קצרות. כל תשובה אפשר לשנות.",
  idleNote: "חמש שאלות, בערך דקה. שום דבר לא נשלח עד שתלחצו על שליחה בוואטסאפ.",
  idleTopics: ["סוג האתר", "המטרה", "מתי מתחילים", "מי אתם", "עוד משהו"],
  noJsCta: "לכתוב לצבי בוואטסאפ",
  turns: [
    {
      id: "type",
      kind: "choice",
      q: "שלום, כאן צבי מ-NZ-web. איזה אתר אתם צריכים?",
      options: [
        { id: "business", label: "אתר תדמית", text: "בניית אתר תדמית לעסק" },
        { id: "landing", label: "דף נחיתה", text: "בניית דף נחיתה" },
        { id: "booking", label: "קביעת תורים", text: "אתר עם מערכת לקביעת תורים" },
        { id: "custom", label: "פיתוח מותאם", text: "פיתוח אתר או מערכת בהתאמה אישית" },
        { id: "speed", label: "לשפר אתר קיים", text: "שיפור האתר הקיים שלי" },
        { id: "unsure", label: "עוד לא בטוח/ה", text: "מה הכי מתאים לעסק שלי" },
      ],
    },
    {
      id: "goal",
      kind: "choice",
      q: "ומה הכי חשוב שהאתר יעשה בשבילכם?",
      options: [
        { id: "leads", label: "יותר פניות", text: "שהאתר יביא יותר פניות מלקוחות" },
        { id: "trust", label: "להיראות מקצועי", text: "שהעסק ייראה מקצועי ואמין ברשת" },
        { id: "google", label: "להופיע בגוגל", text: "שימצאו אותנו בגוגל" },
        { id: "booking", label: "תורים אונליין", text: "שלקוחות יוכלו לקבוע תור לבד" },
        { id: "refresh", label: "לחדש אתר ישן", text: "לחדש אתר ישן" },
      ],
    },
    {
      id: "timing",
      kind: "choice",
      q: "מתי תרצו להתחיל?",
      options: [
        { id: "asap", label: "כמה שיותר מהר", text: "הייתי רוצה להתחיל כמה שיותר מהר" },
        { id: "soon", label: "בחודשים הקרובים", text: "הייתי רוצה להתחיל בחודשים הקרובים" },
        { id: "looking", label: "רק בודק/ת", text: "בינתיים אני רק בודק/ת אפשרויות" },
      ],
    },
    {
      id: "who",
      kind: "text",
      q: "נעים להכיר. איך קוראים לכם, ומה העסק?",
      field: { label: "השם והעסק", placeholder: "למשל: דנה, סטודיו לפילאטיס בחיפה" },
      skip: "מעדיפים לא לכתוב",
    },
    {
      id: "note",
      kind: "text",
      q: "יש עוד משהו שחשוב שאדע?",
      field: { label: "עוד משהו", placeholder: "למשל: יש לנו כבר לוגו ותמונות", multiline: true },
      skip: "זה הכול",
    },
  ] as Turn[],
  sendField: "לשלוח",
  closing: "תודה. זו ההודעה שתגיע אליי. היא נפתחת אצלכם בוואטסאפ, ואפשר לערוך אותה שם לפני השליחה.",
  draftLabel: "ההודעה המוכנה",
  send: "לשלוח בוואטסאפ",
  emailInstead: "לשלוח את אותו נוסח בדוא״ל",
  back: "לשנות את התשובה הקודמת",
  restart: "להתחיל מחדש",
  hangUp: "לנתק",
  direct: "או לכתוב ישר בוואטסאפ, בלי שאלות",
  directMessage: "שלום צבי, הגעתי מהאתר של NZ-web ואשמח לדבר על אתר לעסק שלי.",
  privacy: "שום פרט לא נשמר באתר: ההודעה נפתחת אצלכם בוואטסאפ ונשלחת רק כשתלחצו שם על שליחה.",
  emailSubject: "פנייה מהאתר של NZ-web",
};

/** What happens after the message (the coiled cord). */
export const contactNext = {
  room: "אולם 02",
  label: "אחרי השליחה",
  title: "מה קורה אחרי שההודעה נשלחת",
  aside: "אין מוקד ואין טופס שנעלם. ארבעה צעדים, ואתם יודעים בכל אחד מה הלאה.",
  steps: [
    { title: "ההודעה מגיעה לצבי", body: "בוואטסאפ, בטלפון או בדוא״ל. מי שקורא את ההודעה הוא מי שבונה את האתר." },
    { title: "חוזרים אליכם", body: "בימי העבודה, ואם צריך, עם כמה שאלות קצרות על העסק." },
    { title: "שיחה קצרה", body: "מבינים מה העסק עושה, למי האתר מיועד ומה הוא צריך להשיג." },
    { title: "הצעה אחת, כתובה", body: "מקבלים בוואטסאפ הצעה אישית מפורטת עם לוח זמנים. מתחילים לעבוד רק אחרי שאתם מאשרים." },
  ],
};

/** Questions people ask before they write (also the page's FAQPage JSON-LD; unique site-wide). */
export const contactFaq = {
  room: "אולם 03",
  label: "הודעות שהשארתם",
  title: "לפני שכותבים",
  items: [
    {
      question: "צריך לדעת בדיוק מה אני רוצה לפני שפונים?",
      answer:
        "לא. מספיק לדעת מה העסק עושה ומה הייתם רוצים שהאתר ישיג. את שאר הפרטים, כמו עמודים, תוכן ומערכות, מגדירים יחד בשיחה הראשונה.",
    },
    {
      question: "מה כדאי לכתוב בהודעה הראשונה?",
      answer:
        "משפט על מה העסק עושה, מה האתר צריך לעשות בשבילכם, והאם יש לכם היום אתר. אם יש אתרים שאתם אוהבים, צרפו קישור. זה מספיק כדי שנחזור אליכם עם שאלות ממוקדות.",
    },
    {
      question: "אפשר לדבר בטלפון במקום לכתוב?",
      answer:
        "כן. אפשר להתקשר ל-058-7292029 בימים א׳–ה׳ בין 09:00 ל-19:00. אם לא ענינו, כתבו בוואטסאפ ונחזור אליכם.",
    },
  ],
  allLink: { label: "לכל השאלות הנפוצות", href: "/faq/" },
  /** The page's closing action, under the slips. */
  end: {
    q: "שאלה אחרת? כתבו אותה.",
    cta: "לכתוב לצבי בוואטסאפ",
    message: "שלום צבי, הגעתי מעמוד צור קשר ויש לי שאלה:",
  },
};
