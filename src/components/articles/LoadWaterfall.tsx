// Signature component: מפל הטעינה — reschedule a waterfall by hand (drag each bar into its dashed slot)
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import "./LoadWaterfall.css";

/**
 * "The loading waterfall" (website-speed-fix). The chart developers read in DevTools, made
 * readable: one sample home page on a phone, its requests as bars on a time axis that runs from
 * right to left (RTL), grouped into the article's five problems. A vermilion flag marks the moment
 * the main content appears (LCP); a dashed line marks Google's "good" threshold from web.dev.
 *
 * The reader fixes the page by moving the bars themselves: every lane shows a dashed outline of
 * where its bars belong once fixed (index.html squeezed short, the blocking files squeezed, the
 * scripts pushed past the flag, hero.jpg pulled earlier and lighter, the repeat visit served from
 * the cache). Drag a lane's bar towards its outline (touch-action pan-y, so the page still
 * scrolls) and the whole chart reflows live under the finger, flag included; let go past halfway
 * and it settles fixed, otherwise it springs back. Single-pointer alternative: tap the dashed
 * outline (or the faint "before" outline to undo). Keyboard: each lane is a role=slider
 * (arrows in the drag direction, Home/End, Enter toggles). Times are illustrative (no axis
 * numbers). aria-live narration + an "ahead of / behind the target" readout.
 * No JS: the five problems and their fixes are listed.
 */

type Fix = "img" | "js" | "server" | "block" | "cache";
type Fx = Record<Fix, number>;

const GROUPS: { key: Fix; name: string; fix: string; say: string; how: string }[] = [
  { key: "img", name: "תמונה ראשית כבדה", fix: "פורמט מודרני, גודל נכון ועדיפות גבוהה", say: "התמונה קלה בהרבה ומתחילה לרדת מוקדם. ברוב האתרים זה התיקון שמזיז הכי הרבה.", how: "גררו את hero.jpg ימינה, אל המתאר: מוקדם וקל יותר" },
  { key: "js", name: "JavaScript ותוספים", fix: "הסרה של מה שמיותר ודחייה של השאר", say: "תוסף הצ'אט הוסר, והשאר נטענים אחרי שהתוכן הראשי כבר על המסך.", how: "גררו את הסקריפטים שמאלה, אל מעבר לדגל" },
  { key: "server", name: "שרת איטי", fix: "עמוד מוכן מראש ורשת הפצה", say: "השרת מתחיל לשלוח את העמוד כמעט מיד, וכל השאר מתחיל מוקדם יותר.", how: "כווצו את index.html: גררו את הקצה שלו ימינה" },
  { key: "block", name: "קבצים שחוסמים את הציור", fix: "CSS קריטי בתוך העמוד וגופן מקומי", say: "הדפדפן כבר לא מחכה לקובץ העיצוב ולגופן החיצוני כדי לצייר את העמוד.", how: "כווצו את קובץ העיצוב והגופן: גררו ימינה" },
  { key: "cache", name: "מטמון לא מוגדר", fix: "תקופת מטמון ארוכה לקבצים קבועים", say: "בביקור חוזר, הקבצים הקבועים נטענים מהדפדפן עצמו, ורק העמוד יורד מחדש.", how: "ביקור חוזר: כווצו את ההורדה החוזרת, גררו ימינה" },
];

const T = 7.4; /* the axis length, in illustrative units */
const TARGET = 2.5;
const ZERO: Fx = { img: 0, js: 0, server: 0, block: 0, cache: 0 };
/* the lanes whose bars move earlier (right in RTL) when fixed; the scripts move later */
const LATER: Record<Fix, boolean> = { img: false, js: true, server: false, block: false, cache: false };

interface Bar {
  label: string;
  start: number;
  dur: number;
  kind: "doc" | "css" | "font" | "js" | "img" | "cached";
  after?: boolean;
  gone?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function model(f: Fx) {
  const html = lerp(1.9, 0.55, f.server);
  const css = lerp(1.0, 0.12, f.block);
  const font = lerp(1.15, 0.35, f.block);
  const render = html + lerp(1.15, 0.12, f.block);
  const heroStart = html + lerp(0.55, 0.08, f.img) + lerp(0.95, 0, f.js);
  const heroEnd = heroStart + lerp(3.1, 0.55, f.img);
  const lcp = Math.max(render, heroEnd);
  const jsStart = lerp(html + 0.15, lcp + 0.08, f.js);
  const bars: Record<Fix, Bar[]> = {
    server: [{ label: "index.html", start: 0, dur: html, kind: "doc" }],
    block: [
      { label: "style.css", start: html, dur: css, kind: "css" },
      { label: "font.woff2", start: html, dur: font, kind: "font" },
    ],
    js: [
      { label: "chat-widget.js", start: jsStart, dur: lerp(1.3, 0.5, f.js), kind: "js", after: f.js >= 0.5, gone: f.js },
      { label: "animation.js", start: jsStart + lerp(0.25, 0, f.js), dur: lerp(1.1, 0.6, f.js), kind: "js", after: f.js >= 0.5 },
      { label: "share.js", start: jsStart + lerp(0.5, 0.15, f.js), dur: lerp(0.9, 0.45, f.js), kind: "js", after: f.js >= 0.5 },
    ],
    img: [{ label: "hero.jpg", start: heroStart, dur: heroEnd - heroStart, kind: "img" }],
    cache: [
      { label: "index.html", start: 0, dur: html, kind: "doc" },
      { label: f.cache >= 0.5 ? "מהמטמון" : "הכול יורד מחדש", start: html, dur: lerp(Math.max(css, font) + (heroEnd - heroStart) * 0.6, 0.1, f.cache), kind: f.cache >= 0.5 ? "cached" : "css" },
    ],
  };
  /* the point the finger holds in each lane: it moves exactly as far as the pointer */
  const grip: Record<Fix, number> = {
    server: html,
    block: html + Math.max(css, font),
    js: jsStart,
    img: heroEnd,
    cache: html + bars.cache[1].dur,
  };
  return { bars, lcp, grip };
}

/* an outline is drawn only for bars that actually move */
const moves = (a: Bar, b: Bar) => Math.abs(a.start - b.start) + Math.abs(a.dur - b.dur) > 0.03;
const frac = (v: number) => Math.max(0, Math.min(1, v / T));
const pct = (v: number) => `${frac(v) * 100}%`;

function BarEl({ b, ghost }: { b: Bar; ghost?: "to" | "from" }) {
  const end = b.start + b.dur;
  /* the file name sits above its bar, anchored at the bar's start; late bars anchor at their end so
     the name never runs off the axis */
  const anchorEnd = frac(b.start) > 0.52;
  if (ghost)
    return <span className={`as-wf__bar is-ghost is-ghost--${ghost}`} data-ghost={ghost} style={{ insetInlineStart: pct(b.start), width: pct(b.dur) }} />;
  return (
    <>
      <span
        className={`as-wf__bar as-wf__bar--${b.kind}${b.after ? " is-after" : ""}`}
        style={{ insetInlineStart: pct(b.start), width: pct(b.dur), opacity: b.gone !== undefined ? 1 - b.gone * 0.7 : undefined }}
      />
      {b.label && (
        <span
          className={`as-wf__file${anchorEnd ? " is-end" : ""}`}
          style={anchorEnd ? { insetInlineEnd: `${(1 - frac(end)) * 100}%` } : { insetInlineStart: pct(b.start) }}
        >
          <bdi>{b.label}</bdi>
          {b.gone !== undefined && b.gone >= 0.5 && <span className="as-wf__gone"> · הוסר</span>}
        </span>
      )}
    </>
  );
}

const LoadWaterfall = () => {
  const [fx, setFx] = useState<Fx>(ZERO);
  const fxRef = useRef<Fx>(ZERO);
  const [drag, setDrag] = useState<Fix | null>(null);
  const [say, setSay] = useState("");
  const [nudge, setNudge] = useState<Fix | null>(null);
  const laneRefs = useRef<Partial<Record<Fix, HTMLDivElement | null>>>({});
  const gesture = useRef<{ k: Fix; x0: number; t0: number; px: number; sign: number; moved: boolean; id: number } | null>(null);
  const { bars, lcp } = model(fx);
  const ahead = lcp <= TARGET;
  const count = Object.values(fx).filter((v) => v >= 1).length;

  useEffect(() => {
    if (!nudge) return;
    const t = window.setTimeout(() => setNudge(null), 1400);
    return () => window.clearTimeout(t);
  }, [nudge]);

  const apply = (next: Fx) => {
    fxRef.current = next;
    setFx(next);
  };

  /* settle a lane at 0 or 1 and narrate the change */
  const settle = (k: Fix, to: 0 | 1, prev: number) => {
    const next = { ...fxRef.current, [k]: to };
    apply(next);
    const wasFixed = prev >= 1;
    if (to === 1 && !wasFixed) {
      const g = GROUPS.find((x) => x.key === k)!;
      const m = model(next);
      setSay(`${g.name}: תוקן. ${g.say} ${m.lcp <= TARGET ? "התוכן הראשי מופיע עכשיו לפני היעד." : "התוכן הראשי עדיין מופיע אחרי היעד."}`);
    } else if (to === 0 && wasFixed) {
      setSay(`${GROUPS.find((x) => x.key === k)!.name}: חזר למצב האיטי.`);
    } else if (to === 0 && prev > 0) {
      setSay("עוד קצת: שחררו רק כשהפס עבר את חצי הדרך אל המתאר המקווקו.");
    }
  };

  const onDown = (k: Fix) => (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = laneRefs.current[k];
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    const m0 = model({ ...fxRef.current, [k]: 0 }).grip[k];
    const m1 = model({ ...fxRef.current, [k]: 1 }).grip[k];
    const px = Math.max(48, (Math.abs(m1 - m0) / T) * w);
    const rtl = getComputedStyle(el).direction === "rtl";
    /* time grows towards inline-end: left in RTL. Fixing moves the grip earlier, except for scripts */
    const later = LATER[k];
    const sign = (rtl ? -1 : 1) * (later ? 1 : -1);
    gesture.current = { k, x0: e.clientX, t0: fxRef.current[k], px, sign, moved: false, id: e.pointerId };
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x0;
    if (!g.moved) {
      if (Math.abs(dx) < 6) return;
      g.moved = true;
      setDrag(g.k);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety */
      }
    }
    const t = Math.max(0, Math.min(1, g.t0 + (dx * g.sign) / g.px));
    apply({ ...fxRef.current, [g.k]: t });
  };

  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    setDrag(null);
    if (g.moved) {
      const t = fxRef.current[g.k];
      settle(g.k, t >= 0.5 ? 1 : 0, g.t0);
      return;
    }
    /* a tap: on the dashed outline it moves the bars there; anywhere else it shows the way */
    const ghost = (e.target as HTMLElement).closest?.("[data-ghost]")?.getAttribute("data-ghost");
    if (ghost === "to") settle(g.k, 1, g.t0);
    else if (ghost === "from") settle(g.k, 0, g.t0);
    else {
      setNudge(g.k);
      setSay(GROUPS.find((x) => x.key === g.k)!.how + ". אפשר גם להקיש על המתאר המקווקו.");
    }
  };

  const onCancel = () => {
    const g = gesture.current;
    gesture.current = null;
    setDrag(null);
    if (g?.moved) settle(g.k, fxRef.current[g.k] >= 0.5 ? 1 : 0, g.t0);
  };

  const onKey = (k: Fix) => (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = fxRef.current[k];
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    /* the arrow that points the way the bars travel when fixed moves them towards the outline */
    const towardKey = LATER[k] ? (rtl ? "ArrowLeft" : "ArrowRight") : rtl ? "ArrowRight" : "ArrowLeft";
    const awayKey = towardKey === "ArrowLeft" ? "ArrowRight" : "ArrowLeft";
    let to: number | null = null;
    if (e.key === towardKey || e.key === "ArrowUp" || e.key === "PageUp") to = Math.min(1, Math.round((cur + 0.25) * 4) / 4);
    else if (e.key === awayKey || e.key === "ArrowDown" || e.key === "PageDown") to = Math.max(0, Math.round((cur - 0.25) * 4) / 4);
    else if (e.key === "End") to = 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "Enter" || e.key === " ") to = cur >= 1 ? 0 : 1;
    if (to === null) return;
    e.preventDefault();
    if (to === 1 || to === 0) settle(k, to as 0 | 1, cur);
    else apply({ ...fxRef.current, [k]: to });
  };

  const reset = () => {
    apply(ZERO);
    setSay("חזרנו לדף האיטי.");
  };

  return (
    <div className="as-wf">
      <ol className="as-static">
        {GROUPS.map((g) => (
          <li key={g.key}>
            <p className="as-static__q">{g.name}</p>
            <p className="as-static__a">
              <strong>מה עושים:</strong> {g.fix}. {g.say}
            </p>
          </li>
        ))}
      </ol>

      <div className="as-wf__live as-live">
        <div className={`as-wf__readout${ahead ? " is-ahead" : ""}`}>
          <div className="as-wf__r-text">
            <p className="as-wf__r-label">התוכן הראשי מופיע</p>
            <p className="as-wf__r-value">{ahead ? "לפני היעד" : "אחרי היעד"}</p>
          </div>
          <div className="as-wf__gauge" aria-hidden="true" style={{ ["--lcp" as string]: frac(lcp), ["--target" as string]: TARGET / T }}>
            <span className="as-wf__gauge-ok" />
            <span className="as-wf__gauge-flag" />
          </div>
          <p className="as-wf__r-note">
            עמוד לדוגמה בנייד · זמנים להמחשה · היעד של גוגל ל-<span dir="ltr">LCP</span>: עד 2.5 שניות
          </p>
        </div>

        <div
          className={`as-wf__chart${drag ? " is-dragging" : ""}`}
          style={{ ["--lcp" as string]: frac(lcp), ["--target" as string]: TARGET / T }}
        >
          <div className="as-wf__axis" aria-hidden="true">
            <span className="as-wf__flag-l">התוכן הראשי</span>
          </div>
          <ul className="as-wf__groups">
            {GROUPS.map((g) => {
              const t = fx[g.key];
              const to = model({ ...fx, [g.key]: 1 }).bars[g.key];
              const from = model({ ...fx, [g.key]: 0 }).bars[g.key];
              const done = t >= 1;
              return (
                <li key={g.key} className={`as-wf__row${done ? " is-fixed" : ""}${drag === g.key ? " is-drag" : ""}${nudge === g.key ? " is-nudge" : ""}`}>
                  <p className="as-wf__head" id={`as-wf-h-${g.key}`}>
                    <span className="as-wf__name">{g.name}</span>
                    <span className="as-wf__state">{done ? `תוקן: ${g.fix}` : g.how}</span>
                  </p>
                  <div
                    ref={(el) => {
                      laneRefs.current[g.key] = el;
                    }}
                    className={`as-wf__lane${LATER[g.key] ? " is-later" : ""}`}
                    role="slider"
                    tabIndex={0}
                    aria-labelledby={`as-wf-h-${g.key}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(t * 100)}
                    aria-valuetext={done ? `תוקן: ${g.fix}` : t > 0 ? `בדרך לתיקון, ${Math.round(t * 100)} אחוז` : "לא תוקן"}
                    onPointerDown={onDown(g.key)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onCancel}
                    onKeyDown={onKey(g.key)}
                    style={{ height: `${bars[g.key].length * 34 + 10}px` }}
                  >
                    {bars[g.key].map((b, k) => (
                      <div key={k} className="as-wf__track" style={{ top: `${k * 34 + 6}px` }}>
                        {!done && to[k] && moves(to[k], b) && <BarEl b={to[k]} ghost="to" />}
                        {done && from[k] && moves(from[k], b) && <BarEl b={from[k]} ghost="from" />}
                        <BarEl b={b} />
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
          <span className="as-wf__axis-t" aria-hidden="true">
            זמן ←
          </span>
          <span className="as-wf__target-l" aria-hidden="true">
            היעד
          </span>
        </div>

        <div className="as-wf__foot">
          <p className="as-wf__say" aria-live="polite">
            {say || "כל פס הוא קובץ שהעמוד מוריד. גררו כל פס אל המתאר המקווקו שלו, וראו איך הדגל של התוכן הראשי זז אחריו."}
          </p>
          {count > 0 && (
            <button type="button" className="as-btn as-btn--quiet" onClick={reset}>
              מההתחלה
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadWaterfall;
