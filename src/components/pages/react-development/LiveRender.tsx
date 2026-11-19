// Signature component: רינדור חי — type → live highlight
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import "./live-render.css";

/**
 * "רינדור חי" — a small tea shop built from components, and beside it its component tree (drawn
 * like the warp threads of a loom). Type in the shop's search, or put a tea in the cart, and watch
 * which threads light up: only the components that depend on what changed render again; each
 * keeps its own render count. A switch ("בלי חלוקה לרכיבים") shows the opposite, the whole page
 * redrawn on every change. "הקלידו בשבילי" types a word letter by letter (no phone keyboard).
 *
 * The model is honest React: the query lives in <Catalog> (so Header/Footer never render), the
 * cart lives in a context (so only <CartBadge> and the pressed card render), cards are memoised
 * by key (a card already on screen does not render again; a new one mounts).
 * a11y: real input + buttons (aria-pressed), a switch, the tree as a list with counts in words,
 * and a polite live line that says what the last change rendered (debounced while typing).
 * Cause and effect stay together on a phone: every component's own render count (×N) pops on its
 * outlined region inside the shop, and a dark "devtools" strip on top of the shop counts N / total
 * (the tree, under the shop on phones, repeats it in full). No height ever changes while you play:
 * the tree keeps a fixed number of TeaCard slots and the why-line reserves the longest text.
 * SSR / no JS: every component rendered once, the full tea list. Reduced motion: no flashes,
 * the lit state alone.
 */

interface Tea {
  id: string;
  name: string;
  note: string;
}
const TEAS: Tea[] = [
  { id: "jasmine", name: "ירוק יסמין", note: "ירוק, עדין ופרחוני" },
  { id: "earl", name: "ארל גריי", note: "שחור עם ברגמוט" },
  { id: "mint", name: "נענע מרוקאית", note: "ירוק עם נענע טרייה" },
  { id: "rooibos", name: "רויבוס וניל", note: "אדום, בלי קפאין" },
  { id: "chai", name: "צ׳אי מתובל", note: "שחור, קינמון והל" },
  { id: "chamomile", name: "קמומיל לימון", note: "צמחים, לפני השינה" },
];
const SLOTS = 4;
const DEMO = "ירוק";

type Mode = "smart" | "all";
type Cause = "init" | "query" | "cart" | "mode";

const STATIC_NODES: {
  id: string;
  name: string;
  role: string;
  depth: number;
}[] = [
  { id: "App", name: "App", role: "השורש", depth: 0 },
  { id: "Header", name: "Header", role: "כותרת החנות", depth: 1 },
  { id: "CartBadge", name: "CartBadge", role: "מונה הסל", depth: 2 },
  { id: "Catalog", name: "Catalog", role: "הקטלוג, מחזיק את החיפוש", depth: 1 },
  { id: "SearchBox", name: "SearchBox", role: "שדה החיפוש", depth: 2 },
  { id: "ResultsList", name: "ResultsList", role: "רשימת התוצאות", depth: 2 },
];
const FOOTER = { id: "Footer", name: "Footer", role: "כותרת תחתונה", depth: 1 };

const norm = (s: string) => s.trim().replace(/['׳"״]/g, "");
const visibleFor = (q: string) => {
  const n = norm(q);
  return TEAS.filter((t) => !n || norm(t.name).includes(n) || norm(t.note).includes(n))
    .slice(0, SLOTS)
    .map((t) => t.id);
};
const cardId = (id: string) => `card:${id}`;
const teaOf = (id: string) => TEAS.find((t) => t.id === id)!;

const WHY: Record<`${Mode}-${Cause}`, string> = {
  "smart-init": "כל רכיב צויר פעם אחת, בטעינת העמוד. עכשיו הקלידו בחיפוש, או שימו תה בסל.",
  "smart-query":
    "החיפוש נשמר בתוך Catalog, ולכן מתעדכנים רק הוא, שדה החיפוש ורשימת התוצאות. כרטיס שכבר היה על המסך לא מצטייר מחדש, וכרטיס חדש פשוט נכנס.",
  "smart-cart":
    "הסל נשמר במקום משותף שרק מונה הסל והכרטיסים קוראים ממנו. מתעדכנים רק המונה והכרטיס שנלחץ. הכותרת, החיפוש ושאר הכרטיסים לא זזים.",
  "smart-mode": "חזרה לרינדור לפי רכיבים: מעכשיו כל שינוי מעדכן רק את מה שתלוי בו.",
  "all-init": "",
  "all-query": "כך נראה עמוד שנבנה מחדש בכל שינוי: כל הרכיבים מצטיירים שוב, גם אלה שלא השתנה בהם כלום.",
  "all-cart": "גם לחיצה אחת על הסל מציירת מחדש את כל העמוד, מהכותרת ועד הכותרת התחתונה.",
  "all-mode": "בלי חלוקה לרכיבים, כל שינוי קטן מצייר מחדש את הכול. נסו להקליד ולראות.",
};

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

/* a component's render count, shown on its own region in the shop while it is lit */
function Badge({ on, n, tick, at }: { on: boolean; n: number; tick: number; at?: "start" | "bottom" | "bottom-start" }) {
  if (!on) return null;
  return (
    <span key={tick} className={`lr-badge${at ? ` lr-badge--${at}` : ""}`} aria-hidden="true" dir="ltr">
      ×{n}
    </span>
  );
}

const WHY_ALL = Array.from(new Set(Object.values(WHY).filter(Boolean)));

const LiveRender = () => {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("smart");
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const c: Record<string, number> = {};
    [...STATIC_NODES, FOOTER].forEach((n) => (c[n.id] = 1));
    TEAS.forEach((t) => (c[cardId(t.id)] = visibleFor("").includes(t.id) ? 1 : 0));
    return c;
  });
  const [lit, setLit] = useState<{ ids: string[]; tick: number }>({
    ids: [],
    tick: 0,
  });
  const [cause, setCause] = useState<Cause>("init");
  const [said, setSaid] = useState("");
  const [demo, setDemo] = useState(false);
  const timers = useRef<number[]>([]);
  const queryRef = useRef(query);
  queryRef.current = query;
  /* timers of the typing demo call commit() later: read the mode from a ref, never a stale closure */
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;

  const visible = useMemo(() => visibleFor(query), [query]);
  const nodes = useMemo(
    () => [
      ...STATIC_NODES,
      ...visible.map((id) => ({
        id: cardId(id),
        name: "TeaCard",
        role: teaOf(id).name,
        depth: 3,
        key: id,
      })),
      FOOTER,
    ],
    [visible],
  );
  const total = nodes.length;

  const commit = (changed: string[], why: Cause, nextVisible: string[]) => {
    const m = modeRef.current;
    const all = [...STATIC_NODES.map((n) => n.id), FOOTER.id, ...nextVisible.map(cardId)];
    const ids = m === "all" ? all : changed;
    setCounts((c) => {
      const next = { ...c };
      ids.forEach((id) => (next[id] = (next[id] ?? 0) + 1));
      return next;
    });
    setLit((l) => ({ ids, tick: l.tick + 1 }));
    setCause(why);
  };

  const applyQuery = (q: string) => {
    const before = visibleFor(queryRef.current);
    const after = visibleFor(q);
    const mounted = after.filter((id) => !before.includes(id)).map(cardId);
    queryRef.current = q;
    setQuery(q);
    commit(["Catalog", "SearchBox", "ResultsList", ...mounted], "query", after);
  };

  const stopDemo = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setDemo(false);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    stopDemo();
    applyQuery(e.target.value);
  };

  const toggleCart = (id: string) => {
    setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
    commit(["CartBadge", cardId(id)], "cart", visible);
  };

  const toggleMode = () => {
    const m: Mode = mode === "smart" ? "all" : "smart";
    modeRef.current = m;
    setMode(m);
    setLit((l) => ({ ids: [], tick: l.tick + 1 }));
    setCause("mode");
  };

  const runDemo = () => {
    stopDemo();
    if (!motionOn()) {
      applyQuery(DEMO);
      return;
    }
    setDemo(true);
    const steps = [...(queryRef.current ? [""] : []), ...Array.from(DEMO, (_, i) => DEMO.slice(0, i + 1))];
    steps.forEach((q, i) => {
      timers.current.push(
        window.setTimeout(
          () => {
            applyQuery(q);
            if (i === steps.length - 1) setDemo(false);
          },
          250 + i * 520,
        ),
      );
    });
  };

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  /* the live line: say what the last change rendered, once typing settles */
  useEffect(() => {
    if (cause === "init") return;
    const t = window.setTimeout(() => {
      const n = lit.ids.length;
      setSaid(`בשינוי האחרון התעדכנו ${n} מתוך ${total} רכיבים. ${WHY[`${mode}-${cause}`]}`);
    }, 700);
    return () => window.clearTimeout(t);
  }, [lit, cause, mode, total]);

  const isLit = (id: string) => lit.ids.includes(id);
  const why = WHY[`${mode}-${cause}`] || WHY["smart-init"];
  const badge = (id: string, at?: "start" | "bottom" | "bottom-start") => (
    <Badge on={isLit(id)} n={counts[id] ?? 0} tick={lit.tick} at={at} />
  );
  const shown = cause === "init" ? total : lit.ids.length;
  const slots = Array.from({ length: SLOTS - visible.length }, (_, i) => i);

  return (
    <div className={`lr lr--${mode}`}>
      {/* ── the shop ── */}
      <div className={`lr-shop${isLit("App") ? " is-lit" : ""}`} data-tone="paper">
        <p className="lr-shop__dev" aria-hidden="true">
          <span className="lr-shop__dev-dot" />
          <span>עדכוני רינדור</span>
          <span className="lr-shop__dev-n">
            <b>{shown}</b> / {total}
          </span>
        </p>
        {badge("App", "bottom-start")}
        <div className={`lr-shop__head${isLit("Header") ? " is-lit" : ""}`}>
          {badge("Header", "start")}
          <span className="lr-shop__logo">
            תה<i aria-hidden="true">·</i>בית
          </span>
          <span className={`lr-shop__cart${isLit("CartBadge") ? " is-lit" : ""}`} aria-label={`בסל: ${cart.length}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M4 5h2l2 10h9l2-7H7.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
              <circle cx="16.5" cy="19" r="1.4" fill="currentColor" />
            </svg>
            <span className="lr-shop__cart-n">{cart.length}</span>
            {badge("CartBadge")}
          </span>
        </div>

        <div className={`lr-shop__catalog${isLit("Catalog") ? " is-lit" : ""}`}>
          {badge("Catalog", "bottom-start")}
          <div className={`lr-shop__search${isLit("SearchBox") ? " is-lit" : ""}`}>
            {badge("SearchBox")}
            <label htmlFor="lr-q" className="lr-shop__label">
              חיפוש תה
            </label>
            <div className="lr-shop__field">
              <input
                id="lr-q"
                type="search"
                value={query}
                onChange={onInput}
                placeholder="למשל: ירוק, צ׳אי"
                autoComplete="off"
                enterKeyHint="search"
              />
              <button type="button" className="lr-shop__demo" onClick={runDemo} disabled={demo}>
                {demo ? "מקליד…" : "הקלידו בשבילי"}
              </button>
            </div>
          </div>

          <div className={`lr-shop__list${isLit("ResultsList") ? " is-lit" : ""}`}>
            {badge("ResultsList")}
            <ul className="lr-shop__ul" aria-label="תוצאות">
              {visible.map((id) => {
                const t = teaOf(id);
                const inCart = cart.includes(id);
                return (
                  <li key={id} className={`lr-tea${isLit(cardId(id)) ? " is-lit" : ""}`}>
                    {badge(cardId(id))}
                    <span className="lr-tea__text">
                      <span className="lr-tea__name">{t.name}</span>
                      <span className="lr-tea__note">{t.note}</span>
                    </span>
                    <button type="button" className="lr-tea__add" aria-pressed={inCart} onClick={() => toggleCart(id)}>
                      {inCart ? "בסל ✓" : "לסל"}
                      <span className="nz-sr"> {t.name}</span>
                    </button>
                  </li>
                );
              })}
              {visible.length === 0 && <li className="lr-tea lr-tea--none">לא מצאנו תה כזה. נסו ״ירוק״.</li>}
              {Array.from({ length: Math.max(0, SLOTS - Math.max(visible.length, 1)) }, (_, i) => (
                <li key={`e${i}`} className="lr-tea lr-tea--empty" aria-hidden="true" />
              ))}
            </ul>
          </div>
        </div>

        <p className={`lr-shop__foot${isLit("Footer") ? " is-lit" : ""}`}>
          {badge("Footer")}
          תה·בית · חנות לדוגמה
        </p>
      </div>

      {/* ── the tree ── */}
      <div className="lr-tree">
        <div className="lr-tree__bar">
          <p className="lr-tree__title">עץ הרכיבים</p>
          <button type="button" role="switch" aria-checked={mode === "all"} className="lr-switch" onClick={toggleMode}>
            <span className="lr-switch__track" aria-hidden="true">
              <span className="lr-switch__thumb" />
            </span>
            בלי חלוקה לרכיבים
          </button>
        </div>

        <ul className="lr-tree__list" aria-label="עץ הרכיבים: כמה פעמים צויר כל רכיב">
          {nodes.map((n) => {
            const on = isLit(n.id);
            const slotRows =
              n.id === FOOTER.id
                ? slots.map((k) => (
                    <li key={`slot${k}`} className="lr-node lr-node--slot" style={{ ["--d" as string]: 3 }} aria-hidden="true">
                      <code className="lr-node__name" dir="ltr">
                        &lt;TeaCard&gt;
                      </code>
                      <span className="lr-node__role">משבצת ריקה</span>
                      <span className="lr-node__count">–</span>
                    </li>
                  ))
                : null;
            const c = counts[n.id] ?? 0;
            return [
              slotRows,
              <li
                key={n.id}
                className={`lr-node${n.depth === 0 ? " lr-node--root" : ""}${on ? " is-lit" : ""}`}
                style={{ ["--d" as string]: n.depth }}
              >
                {on && <span key={lit.tick} className="lr-node__flash" aria-hidden="true" />}
                <code className="lr-node__name" dir="ltr">
                  &lt;{n.name}&gt;
                </code>
                <span className="lr-node__role">{n.role}</span>
                <span className="lr-node__count">
                  <span aria-hidden="true">×{c}</span>
                  <span className="nz-sr">, צויר {c === 1 ? "פעם אחת" : `${c} פעמים`}</span>
                </span>
              </li>,
            ];
          })}
        </ul>

        <div className="lr-tree__sum">
          <p className="lr-tree__stat" aria-hidden="true">
            <span className="lr-tree__n">{shown}</span>
            <span className="lr-tree__of">/ {total}</span>
            <span className="lr-tree__l">{cause === "init" ? "רכיבים צוירו בטעינה" : "רכיבים התעדכנו בשינוי האחרון"}</span>
          </p>
          {/* every possible line sits in one grid cell, so the height is the longest one's */}
          <div className="lr-tree__whys">
            {WHY_ALL.map((w) => (
              <p key={w} className={`lr-tree__why${w === why ? " is-on" : ""}`} aria-hidden={w === why ? undefined : true}>
                {w}
              </p>
            ))}
          </div>
        </div>
      </div>

      <p className="nz-sr" aria-live="polite">
        {said}
      </p>
    </div>
  );
};

export default LiveRender;
