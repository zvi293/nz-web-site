// Signature component: ההתאמה — match pairs (workbook threads, near misses)
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./match-pairs.css";

/**
 * "ההתאמה" — message match, made tangible. Three ads of one (sample) plant nursery, and six
 * landing pages the click could land on. Three of them continue an ad exactly; the other three
 * are near misses, each broken in ONE place: a generic headline, a stock photo instead of the
 * ad's picture, or a button that asks for something else. Pick an ad, then the page you would
 * send its click to: each check (כותרת · מראה · פעולה) is scored on its own, so the verdict says
 * which thread broke and what the visitor thinks at that moment.
 * Phones / tablets: the ad switch (א · ב · ג, each with its topic) is a bar that stays under the
 * header while the board is on screen; the ad on top, the six pages as a choice sheet under it.
 * A pick never scrolls the page: a verdict chip pins to the bottom of the sheet (title + the
 * three checks), right where the thumb is, and tapping it brings the full verdict (the pair as
 * mini ad — thread — mini page, the reasons) into view. The chip steps aside while the full
 * verdict is on screen. Paired pages carry the ad's letter.
 * Desktop: the workbook — ads and pages in two columns with threads drawn between them, the
 * verdict as a sticky card beside them.
 * Keyboard: every card is a button (aria-pressed); a separate sr-only line announces each
 * verdict. SSR / no JS: all ads and pages, with the answer key in text. Reduced motion: threads
 * appear without drawing; no smooth scrolling.
 */

type AdId = "deliver" | "kids" | "visit";
type Look = "leaf" | "sun" | "clay" | "stock";
type Fit = "ok" | "near" | "off";

interface Ad {
  id: AdId;
  letter: string;
  headline: string;
  body: string;
  cta: string;
  look: Look;
  /** One word for the ad switch on phones. */
  short: string;
  /** "המשלוח עד הבית" — the thing the visitor looks for. */
  what: string;
  /** "יביאו לי עציץ עד הבית" — what the visitor expected to do. */
  want: string;
}
interface Page {
  id: string;
  num: string;
  headline: string;
  sub: string;
  cta: string;
  look: Look;
  /** Which ad's promise the headline repeats (null = a generic headline). */
  says: AdId | null;
  /** Which ad's action the button asks for (null = something else). */
  does: AdId | null;
}

const ADS: Ad[] = [
  {
    id: "deliver",
    letter: "א",
    headline: "עציצים גדולים למרפסת, עד הבית",
    body: "בוחרים עציץ, ואנחנו מביאים ושותלים במקום.",
    cta: "להזמנת משלוח",
    look: "leaf",
    short: "משלוח",
    what: "המשלוח עד הבית",
    want: "יביאו לי עציץ עד הבית",
  },
  {
    id: "kids",
    letter: "ב",
    headline: "סדנת שתילה לילדים בשישי בבוקר",
    body: "שעה וחצי של אדמה וזרעים, ועציץ שלוקחים הביתה.",
    cta: "להרשמה לסדנה",
    look: "sun",
    short: "סדנה",
    what: "הסדנה לילדים",
    want: "ארשום את הילדים לסדנה",
  },
  {
    id: "visit",
    letter: "ג",
    headline: "גנן מגיע אליכם לייעוץ במרפסת",
    body: "ביקור אחד, ותוכנית שתילה שמתאימה לאור ולמקום.",
    cta: "לתיאום ביקור",
    look: "clay",
    short: "ייעוץ",
    what: "ביקור הגנן",
    want: "יבוא גנן לראות את המרפסת",
  },
];

/* Six pages, shuffled: three exact, three near misses (one broken check each). */
const PAGES: Page[] = [
  { id: "p1", num: "1", headline: "סדנת שתילה לילדים בשישי בבוקר", sub: "שעה וחצי, ועציץ הביתה.", cta: "להרשמה לסדנה", look: "stock", says: "kids", does: "kids" },
  { id: "p2", num: "2", headline: "גנן מגיע אליכם לייעוץ במרפסת", sub: "ביקור אחד ותוכנית שתילה.", cta: "לתיאום ביקור", look: "clay", says: "visit", does: "visit" },
  { id: "p3", num: "3", headline: "כל מה שצריך לגינה, במקום אחד", sub: "עציצים, אדמה, כלים ודשנים.", cta: "להזמנת משלוח", look: "leaf", says: null, does: "deliver" },
  { id: "p4", num: "4", headline: "סדנת שתילה לילדים בשישי בבוקר", sub: "אדמה, זרעים ועציץ שלוקחים הביתה.", cta: "להרשמה לסדנה", look: "sun", says: "kids", does: "kids" },
  { id: "p5", num: "5", headline: "גנן מגיע אליכם לייעוץ במרפסת", sub: "ביקור אחד ותוכנית שתילה.", cta: "להורדת הקטלוג", look: "clay", says: "visit", does: null },
  { id: "p6", num: "6", headline: "עציצים גדולים למרפסת, עד הבית", sub: "מביאים ושותלים במקום.", cta: "להזמנת משלוח", look: "leaf", says: "deliver", does: "deliver" },
];
const SOLUTION: Record<AdId, string> = { deliver: "p6", kids: "p4", visit: "p2" };

const adById = (id: AdId) => ADS.find((a) => a.id === id)!;
const pageById = (id: string) => PAGES.find((p) => p.id === id)!;

interface Check {
  name: string;
  ok: boolean;
  line: string;
}
function verdictFor(ad: Ad, page: Page) {
  const h = page.says === ad.id;
  const l = page.look === ad.look;
  const a = page.does === ad.id;
  const checks: Check[] = [
    {
      name: "כותרת",
      ok: h,
      line: h
        ? `הכותרת חוזרת על ההבטחה: "${page.headline}"`
        : page.says === null
          ? `כותרת כללית: "${page.headline}". ההבטחה מהמודעה נעלמה.`
          : `הכותרת מדברת על משהו אחר: "${page.headline}"`,
    },
    {
      name: "מראה",
      ok: l,
      line: l
        ? "אותה תמונה ואותם צבעים כמו במודעה"
        : page.look === "stock"
          ? "תמונת מאגר כללית, לא התמונה שגרמה ללחוץ"
          : "תמונה וצבעים של מודעה אחרת",
    },
    {
      name: "פעולה",
      ok: a,
      line: a ? `הכפתור מבקש בדיוק את מה שהמודעה הציעה: "${page.cta}"` : `המודעה הציעה "${ad.cta}", והכפתור כאן: "${page.cta}"`,
    },
  ];
  const score = checks.filter((c) => c.ok).length;
  const fit: Fit = score === 3 ? "ok" : score === 2 ? "near" : "off";
  const thought =
    fit === "ok"
      ? "הגעתי למקום הנכון."
      : fit === "off"
        ? "זה לא מה שלחצתי עליו."
        : !h
          ? `נראה מוכר, אבל איפה ${ad.what}?`
          : !l
            ? "רגע, זה אותו מקום? זה לא נראה כמו המודעה."
            : `חשבתי ש${ad.want}, ופה מבקשים ממני משהו אחר.`;
  const title = fit === "ok" ? "המסר ממשיך" : fit === "near" ? "כמעט. חוט אחד נקרע" : "המסר נשבר";
  return { fit, checks, thought, title, score };
}
const fitOf = (adId: AdId, pageId: string) => verdictFor(adById(adId), pageById(pageId)).fit;

interface Line {
  ad: AdId;
  d: string;
  fit: Fit;
  mx: number;
  my: number;
}

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}
const isPhoneLayout = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

/** The picture block of an ad or a page: a flat colour field with one drawn shape. */
const Swatch = ({ look, className }: { look: Look; className: string }) => (
  <span className={className} data-look={look} aria-hidden="true">
    <span className="lpm__shape" />
    {look === "stock" && <span className="lpm__shape lpm__shape--2" />}
  </span>
);

/** The thread itself, as drawn in the verdict's pair strip (phones). */
const Knot = ({ fit, x, y }: { fit: Fit; x: number; y: number }) =>
  fit === "ok" ? (
    <circle className="lpm__dot" cx={x} cy={y} r={5} />
  ) : fit === "near" ? (
    <circle className="lpm__knot" cx={x} cy={y} r={5} />
  ) : (
    <path className="lpm__cut" d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} />
  );

const MatchPairs = () => {
  const [sel, setSel] = useState<AdId>("deliver");
  const [pairs, setPairs] = useState<Partial<Record<AdId, string>>>({});
  const [last, setLast] = useState<AdId | null>(null);
  const [solved, setSolved] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [fresh, setFresh] = useState<AdId | null>(null);
  const [said, setSaid] = useState("");
  /** The full verdict is on screen (phones: the chip steps aside). */
  const [verdictSeen, setVerdictSeen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const adRefs = useRef<Partial<Record<AdId, HTMLButtonElement | null>>>({});
  const pageRefs = useRef<Partial<Record<string, HTMLButtonElement | null>>>({});
  const scrollAfter = useRef<"ad" | null>(null);

  /* Desktop threads: measured from the cards' facing edges (works in RTL and LTR). */
  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const b = board.getBoundingClientRect();
    const next: Line[] = [];
    (Object.keys(pairs) as AdId[]).forEach((adId) => {
      const pageId = pairs[adId];
      const a = adRefs.current[adId];
      const p = pageId ? pageRefs.current[pageId] : null;
      if (!a || !p || !pageId || !a.offsetParent || !p.offsetParent) return;
      const ar = a.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      const adIsRight = ar.left + ar.width / 2 > pr.left + pr.width / 2;
      const x1 = (adIsRight ? ar.left : ar.right) - b.left;
      const x2 = (adIsRight ? pr.right : pr.left) - b.left;
      const y1 = ar.top + ar.height / 2 - b.top;
      const y2 = pr.top + pr.height / 2 - b.top;
      const mx = (x1 + x2) / 2;
      next.push({ ad: adId, d: `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, fit: fitOf(adId, pageId), mx, my: (y1 + y2) / 2 });
    });
    setLines(next);
  }, [pairs]);

  useLayoutEffect(() => {
    measure();
  }, [measure, sel]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(board);
    return () => ro.disconnect();
  }, [measure]);

  /* Phones: after "next ad" the ad scrolls into view (a pick stays put: the chip answers it). */
  useEffect(() => {
    const what = scrollAfter.current;
    scrollAfter.current = null;
    if (!what || !isPhoneLayout()) return;
    adRefs.current[sel]?.scrollIntoView({ block: "start", behavior: motionOn() ? "smooth" : "instant" });
  }, [pairs, sel, solved]);

  /* The chip hides once the full verdict has risen a little into view. */
  useEffect(() => {
    const el = verdictRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVerdictSeen(e.isIntersecting), { rootMargin: "0px 0px -56px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toVerdict = () =>
    verdictRef.current?.scrollIntoView({ block: "nearest", behavior: motionOn() ? "smooth" : "instant" });

  const pick = (pageId: string) => {
    const ad = adById(sel);
    const v = verdictFor(ad, pageById(pageId));
    setPairs((prev) => ({ ...prev, [sel]: pageId }));
    setLast(sel);
    setSolved(false);
    setFresh(motionOn() ? sel : null);
    setSaid(
      `מודעה ${ad.letter} לדף ${pageById(pageId).num}: ${v.title}. ${v.checks.map((c) => `${c.name}: ${c.ok ? "נשמר" : "נשבר"}`).join(", ")}. מה הגולש חושב: ${v.thought}`,
    );
  };
  const choose = (id: AdId) => {
    setSel(id);
    if (pairs[id]) setLast(id);
  };
  const nextAd = () => {
    const next = ADS.find((a) => !pairs[a.id] && a.id !== sel) ?? ADS.find((a) => a.id !== sel && pairs[a.id] !== SOLUTION[a.id]);
    if (!next) return;
    setSel(next.id);
    setLast(pairs[next.id] ? next.id : null);
    scrollAfter.current = "ad";
    setSaid(`מודעה ${next.letter}: ${next.headline}. לאיזה דף תשלחו אותה?`);
  };
  const solve = () => {
    setPairs({ ...SOLUTION });
    setLast(null);
    setSolved(true);
    setFresh(null);
    setSaid("כל מודעה חוברה לדף שממשיך אותה: מודעה א לדף 6, מודעה ב לדף 4, מודעה ג לדף 2.");
  };
  const reset = () => {
    setPairs({});
    setLast(null);
    setSolved(false);
    setFresh(null);
    setSel("deliver");
    setSaid("הלוח התאפס.");
  };

  const correct = ADS.filter((a) => pairs[a.id] === SOLUTION[a.id]).length;
  const done = Object.keys(pairs).length;
  const allRight = correct === ADS.length;
  const lastAd = last ? adById(last) : null;
  const lastPage = last && pairs[last] ? pageById(pairs[last]!) : null;
  const v = lastAd && lastPage && !solved ? verdictFor(lastAd, lastPage) : null;
  const pageBadges = (pid: string) => ADS.filter((a) => pairs[a.id] === pid).map((a) => ({ letter: a.letter, fit: fitOf(a.id, pid) }));
  const hasNext = ADS.some((a) => a.id !== sel && (!pairs[a.id] || pairs[a.id] !== SOLUTION[a.id]));
  const selAd = adById(sel);

  return (
    <div className="lpm">
      <p className="sr-only" aria-live="polite">
        {said}
      </p>

      <div className="lpm__board" ref={boardRef}>
        <svg className="lpm__threads" aria-hidden="true" focusable="false">
          {lines.map((l) => (
            <g key={l.ad} className={`lpm__thread lpm__thread--${l.fit}`} data-fresh={fresh === l.ad ? "" : undefined}>
              <path d={l.d} pathLength={1} />
              <Knot fit={l.fit} x={l.mx} y={l.my} />
            </g>
          ))}
        </svg>

        <div className="lpm__bar">
          <div className="lpm__tabs" role="group" aria-label="בחירת מודעה">
            {ADS.map((ad) => {
              const to = pairs[ad.id];
              return (
                <button
                  key={ad.id}
                  type="button"
                  className="lpm__tab"
                  aria-pressed={sel === ad.id}
                  aria-label={`מודעה ${ad.letter}: ${ad.short}`}
                  data-fit={to ? fitOf(ad.id, to) : undefined}
                  onClick={() => choose(ad.id)}
                >
                  <span className="lpm__tabmark" aria-hidden="true">
                    {ad.letter}
                  </span>
                  {ad.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lpm__col lpm__col--ads">
          <p className="lpm__colhead lpm__colhead--ads" aria-hidden="true">
            <span className="lpm__colnum">01</span> המודעה
          </p>
          {ADS.map((ad) => {
            const to = pairs[ad.id];
            return (
              <button
                key={ad.id}
                type="button"
                ref={(el) => (adRefs.current[ad.id] = el)}
                className="lpm__ad"
                data-sel={sel === ad.id ? "" : undefined}
                data-fit={to ? fitOf(ad.id, to) : undefined}
                aria-pressed={sel === ad.id}
                aria-label={`מודעה ${ad.letter}: ${ad.headline}. הכפתור: ${ad.cta}${to ? `. מחוברת לדף ${pageById(to).num}` : ""}`}
                onClick={() => choose(ad.id)}
              >
                <span className="lpm__adtop" aria-hidden="true">
                  <span className="lpm__avatar">{ad.letter}</span>
                  <span className="lpm__adname">משתלת הגפן</span>
                  <span className="lpm__sponsored">ממומן</span>
                </span>
                <Swatch look={ad.look} className="lpm__swatch" />
                <span className="lpm__headline">{ad.headline}</span>
                <span className="lpm__body">{ad.body}</span>
                <span className="lpm__adcta" aria-hidden="true">
                  {ad.cta}
                </span>
              </button>
            );
          })}
        </div>

        <div className="lpm__col lpm__col--pages" role="group" aria-label={`הדפים. לאיזה מהם תשלחו את מודעה ${selAd.letter}?`}>
          <p className="lpm__colhead lpm__colhead--pages" aria-hidden="true">
            <span className="lpm__colnum">02</span>
            <span className="lpm__ask">
              לאן שולחים את מודעה <b>{selAd.letter}</b>?
            </span>
            <span className="lpm__askwide">הדף</span>
          </p>
          <div className="lpm__pages">
            {PAGES.map((p) => {
              const badges = pageBadges(p.id);
              const chosen = pairs[sel] === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  ref={(el) => (pageRefs.current[p.id] = el)}
                  className="lpm__page"
                  data-look={p.look}
                  data-chosen={chosen ? "" : undefined}
                  aria-pressed={chosen}
                  aria-label={`דף ${p.num}: ${p.headline}. הכפתור: ${p.cta}${p.look === "stock" ? ". תמונת מאגר" : ""}${
                    badges.length ? `. מחובר למודעה ${badges.map((x) => x.letter).join(", ")}` : ""
                  }`}
                  onClick={() => pick(p.id)}
                >
                  <span className="lpm__pnum" aria-hidden="true">
                    דף {p.num}
                  </span>
                  <Swatch look={p.look} className="lpm__pswatch" />
                  <span className="lpm__ptext">
                    <span className="lpm__ptitle">{p.headline}</span>
                    <span className="lpm__psub">{p.sub}</span>
                    <span className="lpm__pcta" aria-hidden="true">
                      {p.cta}
                    </span>
                  </span>
                  {badges.length > 0 && (
                    <span className="lpm__badges" aria-hidden="true">
                      {badges.map((x) => (
                        <span key={x.letter} className="lpm__badge" data-fit={x.fit}>
                          {x.letter}
                        </span>
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="lpm__pin" data-hide={!v || verdictSeen ? "" : undefined}>
            {v && lastAd && lastPage && (
              <button
                type="button"
                className="lpm__chip"
                data-fit={v.fit}
                tabIndex={verdictSeen ? -1 : undefined}
                aria-label={`${v.title}: מודעה ${lastAd.letter} לדף ${lastPage.num}. לפרטים`}
                onClick={toVerdict}
                key={`${lastAd.id}-${lastPage.id}`}
              >
                <span className="lpm__chiphead">
                  <span className="lpm__chipmark" aria-hidden="true" />
                  <span className="lpm__chiptitle">{v.title}</span>
                  <span className="lpm__chippair" aria-hidden="true">
                    {lastAd.letter} ← {lastPage.num}
                  </span>
                </span>
                <span className="lpm__chipchecks" aria-hidden="true">
                  {v.checks.map((c) => (
                    <span key={c.name} data-ok={c.ok ? "" : undefined}>
                      <span className="lpm__chipicon">{c.ok ? "✓" : "✕"}</span>
                      {c.name}
                    </span>
                  ))}
                  <span className="lpm__chipmore">פרטים ↓</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lpm__verdict" ref={verdictRef} data-state={v ? v.fit : allRight ? "done" : "idle"}>
        {v && lastAd && lastPage ? (
          <>
            <div className="lpm__strip" aria-hidden="true" key={`${lastAd.id}-${lastPage.id}`} data-fresh={fresh ? "" : undefined}>
              <span className="lpm__mini lpm__mini--ad">
                <span className="lpm__minihead">
                  <span className="lpm__avatar">{lastAd.letter}</span>
                  מודעה
                </span>
                <Swatch look={lastAd.look} className="lpm__miniswatch" />
                <span className="lpm__minititle">{lastAd.headline}</span>
                <span className="lpm__minicta">{lastAd.cta}</span>
              </span>
              <svg className="lpm__stripthread" viewBox="0 0 60 40" preserveAspectRatio="none" data-fit={v.fit}>
                <path d="M0 20 C 20 6, 40 34, 60 20" pathLength={1} />
                <Knot fit={v.fit} x={30} y={20} />
              </svg>
              <span className="lpm__mini lpm__mini--page" data-look={lastPage.look}>
                <span className="lpm__minihead">דף {lastPage.num}</span>
                <Swatch look={lastPage.look} className="lpm__miniswatch" />
                <span className="lpm__minititle">{lastPage.headline}</span>
                <span className="lpm__minicta lpm__minicta--page">{lastPage.cta}</span>
              </span>
            </div>
            <p className="lpm__vhead">
              <span className="lpm__vmark" aria-hidden="true" />
              <span className="lpm__vtitle">{v.title}</span>
              <span className="lpm__vpair">
                מודעה {lastAd.letter} ← דף {lastPage.num}
              </span>
            </p>
            <p className="lpm__thought">“{v.thought}”</p>
            <ul className="lpm__checks">
              {v.checks.map((c) => (
                <li key={c.name} data-ok={c.ok ? "" : undefined}>
                  <span className="lpm__cname">
                    <span className="lpm__cicon" aria-hidden="true">
                      {c.ok ? "✓" : "✕"}
                    </span>
                    {c.name}
                  </span>
                  <span className="lpm__cline">{c.line}</span>
                </li>
              ))}
            </ul>
          </>
        ) : allRight ? (
          <>
            <p className="lpm__vhead">
              <span className="lpm__vmark" aria-hidden="true" />
              <span className="lpm__vtitle">שלוש מודעות, שלושה דפים</span>
            </p>
            <p className="lpm__thought">
              דף 6, דף 4 ודף 2 ממשיכים כל אחד את המודעה שלו בשלושה מקומות: כותרת, מראה וכפתור. הדפים 3, 1 ו-5 נראים כמעט אותו דבר, ובכל
              אחד מהם חוט אחד נקרע.
            </p>
          </>
        ) : (
          <>
            <p className="lpm__vhead">
              <span className="lpm__vtitle">לאן שולחים את הקליק?</span>
            </p>
            <p className="lpm__thought">
              לכל מודעה יש דף אחד שממשיך אותה בדיוק, ודפים שנראים כמעט אותו דבר. בחרו דף, ובדקו כותרת, מראה וכפתור.
            </p>
          </>
        )}
        <div className="lpm__foot">
          <p className="lpm__score">{done === 0 ? "עוד לא חוברו מודעות" : `חוברו בדיוק: ${correct} מתוך ${ADS.length}`}</p>
          <div className="lpm__actions">
            {done > 0 && hasNext && !allRight && (
              <button type="button" className="lpm__btn lpm__btn--main" onClick={nextAd}>
                למודעה הבאה
              </button>
            )}
            {!allRight && (
              <button type="button" className="lpm__btn" onClick={solve}>
                חברו בשבילי
              </button>
            )}
            {done > 0 && (
              <button type="button" className="lpm__btn lpm__btn--quiet" onClick={reset}>
                מההתחלה
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="lpm__key">
        התשובה: מודעה א לדף 6, מודעה ב לדף 4, מודעה ג לדף 2. שלושת האחרים כמעט מתאימים: בדף 3 הכותרת כללית, בדף 1 יש תמונת מאגר
        במקום התמונה מהמודעה, ובדף 5 הכפתור מבקש להוריד קטלוג במקום לתאם ביקור.
      </p>
      <p className="lpm__note">עסק לדוגמה. המודעות והדפים הומצאו להמחשה.</p>
    </div>
  );
};

export default MatchPairs;
