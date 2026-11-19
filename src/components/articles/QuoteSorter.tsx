// Signature component: מבחן הציטוט — two-bin triage
import { useRef, useState } from "react";

/**
 * "The quote test" (geo-ai-search-guide). Six sentences from an imaginary pilates studio's site.
 * For each, the reader decides: would an AI answer engine quote it, or skip it? The verdict and
 * the reason appear at once; the card drops into its bin (two piles that grow). At the end: a
 * score and the pattern behind the quotable ones. aria-live narrates every verdict.
 * Focus: after "next" it lands on the new card's first choice; at the end, on the score.
 * No JS: every sentence is listed with its verdict and reason (html:not(.js) fallback).
 */

interface Card {
  text: string;
  quotable: boolean;
  why: string;
}

const CARDS: Card[] = [
  {
    text: "אנחנו הכי טובים בעיר, עם יחס אישי לכל מתאמנת.",
    quotable: false,
    why: "סיסמה שכל מתחרה יכול לכתוב, בלי שום עובדה שאפשר לבדוק.",
  },
  {
    text: "שיעורי פילאטיס מכשירים בקבוצות של עד שישה משתתפים, בסטודיו ברחוב ביאליק ברמת גן.",
    quotable: true,
    why: "עונה על מה, איפה ואיך, ועומד בפני עצמו גם כשמצטטים אותו לבד.",
  },
  {
    text: "בואו לגלות עולם חדש של תנועה ואיכות חיים.",
    quotable: false,
    why: "נשמע טוב, אבל אין בו תשובה לאף שאלה.",
  },
  {
    text: "אפשר לקבוע שיעור ניסיון בוואטסאפ. מביאים בגדים נוחים ומגבת, וכל השאר נמצא בסטודיו.",
    quotable: true,
    why: "תשובה ישירה לשאלה שאנשים באמת שואלים: איך מתחילים ומה צריך להביא.",
  },
  {
    text: "כמו שכתבנו קודם, זה מתאים גם לכם.",
    quotable: false,
    why: "תלוי בהקשר: \"כמו שכתבנו\" ו\"זה\" לא מובנים כשהמשפט מופיע לבד בתשובה.",
  },
  {
    text: "השיעורים מתאימים גם אחרי לידה, באישור רופא, עם התאמה אישית של התרגילים.",
    quotable: true,
    why: "ספציפי וזהיר: אומר למי זה מתאים ובאיזה תנאי, בלי להבטיח תוצאות.",
  },
];

type Pick = boolean | null;

const QuoteSorter = () => {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Pick[]>(() => CARDS.map(() => null));
  const [announce, setAnnounce] = useState("");
  const nextRef = useRef<HTMLButtonElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const card = CARDS[index];
  const answered = picks[index] !== null && picks[index] !== undefined;
  const finished = index >= CARDS.length;
  const score = picks.filter((p, i) => p !== null && p === CARDS[i].quotable).length;

  const choose = (quotable: boolean) => {
    if (answered || finished) return;
    const next = [...picks];
    next[index] = quotable;
    setPicks(next);
    const right = quotable === card.quotable;
    setAnnounce(
      `${right ? "נכון." : "לא בדיוק."} ${card.quotable ? "מנוע AI יכול לצטט את המשפט הזה." : "מנוע AI ידלג על המשפט הזה."} ${card.why}`,
    );
    window.setTimeout(() => nextRef.current?.focus(), 0);
  };

  const advance = () => {
    const n = index + 1;
    setIndex(n);
    if (n >= CARDS.length) {
      const s = picks.filter((p, i) => p === CARDS[i].quotable).length;
      setAnnounce(`סיימתם. ${s} מתוך ${CARDS.length} נכונות.`);
    } else setAnnounce(`משפט ${n + 1} מתוך ${CARDS.length}: ${CARDS[n].text}`);
    window.setTimeout(() => (n >= CARDS.length ? resultRef.current : firstChoiceRef.current)?.focus(), 0);
  };

  const restart = () => {
    setIndex(0);
    setPicks(CARDS.map(() => null));
    setAnnounce(`משפט 1 מתוך ${CARDS.length}: ${CARDS[0].text}`);
    window.setTimeout(() => firstChoiceRef.current?.focus(), 0);
  };

  const pile = (quotable: boolean) =>
    CARDS.map((c, i) => ({ c, i })).filter(({ i }) => picks[i] === quotable);

  return (
    <div className="as-qs">
      <ol className="as-static as-qs__static">
        {CARDS.map((c) => (
          <li key={c.text}>
            <p className="as-static__q">{c.text}</p>
            <p className="as-static__a">
              <strong>{c.quotable ? "מנוע AI יכול לצטט אותו." : "מנוע AI ידלג עליו."}</strong> {c.why}
            </p>
          </li>
        ))}
      </ol>
      <div className="as-qs__deck as-live">
        {!finished && (
          <>
            <p className="as-qs__count">
              משפט {String(index + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
            </p>
            <div className="as-qs__stack">
              {CARDS.slice(index + 1, index + 3).map((c, k) => (
                <span key={c.text} className={`as-qs__ghost as-qs__ghost--${k + 1}`} aria-hidden="true" />
              ))}
              <blockquote
                key={index}
                className={`as-qs__card${answered ? (picks[index] === card.quotable ? " is-right" : " is-wrong") : ""}${answered ? (picks[index] ? " to-yes" : " to-no") : ""}`}
              >
                <p>{card.text}</p>
                <footer>מתוך אתר של סטודיו לדוגמה</footer>
              </blockquote>
            </div>

            {!answered ? (
              <div className="as-qs__choices" role="group" aria-label="מה יעשה מנוע AI עם המשפט?">
                <button ref={firstChoiceRef} type="button" className="as-btn as-btn--primary" onClick={() => choose(true)}>
                  יצטט אותו
                </button>
                <button type="button" className="as-btn" onClick={() => choose(false)}>
                  ידלג עליו
                </button>
              </div>
            ) : (
              <div className={`as-qs__verdict${picks[index] === card.quotable ? " is-right" : " is-wrong"}`}>
                <p className="as-qs__verdict-head">
                  <span className="as-qs__mark" aria-hidden="true" />
                  {picks[index] === card.quotable ? "נכון" : "לא בדיוק"}
                  <span className="as-qs__verdict-what">
                    {card.quotable ? " · ניתן לציטוט" : " · לא ניתן לציטוט"}
                  </span>
                </p>
                <p className="as-qs__why">{card.why}</p>
                <button ref={nextRef} type="button" className="as-btn as-btn--primary" onClick={advance}>
                  {index === CARDS.length - 1 ? "לתוצאה" : "למשפט הבא"}
                </button>
              </div>
            )}
          </>
        )}

        {finished && (
          <div className="as-qs__result">
            <p className="as-qs__score" ref={resultRef} tabIndex={-1} dir="ltr">
              <span className="as-qs__score-num">{score}</span>
              <span className="as-qs__score-of">/ {CARDS.length}</span>
            </p>
            <p className="as-qs__lesson">
              המשפטים שמנוע תשובות יכול לצטט דומים זה לזה: יש בהם עובדה, הם עונים על שאלה אחת, והם מובנים גם כשמוציאים אותם
              מהעמוד.
            </p>
            <button type="button" className="as-btn" onClick={restart}>
              עוד סיבוב
            </button>
          </div>
        )}
      </div>

      <div className="as-qs__bins as-live">
        {[true, false].map((q) => (
          <div key={String(q)} className={`as-qs__bin as-qs__bin--${q ? "yes" : "no"}`}>
            <p className="as-qs__bin-head">
              <span>{q ? "מצוטט" : "לא מצוטט"}</span>
              <span className="as-qs__bin-n">{pile(q).length}</span>
            </p>
            <ol className="as-qs__pile">
              {pile(q).map(({ c, i }) => (
                <li key={i} className={picks[i] === c.quotable ? "is-right" : "is-wrong"}>
                  {c.text}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default QuoteSorter;
