// Signature component: המצפן — answers swing a gauge needle
import { useId, useState } from "react";
import "./StoreCompass.css";

/**
 * "The compass" (business-website-or-online-store). Six short questions from the article, each a
 * group of native radio chips. Every answer pushes a brass needle on a half-dial between
 * "אתר תדמית" (start side) and "חנות אונליין" (end side); the middle arc is "באמצע". The reading
 * under the dial names the direction and what it usually means. Unanswered questions count as 0.
 * Keyboard: native radios (arrows within a group). aria-live reads the new direction.
 * No JS: the questions render (native radios work) with a short note on how to read the answers;
 * the needle rests at centre.
 * Phones: the dial + its reading form a compact bar that sticks under the header while the six
 * questions scroll beneath it, so every answer swings the needle in view; what the reading means
 * follows the last question. Desktop: the dial and its meaning stand beside the questions.
 */

interface Option {
  label: string;
  w: number;
}
interface Question {
  q: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    q: "איך הלקוח שלכם קונה היום?",
    options: [
      { label: "אחרי שיחה, פגישה או הצעה", w: -2 },
      { label: "בוחר מוצר ומשלם לבד", w: 2 },
    ],
  },
  {
    q: "המוצר או השירות מוגדר מראש?",
    options: [
      { label: "כל עסקה מותאמת אישית", w: -2 },
      { label: "חלק מוגדר, חלק בהתאמה", w: 0 },
      { label: "מוגדר מראש", w: 1 },
    ],
  },
  {
    q: "כמה מוצרים יש לכם?",
    options: [
      { label: "אין, אני מוכר שירות", w: -2 },
      { label: "כמה בודדים", w: 0 },
      { label: "עשרות ומעלה", w: 2 },
    ],
  },
  {
    q: "יש מי שיעדכן מלאי ומוצרים?",
    options: [
      { label: "אין לנו זמן לזה", w: -1 },
      { label: "כן, יש מי שיטפל", w: 1 },
    ],
  },
  {
    q: "יש לכם הסדר משלוחים או איסוף?",
    options: [
      { label: "עדיין לא", w: -1 },
      { label: "כן", w: 1 },
    ],
  },
  {
    q: "יש תקציב לשיווק שוטף?",
    options: [
      { label: "לא כרגע", w: -1 },
      { label: "כן", w: 1 },
    ],
  },
];

const MAX = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map((o) => Math.abs(o.w))), 0);

function reading(score: number, answered: number) {
  if (answered === 0)
    return { title: "המחוג באמצע", body: "ענו על השאלות, והמחוג יזוז לכיוון שמתאים לעסק שלכם." };
  if (score <= -4)
    return {
      title: "אתר תדמית",
      body: "המכירה שלכם נסגרת בשיחה. אתר שמסביר מי אתם ומביא פניות יעבוד בשבילכם טוב יותר מסל קניות.",
    };
  if (score >= 4)
    return {
      title: "חנות אונליין",
      body: "הלקוח יכול לבחור ולשלם לבד, ויש לכם על מה להישען בתפעול. כדאי לשקול חנות, עם תקציב לשיווק.",
    };
  return {
    title: "משהו באמצע",
    body: "אתר תדמית עם קטלוג והזמנה בוואטסאפ, מערכת לקביעת תורים או חנות קטנה. אפשר להתחיל שם ולהתרחב בהמשך.",
  };
}

const StoreCompass = () => {
  const id = useId();
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.reduce<number>((s, a, i) => (a === null ? s : s + QUESTIONS[i].options[a].w), 0);
  /* score < 0 → אתר תדמית (right, the RTL start side); score > 0 → חנות (left). ±3 stays in the middle arc. */
  const angle = Math.max(-82, Math.min(82, (score / MAX) * 90));
  const r = reading(score, answered);
  /* the needle points right for negative scores: in RTL the "start" is on the right */
  const needle = -angle;

  const pick = (qi: number, oi: number) => {
    const next = [...answers];
    next[qi] = oi;
    setAnswers(next);
  };

  return (
    <div className="as-cp">
      <div className="as-cp__head">
        <div className="as-cp__dial" aria-hidden="true">
          <svg viewBox="0 0 320 184" className="as-cp__svg" focusable="false">
            {/* arcs (physical): left = חנות, middle = באמצע, right = אתר תדמית (the RTL start side) */}
            <path d="M 30 160 A 130 130 0 0 1 95.0 47.4" className="as-cp__arc as-cp__arc--b" />
            <path d="M 95.0 47.4 A 130 130 0 0 1 225.0 47.4" className="as-cp__arc as-cp__arc--m" />
            <path d="M 225.0 47.4 A 130 130 0 0 1 290 160" className="as-cp__arc as-cp__arc--a" />
            {Array.from({ length: 19 }, (_, i) => {
              const a = Math.PI - (i * Math.PI) / 18;
              const r1 = i % 3 === 0 ? 112 : 118;
              return (
                <line
                  key={i}
                  x1={(160 + Math.cos(a) * r1).toFixed(2)}
                  y1={(160 - Math.sin(a) * r1).toFixed(2)}
                  x2={(160 + Math.cos(a) * 124).toFixed(2)}
                  y2={(160 - Math.sin(a) * 124).toFixed(2)}
                  className="as-cp__tick"
                />
              );
            })}
            <g className="as-cp__needle" style={{ transform: `rotate(${needle}deg)` }}>
              <path d="M160 160 L156 150 L160 44 L164 150 Z" />
            </g>
            <circle cx="160" cy="160" r="9" className="as-cp__hub" />
          </svg>
          <span className="as-cp__end as-cp__end--a">אתר תדמית</span>
          <span className="as-cp__end as-cp__end--m">באמצע</span>
          <span className="as-cp__end as-cp__end--b">חנות אונליין</span>
        </div>

        <div className="as-cp__reading">
          <p className="as-cp__reading-k">
            <span className="as-cp__count" dir="ltr">
              {answered}/{QUESTIONS.length}
            </span>{" "}
            תשובות{answered > 0 ? " · המחוג מצביע על" : ""}
          </p>
          <p key={r.title} className="as-cp__reading-title">{r.title}</p>
          <p className="as-cp__pips" aria-hidden="true">
            {answers.map((a, i) => (
              <span key={i} className={a !== null ? "is-on" : ""} />
            ))}
          </p>
        </div>
      </div>
      <p className="nz-sr" aria-live="polite">
        {answered > 0 ? `${answered} מתוך ${QUESTIONS.length} תשובות. המחוג מצביע על ${r.title}. ${r.body}` : ""}
      </p>

      <p className="as-static as-cp__static">
        בלי JavaScript המחוג לא זז, אבל אפשר לקרוא את התשובות כך: אם רוב מה שבחרתם הוא האפשרות הראשונה בכל שאלה,
        העסק נוטה לאתר תדמית. אם רובן האחרונות, לחנות אונליין. תערובת מצביעה על אחד מהפתרונות שבאמצע.
      </p>
      <ol className="as-cp__qs">
        {QUESTIONS.map((q, qi) => (
          <li key={q.q} className="as-cp__q">
            <fieldset>
              <legend>
                <span className="as-cp__qn" aria-hidden="true">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                {q.q}
              </legend>
              <div className="as-cp__opts">
                {q.options.map((o, oi) => (
                  <label key={o.label} className="as-chip">
                    <input
                      type="radio"
                      name={`${id}-q${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => pick(qi, oi)}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div className={`as-cp__verdict${answered === QUESTIONS.length ? " is-final" : ""}`}>
        <p className="as-cp__verdict-k">{answered === QUESTIONS.length ? "התשובה שלכם" : "מה זה אומר עד עכשיו"}</p>
        <p className="as-cp__verdict-title">{r.title}</p>
        <p className="as-cp__reading-body">{r.body}</p>
        {answered > 0 && (
          <button type="button" className="as-btn as-btn--quiet as-cp__reset" onClick={() => setAnswers(QUESTIONS.map(() => null))}>
            איפוס התשובות
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreCompass;
