// Signature component: סולם ההמרה — hand-over-hand climb (alternate two thumbs)
import { useEffect, useRef, useState } from "react";
import "./ladder.css";

/**
 * "סולם ההמרה" — help a visitor who clicked an ad climb a landing page, hand over hand. Two big
 * thumb buttons (יד ימין / יד שמאל) sit under the stage; each pull with the OTHER hand raises
 * the climber one rung. Every rung is one conversion principle: the card under the ladder
 * explains it and the sample landing page beside the ladder scrolls to the block where it
 * lives and lights it. Pulling twice with the same hand slips (no rung is skipped — the
 * lesson: a visitor does not skip steps either). The seventh pull reaches the coral light
 * ("פנייה") and the six principles are recapped.
 *
 * - Interaction model: alternating two-button rhythm. No scroll-telling, no sticky stage.
 * - Keyboard: the hands are real buttons (Tab / Enter / Space); ← and → also pull with the
 *   left / right hand while focus is inside the exhibit. aria-live announces every rung.
 * - SSR / no JS: the final state — CSS stands the climber at the top (html:not(.js)), the six
 *   principles are a readable list (.ldr__static) and the hand buttons are hidden.
 * - Reduced motion: the same climb with no transitions (the climber and the page jump).
 */
const RUNGS = [
  {
    name: "מסר תואם",
    title: "הכותרת ממשיכה את המודעה",
    body: "מי שלחץ על \"שיעורי שחייה לילדים\" צריך לראות בראש הדף את אותן מילים. כך הוא יודע בתוך רגע שהגיע למקום הנכון, ולא לוחץ על \"חזרה\".",
    where: "הכותרת",
  },
  {
    name: "הצעה אחת",
    title: "מה מקבלים, ומה עושים עכשיו",
    body: "המסך הראשון אומר מה ההצעה ומציג כפתור אחד. כשיש בדף שלוש הצעות ושלושה כפתורים, הרבה מבקרים לא בוחרים באף אחד מהם.",
    where: "שורת ההצעה והכפתור",
  },
  {
    name: "מראים, לא מתארים",
    title: "תמונה של הדבר עצמו",
    body: "צילום אמיתי של המקום, המוצר או התוצאה מסביר מהר יותר מפסקה שלמה. תמונת מאגר נראית כמו עוד פרסומת, והמבקר מרגיש את זה.",
    where: "התמונה",
  },
  {
    name: "הוכחה שאפשר לבדוק",
    title: "שם, כתובת, אנשים אמיתיים",
    body: "פרטים שאפשר לאמת בונים אמון: מי המדריך, איפה הבריכה ואיך נראה שיעור ראשון. כוכבים ומספרים עגולים בלי מקור עושים את ההפך.",
    where: "פרטי בית הספר",
  },
  {
    name: "מענה לחשש",
    title: "התשובה לפני השאלה",
    body: "כל הצעה מעוררת חשש אחד שעוצר את היד מלחיצה. כשהדף עונה עליו רגע לפני הטופס, המבקר לא צריך לשאול, ולא צריך לדחות למחר.",
    where: "שאלה ותשובה",
  },
  {
    name: "פעולה אחת קצרה",
    title: "שני שדות, או וואטסאפ",
    body: "שם וטלפון, או הודעה בלחיצה. כל שדה נוסף הוא עוד סיבה לעצור באמצע. ומי ששלח רואה מיד מה קורה עכשיו ומתי יחזרו אליו.",
    where: "הטופס",
  },
];
const N = RUNGS.length;
const TOP = N + 1; // level 0 = the ground (the click), 1–6 = rungs, 7 = the light
type Hand = "r" | "l";
const pad = (n: number) => String(n).padStart(2, "0");

/** The sample landing page: six blocks, top to bottom, one per rung. */
function SamplePage({ active }: { active: number }) {
  const on = (i: number) => (i === active ? " is-on" : i < active ? " is-past" : "");
  return (
    <>
      <div className={"ldr-pg__b ldr-pg__head" + on(0)} data-b="0">
        <span className="ldr-pg__brand">בית ספר לשחייה גלים</span>
        <span className="ldr-pg__kicker">קבוצות קטנות · גילאי 4–10</span>
        <span className="ldr-pg__h">שיעורי שחייה לילדים, בבריכה מקורה ליד הבית</span>
      </div>
      <div className={"ldr-pg__b ldr-pg__offer" + on(1)} data-b="1">
        <span className="ldr-pg__p">שיעור ראשון במים רדודים, עם מדריך אחד לכל ארבעה ילדים.</span>
        <span className="ldr-pg__btn">לשריין שיעור ראשון</span>
      </div>
      <div className={"ldr-pg__b ldr-pg__img" + on(2)} data-b="2">
        <svg viewBox="0 0 280 150" aria-hidden="true" focusable="false">
          <rect width="280" height="150" fill="#E6DFD4" />
          <rect x="0" y="62" width="280" height="88" fill="#C9D6D3" />
          <path d="M0 74 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#F8F6F2" strokeWidth="3" fill="none" />
          <path d="M0 104 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#F8F6F2" strokeWidth="2" fill="none" opacity=".7" />
          <path d="M70 62 v88 M140 62 v88 M210 62 v88" stroke="#E0401F" strokeWidth="2" strokeDasharray="5 6" opacity=".7" />
          <circle cx="104" cy="86" r="9" fill="#57524B" />
          <path d="M90 96 q14 10 30 0" stroke="#57524B" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="176" cy="92" r="7" fill="#A8A097" />
          <rect x="196" y="20" width="62" height="34" fill="#F8F6F2" />
          <path d="M227 20 v34" stroke="#C9BFB1" strokeWidth="2" />
        </svg>
        <span className="ldr-pg__cap">הבריכה המקורה, שיעור של יום שלישי</span>
      </div>
      <div className={"ldr-pg__b ldr-pg__proof" + on(3)} data-b="3">
        <span className="ldr-pg__avatar" aria-hidden="true" />
        <span className="ldr-pg__proof-t">
          <b>יואב, מדריך שחייה מוסמך</b>
          <span>רחוב הים, בת ים · חניה ליד הכניסה</span>
        </span>
      </div>
      <div className={"ldr-pg__b ldr-pg__faq" + on(4)} data-b="4">
        <span className="ldr-pg__q">הילד מפחד מהמים. זה מתאים לו?</span>
        <span className="ldr-pg__a">כן. מתחילים במים רדודים, בקצב שלו, וההורה יכול לצפות מהיציע.</span>
      </div>
      <div className={"ldr-pg__b ldr-pg__form" + on(5)} data-b="5">
        <span className="ldr-pg__field">שם</span>
        <span className="ldr-pg__field">טלפון</span>
        <span className="ldr-pg__btn ldr-pg__btn--wide">לשריין שיעור</span>
        <span className="ldr-pg__wa">או לשלוח הודעה בוואטסאפ</span>
      </div>
    </>
  );
}

function HandIcon({ side }: { side: Hand }) {
  return (
    <svg className="ldr-hand__ico" viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={side === "l" ? { transform: "scaleX(-1)" } : undefined}>
      <path
        d="M11 28c-3-2-5-6-5-10v-3c0-1 1-2 2-2s2 1 2 2v3V7c0-1 1-2 2-2s2 1 2 2v7-9c0-1 1-2 2-2s2 1 2 2v9-7c0-1 1-2 2-2s2 1 2 2v9l1-3c1-1 2-2 3-1s1 2 1 3l-3 8c-1 3-4 5-7 5h-4z"
        fill="currentColor"
      />
    </svg>
  );
}

const ConversionLadder = () => {
  const [level, setLevel] = useState(0);
  const [last, setLast] = useState<Hand | null>(null);
  const [slip, setSlip] = useState(0);
  const [live, setLive] = useState("");
  const [offset, setOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const handsRef = useRef<HTMLDivElement>(null);

  const active = level >= 1 && level <= N ? level - 1 : level > N ? N : -1; // lit block of the sample page

  /* Keep the lit block of the sample page in the middle of its frame. */
  useEffect(() => {
    const place = () => {
      const sheet = sheetRef.current;
      const page = pageRef.current;
      if (!sheet || !page) return;
      const k = Math.max(0, Math.min(N - 1, active));
      const block = page.querySelector<HTMLElement>(`[data-b="${k}"]`);
      if (!block || active < 0) return setOffset(0);
      const max = Math.max(0, page.scrollHeight - sheet.clientHeight);
      const want = block.offsetTop + block.offsetHeight / 2 - sheet.clientHeight / 2;
      setOffset(Math.round(Math.min(max, Math.max(0, want))));
    };
    place();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(place);
    if (sheetRef.current) ro.observe(sheetRef.current);
    return () => ro.disconnect();
  }, [active]);

  const pull = (h: Hand) => {
    if (level >= TOP) return;
    if (last === h) {
      setSlip((n) => n + 1);
      setLive("יד אחרי יד: אותה יד פעמיים מחליקה. גם מבקר לא מדלג על שלבים.");
      if (typeof navigator !== "undefined" && document.documentElement.classList.contains("nz-motion")) navigator.vibrate?.([8, 40, 8]);
      return;
    }
    const next = level + 1;
    setLast(h);
    setLevel(next);
    if (next <= N) setLive(`שלב ${next} מתוך ${N}: ${RUNGS[next - 1].name}. ${RUNGS[next - 1].title}. בדף: ${RUNGS[next - 1].where}.`);
    else setLive("ראש הסולם: מי שלחץ על מודעה השאיר פרטים.");
  };
  const again = () => {
    setLevel(0);
    setLast(null);
    setLive("חזרה לקרקע. מתחילים מהקליק.");
    handsRef.current?.querySelector<HTMLButtonElement>(".ldr-hand")?.focus();
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") pull("r");
    else if (e.key === "ArrowLeft") pull("l");
    else return;
    e.preventDefault();
  };

  const top = level >= TOP;
  const list = (cls: string) => (
    <ol className={"ldr-all " + cls}>
      {RUNGS.map((r, i) => (
        <li key={r.name}>
          <span className="ldr-all__n">{pad(i + 1)}</span>
          <span className="ldr-all__t">
            <b>{r.name}.</b> {r.title}
            <span className="ldr-all__body">{r.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
  const rung = level >= 1 && level <= N ? RUNGS[level - 1] : null;
  /* hands on the rails: the hand that pulled last grips the rung above the climber */
  const handR = last === "r" ? level + 1 : level;
  const handL = last === "l" ? level + 1 : level;

  return (
    <div
      className={"ldr" + (top ? " is-top" : "")}
      style={{ ["--lv" as string]: level, ["--hr" as string]: Math.min(handR, TOP), ["--hl" as string]: Math.min(handL, TOP) }}
      onKeyDown={onKey}
    >
      <div className="ldr__stage">
        <div className="ldr__climb" aria-hidden="true">
          <div className="ldr__sun">
            <span className="ldr__sun-disc" />
            <span className="ldr__sun-word">פנייה</span>
          </div>
          <div className="ldr__ladder">
            <span className="ldr__rail ldr__rail--r" />
            <span className="ldr__rail ldr__rail--l" />
            {RUNGS.map((r, i) => (
              <span key={r.name} className={"ldr__rung" + (i + 1 <= level ? " is-lit" : "")} style={{ ["--i" as string]: i + 1 }}>
                <span className="ldr__rung-n">{pad(i + 1)}</span>
              </span>
            ))}
            <span className="ldr__grip ldr__grip--r" />
            <span className="ldr__grip ldr__grip--l" />
            <span key={slip} className={"ldr__climber" + (slip ? " is-slip" : "")}>
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M6 3l12 9-5.5 1 3.5 7-2.6 1.2-3.4-7L6 18z" fill="currentColor" />
              </svg>
            </span>
          </div>
          <span className="ldr__ground">קליק</span>
        </div>

        <figure className="ldr__frame">
          <div className="ldr__sheet" ref={sheetRef} aria-hidden="true">
            <div className="ldr-pg" ref={pageRef} style={{ transform: `translate3d(0, ${-offset}px, 0)` }}>
              <SamplePage active={top ? -1 : active} />
            </div>
          </div>
          <figcaption className="ldr__cap">
            <span className="ldr__cap-k">דף נחיתה לדוגמה</span>
            <span className="ldr__cap-i">{top ? "הגיע לפנייה" : level === 0 ? "על הקרקע" : `שלב ${pad(level)}/${pad(N)}`}</span>
          </figcaption>
        </figure>
      </div>

      <div className="ldr__card">
        {top ? (
          <div className="ldr-card ldr-card--top">
            <p className="ldr-card__k">
              <span className="ldr-card__n">ראש הסולם</span>
              <span>מהקליק אל הפנייה</span>
            </p>
            <h3 className="ldr-card__t">מי שלחץ על המודעה השאיר פרטים</h3>
            {list("ldr-all--recap")}
          </div>
        ) : rung ? (
          <div key={level} className="ldr-card">
            <p className="ldr-card__k">
              <span className="ldr-card__n">שלב {pad(level)}</span>
              <span>{rung.name}</span>
            </p>
            <h3 className="ldr-card__t">{rung.title}</h3>
            <p className="ldr-card__b">{rung.body}</p>
            <p className="ldr-card__w">
              <span>איפה בדף</span> {rung.where}
            </p>
          </div>
        ) : (
          <div className="ldr-card ldr-card--ground">
            <p className="ldr-card__k">
              <span className="ldr-card__n">על הקרקע</span>
              <span>הקליק נחת בדף</span>
            </p>
            <h3 className="ldr-card__t">עזרו לו לטפס, יד אחרי יד</h3>
            <p className="ldr-card__b">מבקר לחץ על מודעה ונחת בדף נחיתה. כל שלב בסולם הוא חלק בדף שמקרב אותו לפנייה. משיכה ביד אחת ואז ביד השנייה מעלה אותו שלב.</p>
          </div>
        )}
        {slip > 0 && !top && (
          <p key={`s${slip}`} className="ldr__slip">
            יד אחרי יד. אותה יד פעמיים מחליקה, וגם מבקר לא מדלג על שלבים.
          </p>
        )}
      </div>

      <div className="ldr__hands" ref={handsRef}>
        {top ? (
          <button type="button" className="ldr__again" onClick={again}>
            לטפס שוב מהקליק
          </button>
        ) : (
          <>
            <button type="button" className={"ldr-hand" + (last === "r" ? " is-used" : "")} onClick={() => pull("r")}>
              <HandIcon side="r" />
              <span>יד ימין</span>
            </button>
            <span className="ldr__meter" aria-hidden="true">
              {RUNGS.map((r, i) => (
                <span key={r.name} className={i < level ? "is-on" : ""} />
              ))}
            </span>
            <button type="button" className={"ldr-hand" + (last === "l" ? " is-used" : "")} onClick={() => pull("l")}>
              <HandIcon side="l" />
              <span>יד שמאל</span>
            </button>
          </>
        )}
      </div>

      {/* no JS: the whole lesson as text (hidden once the climb can run) */}
      <div className="ldr__static">
        <p className="ldr-card__k">
          <span className="ldr-card__n">ששת השלבים</span>
          <span>מהקליק אל הפנייה</span>
        </p>
        {list("")}
      </div>

      <p className="nz-sr" aria-live="polite">
        {live}
      </p>
    </div>
  );
};

export default ConversionLadder;
