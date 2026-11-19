// Signature component: המספריים — cut along the dashed line (split one page into many)
import { useRef, useState, type PointerEvent as RPointerEvent, type KeyboardEvent as RKeyboardEvent } from "react";
import "./ServiceScissors.css";

/**
 * "The scissors" (business-website-guide). A sample law office crammed three services into one
 * "השירותים שלנו" page. Between the services run dashed cut lines with a pair of scissors on
 * each. Drag the scissors along the line (sideways; touch-action pan-y keeps vertical scrolling),
 * or tap / press Enter on it, and the paper is cut: that service becomes a page of its own, with
 * its own title, address and call to action. Beside the paper, three real-sounding searches show
 * which page answers each one: the general page ("the answer is buried in the middle") until
 * the service has its own page ("answers exactly"). aria-live narrates each cut; "הדביקו
 * בחזרה" restores the single page. No JS: the three searches are listed with the dedicated pages.
 */

interface Service {
  name: string;
  path: string;
  text: string;
  query: string;
}

const SERVICES: Service[] = [
  { name: "דיני משפחה", path: "/dinei-mishpacha/", text: "גירושין, הסכמי ממון ומשמורת. ליווי מהשיחה הראשונה ועד הסכם חתום.", query: "עורך דין דיני משפחה בחיפה" },
  { name: "מקרקעין", path: "/mekarkein/", text: "קנייה ומכירה של דירה, בדיקת חוזה ורישום הזכויות.", query: "עורך דין מקרקעין בחיפה" },
  { name: "צוואות וירושות", path: "/tzavaot/", text: "עריכת צוואה, צו ירושה וייפוי כוח מתמשך.", query: "עורך דין צוואות בחיפה" },
];

const Scissors = () => (
  <svg viewBox="0 0 32 20" aria-hidden="true" className="as-sx__glyph">
    <circle cx="5.5" cy="5" r="3.6" />
    <circle cx="5.5" cy="15" r="3.6" />
    <path d="M8.6 6.6 L30 15.5 M8.6 13.4 L30 4.5" />
  </svg>
);

const ServiceScissors = () => {
  const [cuts, setCuts] = useState<boolean[]>([false, false]);
  const [drag, setDrag] = useState<{ i: number; p: number } | null>(null);
  const [anim, setAnim] = useState<number | null>(null);
  const [say, setSay] = useState("");
  const dragRef = useRef<{ i: number; start: number; w: number; id: number } | null>(null);

  /* pieces of paper: split the service list at every cut */
  const pieces: number[][] = [];
  SERVICES.forEach((_, i) => {
    if (i === 0 || cuts[i - 1]) pieces.push([i]);
    else pieces[pieces.length - 1].push(i);
  });
  const own = (i: number) => pieces.some((p) => p.length === 1 && p[0] === i);
  const allCut = cuts.every(Boolean);

  const commit = (i: number) => {
    setCuts((c) => {
      const next = [...c];
      next[i] = true;
      return next;
    });
    setDrag(null);
    setAnim(null);
    const a = SERVICES[i];
    const b = SERVICES[i + 1];
    setSay(`נגזר: ${a.name} ו${b.name} כבר לא על אותו דף. בדקו את החיפושים.`);
  };

  const cutByTap = (i: number) => {
    if (cuts[i] || anim !== null) return;
    const html = document.documentElement;
    if (!html.classList.contains("nz-motion")) return commit(i);
    setAnim(i);
    window.setTimeout(() => commit(i), 650);
  };

  const onDown = (i: number, e: RPointerEvent<HTMLButtonElement>) => {
    if (cuts[i]) return;
    const r = e.currentTarget.getBoundingClientRect();
    dragRef.current = { i, start: r.right, w: r.width, id: e.pointerId };
  };
  const onMove = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const p = Math.max(0, Math.min(1, (d.start - e.clientX) / d.w)); // RTL: from the right edge
    if (p > 0.04) {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
      setDrag({ i: d.i, p });
    }
  };
  const onUp = (e: RPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || !drag) return;
    e.preventDefault();
    if (drag.p > 0.6) commit(d.i);
    else setDrag(null);
  };
  const onClick = (i: number) => {
    if (drag) return; // a drag already handled it
    cutByTap(i);
  };
  const onKey = (i: number, e: RKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      cutByTap(i);
    }
  };

  const reset = () => {
    setCuts([false, false]);
    setSay("הדף חזר להיות עמוד שירותים אחד.");
  };

  const progress = (i: number) => (cuts[i] ? 1 : drag?.i === i ? drag.p : anim === i ? 1 : 0);

  return (
    <div className={`as-sx${allCut ? " is-done" : ""}`}>
      <ul className="as-static">
        {SERVICES.map((s) => (
          <li key={s.name}>
            <p className="as-static__q">"{s.query}"</p>
            <p className="as-static__a">
              <strong>עם עמוד נפרד:</strong> העמוד "{s.name}" עונה בדיוק על החיפוש. <strong>בלי:</strong> עמוד שירותים כללי, והתשובה קבורה באמצע.
            </p>
          </li>
        ))}
      </ul>

      <div className="as-sx__live as-live">
        <div className="as-sx__desk">
          {pieces.map((piece, k) => {
            const single = piece.length === 1 && (pieces.length > 1 || SERVICES.length === 1);
            const s0 = SERVICES[piece[0]];
            return (
              <article key={piece.join("-")} className={`as-sx__sheet${single ? " is-own" : ""} as-sx__sheet--${k}`}>
                <p className="as-sx__addr" dir="ltr">
                  {single ? s0.path : "/services/"}
                </p>
                <p className="as-sx__page-title">{single ? s0.name : "השירותים שלנו"}</p>
                {piece.map((i, j) => (
                  <div key={i} className="as-sx__part">
                    {!single && <p className="as-sx__h">{SERVICES[i].name}</p>}
                    <p className="as-sx__p">{SERVICES[i].text}</p>
                    {single && <span className="as-sx__cta">לתיאום פגישה</span>}
                    {j < piece.length - 1 && (
                      <button
                        type="button"
                        className={`as-sx__cut${drag?.i === i ? " is-dragging" : ""}${anim === i ? " is-cutting" : ""}`}
                        style={{ ["--p" as string]: progress(i) }}
                        aria-label={`גזרו בין ${SERVICES[i].name} ל${SERVICES[i + 1].name}`}
                        onPointerDown={(e) => onDown(i, e)}
                        onPointerMove={onMove}
                        onPointerUp={onUp}
                        onPointerCancel={() => {
                          dragRef.current = null;
                          setDrag(null);
                        }}
                        onClick={() => onClick(i)}
                        onKeyDown={(e) => onKey(i, e)}
                      >
                        <span className="as-sx__dash" aria-hidden="true" />
                        <span className="as-sx__tool" aria-hidden="true">
                          <Scissors />
                        </span>
                        <span className="as-sx__cut-hint" aria-hidden="true">
                          גזרו כאן
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </article>
            );
          })}
        </div>

        <div className="as-sx__search">
          <p className="as-sx__search-label">מה מוצאים בגוגל</p>
          <ol className="as-sx__results">
            {SERVICES.map((s, i) => {
              const hit = own(i);
              return (
                <li key={s.name} className={`as-sx__result${hit ? " is-hit" : ""}`}>
                  <p className="as-sx__q">
                    <span className="as-sx__lens" aria-hidden="true" />
                    {s.query}
                  </p>
                  <p className="as-sx__r-title">{hit ? `${s.name} בחיפה | משרד לדוגמה` : "השירותים שלנו | משרד לדוגמה"}</p>
                  <p className="as-sx__r-note">{hit ? "עמוד שעונה בדיוק על החיפוש." : "עמוד כללי: התשובה קבורה באמצע."}</p>
                </li>
              );
            })}
          </ol>
          <p className={`as-sx__lesson${allCut ? " is-on" : ""}`}>
            {allCut
              ? "שלושה עמודים, שלוש תשובות. גוגל יכול לדרג כל עמוד על השירות שלו, והלקוח נוחת ישר במה שחיפש."
              : "עמוד אחד לשלושה שירותים עונה על שלושה חיפושים שונים באותה תשובה כללית. גזרו אותו."}
          </p>
          {cuts.some(Boolean) && (
            <button type="button" className="as-btn as-btn--quiet" onClick={reset}>
              הדביקו בחזרה
            </button>
          )}
        </div>
        <p className="nz-sr" aria-live="polite">
          {say}
        </p>
      </div>
    </div>
  );
};

export default ServiceScissors;
