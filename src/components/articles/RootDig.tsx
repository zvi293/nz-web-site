// Signature component: החפירה — scratch-off (rub the soil away to uncover what lies under it)
import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import "./RootDig.css";

/**
 * "The dig" (seo-2026-what-works). A young tree stands for the ranking; under the ground line,
 * eight plots of soil hide what feeds it. Rub a plot (finger sideways, or just move a mouse over
 * it: the soil is a grid of clods that crumble under the pointer; touch-action pan-y keeps
 * vertical scrolling) or tap / Enter to dig it at once. Once enough soil is gone, the plot opens:
 * a living copper root (what works in 2026: intent, Core Web Vitals, experience and trust, local
 * SEO, structured data) or a dead grey one (keyword stuffing, bought links, mass generic content).
 * Each living root adds a leaf to the tree. aria-live says what was found; soil buttons leave the
 * tab order once dug. No JS: all eight roots are listed, living and dead.
 */

interface Root {
  name: string;
  line: string;
  alive: boolean;
  /** how much it feeds the ranking (1–3): living roots are drawn thicker and more branched */
  weight: number;
}

const ROOTS: Root[] = [
  { name: "כוונת החיפוש", line: "עמוד שעונה בדיוק על מה שהאדם רצה לדעת.", alive: true, weight: 3 },
  { name: "דחיסת מילות מפתח", line: "אותו ביטוי שוב ושוב. גוגל מזהה את זה, והקוראים מתעייפים.", alive: false, weight: 1 },
  { name: "Core Web Vitals", line: "אתר מהיר ויציב: LCP, INP ו-CLS בטווח הטוב.", alive: true, weight: 2 },
  { name: "נתונים מובנים", line: "JSON-LD שמתאר בדיוק את מה שבאמת מופיע בעמוד.", alive: true, weight: 1 },
  { name: "קישורים קנויים", line: "רשתות אתרים שנבנו רק כדי לקשר. מנוגד להנחיות של גוגל.", alive: false, weight: 1 },
  { name: "ניסיון ואמינות", line: "מי כתב, מאיפה הידע, ופרטי קשר ברורים.", alive: true, weight: 3 },
  { name: "תוכן גנרי בכמויות", line: "הרבה מאמרים שאומרים את מה שכולם כבר אמרו.", alive: false, weight: 1 },
  { name: "SEO מקומי", line: "פרופיל עסקי מלא, ופרטים זהים בכל מקום ברשת.", alive: true, weight: 2 },
];

/* each find has its own drawing (in a 120×40 box): living roots branch more the more they feed the
   ranking; dead ones are broken, dry fragments */
const ROOT_ART: string[] = [
  "M60 0 C60 9 57 15 48 21 C38 28 24 27 10 34 M58 13 C67 20 82 21 100 30 M60 7 C64 15 70 20 76 36 M53 18 C49 26 42 31 36 38 M78 24 C86 30 92 32 108 38 M30 27 C26 32 20 34 14 39",
  "M48 4 C50 9 52 12 51 16 M56 22 L50 27 M66 12 L72 17 M60 30 L58 37",
  "M60 0 C60 10 58 17 50 23 C42 29 30 30 18 36 M59 15 C67 22 80 25 96 33 M60 9 C63 18 66 26 64 38",
  "M60 0 C61 12 62 22 58 38 M60 18 C66 24 74 27 84 30",
  "M70 3 L66 10 M58 16 C54 19 50 20 46 20 M74 22 L78 30 M62 30 L60 36",
  "M60 0 C60 10 57 16 47 22 C37 28 23 28 8 35 M58 14 C68 21 84 22 104 31 M60 8 C63 17 69 24 72 38 M52 19 C47 27 40 32 32 39 M84 25 C92 29 98 34 112 37",
  "M40 6 L46 11 M54 16 C58 19 62 20 66 20 M44 26 L40 33 M70 28 L74 35",
  "M60 0 C60 11 58 18 50 24 C42 30 30 31 20 37 M59 16 C68 22 80 26 94 34 M61 10 C66 18 72 22 80 24",
];
const STROKE = (r: Root) => (r.alive ? 1.2 + r.weight * 0.75 : 1.4);

const COLS = 6;
const ROWS = 5;
const CELLS = COLS * ROWS;
const OPEN_AT = 0.55;
/* a fixed, gentle variation of soil tones (deterministic: no hydration mismatch); every plot starts
   the pattern at a different cell and gets its own pebbles, so no two plots look alike */
const TONE = Array.from({ length: CELLS }, (_, k) => ((k * 7 + (k % 5) * 3) % 4));
const PEBBLES = [
  [18, 30, 70, 74],
  [64, 22, 26, 68],
  [36, 62, 78, 30],
  [80, 58, 22, 20],
  [28, 18, 58, 80],
  [70, 76, 40, 34],
  [16, 70, 62, 16],
  [52, 40, 84, 78],
];

const LEAVES = [
  { x: 178, y: 24, r: -20 },
  { x: 124, y: 28, r: 200 },
  { x: 168, y: 0, r: -55 },
  { x: 136, y: 2, r: 235 },
  { x: 150, y: 22, r: -90 },
];

/* under the ground line of the tree: one slot per plot (RTL: plot 1 on the right) */
const GROUND = 70;
const slotX = (i: number) => 278 - i * 36.6;
function underground(i: number, r: Root) {
  const x = slotX(i);
  if (!r.alive) return `M${x - 7} ${GROUND + 24} l5 6 M${x + 3} ${GROUND + 34} l-4 7 M${x + 6} ${GROUND + 26} l5 3`;
  const mx = 150 + (x - 150) * 0.55;
  const y = GROUND + 30 + (i % 2) * 10;
  let d = `M150 ${GROUND} C150 ${GROUND + 14} ${mx} ${GROUND + 16} ${x} ${y}`;
  if (r.weight >= 2) d += ` M${mx} ${GROUND + 17} c${x > 150 ? 4 : -4} 8 ${x > 150 ? 2 : -2} 16 ${x > 150 ? 8 : -8} 28`;
  if (r.weight >= 3) d += ` M${(mx + x) / 2} ${(GROUND + 17 + y) / 2} c${x > 150 ? 10 : -10} 2 ${x > 150 ? 14 : -14} 8 ${x > 150 ? 22 : -22} 12`;
  return d;
}

const RootDig = () => {
  const [soil, setSoil] = useState<boolean[][]>(() => ROOTS.map(() => Array(CELLS).fill(true)));
  const [say, setSay] = useState("");
  const downAt = useRef<{ x: number; y: number } | null>(null);
  const isOpen = (i: number) => soil[i].filter((c) => !c).length / CELLS >= OPEN_AT;
  const opened = ROOTS.map((_, i) => isOpen(i));
  const alive = ROOTS.filter((r, i) => r.alive && opened[i]).length;
  const found = opened.filter(Boolean).length;

  const announce = (i: number) => {
    const r = ROOTS[i];
    setSay(`${r.alive ? "שורש חי" : "שורש מת"}: ${r.name}. ${r.line}`);
  };

  const clear = (i: number, cells: number[]) => {
    setSoil((s) => {
      const was = s[i].filter((c) => !c).length / CELLS >= OPEN_AT;
      const row = [...s[i]];
      let changed = false;
      for (const c of cells) {
        if (c >= 0 && c < CELLS && row[c]) {
          row[c] = false;
          changed = true;
        }
      }
      if (!changed) return s;
      const now = row.filter((c) => !c).length / CELLS >= OPEN_AT;
      if (!was && now) window.setTimeout(() => announce(i), 0);
      const next = [...s];
      next[i] = row;
      return next;
    });
  };

  const around = (col: number, row: number, r: number) => {
    const out: number[] = [];
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        const c = col + dx;
        const y = row + dy;
        if (c >= 0 && c < COLS && y >= 0 && y < ROWS && Math.abs(dx) + Math.abs(dy) <= r + (r > 1 ? 1 : 0)) out.push(y * COLS + c);
      }
    return out;
  };

  const cellAt = (e: RPointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    if (fx < 0 || fx > 1 || fy < 0 || fy > 1) return null;
    /* the grid is laid out in RTL: column 0 is on the right */
    return { col: Math.min(COLS - 1, Math.floor((1 - fx) * COLS)), row: Math.min(ROWS - 1, Math.floor(fy * ROWS)) };
  };

  const onMove = (i: number, e: RPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch" && !downAt.current) return;
    const p = cellAt(e);
    if (p) clear(i, around(p.col, p.row, 1));
  };

  const dig = (i: number) => {
    clear(i, Array.from({ length: CELLS }, (_, k) => k));
  };

  const reset = () => {
    setSoil(ROOTS.map(() => Array(CELLS).fill(true)));
    setSay("האדמה חזרה למקומה.");
  };

  return (
    <div className="as-dg">
      <ul className="as-static">
        {ROOTS.map((r) => (
          <li key={r.name}>
            <p className="as-static__q">
              {r.alive ? "שורש חי" : "שורש מת"}: {r.name}
            </p>
            <p className="as-static__a">{r.line}</p>
          </li>
        ))}
      </ul>

      <div className="as-dg__live as-live">
        <div className="as-dg__surface">
          <p className="as-dg__count">
            <span>הדירוג צומח מהשורשים</span>
            <span className="as-dg__num">
              נחשפו {found} מתוך {ROOTS.length}
            </span>
          </p>
          <svg className="as-dg__tree" viewBox="-40 -10 380 130" aria-hidden="true">
            <rect className="as-dg__earth" x="-40" y={GROUND} width="380" height={120 - GROUND} />
            <path className="as-dg__ground" d={`M-40 ${GROUND} L340 ${GROUND}`} />
            {ROOTS.map((r, i) =>
              opened[i] ? (
                <path
                  key={r.name}
                  className={`as-dg__strand ${r.alive ? "is-alive" : "is-dead"}`}
                  d={underground(i, r)}
                  pathLength={1}
                  style={{ strokeWidth: r.alive ? 0.8 + r.weight * 0.7 : 1.3 }}
                />
              ) : null,
            )}
            <path className="as-dg__trunk" d="M150 70 C150 54 152 40 150 22 M150 44 C160 36 170 32 178 24 M151 36 C142 32 132 30 124 28 M150 26 C156 16 162 8 168 0 M150 24 C146 16 140 8 136 2" />
            {LEAVES.map((l, k) => (
              <g key={k} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
                <path className={`as-dg__leaf${k < alive ? " is-on" : ""}`} d="M-2 0 C3 -6 12 -6 17 0 C12 6 3 6 -2 0 Z M-2 0 L13 0" />
              </g>
            ))}
            {ROOTS.map((_, i) => (
              <circle key={i} className={`as-dg__slot${opened[i] ? " is-open" : ""}`} cx={slotX(i)} cy={GROUND + 6} r="1.6" />
            ))}
          </svg>

        </div>

        <ol className="as-dg__plots">
          {ROOTS.map((r, i) => {
            const open = opened[i];
            return (
              <li
                key={r.name}
                className={`as-dg__plot${open ? " is-open" : ""} ${r.alive ? "is-alive" : "is-dead"}`}
                style={{
                  ["--p1x" as string]: `${PEBBLES[i][0]}%`,
                  ["--p1y" as string]: `${PEBBLES[i][1]}%`,
                  ["--p2x" as string]: `${PEBBLES[i][2]}%`,
                  ["--p2y" as string]: `${PEBBLES[i][3]}%`,
                }}
              >
                <div className="as-dg__find" aria-hidden={!open}>
                  <svg className="as-dg__root" viewBox="0 0 120 40" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
                    <path d={ROOT_ART[i]} style={{ strokeWidth: STROKE(r) }} />
                  </svg>
                  <span className="as-dg__tag">{r.alive ? "שורש חי" : "שורש מת"}</span>
                  <span className="as-dg__name">{r.name}</span>
                  <span className="as-dg__line">{r.line}</span>
                </div>
                <button
                  type="button"
                  className={`as-dg__soil${open ? " is-gone" : ""}`}
                  aria-label={`חפרו בחלקה ${i + 1}`}
                  aria-hidden={open}
                  tabIndex={open ? -1 : 0}
                  onPointerDown={(e) => {
                    downAt.current = { x: e.clientX, y: e.clientY };
                  }}
                  onPointerMove={(e) => onMove(i, e)}
                  onPointerUp={(e) => {
                    const d = downAt.current;
                    downAt.current = null;
                    /* a tap (no rubbing) digs the whole plot */
                    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 10) dig(i);
                  }}
                  onPointerCancel={() => (downAt.current = null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      dig(i);
                    }
                  }}
                  onClick={(e) => {
                    /* keyboard "click" (no pointer) digs at once; a tap already crumbled a patch */
                    if (e.detail === 0) dig(i);
                  }}
                >
                  {soil[i].map((c, k) => (
                    <span key={k} className={`as-dg__clod t${TONE[(k + i * 7) % CELLS]}${c ? "" : " is-dug"}`} />
                  ))}
                  <span className="as-dg__hint" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="as-dg__foot">
          <p className="as-dg__lesson">
            {found === ROOTS.length
              ? "חמישה שורשים חיים וכולם עבודה רגילה ונכונה. שלושת המתים הם קיצורי דרך שכבר לא מזינים כלום, ויכולים גם להזיק."
              : "שפשפו את האדמה באצבע או עברו עליה עם העכבר. הקשה חופרת חלקה במכה אחת."}
          </p>
          {found > 0 && (
            <button type="button" className="as-btn as-btn--quiet" onClick={reset}>
              לכסות שוב
            </button>
          )}
        </div>
        <p className="nz-sr" aria-live="polite">
          {say}
        </p>
      </div>
    </div>
  );
};

export default RootDig;
