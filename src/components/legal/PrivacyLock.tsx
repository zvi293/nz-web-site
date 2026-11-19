// Signature component: קבוצת המנעול — pattern-lock trace (swipe a path through the stars)
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import type { LockData } from "./content";

/**
 * /privacy/ — "קבוצת המנעול". The policy in short, as a night sky in which six stars sit on the
 * outline of a padlock. Like a phone's pattern lock, you put a finger on a star and swipe through
 * the others: every star you pass lights up and tells its point of the policy in plain words, and
 * the padlock draws itself under your finger. When all six are lit the shackle drops and the lock
 * closes: "המידע שלכם נשאר אצלכם".
 *
 * Touch: only a gesture that STARTS on a star traces (touch-action: none on the stars only), so the
 * page still scrolls from anywhere else on the sky. Tapping a star lights it too; tapping a lit star
 * reads it again. Keyboard: the stars are native toggle buttons (aria-pressed), Enter/Space lights;
 * the card is aria-live. No JS: every point is listed in plain text under the sky.
 * Reduced motion: no draw-in, no pulse; the lock simply appears closed when complete.
 */
interface Props {
  data: LockData;
  idPrefix: string;
}

/* Where the star labels sit on a wide sky (01/06 right of the star, 02/03 left, 04/05 under it):
   no dust there. On a phone the 03–06 labels move inside the padlock's body. */
const QUIET = [
  { x1: 64, x2: 92, y1: 27, y2: 37 },
  { x1: 8, x2: 36, y1: 27, y2: 37 },
  { x1: 4, x2: 25, y1: 49, y2: 59 },
  { x1: 75, x2: 96, y1: 49, y2: 59 },
  { x1: 10, x2: 40, y1: 85, y2: 96 },
  { x1: 60, x2: 90, y1: 85, y2: 96 },
];
/* A fixed scatter of faint background stars (deterministic → same markup on server and client).
   Dust that would sit on a label is dropped (inside the padlock's body it is hidden anyway). */
const DUST = Array.from({ length: 52 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.1234;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  const ang = fx * Math.PI * 2;
  const rad = Math.sqrt(fy) * 45;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return { x: r2(50 + rad * Math.cos(ang)), y: r2(50 + rad * Math.sin(ang)), r: i % 7 === 0 ? 0.42 : i % 3 === 0 ? 0.3 : 0.2, o: 0.16 + ((i * 37) % 10) / 32 };
}).filter((d) => !QUIET.some((q) => d.x > q.x1 && d.x < q.x2 && d.y > q.y1 && d.y < q.y2));

/* Planisphere rim: a tick every 5°, a longer one every 30°. */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180;
  const long = i % 6 === 0;
  const f = (n: number) => Math.round(n * 1000) / 1000;
  const r2 = long ? 45.6 : 46.8;
  return { x1: f(50 + 48 * Math.cos(a)), y1: f(50 + 48 * Math.sin(a)), x2: f(50 + r2 * Math.cos(a)), y2: f(50 + r2 * Math.sin(a)) };
});

const two = (n: number) => String(n).padStart(2, "0");
/** Hit radius of a star while tracing, in CSS px. */
const HIT = 26;

const PrivacyLock = ({ data, idPrefix }: Props) => {
  const { stars, edges } = data;
  const n = stars.length;
  const [lit, setLit] = useState<boolean[]>(() => stars.map(() => false));
  const [active, setActive] = useState<number | null>(null);
  const [trail, setTrail] = useState<[number, number][]>([]);
  const [tracing, setTracing] = useState(false);
  const [inView, setInView] = useState(false);
  const skyRef = useRef<HTMLDivElement>(null);
  const liveLine = useRef<SVGLineElement>(null);
  const trace = useRef<{ id: number; last: number; centers: { x: number; y: number }[]; rect: DOMRect } | null>(null);
  const suppressClick = useRef(false);
  const litRef = useRef(lit);
  litRef.current = lit;

  useEffect(() => {
    const el = skyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const light = (i: number) => {
    setActive(i);
    if (!litRef.current[i]) {
      const next = litRef.current.slice();
      next[i] = true;
      litRef.current = next;
      setLit(next);
      if (trace.current && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {
          /* not allowed: no tick */
        }
      }
    }
  };

  /* ── tracing: starts on a star, follows the finger/pointer across the sky ── */
  const onStarDown = (i: number, e: RPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const sky = skyRef.current;
    if (!sky) return;
    const rect = sky.getBoundingClientRect();
    const centers = stars.map((s) => ({ x: rect.left + (s.x / 100) * rect.width, y: rect.top + (s.y / 100) * rect.height }));
    trace.current = { id: e.pointerId, last: i, centers, rect };
    suppressClick.current = true;
    try {
      sky.setPointerCapture(e.pointerId);
    } catch {
      /* capture unavailable: moves still arrive while over the sky */
    }
    setTracing(true);
    setTrail([]);
    light(i);
    moveLive(e.clientX, e.clientY);
  };

  const moveLive = (cx: number, cy: number) => {
    const t = trace.current;
    const ln = liveLine.current;
    if (!t || !ln) return;
    const from = stars[t.last];
    ln.setAttribute("x1", String(from.x));
    ln.setAttribute("y1", String(from.y));
    ln.setAttribute("x2", String(((cx - t.rect.left) / t.rect.width) * 100));
    ln.setAttribute("y2", String(((cy - t.rect.top) / t.rect.height) * 100));
  };

  const onSkyMove = (e: RPointerEvent<HTMLDivElement>) => {
    const t = trace.current;
    if (!t || e.pointerId !== t.id) return;
    for (let j = 0; j < n; j++) {
      if (j === t.last) continue;
      const c = t.centers[j];
      if (Math.hypot(e.clientX - c.x, e.clientY - c.y) <= HIT) {
        const from = t.last;
        t.last = j;
        setTrail((tr) => [...tr, [from, j]]);
        light(j);
        break;
      }
    }
    moveLive(e.clientX, e.clientY);
  };

  const endTrace = (e: RPointerEvent<HTMLDivElement>) => {
    const t = trace.current;
    if (!t || e.pointerId !== t.id) return;
    trace.current = null;
    setTracing(false);
    /* a click may or may not follow (capture moves it to the sky): forget the flag right after */
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };

  const onStarClick = (i: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    light(i);
  };

  const reset = () => {
    const none = stars.map(() => false);
    litRef.current = none;
    setLit(none);
    setActive(null);
    setTrail([]);
  };

  const count = lit.filter(Boolean).length;
  const locked = count === n;
  const star = active === null ? null : stars[active];
  const s0 = stars[edges.find((e) => e.shackle)?.a ?? 0];
  const s1 = stars[edges.find((e) => e.shackle)?.b ?? 1];
  const body = { x1: Math.min(stars[2].x, stars[5].x), x2: Math.max(stars[2].x, stars[5].x), y1: stars[2].y, y2: stars[3].y };
  const legL = Math.min(s0.x, s1.x);
  const legR = Math.max(s0.x, s1.x);
  const shoulder = s0.y;
  const rad = (legR - legL) / 2;
  const shacklePath = `M${legL} ${body.y1} V${shoulder} A${rad} ${rad} 0 0 1 ${legR} ${shoulder} V${body.y1}`;
  const keyX = (body.x1 + body.x2) / 2;
  const keyY = body.y1 + (body.y2 - body.y1) * 0.48;

  return (
    <div className="lg-lock-wrap" data-locked={locked ? "" : undefined}>
      <div
        ref={skyRef}
        className="lg-lock"
        data-in={inView ? "" : undefined}
        data-tracing={tracing ? "" : undefined}
        data-fresh={count === 0 ? "" : undefined}
        onPointerMove={onSkyMove}
        onPointerUp={endTrace}
        onPointerCancel={endTrace}
        onLostPointerCapture={endTrace}
      >
        <svg className="lg-lock__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle cx="50" cy="50" r="48" className="lg-lock__disc" />
          {TICKS.map((t, i) => (
            <line key={`t${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className="lg-lock__tick" />
          ))}
          {DUST.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} className="lg-lock__dust" style={{ opacity: d.o }} />
          ))}

          {/* the padlock: shackle first, the body drawn over its feet */}
          <g className="lg-lock__shackle">
            <path d={shacklePath} pathLength={1} className="lg-lock__edge lg-lock__edge--ghost" />
            <path
              d={shacklePath}
              pathLength={1}
              className="lg-lock__edge lg-lock__edge--lit"
              data-on={lit[0] && lit[1] ? "" : undefined}
            />
          </g>
          <rect x={body.x1} y={body.y1} width={body.x2 - body.x1} height={body.y2 - body.y1} className="lg-lock__body" />
          {edges
            .filter((e) => !e.shackle)
            .map((e) => (
              <g key={`${e.a}-${e.b}`}>
                <line x1={stars[e.a].x} y1={stars[e.a].y} x2={stars[e.b].x} y2={stars[e.b].y} className="lg-lock__edge lg-lock__edge--ghost" />
                <line
                  x1={stars[e.a].x}
                  y1={stars[e.a].y}
                  x2={stars[e.b].x}
                  y2={stars[e.b].y}
                  pathLength={1}
                  className="lg-lock__edge lg-lock__edge--lit"
                  data-on={lit[e.a] && lit[e.b] ? "" : undefined}
                />
              </g>
            ))}
          <g className="lg-lock__keyhole" transform={`translate(${keyX} ${keyY})`}>
            <circle cx="0" cy="-1.6" r="2.6" />
            <path d="M-1.5 0 L1.5 0 L2.4 6.4 L-2.4 6.4 Z" />
          </g>

          {/* the finger's own path: the segments it traced, and the live line to the finger */}
          {trail.map(([a, b], i) => (
            <line key={`tr${i}`} x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y} className="lg-lock__trail" />
          ))}
          <line ref={liveLine} className="lg-lock__live" x1="0" y1="0" x2="0" y2="0" />
        </svg>

        <p className="lg-lock__seal" aria-hidden="true">
          <span>נעול</span>
        </p>

        <ul className="lg-lock__stars" aria-label="שש נקודות המדיניות">
          {stars.map((st, i) => (
            <li key={`${st.section}-${i}`}>
              <button
                type="button"
                aria-pressed={lit[i]}
                aria-controls={`${idPrefix}-card`}
                className="lg-lstar"
                data-side={st.side}
                data-corner={i > 1 ? `${st.y === body.y1 ? "t" : "b"}${st.x === body.x1 ? "l" : "r"}` : undefined}
                data-shackle={i === 0 || i === 1 ? "" : undefined}
                data-active={active === i ? "" : undefined}
                style={{ left: `${st.x}%`, top: `${st.y}%`, transitionDelay: inView && !tracing ? `${240 + i * 70}ms` : undefined }}
                onPointerDown={(e) => onStarDown(i, e)}
                onClick={() => onStarClick(i)}
              >
                <span className="lg-lstar__dot" aria-hidden="true" />
                <span className="lg-lstar__name">
                  <span className="lg-lstar__num" aria-hidden="true">
                    {two(i + 1)}
                  </span>
                  {st.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg-lock__card" id={`${idPrefix}-card`} aria-live="polite" data-float-avoid="">
        {locked ? (
          <div className="lg-lock__done">
            <p className="lg-lock__meta">
              <span className="lg-lock__meta-num">06 / 06</span>
              <span>הקבוצה הושלמה</span>
            </p>
            <h3 className="lg-lock__name">
              קבוצת <span className="nz-accent">המנעול</span>
            </h3>
            {star ? (
              <p className="lg-lock__summary">
                <strong>{star.name}: </strong>
                {star.summary}
              </p>
            ) : null}
            <p className="lg-lock__closing">המנעול סגור: המידע שלכם נשאר אצלכם, ויוצא רק כשאתם שולחים אותו.</p>
          </div>
        ) : star ? (
          <div>
            <p className="lg-lock__meta">
              <span className="lg-lock__meta-num">נקודה {two((active ?? 0) + 1)}</span>
              <span aria-hidden="true">/</span>
              <span>{two(n)}</span>
            </p>
            <h3 className="lg-lock__name">{star.name}</h3>
            <p className="lg-lock__summary">{star.summary}</p>
          </div>
        ) : (
          <div>
            <p className="lg-lock__meta">
              <span className="lg-lock__meta-num">00</span>
              <span aria-hidden="true">/</span>
              <span>{two(n)}</span>
            </p>
            <h3 className="lg-lock__name">החליקו מכוכב לכוכב</h3>
            <p className="lg-lock__summary">
              שימו אצבע על כוכב 01 והמשיכו דרך האחרים, כמו בנעילת טלפון. כל כוכב שנדלק מספר נקודה אחת מהמדיניות, ושישה כוכבים
              סוגרים את המנעול. אפשר גם להקיש עליהם אחד אחד.
            </p>
          </div>
        )}

        <div className="lg-lock__foot">
          <span className="lg-lock__bar" aria-hidden="true">
            {lit.map((on, i) => (
              <span key={i} data-on={on ? "" : undefined} />
            ))}
          </span>
          <span className="lg-lock__count">{locked ? "כל הנקודות נקראו" : `נדלקו ${count} מתוך ${n}`}</span>
          {star && (
            <a href={`#${star.section}`} className="nz-link lg-lock__to">
              <span className="nz-link__text">לסעיף המלא</span>
              <svg className="nz-link__arrow" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 4v11.5M5 11l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          )}
          {count > 0 && (
            <button type="button" className="lg-lock__reset" onClick={reset}>
              לפתוח מחדש
            </button>
          )}
        </div>
      </div>

      <ol className="lg-lock__fallback">
        {stars.map((st, i) => (
          <li key={i}>
            <strong>{st.name}: </strong>
            {st.summary} <a href={`#${st.section}`}>לסעיף המלא</a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PrivacyLock;
