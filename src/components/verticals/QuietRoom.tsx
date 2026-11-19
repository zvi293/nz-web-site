// Signature component: חדר שקט — press-and-hold (breathe a noisy clinic page into a calm one)
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";
import "./quiet-room.css";

/**
 * "חדר שקט" (clinic page). A small clinic site as many are built: a pop-up, a flashing deal, a
 * fake countdown, a nagging chat bubble, a wall of marketing text. Press and hold the round
 * button (pointer, or hold Space / Enter) and breathe in with the ring: the next piece of noise
 * blurs and fades while you hold, and at a full breath it is replaced by the calm element a
 * worried patient actually needs. Let go and the breath eases back. Five breaths → a quiet room.
 * "להשקיט הכול" clears everything at once (for anyone who cannot hold). aria-live reports each.
 * The button is its own grid cell: on phones it is sticky at the bottom edge of the screen while
 * the page is in view (you see the noise you breathe away); on desktop it stands beside the page.
 * After the fifth breath it stays focusable (aria-disabled), so keyboard focus never drops.
 * SSR / no JS: the noisy page + the full list of what replaces each noise.
 * Reduced motion: no blur/scale, a shorter breath; same states.
 */
type Slot = { id: string; noise: string; tag: string; noiseKind: "popup" | "deal" | "timer" | "chat" | "wall"; calm: string; calmLine: string };

const SLOTS: Slot[] = [
  { id: "first", tag: "חלון קופץ", noiseKind: "popup", noise: "רגע לפני שאתם הולכים! הירשמו לניוזלטר שלנו", calm: "הביקור הראשון", calmLine: "מה מביאים, כמה זמן זה לוקח ואיך מתכוננים." },
  { id: "hours", tag: "באנר מבצע", noiseKind: "deal", noise: "מבצע!!! רק החודש!!! אל תפספסו", calm: "שעות, כתובת וחניה", calmLine: "במקום אחד, קל למצוא גם בדרך לטיפול." },
  { id: "book", tag: "שעון שלוחץ", noiseKind: "timer", noise: "נשארו תורים אחרונים! מהרו לקבוע", calm: "קביעת תור", calmLine: "בוחרים טיפול ומועד פנוי, ומקבלים תזכורת." },
  { id: "team", tag: "בועת צ׳אט שלא מרפה", noiseKind: "chat", noise: "היי! אפשר לעזור? אפשר? אפשר לעזור?", calm: "הצוות", calmLine: "תמונה אמיתית, הכשרה ומשפט אחד על הגישה." },
  { id: "form", tag: "קיר של טקסט שיווקי", noiseKind: "wall", noise: "הטיפול המתקדם והחדשני ביותר בטכנולוגיה פורצת דרך שתשנה לכם את החיים ותעניק לכם חוויה שלא הכרתם עד היום ועוד ועוד", calm: "פנייה דיסקרטית", calmLine: "שם, טלפון ושאלה אם יש. בלי שאלות מיותרות." },
];
const N = SLOTS.length;

const QuietRoom = () => {
  const [calm, setCalm] = useState(0); // how many noises were breathed away
  const [breath, setBreath] = useState(0); // 0..1, the current inhale
  const [holding, setHolding] = useState(false);
  const [say, setSay] = useState("");
  const raf = useRef(0);
  const last = useRef(0);
  const hold = useRef(false);
  const calmRef = useRef(0);
  const breathRef = useRef(0);

  const done = calm >= N;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const settle = (n: number) => {
    calmRef.current = n;
    setCalm(n);
    const s = SLOTS[n - 1];
    setSay(n >= N ? "החדר שקט. כל רעש התחלף בפרט שמרגיע, ועכשיו קל לקבוע תור." : `נשימה ${n} מתוך ${N}: ${s.calm} נכנס במקום הרעש. ${s.calmLine}`);
  };

  const tick = (t: number) => {
    const dt = Math.min(64, t - (last.current || t));
    last.current = t;
    const dur = motionAllowed() ? 2600 : 1200;
    let b = breathRef.current;
    if (hold.current && calmRef.current < N) {
      b += dt / dur;
      if (b >= 1) {
        b = 0;
        settle(calmRef.current + 1);
        if (calmRef.current >= N) hold.current = false;
      }
    } else {
      b -= dt / 700;
    }
    b = Math.max(0, b);
    breathRef.current = b;
    setBreath(b);
    if (hold.current || b > 0) raf.current = requestAnimationFrame(tick);
    else last.current = 0;
  };

  const start = () => {
    if (hold.current || calmRef.current >= N) return;
    hold.current = true;
    setHolding(true);
    cancelAnimationFrame(raf.current);
    last.current = 0;
    raf.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (!hold.current) return;
    hold.current = false;
    setHolding(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat) start();
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    stop();
  };

  const all = () => {
    hold.current = false;
    setHolding(false);
    breathRef.current = 0;
    setBreath(0);
    calmRef.current = N;
    setCalm(N);
    setSay("החדר שקט. כל רעש התחלף בפרט שמרגיע, ועכשיו קל לקבוע תור.");
  };
  const again = () => {
    calmRef.current = 0;
    setCalm(0);
    setSay("הרעש חזר. החזיקו את הכפתור ונשמו שוב.");
  };

  return (
    <div className={cn("vl-qr", done && "is-done", holding && "is-holding")} style={{ ["--b" as string]: breath.toFixed(3) }}>
      <div className="vl-qr__page" aria-hidden="true">
        <div className="vl-qr__bar">
          <span className="vl-qr__logo">
            קליניקה לדוגמה<i />
          </span>
          <span className="vl-qr__nav">
            <i />
            <i />
            <i />
          </span>
        </div>
        <p className="vl-qr__hero">טיפול שקט, בקצב שלכם</p>
        <ul className="vl-qr__slots">
          {SLOTS.map((s, i) => {
            const isCalm = i < calm;
            const isNext = i === calm;
            return (
              <li key={s.id} className={cn("vl-qr__slot", isCalm ? "is-calm" : "is-noise", isNext && "is-next")}>
                <span className={cn("vl-qr__noise", `vl-qr__noise--${s.noiseKind}`)}>
                  {s.noiseKind === "popup" && <b className="vl-qr__x">×</b>}
                  {s.noise}
                </span>
                <span className="vl-qr__calm">
                  <span className="vl-qr__calm-title">{s.calm}</span>
                  <span className="vl-qr__calm-line">{s.calmLine}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="vl-qr__lung">
          <span className="vl-qr__halo" aria-hidden="true" />
          <button
            type="button"
            className="vl-qr__breathe"
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              start();
            }}
            onPointerUp={stop}
            onPointerCancel={stop}
            onLostPointerCapture={stop}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-disabled={done}
            aria-describedby="vl-qr-how"
          >
            <svg className="vl-qr__ring" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="46" />
              <circle cx="50" cy="50" r="46" className="vl-qr__ring-fill" pathLength={1} style={{ strokeDashoffset: 1 - breath }} />
            </svg>
            <span className="vl-qr__word">{done ? "שקט" : holding ? "שאיפה" : "להחזיק"}</span>
          </button>
      </div>

      <div className="vl-qr__side">
        <p id="vl-qr-how" className="vl-qr__how">
          {done ? "חמש נשימות, חמישה פרטים במקום חמישה רעשים." : "לחצו והחזיקו. כל נשימה מלאה מחליפה רעש אחד בפרט שמרגיע."}
        </p>
        <p className="vl-qr__meter" aria-hidden="true">
          {SLOTS.map((s, i) => (
            <i key={s.id} className={cn(i < calm && "is-on")} />
          ))}
          <span>{`${calm} מתוך ${N}`}</span>
        </p>
        <p className="vl-qr__say" aria-live="polite">
          {say}
        </p>
        <ol className="vl-qr__legend">
          {SLOTS.map((s, i) => (
            <li key={s.id} className={cn(i < calm && "is-on")}>
              <span className="vl-qr__legend-title">{s.calm}</span>
              <span className="vl-qr__legend-line">{`במקום: ${s.tag}`}</span>
            </li>
          ))}
        </ol>
        <div className="vl-qr__links">
          <button type="button" className="vl-qr__link" onClick={done ? again : all}>
            {done ? "להחזיר את הרעש" : "להשקיט הכול בבת אחת"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuietRoom;
