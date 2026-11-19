// Signature component: אותו סיפור — blink comparator (tap what jumps)
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionOk } from "./useInView";
import "./ProfileBlink.css";

/**
 * "Same story" (google-business-profile-guide). Astronomers found moving stars with a blink
 * comparator: two plates of the same sky shown in turn, so anything that differs jumps. Here the
 * two plates are a sample business's Google profile card and its website footer, set in the very
 * same layout and blinked in one frame. Details that are identical stay still; details that differ
 * jump. Tap the jumping line to fix it: both copies take the right value, a vermilion ink ring is
 * drawn round it and the note says why it matters. All four found → "אותו סיפור" seal.
 * Blinking runs only on screen and only with motion allowed; otherwise (and after any manual
 * choice) the reader flips the plates with the two plate-holder thumbnails above the eyepiece
 * (a recognisable profile card and a footer strip). Both values of every line are rendered stacked
 * in one grid cell, so the blink never changes the layout (no CLS). Screen readers get both
 * values in each line's label, so the game never depends on seeing the blink. aria-live notes.
 * No JS: the lines are listed with both values and what is wrong.
 */

interface Line {
  key: string;
  label: string;
  google: string;
  site: string;
  /** the value both copies take once fixed (only for lines that differ) */
  right?: string;
  why?: string;
}

const LINES: Line[] = [
  {
    key: "name",
    label: "שם העסק",
    google: "סטודיו אלון פיזיותרפיה הכי טובה בחיפה",
    site: "סטודיו אלון לפיזיותרפיה",
    right: "סטודיו אלון לפיזיותרפיה",
    why: "בכרטיס נדחסו מילות מפתח לשם. זה מנוגד להנחיות של גוגל, והשם צריך להיות זהה לשלט ולאתר.",
  },
  { key: "cat", label: "קטגוריה", google: "פיזיותרפיסט", site: "פיזיותרפיסט" },
  {
    key: "phone",
    label: "טלפון",
    google: "04-1234567",
    site: "04-1234576",
    right: "04-1234567",
    why: "באתר התחלפו שתי ספרות. מי שמחייג מהאתר לא מגיע אליכם, וגוגל רואה שני מספרים לעסק אחד.",
  },
  {
    key: "addr",
    label: "כתובת",
    google: "הנביאים 41, חיפה",
    site: "הנביאים 14, חיפה",
    right: "הנביאים 14, חיפה",
    why: "כתובת אחת בכרטיס ואחרת באתר מבלבלת את גוגל, ואת הלקוח שמנווט אליכם.",
  },
  {
    key: "fri",
    label: "שעות ביום שישי",
    google: "08:00–13:00",
    site: "סגור",
    right: "08:00–13:00",
    why: "השעות עודכנו רק במקום אחד. לקוח שמגיע לעסק סגור, או מוותר על עסק פתוח, לא יחזור בקלות.",
  },
  { key: "link", label: "קישור", google: "לעמוד הבית של הסטודיו", site: "לעמוד הבית של הסטודיו" },
];

const DIFFS = LINES.filter((l) => l.right).length;
type Side = "google" | "site";
/** numbers, phones and hours read left to right inside the Hebrew line */
const dirOf = (v: string) => (/^[\d-]/.test(v) ? "ltr" : "auto");
const TAB: Record<Side, string> = { google: "כרטיס העסק בגוגל", site: "הפוטר באתר העסק" };

const ProfileBlink = () => {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const motionOk = useMotionOk();
  const [side, setSide] = useState<Side>("google");
  const [auto, setAuto] = useState(true);
  const [fixed, setFixed] = useState<Record<string, boolean>>({});
  const fixedRef = useRef<Record<string, boolean>>({});
  const [note, setNote] = useState<{ title: string; body: string; ok: boolean } | null>(null);
  const found = LINES.filter((l) => l.right && fixed[l.key]).length;
  const done = found === DIFFS;
  const blinking = auto && motionOk && inView && !done;

  useEffect(() => {
    if (!blinking) return;
    const t = window.setInterval(() => setSide((s) => (s === "google" ? "site" : "google")), 760);
    return () => window.clearInterval(t);
  }, [blinking]);

  /* both values are always rendered, stacked in one grid cell; only the visible one changes, so the
     box keeps the taller value's height and nothing below it moves while the plates blink */
  const valueOf = (l: Line, s: Side) => (l.right && fixed[l.key] ? l.right : s === "google" ? l.google : l.site);
  const still = !motionOk || !auto;

  const tap = (l: Line) => {
    if (!l.right) {
      setNote({ title: `${l.label}: זהה בשני המקומות`, body: "השורה הזאת לא משתנה בין העותקים. אין מה לתקן כאן.", ok: false });
      return;
    }
    if (fixed[l.key]) return;
    const next = { ...fixedRef.current, [l.key]: true };
    fixedRef.current = next;
    setFixed(next);
    const n = LINES.filter((x) => x.right && next[x.key]).length;
    setNote({
      title: n === DIFFS ? "אותו סיפור בכל מקום" : `תוקן: ${l.label}`,
      body: n === DIFFS ? "ארבעת הפרטים זהים עכשיו בכרטיס ובאתר. כך גוגל והלקוחות רואים עסק אחד, עם פרטים שאפשר לסמוך עליהם." : (l.why ?? ""),
      ok: true,
    });
  };

  const choose = (s: Side) => {
    setAuto(false);
    setSide(s);
  };

  const reset = () => {
    fixedRef.current = {};
    setFixed({});
    setNote(null);
    setAuto(true);
    setSide("google");
  };

  return (
    <div className="as-pb" ref={root}>
      <ul className="as-static">
        {LINES.filter((l) => l.right).map((l) => (
          <li key={l.key}>
            <p className="as-static__q">
              {l.label}: בגוגל <bdi dir={dirOf(l.google)}>"{l.google}"</bdi>, באתר <bdi dir={dirOf(l.site)}>"{l.site}"</bdi>
            </p>
            <p className="as-static__a">{l.why}</p>
          </li>
        ))}
      </ul>

      <div className="as-pb__live as-live">
        <div className="as-pb__bar">
          <div className="as-pb__holders" role="group" aria-label="איזה עותק להציג במסגרת">
            <button
              type="button"
              className="as-pb__holder as-pb__holder--google"
              aria-pressed={side === "google"}
              onClick={() => choose("google")}
            >
              <span className="as-pb__thumb" aria-hidden="true">
                <span className="as-pb__t-map">
                  <i />
                </span>
                <span className="as-pb__t-name" />
                <span className="as-pb__t-sub" />
                <span className="as-pb__t-chips">
                  <b>חיוג</b>
                  <b>מסלול</b>
                  <b>אתר</b>
                </span>
              </span>
              <span className="as-pb__holder-l">בגוגל</span>
            </button>
            <button
              type="button"
              className="as-pb__holder as-pb__holder--site"
              aria-pressed={side === "site"}
              onClick={() => choose("site")}
            >
              <span className="as-pb__thumb" aria-hidden="true">
                <span className="as-pb__t-page">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="as-pb__t-foot">
                  <span className="as-pb__t-logo" />
                  <span className="as-pb__t-cols">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
              </span>
              <span className="as-pb__holder-l">באתר</span>
            </button>
          </div>
          {motionOk && !done && (
            <button type="button" className="as-btn as-btn--quiet as-pb__auto" onClick={() => setAuto((a) => !a)}>
              {auto ? "עצרו את ההבהוב" : "הבהבו שוב"}
            </button>
          )}
        </div>

        <div className={`as-pb__plate as-pb__plate--${side}${blinking ? " is-blinking" : ""}${done ? " is-done" : ""}`}>
          <span className="as-pb__reticle" aria-hidden="true" />
          <p className="as-pb__tab" aria-hidden="true">
            <span className="as-pb__tab-dot" />
            <span className="as-pb__stack">
              {(["google", "site"] as const).map((s) => (
                <span key={s} className={s === side ? "is-shown" : ""}>
                  {TAB[s]}
                </span>
              ))}
            </span>
          </p>
          <svg className="as-pb__map" viewBox="0 0 320 64" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
            <path d="M0 40 C60 34 90 52 160 44 S270 26 320 34" />
            <path d="M40 0 L70 64 M210 0 L190 64 M0 14 L320 20" />
            <circle cx="96" cy="34" r="5" className="as-pb__pin" />
          </svg>
          <dl className="as-pb__lines">
            {LINES.map((l) => {
              const isFixed = !!(l.right && fixed[l.key]);
              return (
                <div key={l.key} className={`as-pb__line${isFixed ? " is-fixed" : ""}`}>
                  <dt className="as-pb__label">{l.label}</dt>
                  <dd className="as-pb__dd">
                    <button
                      type="button"
                      className="as-pb__value"
                      onClick={() => tap(l)}
                      aria-label={
                        isFixed
                          ? `${l.label}: ${l.right}. תוקן, זהה בשני המקומות.`
                          : `${l.label}: בגוגל ${l.google}, באתר ${l.site}`
                      }
                    >
                      <span className="as-pb__stack">
                        {(["google", "site"] as const).map((s) => (
                          <span key={s} className={s === side ? "is-shown" : ""} dir={dirOf(valueOf(l, s))}>
                            {valueOf(l, s)}
                          </span>
                        ))}
                      </span>
                      {isFixed && (
                        <svg className="as-pb__ring" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M8 22 C6 8 40 3 62 5 S98 12 94 24 S60 39 36 37 S4 32 10 16" pathLength={1} />
                        </svg>
                      )}
                    </button>
                  </dd>
                </div>
              );
            })}
          </dl>
          {done && (
            <p className="as-pb__seal" aria-hidden="true">
              <span>אותו</span>
              <span>סיפור</span>
            </p>
          )}
        </div>

        <div className="as-pb__foot">
          <p className="as-pb__count">
            <span className="as-pb__marks" aria-hidden="true">
              {LINES.filter((l) => l.right).map((l) => (
                <span key={l.key} className={fixed[l.key] ? "is-on" : ""} />
              ))}
            </span>
            נמצאו {found} מתוך {DIFFS}
          </p>
          {found > 0 && (
            <button type="button" className="as-btn as-btn--quiet" onClick={reset}>
              מההתחלה
            </button>
          )}
        </div>

        <div className={`as-pb__note${note?.ok ? " is-ok" : ""}`} aria-live="polite">
          {note ? (
            <>
              <p className="as-pb__note-title">{note.title}</p>
              <p className="as-pb__note-body">{note.body}</p>
            </>
          ) : (
            <p className="as-pb__note-body">
              {still
                ? "החליפו בין בגוגל לבאתר, ומצאו מה משתנה. כל שורה שמשתנה היא סתירה: הקישו עליה כדי לתקן."
                : "שני העותקים מתחלפים באותה מסגרת. מה שזהה עומד במקום, ומה שקופץ הוא סתירה. הקישו על השורה שקופצת."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBlink;
