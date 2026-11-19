// Signature component: פחות שדות — declutter/remove
import { useEffect, useRef, useState } from "react";
import "./fewer-fields.css";

/**
 * "פחות שדות" — a sample "request a quote" form with twelve fields. Remove the fields you would
 * not ask (the × beside each one) and watch two gauges answer: "קל למלא" rises as the form gets
 * shorter, while "מה תדעו לפני השיחה" falls if you remove something you actually need (name,
 * phone, what they need, when). The verdict names the state; the balanced form is the goal.
 * Illustrative only: the gauges have no numbers, the field count is the demo's own.
 * Removed fields wait in a tray and come back with one tap. Keyboard: real buttons, the form
 * first in the DOM (Tab reaches the × buttons before the "do it for me" action, whatever the
 * visual order); focus moves to the next field's × after a removal; the verdict is aria-live.
 * Phones: the full meter scrolls with the page; once it is gone above, a one-row mini meter
 * (count · verdict · two thin gauges, ~64px) hangs under the header while the form is in view.
 * SSR / no JS: the full form,
 * the verdict for it and the list of what a balanced form keeps. Reduced motion: no fades.
 */

type Kind = "must" | "qualify" | "extra" | "noise";
interface Field {
  id: string;
  label: string;
  ph: string;
  kind: Kind;
  /** How much it costs the visitor (typing, thinking, hesitation). */
  effort: number;
  /** Why it can go, or what you lose without it. */
  why: string;
  select?: boolean;
  area?: boolean;
}

const FIELDS: Field[] = [
  { id: "name", label: "שם", ph: "איך לפנות אליך", kind: "must", effort: 1, why: "בלי שם, כל שיחה מתחילה ב\"עם מי אני מדבר?\"" },
  { id: "phone", label: "טלפון", ph: "050-000-0000", kind: "must", effort: 1, why: "בלי טלפון, אין לאן לחזור." },
  { id: "need", label: "במה אפשר לעזור?", ph: "בחרו מהרשימה", kind: "qualify", effort: 1, select: true, why: "בלי לדעת מה הלקוח צריך, אי אפשר לחזור אליו מוכנים." },
  { id: "when", label: "מתי תרצו להתחיל?", ph: "החודש · בהמשך", kind: "qualify", effort: 1, select: true, why: "בלי לדעת מתי, קשה לדעת למי לחזור קודם." },
  { id: "email", label: "אימייל", ph: "name@example.com", kind: "extra", effort: 1, why: "נחמד שיש, אבל טלפון מספיק כדי לחזור." },
  { id: "company", label: "שם העסק", ph: "", kind: "extra", effort: 1, why: "אפשר לשאול בשיחה הראשונה." },
  { id: "role", label: "תפקיד", ph: "", kind: "noise", effort: 1, why: "לא משנה כלום לפני השיחה הראשונה." },
  { id: "address", label: "כתובת מלאה", ph: "רחוב, מספר, עיר, מיקוד", kind: "noise", effort: 3, why: "שאלה ארוכה שמרגישה פולשנית בשלב הזה." },
  { id: "size", label: "מספר עובדים", ph: "בחרו טווח", kind: "noise", effort: 1, select: true, why: "מעניין, אבל לא נחוץ כדי לחזור ללקוח." },
  { id: "budget", label: "תקציב משוער", ph: "בחרו טווח", kind: "noise", effort: 2, select: true, why: "שאלה שמרתיעה מוקדם מדי. עדיף לדבר עליה בשיחה." },
  { id: "source", label: "איך שמעתם עלינו?", ph: "בחרו מהרשימה", kind: "noise", effort: 1, select: true, why: "מעקב ההמרות כבר יודע את זה, בלי לשאול." },
  { id: "msg", label: "ספרו לנו עוד", ph: "", kind: "noise", effort: 3, area: true, why: "שדה פתוח וגדול מעייף. מי שרוצה לפרט, יכתוב בוואטסאפ." },
];

const MAX_EFFORT = FIELDS.reduce((s, f) => s + f.effort, 0);
const MIN_EFFORT = FIELDS.filter((f) => f.kind === "must").reduce((s, f) => s + f.effort, 0);
/**
 * What you will know before the call is decided by WHICH fields stay, not by a weighted sum:
 * no phone (or no name) = nothing to go back to; no need / no timing = you know who, not what or
 * when; all four = who, what and when. The two "nice to have" fields only nudge the bar.
 */
function knowOf(kept: Field[]) {
  const has = (id: string) => kept.some((f) => f.id === id);
  const extras = kept.filter((f) => f.kind === "extra").length;
  if (!has("phone")) return { fill: 0.04, label: "אין לאן לחזור" };
  if (!has("name")) return { fill: 0.1, label: "לא יודעים מי פנה" };
  const need = has("need");
  const when = has("when");
  if (!need && !when) return { fill: 0.3 + extras * 0.04, label: "יודעים רק מי פנה" };
  if (!need) return { fill: 0.48 + extras * 0.04, label: "לא יודעים מה צריך" };
  if (!when) return { fill: 0.55 + extras * 0.04, label: "לא יודעים מתי" };
  return { fill: 0.86 + extras * 0.07, label: "יודעים מי, מה ומתי" };
}

const BALANCED = FIELDS.filter((f) => f.kind === "must" || f.kind === "qualify").map((f) => f.id);

function stateOf(kept: Field[]) {
  const missingMust = FIELDS.filter((f) => f.kind === "must" && !kept.includes(f));
  const missingQual = FIELDS.filter((f) => f.kind === "qualify" && !kept.includes(f));
  const noiseLeft = kept.filter((f) => f.kind === "noise").length;
  const extraLeft = kept.filter((f) => f.kind === "extra").length;
  if (missingMust.some((f) => f.id === "phone")) {
    return {
      key: "empty",
      title: "קל למלא, אבל אין המשך",
      body: `בלי טלפון${missingMust.length > 1 ? " ובלי שם" : ""}, הפנייה הזאת לא מובילה לשום שיחה.`,
    };
  }
  if (missingMust.length) {
    return {
      key: "empty",
      title: "קל למלא, אבל אנונימי",
      body: "יש מספר, אבל אין שם. כל שיחה תתחיל ב\"עם מי אני מדבר?\", וקשה לזכור מי ביקש מה.",
    };
  }
  if (kept.length === FIELDS.length) {
    return {
      key: "full",
      title: "טופס שמבקש יותר מדי",
      body: "שתים-עשרה שאלות לפני שהמבקר קיבל משהו. בטלפון זה נראה כמו גלילה בלי סוף, והרבה עוצרים באמצע.",
    };
  }
  if (missingQual.length) {
    return {
      key: "thin",
      title: "קצר, אבל בלי סינון",
      body: `יגיעו פניות, אבל כל שיחה תתחיל מאפס: ${
        missingQual.length > 1
          ? "לא תדעו מה הלקוח צריך ומתי."
          : missingQual[0]!.id === "need"
            ? "לא תדעו מה הלקוח צריך."
            : "לא תדעו מתי הוא רוצה להתחיל, ולמי לחזור קודם."
      }`,
    };
  }
  if (noiseLeft === 0 && extraLeft === 0) {
    return {
      key: "balanced",
      title: "הטופס המאוזן",
      body: "ארבע שאלות. ממלאים אותו בנייד בלי להתאמץ, ואתם יודעים מי פנה, מה הוא צריך ומתי.",
    };
  }
  if (noiseLeft === 0) {
    return {
      key: "near",
      title: "כמעט שם",
      body: "כל מה שנשאר שימושי. אפשר להוריד גם את מה שאפשר לשאול בשיחה.",
    };
  }
  return {
    key: "going",
    title: "בדרך",
    body: `עוד ${noiseLeft === 1 ? "שאלה אחת" : `${noiseLeft} שאלות`} שלא משנות כלום לפני השיחה הראשונה.`,
  };
}

const LEVELS_EASE = ["מתייאשים באמצע", "ממלאים אם ממש רוצים", "ממלאים בלי לחשוב"];
const level = (x: number, names: string[]) => names[x < 0.34 ? 0 : x < 0.8 ? 1 : 2];

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}

const FewerFields = () => {
  const [removed, setRemoved] = useState<string[]>([]);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const focusAfter = useRef<string | null>(null);
  /* phones: the full meter has scrolled away above, and the form still runs below the mini meter */
  const [meterGone, setMeterGone] = useState(false);
  const [formLeft, setFormLeft] = useState(true);

  useEffect(() => {
    const meterEl = meterRef.current;
    const endEl = endRef.current;
    if (!meterEl || !endEl || typeof IntersectionObserver === "undefined") return;
    const head = Math.round(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 68);
    const io1 = new IntersectionObserver(
      ([e]) => setMeterGone(!e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? head)),
      { rootMargin: `-${head}px 0px 0px 0px` },
    );
    const io2 = new IntersectionObserver(
      ([e]) => setFormLeft(e.isIntersecting || e.boundingClientRect.top > (e.rootBounds?.bottom ?? 0)),
      { rootMargin: `-${head + 96}px 0px 0px 0px` },
    );
    io1.observe(meterEl);
    io2.observe(endEl);
    return () => {
      io1.disconnect();
      io2.disconnect();
    };
  }, []);
  const mini = meterGone && formLeft;

  const kept = FIELDS.filter((f) => !removed.includes(f.id));
  const effort = kept.reduce((s, f) => s + f.effort, 0);
  const ease = 1 - (effort - MIN_EFFORT) / (MAX_EFFORT - MIN_EFFORT);
  const know = knowOf(kept);
  const st = stateOf(kept);

  useEffect(() => {
    const id = focusAfter.current;
    if (!id) return;
    focusAfter.current = null;
    const el = formRef.current?.querySelector<HTMLButtonElement>(`[data-rm="${id}"]`) ??
      formRef.current?.parentElement?.querySelector<HTMLButtonElement>(".lpf__tray button, .lpf__restore");
    el?.focus({ preventScroll: true });
  }, [removed]);

  const remove = (f: Field) => {
    const idx = kept.findIndex((k) => k.id === f.id);
    const next = kept[idx + 1] ?? kept[idx - 1];
    focusAfter.current = next ? next.id : null;
    setNote(`הסרתם את "${f.label}". ${f.why}`);
    const commit = () => {
      setRemoved((r) => (r.includes(f.id) ? r : [...r, f.id]));
      setLeaving(null);
    };
    if (motionOn()) {
      setLeaving(f.id);
      window.setTimeout(commit, 220);
    } else commit();
  };
  const restore = (f: Field) => {
    setRemoved((r) => r.filter((id) => id !== f.id));
    setNote(`החזרתם את "${f.label}".`);
  };
  const balance = () => {
    setRemoved(FIELDS.filter((f) => !BALANCED.includes(f.id)).map((f) => f.id));
    setNote("נשארו רק השאלות שצריך כדי לחזור ללקוח מוכנים.");
  };
  const restoreAll = () => {
    setRemoved([]);
    setNote("כל השדות חזרו לטופס.");
  };

  const meter = (
    <div className="lpf__meter" ref={meterRef}>
      <div className="lpf__count" aria-hidden="true">
        <span className="lpf__num">{kept.length}</span>
        <span className="lpf__numlabel">{kept.length === 1 ? "שדה" : "שדות"}</span>
      </div>
      <div className="lpf__gauges">
        <div className="lpf__gauge" data-kind="ease">
          <p className="lpf__glabel">
            <span className="lpf__gname">קל למלא</span>
            <span className="lpf__glevel">{level(ease, LEVELS_EASE)}</span>
          </p>
          <span className="lpf__bar" aria-hidden="true">
            <span className="lpf__fill" style={{ transform: `scaleX(${Math.max(0.04, ease)})` }} />
          </span>
        </div>
        <div className="lpf__gauge" data-kind="know">
          <p className="lpf__glabel">
            <span className="lpf__gname">מה תדעו לפני השיחה</span>
            <span className="lpf__glevel">{know.label}</span>
          </p>
          <span className="lpf__bar" aria-hidden="true">
            <span className="lpf__fill" style={{ transform: `scaleX(${Math.min(1, know.fill)})` }} />
          </span>
        </div>
      </div>
      <p className="lpf__vtitle" aria-hidden="true">
        <span className="lpf__vmark" />
        {st.title}
      </p>
    </div>
  );

  return (
    <div className="lpf" data-state={st.key}>
      <p className="sr-only" aria-live="polite">
        {note} {st.title}. {st.body}
      </p>
      <div className="lpf__sheet" ref={formRef}>
        <p className="lpf__formhead">
          <span className="lpf__formtitle">בקשה להצעה</span>
          <span className="lpf__formsub">עסק לדוגמה · טופס בדף נחיתה</span>
        </p>
        <ul className="lpf__fields" aria-label="השדות בטופס">
          {kept.map((f) => (
            <li key={f.id} className="lpf__field" data-kind={f.kind} data-leaving={leaving === f.id ? "" : undefined}>
              <span className="lpf__label">{f.label}</span>
              <span className={f.area ? "lpf__input lpf__input--area" : "lpf__input"} aria-hidden="true">
                <span className="lpf__ph">{f.ph}</span>
                {f.select && <span className="lpf__caret" />}
              </span>
              <button
                type="button"
                className="lpf__rm"
                data-rm={f.id}
                aria-label={`הסרת השדה: ${f.label}`}
                onClick={() => remove(f)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
        <span className="lpf__submit" aria-hidden="true">
          {st.key === "balanced" ? "קבלו הצעה" : "שליחה"}
        </span>

        {removed.length > 0 && (
          <div className="lpf__tray">
            <p className="lpf__traylabel">הוסרו מהטופס. הקישו כדי להחזיר:</p>
            <ul>
              {FIELDS.filter((f) => removed.includes(f.id)).map((f) => (
                <li key={f.id}>
                  <button type="button" data-kind={f.kind} aria-label={`החזרת השדה: ${f.label}`} onClick={() => restore(f)}>
                    <span aria-hidden="true">↺</span> {f.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <span className="lpf__end" ref={endRef} aria-hidden="true" />
      </div>

      <div className="lpf__panel">
        {meter}
        {/* phones only: a visual echo of the meter while the form scrolls (the live region speaks) */}
        <div className="lpf__rail" aria-hidden="true">
          <div className="lpf__mini" data-on={mini ? "" : undefined}>
            <span className="lpf__mcount">
              <span className="lpf__mnum">{kept.length}</span>
              <span className="lpf__mlabel">{kept.length === 1 ? "שדה" : "שדות"}</span>
            </span>
            <span className="lpf__mtitle">
              <span className="lpf__vmark" />
              {st.title}
            </span>
            <span className="lpf__mgauges">
              <span className="lpf__mgauge" data-kind="ease">
                <span className="lpf__mname">קל למלא</span>
                <span className="lpf__bar">
                  <span className="lpf__fill" style={{ transform: `scaleX(${Math.max(0.04, ease)})` }} />
                </span>
              </span>
              <span className="lpf__mgauge" data-kind="know">
                <span className="lpf__mname">מה תדעו</span>
                <span className="lpf__bar">
                  <span className="lpf__fill" style={{ transform: `scaleX(${Math.min(1, know.fill)})` }} />
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="lpf__side">
          <p className="lpf__vbody" aria-hidden="true">
            {st.body}
          </p>
          {note && <p className="lpf__note" aria-hidden="true">{note}</p>}
          <div className="lpf__actions">
            {st.key !== "balanced" && (
              <button type="button" className="lpf__btn" onClick={balance}>
                השאירו רק את מה שצריך
              </button>
            )}
            {removed.length > 0 && (
              <button type="button" className="lpf__btn lpf__btn--quiet lpf__restore" onClick={restoreAll}>
                להחזיר הכול
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="lpf__key">
        טופס מאוזן שומר ארבע שאלות: שם, טלפון, במה אפשר לעזור ומתי להתחיל. את כל השאר אפשר לשאול בשיחה.
      </p>
    </div>
  );
};

export default FewerFields;
