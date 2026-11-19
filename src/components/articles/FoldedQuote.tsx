// Signature component: ההצעה המקופלת — unfold a concertina (zigzag paper folds)
import { useState } from "react";
import "./FoldedQuote.css";

/**
 * "The folded quote" (website-cost-2026). Two sample quotes carry the very same cover line
 * ("אתר תדמית לעסק"), so they look comparable. The paper under the covers is folded like a
 * concertina: eight folds, one per factor from the article (pages, how it is built, design,
 * content, systems, accessibility/SEO/speed, after launch, domain). Tap a fold to open it (the
 * strip swings flat from its crease) and the two quotes are read side by side on that factor;
 * a vermilion "לא כתוב" stamp marks what one of them leaves out. "פתחו את כל הקפלים" opens them
 * in a cascade. Never a number or a price: the point is that two quotes are comparable only
 * scope against scope. Folds are buttons with aria-expanded; a live counter.
 * A fold marked with a vermilion square hides a gap (legend under the intro); when a quote simply
 * does not say something, its cell is two blank ruled lines under the stamp (the words stay for
 * screen readers). The chevron points down, and up once the fold is open.
 * No JS: the whole sheet is open (every row visible).
 */

interface Fold {
  title: string;
  a: string;
  b: string;
  /** which side leaves it out / is a risk */
  flag?: "a-missing" | "a-risk";
}

/** A quote that does not mention the factor at all: shown as blank ruled lines + the stamp. */
const BLANK = "לא כתוב";

const FOLDS: Fold[] = [
  { title: "כמה עמודים", a: "עמוד בית ועמוד שירותים אחד", b: "עמוד בית, עמוד לכל שירות, אודות ושאלות נפוצות" },
  { title: "על מה זה בנוי", a: "תבנית מוכנה עם תוספים", b: "קוד שנכתב במיוחד לעסק" },
  { title: "עיצוב", a: "התאמה של צבעים ולוגו לתבנית", b: "עיצוב שנבנה למותג" },
  { title: "מי כותב את התוכן", a: "לא כתוב", b: "ניסוח הטקסטים לפי מה שסוכם", flag: "a-missing" },
  { title: "מערכות", a: "טופס יצירת קשר", b: "טופס ומערכת לקביעת תורים" },
  { title: "נגישות, SEO ומהירות", a: "לא כתוב", b: "בנייה לפי ת״י 5568, נתונים מובנים ובדיקת מהירות", flag: "a-missing" },
  { title: "אחרי ההשקה", a: "לא כתוב מי מאחסן ומי מעדכן", b: "אחסון, עדכונים ושינויים במנוי חודשי אופציונלי", flag: "a-missing" },
  { title: "על שם מי הדומיין", a: "על שם הספק", b: "על שם העסק", flag: "a-risk" },
];

const FoldedQuote = () => {
  const [open, setOpen] = useState<boolean[]>(() => FOLDS.map(() => false));
  const n = open.filter(Boolean).length;
  const all = n === FOLDS.length;

  const toggle = (i: number) => setOpen((o) => o.map((v, k) => (k === i ? !v : v)));

  const cascade = () => {
    const target = !all;
    const motion = document.documentElement.classList.contains("nz-motion");
    FOLDS.forEach((_, i) => {
      const run = () => setOpen((o) => o.map((v, k) => (k === i ? target : v)));
      if (motion) window.setTimeout(run, (target ? i : FOLDS.length - 1 - i) * 90);
      else run();
    });
  };

  return (
    <div className={`as-fq${all ? " is-open" : ""}`}>
      <div className="as-fq__covers" aria-hidden="true">
        {["א׳", "ב׳"].map((l) => (
          <div key={l} className="as-fq__cover">
            <span className="as-fq__cover-l">הצעה {l}</span>
            <span className="as-fq__cover-t">אתר תדמית לעסק</span>
            <span className="as-fq__cover-s">עיצוב, פיתוח והשקה</span>
          </div>
        ))}
      </div>
      <p className="as-fq__intro">מבחוץ שתי ההצעות נראות אותו דבר. מה שקובע נמצא בתוך הקפלים.</p>
      <p className="as-fq__legend">
        <span className="as-fq__legend-dot" aria-hidden="true" />
        בקפל מסומן, באחת ההצעות משהו חסר או שכדאי לבדוק אותו
      </p>

      <ol className="as-fq__sheet">
        {FOLDS.map((f, i) => (
          <li key={f.title} className={`as-fq__fold${open[i] ? " is-open" : ""} as-fq__fold--${i % 2 ? "even" : "odd"}`}>
            <button
              type="button"
              className="as-fq__crease as-live"
              aria-expanded={open[i]}
              aria-controls={`as-fq-p${i}`}
              onClick={() => toggle(i)}
            >
              <span className="as-fq__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="as-fq__title">{f.title}</span>
              <span className="as-fq__flag-dot" aria-hidden="true" data-on={f.flag ? "1" : undefined} />
              <span className="as-fq__chev" aria-hidden="true" />
            </button>
            <p className="as-fq__static-title">{f.title}</p>
            <div className="as-fq__panel" id={`as-fq-p${i}`}>
              <div className="as-fq__inner">
                <dl className="as-fq__cols">
                  <div className={`as-fq__col${f.flag ? ` is-${f.flag}` : ""}`}>
                    <dt>הצעה א׳</dt>
                    {f.a === BLANK ? (
                      <dd className="as-fq__blank">
                        <span className="nz-sr">{BLANK}</span>
                      </dd>
                    ) : (
                      <dd>{f.a}</dd>
                    )}
                    {f.flag === "a-missing" && <span className="as-fq__stamp">לא כתוב</span>}
                    {f.flag === "a-risk" && <span className="as-fq__stamp">כדאי לבדוק</span>}
                  </div>
                  <div className="as-fq__col">
                    <dt>הצעה ב׳</dt>
                    <dd>{f.b}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="as-fq__foot as-live">
        <button type="button" className="as-btn as-btn--primary" onClick={cascade}>
          {all ? "קפלו בחזרה" : "פתחו את כל הקפלים"}
        </button>
        <p className="as-fq__count" aria-live="polite">
          נפתחו {n} מתוך {FOLDS.length}
        </p>
      </div>
      <p className={`as-fq__lesson${all ? " is-on" : ""}`}>
        {all
          ? "שתי ההצעות לא מתארות את אותו אתר. לכן משווים היקף מול היקף, שורה מול שורה, ורק אחר כך את המספר בתחתית."
          : "כל קפל הוא גורם שמשנה את היקף העבודה. פתחו אותם, וראו מה כל הצעה באמת כוללת."}
      </p>
    </div>
  );
};

export default FoldedQuote;
