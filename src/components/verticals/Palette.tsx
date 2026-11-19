// Signature component: פלטת הגוונים — re-theme picker (a mini beauty site re-themes live)
import { useState } from "react";
import { cn } from "@/lib/utils";
import "./palette.css";

/**
 * "פלטת הגוונים" (beauty page). A compact of six colour pans (native radios: tap / arrows) and a
 * small beauty-studio site beside it. Picking a pan re-themes the site live: ground, ink, the
 * booking button, the type (serif / sans), the corner radius and the gallery shapes.
 * Under it, the check we always run: real WCAG contrast ratios computed from the colours. If the
 * button's white text fails AA on a light shade, the button switches to dark text by itself, and
 * the readout says so — the mint pan is there to show that.
 * SSR / no JS: the first palette applied, every pan listed with its name.
 */
type Pal = { id: string; name: string; bg: string; ink: string; accent: string; serif: boolean; radius: number; shape: string };

const PALS: Pal[] = [
  { id: "powder", name: "ורוד אבקה", bg: "#F6E9E6", ink: "#3B2A2E", accent: "#A84B62", serif: true, radius: 22, shape: "#E7C3C6" },
  { id: "terra", name: "טרקוטה", bg: "#F3E7DA", ink: "#3A2418", accent: "#A64B2A", serif: false, radius: 4, shape: "#D9A47E" },
  { id: "olive", name: "זית ושמנת", bg: "#F1EFE4", ink: "#2E3326", accent: "#5E6B3C", serif: true, radius: 12, shape: "#C9CBA8" },
  { id: "noir", name: "שחור וזהב", bg: "#161412", ink: "#F2EBDD", accent: "#C9A45C", serif: true, radius: 0, shape: "#4A3F2C" },
  { id: "lilac", name: "לילך", bg: "#EEEAF3", ink: "#2D2638", accent: "#6B4F8F", serif: false, radius: 999, shape: "#CFC3DF" },
  { id: "mint", name: "מנטה", bg: "#EEF6F2", ink: "#1F3A33", accent: "#7FCDB8", serif: false, radius: 16, shape: "#BFE5DA" },
];

/* WCAG 2.x relative luminance + contrast ratio */
const lum = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const fmt = (r: number) => `${r.toFixed(1)}:1`;

const Palette = () => {
  const [id, setId] = useState(PALS[0].id);
  const [say, setSay] = useState("");
  const p = PALS.find((x) => x.id === id)!;

  const whiteOk = ratio("#FFFFFF", p.accent) >= 4.5;
  const darkBtn = !whiteOk;
  const btnInk = darkBtn ? (lum(p.ink) < 0.2 ? p.ink : "#161412") : "#FFFFFF";
  const btnRatio = ratio(btnInk, p.accent);
  const textRatio = ratio(p.ink, p.bg);

  const pick = (next: Pal) => {
    setId(next.id);
    const w = ratio("#FFFFFF", next.accent) >= 4.5;
    setSay(
      `הגוון ${next.name}. ניגודיות הטקסט ${fmt(ratio(next.ink, next.bg))}.` +
        (w ? " הכפתור קריא, עובר AA." : " טקסט לבן על הכפתור לא עובר AA, אז הכפתור עבר לטקסט כהה."),
    );
  };

  const style = {
    ["--t-bg" as string]: p.bg,
    ["--t-ink" as string]: p.ink,
    ["--t-accent" as string]: p.accent,
    ["--t-btn" as string]: btnInk,
    ["--t-radius" as string]: `${p.radius}px`,
    ["--t-shape" as string]: p.shape,
    ["--t-font" as string]: p.serif ? "var(--font-display)" : "var(--font-sans)",
  };

  return (
    <div className="vl-pl">
      <fieldset className="vl-pl__compact">
        <legend className="vl-pl__legend">שישה גוונים</legend>
        <div className="vl-pl__pans">
          {PALS.map((x) => (
            <label key={x.id} className={cn("vl-pl__pan", x.id === id && "is-on")}>
              <input type="radio" name="vl-pl" value={x.id} checked={x.id === id} onChange={() => pick(x)} className="vl-pl__radio" />
              <span className="vl-pl__well" style={{ ["--w-bg" as string]: x.bg, ["--w-accent" as string]: x.accent, ["--w-ink" as string]: x.ink }} aria-hidden="true">
                <span className="vl-pl__cake" />
              </span>
              <span className="vl-pl__name">{x.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="vl-pl__show">
        <div className="vl-pl__site" style={style} aria-hidden="true">
          <div className="vl-pl__bar">
            <span className="vl-pl__logo">סטודיו נוגה</span>
            <span className="vl-pl__menu">
              <span>טיפולים</span>
              <span>גלריה</span>
              <span>שעות</span>
            </span>
          </div>
          <div className="vl-pl__hero">
            <div className="vl-pl__copy">
              <span className="vl-pl__kicker">ציפורניים · גבות · טיפולי פנים</span>
              <span className="vl-pl__h">יופי שקט, בתור שנקבע לבד</span>
              <span className="vl-pl__btn">לקביעת תור</span>
            </div>
            <div className="vl-pl__gallery">
              <i className="vl-pl__shape vl-pl__shape--arch" />
              <i className="vl-pl__shape vl-pl__shape--dot" />
              <i className="vl-pl__shape vl-pl__shape--pill" />
            </div>
          </div>
          <ul className="vl-pl__list">
            <li>
              <span>לק ג׳ל</span>
              <span>כשעה</span>
            </li>
            <li>
              <span>עיצוב גבות</span>
              <span>חצי שעה</span>
            </li>
            <li>
              <span>טיפול פנים</span>
              <span>שעה וחצי</span>
            </li>
          </ul>
        </div>

        <dl className="vl-pl__check">
          <div>
            <dt>טקסט על הרקע</dt>
            <dd>
              <bdi dir="ltr">{fmt(textRatio)}</bdi>
              <span className="vl-pl__pass">{textRatio >= 4.5 ? "עובר AA" : "לא עובר"}</span>
            </dd>
          </div>
          <div>
            <dt>טקסט על הכפתור</dt>
            <dd>
              <bdi dir="ltr">{fmt(btnRatio)}</bdi>
              <span className={cn("vl-pl__pass", darkBtn && "is-fixed")}>{darkBtn ? "תוקן: טקסט כהה" : "עובר AA"}</span>
            </dd>
          </div>
        </dl>
        <p className="vl-pl__say" aria-live="polite">
          {say || `הגוון ${p.name}. כל גוון נבדק: הטקסט והכפתור חייבים להישאר קריאים.`}
        </p>
      </div>
    </div>
  );
};

export default Palette;
