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
 *   finished picture for that network. The start button is hidden without JS.
 * - aria-live announces the start and the result.
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
  if (done) return "נטען";
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
/** The fast lane's dial when both have finished (its duration over the heavy one's). */
const FAST_DIAL = 0.29;

const LANES: { key: LaneKey; name: string; line: string }[] = [
  { key: "heavy", name: "דף כבד", line: "תמונות בגודל מלא, תוספים, צ׳אט וגופן חיצוני" },
  { key: "fast", name: "דף מותאם", line: "אותו דף, אחרי תיקון התמונות, הקוד והטעינה" },
];

const LightRace = () => {
  const [phase, setPhase] = useState<Phase>("preview");
  const [net, setNet] = useState<Net>("wifi");
  const [prog, setProg] = useState<Record<LaneKey, number>>({ heavy: 1, fast: 1 }); // milestone-quantised
  const [winner, setWinner] = useState<LaneKey | null>("fast");
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
    const max = d.heavy;
    const pf = progressAt("fast", c.elapsed / d.fast);
    const ph = progressAt("heavy", c.elapsed / d.heavy);
    paint("fast", pf, Math.min(c.elapsed, d.fast) / max);
    paint("heavy", ph, Math.min(c.elapsed, d.heavy) / max);
    setProg((cur) => {
      const nf = quant(pf);
      const nh = quant(ph);
      return cur.fast === nf && cur.heavy === nh ? cur : { fast: nf, heavy: nh };
    });
    if (pf >= 1) setWinner((w) => w ?? "fast");
    if (ph >= 1) {
      setPhase("done");
      raf.current = 0;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

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
        raf.current = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const finish = (to: Phase = "done") => {
    const d = DUR[netRef.current];
    paint("fast", 1, d.fast / d.heavy);
    paint("heavy", 1, 1);
    setProg({ fast: 1, heavy: 1 });
    setWinner("fast");
    setPhase(to);
  };

  const start = () => {
    cancelAnimationFrame(raf.current);
    setWinner(null);
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
    raf.current = requestAnimationFrame(tick);
  };

  const changeNet = (n: Net) => {
    setNet(n);
    netRef.current = n;
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    finish("preview");
  };

  const live =
    phase === "running"
      ? "המירוץ התחיל."
      : phase === "done"
        ? "הדף המותאם נטען ראשון. הדף הכבד הגיע לאותה נקודה הרבה אחריו, אחרי שחיכה לסקריפט וקפץ באמצע."
        : "";

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
                  {name}
                  <span className="race-lane__line">{line}</span>
                </p>
                <p className="race-lane__status">
                  <svg className="race-dial" viewBox="0 0 36 36" aria-hidden="true">
                    <circle cx="18" cy="18" r="15" className="race-dial__track" />
                    <circle cx="18" cy="18" r="15" className="race-dial__arc" pathLength={1} />
                    <circle cx="18" cy="18" r="2" className="race-dial__pin" />
                  </svg>
                  <span>{STATUS(p, key, done)}</span>
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

      <p className="race__result" aria-live="polite">
        <span className="race__result-k">{phase === "done" ? "התוצאה" : "המחשה"}</span>
        <span>
          {phase === "done"
            ? "הדף המותאם סיים ראשון. בזמן שהדף הכבד עוד חיכה לסקריפט, מבקר בדף המותאם כבר יכול היה ללחוץ על הכפתור."
            : phase === "preview"
              ? "כך נגמר המירוץ: שני הדפים נטענו, אבל הדף המותאם היה מוכן הרבה קודם. הזמנים יחסיים ומדגימים דף טיפוסי, הם לא מדידה של אתר מסוים."
              : "אותו דף, נטען פעמיים. הזמנים יחסיים ומדגימים דף טיפוסי, הם לא מדידה של אתר מסוים."}
        </span>
        <span className="nz-sr">{live}</span>
      </p>
    </div>
  );
};

export default LightRace;
