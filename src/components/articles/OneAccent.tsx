// Signature component: צבע אחד — give the single accent away (tap the one thing that may shout)
import { useState, type ReactNode } from "react";
import "./OneAccent.css";

/**
 * "One colour" (uiux-trends-2026). A small homepage of a sample ceramics studio starts in the
 * "everything shouts" state: every element is vermilion, bold, boxed. The page has exactly one
 * accent to give away: tap any element (logo, menu link, a "חדש!" sticker, the key word of the
 * headline, the picture frame, the main button, the secondary link) and it alone keeps the
 * colour while everything else falls quiet; a small vermilion "1" marks where the eye now lands
 * first, and a verdict says whether that is a good place for it. The button is the best answer,
 * the key word a fair one, the rest steal the eye. Elements are aria-pressed buttons in a group;
 * aria-live verdict. No JS: the quiet version with the accent on the button, and the reasoning.
 */

type Key = "logo" | "nav" | "badge" | "word" | "frame" | "cta" | "link";

const VERDICT: Record<Key, { grade: "best" | "ok" | "bad"; title: string; body: string }> = {
  cta: { grade: "best", title: "בדיוק כאן", body: "הצבע מסמן את הפעולה שאתם רוצים שהגולש יעשה. כל השאר שקט, והעין יודעת לאן ללכת." },
  word: { grade: "ok", title: "גם עובד", body: "מילה אחת לזכור בכותרת. רק שימו לב שהכפתור עדיין צריך להיראות כמו הפעולה הראשית." },
  logo: { grade: "bad", title: "הצבע הלך לאיבוד", body: "הלוגו כבר מוכר למי שנכנס. צבע עליו לא מקדם אף פעולה." },
  nav: { grade: "bad", title: "העין בורחת לתפריט", body: "קישור משני בולט יותר מהפעולה הראשית, והגולש יוצא לסיבוב במקום להירשם." },
  badge: { grade: "bad", title: "קישוט גונב את העין", body: "מדבקה שלא אומרת כלום מקבלת את המבט הראשון. זה בדיוק מה שהופך עמוד לעמוס." },
  frame: { grade: "bad", title: "המסגרת מתחרה בתמונה", body: "צבע על המסגרת מושך את העין לקו, לא לעבודה שבתוכה." },
  link: { grade: "bad", title: "הקישור המשני ניצח", body: "עכשיו \"עוד על הסטודיו\" חזק מכפתור ההרשמה. הסדר התהפך." },
};

const OneAccent = () => {
  const [pick, setPick] = useState<Key | null>(null);
  const loud = pick === null;
  const v = pick ? VERDICT[pick] : null;

  const el = (k: Key, label: string, cls: string, children: ReactNode) => (
    <button
      type="button"
      className={`as-oa__el as-oa__el--${k} ${cls}${pick === k ? " is-accent" : ""}`}
      aria-pressed={pick === k}
      aria-label={label}
      onClick={() => setPick(k)}
    >
      {children}
      {pick === k && (
        <span className="as-oa__eye" aria-hidden="true">
          1
        </span>
      )}
    </button>
  );

  return (
    <div className={`as-oa${loud ? " is-loud" : " is-calm"}`}>
      <p className="as-static">
        כשהכול בולט, שום דבר לא בולט. בעמוד הזה צבע ההדגשה שמור לכפתור "להרשמה לסדנה" בלבד: הוא הפעולה שהעמוד רוצה
        שתעשו. לוגו, תפריט, מדבקות ומסגרות נשארים שקטים.
      </p>
      <div className="as-oa__live as-live">
        <div className="as-oa__page" role="group" aria-label="עמוד לדוגמה: בחרו את האלמנט שיקבל את הצבע">
          <div className="as-oa__top">
            {el("logo", "הלוגו", "", <span className="as-oa__logo">חומר</span>)}
            {el("nav", "קישור בתפריט: סדנאות", "", <span>סדנאות</span>)}
          </div>
          <div className="as-oa__hero">
            <div className="as-oa__text">
              {el("badge", "מדבקת חדש", "", <span className="as-oa__pill">חדש!</span>)}
              <p className="as-oa__h">
                סדנאות קרמיקה בערב,{" "}
                {el("word", "המילה המרכזית בכותרת: למתחילים", "", <span>למתחילים</span>)}
              </p>
              <p className="as-oa__p">שלוש שעות על האובניים, עם כל החומרים, בקבוצה קטנה.</p>
              <div className="as-oa__actions">
                {el("cta", "הכפתור הראשי: להרשמה לסדנה", "", <span>להרשמה לסדנה</span>)}
                {el("link", "קישור משני: עוד על הסטודיו", "", <span>עוד על הסטודיו</span>)}
              </div>
            </div>
            {el(
              "frame",
              "מסגרת התמונה",
              "",
              <svg viewBox="0 0 120 120" className="as-oa__bowl" aria-hidden="true">
                <ellipse cx="60" cy="54" rx="40" ry="10" />
                <path d="M20 54 C22 86 44 98 60 98 S98 86 100 54" />
                <path d="M50 98 L48 106 L72 106 L70 98" />
              </svg>,
            )}
          </div>
        </div>

        <div className={`as-oa__verdict${v ? ` is-${v.grade}` : ""}`} aria-live="polite">
          {v ? (
            <>
              <p className="as-oa__grade">{v.grade === "best" ? "הבחירה הנכונה" : v.grade === "ok" ? "בחירה סבירה" : "לא כאן"}</p>
              <p className="as-oa__v-title">{v.title}</p>
              <p className="as-oa__v-body">{v.body}</p>
            </>
          ) : (
            <>
              <p className="as-oa__grade">הכול בולט</p>
              <p className="as-oa__v-title">ושום דבר לא בולט</p>
              <p className="as-oa__v-body">לעמוד הזה יש צבע הדגשה אחד לתת. הקישו על האלמנט היחיד שמגיע לו, וכל השאר ישתתקו.</p>
            </>
          )}
          {pick && (
            <button type="button" className="as-btn as-btn--quiet" onClick={() => setPick(null)}>
              בחזרה ל"הכול בולט"
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneAccent;
