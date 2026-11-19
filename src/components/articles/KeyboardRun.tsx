// Signature component: מסע המקלדת — real focus traversal (Tab / screen-reader swipe)
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/**
 * "The keyboard journey" (website-accessibility-israel). A small clinic page built from REAL
 * focusable elements (links, buttons, a field). The reader presses "התחילו" and then walks it with
 * their own keyboard — Tab / Shift+Tab move the real focus, Enter on the skip link really skips —
 * or, on a phone, swipes across the page like VoiceOver / TalkBack (swipe right = next), with
 * plain "הבא / הקודם" buttons for anyone who cannot swipe. Every focus stop is numbered on a trail
 * and narrated (aria-live). Two builds of the same page:
 *   נגיש     skip link first, a clear focus ring, logical order, a real button, a labelled field.
 *   לא נגיש  no skip link, no visible focus, the footer link sits early in the code (the order
 *            jumps), the "book" button is a <div> that focus never reaches, a field with no label.
 * The demo elements are tabbable only while a run is active, so keyboard users reading the article
 * are not forced through them; there is no focus trap (Tab simply leaves at the end).
 * No JS: a static list of both walks is shown instead (html:not(.js)).
 */

type Key = "skip" | "logo" | "nav1" | "nav2" | "cta" | "field" | "submit" | "footer";
type Mode = "good" | "bad";

const SAY: Record<Mode, Partial<Record<Key, { say: string; issue?: boolean }>>> = {
  good: {
    skip: { say: "קישור \"דלג לתוכן\". הוא מופיע רק כשמגיעים אליו במקלדת. Enter עליו מדלג על כל התפריט." },
    logo: { say: "הלוגו, קישור לדף הבית. המסגרת מראה בדיוק איפה אתם." },
    nav1: { say: "קישור בתפריט: \"טיפולים\". הסדר זהה לסדר שבו רואים את הדברים." },
    nav2: { say: "קישור בתפריט: \"צרו קשר\"." },
    cta: { say: "כפתור \"קביעת תור\". כפתור אמיתי, אז Enter או רווח מפעילים אותו." },
    field: { say: "שדה עם תווית: \"מספר טלפון\". קורא מסך יודע מה להקריא." },
    submit: { say: "כפתור \"שליחה\"." },
    footer: { say: "קישור בתחתית: \"הצהרת נגישות\". סוף העמוד: הגעתם לכל מה שאפשר ללחוץ עליו." },
  },
  bad: {
    logo: { say: "הפוקוס על הלוגו, אבל אין שום סימון. משתמש מקלדת לא יודע איפה הוא נמצא.", issue: true },
    nav1: { say: "קישור בתפריט: \"טיפולים\". עדיין בלי סימון פוקוס, צריך לנחש.", issue: true },
    nav2: { say: "קישור בתפריט: \"צרו קשר\"." },
    footer: { say: "קפיצה לתחתית: הקישור בא מוקדם בקוד, אז הסדר לא תואם את מה שרואים.", issue: true },
    field: { say: "שדה בלי תווית גלויה. מי שרואה לא יודע מה לכתוב בו, וקורא מסך מקבל רק את מה שהקוד אומר.", issue: true },
    submit: {
      say: "כפתור \"שליחה\". ודילגנו על \"קביעת תור\": הוא בנוי כ-div ולא ככפתור, אז במקלדת אי אפשר להגיע אליו.",
      issue: true,
    },
  },
};

const SUMMARY: Record<Mode, string> = {
  good: "8 עצירות, כולן גלויות ובסדר הגיוני. כל מה שאפשר ללחוץ עליו בעכבר עובד גם במקלדת.",
  bad: "6 עצירות ו-5 בעיות: אין דילוג לתוכן, אין סימון פוקוס, הסדר קופץ, שדה בלי תווית, וכפתור שאי אפשר להגיע אליו.",
};

const STATIC_WALK: Record<Mode, string[]> = {
  good: ["דלג לתוכן", "הלוגו", "טיפולים", "צרו קשר", "קביעת תור", "מספר טלפון", "שליחה", "הצהרת נגישות"],
  bad: ["הלוגו (בלי סימון)", "טיפולים (בלי סימון)", "צרו קשר", "הצהרת נגישות (קפיצה לתחתית)", "שדה בלי תווית", "שליחה"],
};

const KeyboardRun = () => {
  const [mode, setMode] = useState<Mode>("good");
  const [running, setRunning] = useState(false);
  const [visited, setVisited] = useState<Key[]>([]);
  const [at, setAt] = useState<Key | null>(null);
  const [announce, setAnnounce] = useState("");
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);

  /** The page's tabbable stops, in real DOM (= Tab) order. */
  const stops = useCallback(
    () => [...(pageRef.current?.querySelectorAll<HTMLElement>("[data-stop]") ?? [])],
    [],
  );
  const lastKey: Key = mode === "good" ? "footer" : "submit";
  const total = mode === "good" ? 8 : 6;
  const done = visited.includes(lastKey);
  const current = at ? SAY[mode][at] : undefined;

  /* entering a run: make the stops tabbable, then put the real focus on the first one */
  useEffect(() => {
    if (running) stops()[0]?.focus();
  }, [running, mode, stops]);

  const onFocusIn = (e: React.FocusEvent<HTMLDivElement>) => {
    const key = (e.target as HTMLElement).dataset.stop as Key | undefined;
    if (!key) {
      if (e.target === mainRef.current) {
        setAt(null);
        setAnnounce("דילגתם לתוכן הראשי. ה-Tab הבא יגיע ישר ל\"קביעת תור\", בלי לעבור שוב על התפריט.");
      }
      return;
    }
    setAt(key);
    setVisited((v) => (v[v.length - 1] === key ? v : [...v, key]));
    const n = stops().findIndex((el) => el.dataset.stop === key) + 1;
    const s = SAY[mode][key];
    if (s) setAnnounce(`עצירה ${n} מתוך ${total}. ${s.say}${key === lastKey ? ` ${SUMMARY[mode]}` : ""}`);
  };

  const onFocusOut = (e: React.FocusEvent<HTMLDivElement>) => {
    const to = e.relatedTarget as Node | null;
    if (to && pageRef.current?.contains(to)) return;
    setAt(null);
  };
  /* focus left the whole exhibit: the run ends (the stops leave the tab order again), the trail stays */
  const onRootBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const to = e.relatedTarget as Node | null;
    if (to && !rootRef.current?.contains(to)) setRunning(false);
  };

  /* touch: swipe across the page like a screen reader (right = next, left = previous) */
  const move = (dir: 1 | -1) => {
    const list = stops();
    if (!list.length) return;
    const lastIdx = visited.length ? list.findIndex((el) => el.dataset.stop === visited[visited.length - 1]) : -1;
    const fromIdx = at ? list.findIndex((el) => el.dataset.stop === at) : lastIdx;
    const next = Math.max(0, Math.min(list.length - 1, fromIdx + dir));
    list[next]?.focus();
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" || !running) return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx > 0 ? 1 : -1);
  };

  const start = () => {
    setVisited([]);
    setTrail([]);
    setAt(null);
    if (running) stops()[0]?.focus();
    else setRunning(true);
  };

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setVisited([]);
    setTrail([]);
    setAt(null);
    setRunning(false);
    setAnnounce(m === "good" ? "הגרסה הנגישה. לחצו התחילו." : "הגרסה הלא נגישה, אותו עמוד. לחצו התחילו.");
  };

  /* the trail: the centre of every visited stop, relative to the page */
  const measure = useCallback(() => {
    const root = pageRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    setTrail(
      visited.map((k) => {
        const r = root.querySelector<HTMLElement>(`[data-stop="${k}"]`)?.getBoundingClientRect();
        return r ? { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 } : { x: 0, y: 0 };
      }),
    );
  }, [visited]);
  useEffect(measure, [measure]);
  useEffect(() => {
    const root = pageRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  const tab = running ? 0 : -1;
  const badge = (k: Key) => {
    const i = visited.indexOf(k);
    return i >= 0 ? (
      <span className="as-kb__badge" aria-hidden="true">
        {i + 1}
      </span>
    ) : null;
  };
  const cls = (k: Key, extra = "") =>
    ["as-kb__el", `as-kb__el--${k}`, extra, at === k && "is-at", visited.includes(k) && "is-visited"].filter(Boolean).join(" ");
  const noGo = (e: React.MouseEvent) => e.preventDefault();
  const bad = mode === "bad";

  return (
    <div ref={rootRef} className={`as-kb as-kb--${mode}${running ? " is-running" : ""}`} onBlur={onRootBlur}>
      <div className="as-static as-kb__static">
        {(["good", "bad"] as Mode[]).map((m) => (
          <div key={m}>
            <p className="as-static__q">{m === "good" ? "באתר נגיש, Tab עובר על:" : "באתר לא נגיש, Tab עובר על:"}</p>
            <p className="as-static__a">
              {STATIC_WALK[m].join(" ← ")}. {SUMMARY[m]}
            </p>
          </div>
        ))}
      </div>

      <div className="as-kb__modes as-live" role="group" aria-label="איזו גרסה של העמוד">
        <button type="button" className="as-seg" aria-pressed={mode === "good"} onClick={() => switchMode("good")}>
          אתר נגיש
        </button>
        <button type="button" className="as-seg" aria-pressed={mode === "bad"} onClick={() => switchMode("bad")}>
          אתר לא נגיש
        </button>
      </div>

      <div
        ref={pageRef}
        className="as-kb__sketch as-live"
        role="group"
        aria-label={`עמוד לדוגמה של קליניקה, ${bad ? "הגרסה הלא נגישה" : "הגרסה הנגישה"}`}
        onFocus={onFocusIn}
        onBlur={onFocusOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
      >
        <svg className="as-kb__trail" aria-hidden="true" focusable="false">
          {trail.length > 1 && (
            <polyline
              points={trail.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          )}
        </svg>

        {!bad && (
          <a
            href="#kb-main"
            data-stop="skip"
            tabIndex={tab}
            className={cls("skip")}
            onClick={(e) => {
              e.preventDefault();
              mainRef.current?.focus();
            }}
          >
            דלג לתוכן{badge("skip")}
          </a>
        )}
        <div className="as-kb__bar">
          <a href="#kb-home" data-stop="logo" tabIndex={tab} className={cls("logo")} onClick={noGo}>
            <span className="as-kb__logo-cube" aria-hidden="true" />
            קליניקה לדוגמה{badge("logo")}
          </a>
          <span className="as-kb__nav">
            <a href="#kb-treat" data-stop="nav1" tabIndex={tab} className={cls("nav1")} onClick={noGo}>
              טיפולים{badge("nav1")}
            </a>
            <a href="#kb-contact" data-stop="nav2" tabIndex={tab} className={cls("nav2")} onClick={noGo}>
              צרו קשר{badge("nav2")}
            </a>
          </span>
        </div>
        {/* broken build: the footer link sits here in the code, so Tab reaches it before the content */}
        {bad && (
          <div className="as-kb__foot as-kb__foot--early">
            <a href="#kb-a11y" data-stop="footer" tabIndex={tab} className={cls("footer")} onClick={noGo}>
              הצהרת נגישות{badge("footer")}
            </a>
          </div>
        )}
        <div className="as-kb__main" id="kb-main" ref={mainRef} tabIndex={-1}>
          <div className="as-kb__hero">
            <span className="as-kb__h">פיזיותרפיה בשכונה</span>
            <span className="as-kb__p">טיפול אישי, תוכנית תרגילים ומעקב.</span>
            {bad ? (
              <div className={cls("cta", "is-unreachable")}>
                קביעת תור<span className="as-kb__tag">div</span>
              </div>
            ) : (
              <button type="button" data-stop="cta" tabIndex={tab} className={cls("cta")}>
                קביעת תור{badge("cta")}
              </button>
            )}
          </div>
          <div className="as-kb__form">
            {bad ? (
              <span className="as-kb__label" aria-hidden="true">
                {" "}
              </span>
            ) : (
              <label className="as-kb__label" htmlFor="kb-phone">
                מספר טלפון
              </label>
            )}
            <span className={cls("field")}>
              <input
                id={bad ? undefined : "kb-phone"}
                data-stop="field"
                tabIndex={tab}
                className="as-kb__input"
                readOnly
                inputMode="none"
                placeholder="050-0000000"
                aria-label={bad ? "שדה בלי תווית (דוגמה)" : undefined}
                dir="ltr"
              />
              {badge("field")}
            </span>
            <button type="button" data-stop="submit" tabIndex={tab} className={cls("submit")}>
              שליחה{badge("submit")}
            </button>
          </div>
        </div>
        {!bad && (
          <div className="as-kb__foot">
            <a href="#kb-a11y" data-stop="footer" tabIndex={tab} className={cls("footer")} onClick={noGo}>
              הצהרת נגישות{badge("footer")}
            </a>
          </div>
        )}
      </div>

      <div className="as-kb__panel as-live">
        <p className="as-kb__count" aria-hidden="true">
          <span className="as-kb__key">Tab</span>
          <span>
            {visited.length === 0
              ? running
                ? "המקלדת שלכם בפנים"
                : "לפני הכניסה לעמוד"
              : `עצירה ${String(visited.length).padStart(2, "0")} · ${String(total).padStart(2, "0")} עצירות בעמוד`}
          </span>
        </p>
        <p className={`as-kb__say${current?.issue ? " is-issue" : ""}`} aria-hidden="true">
          {current
            ? current.say
            : running
              ? "Tab ו-Shift+Tab במקלדת, או החלקה ימינה ושמאלה על העמוד, כמו בקורא מסך בטלפון."
              : bad
                ? "אותו עמוד, בנוי בלי לחשוב על מקלדת. לחצו התחילו ועברו עליו עם Tab."
                : "לחצו התחילו, ואז עברו על העמוד עם Tab, כמו משתמש מקלדת."}
        </p>
        {done && <p className="as-kb__summary">{SUMMARY[mode]}</p>}
        <div className="as-kb__controls">
          <button type="button" className="as-btn as-btn--primary" onClick={start}>
            <span className="as-kb__key as-kb__key--on" aria-hidden="true">
              ↵
            </span>
            {visited.length ? "מההתחלה" : "התחילו"}
          </button>
          <span className="as-kb__touch" role="group" aria-label="מעבר בלי מקלדת">
            <button type="button" className="as-btn" disabled={!running} onClick={() => move(1)}>
              הבא
            </button>
            <button type="button" className="as-btn" disabled={!running} onClick={() => move(-1)}>
              הקודם
            </button>
          </span>
        </div>
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default KeyboardRun;
