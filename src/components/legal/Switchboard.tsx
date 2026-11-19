// Signature component: לוח הבקרה — live switchboard
import { useState, type CSSProperties } from "react";
import {
  A11Y_LABELS,
  A11Y_OPEN_EVENT,
  DEFAULT_A11Y,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  countActive,
  isDefaultA11y,
  toggled,
  useA11ySettings,
  withFontSize,
  type A11yToggle,
} from "./a11y-store";
import A11yGlyph from "./A11yGlyph";

/**
 * /accessibility/ — "לוח הבקרה". The statement hands you the real switches. Every control flips
 * the REAL setting (the same store as the floating widget: localStorage + body classes), so the
 * whole page changes, and the choice follows you to every page.
 *
 * Built as a piece of equipment, not a settings list:
 *  - the MONITOR: a readout that says in words what the last control did + a live specimen (a
 *    heading, a paragraph with a link, a button with its focus ring, a small picture and a moving
 *    part) that shows the effect right beside your thumb. It is sticky inside the board, so the
 *    readout never scrolls out of view while you work the lower controls (not at 150%+ text,
 *    where a sticky monitor would cover the controls themselves).
 *  - the CONSOLE: a long text-size fader, a three-position contrast selector (dark · normal ·
 *    light — one throw, so the two contrast modes can never both be on), nine breakers with a real
 *    throw (handle down = off, up = on, lamp lit), and a master reset bar.
 * The console keeps its own drawn contrast palette in the site's contrast modes (it is excluded
 * from the global override, which would erase the levers), while the monitor and the rest of the
 * board take the real override — so you see exactly what the mode does.
 * Keyboard: native buttons (role="switch"), native radios, a native range. No JS: the console is
 * hidden (it could not work) and a note explains the browser's own zoom and contrast settings.
 */

const WHAT: Record<A11yToggle, string> = {
  readableFont: "כל הטקסט עובר לגופן פשוט ומרווח.",
  highlightLinks: "כל קישור מקבל מסגרת וקו תחתון.",
  highlightTitles: "כל כותרת מסומנת, כדי לסרוק את העמוד מהר.",
  readingGuide: "קו דק עוקב אחרי העכבר או האצבע ומחזיק את השורה.",
  highContrastDark: "טקסט צהוב על רקע שחור.",
  highContrastLight: "טקסט שחור על רקע לבן.",
  grayscale: "כל הצבעים יורדים לגווני אפור.",
  invertColors: "הצבעים מתהפכים, נוח לקריאה בחושך.",
  pauseAnimations: "כל תנועה ומעבר באתר נעצרים.",
  bigCursor: "סמן עכבר גדול וברור.",
  focusOutline: "מסגרת עבה סביב מה שבפוקוס, לניווט במקלדת.",
};

/** The nine breakers, three rows: text · colour & reading · motion & navigation. */
const BREAKERS: A11yToggle[] = [
  "readableFont",
  "highlightLinks",
  "highlightTitles",
  "grayscale",
  "invertColors",
  "readingGuide",
  "pauseAnimations",
  "bigCursor",
  "focusOutline",
];

type Contrast = "dark" | "normal" | "light";
const CONTRAST: { id: Contrast; label: string }[] = [
  { id: "dark", label: "כהה" },
  { id: "normal", label: "רגיל" },
  { id: "light", label: "בהירה" },
];

const two = (n: number) => String(n).padStart(2, "0");

const Switchboard = () => {
  const [s, set, ready] = useA11ySettings();
  const [readout, setReadout] = useState<{ title: string; line: string } | null>(null);

  const flip = (key: A11yToggle) => {
    const next = set((prev) => toggled(prev, key));
    setReadout({
      title: `${A11Y_LABELS[key]} · ${next[key] ? "פועל" : "כבוי"}`,
      line: next[key] ? WHAT[key] : "חזר למצב הרגיל.",
    });
  };

  const contrast: Contrast = s.highContrastDark ? "dark" : s.highContrastLight ? "light" : "normal";
  const throwContrast = (to: Contrast) => {
    set((prev) => ({ ...prev, highContrastDark: to === "dark", highContrastLight: to === "light" }));
    setReadout(
      to === "normal"
        ? { title: "ניגודיות · רגילה", line: "הצבעים של האתר חזרו." }
        : { title: `ניגודיות ${to === "dark" ? "כהה" : "בהירה"} · פועלת`, line: WHAT[to === "dark" ? "highContrastDark" : "highContrastLight"] },
    );
  };

  const size = (value: number | ((prev: number) => number)) => {
    const next = set((prev) => withFontSize(prev, typeof value === "function" ? value(prev.fontSize) : value));
    setReadout({
      title: `גודל טקסט · ${next.fontSize}%`,
      line: next.fontSize === 100 ? "הגודל המקורי." : "כל הטקסט באתר גדל או קטן ביחס, והפריסה מתאימה את עצמה.",
    });
  };

  const reset = () => {
    set({ ...DEFAULT_A11Y });
    setReadout({ title: "איפוס · הכול למטה", line: "האתר חזר לתצוגה הרגילה." });
  };

  const active = ready ? countActive(s) : 0;
  const pct = ((s.fontSize - FONT_MIN) / (FONT_MAX - FONT_MIN)) * 100;
  const clean = !ready || isDefaultA11y(s);

  return (
    <div className="lg-board" data-big={s.fontSize >= 150 ? "" : undefined}>
      <div className="lg-board__plate">
        <span className="lg-board__screw" aria-hidden="true" />
        <p className="lg-board__brand">
          <span className="nzc-cube" aria-hidden="true" />
          לוח הבקרה
        </p>
        <p className="lg-board__count" aria-hidden="true">
          <span className="lg-board__count-num">{two(active)}</span> פעילים
        </p>
        <span className="lg-board__screw" aria-hidden="true" />
      </div>

      <div className="lg-board__grid">
        {/* ── the monitor ─────────────────────────────────────────────── */}
        <div className="lg-monitor">
          <div className="lg-monitor__readout" role="status" aria-live="polite">
            <span className="lg-monitor__lamp" data-on={readout ? "" : undefined} aria-hidden="true" />
            <span className="lg-monitor__text">
              {readout ? (
                <>
                  <span className="lg-monitor__title">{readout.title}</span>
                  <span className="lg-monitor__line">{readout.line}</span>
                </>
              ) : (
                <>
                  <span className="lg-monitor__title">{active ? `${active} הגדרות כבר פועלות` : "הכול במצב רגיל"}</span>
                  <span className="lg-monitor__line">הזיזו מתג וראו מה קורה כאן, ובכל העמוד.</span>
                </>
              )}
            </span>
          </div>

          <div className="lg-monitor__specimen" aria-hidden="true">
            <span className="lg-monitor__k">דוגמה חיה</span>
            <span className="lg-monitor__pic">
              <span />
              <span />
              <span />
            </span>
            <span className="lg-monitor__copy">
              <span className="lg-monitor__h">כותרת לדוגמה</span>
              <span className="lg-monitor__p">
                ככה נראה טקסט באתר, עם <span className="lg-monitor__a">קישור</span> בתוכו.
              </span>
            </span>
            <span className="lg-monitor__row">
              <span className="lg-monitor__btn">כפתור בפוקוס</span>
              <span className="lg-monitor__track">
                <span className="lg-monitor__runner" />
              </span>
            </span>
          </div>
        </div>

        {/* ── the console (keeps its own palette in the contrast modes) ── */}
        <div className="lg-console" data-a11y-exclude="true">
          <div className="lg-fader">
            <div className="lg-fader__head">
              <label htmlFor="lg-fader-range" className="lg-fader__name">
                גודל טקסט
              </label>
              <output htmlFor="lg-fader-range" className="lg-fader__value">
                {s.fontSize}
                <span>%</span>
              </output>
            </div>
            <div className="lg-fader__ctrl">
              <button
                type="button"
                className="lg-fader__step"
                onClick={() => size((v) => v - FONT_STEP)}
                disabled={s.fontSize <= FONT_MIN}
                aria-label="הקטנת טקסט"
              >
                <span aria-hidden="true">−</span>
              </button>
              <div className="lg-fader__track" style={{ "--lg-pct": `${pct}%` } as CSSProperties}>
                <span className="lg-fader__ticks" aria-hidden="true" />
                <input
                  id="lg-fader-range"
                  type="range"
                  min={FONT_MIN}
                  max={FONT_MAX}
                  step={FONT_STEP}
                  value={s.fontSize}
                  onChange={(e) => size(Number(e.target.value))}
                  aria-valuetext={`${s.fontSize}%`}
                  className="lg-fader__range"
                />
              </div>
              <button
                type="button"
                className="lg-fader__step"
                onClick={() => size((v) => v + FONT_STEP)}
                disabled={s.fontSize >= FONT_MAX}
                aria-label="הגדלת טקסט"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>

          <fieldset className="lg-throw" data-pos={contrast}>
            <legend className="lg-throw__name">ניגודיות</legend>
            <div className="lg-throw__body">
              <span className="lg-throw__rail" aria-hidden="true">
                <span className="lg-throw__knob" />
              </span>
              {CONTRAST.map((c) => (
                <label key={c.id} className="lg-throw__pos">
                  <input
                    type="radio"
                    name="lg-contrast"
                    value={c.id}
                    checked={contrast === c.id}
                    onChange={() => throwContrast(c.id)}
                    className="lg-throw__input"
                  />
                  <span className="lg-throw__label">{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="lg-breakers" role="group" aria-label="מפסקים">
            {BREAKERS.map((key) => (
              <button
                key={key}
                type="button"
                role="switch"
                aria-checked={s[key]}
                aria-describedby={`lg-br-${key}`}
                className="lg-br"
                onClick={() => flip(key)}
              >
                <span className="lg-br__lamp" aria-hidden="true" />
                <span className="lg-br__slot" aria-hidden="true">
                  <span className="lg-br__handle" />
                </span>
                <span className="lg-br__name">{A11Y_LABELS[key]}</span>
                <span className="nz-sr" id={`lg-br-${key}`}>
                  {WHAT[key]}
                </span>
              </button>
            ))}
          </div>

          <button type="button" className="lg-master" onClick={reset} disabled={clean}>
            <span className="lg-master__slot" aria-hidden="true">
              <span className="lg-master__handle" />
            </span>
            <span className="lg-master__name">איפוס</span>
            <span className="lg-master__what">כל המתגים חוזרים למטה</span>
          </button>
        </div>
      </div>

      <div className="lg-board__foot">
        <div className="lg-board__phone" aria-hidden="true">
          <span className="lg-board__phone-line" />
          <span className="lg-board__phone-line lg-board__phone-line--short" />
          <span className="lg-board__phone-line" />
          <span className="lg-board__phone-bead">
            <A11yGlyph />
          </span>
        </div>
        <div className="lg-board__foot-text">
          <p className="lg-board__foot-title">אותו לוח, בכל עמוד</p>
          <p className="lg-board__foot-line">
            הכפתור העגול בפינה הימנית התחתונה של המסך פותח את אותן הגדרות מכל עמוד באתר. מה שתבחרו כאן נשמר בדפדפן.
          </p>
          <button type="button" className="lg-board__open" onClick={() => window.dispatchEvent(new Event(A11Y_OPEN_EVENT))}>
            לפתוח את התפריט הצף
          </button>
        </div>
      </div>

      <p className="lg-board__nojs">
        המתגים פועלים כש-JavaScript זמין. גם בלעדיו אפשר להגדיל טקסט ולשנות ניגודיות דרך ההגדרות של הדפדפן ושל מערכת ההפעלה.
      </p>
    </div>
  );
};

export default Switchboard;
