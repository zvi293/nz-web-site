// Signature component: מפת האולמות — floor-plan selection
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { getArt } from "@/lib/art";
import { cn } from "@/lib/utils";
import "./floorplan.css";

/**
 * "מפת האולמות" — the /services/ hub as a gallery floor plan (SVG). Each room is a service:
 * tap (or click) a room to light it — its walk from the entrance is drawn in vermilion and its
 * wall label (name, line, "חומרים", the room's artwork, the link in) appears beside the plan.
 * Keyboard: the plan is a radio group — Tab in, arrow keys move to the nearest room in that
 * direction, Home/End jump; the label updates through aria-live.
 * The directory under the label lists every room as a plain link: it is the no-JS fallback
 * (and the hub's crawlable links); hovering/focusing a row lights its room too. On phones, once
 * the plan is live, the directory folds into a <details> ("כל החדרים ברשימה") — the links stay
 * in the DOM, open by default without JS and on desktop.
 * SSR = room 01 lit. Props are plain data (serialisable).
 */
export interface PlanRoom {
  num: string;
  name: string;
  short: string;
  href: string;
  art: string;
  line: string;
  medium: string;
}

interface Props {
  rooms: PlanRoom[];
  /** Wing number for the label ("03"). */
  wing: string;
}

/* Geometry (viewBox 0 0 400 436): a central hall from the entrance (bottom) to the
   conversation room (top); rooms on both sides. Right side = odd numbers (RTL reading). */
const HALL = { x1: 145, x2: 255 };
const ROWS = [86, 166, 246, 326, 406];
type Box = { x: number; y: number; w: number; h: number; door: [number, number]; inside: [number, number] };

function boxFor(i: number, total: number): Box {
  if (i === total - 1 && total === 9) {
    // the conversation room at the top of the hall
    return { x: 10, y: 10, w: 380, h: 76, door: [200, 86], inside: [200, 70] };
  }
  const row = Math.floor(i / 2);
  const right = i % 2 === 0;
  const y = ROWS[row];
  const h = ROWS[row + 1] - y;
  const mid = y + h / 2;
  return right
    ? { x: HALL.x2, y, w: 390 - HALL.x2, h, door: [HALL.x2, mid], inside: [HALL.x2 + 34, mid] }
    : { x: 10, y, w: HALL.x1 - 10, h, door: [HALL.x1, mid], inside: [HALL.x1 - 34, mid] };
}

const ENTRANCE: [number, number] = [200, 408];

function walk(b: Box): string {
  const [dx, dy] = b.door;
  const [ix, iy] = b.inside;
  return `M ${ENTRANCE[0]} ${ENTRANCE[1]} L 200 ${dy} L ${dx} ${dy} L ${ix} ${iy}`;
}

/** Nearest room from `from` in an arrow direction (by room centres). */
function nearest(boxes: Box[], from: number, key: string): number {
  const c = (b: Box) => [b.x + b.w / 2, b.y + b.h / 2] as const;
  const [fx, fy] = c(boxes[from]);
  let best = from;
  let bestScore = Infinity;
  boxes.forEach((b, i) => {
    if (i === from) return;
    const [x, y] = c(b);
    const dx = x - fx;
    const dy = y - fy;
    const ok =
      (key === "ArrowUp" && dy < -1) ||
      (key === "ArrowDown" && dy > 1) ||
      (key === "ArrowLeft" && dx < -1) ||
      (key === "ArrowRight" && dx > 1);
    if (!ok) return;
    const along = key === "ArrowUp" || key === "ArrowDown" ? Math.abs(dy) : Math.abs(dx);
    const across = key === "ArrowUp" || key === "ArrowDown" ? Math.abs(dx) : Math.abs(dy);
    const score = along + across * 2.2;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}

/** Keep hyphen-joined tokens ("ו-SEO") on one line, like Nb.astro. */
function nb(text: string): ReactNode[] {
  return text.split(/(\S*-\S+)/g).map((p, i) => (i % 2 ? <span key={i} className="sv-nb">{p}</span> : p));
}

function Thumb({ slug }: { slug: string }) {
  const art = getArt(slug);
  return (
    <span className="fp-thumb" style={{ backgroundColor: art.color }}>
      <picture>
        <source type="image/avif" srcSet={art.avifSrcSet} sizes="(min-width: 1024px) 220px, 34vw" />
        <source type="image/webp" srcSet={art.webpSrcSet} sizes="(min-width: 1024px) 220px, 34vw" />
        <img src={art.src} width={art.width} height={art.height} alt="" loading="lazy" decoding="async" />
      </picture>
    </span>
  );
}

const FloorPlan = ({ rooms, wing }: Props) => {
  const [active, setActive] = useState(0);
  const [walked, setWalked] = useState(0); // bumps on every selection → replays the walk
  const [dirOpen, setDirOpen] = useState(true); // SSR / no JS / desktop: the list is open
  const roomRefs = useRef<(SVGGElement | null)[]>([]);
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023.98px)").matches) setDirOpen(false);
  }, []);
  const boxes = rooms.map((_, i) => boxFor(i, rooms.length));
  const room = rooms[active];

  const select = useCallback((i: number, focus = false) => {
    setActive(i);
    setWalked((w) => w + 1);
    if (focus) roomRefs.current[i]?.focus();
  }, []);

  const onKey = (e: KeyboardEvent<SVGGElement>, i: number) => {
    let next = -1;
    if (e.key.startsWith("Arrow")) next = nearest(boxes, i, e.key);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = rooms.length - 1;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (i === active && e.key === "Enter") window.location.href = rooms[i].href;
      else select(i);
      return;
    }
    if (next >= 0) {
      e.preventDefault();
      select(next, true);
    }
  };

  return (
    <div className="fp">
      <div className="fp__plan">
        <svg className="fp__svg" viewBox="0 0 400 436">
          <defs>
            <radialGradient id="fp-glow" cx="50%" cy="45%" r="62%">
              <stop offset="0%" stopColor="#ffb46b" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#e0702f" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#e0401f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g role="radiogroup" aria-label="מפת האולמות: בחרו חדר">
            {/* hall floor + benches */}
            <rect className="fp-hall" x={HALL.x1} y={86} width={HALL.x2 - HALL.x1} height={320} />
            <rect className="fp-bench" x={182} y={196} width={36} height={9} />
            <rect className="fp-bench" x={182} y={296} width={36} height={9} />

            {rooms.map((r, i) => {
              const b = boxes[i];
              const on = i === active;
              const art = getArt(r.art);
              const isTop = b.y === 10;
              /* the hung work on the room's far wall */
              const work = isTop
                ? { x: b.x + b.w - 70, y: b.y + 6, w: 44, h: 5 }
                : b.x === HALL.x2
                  ? { x: b.x + b.w - 11, y: b.y + b.h / 2 - 15, w: 5, h: 30 }
                  : { x: b.x + 6, y: b.y + b.h / 2 - 15, w: 5, h: 30 };
              const textX = isTop ? b.x + b.w / 2 : b.x + b.w - 18;
              return (
                <g
                  key={r.href}
                  ref={(el) => (roomRefs.current[i] = el)}
                  className={cn("fp-room", on && "is-on")}
                  role="radio"
                  aria-checked={on}
                  aria-label={`חדר ${r.num}: ${r.name}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") select(i);
                  }}
                >
                  <rect className="fp-room__floor" x={b.x} y={b.y} width={b.w} height={b.h} />
                  <rect className="fp-room__light" x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8} />
                  <rect className="fp-room__work" x={work.x} y={work.y} width={work.w} height={work.h} style={{ fill: art.color }} />
                  <rect className="fp-room__focus" x={b.x + 5} y={b.y + 5} width={b.w - 10} height={b.h - 10} />
                  <text className="fp-room__num" x={textX} y={b.y + (isTop ? 36 : 34)} textAnchor={isTop ? "middle" : "start"}>
                    {r.num}
                  </text>
                  <text className="fp-room__name" x={textX} y={b.y + (isTop ? 60 : b.h - 14)} textAnchor={isTop ? "middle" : "start"}>
                    {r.short}
                  </text>
                </g>
              );
            })}
          </g>

          {/* walls: building outline, the hall, door gaps */}
          <g className="fp-walls" aria-hidden="true">
            <rect x={10} y={10} width={380} height={396} className="fp-walls__outer" />
            {boxes.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} className="fp-walls__inner" />
            ))}
            {boxes.map((b, i) => {
              const [dx, dy] = b.door;
              const vertical = b.door[0] === HALL.x1 || b.door[0] === HALL.x2;
              return vertical ? (
                <line key={`d${i}`} x1={dx} y1={dy - 16} x2={dx} y2={dy + 16} className={cn("fp-door", i === active && "is-on")} />
              ) : (
                <line key={`d${i}`} x1={dx - 16} y1={dy} x2={dx + 16} y2={dy} className={cn("fp-door", i === active && "is-on")} />
              );
            })}
            <line x1={176} y1={406} x2={224} y2={406} className="fp-door fp-door--entrance" />
          </g>

          {/* the walk */}
          <path key={walked} className="fp-walk" d={walk(boxes[active])} pathLength={1} aria-hidden="true" />
          <g aria-hidden="true">
            <rect className="fp-here" x={194} y={386} width={12} height={12} />
            <text className="fp-here__label" x={200} y={430} textAnchor="middle">
              כניסה · אתם כאן
            </text>
          </g>
        </svg>
      </div>

      <div className="fp__side">
        <div className="fp-label" aria-live="polite">
          <a href={room.href} className="fp-label__link" tabIndex={-1} aria-hidden="true">
            <Thumb slug={room.art} />
          </a>
          <div className="fp-label__text">
            <p className="fp-label__place">
              <span className="fp-label__wing">אולם {wing}</span>
              <span>חדר {room.num}</span>
            </p>
            <h3 className="fp-label__name">{room.name}</h3>
            <p className="fp-label__line">{nb(room.line)}</p>
            <p className="fp-label__medium">
              <span>חומרים:</span> {nb(room.medium)}
            </p>
            <a href={room.href} className="nz-link fp-label__go">
              <span className="nz-link__text">
                להיכנס לחדר {room.num}
                <span className="nz-sr">: {room.name}</span>
              </span>
              <svg className="nz-link__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <nav className="fp-dir" aria-label="מדריך האולמות">
          <details className="fp-dir__fold" open={dirOpen} onToggle={(e) => setDirOpen(e.currentTarget.open)}>
          <summary className="fp-dir__head">
            <span>כל החדרים ברשימה</span>
            <span className="fp-dir__count">{String(rooms.length).padStart(2, "0")}</span>
            <span className="fp-dir__chev" aria-hidden="true" />
          </summary>
          <ol>
            {rooms.map((r, i) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  className={cn("fp-dir__row", i === active && "is-on")}
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") select(i);
                  }}
                  onFocus={() => select(i)}
                >
                  <span className="fp-dir__num">{r.num}</span>
                  <span className="fp-dir__name">{r.name}</span>
                  <svg className="fp-dir__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
          </details>
        </nav>
      </div>
    </div>
  );
};

export default FloorPlan;
