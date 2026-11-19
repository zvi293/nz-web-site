// Signature component: שיחה בלחיצה — tap-flow simulation (count your own taps)
import { useEffect, useRef, useState, type ReactElement } from "react";
import "./tap-to-call.css";

/**
 * "שיחה בלחיצה" — a phone in your hand. Someone searches for a painter; you play the visitor and
 * tap your way from the search result to a phone call. Two routes, switched above the phone:
 * a landing page (result → call bar) and a regular site (result → home → menu → contact page →
 * the number in small print). Nothing is marked: almost everything on each screen is tappable
 * (the logo, "קראו עוד", every menu item, the contact form, the other results), every tap counts
 * and the narration says what it led to. A vermilion ring shows the way only after a few idle
 * seconds or a wrong tap. So the count is the visitor's own; the end line also names the
 * shortest route (two taps vs four), and after both routes the two counts stand side by side.
 * Phones: the narration sits right above the phone, the phone is capped at ~62% of the screen
 * and its "island" carries the tap count, so every tap is answered in view. Keyboard: real buttons; focus moves to the new screen; narration is aria-live.
 * SSR / no JS: the first screen + both routes stated in text. Reduced motion: no slides/pulses.
 * Sample business, sample number.
 */

type Route = "landing" | "site";
type Screen = "search" | "landing" | "home" | "menu" | "contact" | "call" | "chat";

const ROUTES: Record<Route, { label: string; shortest: number; steps: { screen: Screen; name: string }[] }> = {
  landing: {
    label: "דף נחיתה",
    shortest: 2,
    steps: [
      { screen: "search", name: "חיפוש" },
      { screen: "landing", name: "הדף" },
      { screen: "call", name: "שיחה" },
    ],
  },
  site: {
    label: "אתר רגיל",
    shortest: 4,
    steps: [
      { screen: "search", name: "חיפוש" },
      { screen: "home", name: "דף הבית" },
      { screen: "menu", name: "התפריט" },
      { screen: "contact", name: "צור קשר" },
      { screen: "call", name: "שיחה" },
    ],
  },
};

const NARRATION: Record<Screen, string> = {
  search: "דירה לצבוע לפני כניסה. מחפשים צבעי באזור, ויש כמה תוצאות. על מה לוחצים?",
  landing: "נפתח דף אחד: מה הוא עושה, איפה הוא עובד, ותמונות לפני ואחרי. מה עכשיו?",
  home: "נפתח דף הבית. כותרת כללית, טקסט על העסק, ואין מספר טלפון בעין. איפה הטלפון?",
  menu: "התפריט נפתח. שישה עמודים. באיזה מהם מחכה הטלפון?",
  contact: "עמוד צור קשר: טופס ארוך, ומתחתיו שורה קטנה. איך מדברים איתו עכשיו?",
  call: "",
  chat: "",
};

/** What a tap that does not lead to the call says (it still counts). */
const MISSES = {
  other: "זו רשימה של צבעים אחרים. כמעט הלכתם למתחרה. חוזרים לתוצאות.",
  forum: "שרשור בפורום משלוש שנים אחורה. חוזרים לתוצאות.",
  photos: "תמונות לפני ואחרי. יפה, ופס החיוג מחכה בתחתית המסך.",
  logo: "הלוגו מחזיר לדף הבית. אתם כבר כאן.",
  more: "עוד שלוש פסקאות על העסק המשפחתי. אין מספר טלפון.",
  about: "אודות: הסיפור של העסק, בלי טלפון. חוזרים לתפריט.",
  services: "שירותים: רשימה ארוכה, ובסופה \"לפרטים נוספים\". חוזרים לתפריט.",
  gallery: "גלריה: תמונות יפות, אבל הטלפון לא כאן. חוזרים לתפריט.",
  blog: "מאמרים: איך בוחרים גוון לסלון. לא מה שחיפשתם. חוזרים לתפריט.",
  faq: "שאלות נפוצות: תשובות, בלי מספר. חוזרים לתפריט.",
  form: "טופס של ארבעה שדות: ממלאים, שולחים ומחכים שיחזרו אליכם. ורציתם לדבר עכשיו.",
};

const MENU: { label: string; miss?: keyof typeof MISSES }[] = [
  { label: "אודות", miss: "about" },
  { label: "שירותים", miss: "services" },
  { label: "גלריה", miss: "gallery" },
  { label: "מאמרים", miss: "blog" },
  { label: "שאלות נפוצות", miss: "faq" },
  { label: "צור קשר" },
];

const BIZ = "אבי צבעים";
const HINT_AFTER = 4000;

function motionOn() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("nz-motion");
}
const tapsWord = (n: number) => (n === 1 ? "לחיצה" : "לחיצות");

const TapToCall = () => {
  const [route, setRoute] = useState<Route>("landing");
  const [screen, setScreen] = useState<Screen>("search");
  const [taps, setTaps] = useState(0);
  const [narr, setNarr] = useState(NARRATION.search);
  const [hint, setHint] = useState(false);
  const [best, setBest] = useState<Partial<Record<Route, number>>>({});
  const [dir, setDir] = useState<"fwd" | "none">("none");
  const [nav, setNav] = useState(0);
  const [live, setLive] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const focusScreen = useRef(false);

  const steps = ROUTES[route].steps;
  const atEnd = screen === "call" || screen === "chat";
  const stepIndex = atEnd ? steps.length - 1 : steps.findIndex((s) => s.screen === screen);

  useEffect(() => setLive(true), []);

  /* A new screen: focus it (keyboard / screen reader), hide the hint, show it after a pause. */
  useEffect(() => {
    if (focusScreen.current) {
      focusScreen.current = false;
      screenRef.current?.focus({ preventScroll: true });
    }
    setHint(false);
    if (!live || atEnd) return;
    const t = window.setTimeout(() => setHint(true), HINT_AFTER);
    return () => window.clearTimeout(t);
  }, [nav, live, atEnd]);

  const go = (to: Screen) => {
    const n = taps + 1;
    setTaps(n);
    setDir(motionOn() ? "fwd" : "none");
    setScreen(to);
    setNav((x) => x + 1);
    focusScreen.current = true;
    if (to === "call" || to === "chat") {
      setBest((b) => ({ ...b, [route]: n }));
      const shortest = ROUTES[route].shortest;
      const extra = n > shortest ? ` הדרך הקצרה כאן: ${shortest}.` : "";
      setNarr(
        route === "landing"
          ? `${to === "chat" ? "וואטסאפ נפתח עם הודעה מוכנה." : "מחייגים."} ${n} ${tapsWord(n)} מהחיפוש עד שהלקוח מדבר איתכם.${extra}`
          : `מחייגים, אחרי ${n} ${tapsWord(n)}. בכל אחת מהן הלקוח יכול היה לוותר ולחזור לתוצאות.${extra}`,
      );
    } else setNarr(NARRATION[to]);
  };
  const miss = (key: keyof typeof MISSES) => {
    setTaps((t) => t + 1);
    setNarr(MISSES[key]);
    setHint(true);
  };
  const restart = (r: Route = route) => {
    setRoute(r);
    setScreen("search");
    setTaps(0);
    setNarr(NARRATION.search);
    setDir("none");
    setNav((x) => x + 1);
    focusScreen.current = true;
  };

  const both = best.landing !== undefined && best.site !== undefined;

  /* ── screens ── */
  const Search = (
    <div className="lpt__scr lpt__scr--search">
      <div className="lpt__searchbar" aria-hidden="true">
        <span className="lpt__lens" />
        צבעי ברמת גן
      </div>
      <button type="button" className="lpt__result" data-next onClick={() => go(route === "landing" ? "landing" : "home")}>
        <span className="lpt__rkind">{route === "landing" ? "דף נחיתה · צביעת דירות" : "אתר העסק · דף הבית"}</span>
        <span className="lpt__rtitle">{route === "landing" ? `צבעי ברמת גן ובגבעתיים | ${BIZ}` : `${BIZ} | ברוכים הבאים`}</span>
        <span className="lpt__rline">
          {route === "landing"
            ? "צביעת דירות ובתים, תמונות לפני ואחרי, חיוג ישיר מהדף."
            : "ברוכים הבאים לאתר שלנו. אנחנו עסק משפחתי עם ניסיון רב בתחום..."}
        </span>
      </button>
      <button type="button" className="lpt__result lpt__result--dim" onClick={() => miss("other")}>
        <span className="lpt__rkind">מדריך בעלי מקצוע</span>
        <span className="lpt__rtitle">צבעים באזור המרכז, רשימה</span>
        <span className="lpt__rline">השוואה בין בעלי מקצוע לפי אזור.</span>
      </button>
      <button type="button" className="lpt__result lpt__result--dim" onClick={() => miss("forum")}>
        <span className="lpt__rkind">פורום</span>
        <span className="lpt__rtitle">מישהו מכיר צבעי טוב באזור?</span>
      </button>
    </div>
  );

  const Landing = (
    <div className="lpt__scr lpt__scr--landing">
      <div className="lpt__lphead" aria-hidden="true">
        <span className="lpt__logo">{BIZ}</span>
        <span className="lpt__area">רמת גן · גבעתיים · בני ברק</span>
      </div>
      <p className="lpt__lptitle" aria-hidden="true">
        צביעת דירות ובתים, נקי ובזמן
      </p>
      <button type="button" className="lpt__ba" aria-label="תמונות לפני ואחרי" onClick={() => miss("photos")}>
        <span className="lpt__before" aria-hidden="true">
          <i>לפני</i>
        </span>
        <span className="lpt__after" aria-hidden="true">
          <i>אחרי</i>
        </span>
      </button>
      <div className="lpt__chips" aria-hidden="true">
        <span>צביעת דירות</span>
        <span>תיקוני טיח</span>
        <span>שפכטל</span>
      </div>
      <div className="lpt__more" aria-hidden="true">
        <span className="lpt__morehead">איך זה עובד</span>
        <span className="lpt__how">
          <span>מתקשרים או שולחים הודעה</span>
          <span>מגיעים לראות ולתת הצעה</span>
          <span>צובעים, מנקים ומסיימים</span>
        </span>
      </div>
      <div className="lpt__callbar">
        <button type="button" className="lpt__call" data-next onClick={() => go("call")}>
          חיוג
        </button>
        <button type="button" className="lpt__wa" data-next onClick={() => go("chat")}>
          וואטסאפ
        </button>
      </div>
    </div>
  );

  const Home = (
    <div className="lpt__scr lpt__scr--home">
      <div className="lpt__sitebar">
        <button type="button" className="lpt__logo lpt__logobtn" onClick={() => miss("logo")}>
          {BIZ}
        </button>
        <button type="button" className="lpt__burger" data-next aria-label="פתיחת התפריט" onClick={() => go("menu")}>
          <i />
          <i />
          <i />
        </button>
      </div>
      <div className="lpt__homehero" aria-hidden="true">
        <span className="lpt__homeimg" />
        <span className="lpt__hometitle">ברוכים הבאים</span>
      </div>
      <div className="lpt__lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <button type="button" className="lpt__readmore" onClick={() => miss("more")}>
        קראו עוד עלינו
      </button>
    </div>
  );

  const Menu = (
    <div className="lpt__scr lpt__scr--menu">
      <div className="lpt__sitebar" aria-hidden="true">
        <span className="lpt__logo">{BIZ}</span>
        <span className="lpt__x" />
      </div>
      <ul className="lpt__menu">
        {MENU.map((m) => (
          <li key={m.label}>
            <button
              type="button"
              className="lpt__menuitem"
              data-next={m.miss ? undefined : ""}
              onClick={() => (m.miss ? miss(m.miss) : go("contact"))}
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const Contact = (
    <div className="lpt__scr lpt__scr--contact">
      <div className="lpt__sitebar" aria-hidden="true">
        <span className="lpt__logo">{BIZ}</span>
        <span className="lpt__burger lpt__burger--static">
          <i />
          <i />
          <i />
        </span>
      </div>
      <p className="lpt__ctitle" aria-hidden="true">
        צור קשר
      </p>
      <button type="button" className="lpt__cform" aria-label="טופס יצירת קשר" onClick={() => miss("form")}>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <span aria-hidden="true">שליחה</span>
      </button>
      <p className="lpt__small">
        <span aria-hidden="true">או בטלפון: </span>
        <button type="button" className="lpt__tel" data-next onClick={() => go("call")} aria-label="מספר הטלפון">
          <bdi dir="ltr">050-000-0000</bdi>
        </button>
      </p>
    </div>
  );

  const Call = (
    <div className="lpt__scr lpt__scr--call">
      <span className="lpt__rings" aria-hidden="true">
        <span className="lpt__avatar">א</span>
      </span>
      <p className="lpt__callname">{BIZ}</p>
      <p className="lpt__callstate">מחייג…</p>
      <div className="lpt__keys" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <button type="button" className="lpt__hang" onClick={() => restart()}>
        סיום ושוב מההתחלה
      </button>
    </div>
  );

  const Chat = (
    <div className="lpt__scr lpt__scr--chat">
      <div className="lpt__chathead" aria-hidden="true">
        <span className="lpt__avatar lpt__avatar--sm">א</span>
        {BIZ}
      </div>
      <div className="lpt__chatbody" aria-hidden="true">
        <span className="lpt__bubble">היי, הגעתי מהדף שלך. אשמח להצעה לצביעת דירת ארבעה חדרים ברמת גן.</span>
      </div>
      <div className="lpt__chatinput" aria-hidden="true">
        <span>הודעה מוכנה לשליחה</span>
        <i />
      </div>
      <button type="button" className="lpt__hang lpt__hang--light" onClick={() => restart()}>
        שוב מההתחלה
      </button>
    </div>
  );

  const view: Record<Screen, ReactElement> = { search: Search, landing: Landing, home: Home, menu: Menu, contact: Contact, call: Call, chat: Chat };
  const screenName = steps[Math.max(0, stepIndex)]?.name ?? "";

  return (
    <div className="lpt" data-route={route}>
      <div className="lpt__switch" role="group" aria-label="המסלול מהחיפוש לשיחה">
        {(Object.keys(ROUTES) as Route[]).map((r) => (
          <button key={r} type="button" aria-pressed={route === r} className="lpt__opt" onClick={() => route !== r && restart(r)}>
            {ROUTES[r].label}
          </button>
        ))}
      </div>

      <p className="lpt__tally">
        <span className="lpt__tallynum" key={taps}>
          {taps}
        </span>
        <span className="lpt__tallylabel">{tapsWord(taps)}</span>
      </p>

      <p className="lpt__narr" aria-live="polite" data-end={atEnd ? "" : undefined}>
        {narr}
      </p>

      <div className="lpt__phone">
        {/* phones: the island carries the count, so it is in view whenever the phone is */}
        <span className="lpt__notch" aria-hidden="true">
          <span className="lpt__island" key={taps}>
            {taps} {tapsWord(taps)}
          </span>
        </span>
        <div
          className="lpt__screen"
          key={`${route}-${screen}`}
          ref={screenRef}
          tabIndex={-1}
          data-dir={dir}
          data-hint={hint ? "" : undefined}
          role="group"
          aria-label={`מסך הטלפון: ${screenName}`}
        >
          {view[screen]}
        </div>
      </div>

      <ol className="lpt__steps" aria-label={`המסלול הקצר: ${ROUTES[route].label}`}>
        {steps.map((s, i) => (
          <li key={s.name} data-state={i < stepIndex ? "done" : i === stepIndex ? "now" : "next"} aria-current={i === stepIndex ? "step" : undefined}>
            <span className="lpt__sdot" aria-hidden="true" />
            {s.name}
          </li>
        ))}
      </ol>

      {both ? (
        <p className="lpt__compare">
          <span>
            <b>{best.landing}</b> לחיצות בדף נחיתה
          </span>
          <span>
            <b>{best.site}</b> לחיצות באתר רגיל
          </span>
        </p>
      ) : atEnd ? (
        <button type="button" className="lpt__other" onClick={() => restart(route === "landing" ? "site" : "landing")}>
          {route === "landing" ? "ועכשיו אותו דבר באתר רגיל" : "ועכשיו בדף נחיתה"}
        </button>
      ) : null}

      <p className="lpt__key">
        בדף נחיתה: מהתוצאה בחיפוש לדף, ומשם לפס החיוג או לוואטסאפ. שתי לחיצות. באתר רגיל: מהתוצאה לדף הבית, לתפריט, לעמוד
        צור קשר, ורק שם למספר בשורה הקטנה. ארבע לחיצות לפחות, ובכל אחת מהן אפשר לוותר.
      </p>
      <p className="lpt__fine">עסק לדוגמה ומספר לדוגמה. הלחיצות כאן לא מחייגות לשום מקום.</p>
    </div>
  );
};

export default TapToCall;
