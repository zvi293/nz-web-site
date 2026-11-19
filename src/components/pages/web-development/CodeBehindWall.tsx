// Signature component: הקוד מאחורי הקיר — turn the canvas over (flip a part to read its verso)
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./code-wall.css";

/**
 * "הקוד מאחורי הקיר" — the finished home page of a small bakery hangs like a canvas on a
 * stretcher. Every part of it (nav, H1, button, picture, sections, footer) is a panel that can be
 * turned over on its horizontal axis, like turning a painting to read the back: its verso is raw
 * linen on the stretcher bars, with the inventory sticker and, written on it, the code that holds
 * that part up. The notes beside it say why it is written that way and turn the same panels.
 *
 * Mechanics: six panels on one 6-row grid (rows in code-wall.css, --cw-rows); each panel's inner
 * box rotates X 0 → 180deg (3D, backface hidden), the verso is pre-rotated so it reads upright.
 * "להפוך את כל הבד" cascades with a stagger; one panel lifts its edge once on first view.
 * The canvas is decorative (aria-hidden, pointer taps); the notes are the keyboard / screen-reader
 * controls (aria-pressed buttons) and carry the content. aria-live says what was turned.
 * SSR / no JS: the H1 panel shows its verso (the idea at a glance), all notes readable.
 * Reduced motion: the panel swaps sides instantly, no lift, no cascade.
 */

interface Block {
  title: string;
  tag: string;
  why: string;
  code: string[];
}

const BLOCKS: Block[] = [
  {
    title: "ניווט שכולם מבינים",
    tag: "<nav>",
    why: "תפריט מקישורים אמיתיים: גוגל סורק אותם, קורא מסך מכריז עליהם, ומקלדת מגיעה לכל אחד.",
    code: ['<nav aria-label="ראשי">', '  <a href="/">שקד</a>', '  <a href="#menu">תפריט</a>'],
  },
  {
    title: "כותרת ראשית אחת",
    tag: "<h1>",
    why: "משפט אחד שאומר מה העסק עושה. גוגל ועוזרי AI קוראים אותו לפני כל דבר אחר.",
    code: ["<h1>לחם מחמצת, טרי כל בוקר</h1>", '<p class="lead">', "  אופים בלילה, פותחים בבוקר.", "</p>"],
  },
  {
    title: "כפתור שעובד בכל דרך",
    tag: "<a href>",
    why: "קישור אמיתי בגודל אצבע, שנפתח ישר בוואטסאפ ועובד גם במקלדת.",
    code: ['<a href="https://wa.me/972…"', '   class="btn">להזמנה בוואטסאפ</a>'],
  },
  {
    title: "תמונה קלה, בלי קפיצות",
    tag: "<picture>",
    why: "פורמט AVIF, מידות קבועות וטקסט חלופי: נטענת מהר, לא מזיזה את העמוד, ומתוארת למי שלא רואה.",
    code: [
      "<picture>",
      '  <source type="image/avif"',
      '    srcset="loaf-640.avif 640w, …">',
      '  <img alt="כיכר מחמצת על קרש עץ"',
      '    width="1080" height="720"',
      '    fetchpriority="high">',
      "</picture>",
    ],
  },
  {
    title: "חלקים עם כותרות",
    tag: "<section> <h2>",
    why: "לכל חלק כותרת משלו, כך שקל לסרוק אותו בעין, בקורא מסך ובמנוע חיפוש.",
    code: [
      '<section aria-labelledby="menu">',
      '  <h2 id="menu">מה אופים היום</h2>',
      "  <ul>",
      "    <li>לחמים</li> <li>עוגות</li>",
      "    <li>מגשי אירוח</li>",
      "  </ul></section>",
    ],
  },
  {
    title: "נתונים מובנים",
    tag: "JSON-LD",
    why: "שורות שרק מכונות קוראות: מה העסק, מה שמו ומתי הוא פתוח. כך הוא מוצג נכון בחיפוש ובעוזרי AI.",
    code: [
      "<footer>…</footer>",
      '<script type="application/ld+json">',
      '{"@type": "Bakery", "name": "שקד",',
      ' "openingHours": "Su-Fr 06:00-14:00"}',
    ],
  },
];

const START = [1];
const pad = (n: number) => String(n).padStart(2, "0");

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

/* A tiny highlighter: tags, attribute names and strings are isolated LTR runs; plain text takes
   its own direction (unicode-bidi: plaintext), so a Hebrew sentence keeps its full stop at its
   end. Leading spaces stay outside the runs, so the indent stays on the left. */
const TOKEN = /("[^"]*")|(<\/?[\w-]+)|(\/?>)|([\w:-]+=)/g;
function CodeLine({ line }: { line: string }) {
  const out: ReactNode[] = [];
  const lead = /^\s*/.exec(line)![0];
  const body = line.slice(lead.length);
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  if (lead)
    out.push(
      <span key={k++} className="cw-ws">
        {lead}
      </span>,
    );
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(body))) {
    if (m.index > last)
      out.push(
        <span key={k++} className="cw-t">
          {body.slice(last, m.index)}
        </span>,
      );
    const cls = m[1] ? "cw-s" : m[2] || m[3] ? "cw-g" : "cw-a";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < body.length)
    out.push(
      <span key={k++} className="cw-t">
        {body.slice(last)}
      </span>,
    );
  return <span className="cw-line">{out}</span>;
}

/* the bakery's front, one part per panel */
function FrontPart({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <div className="cw-f cw-f--nav">
          <span className="cw-f__logo">
            שקד
            <i />
          </span>
          <span className="cw-f__links">
            <span>לחמים</span>
            <span>עוגות</span>
            <span>צור קשר</span>
          </span>
          <span className="cw-f__burger">
            <i />
            <i />
            <i />
          </span>
        </div>
      );
    case 1:
      return (
        <div className="cw-f cw-f--h1">
          <span className="cw-f__kicker">מאפייה שכונתית</span>
          <span className="cw-f__title">לחם מחמצת, טרי כל בוקר</span>
          <span className="cw-f__sub">אופים בלילה, פותחים בבוקר.</span>
        </div>
      );
    case 2:
      return (
        <div className="cw-f cw-f--cta">
          <span className="cw-f__btn">להזמנה בוואטסאפ</span>
          <span className="cw-f__more">לתפריט</span>
        </div>
      );
    case 3:
      return (
        <div className="cw-f cw-f--img">
          <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" focusable="false">
            <rect width="320" height="160" fill="#d9a46b" />
            <rect y="112" width="320" height="48" fill="#8a5a36" />
            <rect y="112" width="320" height="4" fill="#6f4529" />
            <ellipse cx="166" cy="118" rx="96" ry="10" fill="#5b3a22" opacity=".45" />
            <path d="M78 112 C78 58 120 40 166 40 C214 40 256 58 256 112 Z" fill="#a8622d" />
            <path d="M92 110 C94 70 126 52 166 52 C206 52 238 70 242 110" fill="none" stroke="#c98a4f" strokeWidth="3" opacity=".6" />
            <path d="M120 66 L142 92 M156 56 L180 88 M194 60 L216 90" stroke="#f1d6ad" strokeWidth="5" strokeLinecap="round" />
            <circle cx="44" cy="40" r="16" fill="#efe1c8" opacity=".55" />
          </svg>
        </div>
      );
    case 4:
      return (
        <div className="cw-f cw-f--cards">
          <span className="cw-f__h2">מה אופים היום</span>
          <span className="cw-f__grid">
            {["לחמים", "עוגות", "מגשי אירוח"].map((t, j) => (
              <span key={t} className="cw-f__card">
                <span className={`cw-f__thumb cw-f__thumb--${j}`} />
                <span>{t}</span>
              </span>
            ))}
          </span>
        </div>
      );
    default:
      return (
        <div className="cw-f cw-f--foot">
          <span className="cw-f__logo cw-f__logo--sm">
            שקד
            <i />
          </span>
          <span className="cw-f__hours">
            א׳–ו׳ · <bdi dir="ltr">06:00–14:00</bdi>
          </span>
        </div>
      );
  }
}

/* the verso: linen on the stretcher, the inventory sticker and the code */
function Verso({ b, i }: { b: Block; i: number }) {
  return (
    <div className="cw-v" dir="ltr">
      <span className="cw-v__sticker">
        <span className="cw-v__no">{pad(i + 1)}</span> {b.tag}
      </span>
      <code className="cw-v__code">
        {b.code.map((l, j) => (
          <CodeLine key={j} line={l} />
        ))}
      </code>
    </div>
  );
}

const CodeBehindWall = () => {
  const [turned, setTurned] = useState<number[]>(START);
  const [cascade, setCascade] = useState(false);
  const [lift, setLift] = useState(false);
  const [said, setSaid] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touched = useRef(false);
  const timer = useRef<number>(0);
  const turnedRef = useRef(turned);
  turnedRef.current = turned;
  const n = turned.length;

  /* one lift of the picture panel's edge on first view (motion only, never after a touch) */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          if (!touched.current && motionOn()) setLift(true);
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, []);

  const announce = (next: number[], i: number | null) => {
    const count = `${next.length} מתוך ${BLOCKS.length} חלקים הפוכים.`;
    if (i === null) setSaid(next.length ? `כל הבד הפוך: הקוד של כל העמוד גלוי. ${count}` : `כל החלקים חזרו לחזית. ${count}`);
    else if (next.includes(i)) setSaid(`הפכתם את ${BLOCKS[i].title}: מאחוריו ${BLOCKS[i].tag}. ${count}`);
    else setSaid(`${BLOCKS[i].title} חזר לחזית. ${count}`);
  };

  const flip = (i: number) => {
    touched.current = true;
    setLift(false);
    setCascade(false);
    const t = turnedRef.current;
    const next = t.includes(i) ? t.filter((x) => x !== i) : [...t, i].sort((a, b) => a - b);
    turnedRef.current = next;
    setTurned(next);
    announce(next, i);
  };

  const all = (on: boolean) => {
    touched.current = true;
    setLift(false);
    setCascade(motionOn());
    const next = on ? BLOCKS.map((_, i) => i) : [];
    setTurned(next);
    announce(next, null);
  };

  /* a note far from the canvas (phones: the notes sit under it) brings the panel into view first */
  const fromNote = (i: number) => {
    const el = panelRefs.current[i];
    const r = el?.getBoundingClientRect();
    const off = r && (r.top < 70 || r.bottom > window.innerHeight - 20);
    if (el && off) {
      const smooth = motionOn();
      el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => flip(i), smooth ? 520 : 0);
    } else flip(i);
  };

  return (
    <div
      ref={rootRef}
      className={["cw", cascade && "is-cascade", lift && "is-lift"].filter(Boolean).join(" ")}
      onAnimationEnd={(e) => {
        if (e.animationName === "cw-lift") setLift(false);
      }}
    >
      <div className="cw__exhibit">
        <div className="cw__bar">
          <p className="cw__count" aria-hidden="true">
            <span className="cw__count-n">{n}</span>
            <span className="cw__count-of">/ {BLOCKS.length}</span>
            <span className="cw__count-l">חלקים הפוכים</span>
          </p>
          <div className="cw__ends">
            <button type="button" className="cw__end" onClick={() => all(true)} aria-pressed={n === BLOCKS.length}>
              להפוך את כל הבד
            </button>
            <button type="button" className="cw__end" onClick={() => all(false)} aria-pressed={n === 0}>
              חזרה לחזית
            </button>
          </div>
        </div>

        <div className="cw__frame">
          <div className="cw__page" aria-hidden="true">
            {BLOCKS.map((b, i) => (
              <div
                key={b.tag}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className={["cw-panel", `cw-panel--${i}`, turned.includes(i) && "is-turned"].filter(Boolean).join(" ")}
                style={{ ["--i" as string]: i }}
                onClick={() => flip(i)}
              >
                <div className="cw-panel__in">
                  <div className="cw-face cw-face--front">
                    <FrontPart i={i} />
                  </div>
                  <div className="cw-face cw-face--back">
                    <Verso b={b} i={i} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="cw__caption">
          עמוד הבית של מאפייה שכונתית (לדוגמה). כל חלק בו הוא לוח שאפשר להפוך, כמו ציור שהופכים כדי לקרוא את הגב שלו.
        </p>
      </div>

      <ol className="cw__notes" aria-label="מה כתוב על הגב של כל חלק">
        {BLOCKS.map((b, i) => {
          const on = turned.includes(i);
          return (
            <li key={b.tag} className={on ? "is-lit" : undefined}>
              <button type="button" className="cw-note" aria-pressed={on} onClick={() => fromNote(i)}>
                <span className="cw-note__no" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="cw-note__body">
                  <span className="cw-note__head">
                    <span className="cw-note__title">{b.title}</span>
                    <code className="cw-note__tag" dir="ltr">
                      {b.tag}
                    </code>
                  </span>
                  <span className="cw-note__why">{b.why}</span>
                </span>
                <span className="cw-note__turn" aria-hidden="true">
                  {on ? "הגב" : "החזית"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="nz-sr" aria-live="polite">
        {said}
      </p>
    </div>
  );
};

export default CodeBehindWall;
