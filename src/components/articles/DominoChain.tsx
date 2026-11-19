// Signature component: שרשרת הדומינו — knock one over, the ones that depend on it fall (chain reaction)
import { useState } from "react";
import "./DominoChain.css";

/**
 * "The domino chain" (5-things-before-building-website). The five things to settle before a
 * website stand as five ivory dominoes in a row, in the article's order, each with its number in
 * pips: goal, audience, scope, content, after launch. Tap one to skip it: it tips over and knocks
 * down every domino after it (a staggered CSS rotation from the base), because each later answer
 * leans on the earlier ones. The ledger beside the row says what falls with each one. Skip the
 * goal and everything falls; skip the last and only it does. Tap any fallen domino to stand the
 * row up again. Buttons with aria-labels, aria-live ledger; focus stays on the tapped tile.
 * Reduced motion: they lie down at once. No JS: the five questions and what each one holds up.
 */

interface Thing {
  short: string;
  q: string;
  falls: string;
}

const THINGS: Thing[] = [
  { short: "מטרה", q: "מה הפעולה העיקרית שהגולש צריך לעשות?", falls: "אין כפתור ראשי ואין מבנה שמוביל אליו, ואין דרך למדוד אם האתר עובד." },
  { short: "קהל", q: "מי הלקוח שהאתר מדבר אליו?", falls: "האתר מדבר לכולם, ולכן לאף אחד. הטון וסדר הדברים נקבעים בניחוש." },
  { short: "היקף", q: "מה חייב להיות בגרסה הראשונה, ומה יחכה?", falls: "ההצעה לא מדויקת, ובאמצע הדרך מגלים מה חסר." },
  { short: "תוכן", q: "מי מכין טקסטים ותמונות, ומתי?", falls: "העיצוב והפיתוח עומדים ומחכים לטקסטים, לתמונות ולאישורים." },
  { short: "אחרי ההשקה", q: "מי מאחסן, מי מעדכן, ועל שם מי הדומיין?", falls: "כשמשהו לא עובד, לא ברור מי מטפל, ואם הדומיין בכלל שלכם." },
];

const PIPS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8]];

const DominoChain = () => {
  const [from, setFrom] = useState<number | null>(null);
  const [say, setSay] = useState("");
  const fallen = (i: number) => from !== null && i >= from;

  const tap = (i: number) => {
    if (fallen(i)) {
      setFrom(null);
      setSay("כל החמישה עומדים שוב.");
      return;
    }
    setFrom(i);
    const n = THINGS.length - i;
    setSay(
      `דילגתם על ${THINGS[i].short}. ${n === 1 ? "נפל רק הוא." : `נפלו ${n} חלקים: ${THINGS.slice(i).map((t) => t.short).join(", ")}.`}`,
    );
  };

  const lesson =
    from === null
      ? "חמש תשובות שמחזיקות זו את זו. הקישו על דומינו כדי לדלג עליו, וראו מה נופל איתו."
      : from === 0
        ? "המטרה משפיעה על כל השאר. דילגתם עליה, וכל השרשרת נפלה."
        : from === THINGS.length - 1
          ? "רק האחרון נפל, כי שום דבר לא נשען עליו. אבל הוא זה שקובע מה קורה ביום שמשהו לא עובד."
          : `דילגתם על ${THINGS[from].short}, וכל מה שנשען עליו נפל איתו. מה שלפניו עדיין עומד.`;

  return (
    <div className={`as-dm${from !== null ? " is-fallen" : ""}`}>
      <ol className="as-static">
        {THINGS.map((t) => (
          <li key={t.short}>
            <p className="as-static__q">
              {t.short}: {t.q}
            </p>
            <p className="as-static__a">
              <strong>בלי תשובה:</strong> {t.falls}
            </p>
          </li>
        ))}
      </ol>

      <div className="as-dm__live as-live">
        <ol className="as-dm__row">
          {THINGS.map((t, i) => (
            <li key={t.short} className="as-dm__slot">
              <button
                type="button"
                className={`as-dm__tile${fallen(i) ? " is-down" : ""}${from === i ? " is-first" : ""}`}
                style={{ ["--d" as string]: from === null ? 0 : Math.max(0, i - from) }}
                aria-label={fallen(i) ? `${t.short}: נפל. הקישו כדי להקים את כולם` : `דלגו על ${t.short}`}
                onClick={() => tap(i)}
              >
                <span className="as-dm__pips" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, k) => (
                    <span key={k} className={PIPS[i].includes(k) ? "is-pip" : ""} />
                  ))}
                </span>
                <span className="as-dm__bar" aria-hidden="true" />
                <span className="as-dm__word" aria-hidden="true">
                  {t.short}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="as-dm__floor" aria-hidden="true" />

        <div className="as-dm__ledger">
          <ol className="as-dm__list">
            {THINGS.map((t, i) => (
              <li key={t.short} className={fallen(i) ? "is-down" : ""}>
                <span className="as-dm__n" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="as-dm__t">
                  <span className="as-dm__short">{t.short}</span>
                  <span className="as-dm__line">{fallen(i) ? t.falls : t.q}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className={`as-dm__lesson${from !== null ? " is-on" : ""}`}>{lesson}</p>
        </div>
        <p className="nz-sr" aria-live="polite">
          {say}
        </p>
      </div>
    </div>
  );
};

export default DominoChain;
