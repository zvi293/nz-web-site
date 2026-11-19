// Signature component: סרט אחד, שלושה מסכים — drag-to-resize
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import "./three-screens.css";

/**
 * "סרט אחד, שלושה מסכים" — one business website, stretched by hand from a phone to a desktop.
 * Drag the handle on the screen's edge (or tap the ruler, or the three stops): the mini site's
 * width changes live and its layout reflows — the menu folds into a burger, the hero splits into
 * two columns, the cards go from one to three. Same content, every screen.
 *
 * How it scales: the track is a CSS container; 1 "virtual px" = 100cqw / 1280 (--u), so the mini
 * site is drawn at true proportions at any stage size without JS. JS only sets --v (the virtual
 * width) and the layout bucket. Keyboard: the handle is a slider (←/→, PageUp/PageDown, Home/End).
 * The free wall beside a narrow screen carries "מה השתנה בפריסה": three live notes on what the
 * current layout does (hidden when the screen is too wide to leave room for them).
 * SSR / no JS = the phone layout. Reduced motion: no hint nudge, no width transitions.
 */
const VMIN = 360;
/* The widest "desktop": 1280 virtual px, or 1024 on phones (where the stage is ~330px wide and
   the phone would be too small to read). Must match --vmax in three-screens.css. */
const WIDE_MQ = "(min-width: 768px)";
type Layout = "phone" | "tablet" | "desktop";
const stopsFor = (vmax: number) =>
  [
    { v: 390, name: "נייד", layout: "phone" },
    { v: 768, name: "טאבלט", layout: "tablet" },
    { v: vmax, name: "מחשב", layout: "desktop" },
  ] as { v: number; name: string; layout: Layout }[];

const layoutOf = (v: number): Layout => (v < 600 ? "phone" : v < 1000 ? "tablet" : "desktop");
const LAYOUT_TEXT: Record<Layout, string> = {
  phone: "פריסת נייד: תפריט מקופל, עמודה אחת",
  tablet: "פריסת טאבלט: תמונה וטקסט זה לצד זה, שני כרטיסים בשורה",
  desktop: "פריסת מחשב: תפריט מלא, שלושה כרטיסים בשורה",
};

const NOTES: Record<Layout, string[]> = {
  phone: ["התפריט מתקפל לכפתור אחד", "עמודה אחת: כותרת, ואחריה התמונה", "הכרטיסים אחד מתחת לשני"],
  tablet: ["התפריט נפתח לשורה מלאה", "טקסט ותמונה זה לצד זה", "שני כרטיסים בשורה"],
  desktop: ["תפריט מלא וכפתור וואטסאפ", "כותרת גדולה ויותר אוויר", "שלושה כרטיסים בשורה"],
};

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

const ThreeScreens = () => {
  const [v, setV] = useState(390);
  const [vmax, setVmax] = useState(1280);
  const [snapping, setSnapping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [trackW, setTrackW] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; v: number; k: number } | null>(null);
  const touched = useRef(false);
  const layout = layoutOf(v);
  const STOPS = stopsFor(vmax);
  const clamp = (x: number) => Math.round(Math.min(vmax, Math.max(VMIN, x)));

  useEffect(() => {
    const mq = window.matchMedia(WIDE_MQ);
    const sync = () => {
      const next = mq.matches ? 1280 : 1024;
      setVmax(next);
      setV((cur) => Math.min(cur, next));
    };
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  /* track width → whether the free wall beside the screen has room for the notes */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackW(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const freePx = trackW ? trackW - (v / vmax) * trackW - 2 * Math.max(3, (trackW / vmax) * 12) : 0;
  const notesOn = freePx > 176;

  /** px per virtual px, measured now. */
  const scale = () => (trackRef.current ? trackRef.current.clientWidth / vmax : 1);

  const snapTo = (target: number) => {
    touched.current = true;
    setSnapping(motionOn());
    setV(clamp(target));
  };

  /* One quiet hint the first time the exhibit is seen: the screen breathes out and back. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (!motionOn()) return;
        timers.push(
          window.setTimeout(() => {
            if (touched.current) return;
            setSnapping(true);
            setV(640);
          }, 700),
          window.setTimeout(() => {
            if (touched.current) return;
            setV(390);
          }, 1700),
        );
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const onDown = (e: ReactPointerEvent<HTMLElement>) => {
    touched.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, v, k: scale() };
    setSnapping(false);
    setDragging(true);
  };
  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    // RTL: the screen is anchored on the right; dragging left widens it.
    setV(clamp(d.v + (d.x - e.clientX) / d.k));
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: 20, ArrowUp: 20, ArrowRight: -20, ArrowDown: -20, PageUp: 120, PageDown: -120 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      touched.current = true;
      setSnapping(false);
      setV((cur) => clamp(cur + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      snapTo(VMIN);
    } else if (e.key === "End") {
      e.preventDefault();
      snapTo(vmax);
    }
  };

  /* Tap on the ruler: jump the edge there. */
  const onRuler = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    snapTo((rect.right - e.clientX) / scale());
  };

  return (
    <div className={cn("ts", snapping && "is-snapping", dragging && "is-dragging")} style={{ ["--v" as string]: v }} data-layout={layout}>
      <div className="ts__bar">
        <div className="ts__stops" role="group" aria-label="קפיצה לגודל מסך">
          {STOPS.map((s) => (
            <button
              key={s.layout}
              type="button"
              className={cn("ts__stop", layout === s.layout && "is-on")}
              aria-pressed={layout === s.layout}
              onClick={() => snapTo(s.v)}
            >
              <span className={cn("ts__glyph", `ts__glyph--${s.layout}`)} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
        <p className="ts__readout" aria-hidden="true">
          <span className="ts__px">
            <bdi dir="ltr">{v}px</bdi>
          </span>
          <span className="ts__layout">{STOPS.find((s) => s.layout === layout)!.name}</span>
        </p>
      </div>

      <div className="ts__stage">
        <div ref={trackRef} className="ts__track">
          <span className="ts__ghost ts__ghost--tablet" aria-hidden="true">
            <span>טאבלט</span>
          </span>
          <span className="ts__ghost ts__ghost--desktop" aria-hidden="true">
            <span>מחשב</span>
          </span>
          <div className={cn("ts__notes", notesOn && "is-on")} aria-hidden="true">
            <p className="ts__notes-head">מה השתנה בפריסה</p>
            <ol key={layout}>
              {NOTES[layout].map((n, i) => (
                <li key={n} style={{ ["--k" as string]: i }}>
                  <span className="ts__notes-num">{i + 1}</span>
                  {n}
                </li>
              ))}
            </ol>
          </div>
          <div className="ts__frame">
            <div className="ts-site" aria-hidden="true">
              <div className="ts-site__bar">
                <span className="ts-site__logo">
                  אדמה<i />
                </span>
                <span className="ts-site__nav">
                  <span>סדנאות</span>
                  <span>כלים</span>
                  <span>אודות</span>
                  <span>יצירת קשר</span>
                </span>
                <span className="ts-site__pill">וואטסאפ</span>
                <span className="ts-site__burger">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="ts-site__hero">
                <div className="ts-site__copy">
                  <span className="ts-site__kicker">סטודיו לקרמיקה בגליל</span>
                  <span className="ts-site__h">כלים שנעשים ביד, אחד אחד</span>
                  <span className="ts-site__lines">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="ts-site__cta">לקביעת ביקור</span>
                </div>
                <div className="ts-site__img">
                  <span className="ts-vase ts-vase--a" />
                  <span className="ts-vase ts-vase--b" />
                  <span className="ts-vase ts-vase--c" />
                </div>
              </div>
              <div className="ts-site__cards">
                {["סדנאות", "כלים לבית", "הזמנות מיוחדות"].map((t, i) => (
                  <span key={t} className="ts-card" style={{ ["--c" as string]: i }}>
                    <span className="ts-card__img" />
                    <span className="ts-card__t">{t}</span>
                    <span className="ts-card__l" />
                    <span className="ts-card__l ts-card__l--short" />
                  </span>
                ))}
              </div>
            </div>

            <div
              className="ts__handle"
              role="slider"
              tabIndex={0}
              aria-label="רוחב המסך של האתר לדוגמה"
              aria-orientation="horizontal"
              aria-valuemin={VMIN}
              aria-valuemax={vmax}
              aria-valuenow={v}
              aria-valuetext={`${v} פיקסלים, ${LAYOUT_TEXT[layout]}`}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={onKey}
            >
              <span className="ts__grip" aria-hidden="true" />
            </div>
          </div>

          <div className="ts__ruler" onPointerDown={onRuler} aria-hidden="true">
            <span className="ts__ruler-line" />
            {STOPS.map((s) => (
              <span
                key={s.layout}
                className={cn("ts__tick", s.layout === "desktop" && "ts__tick--end", layout === s.layout && "is-on")}
                style={{ ["--at" as string]: s.layout === "desktop" ? "var(--vmax)" : s.v }}
              >
                <span className="ts__tick-label">
                  {s.name} <bdi dir="ltr">{s.v}</bdi>
                </span>
              </span>
            ))}
            <span className="ts__marker" />
          </div>
        </div>
      </div>

      <p className="nz-sr" aria-live="polite">
        {LAYOUT_TEXT[layout]}
      </p>
    </div>
  );
};

export default ThreeScreens;
