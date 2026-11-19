// Signature component: היומן של מחר — advance the clock (step a day through time, with a switch)
import { useRef, useState } from "react";
import "./ReminderDay.css";

/**
 * "Tomorrow's diary" (appointment-system-guide). One sample clinic day with six booked slots.
 * The reader sets one switch (automatic reminders on / off) and then moves the clock forward
 * by hand, moment by moment: the evening before → morning → during the day → end of day. The
 * same two clients cause trouble in both runs (one forgot, one cannot come). Without reminders
 * the two slots turn into hatched empty windows at their hour; with reminders the cancellation
 * arrives the evening before, the slot frees up and is booked from the site in the morning.
 * After both runs, the two outcomes stand side by side. The clock hand turns (CSS transition),
 * the diary rows change state, a narration line says what happened (aria-live). Changing the
 * switch restarts the day. No JS: both days are told as two short lists.
 */

type Mode = "off" | "on";
type State = "booked" | "reminded" | "confirmed" | "freed" | "rebooked" | "done" | "noshow";

interface Slot {
  time: string;
  name: string;
}
const SLOTS: Slot[] = [
  { time: "09:00", name: "נועה" },
  { time: "10:00", name: "אבי" },
  { time: "11:00", name: "מירב" },
  { time: "12:00", name: "דוד" },
  { time: "13:00", name: "רונית" },
  { time: "14:00", name: "יעל" },
];
const AVI = 1;
const DAVID = 3;

const MOMENTS = [
  { label: "ערב לפני", hour: 18 },
  { label: "בוקר", hour: 32 },
  { label: "במהלך היום", hour: 36.5 },
  { label: "סוף היום", hour: 40 },
];

const STORY: Record<Mode, string[]> = {
  off: [
    "ערב לפני. אף אחד לא קיבל תזכורת, והיומן נראה מלא.",
    "בוקר. דוד יודע כבר מאתמול שלא יגיע, אבל לא נוח לו להתקשר באמצע טיפול. אבי פשוט שכח.",
    "במהלך היום. ב-10:00 וב-12:00 אף אחד לא נכנס. מאוחר מדי להציע את השעות האלה למישהו אחר.",
    "סוף היום. שני חלונות נשארו ריקים, ואת הזמן הזה כבר אי אפשר להחזיר.",
  ],
  on: [
    "ערב לפני. כל לקוח קיבל הודעה עם כפתור לאשר או לבטל. דוד ביטל, והשעה 12:00 חזרה להיות פנויה במערכת.",
    "בוקר. אבי ראה את התזכורת ואישר. שירה ראתה באתר שהתפנתה שעה ב-12:00 וקבעה לבד.",
    "במהלך היום. כל התורים מתקיימים לפי היומן.",
    "סוף היום. אף חלון לא התבזבז, ואף אחד לא היה צריך להרים טלפון.",
  ],
};

function slotState(mode: Mode, step: number, i: number): State {
  if (mode === "off") {
    if (step < 2) return "booked";
    return i === AVI || i === DAVID ? "noshow" : "done";
  }
  if (step === 0) return i === DAVID ? "freed" : i === AVI ? "reminded" : "confirmed";
  if (step === 1) return i === DAVID ? "rebooked" : "confirmed";
  return i === DAVID ? (step >= 2 ? "done" : "rebooked") : "done";
}

const CHIP: Record<State, string> = {
  booked: "נקבע",
  reminded: "נשלחה תזכורת",
  confirmed: "אושר",
  freed: "התפנה",
  rebooked: "נקבע מהאתר",
  done: "התקיים",
  noshow: "חלון ריק",
};

function bubble(mode: Mode, step: number, i: number): string | null {
  if (mode !== "on") return null;
  if (step === 0 && i === DAVID) return "לא אוכל להגיע מחר, מבטל";
  if (step === 1 && i === AVI) return "תודה שהזכרתם, אגיע";
  return null;
}

const ReminderDay = () => {
  const [mode, setMode] = useState<Mode>("off");
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<Record<Mode, boolean>>({ off: false, on: false });
  const btnRef = useRef<HTMLButtonElement>(null);
  const last = step === MOMENTS.length - 1;
  /* hours counted from the evening before, so the hands always turn forward */
  const hourAngle = MOMENTS[step].hour * 30;

  const advance = () => {
    if (last) {
      setStep(0);
      return;
    }
    const n = step + 1;
    setStep(n);
    if (n === MOMENTS.length - 1) setSeen((s) => ({ ...s, [mode]: true }));
  };

  const flip = () => {
    setMode((m) => (m === "off" ? "on" : "off"));
    setStep(0);
    window.setTimeout(() => btnRef.current?.focus(), 0);
  };

  const name = (i: number) => (i === DAVID && (mode === "on" && step >= 1) ? "שירה" : SLOTS[i].name);

  return (
    <div className={`as-rd as-rd--${mode}`}>
      <div className="as-static">
        <p>
          <strong>בלי תזכורות:</strong> {STORY.off.join(" ")}
        </p>
        <p>
          <strong>עם תזכורות:</strong> {STORY.on.join(" ")}
        </p>
      </div>

      <div className="as-rd__live as-live">
        <div className="as-rd__controls">
          <button type="button" role="switch" aria-checked={mode === "on"} className="as-rd__switch" onClick={flip}>
            <span className="as-rd__track" aria-hidden="true">
              <span className="as-rd__knob" />
            </span>
            <span className="as-rd__switch-text">
              תזכורות אוטומטיות
              <span className="as-rd__switch-state">{mode === "on" ? "פועלות" : "כבויות"}</span>
            </span>
          </button>
        </div>

        {/* the clock and the button that turns it travel together (sticky on phones), so the hands
            always move in view while the diary below changes */}
        <div className="as-rd__console">
        <div className="as-rd__time">
          <svg className="as-rd__clock" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" className="as-rd__face" />
            {Array.from({ length: 12 }, (_, k) => (
              <line key={k} x1="32" y1="6" x2="32" y2={k % 3 === 0 ? 11 : 9} transform={`rotate(${k * 30} 32 32)`} />
            ))}
            <line x1="32" y1="32" x2="32" y2="10" className="as-rd__min" style={{ transform: `rotate(${MOMENTS[step].hour * 360}deg)` }} />
            <line x1="32" y1="32" x2="32" y2="17" className="as-rd__hour" style={{ transform: `rotate(${hourAngle}deg)` }} />
            <circle cx="32" cy="32" r="2.6" className="as-rd__pin" />
          </svg>
          <div className="as-rd__when">
            <p className="as-rd__moment">{MOMENTS[step].label}</p>
            <ol className="as-rd__steps" aria-label="רגעים ביום">
              {MOMENTS.map((m, k) => (
                <li key={m.label} aria-current={k === step ? "step" : undefined} className={k <= step ? "is-past" : ""}>
                  <span className="nz-sr">{m.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="as-rd__actions">
          <button ref={btnRef} type="button" className="as-btn as-btn--primary" onClick={advance}>
            {last ? "שוב מהערב שלפני" : `הזיזו את השעון: ${MOMENTS[step + 1].label}`}
          </button>
          {seen[mode] && !seen[mode === "on" ? "off" : "on"] && last && (
            <button type="button" className="as-btn" onClick={flip}>
              {mode === "off" ? "עכשיו עם תזכורות" : "עכשיו בלי תזכורות"}
            </button>
          )}
        </div>

        </div>

        <div className="as-rd__diary">
          <p className="as-rd__head" aria-hidden="true">
            <span>יומן התורים · קליניקה לדוגמה</span>
            <span>מחר</span>
          </p>
          <ul className="as-rd__slots">
            {SLOTS.map((s, i) => {
              const st = slotState(mode, step, i);
              const b = bubble(mode, step, i);
              return (
                <li key={s.time} className={`as-rd__slot is-${st}`}>
                  <span className="as-rd__hour-t" dir="ltr">
                    {s.time}
                  </span>
                  <span className="as-rd__who">
                    {st === "freed" ? <s>{SLOTS[i].name}</s> : st === "noshow" ? <span className="nz-sr">{name(i)}, </span> : name(i)}
                  </span>
                  <span className="as-rd__chip">{CHIP[st]}</span>
                  {b && (
                    <span className="as-rd__bubble" key={`${mode}${step}`}>
                      {b}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="as-rd__story" aria-live="polite">
          {STORY[mode][step]}
        </p>

        {seen.on && seen.off && (
          <div className="as-rd__verdict">
            <p>
              <span className="as-rd__v-label">בלי תזכורות</span>
              שני חלונות ריקים, שהתגלו רק כשהגיעה השעה.
            </p>
            <p>
              <span className="as-rd__v-label is-on">עם תזכורות</span>
              אותו יום, אותם לקוחות, יומן מלא.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderDay;
