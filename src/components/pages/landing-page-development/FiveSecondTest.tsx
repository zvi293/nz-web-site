// Signature component: מבחן חמש השניות — timed recall
import { useEffect, useRef, useState } from "react";
import "./five-second.css";

/**
 * "מבחן חמש השניות" — clarity made tangible. A landing page opens in the frame for five seconds,
 * the shutter drops, and the visitor is asked what it offered. Round 1 is a busy page (vague
 * headline, three offers, a popup); round 2 is the same business on a clear page. The verdict
 * after each round says why it was hard or easy; the summary lists what the clear page did.
 *
 * - Timer: one setTimeout chain per showing (5 → 0), cleared on unmount / phase change. The bar
 *   under the frame is a CSS animation (linear, 5s); reduced motion: no bar animation, the
 *   numeral still counts.
 * - Keyboard / SR: real buttons; focus moves to the question, the verdict, the summary and (round
 *   2 / restart) the intro heading; aria-live announces the phase. After answering, "לראות את הדף
 *   שוב" opens the page with no timer.
 * - Phones: every phase change brings the exhibit's top under the header (scrollIntoView), and
 *   while the page is closed (question / verdict) the frame folds to a short shutter strip, so the
 *   four answers and the verdict sit in one screen with the shutter. Peeking unfolds it in view.
 * - SSR / no JS: the end state as a static figure (.fsec__static) — both pages side by side and
 *   the three lessons; the live test is hidden until JS runs (html.js).
 */
type Phase = "intro" | "show" | "ask" | "verdict" | "done";

const OPTIONS = [
  { id: "ac", label: "ניקוי מזגנים בבית" },
  { id: "shop", label: "חנות למוצרי חשמל" },
  { id: "purify", label: "מערכות לטיהור אוויר לעסקים" },
  { id: "none", label: "לא הספקתי להבין" },
];
const RIGHT = "ac";

const VERDICT: Record<string, { right: [string, string]; wrong: [string, string]; none?: [string, string] }> = {
  "0": {
    right: [
      "זיהיתם, אבל עבדתם בשביל זה",
      "הכותרת דיברה על \"פתרונות מתקדמים\", ההצעה האמיתית הסתתרה בכרטיס השלישי וחלון קופץ כיסה חלק מהמסך. מבקר שהגיע ממודעה לא מתאמץ ככה. הוא חוזר אחורה.",
    ],
    wrong: [
      "בדיוק כך מרגיש מבקר אמיתי",
      "הדף הציע ניקוי מזגנים בבית, אבל זה הופיע רק בכרטיס השלישי. הכותרת דיברה על \"פתרונות מתקדמים\", היו שלוש הצעות ושלושה כפתורים, וחלון קופץ כיסה את המסך.",
    ],
  },
  "1": {
    right: [
      "חמש שניות הספיקו",
      "הכותרת אמרה מה מציעים ולמי, התמונה הראתה את הדבר עצמו והיה כפתור אחד. אותו עסק, אותה הצעה: רק הדף השתנה.",
    ],
    wrong: [
      "הפעם זה היה כתוב בכותרת",
      "הדף הזה הציע ניקוי מזגנים בבית: זה כתוב בכותרת, בשורה שמתחתיה ועל הכפתור. אם בכל זאת נקלטה הצעה אחרת, גם הכותרת הזאת צריכה ליטוש, ובדיוק בשביל זה מריצים את הבדיקה לפני השקה.",
    ],
    none: [
      "חמש שניות הן מעט, וזה כל העניין",
      "הדף הזה הציע ניקוי מזגנים בבית, בכותרת ועל הכפתור. אם גם כאן לא הספקתם, כדאי לקצר עוד: פחות מילים בכותרת ותמונה שמספרת את הסיפור לבד.",
    ],
  },
};

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

/** Round 1: the busy page. Drawn in container units (fsec-pg). */
function BusyPage() {
  return (
    <div className="fsec-pg fsec-pg--busy">
      <div className="fsec-pg__nav">
        <span className="fsec-pg__logo">אוויר נקי</span>
        <span className="fsec-pg__menu">
          <span>ראשי</span>
          <span>אודות</span>
          <span>שירותים</span>
          <span>מוצרים</span>
          <span>בלוג</span>
          <span>צור קשר</span>
        </span>
      </div>
      <div className="fsec-pg__banner">
        <span className="fsec-pg__bh">פתרונות מתקדמים לאיכות האוויר שלכם</span>
        <span className="fsec-pg__bs">מעל ומעבר לציפיות, בכל מקום ובכל זמן</span>
        <span className="fsec-pg__brow">
          <span className="fsec-pg__chip">לפרטים</span>
          <span className="fsec-pg__chip fsec-pg__chip--o">לחנות</span>
        </span>
        <span className="fsec-pg__dots" />
      </div>
      <div className="fsec-pg__cards">
        <span className="fsec-pg__card">
          <b>מטהרי אוויר</b>
          <span>קראו עוד</span>
        </span>
        <span className="fsec-pg__card">
          <b>מערכות חימום</b>
          <span>קראו עוד</span>
        </span>
        <span className="fsec-pg__card">
          <b>שירות מזגנים</b>
          <span>קראו עוד</span>
        </span>
      </div>
      <span className="fsec-pg__lines" />
      <span className="fsec-pg__popup">
        <span className="fsec-pg__x">×</span>
        <b>רגע לפני שהולכים!</b>
        <span>הירשמו לניוזלטר וקבלו הטבה</span>
        <span className="fsec-pg__chip">להרשמה</span>
      </span>
      <span className="fsec-pg__chat">צ׳אט</span>
    </div>
  );
}

/** Round 2: the same business, a clear page. */
function ClearPage() {
  return (
    <div className="fsec-pg fsec-pg--clear">
      <div className="fsec-pg__top">
        <span className="fsec-pg__logo">אוויר נקי</span>
        <span className="fsec-pg__call">חיוג</span>
      </div>
      <span className="fsec-pg__kick">ניקוי מזגנים</span>
      <span className="fsec-pg__h">ניקוי מזגנים בבית, ביום שנוח לכם</span>
      <span className="fsec-pg__sub">טכנאי מגיע עם כיסוי לרצפה, מנקה מסננים ומאוורר ובודק שהמזגן מקרר כמו שצריך.</span>
      <span className="fsec-pg__cta">לתאם ניקוי</span>
      <span className="fsec-pg__wa">או לשלוח הודעה בוואטסאפ</span>
      <svg className="fsec-pg__art" viewBox="0 0 300 120" aria-hidden="true" focusable="false">
        <rect width="300" height="120" fill="#E6DFD4" />
        <rect x="60" y="22" width="180" height="46" rx="8" fill="#F8F6F2" stroke="#57524B" strokeWidth="2" />
        <path d="M74 54h152" stroke="#57524B" strokeWidth="2" />
        <path d="M78 60h144" stroke="#A8A097" strokeWidth="2" />
        <circle cx="222" cy="36" r="3" fill="#E0401F" />
        <path d="M96 80c6 8 -6 14 0 22M150 80c6 8 -6 14 0 22M204 80c6 8 -6 14 0 22" stroke="#57524B" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const FiveSecondTest = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [left, setLeft] = useState(5);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
  const [peek, setPeek] = useState(false);
  const [shows, setShows] = useState(0); // bumps per showing → restarts the bar animation
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLHeadingElement>(null);
  const acted = useRef(false); // no focus / scroll moves before the visitor's first press
  const askRef = useRef<HTMLHeadingElement>(null);
  const verdictRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  /* The five seconds. */
  useEffect(() => {
    if (phase !== "show") return;
    if (left <= 0) {
      setPhase("ask");
      return;
    }
    const t = window.setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  /* Bring the exhibit into view (phones: its top under the header), then move focus. */
  const bring = (target?: HTMLElement | null) => {
    const root = rootRef.current;
    if (root && typeof window !== "undefined") {
      const phone = window.matchMedia("(max-width: 1023px)").matches;
      const r = root.getBoundingClientRect();
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
      const off = phone ? Math.abs(r.top - header - 12) > 24 : r.top < header || r.bottom > window.innerHeight;
      if (off) root.scrollIntoView({ block: phone ? "start" : "nearest", behavior: motionOn() ? "smooth" : "auto" });
    }
    target?.focus({ preventScroll: true });
  };

  /* Focus follows the conversation. */
  useEffect(() => {
    if (!acted.current) return;
    if (phase === "show") bring(null);
    if (phase === "ask") bring(askRef.current);
    if (phase === "verdict") bring(verdictRef.current);
    if (phase === "done") bring(doneRef.current);
    if (phase === "intro") bring(introRef.current);
  }, [phase, round]);

  /* Peeking unfolds the frame: keep it in view. */
  useEffect(() => {
    if (peek) bring(null);
  }, [peek]);

  const start = () => {
    acted.current = true;
    setPeek(false);
    setLeft(5);
    setShows((n) => n + 1);
    setPhase("show");
  };
  const answer = (id: string) => {
    setAnswers((a) => a.map((v, i) => (i === round ? id : v)));
    setPhase("verdict");
  };
  const next = () => {
    if (round === 0) {
      setRound(1);
      setPeek(false);
      setPhase("intro");
    } else {
      setPeek(false);
      setPhase("done");
    }
  };
  const restart = () => {
    acted.current = true;
    setRound(0);
    setAnswers([null, null]);
    setPeek(false);
    setPhase("intro");
  };

  const open = phase === "show" || peek || phase === "done";
  const a = answers[round];
  const ok = a === RIGHT;
  const vr = VERDICT[String(round)];
  const v = ok ? vr.right : a === "none" && vr.none ? vr.none : vr.wrong;
  const busy = round === 0 && phase !== "done";

  const lessons = (
    <ol className="fsec__lessons">
      <li>הכותרת אומרת מה מציעים, במילים של הלקוח.</li>
      <li>תמונה של השירות עצמו, לא אווירה כללית.</li>
      <li>כפתור אחד, בלי חלונות קופצים ובלי תפריט.</li>
    </ol>
  );

  return (
    <div ref={rootRef} className={`fsec fsec--${phase}` + (open ? " is-open" : "")} data-round={round}>
      <div className="fsec__stage">
        <div className="fsec__frame">
          <div className="fsec__screen" aria-hidden={!open}>
            {phase === "done" ? (
              <div className="fsec__pair">
                <div className="fsec__mini">
                  <BusyPage />
                </div>
                <div className="fsec__mini">
                  <ClearPage />
                </div>
              </div>
            ) : busy ? (
              <BusyPage />
            ) : (
              <ClearPage />
            )}
          </div>
          <div className="fsec__shutter" aria-hidden="true">
            <span className="fsec__shutter-plate">
              <span className="fsec__shutter-n">{round + 1}</span>
              <span className="fsec__shutter-k">{phase === "ask" || phase === "verdict" ? "המסך נסגר" : `סבב ${round + 1} מתוך 2 · חמש שניות`}</span>
            </span>
            <svg className="fsec__plane" viewBox="0 0 64 40" aria-hidden="true">
              <path d="M2 22 62 2 30 38 26 26Z" fill="var(--vermilion)" />
              <path d="M26 26 62 2 18 24Z" fill="#9f2a14" />
            </svg>
          </div>
        </div>
        <div className="fsec__timer" aria-hidden="true">
          <span key={shows} className={"fsec__bar" + (phase === "show" ? " is-running" : "")} />
        </div>
      </div>

      <div className="fsec__panel">
        <p className="nz-sr" aria-live="polite">
          {phase === "show" ? "הדף מוצג לחמש שניות." : phase === "ask" ? "הדף נסגר. מה הוא הציע?" : ""}
        </p>

        {phase === "intro" && (
          <div className="fsec__step">
            <p className="fsec__k">
              <span className="fsec__k-n">סבב {round + 1} מתוך 2</span>
              <span>{round === 0 ? "דף נחיתה של עסק" : "אותו עסק, דף אחר"}</span>
            </p>
            <h3 className="fsec__t" ref={introRef} tabIndex={-1}>
              {round === 0 ? "יש לכם חמש שניות" : "עוד פעם, חמש שניות"}
            </h3>
            <p className="fsec__p">
              {round === 0
                ? "דף נחיתה ייפתח במסגרת לחמש שניות, ואז ייסגר. אל תתכוננו: כך בדיוק מבקר שהגיע ממודעה פוגש דף. אחר כך נשאל מה הדף הציע."
                : "אותו עסק ואותה הצעה, בדף שנבנה סביב שאלה אחת: מה המבקר צריך להבין בשנייה הראשונה. שוב חמש שניות, שוב אותה שאלה."}
            </p>
            <button type="button" className="nz-btn nz-btn--primary nz-btn--md fsec__go" onClick={start}>
              <span>{round === 0 ? "לפתוח את הדף" : "לפתוח את הדף השני"}</span>
            </button>
          </div>
        )}

        {phase === "show" && (
          <div className="fsec__step fsec__count">
            <span className="fsec__num" aria-hidden="true">{left}</span>
            <p className="fsec__p">מסתכלים. בעוד רגע המסך נסגר.</p>
          </div>
        )}

        {phase === "ask" && (
          <div className="fsec__step">
            <p className="fsec__k">
              <span className="fsec__k-n">סבב {round + 1} מתוך 2</span>
              <span>הדף נסגר</span>
            </p>
            <h3 className="fsec__t" ref={askRef} tabIndex={-1} id="fsec-q">
              מה הדף הציע?
            </h3>
            <div className="fsec__opts" role="group" aria-labelledby="fsec-q">
              {OPTIONS.map((o) => (
                <button key={o.id} type="button" className="fsec__opt" onClick={() => answer(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "verdict" && (
          <div className="fsec__step">
            <p className={"fsec__tag" + (ok ? " is-ok" : "")}>
              <span className="fsec__tag-dot" aria-hidden="true" />
              {ok ? "זיהיתם נכון" : a === "none" ? "לא הספקתם להבין" : "לא זה מה שהוצע"}
            </p>
            <h3 className="fsec__t" ref={verdictRef} tabIndex={-1}>
              {v[0]}
            </h3>
            <p className="fsec__p">{v[1]}</p>
            <div className="fsec__row">
              <button type="button" className="nz-btn nz-btn--primary nz-btn--md" onClick={next}>
                <span>{round === 0 ? "לסבב 2: אותו עסק, דף ברור" : "לסיכום"}</span>
              </button>
              <button type="button" className="fsec__quiet" aria-pressed={peek} onClick={() => setPeek((p) => !p)}>
                {peek ? "לסגור את הדף" : "לראות את הדף שוב"}
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="fsec__step">
            <p className="fsec__k">
              <span className="fsec__k-n">סיכום</span>
              <span>שני דפים, עסק אחד</span>
            </p>
            <h3 className="fsec__t" ref={doneRef} tabIndex={-1}>
              מה עשה הדף הברור
            </h3>
            <ul className="fsec__sum">
              <li>
                <span className="fsec__sum-k">סבב 1 · דף עמוס</span>
                <span>{answers[0] === RIGHT ? "זוהה, במאמץ" : "לא זוהה"}</span>
              </li>
              <li>
                <span className="fsec__sum-k">סבב 2 · דף ברור</span>
                <span>{answers[1] === RIGHT ? "זוהה מיד" : "לא זוהה"}</span>
              </li>
            </ul>
            {lessons}
            <button type="button" className="fsec__quiet" onClick={restart}>
              להתחיל מחדש
            </button>
          </div>
        )}
      </div>

      {/* no JS: the end of the test as a still — both pages and what the clear one did */}
      <figure className="fsec__static">
        <div className="fsec__frame fsec__frame--still">
          <div className="fsec__pair">
            <div className="fsec__mini">
              <BusyPage />
            </div>
            <div className="fsec__mini">
              <ClearPage />
            </div>
          </div>
        </div>
        <figcaption className="fsec__step">
          <p className="fsec__k">
            <span className="fsec__k-n">שני דפים, עסק אחד</span>
            <span>מימין הדף העמוס, משמאל הדף הברור</span>
          </p>
          <p className="fsec__t">מה עשה הדף הברור</p>
          {lessons}
        </figcaption>
      </figure>
    </div>
  );
};

export default FiveSecondTest;
