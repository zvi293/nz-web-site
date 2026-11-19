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
}

const ROOTS: Root[] = [
  { name: "כוונת החיפוש", line: "עמוד שעונה בדיוק על מה שהאדם רצה לדעת.", alive: true },
  { name: "דחיסת מילות מפתח", line: "אותו ביטוי שוב ושוב. גוגל מזהה את זה, והקוראים מתעייפים.", alive: false },
  { name: "Core Web Vitals", line: "אתר מהיר ויציב: LCP, INP ו-CLS בטווח הטוב.", alive: true },
  { name: "נתונים מובנים", line: "JSON-LD שמתאר בדיוק את מה שבאמת מופיע בעמוד.", alive: true },
  { name: "קישורים קנויים", line: "רשתות אתרים שנבנו רק כדי לקשר. מנוגד להנחיות של גוגל.", alive: false },
  { name: "ניסיון ואמינות", line: "מי כתב, מאיפה הידע, ופרטי קשר ברורים.", alive: true },
  { name: "תוכן גנרי בכמויות", line: "הרבה מאמרים שאומרים את מה שכולם כבר אמרו.", alive: false },
  { name: "SEO מקומי", line: "פרופיל עסקי מלא, ופרטים זהים בכל מקום ברשת.", alive: true },
];

const COLS = 6;
const ROWS = 5;
const CELLS = COLS * ROWS;
const OPEN_AT = 0.55;
/* a fixed, gentle variation of soil tones (deterministic: no hydration mismatch) */
const TONE = Array.from({ length: CELLS }, (_, k) => ((k * 7 + (k % 5) * 3) % 4));

const LEAVES = [
  { x: 178, y: 46, r: -20 },
  { x: 124, y: 50, r: 200 },
  { x: 168, y: 22, r: -55 },
  { x: 136, y: 24, r: 235 },
  { x: 150, y: 44, r: -90 },
];

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
          <svg className="as-dg__tree" viewBox="0 0 300 100" aria-hidden="true">
            <path className="as-dg__ground" d="M0 92 L300 92" />
            <path className="as-dg__trunk" d="M150 92 C150 76 152 62 150 44 M150 66 C160 58 170 54 178 46 M151 58 C142 54 132 52 124 50 M150 48 C156 38 162 30 168 22 M150 46 C146 38 140 30 136 24" />
            {LEAVES.map((l, k) => (
              <g key={k} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
                <path className={`as-dg__leaf${k < alive ? " is-on" : ""}`} d="M-2 0 C3 -6 12 -6 17 0 C12 6 3 6 -2 0 Z M-2 0 L13 0" />
              </g>
            ))}
          </svg>
          <p className="as-dg__count">
            <span>הדירוג צומח מהשורשים</span>
            <span className="as-dg__num">
              נחשפו {found} מתוך {ROOTS.length}
            </span>
          </p>
        </div>

        <ol className="as-dg__plots">
          {ROOTS.map((r, i) => {
            const open = opened[i];
            return (
              <li key={r.name} className={`as-dg__plot${open ? " is-open" : ""} ${r.alive ? "is-alive" : "is-dead"}`}>
                <div className="as-dg__find" aria-hidden={!open}>
                  <svg className="as-dg__root" viewBox="0 0 120 34" aria-hidden="true">
                    {r.alive ? (
                      <path d="M60 0 C60 10 58 16 50 22 C42 28 30 28 20 32 M58 14 C66 20 80 22 96 30 M60 8 C64 16 70 20 74 32 M54 18 C50 26 44 30 40 34" />
                    ) : (
                      <path d="M60 0 C60 8 59 12 56 16 M52 20 L46 24 M62 18 L70 22 M58 26 L56 32" />
                    )}
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
                    <span key={k} className={`as-dg__clod t${TONE[k]}${c ? "" : " is-dug"}`} />
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
