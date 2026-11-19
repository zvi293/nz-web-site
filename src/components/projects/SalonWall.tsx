// Signature component: קיר הסלון — salon-hang wall + framed lightbox zoom
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowIcon, ExternalIcon } from "@/components/nz";
import { projectsCopy } from "./copy";
import { PHONE_CYCLE, WALL_ROWS, works, type Hang, type Work } from "./works";

type View = "desktop" | "mobile";
const c = projectsCopy.wall;
const L = projectsCopy.lightbox;
const VIEW_WORD: Record<View, string> = { desktop: "מחשב", mobile: "נייד" };

/* Works the hand-made plan does not place yet hang in an extra bottom row at a default size. */
const planned = new Set(WALL_ROWS.flat().map((h) => h.w));
const extraRow: Hang[] = works.map((_, i) => i).filter((i) => !planned.has(i)).map((i) => ({ w: i, d: 18, m: 5.6, o: "dm" as const }));
const ROWS = extraRow.length ? [...WALL_ROWS.slice(0, -1), extraRow, WALL_ROWS[WALL_ROWS.length - 1]] : WALL_ROWS;

/* The DOM (tab and reading order, and the phone column) runs 01 → last, then the reserved frame.
   The desktop salon composition places each hang by its row and slot in the plan (CSS order inside a
   wrapping row, with a break element closing every row) — the visual hang, not the reading order. */
type Placed = Hang & { order: number };
const PLACED: Placed[] = ROWS.flatMap((row, ri) => row.map((h, pi) => ({ ...h, order: ri * 10 + pi })));
const HANGS: Placed[] = [
  ...PLACED.filter((h) => h.w >= 0).sort((a, b) => a.w - b.w),
  ...PLACED.filter((h) => h.w < 0),
];
const BREAKS = ROWS.slice(0, -1).map((_, ri) => ri * 10 + 9);

/* ── body scroll pin without layout shift ── */
function pinScroll(on: boolean) {
  const html = document.documentElement;
  if (on) {
    html.style.setProperty("scrollbar-gutter", "stable");
    html.style.overflow = "hidden";
  } else {
    html.style.overflow = "";
    html.style.removeProperty("scrollbar-gutter");
  }
}

/** One framed screenshot on the wall — a link to its catalogue entry (no-JS), a lightbox opener with JS. */
const WallFrame = ({ work, view, onOpen }: { work: Work; view: View; onOpen: (e: ReactMouseEvent<HTMLAnchorElement>, w: Work, v: View) => void }) => {
  const shot = work[view];
  return (
    <a
      href={`#work-${work.id}`}
      className={`pj-frame pj-frame--${view}`}
      aria-label={c.openLabel(work.title, VIEW_WORD[view])}
      onClick={(e) => onOpen(e, work, view)}
    >
      <span className="pj-frame__mat">
        <img
          src={shot.src}
          srcSet={shot.srcSet}
          sizes={view === "desktop" ? "(min-width: 1024px) 31vw, 64vw" : "(min-width: 1024px) 10vw, 22vw"}
          width={shot.width}
          height={shot.height}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </span>
    </a>
  );
};

/**
 * "קיר הסלון" — the salon wall (signature of /projects/).
 * Every real work hangs as a pair of frames (desktop + phone screenshot) in a dense, hand-composed
 * salon hang around a centre line; a brass plaque numbers each pair; an empty frame is reserved
 * for the next work. Tap a frame → a framed lightbox (<dialog>): zoom (tap the shot / the button,
 * then drag or scroll to pan), switch desktop ⇄ phone view, previous / next (buttons, ← → keys,
 * a horizontal swipe), outbound link. One history entry: the phone BACK button closes it; Esc too;
 * focus returns to the frame that opened it; the page behind stays pinned without a shift.
 * No JS: the frames are links to the catalogue entries below (full text + outbound links).
 */
const SalonWall = () => {
  const [index, setIndex] = useState<number | null>(null);
  const [view, setView] = useState<View>("desktop");
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  const zoomAt = useRef<{ fx: number; fy: number }>({ fx: 0.5, fy: 0.3 });
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean; type: string } | null>(null);

  const total = works.length;
  const work = index === null ? null : works[index];

  /* close: the dialog, the scroll pin, focus back to the opener */
  const finishClose = useCallback(() => {
    const d = dialogRef.current;
    if (d?.open) d.close();
    pinScroll(false);
    setIndex(null);
    setZoom(false);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  const requestClose = useCallback(() => {
    if (pushedRef.current) history.back();
    else finishClose();
  }, [finishClose]);

  /* phone BACK (and browser back) closes the lightbox */
  useEffect(() => {
    const onPop = () => {
      if (!pushedRef.current) return;
      pushedRef.current = false;
      finishClose();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      pinScroll(false);
    };
  }, [finishClose]);

  /* open: showModal + one history entry */
  useEffect(() => {
    const d = dialogRef.current;
    if (index === null || !d || d.open) return;
    d.showModal();
    pinScroll(true);
    if (!pushedRef.current) {
      history.pushState({ ...(history.state ?? {}), nzLightbox: true }, "");
      pushedRef.current = true;
    }
  }, [index]);

  /* after zooming in, bring the tapped point to the middle of the viewport */
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (!zoom) {
      vp.scrollTo(0, 0);
      return;
    }
    const { fx, fy } = zoomAt.current;
    vp.scrollLeft = Math.max(0, fx * vp.scrollWidth - vp.clientWidth / 2);
    vp.scrollTop = Math.max(0, fy * vp.scrollHeight - vp.clientHeight / 2);
  }, [zoom, index, view]);

  const open = (e: ReactMouseEvent<HTMLAnchorElement>, w: Work, v: View) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    openerRef.current = e.currentTarget;
    setView(v);
    setZoom(false);
    setIndex(w.n - 1);
  };

  const go = (delta: number) => {
    if (index === null) return;
    setZoom(false);
    setIndex((index + delta + total) % total);
  };

  const toggleZoom = (fx = 0.5, fy = view === "desktop" ? 0.3 : 0.2) => {
    zoomAt.current = { fx, fy };
    setZoom((z) => !z);
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (zoom) return; // arrows pan the zoomed shot
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(1); // RTL: the next work is to the left
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(-1);
    }
  };

  /* pointer: mouse drag pans a zoomed shot; a touch swipe (not zoomed) changes the work; a tap zooms */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const vp = viewportRef.current;
    if (!vp) return;
    drag.current = { x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, moved: false, type: e.pointerType };
    if (zoom && e.pointerType === "mouse") vp.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const vp = viewportRef.current;
    if (!d || !vp) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    if (zoom && d.type === "mouse") {
      vp.scrollLeft = d.sl - dx;
      vp.scrollTop = d.st - dy;
    }
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!zoom && d.type !== "mouse" && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(dx > 0 ? 1 : -1);
      d.moved = true;
    }
    if (d.moved) return;
    const img = (e.target as HTMLElement).closest("img");
    if (!img) {
      if (!zoom && e.target === e.currentTarget) requestClose();
      return;
    }
    const r = img.getBoundingClientRect();
    toggleZoom((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };

  const shot = work ? work[view] : null;

  return (
    <>
      <div className="pj-wall">
        {HANGS.map((h) => {
          if (h.w < 0) {
            return (
              <div key="reserved" className="pj-hang pj-hang--reserved" style={{ "--d": h.d, "--order": h.order } as CSSProperties}>
                <a href="#next" className="pj-frame pj-frame--reserved" aria-label={c.reservedLabel}>
                  <span className="pj-frame__mat">
                    <span className="pj-reserved__plus" aria-hidden="true" />
                    <span className="pj-reserved__text">{c.reserved}</span>
                  </span>
                </a>
              </div>
            );
          }
          const w = works[h.w];
          if (!w) return null;
          const cyc = PHONE_CYCLE[h.w % PHONE_CYCLE.length];
          const style = {
            "--d": h.d,
            "--m": h.m,
            "--d-sm": cyc.d,
            "--m-sm": cyc.m,
            "--j": cyc.j === "start" ? "flex-start" : cyc.j === "end" ? "flex-end" : "center",
            "--order": h.order,
          } as CSSProperties;
          /* phones alternate which frame comes first; the DOM follows the phone, desktop flips where its plan differs */
          const phoneFirst = h.w % 2 === 1;
          const flipOnDesktop = (h.o === "md") !== phoneFirst;
          const desk = <WallFrame key="d" work={w} view="desktop" onOpen={open} />;
          const phone = <WallFrame key="m" work={w} view="mobile" onOpen={open} />;
          return (
            <div key={w.id} className={`pj-hang${flipOnDesktop ? " pj-hang--flip" : ""}`} style={style}>
              {phoneFirst ? [phone, desk] : [desk, phone]}
              <p className="pj-plaque">
                <span className="pj-plaque__n">{String(w.n).padStart(2, "0")}</span>
                <span className="pj-plaque__t">{w.title}</span>
              </p>
            </div>
          );
        })}
        {BREAKS.map((o) => (
          <span key={o} className="pj-wall__break" style={{ "--order": o } as CSSProperties} aria-hidden="true" />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={`pj-lb${zoom ? " is-zoomed" : ""} pj-lb--${view}`}
        aria-labelledby="pj-lb-title"
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
        onKeyDown={onKey}
      >
        {work && shot && (
          <div className="pj-lb__inner">
            <div className="pj-lb__bar">
              <p className="pj-lb__count" aria-live="polite">
                {L.counter(work.n, total)}
              </p>
              <button type="button" className="pj-lb__close" onClick={requestClose}>
                <span>{L.close}</span>
                <span className="pj-lb__x" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={viewportRef}
              className="pj-lb__viewport"
              dir="ltr"
              tabIndex={zoom ? 0 : -1}
              aria-label={zoom ? L.zoomHint : undefined}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (drag.current = null)}
            >
              <figure className={`pj-lb__frame pj-lb__frame--${view}`} style={{ "--r": shot.width / shot.height, "--nw": `${shot.width}px` } as CSSProperties}>
                <img
                  key={`${work.id}-${view}`}
                  src={shot.src}
                  srcSet={shot.srcSet}
                  sizes={zoom ? `${shot.width}px` : view === "desktop" ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 30vw, 70vw"}
                  width={shot.width}
                  height={shot.height}
                  alt={`${work.title}: צילום מסך של האתר בתצוגת ${VIEW_WORD[view]}`}
                  draggable={false}
                />
              </figure>
            </div>

            <div className="pj-lb__tools">
              <button type="button" className="pj-lb__nav pj-lb__nav--prev" onClick={() => go(-1)} aria-label={L.prev}>
                <ArrowIcon className="pj-lb__arrow" />
              </button>
              <div className="pj-lb__views" role="group" aria-label={L.viewGroup}>
                {(["desktop", "mobile"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="pj-lb__view"
                    aria-pressed={view === v}
                    onClick={() => {
                      setZoom(false);
                      setView(v);
                    }}
                  >
                    {v === "desktop" ? L.viewDesktop : L.viewMobile}
                  </button>
                ))}
              </div>
              <button type="button" className="pj-lb__zoom" aria-pressed={zoom} onClick={() => toggleZoom()}>
                <span className="pj-lb__lens" aria-hidden="true" />
                <span>{zoom ? L.zoomOut : L.zoomIn}</span>
              </button>
              <button type="button" className="pj-lb__nav pj-lb__nav--next" onClick={() => go(1)} aria-label={L.next}>
                <ArrowIcon className="pj-lb__arrow" />
              </button>
            </div>

            <div className="pj-lb__info">
              <p className="pj-lb__index">עבודה {String(work.n).padStart(2, "0")}</p>
              <h2 id="pj-lb-title" className="pj-lb__title">
                {work.title}
              </h2>
              <dl className="pj-lb__meta">
                <div>
                  <dt>{L.fieldLabel}</dt>
                  <dd>{work.field}</dd>
                </div>
                <div>
                  <dt>{L.mediumLabel}</dt>
                  <dd>{work.medium}</dd>
                </div>
              </dl>
              <p className="pj-lb__desc">{work.description}</p>
              <a className="nz-btn nz-btn--secondary pj-lb__visit" href={work.link} target="_blank" rel="noopener">
                <span>{L.visit}</span>
                <ExternalIcon className="nz-btn__icon" />
                <span className="nz-sr"> {work.host || work.title} (נפתח בכרטיסייה חדשה)</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};

export default SalonWall;
