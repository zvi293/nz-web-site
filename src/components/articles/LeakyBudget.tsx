// Signature component: הדלי הדולף — plug the leaks (tap holes in a leaking vessel)
import { useRef, useState } from "react";
import { useInView } from "./useInView";
import "./LeakyBudget.css";

/**
 * "The leaking bucket" (landing-page-cost). The ad pours paid clicks into a vessel (the landing
 * page); what reaches the bowl under it are enquiries. Six holes in the walls leak clicks away,
 * each one a scope factor from the article (speed, message, structure, one action, design,
 * measurement). Tap a hole on the vessel, or its line in the list, to plug it: a cork goes in,
 * that stream stops and the bowl fills a little more. The list says what leaks and, once
 * plugged, which part of the work stops it. No numbers and no money anywhere: the point is
 * that scope is what stops the budget leaking. Streams are CSS dash animations, paused
 * off-screen and static with reduced motion. aria-pressed holes + an aria-live line.
 * No JS: the six leaks and their plugs are listed.
 */

interface Hole {
  title: string;
  leak: string;
  plug: string;
  x: number;
  y: number;
  side: "l" | "r";
}

const HOLES: Hole[] = [
  { title: "מהירות", leak: "הדף נטען לאט בנייד, והגולש חוזר אחורה לפני שראה משהו.", plug: "עבודת מהירות: תמונות קלות, מעט קוד, בלי תוספים כבדים.", x: 63, y: 110, side: "l" },
  { title: "המשך המסר", leak: "הכותרת לא ממשיכה את מה שהמודעה הבטיחה.", plug: "כתיבת מסר שממשיך בדיוק את המודעה.", x: 234.5, y: 140, side: "r" },
  { title: "מבנה ואורך", leak: "ההתלבטויות של הלקוח נשארות בלי תשובה.", plug: "מבנה שעונה על השאלות לפי הסדר שבו הן עולות.", x: 68, y: 175, side: "l" },
  { title: "פעולה אחת", leak: "עשרה כפתורים לעשרה כיוונים, והגולש מתבלבל ויוצא.", plug: "קריאה אחת ברורה לפעולה, וטופס או וואטסאפ קצרים.", x: 229, y: 210, side: "r" },
  { title: "עיצוב", leak: "הדף נראה כמו עוד תבנית, ולא כמו העסק שלכם.", plug: "עיצוב שנבנה למותג ולקהל שלכם.", x: 73.5, y: 245, side: "l" },
  { title: "מדידה וחיבורים", leak: "פניות נכנסות ולא מגיעות לאף אחד, ואין דרך לדעת מה עובד.", plug: "חיבור למדידה ולמערכת שמקבלת את הפניות.", x: 224, y: 280, side: "r" },
];

const W = 300;
const H = 390;

function sprayPath(h: Hole) {
  const d = h.side === "l" ? -1 : 1;
  return `M${h.x} ${h.y} Q${h.x + d * 34} ${h.y - 6} ${h.x + d * 44} ${h.y + 46} T${h.x + d * 52} ${H - 6}`;
}

const LeakyBudget = () => {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const [plugged, setPlugged] = useState<boolean[]>(() => HOLES.map(() => false));
  const [say, setSay] = useState("");
  const n = plugged.filter(Boolean).length;
  const all = n === HOLES.length;
  const level = 0.18 + (0.82 * n) / HOLES.length;

  const toggle = (i: number) => {
    const next = [...plugged];
    next[i] = !next[i];
    setPlugged(next);
    const left = next.filter((p) => !p).length;
    const h = HOLES[i];
    setSay(
      next[i]
        ? `נסתם: ${h.title}. ${h.plug} ${left ? `נשארו ${left} חורים.` : "הדף לא דולף יותר."}`
        : `נפתח שוב: ${h.title}. ${h.leak}`,
    );
  };

  return (
    <div className={`as-lb${inView ? "" : " is-paused"}${all ? " is-sealed" : ""}`} ref={root}>
      <ol className="as-static">
        {HOLES.map((h) => (
          <li key={h.title}>
            <p className="as-static__q">{h.title}: {h.leak}</p>
            <p className="as-static__a">
              <strong>מה סותם את זה:</strong> {h.plug}
            </p>
          </li>
        ))}
      </ol>

      <div className="as-lb__live as-live">
        <div className="as-lb__stage">
          <svg className="as-lb__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <g className="as-lb__spout">
              <rect x="96" y="6" width="108" height="34" rx="17" />
              <text x="150" y="28" textAnchor="middle">המודעה</text>
            </g>
            <path className="as-lb__stream" d="M150 40 L150 318" />
            <path className="as-lb__glass" d="M60 70 L240 70 L222 300 Q220 312 208 312 L92 312 Q80 312 78 300 Z" />
            <path className="as-lb__water" d="M62.6 96 L237.4 96 L222 300 Q220 312 208 312 L92 312 Q80 312 78 300 Z" />
            <path className="as-lb__rim" d="M52 70 L248 70" />
            {HOLES.map((h, i) =>
              plugged[i] ? null : <path key={i} className="as-lb__spray" d={sprayPath(h)} style={{ animationDelay: `${-i * 0.23}s` }} />,
            )}
            <path className="as-lb__pipe" d="M150 312 L150 336" />
            <g className="as-lb__bowl">
              <clipPath id="as-lb-bowl">
                <path d="M84 336 L216 336 Q214 382 150 382 Q86 382 84 336 Z" />
              </clipPath>
              <g clipPath="url(#as-lb-bowl)">
                <rect className="as-lb__fill" x="80" y="336" width="140" height="48" style={{ transform: `scaleY(${level})` }} />
              </g>
              <path className="as-lb__bowl-line" d="M84 336 L216 336 Q214 382 150 382 Q86 382 84 336 Z" />
              <text className="as-lb__bowl-label" x="254" y="366" textAnchor="middle">פניות</text>
            </g>
          </svg>
          {HOLES.map((h, i) => (
            <button
              key={h.title}
              type="button"
              className={`as-lb__hole${plugged[i] ? " is-plugged" : ""}`}
              style={{ insetInlineStart: `${(1 - h.x / W) * 100}%`, top: `${(h.y / H) * 100}%` }}
              aria-pressed={plugged[i]}
              aria-label={`${h.title}: ${plugged[i] ? "נסתם" : h.leak}`}
              onClick={() => toggle(i)}
            >
              <span className="as-lb__cork" aria-hidden="true">
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        <div className="as-lb__side">
          <ol className="as-lb__list">
            {HOLES.map((h, i) => (
              <li key={h.title}>
                <button type="button" className={`as-lb__row${plugged[i] ? " is-plugged" : ""}`} aria-pressed={plugged[i]} onClick={() => toggle(i)}>
                  <span className="as-lb__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="as-lb__t">
                    <span className="as-lb__title">{h.title}</span>
                    <span className="as-lb__line">{plugged[i] ? h.plug : h.leak}</span>
                  </span>
                  <span className="as-lb__state" aria-hidden="true">
                    {plugged[i] ? "נסתם" : "דולף"}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className={`as-lb__lesson${all ? " is-on" : ""}`}>
            {all
              ? "הדף שומר עכשיו על הקליקים ששילמתם עליהם. כל פקק כאן הוא חלק מההיקף, וההיקף הוא מה שקובע את ההצעה."
              : "בקמפיין משלמים על כל קליק, גם על מי שדלף החוצה. סתמו את החורים, וראו כמה מגיע לקערה."}
          </p>
          {n > 0 && (
            <button type="button" className="as-btn as-btn--quiet" onClick={() => { setPlugged(HOLES.map(() => false)); setSay("כל החורים פתוחים שוב."); }}>
              לפתוח הכול מחדש
            </button>
          )}
        </div>
        <p className="nz-sr" aria-live="polite">
          {say}
        </p>
      </div>
    </div>
  );
};

export default LeakyBudget;
