// Signature component: המאזניים — weigh (drag trust onto a balance until the beam levels)
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";
import "./scales.css";

/**
 * "המאזניים" (lawyer page). On one pan sit the questions a client asks before calling a lawyer;
 * the visitor places what the site gives him on the other pan — by dragging a weight onto the
 * pan (mouse / pen at once; on touch a short press lifts it first, so a swipe still scrolls the
 * page) or tapping it (touch, keyboard) — and the beam swings toward level. Each
 * answer ticks its question. One weight is a trap: "a promise to win the case" is not allowed by
 * the Bar's advertising rules, and it falls onto the questions' side instead.
 * The beam angle is pure CSS (--tilt, transition with a damped settle); the pans counter-rotate.
 * SSR / no JS: the balance tilted with the questions on it and every weight on the shelf (each
 * labelled with the question it answers). Reduced motion: no swing, no flight — same states.
 */
type Weight = { id: string; label: string; short: string; answers?: string; trap?: boolean };

/* `text` is the full question (narration); `short` is what sits in the pan — one line at 14px
   inside a 360px phone's pan, so the pile stays under the strings' hoop. */
const QUESTIONS: { id: string; text: string; short: string }[] = [
  { id: "who", text: "מי עומד מאחורי המשרד?", short: "מי מאחורי המשרד?" },
  { id: "field", text: "יש ניסיון בתחום שלי?", short: "מכירים את התחום?" },
  { id: "discreet", text: "הפנייה תישאר דיסקרטית?", short: "זה יישאר בינינו?" },
  { id: "plain", text: "אבין מה אומרים לי?", short: "אבין את ההסבר?" },
  { id: "reach", text: "קל ליצור קשר?", short: "קל ליצור קשר?" },
];

const WEIGHTS: Weight[] = [
  { id: "field", label: "עמוד לכל תחום עיסוק", short: "תחומי עיסוק", answers: "field" },
  { id: "who", label: "עמוד אודות: הכשרה ותחומים", short: "אודות", answers: "who" },
  { id: "promise", label: "הבטחה: נזכה בתיק", short: "הבטחת זכייה", trap: true },
  { id: "discreet", label: "טופס פנייה דיסקרטי", short: "פנייה דיסקרטית", answers: "discreet" },
  { id: "plain", label: "מאמרים בשפה פשוטה", short: "מאמרים", answers: "plain" },
  { id: "reach", label: "וואטסאפ וחיוג בלחיצה", short: "וואטסאפ וחיוג", answers: "reach" },
];

/* The hanger: two strings from the beam to a rim at 16% of the drop (a flat ellipse), then the
   faint walls of the vessel straight down to the pan. The pile stays below the rim, so no
   string ever crosses a card. */
const STRINGS = "M50 0 L3 16 M50 0 L97 16 M3 16 A47 2.2 0 0 0 97 16 A47 2.2 0 0 0 3 16";
const WALLS = "M3 16 L3 100 M97 16 L97 100";

const STEP = 2.8; // degrees of tilt per unbalanced weight
const MAX = 17;
const qText = (id?: string) => QUESTIONS.find((q) => q.id === id)?.text ?? "";

const Scales = () => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [nudge, setNudge] = useState(false);
  const [say, setSay] = useState("");
  const [hot, setHot] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const chipRefs = useRef<Record<string, HTMLElement | null>>({});
  const flight = useRef<{ id: string; rect: DOMRect } | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; on: boolean; el: HTMLElement; touch: boolean; lifted: boolean; timer: number } | null>(null);
  const swallowClick = useRef(false);
  const placedRef = useRef<string[]>([]);

  const trapIn = placed.includes("promise");
  const answers = placed.filter((id) => id !== "promise");
  const doubt = QUESTIONS.length + (trapIn ? 1 : 0);
  const tilt = Math.max(-MAX, Math.min(MAX, (doubt - answers.length) * STEP));
  const level = answers.length === QUESTIONS.length && !trapIn;
  const answered = new Set(answers.map((id) => WEIGHTS.find((w) => w.id === id)?.answers));

  /* First view: the beam swings once and settles under the weight of the questions (motion only). */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setNudge(true);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* FLIP: the chip on the pan flies in from the weight's place on the shelf. */
  useLayoutEffect(() => {
    const f = flight.current;
    flight.current = null;
    if (!f || !motionAllowed()) return;
    const el = chipRefs.current[f.id];
    if (!el || !el.animate) return;
    const to = el.getBoundingClientRect();
    const dx = f.rect.left + f.rect.width / 2 - (to.left + to.width / 2);
    const dy = f.rect.top + f.rect.height / 2 - (to.top + to.height / 2);
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(1.15)`, opacity: 0.4 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ],
      { duration: 720, easing: "cubic-bezier(0.2, 0.8, 0.1, 1)" },
    );
  }, [placed]);

  const toggle = (id: string, from?: DOMRect) => {
    const w = WEIGHTS.find((x) => x.id === id)!;
    const cur = placedRef.current;
    const isIn = cur.includes(id);
    if (!isIn) flight.current = { id, rect: from ?? tokenRefs.current[id]!.getBoundingClientRect() };
    const next = isIn ? cur.filter((x) => x !== id) : [...cur, id];
    placedRef.current = next;
    setPlaced(next);
    const nAns = next.filter((x) => x !== "promise").length;
    const open = QUESTIONS.length - nAns;
    const trap = next.includes("promise");
    if (isIn) {
      setSay(`${w.label} חזר למדף. ${open === 1 ? "שאלה אחת פתוחה" : `${open} שאלות פתוחות`}.`);
    } else if (w.trap) {
      setSay("הבטחת זכייה נפלה לצד השאלות: כללי הפרסום של הלשכה אוסרים הבטחת תוצאה, ולקוח מרגיש אותה. היא מוסיפה ספק. החזירו אותה למדף.");
    } else if (nAns === QUESTIONS.length && !trap) {
      setSay("המאזניים מאוזנים. כל שאלה קיבלה תשובה, ועכשיו הלקוח מתקשר.");
    } else {
      const rest = open === 0 ? "כל השאלות נענו, אבל משהו עוד מכביד על הצד השני." : open === 1 ? "נשארה שאלה אחת." : `נשארו ${open} שאלות.`;
      setSay(`${w.label} עונה על השאלה: ${qText(w.answers)} ${rest}`);
    }
  };

  const reset = () => {
    placedRef.current = [];
    setPlaced([]);
    setSay("הכף התרוקנה. כל השאלות פתוחות שוב.");
  };

  /* Drag a weight onto the pan. Mouse / pen: at once. Touch: a short press (160ms) lifts the
     weight first — until then a swipe scrolls the page as usual; once lifted, a non-passive
     touchmove listener (on the component root) keeps the page still while the weight follows the finger. */
  const overPan = (x: number, y: number) => {
    const r = panRef.current?.getBoundingClientRect();
    return !!r && x > r.left - 24 && x < r.right + 24 && y > r.top - 60 && y < r.bottom + 24;
  };
  useEffect(() => {
    /* on the component root, not window: a non-passive touch listener on window would make every
       touch scroll of the page wait for the main thread (INP / scroll jank); here only touches
       that start on the scales do, and the weights live inside it */
    const root = rootRef.current;
    if (!root) return;
    const block = (ev: TouchEvent) => {
      if (drag.current?.lifted && ev.cancelable) ev.preventDefault();
    };
    root.addEventListener("touchmove", block, { passive: false });
    return () => root.removeEventListener("touchmove", block);
  }, []);
  const onDown = (id: string) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    swallowClick.current = false;
    if (e.button !== 0 || placedRef.current.includes(id)) return;
    const touch = e.pointerType === "touch";
    const el = e.currentTarget;
    const d = { id, x: e.clientX, y: e.clientY, on: false, el, touch, lifted: !touch, timer: 0 };
    drag.current = d;
    if (touch) {
      d.timer = window.setTimeout(() => {
        if (drag.current !== d) return;
        d.lifted = true;
        el.classList.add("is-lifted");
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer already gone */
        }
        navigator.vibrate?.(8);
      }, 160);
    } else {
      el.setPointerCapture(e.pointerId);
    }
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.lifted) {
      // a touch that moves before the lift is a scroll: let it go
      if (Math.hypot(dx, dy) > 8) {
        window.clearTimeout(d.timer);
        drag.current = null;
      }
      return;
    }
    if (!d.on && Math.hypot(dx, dy) < 5) return;
    d.on = true;
    d.el.classList.add("is-dragging");
    d.el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-6, Math.min(6, dx / 20))}deg)`;
    setHot(overPan(e.clientX, e.clientY));
  };
  const onUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    window.clearTimeout(d.timer);
    d.el.classList.remove("is-lifted");
    if (!d.on) {
      // lifted by a press but never moved: the click that follows places it (no double toggle)
      return;
    }
    swallowClick.current = true;
    setHot(false);
    const rect = d.el.getBoundingClientRect();
    d.el.classList.remove("is-dragging");
    d.el.style.transform = "";
    if (overPan(e.clientX, e.clientY)) toggle(d.id, rect);
  };
  const onClick = (id: string) => () => {
    if (swallowClick.current) {
      swallowClick.current = false;
      return;
    }
    toggle(id);
  };

  const chip = (w: Weight, side: "doubt" | "trust") => (
    <button
      key={w.id}
      ref={(el) => (chipRefs.current[w.id] = el)}
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      className={cn("vl-sc__chip", `vl-sc__chip--${side}`, w.trap && "vl-sc__chip--trap")}
      onClick={() => toggle(w.id)}
    >
      {w.short}
    </button>
  );

  return (
    <div ref={rootRef} className={cn("vl-sc", level && "is-level", nudge && "is-nudge")} style={{ ["--tilt" as string]: `${tilt}deg` }}>
      <p className="vl-sc__status" aria-live="polite">
        <span className="vl-sc__meter" aria-hidden="true">
          {QUESTIONS.map((q) => (
            <i key={q.id} className={cn(answered.has(q.id) && "is-on")} />
          ))}
        </span>
        <span className="vl-sc__say">{say || "הכף של השאלות כבדה. חמש שאלות פתוחות, והכף השנייה ריקה."}</span>
      </p>

      <div className="vl-sc__grid">
        <div className="vl-sc__stage" aria-hidden="true">
          <span className="vl-sc__column" />
          <span className="vl-sc__base" />
          <div className="vl-sc__beam" onAnimationEnd={() => setNudge(false)}>
            <span className="vl-sc__bar" />
            <span className="vl-sc__pivot" />
            <span className="vl-sc__end vl-sc__end--doubt">
              <span className="vl-sc__hanger">
                <svg className="vl-sc__strings" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={STRINGS} vectorEffect="non-scaling-stroke" />
                  <path className="vl-sc__walls" d={WALLS} vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="vl-sc__pile">
                  {QUESTIONS.map((q) => (
                    <span key={q.id} className={cn("vl-sc__q", answered.has(q.id) && "is-answered")}>
                      {q.short}
                    </span>
                  ))}
                  {trapIn && chip(WEIGHTS.find((w) => w.trap)!, "doubt")}
                </span>
                <span className="vl-sc__pan" />
                <span className="vl-sc__tag">השאלות</span>
              </span>
            </span>
            <span className="vl-sc__end vl-sc__end--trust">
              <span className={cn("vl-sc__hanger", hot && "is-hot")} ref={panRef}>
                <svg className="vl-sc__strings" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={STRINGS} vectorEffect="non-scaling-stroke" />
                  <path className="vl-sc__walls" d={WALLS} vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="vl-sc__pile">
                  {answers.map((id) => chip(WEIGHTS.find((w) => w.id === id)!, "trust"))}
                  {answers.length === 0 && <span className="vl-sc__empty">הניחו כאן</span>}
                </span>
                <span className="vl-sc__pan" />
                <span className="vl-sc__tag">מה שהאתר נותן</span>
              </span>
            </span>
          </div>
          <span className="vl-sc__seal">מאוזן</span>
        </div>

        <div className="vl-sc__shelf">
          <p className="vl-sc__shelf-head">
            <span>המדף</span>
            <span>{`${placed.length} מתוך ${WEIGHTS.length} על המאזניים`}</span>
          </p>
          <ul className="vl-sc__weights">
            {WEIGHTS.map((w) => {
              const on = placed.includes(w.id);
              return (
                <li key={w.id}>
                  <button
                    ref={(el) => (tokenRefs.current[w.id] = el)}
                    type="button"
                    className={cn("vl-sc__weight", on && "is-placed")}
                    aria-pressed={on}
                    onPointerDown={onDown(w.id)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={onClick(w.id)}
                  >
                    <span className="vl-sc__glyph" aria-hidden="true" />
                    <span className="vl-sc__label">{w.label}</span>
                    <span className="vl-sc__state">{on ? "על הכף · להחזרה" : "להנחה על הכף"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="vl-sc__reset" onClick={reset} disabled={placed.length === 0}>
            לרוקן את הכף
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scales;
