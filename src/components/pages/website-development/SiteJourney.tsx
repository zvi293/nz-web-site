// Signature component: מסלול האתר — sign-off gates (stamp your approval to unhook the rope to the next station)
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { JourneyStation } from "./data";
import "./site-journey.css";

/**
 * "מסלול האתר" — the way from a first call to a live site, the way it really works: five stations
 * on one line (אפיון → מבנה → עיצוב → פיתוח → השקה), and between every two a museum rope that only
 * the client unhooks. The open station's paper card says what happens there, what you get at its
 * end and what we need from you, with a small self-drawing sketch of the deliverable. Press the
 * rubber stamp "אישור שלכם": it thumps an "אושר" impression onto the card, the velvet rope to the
 * next station drops and hangs from its post, the line is inked up to the next station and its
 * card opens. Passed stations stay open to re-read; stations ahead stay roped off (a tap on one
 * shakes its rope and says what opens it). The last stamp puts the site "באוויר" and offers the
 * real WhatsApp start.
 *
 * Semantics: a tablist (roving tabindex over the open stations, ←/→ along the line, Home/End;
 * stations ahead are aria-disabled) + tabpanels; the stamp is a real button; focus moves to the
 * station that opened; aria-live narrates. All panels share one grid cell (no layout shift).
 * No JS (html:not(.js)): every station listed in order, no ropes, no stamps.
 * Reduced motion: no thump, no swing, no draw; the states simply change.
 * Props are plain data (src/components/pages/website-development/data.ts).
 */

interface Props {
  stations: JourneyStation[];
  /** wa.me link for the last station's "start here" action. */
  startHref: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

function Drawing({ kind }: { kind: JourneyStation["drawing"] }) {
  return (
    <svg className="sj-d" viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      {kind === "brief" && (
        <g>
          <rect className="sj-d__l" pathLength={1} x="26" y="8" width="56" height="74" rx="2" />
          <path className="sj-d__l" pathLength={1} d="M36 24 H72 M36 34 H66 M36 44 H70" />
          <rect className="sj-d__l" pathLength={1} x="36" y="56" width="10" height="10" />
          <path className="sj-d__l sj-d__acc" pathLength={1} d="M38 61 L41 64 L47 56" />
          <path className="sj-d__l" pathLength={1} d="M52 61 H70" />
          <path
            className="sj-d__l sj-d__acc"
            pathLength={1}
            d="M88 20 h22 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-12 l-6 6 v-6 h-4 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z"
          />
        </g>
      )}
      {kind === "structure" && (
        <g>
          <rect className="sj-d__l sj-d__acc" pathLength={1} x="48" y="6" width="24" height="12" />
          <path className="sj-d__l" pathLength={1} d="M60 18 V26 M24 26 H96 M24 26 V34 M60 26 V34 M96 26 V34" />
          <rect className="sj-d__l" pathLength={1} x="12" y="34" width="24" height="12" />
          <rect className="sj-d__l" pathLength={1} x="48" y="34" width="24" height="12" />
          <rect className="sj-d__l" pathLength={1} x="84" y="34" width="24" height="12" />
          <path className="sj-d__l" pathLength={1} d="M60 46 V54 M50 54 H70 M50 54 V60 M70 54 V60" />
          <path className="sj-d__l" pathLength={1} d="M14 62 V80 a10 4 0 0 0 20 0 V62 a10 4 0 0 0 -20 0 a10 4 0 0 0 20 0" />
          <rect className="sj-d__l" pathLength={1} x="42" y="60" width="16" height="10" />
          <rect className="sj-d__l" pathLength={1} x="62" y="60" width="16" height="10" />
        </g>
      )}
      {kind === "design" && (
        <g>
          <rect className="sj-d__l" pathLength={1} x="50" y="10" width="62" height="42" rx="2" />
          <path className="sj-d__l" pathLength={1} d="M58 20 H84 M58 28 H78 M70 60 H92 M81 52 V60" />
          <rect className="sj-d__l sj-d__acc" pathLength={1} x="58" y="36" width="20" height="8" rx="4" />
          <rect className="sj-d__l" pathLength={1} x="12" y="22" width="28" height="56" rx="4" />
          <path className="sj-d__l" pathLength={1} d="M18 34 H34 M18 42 H30" />
          <rect className="sj-d__l sj-d__acc" pathLength={1} x="18" y="62" width="16" height="7" rx="3.5" />
          <circle className="sj-d__dot" cx="100" cy="72" r="6" />
        </g>
      )}
      {kind === "build" && (
        <g>
          <path className="sj-d__l" pathLength={1} d="M30 18 L14 32 L30 46" />
          <path className="sj-d__l" pathLength={1} d="M90 18 L106 32 L90 46" />
          <path className="sj-d__l sj-d__acc" pathLength={1} d="M68 12 L52 52" />
          <path className="sj-d__l" pathLength={1} d="M14 62 H62 M24 70 H88 M24 78 H54" />
          <path className="sj-d__l sj-d__acc" pathLength={1} d="M60 78 H80" />
        </g>
      )}
      {kind === "launch" && (
        <g>
          <circle className="sj-d__l" pathLength={1} cx="54" cy="48" r="30" />
          <path className="sj-d__l" pathLength={1} d="M24 48 H84 M54 18 C40 30 40 66 54 78 M54 18 C68 30 68 66 54 78" />
          <path className="sj-d__l sj-d__acc" pathLength={1} d="M98 70 V16 M90 24 L98 16 L106 24" />
          <circle className="sj-d__dot" cx="66" cy="36" r="4.5" />
        </g>
      )}
    </svg>
  );
}

/* the velvet rope between two posts: closed (a sagging rope hooked to both) or open (unhooked
   from the far post, hanging from the near one) */
function Rope({ open, shake }: { open: boolean; shake: boolean }) {
  return (
    <span className={["sj-rope", open && "is-open", shake && "is-shake"].filter(Boolean).join(" ")} aria-hidden="true">
      <svg className="sj-rope__closed" viewBox="0 0 100 24" preserveAspectRatio="none" focusable="false">
        <path d="M0 3 C 30 22, 70 22, 100 3" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className="sj-rope__hang" viewBox="0 0 24 44" focusable="false">
        <path d="M21 2 C 23 16, 14 30, 6 40" />
        <circle cx="6" cy="40" r="2.4" />
      </svg>
    </span>
  );
}

const SiteJourney = ({ stations, startHref }: Props) => {
  const last = stations.length - 1;
  /** how many stations the client has approved (0 … stations.length) */
  const [approved, setApproved] = useState(0);
  const [active, setActive] = useState(0);
  const [thump, setThump] = useState(-1);
  const [shake, setShake] = useState(-1);
  const [said, setSaid] = useState("");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const waRef = useRef<HTMLAnchorElement>(null);
  const timers = useRef<number[]>([]);
  const reach = Math.min(approved, last);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, motionOn() ? ms : 0));
  };

  const open = (i: number, focus = false) => {
    if (i > reach) {
      setShake(i - 1);
      later(() => setShake(-1), 700);
      setSaid(`תחנה ${pad(i + 1)}, ${stations[i].name}, נפתחת אחרי האישור שלכם בתחנה ${pad(reach + 1)}, ${stations[reach].name}.`);
      return;
    }
    setActive(i);
    setSaid(`תחנה ${pad(i + 1)} מתוך ${pad(stations.length)}: ${stations[i].name}. ${stations[i].line}.`);
    if (focus) tabs.current[i]?.focus();
  };

  const stamp = (i: number) => {
    if (i !== approved) return;
    setThump(i);
    setApproved(i + 1);
    if (i < last) {
      setSaid(`תחנה ${pad(i + 1)} אושרה. החבל ירד, ונפתחה תחנה ${pad(i + 2)}: ${stations[i + 1].name}. ${stations[i + 1].line}.`);
      later(() => {
        setActive(i + 1);
        setThump(-1);
        tabs.current[i + 1]?.focus();
      }, 900);
    } else {
      setSaid("ההשקה אושרה: האתר באוויר. אפשר להתחיל מהתחנה הראשונה בוואטסאפ.");
      later(() => {
        setThump(-1);
        waRef.current?.focus();
      }, 700);
    }
  };

  const approveAll = () => {
    setApproved(stations.length);
    setActive(0);
    setSaid("כל התחנות פתוחות לקריאה. עברו ביניהן על הקו.");
    tabs.current[0]?.focus();
  };

  const restart = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setApproved(0);
    setActive(0);
    setThump(-1);
    setSaid("המסלול התחיל מחדש: תחנה 01, אפיון.");
    tabs.current[0]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowLeft: i + 1, ArrowRight: i - 1, Home: 0, End: reach };
    if (!(e.key in map)) return;
    e.preventDefault();
    open(Math.max(0, Math.min(reach, map[e.key])), true);
  };

  return (
    <div className="sj" style={{ ["--reach" as string]: reach / last }}>
      <div className="sj__track">
        <span className="sj__line" aria-hidden="true">
          <span className="sj__ink" />
        </span>
        {stations.slice(0, last).map((_, i) => (
          <span key={`g${i}`} className="sj__gap" style={{ ["--g" as string]: i }}>
            <Rope open={i < approved} shake={shake === i} />
          </span>
        ))}
        <div className="sj__stations" role="tablist" aria-label="תחנות מסלול האתר">
          {stations.map((s, i) => {
            const done = i < approved;
            const locked = i > reach;
            return (
              <button
                key={s.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`sj-tab-${i}`}
                aria-controls={`sj-panel-${i}`}
                aria-selected={i === active}
                aria-disabled={locked || undefined}
                tabIndex={i === active ? 0 : -1}
                className={["sj-st", i === active && "is-on", done && "is-done", locked && "is-locked"].filter(Boolean).join(" ")}
                onClick={() => open(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="sj-st__name">{s.name}</span>
                <span className="sj-st__post">
                  <span className="sj-st__no">{pad(i + 1)}</span>
                </span>
                <span className="nz-sr">{done ? " (אושרה)" : locked ? " (סגורה עד האישור הקודם)" : " (מחכה לאישור שלכם)"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sj__panels">
        {stations.map((s, i) => {
          const done = i < approved;
          return (
            <section
              key={s.name}
              id={`sj-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`sj-tab-${i}`}
              className={["sj-panel", i === active && "is-on", done && "is-done", thump === i && "is-thump"].filter(Boolean).join(" ")}
            >
              <div className="sj-panel__head">
                <div className="sj-panel__titles">
                  <p className="sj-panel__no">
                    <span>תחנה {pad(i + 1)}</span> מתוך {pad(stations.length)}
                  </p>
                  <h3 className="sj-panel__name">{s.name}</h3>
                  <p className="sj-panel__line">{s.line}</p>
                </div>
                <div className="sj-panel__plate">
                  <Drawing kind={s.drawing} />
                </div>
              </div>
              <p className="sj-panel__body">{s.body}</p>
              <div className="sj-panel__cols">
                <div className="sj-panel__col">
                  <h4 className="sj-panel__h">מה מקבלים בסוף התחנה</h4>
                  <ul className="sj-panel__gets">
                    {s.gets.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="sj-panel__col">
                  <h4 className="sj-panel__h">מה נצטרך מכם</h4>
                  <p className="sj-panel__needs">{s.needs}</p>
                </div>
              </div>

              <div className="sj-panel__foot">
                <span className="sj-imp" aria-hidden="true">
                  <span className="sj-imp__big">{i === last ? "באוויר" : "אושר"}</span>
                  <span className="sj-imp__small">תחנה {pad(i + 1)} · NZ-web</span>
                </span>
                {!done ? (
                  <div className="sj-sign">
                    <button type="button" className="sj-stamp" onClick={() => stamp(i)}>
                      <span className="sj-stamp__knob" aria-hidden="true" />
                      <span className="sj-stamp__neck" aria-hidden="true" />
                      <span className="sj-stamp__pad">{i === last ? "לעלות לאוויר" : "אישור שלכם"}</span>
                    </button>
                    <p className="sj-sign__why">
                      {i === last
                        ? "האישור האחרון: האתר עובר לכתובת האמיתית."
                        : `בלי האישור הזה לא ממשיכים ל${stations[i + 1].name}. ככה זה גם בפרויקט אמיתי.`}
                    </p>
                  </div>
                ) : i < last ? (
                  <button type="button" className="sj-next" onClick={() => open(i + 1, true)}>
                    לתחנה הבאה: {stations[i + 1].name}
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path
                        d="M13 8H3m0 0 4-4M3 8l4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <div className="sj-end">
                    <a ref={waRef} className="sj-next sj-next--wa" href={startHref} target="_blank" rel="noopener">
                      להתחיל מהתחנה הראשונה, בוואטסאפ
                      <span className="nz-sr"> (נפתח בחלון חדש)</span>
                    </a>
                    <button type="button" className="sj-back" onClick={restart}>
                      מההתחלה
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {approved < stations.length && (
        <p className="sj__skip">
          <button type="button" className="sj-skip" onClick={approveAll}>
            רק לקרוא את כל התחנות, בלי לאשר
          </button>
        </p>
      )}

      <p className="nz-sr" aria-live="polite">
        {said}
      </p>
    </div>
  );
};

export default SiteJourney;
