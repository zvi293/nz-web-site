// Signature component: חוגת הזמן — rotary dial
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import "./time-dial.css";

/**
 * "חוגת הזמן" — book a slot the way you'd dial an old brass telephone. Pick a day, then turn the
 * finger wheel (drag it round, tap a hole, or use the arrow keys — role=slider) until the time
 * you want sits under the vermilion stop at the top. Two brass gears behind the dial turn with
 * it. Taken slots are dark and the wheel skips them. "לקבוע את התור" stamps a confirmation card
 * (נקבע) and the slot becomes taken — the system never double-books.
 *
 * - Like a real rotary dial, the holes run COUNTER-clockwise from the stop and you pull CLOCKWISE
 *   to bring a later time under it (rot = +slot × STEP). A curved arrow on the plate shows the
 *   pull; on first view the wheel gives one small clockwise nudge (motion only); a drag against
 *   the stop springs back and says which way to turn (aria-live).
 * - Rotation is one CSS custom property (--rot, degrees) on the dial; the gears and the upright
 *   labels derive from it. Snapping is a CSS transition (off while dragging / reduced motion).
 * - Input lives on an HTML "grip" laid over the wheel (role=slider): touch-action:none works on
 *   HTML boxes (Chrome ignores it on SVG children), so a finger turns the wheel instead of
 *   panning the page, while the rest of the exhibit still scrolls. A tap is resolved from the
 *   pointer's angle and radius (no event-target lookups, so pointer capture cannot break it).
 * - SSR / no JS: the dial at the first free slot of the sample day; the controls that need JS
 *   (days, booking) are hidden and the card reads as an example.
 * - aria-live announces the selection and the booking.
 */
const TIMES = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "18:30"];
const N = TIMES.length;
const STEP = 38; // degrees between holes (8 holes over 266°, the gap is the finger stop's)
const DAYS = [
  { key: "a", short: "א׳", name: "יום ראשון", taken: [1, 4] },
  { key: "b", short: "ב׳", name: "יום שני", taken: [0, 2, 5] },
  { key: "c", short: "ג׳", name: "יום שלישי", taken: [3] },
  { key: "d", short: "ד׳", name: "יום רביעי", taken: [1, 2, 6] },
  { key: "e", short: "ה׳", name: "יום חמישי", taken: [0, 5, 7] },
];
const SERVICE = "טיפול פנים";

/* Geometry (SVG user units). */
const C = 180; // centre
const R_PLATE = 150;
const R_WHEEL = 128;
const R_HOLE = 92;
const HOLE = 25;

/** 2-decimal coordinates: server and client trig must print the same attribute strings. */
const round = (n: number) => Math.round(n * 100) / 100;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180; // 0° = 12 o'clock, clockwise
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))] as const;
}

/** A gear outline: `teeth` trapezoid teeth on a circle. */
function gearPath(cx: number, cy: number, r: number, teeth: number, depth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const seq: [number, number][] = [
      [a, r - depth],
      [a + step * 0.18, r],
      [a + step * 0.5, r],
      [a + step * 0.68, r - depth],
    ];
    for (const [ang, rad] of seq) pts.push(`${(cx + rad * Math.cos(ang)).toFixed(2)} ${(cy + rad * Math.sin(ang)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}
/* the pull arrow: an arc at r 162 from -58° to -16°, its head at the stop end (clockwise) */
const PULL_ARC = (() => {
  const [x0, y0] = polar(162, -58);
  const [x1, y1] = polar(162, -16);
  return `M${x0} ${y0} A162 162 0 0 1 ${x1} ${y1}`;
})();
const PULL_HEAD = (() => {
  const [x, y] = polar(162, -12);
  const [a1, b1] = polar(155, -19);
  const [a2, b2] = polar(169, -19);
  return `M${a1} ${b1} L${x} ${y} L${a2} ${b2}`;
})();
const GEAR_A = { cx: 52, cy: 318, r: 50, teeth: 16, ratio: -1.7 };
const GEAR_B = { cx: 318, cy: 328, r: 34, teeth: 11, ratio: 2.5 };

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

const firstFree = (taken: number[], from = 0) => {
  for (let d = 0; d < N; d++) {
    for (const i of [from + d, from - d]) if (i >= 0 && i < N && !taken.includes(i)) return i;
  }
  return -1;
};

const TimeDial = () => {
  const [day, setDay] = useState(2);
  const [booked, setBooked] = useState<Record<string, number[]>>({});
  const takenOf = (d: number) => [...DAYS[d].taken, ...(booked[DAYS[d].key] ?? [])];
  const [slot, setSlot] = useState(() => firstFree(DAYS[2].taken));
  const [rot, setRot] = useState(slot * STEP);
  const [dragging, setDragging] = useState(false);
  const [stamped, setStamped] = useState<{ day: number; slot: number } | null>(null);
  const [live, setLive] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ a0: number; r0: number; moved: number; x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const taken = takenOf(day);
  const full = taken.length >= N;

  const choose = (i: number, announce = true) => {
    if (i < 0 || i >= N || taken.includes(i)) return;
    setSlot(i);
    setRot(i * STEP);
    setStamped(null);
    if (announce) setLive(`${DAYS[day].name}, ${TIMES[i]}`);
    if (typeof navigator !== "undefined" && "vibrate" in navigator && motionOn()) navigator.vibrate?.(6);
  };

  const pickDay = (d: number) => {
    setDay(d);
    setStamped(null);
    const t = takenOf(d);
    const i = firstFree(t, slot);
    if (i >= 0) {
      setSlot(i);
      setRot(i * STEP);
      setLive(`${DAYS[d].name}, ${TIMES[i]}`);
    } else {
      setLive(`${DAYS[d].name}: אין שעות פנויות`);
    }
  };

  /* pointer → angle around the centre, in the dial's degrees (0 = top, clockwise) */
  const vecOf = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0, k: 1 };
    const b = svg.getBoundingClientRect();
    const k = b.width / 360;
    return { x: e.clientX - (b.left + C * k), y: e.clientY - (b.top + C * k), k };
  };
  const angleOf = (e: { clientX: number; clientY: number }) => {
    const { x, y } = vecOf(e);
    return (Math.atan2(y, x) * 180) / Math.PI + 90;
  };
  /** The hole under a pointer (svg geometry + the wheel's rotation), or -1. */
  const holeAt = (e: { clientX: number; clientY: number }) => {
    const { x, y, k } = vecOf(e);
    const r = Math.hypot(x, y) / k;
    if (r < R_HOLE - HOLE - 8 || r > R_HOLE + HOLE + 8) return -1;
    /* holes sit at -i × STEP on the wheel: measure counter-clockwise from the stop */
    let ccw = (((rot - ((Math.atan2(y, x) * 180) / Math.PI + 90)) % 360) + 360) % 360;
    if (ccw > 360 - STEP / 2) ccw -= 360;
    const i = Math.round(ccw / STEP);
    return i >= 0 && i < N && Math.abs(ccw - i * STEP) < STEP / 2 ? i : -1;
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { a0: angleOf(e), r0: rot, moved: 0, x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    let da = angleOf(e) - d.a0;
    if (da > 180) da -= 360;
    if (da < -180) da += 360;
    d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.x, e.clientY - d.y));
    const max = (N - 1) * STEP;
    let r = d.r0 + da;
    if (r < 0) r = r * 0.3; // rubber band past the ends
    if (r > max) r = max + (r - max) * 0.3;
    setRot(r);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;
    if (d.moved < 8 && e.type === "pointerup") {
      const i = holeAt(e);
      if (i >= 0 && !taken.includes(i)) return choose(i);
      setRot(slot * STEP);
      return;
    }
    /* pulled against the stop: spring back and say which way the wheel turns */
    if (rot < -STEP / 4) {
      setRot(slot * STEP);
      setLive("החוגה מסתובבת עם כיוון השעון, כמו בטלפון ישן. סובבו כך כדי להגיע לשעות מאוחרות יותר.");
      return;
    }
    if (rot > (N - 1) * STEP + STEP / 4) setLive(`${TIMES[N - 1]} היא השעה האחרונה ביום.`);
    const want = Math.round(rot / STEP);
    const i = firstFree(taken, Math.max(0, Math.min(N - 1, want)));
    if (i >= 0) choose(i);
    else setRot(slot * STEP);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const free = TIMES.map((_, i) => i).filter((i) => !taken.includes(i));
    const pos = free.indexOf(slot);
    let next: number | undefined;
    /* slider convention: Up / Right = a higher value = a later time */
    if (e.key === "ArrowUp" || e.key === "ArrowRight") next = free[Math.min(free.length - 1, pos + 1)];
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") next = free[Math.max(0, pos - 1)];
    if (e.key === "Home") next = free[0];
    if (e.key === "End") next = free[free.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    choose(next);
  };

  const book = () => {
    if (slot < 0 || taken.includes(slot)) return;
    const k = DAYS[day].key;
    setBooked((b) => ({ ...b, [k]: [...(b[k] ?? []), slot] }));
    setStamped({ day, slot });
    setLive(`התור נקבע: ${SERVICE}, ${DAYS[day].name} ב-${TIMES[slot]}. אישור נשלח, והשעה נחסמה ביומן.`);
  };
  const another = () => {
    setStamped(null);
    const i = firstFree(takenOf(day), slot);
    if (i >= 0) choose(i, false);
  };

  /* first view (motion only): one small clockwise nudge so the pull direction reads */
  const machineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = machineRef.current;
    if (!el || typeof IntersectionObserver === "undefined" || !motionOn()) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || e.intersectionRatio < 0.6) return;
        io.disconnect();
        if (drag.current) return;
        setRot((r) => r + 16);
        t = window.setTimeout(() => setRot((r) => r - 16), 520);
      },
      { threshold: [0.6] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  /* after booking, the slot is taken: the wheel waits on it (dark) until the next choice */
  useEffect(() => {
    if (stamped) cardRef.current?.querySelector<HTMLElement>(".tdl-card__again")?.focus({ preventScroll: true });
  }, [stamped]);

  const ok = slot >= 0 && !taken.includes(slot);
  const shown = stamped ?? { day, slot };

  return (
    <div className={"tdl" + (dragging ? " is-dragging" : "") + (stamped ? " is-stamped" : "")} style={{ ["--rot" as string]: rot }}>
      <div className="tdl__days" role="radiogroup" aria-label="יום">
        {DAYS.map((d, i) => (
          <button
            key={d.key}
            type="button"
            role="radio"
            aria-checked={i === day}
            tabIndex={i === day ? 0 : -1}
            className={"tdl__day" + (i === day ? " is-on" : "")}
            onClick={() => pickDay(i)}
            onKeyDown={(e) => {
              const m: Record<string, number> = { ArrowLeft: 1, ArrowDown: 1, ArrowRight: -1, ArrowUp: -1 };
              if (!(e.key in m)) return;
              e.preventDefault();
              const n = (i + m[e.key] + DAYS.length) % DAYS.length;
              pickDay(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
            }}
          >
            <span className="tdl__day-s">{d.short}</span>
            <span className="tdl__day-n">{d.name.replace("יום ", "")}</span>
          </button>
        ))}
      </div>

      <div className="tdl__machine" ref={machineRef}>
        <svg ref={svgRef} viewBox="0 0 360 380" className="tdl__svg" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="tdl-brass" cx="40%" cy="35%" r="75%">
              <stop offset="0" stopColor="#f6dc93" />
              <stop offset="0.45" stopColor="#c9963f" />
              <stop offset="1" stopColor="#6e4a1a" />
            </radialGradient>
            <radialGradient id="tdl-brass-dark" cx="40%" cy="35%" r="80%">
              <stop offset="0" stopColor="#b98a3e" />
              <stop offset="1" stopColor="#4a3112" />
            </radialGradient>
            <radialGradient id="tdl-hole" cx="50%" cy="40%" r="65%">
              <stop offset="0" stopColor="#1c1a18" />
              <stop offset="1" stopColor="#0a0908" />
            </radialGradient>
          </defs>

          {/* gears behind the dial */}
          {[GEAR_A, GEAR_B].map((g, gi) => (
            <g key={gi} className="tdl__gear" style={{ transformOrigin: `${g.cx}px ${g.cy}px`, ["--ratio" as string]: g.ratio }}>
              <path d={gearPath(g.cx, g.cy, g.r, g.teeth, g.r * 0.16)} fill="url(#tdl-brass)" stroke="#5a3c14" strokeWidth="1" />
              <circle cx={g.cx} cy={g.cy} r={g.r * 0.55} fill="none" stroke="#7a5520" strokeWidth="1.2" />
              {[0, 1, 2, 3, 4].map((k) => {
                const a = (k / 5) * Math.PI * 2;
                return <line key={k} x1={g.cx} y1={g.cy} x2={round(g.cx + g.r * 0.55 * Math.cos(a))} y2={round(g.cy + g.r * 0.55 * Math.sin(a))} stroke="#7a5520" strokeWidth="3" />;
              })}
              <circle cx={g.cx} cy={g.cy} r={g.r * 0.14} fill="#3a2810" />
            </g>
          ))}

          {/* the fixed plate with its hour ticks */}
          <circle cx={C} cy={C} r={R_PLATE} fill="url(#tdl-brass-dark)" />
          <circle cx={C} cy={C} r={R_PLATE - 3} fill="none" stroke="rgba(255,236,180,.35)" strokeWidth="1" />
          {TIMES.map((_, i) => {
            const [x1, y1] = polar(R_PLATE - 4, -i * STEP);
            const [x2, y2] = polar(R_PLATE - 12, -i * STEP);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,236,180,.55)" strokeWidth="1.5" />;
          })}

          {/* the finger wheel */}
          <g className="tdl__wheel">
            <circle cx={C} cy={C} r={R_WHEEL} className="tdl__wheel-disc" />
            {TIMES.map((t, i) => {
              const [x, y] = polar(R_HOLE, -i * STEP);
              const isTaken = taken.includes(i);
              return (
                <g key={t} data-i={i} className={"tdl__hole" + (isTaken ? " is-taken" : "") + (i === slot && !isTaken ? " is-on" : "")}>
                  <circle cx={x} cy={y} r={HOLE} className="tdl__hole-c" />
                  <text x={x} y={y + 4} textAnchor="middle" className="tdl__hole-t" style={{ transformOrigin: `${x}px ${y}px` }}>
                    {isTaken ? "תפוס" : t}
                  </text>
                </g>
              );
            })}
            <circle cx={C} cy={C} r={50} className="tdl__hub" />
          </g>

          {/* centre readout (does not turn) */}
          <text x={C} y={C - 6} textAnchor="middle" className="tdl__read-t">
            {full ? "—" : TIMES[slot]}
          </text>
          <text x={C} y={C + 18} textAnchor="middle" className="tdl__read-d">
            {DAYS[day].name}
          </text>

          {/* the pull: a curved arrow outside the plate, clockwise up to the stop */}
          <path d={PULL_ARC} className="tdl__pull" />
          <path d={PULL_HEAD} className="tdl__pull tdl__pull--head" />

          {/* the finger stop */}
          <path d={`M${C - 9} 14 L${C + 9} 14 L${C} 30 Z`} className="tdl__stop" />
        </svg>
        {/* the grip: an HTML circle over the finger wheel that takes touch, mouse and keys */}
        <div
          className="tdl__grip"
          role="slider"
          tabIndex={0}
          aria-label={`שעת התור, ${DAYS[day].name}`}
          aria-valuemin={0}
          aria-valuemax={N - 1}
          aria-valuenow={Math.max(0, slot)}
          aria-valuetext={full ? "אין שעות פנויות" : `${TIMES[slot]}${taken.includes(slot) ? ", תפוס" : ""}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        />
      </div>

      <div className="tdl__side">
        <div ref={cardRef} className={"tdl-card" + (stamped ? " is-stamped" : "")}>
          <p className="tdl-card__k">{stamped ? "אישור תור" : "התור שבחרתם"}</p>
          <p className="tdl-card__t">
            <span className="tdl-card__svc">{SERVICE}</span>
            <span className="tdl-card__when">
              {DAYS[shown.day].name} · <bdi>{full && !stamped ? "—" : TIMES[shown.slot]}</bdi>
            </span>
          </p>
          <ul className="tdl-card__list">
            <li className={stamped ? "is-done" : ""}>{stamped ? "אישור נשלח ללקוח" : "אישור יישלח מיד ללקוח"}</li>
            <li className={stamped ? "is-done" : ""}>{stamped ? "השעה נחסמה ביומן" : "השעה תיחסם ביומן"}</li>
            <li className={stamped ? "is-done" : ""}>תזכורת תצא יום לפני</li>
          </ul>
          <span className="tdl-card__stamp" aria-hidden="true">
            <span>נקבע</span>
          </span>
          {stamped ? (
            <button type="button" className="tdl-card__again" onClick={another}>
              לקבוע תור נוסף
            </button>
          ) : (
            <button type="button" className="nz-btn nz-btn--primary tdl-card__go" onClick={book} disabled={!ok}>
              <span>לקבוע את התור</span>
            </button>
          )}
        </div>
        <p className="tdl__nojs">כך נראה כרטיס התור שהלקוח מקבל. כשהדפדפן מריץ JavaScript, אפשר לבחור יום, לסובב את החוגה ולקבוע.</p>
        <p className="tdl__note">השעה שנקבעה הופכת לתפוסה בחוגה, כמו במערכת אמיתית: אין שני לקוחות באותה שעה.</p>
      </div>

      <p className="nz-sr" aria-live="polite">
        {live}
      </p>
    </div>
  );
};

export default TimeDial;
