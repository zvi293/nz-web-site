// Signature component: מירוץ האור — race playback
import { useEffect, useRef, useState } from "react";
import "./race.css";

/**
 * "מירוץ האור" — the same page loads twice, side by side in time: a heavy build and an optimised
 * one. Tap to start: a beam of light runs along each lane as that page loads (the beam = loading
 * progress), the small screen at the lane's end builds itself (text → main image → button), a
 * dial fills with the time spent, and notes light up as each lane passes them (the heavy page
 * stalls on a blocking script and jumps when a banner arrives). It is an ILLUSTRATION — relative
 * timings, no numbers — and says so. A network switch (Wi-Fi / weak cellular) stretches both
 * lanes; the heavy one suffers more.
 *
 * - Playback: one requestAnimationFrame loop, only while running AND on screen — the
 *   IntersectionObserver cancels the loop when the exhibit leaves the viewport and restarts it
 *   when it returns (the race clock pauses meanwhile). Per-frame values go straight to CSS
 *   custom properties on the lanes (--p progress, --d dial); React state changes only when a
 *   milestone is crossed.
 * - First view / SSR / no JS / reduced motion: the FINISHED race ("preview"): both small screens
 *   built, the heavy one shifted by its banner, every note lit, the dials full — so the lesson is
 *   readable without playing it. Tapping plays the race from the start (with motion allowed);
 *   without motion the tap shows the same finished state. Changing the network returns to the
 *   finished picture for that network. The start button is hidden without JS. Both dials are
 *   stopwatches on one scale (a full turn = the heavy page on home Wi-Fi): on weak cellular the
 *   heavy page's dial runs a second, inner lap.
 * - Finished state says who won without numbers: a "ראשון" / "שני" chip beside each lane's title,
 *   different statuses, and a lime "ghost" tick on the heavy track at the point the heavy page
 *   had reached when the optimised one finished (it was still on a white screen).
 * - Phones: starting the race brings the whole exhibit under the header (both lanes in one
 *   screen) and the notes fold away while the lanes run; they return lit when it is over.
 * - One aria-live sentence (start / result); the visible result line is not live.
 */
type LaneKey = "heavy" | "fast";
type Net = "wifi" | "cell";

/** Time fraction → progress fraction (piecewise linear). */
const CURVE: Record<LaneKey, [number, number][]> = {
  heavy: [
    [0, 0],
    [0.12, 0.05],
    [0.34, 0.09],
    [0.46, 0.32],
    [0.7, 0.52],
    [0.82, 0.68],
    [0.95, 0.9],
    [1, 1],
  ],
  fast: [
    [0, 0],
    [0.22, 0.32],
    [0.5, 0.68],
    [0.8, 0.9],
    [1, 1],
  ],
};
/** Lane durations in ms of animation (an illustration, not a measurement). */
const DUR: Record<Net, Record<LaneKey, number>> = {
  wifi: { fast: 1500, heavy: 5200 },
  cell: { fast: 2500, heavy: 8800 },
};
/** Milestones in progress space (the same marks on both tracks). */
const MARKS = [
  { at: 0.3, label: "טקסט" },
  { at: 0.66, label: "תוכן ראשי" },
  { at: 0.9, label: "אפשר ללחוץ" },
];
/** Notes that light up as a lane passes them (by progress). */
const NOTES: Record<LaneKey, { at: number; text: string }[]> = {
  heavy: [
    { at: 0.06, text: "מסך לבן: סקריפט חוסם את הציור" },
    { at: 0.45, text: "באנר הגיע מאוחר, והדף קפץ" },
    { at: 0.68, text: "התמונה הראשית, כבדה, מגיעה אחרונה" },
  ],
  fast: [
    { at: 0.3, text: "העיצוב והגופן הקריטיים נטענים ראשונים" },
    { at: 0.66, text: "תמונה דחוסה, בגודל של המסך" },
    { at: 0.9, text: "סקריפטים נדחים לסוף, ולכל רכיב מקום שמור" },
  ],
};
const SHIFT_AT = 0.45; // heavy lane: where the banner lands and pushes the page

const STATUS = (p: number, k: LaneKey, done: boolean) => {
  if (done) return k === "fast" ? "מוכן ללחיצה" : "מוכן, באיחור";
  if (p <= 0) return "ממתין";
  if (p < 0.3) return k === "heavy" && p > 0.04 ? "מחכה לסקריפט" : "מסך לבן";
  if (p < 0.66) return "הטקסט מופיע";
  if (p < 0.9) return "התוכן הראשי הופיע";
  return "אפשר ללחוץ";
};

function progressAt(k: LaneKey, f: number) {
  const c = CURVE[k];
  if (f <= 0) return 0;
  if (f >= 1) return 1;
  for (let i = 1; i < c.length; i++) {
    const [t1, p1] = c[i];
    const [t0, p0] = c[i - 1];
    if (f <= t1) return p0 + ((f - t0) / (t1 - t0)) * (p1 - p0);
  }
  return 1;
}

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

type Phase = "preview" | "running" | "done";
/** The dials are stopwatches on ONE scale: a full turn = the heavy page on home Wi-Fi. On weak
 *  cellular the heavy page needs more than a full turn (the second lap is the inner ring). */
const DIAL_REF = DUR.wifi.heavy;
const FAST_DIAL = DUR.wifi.fast / DIAL_REF;
/** Where the heavy page stood (progress) at the moment the optimised one finished. */
const ghostAt = (n: Net) => progressAt("heavy", DUR[n].fast / DUR[n].heavy);

/** The visible result line, per phase and network (no numbers: the timings are illustrative). */
const RESULT: Record<Phase, Record<Net, string>> = {
  preview: {
    wifi: "כך נגמר המירוץ: שני הדפים נטענו, אבל כשהמותאם כבר היה מוכן ללחיצה, הכבד עוד הציג מסך לבן. הזמנים יחסיים ומדגימים דף טיפוסי, הם לא מדידה של אתר מסוים.",
    cell: "ברשת סלולרית חלשה שני הדפים איטיים יותר, אבל הכבד נפגע יותר: השעון שלו משלים סיבוב שני, כי ההמתנה לסקריפט החוסם מתארכת והתמונה הכבדה מגיעה אחרונה. הזמנים יחסיים ומדגימים דף טיפוסי.",
  },
  running: {
    wifi: "אותו דף, נטען פעמיים ברשת ביתית. הזמנים יחסיים ומדגימים דף טיפוסי, הם לא מדידה של אתר מסוים.",
    cell: "אותו דף, נטען פעמיים ברשת סלולרית חלשה. הזמנים יחסיים ומדגימים דף טיפוסי, הם לא מדידה של אתר מסוים.",
  },
  done: {
    wifi: "הדף המותאם סיים ראשון. ברגע שהיה אפשר ללחוץ עליו, הדף הכבד עוד הציג מסך לבן וחיכה לסקריפט.",
    cell: "גם ברשת חלשה המותאם סיים ראשון, אבל הפער גדל: השעון של הדף הכבד השלים סיבוב שני, כי הוא חיכה לסקריפט החוסם עוד יותר זמן והבאנר הקפיץ אותו מאוחר עוד יותר.",
  },
};
const LIVE: Record<Net, string> = {
  wifi: "הדף המותאם סיים ראשון. הדף הכבד הגיע שני, אחרי שחיכה לסקריפט וקפץ באמצע.",
  cell: "ברשת חלשה המותאם סיים ראשון, והפער גדל: הדף הכבד חיכה לסקריפט עוד יותר זמן.",
};

const LANES: { key: LaneKey; name: string; line: string }[] = [
  { key: "heavy", name: "דף כבד", line: "תמונות מלאות, תוספים, צ׳אט וגופן חיצוני" },
  { key: "fast", name: "דף מותאם", line: "אותו דף, אחרי תיקון תמונות, קוד וטעינה" },
];

const LightRace = () => {
  const [phase, setPhase] = useState<Phase>("preview");
  const [net, setNet] = useState<Net>("wifi");
  const [prog, setProg] = useState<Record<LaneKey, number>>({ heavy: 1, fast: 1 }); // milestone-quantised
  const [winner, setWinner] = useState<LaneKey | null>("fast");
  const [ghost, setGhost] = useState<number | null>(() => ghostAt("wifi")); // heavy progress when the fast lane finished
  const laneRefs = useRef<Record<LaneKey, HTMLDivElement | null>>({ heavy: null, fast: null });
  const rootRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const clock = useRef({ elapsed: 0, last: 0, visible: true });
  const netRef = useRef<Net>(net);
  netRef.current = net;
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  const paint = (k: LaneKey, p: number, dialFrac: number) => {
    const el = laneRefs.current[k];
    if (!el) return;
    el.style.setProperty("--p", p.toFixed(4));
    el.style.setProperty("--d", Math.min(1, dialFrac).toFixed(4));
    el.style.setProperty("--d2", Math.max(0, Math.min(1, dialFrac - 1)).toFixed(4));
  };

  /* quantise progress so React re-renders only when a mark / note / shift is crossed */
  const STEPS = [0, 0.04, 0.06, 0.3, SHIFT_AT, 0.66, 0.68, 0.9, 1];
  const quant = (p: number) => STEPS.filter((s) => p >= s).pop() ?? 0;

  const tick = (now: number) => {
    const c = clock.current;
    if (!c.visible) {
      raf.current = 0; // off screen: stop the loop; the observer restarts it
      return;
    }
    c.elapsed += now - (c.last || now);
    c.last = now;
    const d = DUR[netRef.current];
    const pf = progressAt("fast", c.elapsed / d.fast);
    const ph = progressAt("heavy", c.elapsed / d.heavy);
    paint("fast", pf, Math.min(c.elapsed, d.fast) / DIAL_REF);
    paint("heavy", ph, Math.min(c.elapsed, d.heavy) / DIAL_REF);
    setProg((cur) => {
      const nf = quant(pf);
      const nh = quant(ph);
      return cur.fast === nf && cur.heavy === nh ? cur : { fast: nf, heavy: nh };
    });
    if (pf >= 1) {
      setWinner((w) => w ?? "fast");
      setGhost((g) => g ?? ph);
    }
    if (ph >= 1) {
      setPhase("done");
      raf.current = 0;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };
  /* the observer below is set up once; it reaches the latest tick through this ref */
  const tickRef = useRef(tick);
  tickRef.current = tick;

  /* pause off screen */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      clock.current.visible = e.isIntersecting;
      clock.current.last = 0;
      if (!e.isIntersecting && raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      } else if (e.isIntersecting && phaseRef.current === "running" && !raf.current) {
        raf.current = requestAnimationFrame(tickRef.current);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const finish = (to: Phase = "done") => {
    const d = DUR[netRef.current];
    paint("fast", 1, d.fast / DIAL_REF);
    paint("heavy", 1, d.heavy / DIAL_REF);
    setProg({ fast: 1, heavy: 1 });
    setWinner("fast");
    setGhost(ghostAt(netRef.current));
    setPhase(to);
  };

  /* Phones: bring the whole exhibit (switch, button, both lanes) under the header. */
  const bring = () => {
    const el = rootRef.current;
    if (!el || typeof window === "undefined") return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
    const r = el.getBoundingClientRect();
    const lanes = el.querySelector(".race__lanes")?.getBoundingClientRect();
    const bottom = lanes ? lanes.bottom : r.bottom;
    if (r.top < header || bottom > window.innerHeight) el.scrollIntoView({ block: "start", behavior: motionOn() ? "smooth" : "auto" });
  };

  const start = () => {
    cancelAnimationFrame(raf.current);
    setWinner(null);
    setGhost(null);
    setProg({ heavy: 0, fast: 0 });
    paint("fast", 0, 0);
    paint("heavy", 0, 0);
    if (!motionOn()) {
      finish();
      return;
    }
    clock.current = { elapsed: 0, last: 0, visible: true };
    phaseRef.current = "running";
    setPhase("running");
    bring();
    raf.current = requestAnimationFrame(tick);
  };

  const changeNet = (n: Net) => {
    setNet(n);
    netRef.current = n;
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    finish("preview");
  };

  const live = phase === "running" ? "המירוץ התחיל." : phase === "done" ? LIVE[net] : "";
  /* finish order: the optimised lane gets its chip the moment it finishes, the heavy one at the end */
  const order: Record<LaneKey, string> = { fast: winner ? "ראשון" : "", heavy: phase !== "running" ? "שני" : "" };

  return (
    <div ref={rootRef} className={`race race--${phase}`} data-net={net}>
      <div className="race__bar">
        <fieldset className="race__net">
          <legend className="race__net-k">רשת</legend>
          {(
            [
              ["wifi", "Wi-Fi ביתי"],
              ["cell", "סלולרי חלש"],
            ] as [Net, string][]
          ).map(([k, label]) => (
            <label key={k} className={"race__net-opt" + (net === k ? " is-on" : "")}>
              <input type="radio" name="race-net" value={k} checked={net === k} onChange={() => changeNet(k)} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" className="nz-btn nz-btn--primary race__go" onClick={start} disabled={phase === "running"}>
          <span>{phase === "preview" ? "להריץ את המירוץ" : phase === "running" ? "רצים…" : "עוד מירוץ"}</span>
        </button>
      </div>

      <div className="race__lanes">
        {LANES.map(({ key, name, line }) => {
          const p = prog[key];
          const done = p >= 1;
          const shifted = key === "heavy" && p >= SHIFT_AT;
          return (
            <div
              key={key}
              ref={(el) => (laneRefs.current[key] = el)}
              className={`race-lane race-lane--${key}` + (done ? " is-done" : "") + (winner === key ? " is-winner" : "")}
              style={{ ["--p" as string]: 1, ["--d" as string]: key === "fast" ? FAST_DIAL : 1 }}
            >
              <div className="race-lane__head">
                <p className="race-lane__name">
                  <span className="race-lane__title">
                    {name}
                    {order[key] && <span className={"race-lane__place" + (key === "fast" ? " is-first" : "")}>{order[key]}</span>}
                  </span>
                  <span className="race-lane__line">{line}</span>
                </p>
                <p className="race-lane__status">
                  <svg className="race-dial" viewBox="0 0 36 36" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" className="race-dial__track" />
                    <circle cx="18" cy="18" r="15" className="race-dial__arc" pathLength={1} />
                    <circle cx="18" cy="18" r="9.5" className="race-dial__lap" pathLength={1} />
                    <circle cx="18" cy="18" r="2" className="race-dial__pin" />
                  </svg>
                  <span>{done && key === "heavy" && net === "cell" ? "מוכן, באיחור גדול" : STATUS(p, key, done)}</span>
                </p>
              </div>

              <div className="race-lane__body">
                <div className="race-lane__track" aria-hidden="true">
                  <span className="race-lane__rail" />
                  <span className="race-lane__beam" />
                  <span className="race-lane__head-light" />
                  {MARKS.map((m, mi) => (
                    <span
                      key={m.label}
                      className={"race-lane__mark" + (mi === 1 ? " is-up" : "") + (p >= m.at ? " is-hit" : "")}
                      style={{ ["--at" as string]: m.at }}
                    >
                      <span className="race-lane__mark-l">{m.label}</span>
                    </span>
                  ))}
                  {key === "heavy" && ghost !== null && (
                    <span className="race-lane__ghost" style={{ ["--at" as string]: ghost }}>
                      <span className="race-lane__ghost-l">המותאם כבר סיים</span>
                    </span>
                  )}
                  <span className="race-lane__prism" />
                </div>

                <div className={"race-screen" + (shifted ? " is-shifted" : "")} aria-hidden="true">
                  {key === "heavy" && <span className={"race-screen__banner" + (shifted ? " is-in" : "")} />}
                  <span className="race-screen__flow">
                    <span className={"race-screen__t race-screen__t--h" + (p >= 0.3 ? " is-in" : "")} />
                    <span className={"race-screen__t" + (p >= 0.3 ? " is-in" : "")} />
                    <span className={"race-screen__img" + (p >= 0.66 ? " is-in" : "")} />
                    <span className={"race-screen__btn" + (p >= 0.9 ? " is-in" : "")} />
                  </span>
                </div>
              </div>

              <ul className="race-lane__notes">
                {NOTES[key].map((n) => (
                  <li key={n.text} className={p >= n.at ? "is-lit" : ""}>
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="race__result">
        <span className="race__result-k">{phase === "done" ? "התוצאה" : "המחשה"}</span>
        <span>{RESULT[phase][net]}</span>
      </p>
      <p className="nz-sr" aria-live="polite">
        {live}
      </p>
    </div>
  );
};

export default LightRace;
