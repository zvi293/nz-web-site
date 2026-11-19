// Signature component: השביט — free-hand sewing (drag the needle and draw your own golden thread from hand to hand)
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { motionAllowed } from "@/lib/motion";
import { thanksCopy } from "./copy";

const c = thanksCopy.comet;

/* Everything is in the artwork's own pixels (1536 × 1024), drawn with xMidYMid slice like the art. */
type Pt = [number, number];
const ART_W = 1536;
const ART_H = 1024;
/** The giving hand's fingertip and the open palm. */
const START: Pt = [742, 318];
const PALM: Pt = [872, 642];
const ARRIVE = 72;
/** The suggested route (also the stitched thread without JS / with reduced motion): out around the comet and down. */
const SEGMENTS: [Pt, Pt, Pt, Pt][] = [
  [START, [905, 292], [1090, 372], [1040, 492]],
  [[1040, 492], [1004, 578], [940, 618], PALM],
];
const ROUTE_D = `M${SEGMENTS[0][0].join(" ")} C${SEGMENTS[0].slice(1).map((p) => p.join(" ")).join(", ")} C${SEGMENTS[1].slice(1).map((p) => p.join(" ")).join(", ")}`;

const bez = (p: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, d = 3 * u * t * t, e = t * t * t;
  return [a * p[0][0] + b * p[1][0] + d * p[2][0] + e * p[3][0], a * p[0][1] + b * p[1][1] + d * p[2][1] + e * p[3][1]];
};
/** The route sampled as points (pure maths, no DOM — also used for the server render). */
const ROUTE: Pt[] = SEGMENTS.flatMap((seg, si) => Array.from({ length: 40 }, (_, i) => bez(seg, (i + (si ? 1 : 0)) / 40))).concat([PALM]);

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const FULL = dist(START, PALM);
/** 0…1: how far the needle has come towards the palm (straight-line, so any route counts). */
const progressOf = (p: Pt) => Math.max(0, Math.min(1, 1 - dist(p, PALM) / FULL));
const stepOf = (p: Pt, prev: number) => {
  if (dist(p, PALM) < ARRIVE) return 3;
  const f = progressOf(p);
  return Math.max(prev, f >= 0.6 ? 2 : f >= 0.18 ? 1 : 0);
};

/** A soft path through the points: quadratic curves through the midpoints. */
const smooth = (pts: Pt[]) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const L = pts[pts.length - 1];
  return d + ` L${L[0].toFixed(1)} ${L[1].toFixed(1)}`;
};

interface Knot {
  n: number;
  at: Pt;
}
/** The knots of the fully stitched route (server render / reduced motion). */
const DEFAULT_KNOTS: Knot[] = [
  { n: 1, at: ROUTE[22] },
  { n: 2, at: ROUTE[52] },
  { n: 3, at: PALM },
];

/**
 * "השביט" — the comet (signature of /thank-you/).
 * The visitor holds the needle at the giving hand's fingertip and sews the golden thread across
 * the embroidered canvas with their own hand — any route they like — to the open palm. A knot is
 * tied where each "what happens now" step is reached, the step's title is written on the canvas
 * (aria-live), and the comet lands in the palm. "Sew it for me" stitches the suggested route.
 * Keyboard: the needle is a button — arrow keys move it, Enter sews the rest.
 * No JS / reduced motion: the thread is already stitched along the suggested route.
 */
const ThanksComet = () => {
  const [pts, setPts] = useState<Pt[]>(ROUTE);
  const [step, setStep] = useState(3);
  const [knots, setKnots] = useState<Knot[]>(DEFAULT_KNOTS);
  const [live, setLive] = useState(false);
  const [sewing, setSewing] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const ptsRef = useRef<Pt[]>(ROUTE);
  const stepRef = useRef(3);
  const knotsRef = useRef<Knot[]>(DEFAULT_KNOTS);
  const drag = useRef<number | null>(null);
  const raf = useRef(0);

  const needle = pts[pts.length - 1];
  const done = step >= 3;

  /* art px ⇄ screen px (xMidYMid slice) */
  const scale = box.w ? Math.max(box.w / ART_W, box.h / ART_H) : 0;
  const offX = (box.w - ART_W * scale) / 2;
  const offY = (box.h - ART_H * scale) / 2;
  const toArt = (x: number, y: number): Pt => {
    /* keep the needle on the visible part of the canvas */
    const minX = -offX / scale + 20, maxX = (box.w - offX) / scale - 20;
    const minY = -offY / scale + 20, maxY = (box.h - offY) / scale - 20;
    return [Math.max(minX, Math.min(maxX, (x - offX) / scale)), Math.max(minY, Math.min(maxY, (y - offY) / scale))];
  };

  const commit = (next: Pt[]) => {
    ptsRef.current = next;
    setPts(next);
    const p = next[next.length - 1];
    const s = stepOf(p, stepRef.current);
    if (s > stepRef.current) {
      const add: Knot[] = [];
      for (let k = stepRef.current + 1; k <= s; k++) add.push({ n: k, at: k === 3 ? PALM : p });
      knotsRef.current = [...knotsRef.current, ...add];
      setKnots(knotsRef.current);
      stepRef.current = s;
      setStep(s);
    }
  };

  const reset = () => {
    cancelAnimationFrame(raf.current);
    setSewing(false);
    ptsRef.current = [START];
    knotsRef.current = [];
    stepRef.current = 0;
    setPts([START]);
    setKnots([]);
    setStep(0);
  };

  const addPoint = (p: Pt) => {
    const cur = ptsRef.current;
    const last = cur[cur.length - 1];
    if (stepRef.current >= 3) return;
    if (dist(p, last) < 6) return;
    const next = dist(p, PALM) < ARRIVE ? [...cur, p, PALM] : [...cur, p];
    commit(next.length > 900 ? [next[0], ...next.slice(-899)] : next);
  };

  /** Sew the rest by itself: from wherever the needle is, along the suggested route's remaining part. */
  const sewForMe = () => {
    cancelAnimationFrame(raf.current);
    const from = ptsRef.current[ptsRef.current.length - 1];
    /* join the route at its nearest point that is not behind us */
    let j = 0;
    let best = Infinity;
    ROUTE.forEach((p, i) => {
      const d = dist(p, from);
      if (d < best) {
        best = d;
        j = i;
      }
    });
    const rest = ROUTE.slice(Math.max(j, 1));
    if (!motionAllowed()) {
      rest.forEach((p) => addPoint(p));
      return;
    }
    setSewing(true);
    const t0 = performance.now();
    const dur = 300 + 1500 * (rest.length / ROUTE.length);
    let k = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const upto = Math.round(t * rest.length);
      while (k < upto) addPoint(rest[k++]);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setSewing(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  /* Hydrated: measure the canvas; with motion, hand the needle to the visitor (an empty canvas). */
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (motionAllowed()) reset();
    setLive(true);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* mark the static "what happens now" list (full contrast always; only the knots fill in) */
  useEffect(() => {
    document.getElementById("ty-steps")?.setAttribute("data-step", String(step));
  }, [step]);

  /* ── the needle ───────────────────────────────────────────────────────── */
  const onDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (done || sewing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = e.pointerId;
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (drag.current !== e.pointerId) return;
    const r = rootRef.current!.getBoundingClientRect();
    addPoint(toArt(e.clientX - r.left, e.clientY - r.top));
  };
  const onUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (drag.current === e.pointerId) drag.current = null;
  };
  const onKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const d = 34;
    const [x, y] = ptsRef.current[ptsRef.current.length - 1];
    const map: Record<string, Pt> = {
      ArrowLeft: [x - d, y],
      ArrowRight: [x + d, y],
      ArrowUp: [x, y - d],
      ArrowDown: [x, y + d],
    };
    const to = map[e.key];
    if (!to || done) return;
    e.preventDefault();
    addPoint(to);
  };
  const onNeedleClick = () => {
    /* a click without a drag (or Enter / Space) sews the rest */
    if (drag.current === null && ptsRef.current.length <= 1) sewForMe();
  };

  const headX = needle[0] * scale + offX;
  const headY = needle[1] * scale + offY;
  const caption = step === 0 ? c.hint : `${String(step).padStart(2, "0")} · ${c.steps[step - 1].title}`;
  const threadD = smooth(pts);

  return (
    <div ref={rootRef} className={`ty-comet${live ? " is-live" : ""}${done ? " is-done" : ""}`}>
      <svg className="ty-comet__svg" viewBox={`0 0 ${ART_W} ${ART_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="ty-glow">
            <stop offset="0" stopColor="#ffe7a6" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#f2b544" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f2b544" stopOpacity="0" />
          </radialGradient>
        </defs>
        {!done && <path className="ty-comet__route" d={ROUTE_D} />}
        <circle className="ty-comet__palm" cx={PALM[0]} cy={PALM[1]} r={ARRIVE - 18} />
        {threadD && (
          <>
            <path className="ty-comet__shadow" d={threadD} transform="translate(2 4)" />
            <path className="ty-comet__thread" d={threadD} />
          </>
        )}
        {knots.map((k) => (
          <g key={k.n} className="ty-comet__knot" transform={`translate(${k.at[0].toFixed(1)} ${k.at[1].toFixed(1)})`}>
            <circle r="19" />
            <text y="8" textAnchor="middle">
              {k.n}
            </text>
          </g>
        ))}
        <g className="ty-comet__head" transform={`translate(${needle[0].toFixed(1)} ${needle[1].toFixed(1)})`}>
          <circle r={done ? 70 : 46} fill="url(#ty-glow)" />
          <circle r="9" className="ty-comet__core" />
        </g>
      </svg>

      {live && box.w > 0 && !done && (
        <button
          type="button"
          className="ty-needle"
          style={{ transform: `translate(${headX.toFixed(1)}px, ${headY.toFixed(1)}px) translate(-50%, -50%)` }}
          aria-label={c.needleLabel}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
          onClick={onNeedleClick}
        >
          <span className="ty-needle__eye" aria-hidden="true" />
        </button>
      )}

      <p className="ty-comet__caption" aria-live="polite">
        <span>{caption}</span>
      </p>

      <div className="ty-comet__bar">
        {done ? (
          <button type="button" className="ty-comet__btn" onClick={reset}>
            <span className="ty-comet__needle" aria-hidden="true" />
            {c.again}
          </button>
        ) : (
          <button type="button" className="ty-comet__btn" onClick={sewForMe} disabled={sewing}>
            <span className="ty-comet__needle" aria-hidden="true" />
            {c.sewForMe}
          </button>
        )}
      </div>
    </div>
  );
};

export default ThanksComet;
