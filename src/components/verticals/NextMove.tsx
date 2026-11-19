// Signature component: המהלך הבא — branching choice on a mini board (two moves → a site strategy)
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./next-move.css";

/**
 * "המהלך הבא" (consultant page). A 5×5 board with the consultant's pawn. Move one: three marked
 * squares = three ways to present yourself (a niche, a named method, the stage). Move two: two
 * squares = how a reader becomes a conversation (a call in the calendar, or content that leads
 * to one). Each move slides the pawn, draws the path in vermilion, writes the move in chess-like
 * notation and reveals that part of the site strategy; after two moves the full strategy card is
 * shown (home page, the key page, the next step). The options are also listed beside the board
 * as plain buttons (big targets on phones). When the options change, focus moves to the new
 * question, so keyboard focus never drops to <body>. aria-live narrates. No JS: every option and
 * what it means for the site is listed under the board.
 */
type Opt = { id: string; word: string; title: string; home: string; key: string };
type Step = { id: string; word: string; title: string; next: string };

const FIRST: (Opt & { col: number })[] = [
  {
    id: "niche",
    col: 3,
    word: "נישה",
    title: "מומחה לקהל אחד",
    home: "עמוד הבית אומר למי בדיוק אתם עוזרים, במשפט אחד, ומי שלא שם מבין שזה לא בשבילו.",
    key: "עמוד לכל בעיה שהקהל הזה מביא, במילים שלו.",
  },
  {
    id: "method",
    col: 2,
    word: "שיטה",
    title: "שיטה עם שם",
    home: "עמוד הבית מציג את השיטה ואת השינוי שהיא יוצרת, בלי הבטחות.",
    key: "עמוד שיטה: השלבים, מה קורה בכל אחד, ואיך יודעים שמתקדמים.",
  },
  {
    id: "stage",
    col: 1,
    word: "במה",
    title: "הרצאות וסדנאות",
    home: "עמוד הבית מראה אתכם על הבמה: נושאים, קהלים ודרך להזמין.",
    key: "עמוד לכל הרצאה או סדנה, עם קטע וידאו קצר וטופס הזמנה.",
  },
];
const SECOND: (Step & { dc: number })[] = [
  { id: "call", dc: 1, word: "יומן", title: "שיחת היכרות ביומן", next: "כפתור אחד שפותח את היומן, מועד פנוי, תזכורת אוטומטית ושאלה אחת לפני השיחה." },
  { id: "content", dc: -1, word: "תוכן", title: "תוכן שמוביל לשיחה", next: "מאמרים שעונים על השאלות שלקוחות שואלים, ובסוף כל אחד הזמנה לשיחה." },
];

const COLS = ["א", "ב", "ג", "ד", "ה"]; // a–e, written from the right (RTL board)
const START = { r: 4, c: 2 };
const sq = (r: number, c: number) => `${COLS[c]}${5 - r}`;

const NextMove = () => {
  const [m1, setM1] = useState<string | null>(null);
  const [m2, setM2] = useState<string | null>(null);
  const [say, setSay] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const askRef = useRef<HTMLParagraphElement>(null);
  const focusAsk = useRef(false);

  useEffect(() => {
    if (!focusAsk.current) return;
    focusAsk.current = false;
    askRef.current?.focus({ preventScroll: true });
  });

  const first = FIRST.find((f) => f.id === m1);
  const second = SECOND.find((s) => s.id === m2);
  const p1 = first ? { r: 3, c: first.col } : null;
  const targets2 = first
    ? SECOND.map((s) => ({ ...s, r: 1, c: Math.max(0, Math.min(4, first.col + s.dc * (first.col === 2 ? 1 : 1))) }))
    : [];
  // keep the two second-move squares apart and on the board
  if (first && targets2.length === 2 && targets2[0].c === targets2[1].c) targets2[1].c = first.col === 0 ? 1 : first.col - 1;
  const p2 = second && first ? targets2.find((t) => t.id === second.id)! : null;
  const pawn = p2 ?? p1 ?? START;
  const done = !!(first && second);

  const play1 = (id: string) => {
    setM1(id);
    setM2(null);
    const f = FIRST.find((x) => x.id === id)!;
    setSay(`מהלך ראשון: ${f.title}. ${f.home} עכשיו בחרו איך לקוח עובר לשיחה.`);
    focusAsk.current = true;
  };
  const play2 = (id: string) => {
    setM2(id);
    const s = SECOND.find((x) => x.id === id)!;
    setSay(`מהלך שני: ${s.title}. האסטרטגיה המלאה מופיעה ליד הלוח.`);
    window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>(".vl-nm__card")?.focus({ preventScroll: true }), 50);
  };
  const reset = () => {
    setM1(null);
    setM2(null);
    setSay("הלוח התאפס. הרגלי חזר לנקודת הפתיחה.");
    focusAsk.current = true;
  };

  const t1 = !m1 ? FIRST.map((f) => ({ r: 3, c: f.col, id: f.id, word: f.word, title: f.title, move: 1 as const })) : [];
  const t2 = m1 && !m2 ? targets2.map((t) => ({ r: t.r, c: t.c, id: t.id, word: t.word, title: t.title, move: 2 as const })) : [];
  const targets = [...t1, ...t2];

  // path in board units (center of squares), x from the right (RTL)
  const pts = [START, p1, p2].filter(Boolean) as { r: number; c: number }[];
  const path = pts.map((p, i) => `${i ? "L" : "M"}${(4 - p.c) * 20 + 10} ${p.r * 20 + 10}`).join(" ");
  const notation = [first && `1. ${first.word} ${sq(3, first.col)}`, second && p2 && `2. ${second.word} ${sq(p2.r, p2.c)}`].filter(Boolean).join("   ");

  return (
    <div className={cn("vl-nm", done && "is-done")}>
      <div className="vl-nm__boardwrap">
        <div className="vl-nm__board" role="group" aria-label="לוח המהלכים">
          {Array.from({ length: 25 }, (_, i) => {
            const r = Math.floor(i / 5);
            const c = i % 5;
            const t = targets.find((x) => x.r === r && x.c === c);
            const dark = (r + c) % 2 === 1;
            const visited = pts.some((p) => p.r === r && p.c === c);
            const style = { gridRow: r + 1, gridColumn: c + 1 };
            return t ? (
              <button
                key={i}
                type="button"
                className={cn("vl-nm__sq", dark && "is-dark", "is-target")}
                style={style}
                onClick={() => (t.move === 1 ? play1(t.id) : play2(t.id))}
                aria-label={`מהלך ${t.move === 1 ? "ראשון" : "שני"}: ${t.title}`}
              >
                <span className="vl-nm__dot" aria-hidden="true" />
                <span className="vl-nm__word">{t.word}</span>
              </button>
            ) : (
              <span key={i} className={cn("vl-nm__sq", dark && "is-dark", visited && "is-visited")} style={style} aria-hidden="true">
                {r === 4 && <span className="vl-nm__file">{COLS[c]}</span>}
              </span>
            );
          })}
          <svg className="vl-nm__path" viewBox="0 0 100 100" aria-hidden="true">
            {pts.length > 1 && <path d={path} key={path} pathLength={1} />}
          </svg>
          <span
            className="vl-nm__pawn"
            style={{ ["--r" as string]: pawn.r, ["--c" as string]: pawn.c }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 40 56">
              <circle cx="20" cy="11" r="8" />
              <path d="M13 22h14l-3 4c0 8 3 14 7 18H9c4-4 7-10 7-18Z" />
              <rect x="5" y="46" width="30" height="7" rx="2" />
            </svg>
          </span>
        </div>
        <p className="vl-nm__notation" aria-hidden="true">
          {notation || "הרגלי בנקודת הפתיחה · " + sq(START.r, START.c)}
        </p>
      </div>

      <div className="vl-nm__panel" ref={panelRef}>
        {!done && (
          <div className="vl-nm__ask">
            <p className="vl-nm__ask-no">{m1 ? "מהלך 02 מתוך 02" : "מהלך 01 מתוך 02"}</p>
            <p className="vl-nm__ask-q" ref={askRef} tabIndex={-1}>{m1 ? "איך לקוח עובר מקריאה לשיחה?" : "איך אתם מציגים את עצמכם?"}</p>
            <ul className="vl-nm__opts">
              {(m1 ? SECOND : FIRST).map((o) => (
                <li key={o.id}>
                  <button type="button" className="vl-nm__opt" onClick={() => (m1 ? play2(o.id) : play1(o.id))}>
                    <span className="vl-nm__opt-word">{o.word}</span>
                    <span className="vl-nm__opt-title">{o.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            {first && (
              <p className="vl-nm__partial">
                <span>עד עכשיו</span>
                {first.home}
              </p>
            )}
          </div>
        )}
        {done && first && second && (
          <article className="vl-nm__card" tabIndex={-1} aria-labelledby="vl-nm-card-title">
            <p className="vl-nm__card-label">
              <span>האסטרטגיה שלכם</span>
              <span>{`${first.word} · ${second.word}`}</span>
            </p>
            <h3 id="vl-nm-card-title" className="vl-nm__card-title">{`${first.title}, ו${second.title}`}</h3>
            <dl className="vl-nm__plan">
              <div>
                <dt>עמוד הבית</dt>
                <dd>{first.home}</dd>
              </div>
              <div>
                <dt>העמוד המרכזי</dt>
                <dd>{first.key}</dd>
              </div>
              <div>
                <dt>הצעד הבא</dt>
                <dd>{second.next}</dd>
              </div>
            </dl>
          </article>
        )}
        {(m1 || m2) && (
          <button type="button" className="vl-nm__reset" onClick={reset}>
            משחק חדש
          </button>
        )}
        <p className="vl-nm__say" aria-live="polite">
          {say}
        </p>
      </div>

      <div className="vl-nm__nojs">
        <p className="vl-nm__nojs-head">מהלך ראשון: איך אתם מציגים את עצמכם</p>
        <ul>
          {FIRST.map((f) => (
            <li key={f.id}>
              <strong>{`${f.word} · ${f.title}. `}</strong>
              {`${f.home} ${f.key}`}
            </li>
          ))}
        </ul>
        <p className="vl-nm__nojs-head">מהלך שני: איך לקוח עובר מקריאה לשיחה</p>
        <ul>
          {SECOND.map((x) => (
            <li key={x.id}>
              <strong>{`${x.word} · ${x.title}. `}</strong>
              {x.next}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NextMove;
