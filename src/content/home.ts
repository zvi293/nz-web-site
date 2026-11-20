/**
 * Home page copy (nz-web.com/). Hebrew, written for business owners: short, concrete,
 * no buzzwords, no numbers or claims (SITE-PLAYBOOK iron rules 4–5).
 */

export const homeSeo = {
  title: "בניית אתרים לעסקים בעיצוב אישי | NZ-web",
  description:
    "NZ-web הוא סטודיו לעיצוב ובניית אתרים לעסקים בישראל: אתרי תדמית, דפי נחיתה ומערכות תורים, מהירים, נגישים ומותאמים אישית. מקבלים הצעה אישית בוואטסאפ.",
};

export interface Exhibit {
  slug: string;
  /** The "medium" line on the museum label. */
  medium: string;
}

export const hero = {
  eyebrow: "סטודיו לעיצוב ובניית אתרים לעסקים",
  /** H1 — rendered as: kicker line (keyword) + the statement. */
  h1Kicker: "עיצוב ובניית אתרים לעסקים",
  h1Statement: ["כל אתר נבנה", "כמו יצירת"],
  h1Accent: "אמנות.",
  lede:
    "NZ-web מעצב ובונה אתרי תדמית, דפי נחיתה ומערכות תורים לעסקים בישראל, בהובלת צבי\u00A0משה. כל אתר מתחיל בדף לבן, נכתב בקוד לעסק אחד, ונמסר מהיר, נגיש ומוכן לגוגל ולמנועי\u00A0AI. אין חבילות ואין מחירון: כל עסק מקבל הצעה אחת בהתאמה אישית, אחרי שיחה קצרה בוואטסאפ.",
  primaryCta: "לשיחה בוואטסאפ",
  secondaryCta: { label: "לעבודות שלנו", href: "/projects/" },
  /** Room label on the hero's floor line (SITE-PLAYBOOK §11 "rooms, not sections"). */
  room: "אולם 00 · הכניסה",
  /** The exhibition map on the hero's floor line (desktop): anchors to the rooms below. */
  rooms: [
    { label: "שירותים", href: "#services" },
    { label: "התהליך", href: "#process" },
    { label: "עבודות", href: "#portfolio" },
    { label: "ההצעה", href: "#pricing" },
    { label: "מגזין", href: "#magazine" },
    { label: "שאלות", href: "#faq" },
  ],
  nextLabel: "המוצג הבא",
  /** aria-label of the progress strip under the frame (direct navigation between exhibits). */
  dotsLabel: "בחירת מוצג",
  exhibits: [
    { slug: "brushstroke-cube", medium: "קובייה, צבע וחלל לבן · הרגע שבו רעיון מקבל צורה" },
    { slug: "cobalt-glass", medium: "זכוכית, אור ושכבות · ממשק שמרגיש שקוף" },
    { slug: "origami-crane", medium: "בטון מקופל כמו נייר · מבנה חזק שנראה קל" },
    { slug: "paper-plane", medium: "נייר, אבן ותנועה · רעיון שיוצא לדרך" },
  ] satisfies Exhibit[],
};

export const servicesHall = {
  eyebrow: "שירותים",
  room: "אולם 01",
  title: "מה אנחנו בונים לעסקים",
  lede: "שישה כיווני עבודה, אותה הקפדה. כל אחד מהם מתחיל באפיון ומסתיים באתר שעובד בשביל העסק.",
  rows: [
    {
      name: "אתר תדמית לעסק",
      line: "האתר שמציג את העסק במיטבו ומביא פניות מלקוחות חדשים.",
      href: "/services/business-website/",
      art: "titanium-ribbon",
    },
    {
      name: "דפי נחיתה",
      line: "עמוד אחד עם מטרה אחת: להפוך את מי שהגיע מקמפיין לפנייה.",
      href: "/services/landing-page-development/",
      art: "coral-ladders",
    },
    {
      name: "מערכת ניהול תורים",
      line: "לקוחות קובעים תור לבד, מקבלים תזכורת, והיומן נשאר מסודר.",
      href: "/services/appointment-system/",
      art: "brass-clockwork",
    },
    {
      name: "בניית אתרים מקצועיים",
      line: "אתר מלא מהסקיצה ועד ההשקה, מהיר ונגיש בכל מסך.",
      href: "/services/web-development/",
      art: "mobius-brick",
    },
    {
      name: "פיתוח אתרים",
      line: "מערכות, חיבורים ולוגיקה, על בסיס קוד שמחזיק שנים.",
      href: "/services/website-development/",
      art: "shell-staircases",
    },
    {
      name: "שיפור מהירות אתר",
      line: "מאתרים מה מאט את האתר ומתקנים, כדי שגולשים לא יוותרו בדרך.",
      href: "/services/website-performance/",
      art: "lime-prism",
    },
  ],
  allLink: { label: "לכל השירותים", href: "/services/" },
};

export const processSteps = {
  eyebrow: "התהליך",
  room: "אולם 02",
  title: "איך נבנה אתר אצלנו",
  lede: "ארבעה שלבים ברורים. בכל אחד מהם אתם רואים, מאשרים ויודעים מה הלאה.",
  steps: [
    {
      name: "אפיון",
      body: "מכירים את העסק, את הלקוחות ואת המטרה, ומשרטטים מבנה ברור לאתר: אילו עמודים, מה בכל עמוד, ומה הגולש צריך לעשות.",
      art: "marble-maze",
    },
    {
      name: "עיצוב",
      body: "מעצבים שפה חזותית שמתאימה לכם: טיפוגרפיה, צבע וקומפוזיציה. קודם במובייל, ורק אחרי שאישרתם ממשיכים הלאה.",
      art: "kinetic-balance",
    },
    {
      name: "פיתוח",
      body: "כותבים קוד נקי ומהיר, ובודקים נגישות, מהירות ותצוגה בכל מסך לפני שמשהו עולה לאוויר.",
      art: "indigo-loom",
    },
    {
      name: "השקה וליווי",
      body: "מעלים לאוויר, מחברים לכלים של גוגל, ונשארים זמינים לתחזוקה, לשאלות ולשיפורים.",
      art: "amber-sun-stair",
    },
  ],
};

export const collection = {
  eyebrow: "עבודות",
  room: "אולם 03",
  title: "מהאוסף שלנו",
  lede: "אתרים אמיתיים של עסקים אמיתיים. כל אחד מהם נבנה מאפס, לפי העסק שעומד מאחוריו.",
  visit: "לאתר",
  /** Museum-label words. */
  fieldLabel: "תחום",
  pairNote: "מחשב ונייד",
  allLink: { label: "לכל העבודות", href: "/projects/" },
};

export const manifesto = {
  eyebrow: "מניפסט",
  room: "אולם 04",
  /** One sentence, set as lines (the kinetic composition) followed by the accent word.
   *  Each line is split into phone segments: on phones every segment is its own drifting
   *  line (two or three words, never one alone); from 768px the segments of a line join. */
  lines: [
    ["אתר טוב נבנה", "כמו יצירה:"],
    ["מתכננים, מוחקים,"],
    ["מדייקים, ותולים", "על הקיר"],
    ["רק כשכל", "פרט"],
  ],
  accent: "במקומו.",
  signature: "צבי משה",
  signatureRole: "מייסד",
  /** A detail of one piece, hung beside the sentence. */
  detail: {
    slug: "obsidian-tear",
    prefix: "פרט",
    medium: "טיפה אחת, מלוטשת עד הסוף · מה שנשאר כשמורידים כל עודף",
  },
};

export const magazine = {
  eyebrow: "מגזין",
  room: "אולם 06",
  title: "מהמגזין",
  lede: "מדריכים קצרים וברורים על אתרים, קידום וכלים לעסקים.",
  /** Masthead line beside the title. */
  masthead: "המגזין של NZ-web",
  leadLabel: "המאמר האחרון",
  readMore: "לקריאה",
  allLink: { label: "לכל המאמרים", href: "/blog/" },
};

export const faqBlock = {
  eyebrow: "שאלות נפוצות",
  room: "אולם 07",
  title: "שאלות על התהליך וההצעה",
  lede: "תשובות קצרות על ההצעה, על שלבי העבודה ועל מה שקורה אחרי ההשקה.",
  allLink: { label: "לכל השאלות", href: "/faq/" },
  nudge: {
    title: "לא מצאתם את התשובה?",
    body: "כתבו לנו בוואטסאפ, ונחזור אליכם עם תשובה ברורה.",
    cta: "לשאול בוואטסאפ",
    message: "היי, הגעתי מהאתר של NZ-web ויש לי שאלה:",
  },
};

export const finalCta = {
  eyebrow: "המסך עולה",
  room: "אולם 08",
  title: "הקיר הבא בגלריה שמור לעסק שלכם.",
  body: "ספרו לנו בכמה מילים על העסק ועל מה שאתם צריכים. נחזור אליכם עם רעיון ראשון והצעה מסודרת.",
  cta: "לשיחה בוואטסאפ",
  message: "היי, הגעתי מהאתר של NZ-web ואשמח לדבר על אתר לעסק שלי.",
};

/** Home-only wording for the offer room (the shared copy lives in src/content/offer.ts). */
export const offerHome = {
  room: "אולם 05",
  /** The catalogue promises nothing to "choose" here: it lists what a site can include. */
  scopeTitle: "מה אפשר לכלול באתר",
  /** One field label over the four stages on the ticket (instead of numbered fields). */
  stagesLabel: "מסלול הביקור",
  /** The stub hangs to the side from 768px, under the ticket on phones. */
  tearHint: "משכו את הספח הצידה: המנוי לבחירתכם",
  tearHintPhone: "משכו את הספח למטה או הצידה: המנוי לבחירתכם",
};
