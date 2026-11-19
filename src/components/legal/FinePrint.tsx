// Signature component: הכתב הקטן — bar magnifier (drag a lens over the fine print)
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { nobrParts } from "./content";

/**
 * /terms/ — "הכתב הקטן". The terms are set as what they look like in real life: a sheet of fine
 * print. A reading magnifier (a brass bar with a glass lens) lies on it; wherever the lens sits,
 * the fine print under it turns into one plain sentence, big enough to read at arm's length.
 * Drag the bar along the sheet (touch or mouse), tap a clause to send it there, or use the
 * arrows. When every clause has been under the lens, the sheet gets a stamp.
 *
 * Mechanics: the sheet is rendered twice in the same grid — the print layer, and the lens layer
 * on top of it, clipped (clip-path: inset) to the bar's band. Every clause cell stacks its fine
 * print and its plain sentence in one grid area, so both layers share one layout and the band
 * always frames whole clauses. Only clip-path and transform move.
 *
 * A11y: the bar is a slider (role="slider", arrows / Home / End / PageUp / PageDown), its
 * value text names the clause and a polite live region reads the plain sentence. The sheet
 * itself is a facsimile (aria-hidden): the binding text is the document below, and the plain
 * sentences are also listed for screen readers. No JS: the bar is hidden and every clause shows
 * its plain sentence under it. Reduced motion: the lens jumps instead of gliding.
 */
export interface FineClause {
  id: string;
  title: string;
  text: string;
  plain: string;
}
interface Props {
  clauses: FineClause[];
}

const two = (n: number) => String(n).padStart(2, "0");
/** Breathing room of the lens above and below a clause, px. */
const PAD = 5;

const FinePrint = ({ clauses }: Props) => {
  const n = clauses.length;
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => clauses.map((_, i) => i === 0));
  const [band, setBand] = useState<{ t: number; h: number; H: number } | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [said, setSaid] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const boxes = useRef<{ top: number; h: number }[]>([]);
  const grab = useRef<{ id: number; offset: number } | null>(null);

  const measure = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const layer = sheet.querySelector<HTMLElement>(".lg-fine__layer--print");
    if (!layer) return;
    /* offsets ignore the sheet's slight rotation (getBoundingClientRect would not) */
    const cells = layer.querySelectorAll<HTMLElement>(".lg-fine__clause");
    boxes.current = Array.from(cells).map((c) => ({ top: layer.offsetTop + c.offsetTop, h: c.offsetHeight }));
    return sheet.offsetHeight;
  }, []);

  /* the band for clause i (or for a free drag position) */
  const place = useCallback(
    (i: number, free: number | null) => {
      const H = measure();
      const b = boxes.current[i];
      if (!H || !b) return;
      const h = b.h + PAD * 2;
      const t = free === null ? b.top - PAD : Math.min(Math.max(free, -PAD), H - h + PAD);
      setBand({ t, h, H });
    },
    [measure],
  );

  useLayoutEffect(() => {
    place(idx, drag);
  }, [idx, drag, place]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => place(idx, drag));
    ro.observe(sheet);
    return () => ro.disconnect();
  }, [idx, drag, place]);

  const go = useCallback(
    (i: number, announce = true) => {
      const next = Math.max(0, Math.min(n - 1, i));
      setIdx(next);
      setSeen((s) => (s[next] ? s : s.map((v, k) => v || k === next)));
      if (announce) setSaid(`${clauses[next].title}: ${clauses[next].plain}`);
    },
    [clauses, n],
  );

  /* which clause is under the middle of the band */
  const clauseAt = (y: number) => {
    const bx = boxes.current;
    for (let i = 0; i < bx.length; i++) if (y < bx[i].top + bx[i].h) return i;
    return bx.length - 1;
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const sheet = sheetRef.current;
    if (!sheet || !band) return;
    const y = e.clientY - sheet.getBoundingClientRect().top;
    grab.current = { id: e.pointerId, offset: y - band.t };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no capture: the drag still follows while over the bar */
    }
    setDrag(band.t);
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    const sheet = sheetRef.current;
    if (!g || e.pointerId !== g.id || !sheet || !band) return;
    const t = e.clientY - sheet.getBoundingClientRect().top - g.offset;
    const i = clauseAt(t + band.h / 2);
    if (i !== idx) go(i, false);
    setDrag(t);
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    if (!g || e.pointerId !== g.id) return;
    grab.current = null;
    setDrag(null);
    setSaid(`${clauses[idx].title}: ${clauses[idx].plain}`);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "PageDown") next = idx + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "PageUp") next = idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0 || next >= n) return;
    e.preventDefault();
    go(next);
    window.requestAnimationFrame(() => barRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const done = seen.every(Boolean);
  const vars = band
    ? ({ "--t": `${band.t}px`, "--h": `${band.h}px`, "--b": `${Math.max(0, band.H - band.t - band.h)}px` } as CSSProperties)
    : undefined;
  const c = clauses[idx];

  const layer = (kind: "print" | "lens") => (
    <div className={`lg-fine__layer lg-fine__layer--${kind}`} aria-hidden="true">
      <p className="lg-fine__mast">
        <span>תנאי שימוש</span>
        <bdi dir="ltr">nz-web.com</bdi>
      </p>
      {clauses.map((cl, i) => (
        <div
          key={cl.id}
          className="lg-fine__clause"
          data-on={i === idx ? "" : undefined}
          onClick={kind === "print" ? () => go(i) : undefined}
          onPointerEnter={
            kind === "print"
              ? (e) => {
                  if (e.pointerType === "mouse" && !grab.current) go(i, false);
                }
              : undefined
          }
        >
          <p className="lg-fine__title">
            <span className="lg-fine__num">§ {two(i + 1)}</span> {cl.title}
          </p>
          <div className="lg-fine__cell">
            <p className="lg-fine__legal">
              {/* a brand / domain never splits at its hyphen ("NZ-" | "web") */}
              {nobrParts(cl.text).map((p, k) =>
                p.ltr ? (
                  <bdi key={k} dir="ltr" className={p.nobr ? "lg-nobr" : undefined}>
                    {p.t}
                  </bdi>
                ) : (
                  p.t
                ),
              )}
            </p>
            <p className="lg-fine__plain">{cl.plain}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="lg-fine" data-ready={band ? "" : undefined} data-drag={drag !== null ? "" : undefined} data-done={done ? "" : undefined}>
      <div ref={sheetRef} className="lg-fine__sheet" style={vars}>
        {layer("print")}
        {layer("lens")}

        {/* the foot of the sheet: where the stamp lands once every clause was under the lens */}
        <p className="lg-fine__foot" aria-hidden="true">
          <span>אישור קריאה</span>
          <span className="lg-fine__foot-line" />
          <span className="lg-fine__stamp">
            <span>נקרא</span>
            <small>עד הסוף</small>
          </span>
        </p>

        <div
          ref={barRef}
          className="lg-fine__bar"
          role="slider"
          tabIndex={0}
          aria-label="זכוכית מגדלת על תנאי השימוש"
          aria-orientation="vertical"
          aria-valuemin={1}
          aria-valuemax={n}
          aria-valuenow={idx + 1}
          aria-valuetext={`סעיף ${idx + 1} מתוך ${n}: ${c.title}`}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <span className="lg-fine__rim lg-fine__rim--top" aria-hidden="true" />
          <span className="lg-fine__rim lg-fine__rim--bottom" aria-hidden="true" />
          <span className="lg-fine__grip" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="lg-fine__tag" aria-hidden="true">
            בשפה פשוטה
          </span>
        </div>

      </div>

      <div className="lg-fine__panel">
        <p className="lg-fine__where">
          <span className="lg-fine__where-num">
            סעיף {two(idx + 1)} / {two(n)}
          </span>
          <span className="lg-fine__where-name">{c.title}</span>
        </p>
        <div className="lg-fine__steps">
          <button type="button" className="lg-fine__step" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="הסעיף הקודם">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 15.5V4M5 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button type="button" className="lg-fine__step" onClick={() => go(idx + 1)} disabled={idx === n - 1} aria-label="הסעיף הבא">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 4v11.5M5 11l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <a href={`#${c.id}`} className="nz-link lg-fine__to">
            <span className="nz-link__text">לנוסח המלא</span>
          </a>
        </div>
        <p className="lg-fine__seen">
          <span className="lg-fine__dots" aria-hidden="true">
            {seen.map((s, i) => (
              <span key={i} data-on={s ? "" : undefined} />
            ))}
          </span>
          {done ? "קראתם את כל הכתב הקטן" : `${seen.filter(Boolean).length} מתוך ${n} סעיפים תחת הזכוכית`}
        </p>
      </div>

      <p className="nz-sr" aria-live="polite">
        {said}
      </p>
      <ol className="nz-sr lg-fine__list">
        {clauses.map((cl) => (
          <li key={cl.id}>
            {cl.title}: {cl.plain}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default FinePrint;
