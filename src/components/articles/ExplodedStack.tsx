// Signature component: המבט המפורק — pull a layer out of the stack (Jenga) and watch what breaks
import { useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from "react";
import "./ExplodedStack.css";

/**
 * "The exploded view" (react-vs-wordpress-2026). A website drawn as an exploded isometric stack,
 * the way engineers draw a machine: WordPress (server, core, theme, four plugins, admin, content)
 * or React with pre-built HTML (CDN, pre-built HTML, open-source libraries, code written for the
 * business, an optional self-edit panel, content). Every plate carries its own glyph on its top
 * face; plates that need their own updates carry a vermilion mark (legend above the stack).
 *
 * The gesture is the lesson: slide one plate sideways out of the stack, like a Jenga block. The
 * plates above sink into the gap (the ones that depended on it tilt and are hatched), and a small
 * live mini site of a sample carpentry shop next to the stack shows what breaks: a database error,
 * a blank page, raw unstyled text, a form turned into a shortcode, a generic Google snippet, an
 * unlocked door, a slow load, no edit button, a frozen build… Let go past halfway and the plate
 * stays out; otherwise it slides back. One plate out at a time.
 * Touch: horizontal drag on the stage (touch-action pan-y keeps vertical scrolling). Single-pointer
 * alternative: tap a plate or its label. Keyboard: every label is a toggle button (aria-pressed).
 * aria-live card says what the layer does, what broke and who maintains it.
 * No JS: both stacks are listed layer by layer.
 */

type Glyph = "server" | "core" | "theme" | "form" | "seo" | "lock" | "cache" | "pencil" | "text" | "cdn" | "libs" | "html" | "code";
type Break = "db" | "blank" | "unstyled" | "shortcode" | "seo" | "unlocked" | "slow" | "noedit" | "empty" | "offline" | "frozen" | "crawler" | "nocode";

interface Layer {
  name: string;
  tag: string;
  body: string;
  broke: string;
  who: string;
  glyph: Glyph;
  breaks: Break;
  /** indexes (in the same stack) that stop working without this layer */
  hurts?: number[];
  /** needs its own updates */
  upd?: boolean;
  thin?: boolean;
  dashed?: boolean;
}

const CONTENT_BODY = "הטקסטים, התמונות והשירותים. גוגל מדרג את העמודים האלה, לא את הטכנולוגיה שמתחתם.";
const CONTENT_BROKE = "המבנה עומד, אבל אין מה לקרוא. בלי תוכן אין סיבה להגיע, בשום טכנולוגיה.";

const STACKS: Record<"wp" | "react", Layer[]> = {
  wp: [
    { name: "שרת, PHP ומסד נתונים", tag: "בונה עמוד בכל בקשה", glyph: "server", breaks: "db", hurts: [1, 2, 3, 4, 5, 6, 7, 8], body: "כשגולש מבקש עמוד, השרת מרכיב אותו מהמסד ומהתבנית, אלא אם יש שכבת מטמון.", broke: "בלי שרת ומסד אין מאיפה להרכיב את העמוד. הגולש מקבל הודעת שגיאה, וכל מה שמעל נשאר בלי בסיס.", who: "חברת האחסון, ומי שמתחזק את האתר" },
    { name: "ליבת WordPress", tag: "מתעדכנת", glyph: "core", breaks: "blank", hurts: [2, 3, 4, 5, 6, 7], upd: true, body: "המערכת עצמה. היא מתוחזקת היטב ומשחררת עדכונים, וחשוב להתקין אותם בזמן.", broke: "התבנית, התוספים וממשק הניהול רצים על הליבה. בלעדיה אף אחד מהם לא עובד, והגולש רואה דף ריק.", who: "מי שמתחזק את האתר" },
    { name: "תבנית", tag: "מתעדכנת", glyph: "theme", breaks: "unstyled", upd: true, body: "קובעת את העיצוב והמבנה. תבנית כבדה היא אחת הסיבות הנפוצות לאתר איטי.", broke: "התוכן עדיין שם, אבל בלי התבנית אין עיצוב ואין מבנה: טקסט פשוט, שורה מתחת לשורה.", who: "מפתח התבנית, ומי שמתחזק את האתר" },
    { name: "תוסף טפסים", tag: "תוסף · מתעדכן", glyph: "form", breaks: "shortcode", upd: true, thin: true, body: "טופס צור הקשר ושמירת הפניות. צריך לטפל גם בספאם ובמידע האישי שנשמר בו.", broke: "במקום הטופס מופיע קוד קצר שאף גולש לא מבין, ופניות לא מגיעות.", who: "מפתח התוסף, ומי שמתחזק את האתר" },
    { name: "תוסף SEO", tag: "תוסף · מתעדכן", glyph: "seo", breaks: "seo", upd: true, thin: true, body: "כותרת ותיאור לכל עמוד, ומפת אתר שמגישים לגוגל.", broke: "העמוד עצמו נראה אותו דבר, אבל בתוצאה בגוגל הכותרת והתיאור הופכים לכלליים.", who: "מפתח התוסף, ומי שמתחזק את האתר" },
    { name: "תוסף אבטחה", tag: "תוסף · מתעדכן", glyph: "lock", breaks: "unlocked", upd: true, thin: true, body: "חומת אש, הגבלה של ניסיונות כניסה וסריקה של קבצים חשודים.", broke: "לעין לא משתנה כלום, וזה בדיוק העניין: דלת הכניסה לממשק הניהול פחות מוגנת.", who: "מפתח התוסף, ומי שמתחזק את האתר" },
    { name: "תוסף מטמון", tag: "תוסף · מתעדכן", glyph: "cache", breaks: "slow", upd: true, thin: true, body: "שומר עותק מוכן של כל עמוד, כדי שהשרת לא יבנה אותו מחדש בכל ביקור. אחרי עריכה צריך לנקות אותו, אחרת מוצג עמוד ישן.", broke: "כל עמוד נבנה מחדש בכל ביקור, והטעינה מתארכת.", who: "מפתח התוסף, ומי שמתחזק את האתר" },
    { name: "ממשק ניהול", tag: "היתרון של WordPress", glyph: "pencil", breaks: "noedit", body: "עורכים עמודים ופוסטים לבד, בממשק מוכר. זו גם דלת כניסה שצריך לשמור עליה, עם סיסמה חזקה ועדכונים.", broke: "האתר ממשיך לעבוד. מה שנעלם הוא היכולת לערוך אותו לבד, וזה בדיוק היתרון הגדול של WordPress.", who: "אתם, או הצוות שלכם" },
    { name: "התוכן שלכם", tag: "מה שהגולש בא לקרוא", glyph: "text", breaks: "empty", body: CONTENT_BODY, broke: CONTENT_BROKE, who: "אתם" },
  ],
  react: [
    { name: "רשת שרתים (CDN)", tag: "מגישה קבצים מוכנים", glyph: "cdn", breaks: "offline", hurts: [1, 2, 3, 4, 5], body: "העמודים מוגשים משרת קרוב לגולש, בלי לבנות שום דבר בזמן הבקשה.", broke: "העמודים מוכנים, אבל אין מי שיגיש אותם. הגולש לא מגיע לשום דבר.", who: "ספק האחסון" },
    { name: "HTML מוכן מראש", tag: "נבנה פעם אחת", glyph: "html", breaks: "crawler", body: "כל עמוד נבנה לפני שמישהו מבקש אותו. הגולש מקבל עמוד מוכן כמעט מיד, וכל סורק רואה את התוכן המלא.", broke: "בלי HTML מוכן, העמוד נבנה רק בדפדפן של הגולש. הוא מחכה מול מסך ריק, וסורק שלא מריץ קוד רואה עמוד ריק.", who: "נבנה מחדש אוטומטית בכל שינוי" },
    { name: "ספריות קוד פתוח", tag: "React ועוד · מתעדכנות בכל בנייה", glyph: "libs", breaks: "frozen", hurts: [3], upd: true, body: "React, כלי הבנייה וחבילות הקוד הפתוח שהאתר נשען עליהן. גם הן מקבלות עדכונים, ומעדכנים ובודקים אותן יחד, לפני בנייה חדשה.", broke: "האתר שכבר באוויר ממשיך לעבוד, כי הוא כבר בנוי. אבל אי אפשר לבנות גרסה חדשה, גם לא לתיקון קטן, עד שהספריות חוזרות.", who: "מי שמתחזק את האתר, יחד בכל בנייה" },
    { name: "רכיבים שנכתבו לעסק", tag: "קוד אחד · מתעדכן כיחידה", glyph: "code", breaks: "nocode", upd: true, body: "העיצוב, הטפסים, קביעת התורים והחיבורים נכתבים כחלק מהאתר ולא כתוספים נפרדים, ולכן נבדקים ומתעדכנים יחד.", broke: "העיצוב, הטופס וקביעת התור הם קוד אחד. בלעדיו נשאר רק טקסט, בלי עיצוב ובלי טופס.", who: "מי שמתחזק את האתר" },
    { name: "ממשק לעדכון עצמי", tag: "רק אם מחליטים באפיון", glyph: "pencil", breaks: "noedit", dashed: true, body: "אפשר להוסיף ממשק כזה, אבל הוא מוגדר במיוחד. בלעדיו, שינוי בתוכן נעשה בהודעה למי שמתחזק את האתר.", broke: "האתר עובד בדיוק אותו דבר. בלי הממשק, שינוי בתוכן נעשה בהודעה למי שמתחזק את האתר.", who: "אתם, אם הוגדר" },
    { name: "התוכן שלכם", tag: "מה שהגולש בא לקרוא", glyph: "text", breaks: "empty", body: CONTENT_BODY, broke: CONTENT_BROKE, who: "אתם" },
  ],
};

const LABEL = { wp: "WordPress", react: "React עם HTML מוכן" };
const SUMMARY = {
  wp: "שש שכבות שמתעדכנות כל אחת בנפרד, ממפתחים שונים. בתמורה: ממשק ניהול מוכר לעריכה עצמית.",
  react: "שתי שכבות קוד שמתעדכנות יחד בכל בנייה: הקוד שנכתב לעסק והספריות שהוא נשען עליהן. העמודים מוכנים לפני שמבקשים אותם, ועריכה עצמית רק אם תוכננה מראש.",
};

/* the drawing: LTR svg coordinates; plates on the left, the label column on the right (RTL start) */
const W = 340;
const H = 500;
const CX = 92;
const HW = 78; /* half width of a plate */
const HH = 29; /* half height (isometric) */
const LABEL_X = W * 0.54;
const PULL = 120; /* how far a plate slides out, in svg units */
const SINK = 0.36; /* how far the plates above settle into the gap, in gaps (labels stay put) */

function geometry(n: number) {
  const gap = Math.min(68, (H - 2 * HH - 30) / (n - 1));
  const total = (n - 1) * gap;
  const base = H / 2 + total / 2 - 2;
  return { gap, ys: Array.from({ length: n }, (_, i) => base - i * gap) };
}

/* glyphs drawn in a unit square, mapped onto the plate's top face by an isometric matrix */
function GlyphArt({ g }: { g: Glyph }) {
  switch (g) {
    case "server":
      return (
        <>
          {[0.25, 0.45, 0.65].map((v) => (
            <g key={v}>
              <path d={`M0.18 ${v} H0.82 V${v + 0.13} H0.18Z`} />
              <circle cx={0.72} cy={v + 0.065} r={0.025} className="is-fill" />
            </g>
          ))}
        </>
      );
    case "core":
      return (
        <>
          <circle cx={0.5} cy={0.5} r={0.24} />
          <circle cx={0.5} cy={0.5} r={0.09} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return <path key={a} d={`M${0.5 + Math.cos(r) * 0.24} ${0.5 + Math.sin(r) * 0.24} L${0.5 + Math.cos(r) * 0.33} ${0.5 + Math.sin(r) * 0.33}`} />;
          })}
        </>
      );
    case "theme":
      return (
        <>
          <path d="M0.18 0.18 H0.82 V0.34 H0.18Z" />
          <path d="M0.18 0.42 H0.46 V0.82 H0.18Z" />
          <path d="M0.54 0.42 H0.82 V0.6 H0.54Z" />
          <path d="M0.54 0.66 H0.82 V0.82 H0.54Z" />
        </>
      );
    case "form":
      return (
        <>
          <path d="M0.2 0.24 H0.8 V0.38 H0.2Z" />
          <path d="M0.2 0.46 H0.8 V0.6 H0.2Z" />
          <path d="M0.5 0.68 H0.8 V0.8 H0.5Z" className="is-fill" />
        </>
      );
    case "seo":
      return (
        <>
          <circle cx={0.44} cy={0.44} r={0.2} />
          <path d="M0.58 0.58 L0.82 0.82" />
        </>
      );
    case "lock":
      return (
        <>
          <path d="M0.3 0.48 H0.7 V0.82 H0.3Z" />
          <path d="M0.38 0.48 V0.34 A0.12 0.12 0 0 1 0.62 0.34 V0.48" />
        </>
      );
    case "cache":
      return (
        <>
          <circle cx={0.5} cy={0.5} r={0.3} />
          <path d="M0.5 0.32 V0.5 L0.64 0.6" />
        </>
      );
    case "pencil":
      return (
        <>
          <path d="M0.24 0.76 L0.3 0.58 L0.66 0.22 L0.78 0.34 L0.42 0.7 Z" />
          <path d="M0.3 0.58 L0.42 0.7" />
        </>
      );
    case "text":
      return (
        <>
          <path d="M0.2 0.24 H0.62" className="is-bold" />
          {[0.42, 0.54, 0.66, 0.78].map((v, i) => (
            <path key={v} d={`M0.2 ${v} H${i === 3 ? 0.56 : 0.8}`} />
          ))}
        </>
      );
    case "cdn":
      return (
        <>
          <path d="M0.5 0.5 L0.22 0.26 M0.5 0.5 L0.8 0.3 M0.5 0.5 L0.3 0.8 M0.5 0.5 L0.78 0.76" />
          {[
            [0.5, 0.5],
            [0.22, 0.26],
            [0.8, 0.3],
            [0.3, 0.8],
            [0.78, 0.76],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={0.07} className="is-fill" />
          ))}
        </>
      );
    case "libs":
      return (
        <>
          <path d="M0.18 0.18 H0.44 V0.44 H0.18Z" />
          <path d="M0.56 0.18 H0.82 V0.44 H0.56Z" />
          <path d="M0.18 0.56 H0.44 V0.82 H0.18Z" />
          <path d="M0.56 0.56 H0.82 V0.82 H0.56Z" className="is-fill" />
        </>
      );
    case "html":
      return (
        <>
          <path d="M0.36 0.3 L0.18 0.5 L0.36 0.7" />
          <path d="M0.64 0.3 L0.82 0.5 L0.64 0.7" />
          <path d="M0.56 0.24 L0.44 0.76" />
        </>
      );
    case "code":
      return (
        <>
          <path d="M0.38 0.2 C0.28 0.2 0.3 0.34 0.3 0.42 C0.3 0.48 0.24 0.5 0.2 0.5 C0.24 0.5 0.3 0.52 0.3 0.58 C0.3 0.66 0.28 0.8 0.38 0.8" />
          <path d="M0.62 0.2 C0.72 0.2 0.7 0.34 0.7 0.42 C0.7 0.48 0.76 0.5 0.8 0.5 C0.76 0.5 0.7 0.52 0.7 0.58 C0.7 0.66 0.72 0.8 0.62 0.8" />
          <circle cx={0.5} cy={0.5} r={0.05} className="is-fill" />
        </>
      );
  }
}

function MiniSite({ broken, tech }: { broken: Break | null; tech: "wp" | "react" }) {
  const b = broken;
  const cls = [
    "as-xs__site",
    b === "unstyled" || b === "nocode" ? "is-unstyled" : "",
    b === "empty" ? "is-empty" : "",
    b === "slow" ? "is-slow" : "",
    b === "crawler" ? "is-crawler" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const down = b === "db" ? "db" : b === "blank" ? "blank" : b === "offline" ? "offline" : null;
  const edit = b !== "noedit";
  return (
    <div className="as-xs__preview" aria-hidden="true">
      <div className={cls}>
        <div className="as-xs__chrome">
          <span className="as-xs__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="as-xs__url" dir="ltr">
            <span className={`as-xs__lock${b === "unlocked" ? " is-open" : ""}`} />
            alon-wood.example
          </span>
          <span className="as-xs__load">
            <span />
          </span>
        </div>
        <div className="as-xs__page">
          {down ? (
            <div className={`as-xs__down as-xs__down--${down}`}>
              {down === "db" && <p dir="ltr">Error establishing a database connection</p>}
              {down === "offline" && (
                <p>
                  <strong>האתר לא נמצא</strong>
                  <span>אין שרת שמגיש את הקבצים</span>
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="as-xs__nav">
                <span className="as-xs__logo" />
                <span className="as-xs__brand">נגריית אלון</span>
                <span className="as-xs__links">
                  <i>עבודות</i>
                  <i>אודות</i>
                  <i>צור קשר</i>
                </span>
              </div>
              <p className="as-xs__h">רהיטים בהזמנה אישית</p>
              <p className="as-xs__p">שולחנות, ספריות ומטבחים מעץ מלא, בעבודת יד בחיפה.</p>
              <div className="as-xs__tiles">
                <span>שולחנות</span>
                <span>ספריות</span>
                <span>מטבחים</span>
              </div>
              {b === "shortcode" ? (
                <p className="as-xs__short" dir="ltr">
                  [contact-form id="12"]
                </p>
              ) : b === "nocode" ? null : (
                <div className="as-xs__form">
                  <span />
                  <span />
                  <b>שליחה</b>
                </div>
              )}
              {edit && <span className={`as-xs__edit${tech === "react" ? " is-maybe" : ""}`}>{tech === "react" ? "עריכה, אם הוגדרה" : "עריכה"}</span>}
              {b === "frozen" && <span className="as-xs__frozen">גרסה קפואה: אי אפשר לבנות גרסה חדשה</span>}
              {b === "unlocked" && <span className="as-xs__alert">ממשק הניהול חשוף לניסיונות כניסה</span>}
            </>
          )}
        </div>
      </div>
      <div className={`as-xs__serp${b === "seo" ? " is-generic" : ""}${b === "crawler" ? " is-blank" : ""}`}>
        <span className="as-xs__serp-url" dir="ltr">
          alon-wood.example
        </span>
        <span className="as-xs__serp-t">{b === "seo" ? "עמוד הבית" : b === "crawler" ? "alon-wood.example" : "נגריית אלון | רהיטים מעץ מלא בהזמנה אישית בחיפה"}</span>
        <span className="as-xs__serp-d">
          {b === "seo" ? "עבודות אודות צור קשר שולחנות ספריות מטבחים שליחה…" : b === "crawler" ? "אין תיאור זמין לעמוד הזה." : "שולחנות, ספריות ומטבחים מעץ מלא, בעבודת יד. מתכננים יחד, בונים בסדנה ומתקינים אצלכם."}
        </span>
      </div>
    </div>
  );
}

const ExplodedStack = () => {
  const [tech, setTech] = useState<"wp" | "react">("wp");
  const [out, setOut] = useState<number | null>(null);
  const [pull, setPull] = useState<{ i: number; t: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ i: number; x0: number; y0: number; moved: boolean; id: number; scale: number } | null>(null);
  const layers = STACKS[tech];
  const { gap, ys } = geometry(layers.length);

  /* which plate is moving out, and how far (0..1) */
  const active = pull ?? (out !== null ? { i: out, t: 1 } : null);
  const shown = active && active.t >= 0.5 ? active.i : null;
  const current = shown !== null ? layers[shown] : null;
  const hurt = new Set(shown !== null ? (layers[shown].hurts ?? []) : []);

  const choose = (t: "wp" | "react") => {
    setTech(t);
    setOut(null);
    setPull(null);
  };

  const toggle = (i: number) => setOut((o) => (o === i ? null : i));

  const indexAt = (clientY: number) => {
    const el = stageRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const yv = ((clientY - r.top) / r.height) * H;
    let best: number | null = null;
    let d = Infinity;
    ys.forEach((y, i) => {
      const dd = Math.abs(yv - y);
      if (dd < d) {
        d = dd;
        best = i;
      }
    });
    return d <= Math.max(gap * 0.6, HH) ? best : null;
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const tagged = (e.target as Element).closest?.("[data-i]")?.getAttribute("data-i");
    const i = tagged != null ? Number(tagged) : indexAt(e.clientY);
    if (i === null || Number.isNaN(i)) return;
    const r = stageRef.current!.getBoundingClientRect();
    gesture.current = { i, x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId, scale: r.width / W };
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = Math.abs(e.clientX - g.x0);
    if (!g.moved) {
      if (dx < 6) return;
      g.moved = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety */
      }
    }
    /* pulling the plate that is already out pushes it back in */
    const start = out === g.i ? 1 : 0;
    const d = Math.min(1, dx / g.scale / PULL);
    setPull({ i: g.i, t: start ? 1 - d : d });
  };

  const end = (e: RPointerEvent<HTMLDivElement>, cancelled = false) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (g.moved) {
      const t = pull?.i === g.i ? pull.t : out === g.i ? 1 : 0;
      setOut(t >= 0.5 ? g.i : out === g.i ? null : out);
      setPull(null);
    } else if (!cancelled) {
      toggle(g.i);
    }
  };

  /* keyboard / assistive "click" (detail 0); pointer taps are handled in end() */
  const onLabelClick = (i: number) => (e: RMouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) toggle(i);
  };

  return (
    <div className={`as-xs${pull ? " is-pulling" : ""}`}>
      <div className="as-static">
        {(["wp", "react"] as const).map((t) => (
          <div key={t}>
            <p className="as-static__q">{LABEL[t]}, מלמטה למעלה:</p>
            <ol>
              {STACKS[t].map((l) => (
                <li key={l.name} className="as-static__a">
                  <strong>{l.name}.</strong> {l.body} בלי השכבה הזאת: {l.broke}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="as-xs__live as-live">
        <div className="as-xs__bar">
          <div className="as-xs__switch" role="group" aria-label="איזו טכנולוגיה">
            {(["wp", "react"] as const).map((t) => (
              <button key={t} type="button" className="as-seg" aria-pressed={tech === t} onClick={() => choose(t)}>
                <span dir="ltr">{t === "wp" ? "WordPress" : "React"}</span>
              </button>
            ))}
          </div>
          <p className="as-xs__legend">
            <span className="as-xs__legend-mark" aria-hidden="true" />
            {tech === "wp" ? "מתעדכן בנפרד" : "מתעדכן, יחד בכל בנייה"}
          </p>
        </div>

        <div className="as-xs__grid">
          <div
            className="as-xs__stage"
            ref={stageRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={(e) => end(e)}
            onPointerCancel={(e) => end(e, true)}
          >
            <svg className="as-xs__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              <defs>
                <pattern id="as-xs-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <path d="M0 0 V6" />
                </pattern>
              </defs>
              {layers.map((l, i) => {
                const t = l.thin ? 5 : 10;
                const a = active && active.i === i ? active.t : 0;
                const sinkT = active && i > active.i ? active.t : 0;
                const broken = sinkT > 0 && active && (layers[active.i].hurts ?? []).includes(i);
                const y = ys[i] + sinkT * gap * SINK;
                const rot = broken ? sinkT * (i % 2 ? -3.5 : 3) : 0;
                const top = `${CX - HW},0 ${CX},${-HH} ${CX + HW},0 ${CX},${HH}`;
                const left = `${CX - HW},0 ${CX},${HH} ${CX},${HH + t} ${CX - HW},${t}`;
                const right = `${CX + HW},0 ${CX},${HH} ${CX},${HH + t} ${CX + HW},${t}`;
                return (
                  <g
                    key={`${tech}-${i}`}
                    data-i={i}
                    className={`as-xs__plate${shown === i ? " is-out" : ""}${l.dashed ? " is-dashed" : ""}${l.thin ? " is-thin" : ""}${broken && sinkT >= 0.5 ? " is-broken" : ""}`}
                    style={{ transform: `translate(${-a * PULL}px, ${y}px) rotate(${rot}deg)`, opacity: 1 - a * 0.55 }}
                  >
                    <polygon className="as-xs__l" points={left} />
                    <polygon className="as-xs__r" points={right} />
                    <polygon className="as-xs__t" points={top} />
                    <polygon className="as-xs__hatch" points={top} />
                    <g className="as-xs__glyph" transform={`matrix(${HW} ${-HH} ${HW} ${HH} ${CX - HW} 0)`}>
                      <GlyphArt g={l.glyph} />
                    </g>
                    {l.upd && <path className="as-xs__tick" d={`M${CX - HW * 0.86} ${HH * 0.14 + t / 2} L${CX - HW * 0.5} ${HH * 0.5 + t / 2}`} />}
                    <path className="as-xs__leader" d={`M${CX + HW * 0.42} 0 H${LABEL_X - 4}`} style={{ opacity: 1 - a }} />
                    <circle className="as-xs__leader-dot" cx={CX + HW * 0.42} cy={0} r={2.4} style={{ opacity: 1 - a }} />
                  </g>
                );
              })}
            </svg>
            <ol className="as-xs__labels" aria-label={`שכבות האתר ב-${LABEL[tech]}, מלמטה למעלה. הקישו על שכבה כדי לשלוף אותה`}>
              {layers.map((l, i) => {
                return (
                  <li key={`${tech}-${l.name}`} style={{ top: `${(ys[i] / H) * 100}%` }}>
                    <button
                      type="button"
                      data-i={i}
                      className={`as-xs__label${l.upd ? " is-upd" : ""}${hurt.has(i) ? " is-hurt" : ""}`}
                      aria-pressed={shown === i}
                      onClick={onLabelClick(i)}
                    >
                      <span className="as-xs__name">{l.name}</span>
                      <span className="as-xs__tag">{shown === i ? "נשלפה מהערימה" : hurt.has(i) ? "נשארה בלי בסיס" : l.tag}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="as-xs__side">
            <MiniSite broken={current ? current.breaks : null} tech={tech} />
            <div className={`as-xs__card${current ? " is-on" : ""}`} aria-live="polite">
              {current ? (
                <>
                  <p className="as-xs__card-kicker">שלפתם: {current.name}</p>
                  <p className="as-xs__card-name">{current.broke}</p>
                  <p className="as-xs__card-body">
                    <span>מה השכבה עושה</span> {current.body}
                  </p>
                  <p className="as-xs__card-who">
                    <span>מי מטפל בזה</span> {current.who}
                    {current.upd ? (tech === "wp" ? " · מתעדכן בנפרד" : " · מתעדכן יחד, בכל בנייה") : ""}
                  </p>
                </>
              ) : (
                <>
                  <p className="as-xs__card-kicker">{LABEL[tech]}</p>
                  <p className="as-xs__card-name">גררו שכבה הצידה, או הקישו עליה, וראו מה נשבר באתר.</p>
                  <p className="as-xs__card-body">{SUMMARY[tech]}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplodedStack;
