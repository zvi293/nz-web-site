/**
 * Article signature registry — one original interactive component per article (SITE-PLAYBOOK §9).
 *
 *   post.signature = "<key>"  (src/content/blog.ts)  →  mounted (client:visible) where the article's
 *   content has a "[[signature]]" line, or at the end of its 2nd H2 section.
 *
 * Add one: build src/components/articles/<Name>.tsx (first line:
 * "// Signature component: <name> — <model>"), add it here AND as one explicit branch in
 * ArticleSignature.astro (Astro needs a static import to hydrate it), and log it in the
 * playbook registry. Never reuse an interaction model already listed there.
 */
export interface SignatureMeta {
  key: string;
  /** Hebrew name, shown on the plate and in the summary card. */
  name: string;
  /** The interaction model (for the registry). */
  model: string;
  /** One line under the name: what to do. */
  hint: string;
}

export const ARTICLE_SIGNATURES: Record<string, SignatureMeta> = {
  "keyboard-run": {
    key: "keyboard-run",
    name: "מסע המקלדת",
    model: "real focus traversal (Tab / screen-reader swipe)",
    hint: "לחצו התחילו ועברו על עמוד לדוגמה עם המקלדת שלכם, או בהחלקה בטלפון כמו בקורא מסך. אחר כך נסו את הגרסה הלא נגישה.",
  },
  "quote-sorter": {
    key: "quote-sorter",
    name: "מבחן הציטוט",
    model: "two-bin triage",
    hint: "שישה משפטים מאתר לדוגמה. לכל אחד, החליטו: מנוע AI יצטט אותו או ידלג עליו?",
  },
  "store-compass": {
    key: "store-compass",
    name: "המצפן",
    model: "answers swing a gauge needle",
    hint: "ענו על שש שאלות קצרות, והמחוג יראה לאן העסק שלכם נוטה.",
  },
  "sharp-sentence": {
    key: "sharp-sentence",
    name: "המשפט החד",
    model: "tap-to-cycle words in place",
    hint: "הקישו על החלקים המסומנים במשפט והחליפו מילים כלליות במילים מדויקות.",
  },
  /* ── the ten older articles ── */
  "profile-blink": {
    key: "profile-blink",
    name: "אותו סיפור",
    model: "blink comparator (tap what jumps)",
    hint: "הכרטיס בגוגל והפוטר באתר מוצגים לסירוגין באותה מסגרת. מצאו את הפרטים שמשתנים ביניהם, והקישו עליהם כדי לתקן.",
  },
  "reminder-day": {
    key: "reminder-day",
    name: "היומן של מחר",
    model: "advance the clock (step a day, with a switch)",
    hint: "הדליקו או כבו את התזכורות, והזיזו את השעון ביום אחד של קליניקה לדוגמה. אותם לקוחות, שני סופים.",
  },
  "leaky-budget": {
    key: "leaky-budget",
    name: "הדלי הדולף",
    model: "plug the leaks (tap holes in a leaking vessel)",
    hint: "המודעה שופכת קליקים לתוך הדף. כל חור הוא גורם בהיקף העבודה: הקישו עליו כדי לסתום אותו, וראו כמה מגיע לקערה.",
  },
  "service-scissors": {
    key: "service-scissors",
    name: "המספריים",
    model: "cut along the dashed line (split one page into many)",
    hint: "שלושה שירותים דחוסים בעמוד אחד. גררו את המספריים לאורך הקו המקווקו, או הקישו עליהם, וראו מה משתנה בחיפוש.",
  },
  "folded-quote": {
    key: "folded-quote",
    name: "ההצעה המקופלת",
    model: "unfold a concertina (zigzag paper folds)",
    hint: "שתי הצעות עם אותה כותרת. פתחו את הקפלים אחד אחד, וראו מה כל אחת באמת כוללת.",
  },
  "exploded-stack": {
    key: "exploded-stack",
    name: "המבט המפורק",
    model: "pull a layer out of the stack (Jenga) and watch what breaks",
    hint: "בחרו WordPress או React. גררו שכבה הצידה, כמו אבן בג'נגה, או הקישו עליה, וראו מה נשבר באתר לדוגמה.",
  },
  "one-accent": {
    key: "one-accent",
    name: "צבע אחד",
    model: "give the single accent away (tap the one thing that may shout)",
    hint: "בעמוד הזה הכול צועק. יש לכם צבע הדגשה אחד לתת: הקישו על האלמנט שמגיע לו, וכל השאר ישתתקו.",
  },
  "root-dig": {
    key: "root-dig",
    name: "החפירה",
    model: "scratch-off (rub the soil away to uncover what lies under it)",
    hint: "מתחת לעץ יש שמונה חלקות אדמה. שפשפו אותן באצבע או בעכבר, או הקישו כדי לחפור, וגלו אילו שורשים מזינים את הדירוג ואילו כבר מתו.",
  },
  "load-waterfall": {
    key: "load-waterfall",
    name: "מפל הטעינה",
    model: "reschedule a waterfall by hand (drag each bar into its dashed slot)",
    hint: "כך נטען עמוד לדוגמה בנייד. גררו את הפסים של כל בעיה אל המתאר המקווקו שלהם, וראו מתי התוכן הראשי מופיע.",
  },
  "domino-chain": {
    key: "domino-chain",
    name: "שרשרת הדומינו",
    model: "chain reaction (knock one over, the ones that lean on it fall)",
    hint: "חמשת הדברים עומדים בשורה. הקישו על אחד כדי לדלג עליו, וראו מה נופל איתו.",
  },
};

export function getSignatureMeta(key: string | undefined | null): SignatureMeta | null {
  return key ? (ARTICLE_SIGNATURES[key] ?? null) : null;
}
