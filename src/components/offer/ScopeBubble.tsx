// Signature component: בועת ההיקף — fling into a bubble (tap to toss, hold-and-throw with momentum; the bubble swallows and inflates)
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { offer, offerPage } from "@/content/offer";
import { contactInfo, getWhatsAppHref } from "@/lib/contact-utils";
import { useMotionAllowed } from "@/lib/motion";
import { WhatsAppIcon } from "@/components/nz";

const c = offerPage.scope;

/* The three groups you throw from; the fourth ("יסודות") is always inside — it is the chair. */
const GROUPS = offer.scope.slice(0, 3).map((g, gi) => ({ ...g, gi }));
const FOUNDATIONS = offer.scope[3];
const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

/** Short names for the shelf (the brief and the screen-reader labels keep the full names). */
const SHORT: Record<string, string> = {
  "אתר תדמית לעסק": "אתר תדמית",
  "דף נחיתה לקמפיין": "דף נחיתה",
  "אתר תוכן ומגזין": "אתר תוכן",
  "חנות אונליין": "חנות אונליין",
  "עמודי שירות": "עמודי שירות",
  "גלריית עבודות": "גלריה",
  "עמוד אודות": "אודות",
  "שאלות נפוצות": "שאלות נפוצות",
  "בלוג / מגזין": "בלוג",
  "טופס פנייה לוואטסאפ": "טופס לוואטסאפ",
  "מערכת קביעת תורים": "קביעת תורים",
  "תזכורות אוטומטיות": "תזכורות",
  "אזור ניהול": "אזור ניהול",
};
const short = (item: string) => SHORT[item] ?? item;

const keyOf = (gi: number, item: string) => `${gi}:${item}`;
const parseKey = (k: string) => {
  const i = k.indexOf(":");
  return { gi: Number(k.slice(0, i)), item: k.slice(i + 1) };
};

/** Bubble diameter in cqmin of the stage: its AREA follows the number of blocks (honest scaling).
    Full scope stays inside the stage (84cqmin, the stage is taller than wide on phones). */
const diameter = (n: number) => 46 + 38 * Math.sqrt(n / TOTAL);
/** "סוג האתר" (group 0) holds one site type: tossing another one swaps it. */
const SINGLE_GROUP = 0;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const sizeWord = (n: number) => c.sizeWords[n <= 3 ? 1 : n <= 6 ? 2 : n <= 9 ? 3 : 4];
/** Stage geometry shared by CSS and the flight maths: bubble centre (fraction of the stage box). */
const CX = 0.5;
const CY = 0.47;

/** Bead positions (cqmin from the bubble centre): a golden-angle spiral between the chair and the rim. */
function layout(keys: string[]) {
  const n = keys.length;
  const D = diameter(n);
  const R = D / 2 - 5;
  const r0 = D * 0.2;
  return keys.map((k, i) => {
    const t = Math.sqrt((i + 0.5) / Math.max(n, 1));
    const r = r0 + (R - r0) * t;
    const a = i * GOLDEN - Math.PI / 2;
    return { k, ...parseKey(k), x: Math.cos(a) * r, y: Math.sin(a) * r * 0.92 };
  });
}

/** A tubular chair with leather slings: the foundations every site sits on. */
const Chair = () => (
  <svg className="of-bubble__chair" viewBox="0 0 100 84" aria-hidden="true">
    <g className="of-chair__leather">
      <path d="M42 11h38l-3 17H39z" />
      <path d="M20 53h33l22-12H43z" />
      <path d="M16 45l22-12v7L16 52z" />
      <path d="M56 45l22-12v7L56 52z" />
    </g>
    <g className="of-chair__tube">
      <path d="M16 74V44h40v30" />
      <path d="M38 62V32h40v30" />
      <path d="M16 44l22-12M56 44l22-12M16 74l22-12M56 74l22-12" />
      <path d="M38 32l3-22h41l-4 22" />
    </g>
  </svg>
);

type Pt = { x: number; y: number };
interface Flight {
  id: number;
  gi: number;
  from: Pt;
  to: Pt;
  /** "in" lands in the bubble, "out" flies back to its stone, "home" = a throw that missed */
  kind: "in" | "out" | "home";
  key: string;
}

/** One flying bead, animated with the Web Animations API along a thrown arc. */
const Flyer = ({ f, onDone }: { f: Flight; onDone: (f: Flight) => void }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dx = f.to.x - f.from.x;
    const dy = f.to.y - f.from.y;
    const dist = Math.hypot(dx, dy);
    const lift = Math.min(140, 40 + dist * 0.28);
    const mid = { x: f.from.x + dx * 0.5, y: Math.min(f.from.y, f.to.y) - lift * (f.kind === "home" ? 0.3 : 1) };
    const at = (p: Pt, s: number) => `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${s})`;
    const anim = el.animate(
      [
        { transform: at(f.from, 1) },
        { transform: at(mid, f.kind === "in" ? 1.35 : 1.15), offset: 0.48 },
        { transform: at(f.to, f.kind === "in" ? 0.85 : 1) },
      ],
      { duration: Math.min(820, 380 + dist * 0.75), easing: "cubic-bezier(.33,.0,.25,1)", fill: "forwards" },
    );
    anim.onfinish = () => onDone(f);
    return () => {
      anim.onfinish = null;
      anim.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <span ref={ref} className={`of-flyer of-bead--g${f.gi}`} aria-hidden="true" />;
};

interface Drag {
  key: string;
  gi: number;
  item: string;
  id: number;
  x0: number;
  y0: number;
  lifted: boolean;
  mouse: boolean;
  timer: number;
  samples: { x: number; y: number; t: number }[];
}

/**
 * "בועת ההיקף" — the scope bubble (signature of /packages/).
 * The building blocks lie on a shelf under a soap bubble that already holds a chair (the
 * foundations every site sits on). Tap a stone and it is tossed in an arc into the bubble; or hold it
 * for a moment (press with a mouse) and throw it — the bubble swallows it with a wobble and inflates
 * so its AREA follows the scope. A thrown stone that misses falls back to the shelf. Tap a stone that
 * is inside to take it out again. A switch draws the optional monthly subscription as an orbit; a
 * pin pops the bubble. The bubble's contents go to WhatsApp as one plain list (no prices, no tiers),
 * and the page then moves to /thank-you/.
 * a11y: every stone is a real toggle button (aria-pressed), the subscription a switch, an aria-live
 * line says what entered or left. No JS: the shelf and a working WhatsApp link with a general message.
 * Reduced motion: no flights or wobble — stones simply appear in the bubble.
 */
const ScopeBubble = () => {
  const [picked, setPicked] = useState<string[]>([]);
  const [care, setCare] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [gulp, setGulp] = useState(0);
  const [popping, setPopping] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [coarse, setCoarse] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const motion = useMotionAllowed();

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const seq = useRef(0);
  const pickedRef = useRef<string[]>([]);
  pickedRef.current = picked;

  const pending = useMemo(() => new Set(flights.filter((f) => f.kind === "in").map((f) => f.key)), [flights]);
  const n = picked.length;
  const D = diameter(n);
  const beads = useMemo(() => layout(picked), [picked]);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    /* a lifted stone must not scroll the page under the finger */
    const root = rootRef.current;
    const block = (e: TouchEvent) => {
      if (dragRef.current?.lifted) e.preventDefault();
    };
    root?.addEventListener("touchmove", block, { passive: false });
    return () => {
      root?.removeEventListener("touchmove", block);
      if (dragRef.current) window.clearTimeout(dragRef.current.timer);
    };
  }, []);

  /* the bubble wobbles each time it swallows a stone (restart the CSS animation) */
  useEffect(() => {
    const st = stageRef.current;
    if (!gulp || !st || !motion) return;
    st.classList.remove("is-gulping");
    void st.offsetWidth;
    st.classList.add("is-gulping");
  }, [gulp, motion]);

  /* ── geometry (px, relative to the root) ──────────────────────────────── */
  const rel = useCallback((r: DOMRect): Pt => {
    const o = rootRef.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2 - o.left, y: r.top + r.height / 2 - o.top };
  }, []);
  const stoneAt = (key: string): Pt | null => {
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"] .of-drop__bead`);
    return el ? rel(el.getBoundingClientRect()) : null;
  };
  const stageBox = () => {
    const s = stageRef.current!.getBoundingClientRect();
    const o = rootRef.current!.getBoundingClientRect();
    const u = Math.min(s.width, s.height) / 100;
    return { cx: s.left - o.left + s.width * CX, cy: s.top - o.top + s.height * CY, u };
  };
  const beadPx = (keys: string[], key: string): Pt => {
    const { cx, cy, u } = stageBox();
    const b = layout(keys).find((x) => x.k === key);
    return b ? { x: cx + b.x * u, y: cy + b.y * u } : { x: cx, y: cy };
  };
  const insideBubble = (p: Pt) => {
    const { cx, cy, u } = stageBox();
    return Math.hypot(p.x - cx, p.y - cy) < (diameter(pickedRef.current.length) / 2) * u + 18;
  };

  /* ── state changes ────────────────────────────────────────────────────── */
  const land = (key: string) => {
    if (pickedRef.current.includes(key)) return;
    const single = parseKey(key).gi === SINGLE_GROUP;
    const next = [...pickedRef.current.filter((k) => !(single && parseKey(k).gi === SINGLE_GROUP)), key];
    pickedRef.current = next;
    setPicked(next);
    setAnnounce((a) => (single && a.startsWith(c.announceSwapPrefix) ? a : c.announceAdd(parseKey(key).item, next.length)));
    setGulp((g) => g + 1);
  };

  const throwIn = (key: string, from: Pt | null) => {
    if (pickedRef.current.includes(key) || pending.has(key)) return;
    /* one site type: the one inside flies back to the shelf as the new one is tossed */
    if (parseKey(key).gi === SINGLE_GROUP) {
      const old = pickedRef.current.find((k) => parseKey(k).gi === SINGLE_GROUP);
      if (old) takeOut(old, parseKey(key).item);
    }
    if (!motion || !from) return land(key);
    const to = beadPx([...pickedRef.current, key], key);
    setFlights((fs) => [...fs, { id: ++seq.current, gi: parseKey(key).gi, from, to, kind: "in", key }]);
  };

  /** `swapFor`: the site type that replaces it (one announcement for the swap). */
  const takeOut = (key: string, swapFor?: string) => {
    const { item, gi } = parseKey(key);
    const from = motion ? beadPx(pickedRef.current, key) : null;
    const next = pickedRef.current.filter((p) => p !== key);
    pickedRef.current = next;
    setPicked(next);
    setAnnounce(swapFor ? c.announceSwap(item, swapFor) : c.announceRemove(item, next.length));
    const to = motion ? stoneAt(key) : null;
    if (from && to) setFlights((fs) => [...fs, { id: ++seq.current, gi, from, to, kind: "out", key }]);
  };

  const onFlightDone = (f: Flight) => {
    setFlights((fs) => fs.filter((x) => x.id !== f.id));
    if (f.kind === "in") land(f.key);
  };

  const onStone = (key: string) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (picked.includes(key)) takeOut(key);
    else throwIn(key, stoneAt(key));
  };

  const pop = () => {
    const clear = () => {
      setPicked([]);
      setCare(false);
      setPopping(false);
      setAnnounce(c.announceReset);
    };
    if (!motion || n === 0) return clear();
    setPopping(true);
    window.setTimeout(clear, 340);
  };

  const toggleCare = () => {
    setCare(!care);
    setAnnounce(c.announceCare(!care));
  };

  /* ── hold-and-throw ───────────────────────────────────────────────────── */
  const moveGhost = (p: Pt) => {
    const g = ghostRef.current;
    if (g) g.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(1.25)`;
  };
  const lift = (d: Drag) => {
    d.lifted = true;
    setDragging(d.key);
    if (!d.mouse) navigator.vibrate?.(8);
    const o = rootRef.current!.getBoundingClientRect();
    requestAnimationFrame(() => moveGhost({ x: d.x0 - o.left, y: d.y0 - o.top }));
  };
  const endDrag = () => {
    const d = dragRef.current;
    if (d) window.clearTimeout(d.timer);
    dragRef.current = null;
    setDragging(null);
  };

  const onDown = (e: ReactPointerEvent<HTMLButtonElement>, gi: number, item: string) => {
    const key = keyOf(gi, item);
    if (!motion || picked.includes(key) || pending.has(key)) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const mouse = e.pointerType === "mouse";
    const d: Drag = {
      key,
      gi,
      item,
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      lifted: false,
      mouse,
      timer: 0,
      samples: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
    };
    dragRef.current = d;
    if (!mouse) d.timer = window.setTimeout(() => dragRef.current === d && lift(d), 220);
  };

  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    const moved = Math.hypot(e.clientX - d.x0, e.clientY - d.y0);
    if (!d.lifted) {
      if (d.mouse && moved > 5) {
        e.currentTarget.setPointerCapture(e.pointerId);
        lift(d);
      } else if (!d.mouse && moved > 10) {
        endDrag(); /* the finger is scrolling the page */
        return;
      } else return;
    }
    d.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 8) d.samples.shift();
    const o = rootRef.current!.getBoundingClientRect();
    moveGhost({ x: e.clientX - o.left, y: e.clientY - o.top });
  };

  const onUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    if (!d.lifted) return endDrag(); /* a plain tap: the click handler tosses it */
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 400);
    const o = rootRef.current!.getBoundingClientRect();
    const here = { x: e.clientX - o.left, y: e.clientY - o.top };
    /* velocity over the last ~90ms of the gesture */
    const last = d.samples[d.samples.length - 1];
    const first = d.samples.find((s) => last.t - s.t < 90) ?? d.samples[0];
    const dt = Math.max(1, last.t - first.t);
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    const speed = Math.hypot(vx, vy);
    const { cx, cy } = stageBox();
    const tx = cx - here.x;
    const ty = cy - here.y;
    const aim = (vx * tx + vy * ty) / (speed * Math.hypot(tx, ty) || 1);
    const hit = insideBubble(here) || (speed > 0.3 && aim > 0.55);
    const key = d.key;
    endDrag();
    if (hit) throwIn(key, here);
    else {
      const home = stoneAt(key);
      if (home) setFlights((fs) => [...fs, { id: ++seq.current, gi: d.gi, from: here, to: home, kind: "home", key }]);
    }
  };

  const onCancel = () => {
    const d = dragRef.current;
    if (!d) return;
    if (d.lifted) {
      const o = rootRef.current!.getBoundingClientRect();
      const home = stoneAt(d.key);
      const g = ghostRef.current?.getBoundingClientRect();
      if (home && g) setFlights((fs) => [...fs, { id: ++seq.current, gi: d.gi, from: { x: g.left + g.width / 2 - o.left, y: g.top + g.height / 2 - o.top }, to: home, kind: "home", key: d.key }]);
    }
    endDrag();
  };

  /* ── the message ──────────────────────────────────────────────────────── */
  const byGroup = GROUPS.map((g) => ({ ...g, chosen: g.items.filter((it) => picked.includes(keyOf(g.gi, it))) }));
  const message = useMemo(() => {
    if (n === 0 && !care) return c.messageEmpty;
    const lines = [c.messageIntro];
    byGroup.forEach((g) => lines.push(`• ${g.title}: ${g.chosen.length ? g.chosen.join(", ") : c.noneChosen}`));
    lines.push(`• ${FOUNDATIONS.title}: ${c.foundationsNote}`);
    lines.push(`• מנוי חודשי: ${care ? c.careYes : c.careNo}`);
    lines.push(c.messageOutro);
    return lines.join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, care]);
  const href = getWhatsAppHref(contactInfo, message);

  /* After WhatsApp opens in its own tab, this tab walks on to /thank-you/ (which can re-open the same brief). */
  const onSend = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    try {
      sessionStorage.setItem("nz-wa-brief", message);
    } catch {
      /* private mode: the thank-you page falls back to a general message */
    }
    window.setTimeout(() => window.location.assign("/thank-you/"), 450);
  };

  const flyingKey = dragging;

  return (
    <div ref={rootRef} className="of-bub">
      <div className="of-bub__vitrine">
        <div
          ref={stageRef}
          className={`of-stage${popping ? " is-popping" : ""}${care ? " has-care" : ""}`}
          aria-hidden="true"
        >
          <span className="of-stage__floor" style={{ "--d": D } as CSSProperties} />
          <span className="of-stage__orbit" style={{ "--d": D } as CSSProperties}>
            <span className="of-stage__moon" />
          </span>
          <span className="of-bubble" style={{ "--d": D } as CSSProperties}>
            <span className="of-bubble__film" />
            <Chair />
            <span className="of-bubble__shine" />
          </span>
          {beads.map((b) => (
            <span
              key={b.k}
              className={`of-bead of-bead--g${b.gi}`}
              style={{ "--x": b.x.toFixed(2), "--y": b.y.toFixed(2) } as CSSProperties}
            />
          ))}
          <span className="of-stage__caption">{c.chairLabel}</span>
        </div>

        <div className="of-bub__reading">
          <p className="of-bub__count">
            {n === 0 ? (
              c.emptyLine
            ) : (
              <>
                <strong>{c.countLine(n)}</strong>
                <span className="of-bub__size">
                  {c.sizeLabel}: {sizeWord(n)}
                </span>
              </>
            )}
          </p>
          <button type="button" className="of-bub__pop" onClick={pop} disabled={n === 0 && !care}>
            <span className="of-bub__pin" aria-hidden="true" />
            <span aria-hidden="true">{c.popShort}</span>
            <span className="nz-sr">{c.pop}</span>
          </button>
        </div>

        <div className="of-shelf">
          <p className="of-shelf__hint">{coarse ? c.hintTouch : c.hintPointer}</p>
          {GROUPS.map((g) => (
            <div key={g.title} className="of-shelf__row" role="group" aria-labelledby={`of-shelf-${g.gi}`}>
              <span id={`of-shelf-${g.gi}`} className="of-shelf__title">
                <span className={`of-bead of-bead--key of-bead--g${g.gi}`} aria-hidden="true" />
                {g.title}
                {g.gi === SINGLE_GROUP && <span className="of-shelf__one">{c.oneOnly}</span>}
              </span>
              {g.items.map((item) => {
                const key = keyOf(g.gi, item);
                const inside = picked.includes(key);
                const away = pending.has(key) || flyingKey === key || flights.some((f) => f.key === key && f.kind !== "in");
                return (
                  <button
                    key={item}
                    type="button"
                    data-key={key}
                    className={`of-drop${inside ? " is-in" : ""}${away ? " is-away" : ""}`}
                    aria-pressed={inside}
                    aria-label={c.dropLabel(
                      /* the visible short name leads the label (WCAG 2.5.3 label in name) */
                      item.includes(short(item)) ? item : `${short(item)}, ${item}`,
                      inside,
                    )}
                    onClick={() => onStone(key)}
                    onPointerDown={(e) => onDown(e, g.gi, item)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onCancel}
                    onContextMenu={(e) => dragRef.current && e.preventDefault()}
                  >
                    <span className={`of-drop__bead of-bead--g${g.gi}`} aria-hidden="true" />
                    <span className="of-drop__name">{short(item)}</span>
                    <span className="of-drop__check" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="of-bub__care">
          <button type="button" role="switch" aria-checked={care} className="of-switch" onClick={toggleCare}>
            <span className="of-switch__track" aria-hidden="true">
              <span className="of-switch__thumb" />
            </span>
            <span className="of-switch__label">
              {c.careToggle}
              <span className="of-switch__hint">{c.careHint}</span>
            </span>
          </button>
        </div>
      </div>

      <p className="of-bub__fixed">
        <span className="of-bub__fixed-title">
          <span className="of-bub__chairmark" aria-hidden="true" />
          {FOUNDATIONS.title} · {c.foundationsNote}
        </span>
        <span>
          {FOUNDATIONS.items.map((it, i) => (
            <span key={it}>
              {i > 0 && " · "}
              <span className="of-bub__fixed-item">{it}</span>
            </span>
          ))}
        </span>
      </p>

      <div className="of-bub__send">
        <a className="nz-btn nz-btn--primary nz-btn--lg" href={href} target="_blank" rel="noopener noreferrer" onClick={onSend}>
          <WhatsAppIcon className="nz-btn__icon" />
          <span>{c.send}</span>
          <span className="nz-sr"> (נפתח בכרטיסייה חדשה)</span>
        </a>
        <p className="of-bub__note">{c.sendNote}</p>
      </div>

      <div className="of-bub__air" aria-hidden="true">
        {flights.map((f) => (
          <Flyer key={f.id} f={f} onDone={onFlightDone} />
        ))}
        {dragging && <span ref={ghostRef} className={`of-flyer of-flyer--held of-bead--g${parseKey(dragging).gi}`} />}
      </div>

      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default ScopeBubble;
