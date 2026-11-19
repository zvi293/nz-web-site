// Signature component: סדר הצפייה — reorder (drag the parts of a listing page into the order a buyer reads)
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";
import "./viewing-order.css";

/**
 * "סדר הצפייה" (real-estate page). A property page of a realtor's site, built the way many are:
 * the office first, the photos last. Six parts of the page are rows of a listing sheet; drag a
 * row by its grip (pointer: touch-action none on the grip only, so the page keeps scrolling) or
 * tap its ▲/▼ (keyboard: ↑/↓ on the grip) to move it. Every slot says what the buyer is doing at
 * that depth, a vermilion reading line runs down the sheet as far as he reads, and the row where
 * he leaves is marked. Photos first, the property's details second and the WhatsApp button last
 * → he reads to the end and books a viewing ("נקבע ביקור" stamp). During a drag only transforms
 * move (the dragged row follows the pointer, the others open a gap); the DOM reorders on release
 * and the rows glide to their places (FLIP). aria-live narrates. SSR / no JS: the sheet in its
 * starting order + the order that works, in words.
 */
type Block = { id: string; name: string; line: string };

const BLOCKS: Block[] = [
  { id: "photos", name: "תמונות של הנכס", line: "תמונה גדולה ראשונה, ואחריה גלריה." },
  { id: "facts", name: "פרטי הנכס", line: "חדרים, קומה, שטח, חניה ומרפסת." },
  { id: "plan", name: "תוכנית הדירה", line: "איך החדרים יושבים זה ליד זה." },
  { id: "map", name: "מפה והשכונה", line: "מה קרוב: גן, תחבורה, פארק." },
  { id: "agent", name: "המתווך", line: "מי משווק את הנכס, ולמה לדבר איתו." },
  { id: "contact", name: "וואטסאפ עם שם הנכס", line: "פנייה בלחיצה, עם שם הנכס בהודעה." },
];
const START = ["agent", "contact", "map", "facts", "plan", "photos"];
const MOODS = ["עוצר או עוזב", "בודק שזה מתאים", "מדמיין איך גרים שם", "מסתכל סביב", "שואל מי מוכר", "מוכן להרים טלפון"];
const N = BLOCKS.length;
const byId = (id: string) => BLOCKS.find((b) => b.id === id)!;

/** How far the buyer reads (1..6) and whether he calls. */
function verdict(order: string[]): { reach: number; calls: boolean; say: string } {
  if (order[0] !== "photos") {
    return { reach: 1, calls: false, say: `הקונה פתח את העמוד וראה קודם ${byId(order[0]).name}. בלי תמונה אין לו סיבה לגלול, והוא חוזר לתוצאות החיפוש.` };
  }
  if (order[1] !== "facts") {
    return { reach: 2, calls: false, say: `התמונות עצרו אותו, אבל מיד אחריהן הוא פגש ${byId(order[1]).name} ולא מצא כמה חדרים ובאיזו קומה. הוא עוזב לפני שבדק שהנכס מתאים לו.` };
  }
  if (order[N - 1] !== "contact") {
    return { reach: N, calls: false, say: "הקונה קרא עד הסוף, אבל בסוף העמוד אין איך לפנות. הכפתור נשאר למעלה, והוא כבר לא חוזר לחפש אותו." };
  }
  return { reach: N, calls: true, say: "הקונה עצר בתמונות, בדק שהנכס מתאים, ראה את התוכנית והשכונה, הכיר את המתווך ולחץ על וואטסאפ. נקבע ביקור." };
}

const Drawing = ({ id }: { id: string }) => (
  <svg className="vl-vo__draw" viewBox="0 0 72 52" aria-hidden="true">
    {id === "photos" && (
      <>
        <rect x="3" y="4" width="66" height="44" rx="2" />
        <path d="M5 42l18-17 12 11 9-8 23 16" />
        <circle cx="52" cy="15" r="5" />
      </>
    )}
    {id === "facts" && (
      <>
        <path d="M6 10h18M34 10h30M6 22h14M34 22h24M6 34h20M34 34h28M6 46h12M34 46h20" />
      </>
    )}
    {id === "plan" && (
      <>
        <rect x="4" y="4" width="64" height="44" />
        <path d="M36 4v20M4 26h22M36 34v14M46 26h22M26 26a10 10 0 0 1 10 -10" />
      </>
    )}
    {id === "map" && (
      <>
        <path d="M0 18h72M0 38h72M22 0v52M52 0v52" className="vl-vo__street" />
        <path d="M37 30c-5-6-7-9-7-12a7 7 0 0 1 14 0c0 3-2 6-7 12Z" className="vl-vo__pin" />
      </>
    )}
    {id === "agent" && (
      <>
        <circle cx="20" cy="18" r="9" />
        <path d="M5 48c1-10 7-15 15-15s14 5 15 15M44 18h24M44 28h18M44 38h22" />
      </>
    )}
    {id === "contact" && (
      <>
        <rect x="6" y="14" width="60" height="24" rx="12" className="vl-vo__pill" />
        <path d="M22 21c-4 0-7 3-7 5.5 0 1.4.7 2.7 1.8 3.6L16 33l3.4-1.4c.8.3 1.7.4 2.6.4 4 0 7-2.5 7-5.5S26 21 22 21Z" className="vl-vo__chat" />
        <path d="M35 26h22" className="vl-vo__pill-text" />
      </>
    )}
  </svg>
);

const ViewingOrder = () => {
  const [order, setOrder] = useState<string[]>(START);
  const [say, setSay] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const rows = useRef<Record<string, HTMLLIElement | null>>({});
  const before = useRef<Record<string, DOMRect> | null>(null);
  const refocus = useRef<{ id: string; part: "grip" | "up" | "down" } | null>(null);
  const drag = useRef<{ id: string; y0: number; from: number; to: number; tops: number[]; heights: number[]; gap: number; moved: boolean } | null>(null);
  const orderRef = useRef(order);

  const v = verdict(order);

  /* FLIP: rows glide from where they were drawn to their new place; then focus returns. */
  useLayoutEffect(() => {
    const b = before.current;
    before.current = null;
    if (b && motionAllowed()) {
      for (const id of order) {
        const el = rows.current[id];
        const r0 = b[id];
        if (!el || !r0 || !el.animate) continue;
        const dy = r0.top - el.getBoundingClientRect().top;
        if (Math.abs(dy) < 1) continue;
        el.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], { duration: 520, easing: "cubic-bezier(0.2, 0.8, 0.1, 1)" });
      }
    }
    const f = refocus.current;
    refocus.current = null;
    if (f) rows.current[f.id]?.querySelector<HTMLElement>(`[data-part="${f.part}"]`)?.focus({ preventScroll: true });
  }, [order]);

  const snapshot = () => {
    const snap: Record<string, DOMRect> = {};
    for (const id of orderRef.current) {
      const el = rows.current[id];
      if (el) snap[id] = el.getBoundingClientRect();
    }
    return snap;
  };

  const commit = (next: string[], movedId: string, snap?: Record<string, DOMRect>) => {
    before.current = snap ?? snapshot();
    orderRef.current = next;
    setOrder(next);
    const at = next.indexOf(movedId) + 1;
    const res = verdict(next);
    setSay(`${byId(movedId).name} עבר למקום ${at}. ${res.say}`);
  };

  const move = (id: string, delta: number, part: "grip" | "up" | "down") => {
    const cur = orderRef.current;
    const i = cur.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= N) {
      setSay(delta < 0 ? `${byId(id).name} כבר בראש העמוד.` : `${byId(id).name} כבר בסוף העמוד.`);
      return;
    }
    const next = [...cur];
    next.splice(i, 1);
    next.splice(j, 0, id);
    refocus.current = { id, part };
    commit(next, id);
  };

  const onGripKey = (id: string) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      move(id, e.key === "ArrowUp" ? -1 : 1, "grip");
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const i = orderRef.current.indexOf(id);
      move(id, e.key === "Home" ? -i : N - 1 - i, "grip");
    }
  };

  /* Drag by the grip: transforms only while dragging; the DOM reorders on release. */
  const paintDrag = (dy: number) => {
    const d = drag.current;
    if (!d) return;
    const cur = orderRef.current;
    const h = d.heights[d.from] + d.gap;
    const center = d.tops[d.from] + d.heights[d.from] / 2 + dy;
    let to = 0;
    for (let k = 0; k < N; k++) if (center > d.tops[k] + d.heights[k] / 2) to = k;
    if (center < d.tops[0] + d.heights[0] / 2) to = 0;
    d.to = to;
    cur.forEach((id, k) => {
      const el = rows.current[id];
      if (!el) return;
      if (k === d.from) el.style.transform = `translateY(${dy}px)`;
      else if (d.from < to && k > d.from && k <= to) el.style.transform = `translateY(${-h}px)`;
      else if (d.from > to && k < d.from && k >= to) el.style.transform = `translateY(${h}px)`;
      else el.style.transform = "";
    });
  };
  const onDown = (id: string) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    const cur = orderRef.current;
    const tops: number[] = [];
    const heights: number[] = [];
    cur.forEach((rid) => {
      const r = rows.current[rid]!.getBoundingClientRect();
      tops.push(r.top);
      heights.push(r.height);
    });
    const gap = cur.length > 1 ? tops[1] - (tops[0] + heights[0]) : 0;
    drag.current = { id, y0: e.clientY, from: cur.indexOf(id), to: cur.indexOf(id), tops, heights, gap, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y0;
    if (!d.moved && Math.abs(dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      setDragId(d.id);
    }
    paintDrag(dy);
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setDragId(null);
    if (!d.moved) return;
    const snap = snapshot(); // visual positions (with transforms) → FLIP from here
    for (const id of orderRef.current) {
      const el = rows.current[id];
      if (!el) continue;
      el.style.transition = "none";
      el.style.transform = "";
      requestAnimationFrame(() => (el.style.transition = ""));
    }
    if (d.to === d.from) {
      before.current = snap;
      setOrder([...orderRef.current]);
      return;
    }
    const next = [...orderRef.current];
    next.splice(d.from, 1);
    next.splice(d.to, 0, d.id);
    refocus.current = { id: d.id, part: "grip" };
    commit(next, d.id, snap);
  };

  const atStart = order.join() === START.join();
  const reset = () => {
    if (orderRef.current.join() === START.join()) return;
    before.current = snapshot();
    orderRef.current = START;
    setOrder(START);
    setSay("העמוד חזר לסדר שבו התחלנו: המשרד קודם, התמונות בסוף.");
  };

  return (
    <div className={cn("vl-vo", v.calls && "is-booked", dragId && "is-dragging")}>
      <div className="vl-vo__sheet">
        <p className="vl-vo__crest" aria-hidden="true">
          <span>עמוד נכס · דירה לדוגמה ברחוב הדקל</span>
          <span>{v.calls ? "נקבע ביקור" : `הקונה קורא עד חלק ${v.reach}`}</span>
        </p>
        <ol className="vl-vo__list" aria-label="חלקי עמוד הנכס, לפי הסדר">
          {order.map((id, i) => {
            const b = byId(id);
            const read = i < v.reach;
            const exit = !v.calls && i === v.reach - 1;
            return (
              <li
                key={id}
                ref={(el) => (rows.current[id] = el)}
                className={cn("vl-vo__row", read && "is-read", exit && "is-exit", dragId === id && "is-lifted", v.calls && id === "contact" && "is-call")}
              >
                <p className="vl-vo__slot" aria-hidden="true">
                  <span className="vl-vo__slot-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>{MOODS[i]}</span>
                  {exit && <span className="vl-vo__exit">{v.reach === N ? "לא מוצא איך לפנות" : "כאן הוא עוזב"}</span>}
                </p>
                <div className="vl-vo__body">
                  <button
                    type="button"
                    className="vl-vo__grip"
                    data-part="grip"
                    aria-label={`להזיז: ${b.name}, מקום ${i + 1} מתוך ${N}`}
                    aria-describedby="vl-vo-how"
                    onPointerDown={onDown(id)}
                    onPointerMove={onMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onKeyDown={onGripKey(id)}
                  >
                    <span aria-hidden="true" />
                  </button>
                  <Drawing id={id} />
                  <span className="vl-vo__text">
                    <span className="vl-vo__name">{b.name}</span>
                    <span className="vl-vo__line">{b.line}</span>
                  </span>
                  <span className="vl-vo__arrows">
                    <button
                      type="button"
                      className="vl-vo__arrow"
                      data-part="up"
                      aria-label={`להעלות: ${b.name}`}
                      aria-disabled={i === 0}
                      onClick={() => move(id, -1, "up")}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 10l5-5 5 5" /></svg>
                    </button>
                    <button
                      type="button"
                      className="vl-vo__arrow"
                      data-part="down"
                      aria-label={`להוריד: ${b.name}`}
                      aria-disabled={i === N - 1}
                      onClick={() => move(id, 1, "down")}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6l5 5 5-5" /></svg>
                    </button>
                  </span>
                </div>
                {v.calls && id === "contact" && (
                  <span className="vl-vo__stamp" aria-hidden="true">
                    נקבע ביקור
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="vl-vo__side">
        <p className="vl-vo__side-head">מה הקונה עושה</p>
        <p className="vl-vo__say" aria-live="polite">
          {say || v.say}
        </p>
        <p id="vl-vo-how" className="vl-vo__how">
          גררו חלק בידית או הזיזו אותו בחיצים. כל מקום בעמוד אומר מה הקונה עושה כשהוא מגיע אליו.
        </p>
        <p className="vl-vo__nojs">הסדר שעובד: תמונות, פרטי הנכס, תוכנית ושכונה, המתווך, ובסוף וואטסאפ עם שם הנכס.</p>
        <button type="button" className="vl-vo__reset" onClick={reset} aria-disabled={atStart}>
          להחזיר לסדר ההתחלתי
        </button>
      </div>
    </div>
  );
};

export default ViewingOrder;
