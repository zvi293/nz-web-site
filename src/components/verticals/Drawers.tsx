// Signature component: המגירות — pull drawers (a filing cabinet that holds the site's pages)
import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";
import "./drawers.css";

/**
 * "המגירות" (accountant page). The site of an accounting office as a filing cabinet: one drawer
 * per service page. Pull a drawer (drag its brass pull down, or tap the drawer) and it slides
 * out: a hanging file folder sits in it and the page's ledger sheet rises out of the folder — its
 * headline, the ruled lines of what is on it, and (double-ruled, like a total) the Google search
 * it is built to catch. One drawer is open at a time (pulling another closes the last one, so
 * the cabinet never grows past a phone screen); the plan beside the cabinet ticks the pages
 * visited. Opening re-flows the cabinet: the page scrolls by the change so the drawer front you
 * touched stays under your thumb, the other drawers glide (FLIP, transform only) and the tray
 * is revealed with clip-path.
 * SSR: the first drawer open; without JS every tray is shown (html:not(.js)).
 */
type Drawer = { id: string; name: string; h1: string; items: string[]; query: string };

const DRAWERS: Drawer[] = [
  {
    id: "books",
    name: "הנהלת חשבונות",
    h1: "הנהלת חשבונות לעסקים קטנים ולעצמאים",
    items: ["מה כלול בליווי החודשי", "אילו מסמכים שולחים, ומתי", "איך עוברים ממשרד אחר"],
    query: "הנהלת חשבונות לעסק קטן",
  },
  {
    id: "annual",
    name: "דוח שנתי",
    h1: "הגשת דוח שנתי לעצמאים ולבעלי חברות",
    items: ["מי חייב להגיש דוח שנתי", "מה כדאי להכין מראש", "איך נראית עונת הדוחות אצלנו"],
    query: "הגשת דוח שנתי לעצמאי",
  },
  {
    id: "refund",
    name: "החזרי מס",
    h1: "בדיקת החזר מס לשכירים",
    items: ["מתי בדרך כלל מגיע החזר", "אילו טפסים צריך להביא", "איך נראית הבדיקה, צעד אחר צעד"],
    query: "החזר מס לשכירים",
  },
  {
    id: "open",
    name: "פתיחת עוסק או חברה",
    h1: "פתיחת עוסק או חברה, מההחלטה ועד החשבונית הראשונה",
    items: ["עוסק פטור, עוסק מורשה או חברה", "רישום ברשויות, בסדר הנכון", "מה עושים בחודש הראשון"],
    query: "פתיחת עוסק מורשה",
  },
  {
    id: "advice",
    name: "ליווי עסקי",
    h1: "רואה חשבון שמלווה את העסק לאורך השנה",
    items: ["תכנון מס לשנה הבאה", "דוחות לבנק ולמשקיעים", "פגישת סיכום קבועה"],
    query: "רואה חשבון לליווי עסקי",
  },
];

const pad = (i: number) => String(i + 1).padStart(2, "0");

const Drawers = () => {
  const [open, setOpen] = useState<string[]>([DRAWERS[0].id]);
  const [seen, setSeen] = useState<string[]>([DRAWERS[0].id]);
  const [say, setSay] = useState("");
  const [pull, setPull] = useState<{ id: string; y: number } | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const before = useRef<Record<string, number> | null>(null);
  /** The drawer just tapped and where its front was: the page scrolls so it stays put. */
  const anchor = useRef<{ id: string; top: number } | null>(null);
  const openRef = useRef(open);
  /* fronts are measured (not the <li>s): an open drawer's tray sits above its front */
  const frontOf = (id: string) => itemRefs.current[id]?.querySelector<HTMLElement>(".vl-dr__front") ?? null;
  const drag = useRef<{ id: string; y0: number; moved: boolean } | null>(null);

  /* FLIP: drawer fronts that moved because a tray opened/closed glide to their new place. */
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    if (a) {
      const front = frontOf(a.id);
      const dy = front ? front.getBoundingClientRect().top - a.top : 0;
      if (Math.abs(dy) > 1) {
        window.scrollBy({ top: dy, behavior: "instant" as ScrollBehavior });
        // FLIP below compares the old tops with the tops after this scroll, so the touched
        // drawer does not move and the others glide into place around it
      }
    }
    const b = before.current;
    before.current = null;
    if (!b || !motionAllowed()) return;
    for (const d of DRAWERS) {
      const el = itemRefs.current[d.id];
      if (!el || !el.animate || b[d.id] === undefined) continue;
      const dy = b[d.id] - frontOf(d.id)!.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) continue;
      el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], {
        duration: 620,
        easing: "cubic-bezier(0.2, 0.8, 0.1, 1)",
      });
    }
  }, [open]);

  const toggle = (id: string) => {
    const snap: Record<string, number> = {};
    for (const d of DRAWERS) {
      const f = frontOf(d.id);
      if (f) snap[d.id] = f.getBoundingClientRect().top;
    }
    before.current = snap;
    const front = frontOf(id);
    if (front) anchor.current = { id, top: front.getBoundingClientRect().top };
    const cur = openRef.current;
    const isOpen = cur.includes(id);
    const next = isOpen ? [] : [id];
    openRef.current = next;
    setOpen(next);
    const d = DRAWERS.find((x) => x.id === id)!;
    if (!isOpen) {
      setSeen((s) => (s.includes(id) ? s : [...s, id]));
      setSay(`נפתחה המגירה ${d.name}. העמוד הזה תופס את החיפוש: ${d.query}.`);
    } else {
      setSay(`המגירה ${d.name} נסגרה.`);
    }
  };

  /* Drag the brass pull downwards: the drawer follows the hand, a long enough pull opens it. */
  const onDown = (id: string) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.button !== 0) return;
    drag.current = { id, y0: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y0;
    if (Math.abs(dy) > 4) d.moved = true;
    const isOpen = openRef.current.includes(d.id);
    setPull({ id: d.id, y: isOpen ? Math.max(-40, Math.min(0, dy)) : Math.max(0, Math.min(44, dy)) });
  };
  const onUp = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dy = e.clientY - d.y0;
    setPull(null);
    if (!d.moved) return; // a tap is handled by the drawer's click
    e.preventDefault();
    const isOpen = openRef.current.includes(d.id);
    if ((!isOpen && dy > 22) || (isOpen && dy < -18)) toggle(d.id);
    suppress.current = d.id;
  };
  const suppress = useRef<string | null>(null);
  const onClick = (id: string) => () => {
    if (suppress.current === id) {
      suppress.current = null;
      return;
    }
    toggle(id);
  };

  return (
    <div className="vl-dr">
      <div className="vl-dr__cabinet">
        <p className="vl-dr__crest" aria-hidden="true">
          <span>ארכיון · אתר למשרד רואי חשבון</span>
          <span>{open.length ? "מגירה אחת פתוחה" : "כל המגירות סגורות"}</span>
        </p>
        <ul className="vl-dr__list">
          {DRAWERS.map((d, i) => {
            const isOpen = open.includes(d.id);
            const y = pull?.id === d.id ? pull.y : 0;
            return (
              <li key={d.id} ref={(el) => (itemRefs.current[d.id] = el)} className={cn("vl-dr__drawer", isOpen && "is-open")}>
                <div className="vl-dr__tray" id={`vl-dr-${d.id}`} role="region" aria-label={`עמוד ${d.name}`} hidden={!isOpen}>
                  <div className="vl-dr__folder">
                    <span className="vl-dr__folder-tab" aria-hidden="true">{d.name}</span>
                    <div className="vl-dr__sheet">
                      <p className="vl-dr__sheet-head">
                        <span>כותרת העמוד</span>
                        <span>{`עמוד ${pad(i)}`}</span>
                      </p>
                      <p className="vl-dr__h1">{d.h1}</p>
                      <ol className="vl-dr__items" aria-label="מה בעמוד">
                        {d.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ol>
                      <p className="vl-dr__total">
                        <span className="vl-dr__total-label">החיפוש שהוא תופס</span>
                        <span className="vl-dr__query">
                          <span className="vl-dr__lens" aria-hidden="true" />
                          {d.query}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="vl-dr__front"
                  aria-expanded={isOpen}
                  aria-controls={`vl-dr-${d.id}`}
                  onClick={onClick(d.id)}
                  style={y ? { transform: `translateY(${y}px)` } : undefined}
                >
                  <span className="vl-dr__holder">
                    <span className="vl-dr__num">{pad(i)}</span>
                    <span className="vl-dr__name">{d.name}</span>
                  </span>
                  <span
                    className="vl-dr__pull"
                    aria-hidden="true"
                    onPointerDown={onDown(d.id)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                  >
                    <span />
                  </span>
                  <span className="vl-dr__state">{isOpen ? "פתוחה" : "למשוך"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <span className="vl-dr__plinth" aria-hidden="true" />
      </div>

      <aside className="vl-dr__plan" aria-label="מפת האתר">
        <p className="vl-dr__plan-head">מפת האתר</p>
        <ol className="vl-dr__tree">
          <li className="vl-dr__root">עמוד הבית</li>
          {DRAWERS.map((d, i) => (
            <li key={d.id} className={cn(seen.includes(d.id) && "is-seen", open.includes(d.id) && "is-open")}>
              <span className="vl-dr__tick" aria-hidden="true" />
              <span className="vl-dr__tree-num">{pad(i)}</span>
              {d.name}
            </li>
          ))}
          <li className="vl-dr__root">אודות · יצירת קשר</li>
        </ol>
        <p className="vl-dr__say" aria-live="polite">
          {say || "כל מגירה היא עמוד שירות אחד. עמוד אחד, שאלה אחת, חיפוש אחד."}
        </p>
      </aside>
    </div>
  );
};

export default Drawers;
