// Signature component: המשפט החד — tap-to-cycle words in place
import { useState } from "react";

/**
 * "The sharp sentence" (website-content-writing-guide). One opening sentence of an imaginary
 * air-conditioning technician's homepage, in three parts. Each part is a button inside the
 * sentence itself: tap it to swap the words for the next, more concrete version (3 levels).
 * Vague parts carry a proofreader's wavy underline; concrete parts are set solid. Beside it, a
 * "what the visitor now knows" ledger fills in and a focus scale moves from "מטושטש" to "חד".
 * aria-live reads the whole new sentence. No JS: the three versions of the sentence are listed
 * (html:not(.js) fallback) instead of the buttons.
 */

interface Slot {
  /** The question this part answers for the visitor. */
  asks: string;
  options: [string, string, string];
}

const SLOTS: Slot[] = [
  {
    asks: "מה אתם עושים?",
    options: ["אנחנו מציעים פתרונות מתקדמים", "אנחנו מתקנים מזגנים", "תיקון והתקנה של מזגנים ביתיים"],
  },
  {
    asks: "איפה ולמי?",
    options: ["לכל סוגי הלקוחות", "באזור המרכז", "לבתים פרטיים בפתח תקווה ובראש העין"],
  },
  {
    asks: "למה לפנות דווקא אליכם?",
    options: [
      "בשירות איכותי ואמין",
      "עם זמינות גבוהה",
      "ובתקלה דחופה שולחים תמונה בוואטסאפ ומתאמים הגעה",
    ],
  },
];

const LEVEL_WORD = ["לא ברור", "חלקית", "ברור"];

const SharpSentence = () => {
  const [levels, setLevels] = useState<number[]>(() => SLOTS.map(() => 0));
  const [announce, setAnnounce] = useState("");
  const total = levels.reduce((a, b) => a + b, 0);
  const max = SLOTS.length * 2;
  const sentence = (lv: number[]) => SLOTS.map((s, i) => s.options[lv[i]]).join(" ") + ".";

  const cycle = (i: number) => {
    const next = [...levels];
    next[i] = (next[i] + 1) % 3;
    setLevels(next);
    setAnnounce(`המשפט עכשיו: ${sentence(next)}`);
  };
  const sharpen = () => {
    const next = SLOTS.map(() => 2);
    setLevels(next);
    setAnnounce(`הגרסה החדה: ${sentence(next)}`);
  };
  const reset = () => {
    const next = SLOTS.map(() => 0);
    setLevels(next);
    setAnnounce(`חזרה למשפט הכללי: ${sentence(next)}`);
  };

  return (
    <div className="as-ss" style={{ ["--sharp" as string]: String(total / max) }}>
      <p className="as-ss__kicker">פתיחת עמוד הבית של טכנאי מזגנים לדוגמה</p>
      <ol className="as-static as-ss__static">
        {LEVEL_WORD.map((w, lv) => (
          <li key={w}>
            <strong>{["מטושטש", "חלקית", "חד"][lv]}:</strong> {sentence(SLOTS.map(() => lv))}
          </li>
        ))}
      </ol>
      <p className="as-ss__sentence as-live">
        {SLOTS.map((s, i) => (
          <span key={s.asks}>
            <button
              type="button"
              className={`as-ss__slot as-ss__slot--l${levels[i]}`}
              onClick={() => cycle(i)}
              aria-label={`${s.asks} כרגע: ${s.options[levels[i]]}. הקישו להחלפה`}
            >
              <span key={levels[i]} className="as-ss__words">
                {s.options[levels[i]]}
              </span>
              <span className="as-ss__dots" aria-hidden="true">
                {[0, 1, 2].map((d) => (
                  <span key={d} className={d <= levels[i] ? "is-on" : ""} />
                ))}
              </span>
            </button>
            {i < SLOTS.length - 1 ? " " : "."}
          </span>
        ))}
      </p>

      <div className="as-ss__meter as-live" aria-hidden="true">
        <span>מטושטש</span>
        <span className="as-ss__scale">
          <span className="as-ss__thumb" />
        </span>
        <span>חד</span>
      </div>

      <div className="as-ss__ledger as-live">
        <p className="as-ss__ledger-title">מה הגולש יודע אחרי משפט אחד</p>
        <dl>
        {SLOTS.map((s, i) => (
          <div key={s.asks} className={`as-ss__row as-ss__row--l${levels[i]}`}>
            <dt>{s.asks}</dt>
            <dd>
              <span className="as-ss__state" aria-hidden="true" />
              {LEVEL_WORD[levels[i]]}
            </dd>
          </div>
        ))}
        </dl>
      </div>

      <div className="as-ss__actions as-live">
        {total < max ? (
          <button type="button" className="as-btn as-btn--primary" onClick={sharpen}>
            הראו לי את הגרסה החדה
          </button>
        ) : (
          <p className="as-ss__done">שלושה פרטים, משפט אחד, והגולש כבר יודע אם הוא במקום הנכון.</p>
        )}
        {total > 0 && (
          <button type="button" className="as-btn as-btn--quiet" onClick={reset}>
            חזרה למשפט הכללי
          </button>
        )}
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default SharpSentence;
