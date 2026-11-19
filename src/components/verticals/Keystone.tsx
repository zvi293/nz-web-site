// Signature component: אבן הראשה — load test (roll a weight across an arch; weak stones crack and fall, re-cut them)
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";
import "./keystone.css";

/**
 * "אבן הראשה" (contractor page). A stone arch on its wooden centring, built like many
 * tradespeople's sites: it looks whole. Seven stones, four of them weak (no business details,
 * stock photos, every job on one page, a phone number at the bottom of the page). Roll the cart —
 * a real customer checking you — along the deck over the arch: drag it or tap where it should go
 * (touch-action pan-y on the scene, so a vertical swipe still scrolls), use the arrows on the
 * slider (role=slider) or "להעביר את
 * העגלה". Every weak stone the load passes cracks and drops to the ground, and says what the
 * customer did not find. Fallen stones wait in the rubble below: tap one to re-cut it (it rises
 * back as the right part of the site). Run the load again; when every stone holds, the keystone
 * (call / WhatsApp in one tap) locks the arch and the centring is struck. aria-live narrates.
 * SSR / no JS: the whole arch and the full test report (what fails, what replaces it). With JS
 * the report lists a stone only once the load has broken it. Reduced motion: no fall / rise animation, the cart jumps.
 */
/* A stone's `short` is what is carved on it ("|" breaks the line). Weak stones carry a neutral
   name, like the part of the site the visitor sees: before the test the arch looks whole and
   every stone is drawn the same; the crack appears only when the load breaks it. */
type Stone = {
  id: string;
  slot: number; // 0 = left end … 6 = right end (the cart starts on the right)
  weak?: { short: string; label: string; why: string };
  solid: { short: string; label: string; desc: string };
};

const STONES: Stone[] = [
  { id: "area", slot: 0, solid: { short: "אזורים", label: "אזורי שירות", desc: "איפה אתם עובדים, כתוב פעם אחת וברור." } },
  { id: "faq", slot: 1, solid: { short: "שאלות", label: "שאלות לפני שמזמינים", desc: "מה שלקוחות שואלים לפני שהם מכניסים אתכם הביתה." } },
  {
    id: "jobs",
    slot: 2,
    weak: { short: "עבודות", label: "כל העבודות בעמוד אחד", why: "מי שחיפש החלפת לוח חשמל נבלע ברשימה ארוכה, ולא מצא את העבודה שלו." },
    solid: { short: "סוגי|עבודה", label: "עמוד לכל סוג עבודה", desc: "מטבח, חשמל, ריצוף: כל אחד בעמוד משלו." },
  },
  {
    id: "key",
    slot: 3,
    weak: { short: "טלפון", label: "מספר טלפון בתחתית העמוד", why: "הלקוח השתכנע, אבל המספר קבור בסוף העמוד, בכתב קטן. הוא סגר את הדף." },
    solid: { short: "חיוג|בלחיצה", label: "חיוג או וואטסאפ בלחיצה", desc: "אבן הראשה: שיחה בלחיצה אחת, בכל מסך." },
  },
  { id: "process", slot: 4, solid: { short: "תהליך", label: "איך העבודה מתנהלת", desc: "מהביקור הראשון ועד הניקיון בסוף." } },
  {
    id: "before",
    slot: 5,
    weak: { short: "תמונות", label: "תמונות מאגר", why: "הלקוח זיהה תמונות שראה באתרים אחרים, ולא ראה אף עבודה שלכם." },
    solid: { short: "לפני|ואחרי", label: "לפני ואחרי", desc: "תמונות מעבודות אמיתיות, מאותה זווית." },
  },
  {
    id: "licence",
    slot: 6,
    weak: { short: "אודות", label: "בלי שם עסק ורישיון", why: "הלקוח לא ידע מי יגיע אליו הביתה, ואין דבר שמראה שהעסק אמיתי." },
    solid: { short: "רישיון", label: "רישיון ופרטי העסק", desc: "שם העסק, מספר רישום ותמונה שלכם בעבודה." },
  },
];
const WEAK = STONES.filter((s) => s.weak);

/* arch geometry (viewBox 360 × 250); the deck runs over the crown */
const CX = 180;
const CY = 192;
const RO = 158;
const RI = 98;
const DECK = CY - RO - 6;
const SPAN = 180 / 7;
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, a: number) => [CX + r * Math.cos(rad(a)), CY - r * Math.sin(rad(a))];
const wedge = (slot: number) => {
  const a0 = 180 - slot * SPAN - 0.8;
  const a1 = 180 - (slot + 1) * SPAN + 0.8;
  const [x0, y0] = pt(RO, a0);
  const [x1, y1] = pt(RO, a1);
  const [x2, y2] = pt(RI, a1);
  const [x3, y3] = pt(RI, a0);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${RO} ${RO} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}A${RI} ${RI} 0 0 0 ${x3.toFixed(1)} ${y3.toFixed(1)}Z`;
};
const midAngle = (slot: number) => 180 - (slot + 0.5) * SPAN;
const mid = (slot: number) => pt((RO + RI) / 2, midAngle(slot)).map((v) => Math.round(v * 10) / 10);
/** A crack across a weak stone. */
const crack = (slot: number) => {
  const a = midAngle(slot);
  const [x0, y0] = pt(RO - 4, a + 3);
  const [x1, y1] = pt((RO + RI) / 2 + 6, a - 2);
  const [x2, y2] = pt((RO + RI) / 2 - 8, a + 2.5);
  const [x3, y3] = pt(RI + 4, a - 1.5);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}`;
};
/** progress p (0 = right end, 1 = left end) ↔ x on the deck (the cart stays inside the viewBox). */
const RUN = RO - 10;
const xOf = (p: number) => CX + RUN - p * 2 * RUN;
const pAtX = (x: number) => (CX + RUN - x) / (2 * RUN);
const pOf = (slot: number) => pAtX(mid(slot)[0]);

const Keystone = () => {
  const [p, setP] = useState(0);
  const [fallen, setFallen] = useState<string[]>([]);
  const [recut, setRecut] = useState<string[]>([]);
  const [tested, setTested] = useState<string[]>([]);
  const [say, setSay] = useState("");
  const [running, setRunning] = useState(false);
  const pRef = useRef(0);
  const st = useRef({ fallen: [] as string[], recut: [] as string[], tested: [] as string[] });
  const drag = useRef<{ x0: number; p0: number; w: number; left: number; on: boolean } | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const locked = WEAK.every((s) => recut.includes(s.id) && tested.includes(s.id));

  /** Move the cart to `to`; every stone centre it crosses is tested. */
  const roll = (to: number) => {
    const from = pRef.current;
    to = Math.max(0, Math.min(1, to));
    if (to === from) return;
    pRef.current = to;
    setP(to);
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    const crossed = STONES.filter((s) => pOf(s.slot) > lo && pOf(s.slot) <= hi + 1e-6 && pOf(s.slot) >= lo);
    if (!crossed.length) return;
    const s = st.current;
    const newlyFallen: Stone[] = [];
    for (const stone of crossed) {
      if (!stone.weak) continue;
      if (s.recut.includes(stone.id)) {
        if (!s.tested.includes(stone.id)) s.tested = [...s.tested, stone.id];
      } else if (!s.fallen.includes(stone.id)) {
        s.fallen = [...s.fallen, stone.id];
        newlyFallen.push(stone);
      }
    }
    setFallen(s.fallen);
    setTested(s.tested);
    const nowLocked = WEAK.every((w) => s.recut.includes(w.id) && s.tested.includes(w.id));
    if (newlyFallen.length) {
      const last = newlyFallen[newlyFallen.length - 1];
      setSay(`נסדקה ונפלה: ${last.weak!.label}. ${last.weak!.why}`);
    } else if (nowLocked) {
      setSay("כל האבנים מחזיקות. התמיכה יורדת, אבן הראשה נועלת את הקשת, והלקוח מתקשר.");
    } else if (to === 0 || to === 1) {
      const waiting = s.fallen.filter((id) => !s.recut.includes(id)).length;
      const untested = WEAK.filter((w) => s.recut.includes(w.id) && !s.tested.includes(w.id)).length;
      if (waiting) setSay(`העגלה הגיעה לקצה. ${waiting === 1 ? "אבן אחת מחכה" : `${waiting} אבנים מחכות`} למטה: הקישו עליהן כדי לסתת אותן מחדש.`);
      else if (untested) setSay("האבנים החדשות עוד לא נבדקו. העבירו את העגלה שוב.");
    }
  };

  const re = (id: string) => {
    const s = st.current;
    if (!s.fallen.includes(id) || s.recut.includes(id)) return;
    s.recut = [...s.recut, id];
    setRecut(s.recut);
    const stone = STONES.find((x) => x.id === id)!;
    const left = s.fallen.filter((x) => !s.recut.includes(x)).length;
    setSay(`${stone.solid.label} נכנסה למקום. ${left ? `עוד ${left === 1 ? "אבן אחת" : `${left} אבנים`} למטה.` : "עכשיו העבירו את העגלה שוב ובדקו."}`);
  };

  /* drag: horizontal on the scene (pan-y keeps vertical scrolling) */
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || running) return;
    const r = sceneRef.current!.getBoundingClientRect();
    drag.current = { x0: e.clientX, p0: pRef.current, w: r.width, left: r.left, on: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x0;
    if (!d.on && Math.abs(dx) < 5) return;
    d.on = true;
    // moving left = forward (RTL); scene px → viewBox units → p
    roll(d.p0 - (dx * 360) / d.w / (2 * RUN));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    // a tap sends the cart to that spot on the deck
    if (d && !d.on && e.type === "pointerup") roll(pAtX(((e.clientX - d.left) * 360) / d.w));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 1 / 14;
    const k = e.key;
    if (k === "ArrowLeft" || k === "ArrowUp") roll(pRef.current + step);
    else if (k === "ArrowRight" || k === "ArrowDown") roll(pRef.current - step);
    else if (k === "Home") roll(0);
    else if (k === "End") roll(1);
    else return;
    e.preventDefault();
  };

  /* "push the cart": the load rolls to the other end on its own */
  const run = () => {
    if (running) return;
    const from = pRef.current;
    const to = from > 0.5 ? 0 : 1;
    if (!motionAllowed()) {
      roll(to);
      return;
    }
    setRunning(true);
    const t0 = performance.now();
    const dur = 2600 * Math.abs(to - from);
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      roll(from + (to - from) * e);
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    cancelAnimationFrame(raf.current);
    setRunning(false);
    st.current = { fallen: [], recut: [], tested: [] };
    pRef.current = 0;
    setP(0);
    setFallen([]);
    setRecut([]);
    setTested([]);
    setSay("הקשת חזרה למצב שבו התחלנו. העגלה מחכה בקצה.");
  };

  /* the cart rides the deck over the arch */
  const cx = xOf(p);
  const under = STONES.reduce((best, s) => (Math.abs(pOf(s.slot) - p) < Math.abs(pOf(best.slot) - p) ? s : best), STONES[0]);
  /* a weak stone is named neutrally until the load breaks it (no spoiler before the test) */
  const underName = !under.weak || recut.includes(under.id) ? under.solid.label : fallen.includes(under.id) ? `חסרה: ${under.weak.label}` : under.weak.short.replace("|", " ");
  const waiting = fallen.filter((id) => !recut.includes(id));

  return (
    <div className={cn("vl-ks", locked && "is-locked", running && "is-running")}>
      <div
        ref={sceneRef}
        className="vl-ks__scene"
        role="slider"
        tabIndex={0}
        aria-label="העגלה על הקשת"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(p * 100)}
        aria-valuetext={`העגלה מעל: ${underName}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        <svg className="vl-ks__svg" viewBox="0 -22 360 272" aria-hidden="true">
          {/* the wooden centring */}
          <g className="vl-ks__centring">
            <path d={`M${CX - RI + 2} ${CY}A${RI - 2} ${RI - 2} 0 0 1 ${CX + RI - 2} ${CY}Z`} className="vl-ks__form" />
            {[-60, -30, 0, 30, 60].map((dx) => (
              <path key={dx} d={`M${CX + dx} ${CY}V${Math.round(CY - Math.sqrt((RI - 4) ** 2 - dx ** 2))}`} className="vl-ks__strut" />
            ))}
            <path d={`M${CX - RI + 6} ${CY + 8}H${CX + RI - 6}`} className="vl-ks__beam" />
            <path d={`M${CX - 70} ${CY + 8}V${CY + 30}M${CX + 70} ${CY + 8}V${CY + 30}`} className="vl-ks__strut" />
          </g>
          <rect x={CX - RO} y={CY} width={RO - RI} height="34" className="vl-ks__pier" />
          <rect x={CX + RI} y={CY} width={RO - RI} height="34" className="vl-ks__pier" />
          <path d={`M0 ${CY + 34}H360`} className="vl-ks__ground" />

          {/* the stones */}
          {STONES.map((s) => {
            const isFallen = fallen.includes(s.id) && !recut.includes(s.id);
            const isRecut = recut.includes(s.id);
            const isWeak = !!s.weak && !isRecut;
            const [mx, my] = mid(s.slot);
            const words = (isWeak ? s.weak!.short : s.solid.short).split("|");
            return (
              <g key={s.id} className={cn("vl-ks__slot", isFallen && "is-fallen", isRecut && "is-recut", s.id === "key" && "is-key")}>
                <path d={wedge(s.slot)} className="vl-ks__hole" />
                <g
                  className="vl-ks__stone"
                  style={{
                    ["--fx" as string]: `${(CX + (s.slot - 3) * 30 - mx).toFixed(0)}px`,
                    ["--fy" as string]: `${(CY + 14 - my).toFixed(0)}px`,
                    ["--fr" as string]: `${s.slot % 2 ? 70 : -64}deg`,
                  }}
                >
                  <path d={wedge(s.slot)} />
                  {isFallen && <path d={crack(s.slot)} className="vl-ks__crack" />}
                  <text x={mx} y={my + 5 - (words.length - 1) * 7.5} textAnchor="middle" className="vl-ks__stone-label">
                    {words.map((w, i) => (
                      <tspan key={w} x={mx} dy={i ? 15 : 0}>
                        {w}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}

          {/* the deck over the arch, on spandrel posts */}
          <g className="vl-ks__deck">
            <path d={`M${CX - RO - 10} ${DECK}H${CX + RO + 10}`} className="vl-ks__deck-top" />
            {[-128, -96, -64, -32, 32, 64, 96, 128].map((dx) => (
              <path key={dx} d={`M${CX + dx} ${DECK + 2}V${(CY - Math.sqrt(RO ** 2 - dx ** 2) - 1).toFixed(1)}`} className="vl-ks__post" />
            ))}
            <path d={`M${CX - RO - 10} ${DECK}V${CY}M${CX + RO + 10} ${DECK}V${CY}`} className="vl-ks__post" />
          </g>
          {/* the cart: a crate on two wheels */}
          <g className="vl-ks__cart" transform={`translate(${cx.toFixed(1)} ${DECK})`}>
            <rect x="-28" y="-40" width="56" height="29" rx="2.5" className="vl-ks__crate" />
            <text x="0" y="-21" textAnchor="middle" className="vl-ks__crate-label">
              לקוח
            </text>
            <circle cx="-16" cy="-6" r="6" className="vl-ks__wheel" />
            <circle cx="16" cy="-6" r="6" className="vl-ks__wheel" />
          </g>
        </svg>
        <span className="vl-ks__seal" aria-hidden="true">
          הקשת עומדת
        </span>
      </div>

      <div className="vl-ks__side">
        <div className="vl-ks__controls">
          <button type="button" className="vl-ks__run" onClick={run} aria-disabled={running}>
            {p > 0.5 ? "להחזיר את העגלה" : "להעביר את העגלה"}
          </button>
          <span className="vl-ks__under" aria-hidden="true">{`מעל: ${underName}`}</span>
        </div>
        <p className="vl-ks__say" aria-live="polite">
          {say || "הקשת נראית שלמה. העבירו עליה את העגלה, ובדקו מה קורה כשלקוח אמיתי עובר עליה."}
        </p>
        <p className="vl-ks__head">
          <span>דוח הבדיקה</span>
          <span>
            {locked
              ? "כל האבנים מחזיקות"
              : waiting.length
                ? `${waiting.length === 1 ? "אבן אחת" : `${waiting.length} אבנים`} למטה`
                : fallen.length
                  ? `${recut.length} מתוך ${fallen.length} סותתו`
                  : "לפני הבדיקה"}
          </span>
        </p>
        <ul className="vl-ks__report">
          {!fallen.length && <li className="vl-ks__blank">הדוח מתמלא כשהעגלה עוברת: כל אבן שלא תחזיק תופיע כאן, עם מה שהלקוח לא מצא.</li>}
          {WEAK.map((s) => {
            const isFallen = fallen.includes(s.id);
            const isRecut = recut.includes(s.id);
            const state = isRecut ? (tested.includes(s.id) ? "held" : "recut") : isFallen ? "fallen" : "idle";
            return (
              <li key={s.id} className={cn("vl-ks__item", `is-${state}`)}>
                {state === "fallen" ? (
                  <button type="button" className="vl-ks__recut" onClick={() => re(s.id)}>
                    <span className="vl-ks__item-was">{s.weak!.label}</span>
                    <span className="vl-ks__item-why">{s.weak!.why}</span>
                    <span className="vl-ks__item-act">{`לסתת מחדש: ${s.solid.label}`}</span>
                  </button>
                ) : (
                  <div className="vl-ks__item-in">
                    <span className="vl-ks__item-was">{s.weak!.label}</span>
                    <span className="vl-ks__item-now">
                      {s.solid.label}
                      <span>{` · ${s.solid.desc}`}</span>
                    </span>
                    <span className="vl-ks__item-state">
                      {state === "idle" ? "עוד לא נבדקה" : state === "recut" ? "סותתה, מחכה לבדיקה" : "מחזיקה"}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <button type="button" className="vl-ks__reset" onClick={reset}>
          לבנות את הקשת מההתחלה
        </button>
      </div>
    </div>
  );
};

export default Keystone;
