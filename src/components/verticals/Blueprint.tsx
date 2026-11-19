// Signature component: מהשרטוט לבניין — tracing-paper overlays (flip translucent sheets down onto a drawing, in any order)
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import "./blueprint.css";

/**
 * "מהשרטוט לבניין" (architect page). A drafting board holds the empty frame of a portfolio site.
 * Five sheets of tracing paper are taped above it, each carrying ONE layer of the site: the grid
 * (structure), the walls (the page's spaces), the dimensions (ratios and spacing), the materials
 * (type, names, captions) and the light (photographs and the one action colour). Tap a sheet's tab
 * and it swings down on its tape hinge onto the drawing (rotateX, transform-origin top) and its
 * lines draw in; tap again and it lifts away. Sheets combine in any order, like real overlays; with
 * all five down the drawing becomes the finished site. Tabs are toggle buttons (aria-pressed),
 * aria-live says what each layer adds. SSR / no JS: every sheet down (the finished building) and
 * every layer described. With JS, before hydration CSS already shows the start (grid only).
 * Reduced motion: sheets fade instead of swinging, lines appear drawn.
 */
const LAYERS = [
  { name: "רשת", line: "המבנה: עמוד בית, פרויקטים, משרד וקשר, על רשת עמודות אחת." },
  { name: "קירות", line: "החללים של העמוד: תפריט שקט, תמונה גדולה ורשת פרויקטים." },
  { name: "מידות", line: "יחס קבוע לתמונות ומרווחים שווים, מהנייד ועד מסך רחב." },
  { name: "חומרים", line: "כותרות, שם לכל פרויקט וסיפור קצר שמסביר אותו." },
  { name: "אור", line: "צילום גדול שנטען מהר, וצבע אחד שמוביל לפנייה." },
];
const N = LAYERS.length;
const pad = (i: number) => String(i + 1).padStart(2, "0");
const ALL = Array(N).fill(true) as boolean[];

/** A drawn line (pathLength 1 → draws in when its sheet lands). */
const L = ({ d, k = 0, cls }: { d: string; k?: number; cls?: string }) => (
  <path d={d} pathLength={1} className={cn("vl-bp__ln", cls)} style={{ ["--k" as string]: k }} />
);

const Layer = ({ k }: { k: number }) => (
  <svg className="vl-bp__svg" viewBox="0 0 400 320" aria-hidden="true" focusable="false">
    {k === 0 && (
      <g className="vl-bp__grid">
        {Array.from({ length: 11 }, (_, i) => (
          <L key={`v${i}`} k={i * 0.05} d={`M${i * 40} 0V320`} cls="vl-bp__ln--grid" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <L key={`h${i}`} k={i * 0.05} d={`M0 ${i * 40}H400`} cls="vl-bp__ln--grid" />
        ))}
        <L k={0.5} d="M200 0V320" cls="vl-bp__ln--axis" />
        <L k={0.6} d="M0 160H400" cls="vl-bp__ln--axis" />
      </g>
    )}
    {k === 1 && (
      <g className="vl-bp__walls">
        <L k={0} d="M20 16H380V304H20Z" />
        <L k={0.15} d="M20 44H380" />
        <L k={0.3} d="M20 56H236V174H20Z" />
        <L k={0.45} d="M20 190H132V252H20ZM144 190H256V252H144ZM268 190H380V252H268Z" />
        <L k={0.6} d="M20 272H380" />
        <L k={0.7} d="M300 282H372a8 8 0 0 1 0 16H308a8 8 0 0 1 0-16Z" />
        <L k={0.8} d="M336 24h32v12h-32Z" />
      </g>
    )}
    {k === 2 && (
      <g className="vl-bp__dims">
        <L k={0} d="M20 8H148M252 8H380M20 4v8M380 4v8" cls="vl-bp__ln--dim" />
        <L k={0.2} d="M244 56V174M240 56h8M240 174h8" cls="vl-bp__ln--dim" />
        <L k={0.4} d="M132 182H144M132 178v8M144 178v8M256 182H268M256 178v8M268 178v8" cls="vl-bp__ln--dim" />
        <L k={0.6} d="M12 190V252M8 190h8M8 252h8" cls="vl-bp__ln--dim" />
        <text x="200" y="11" className="vl-bp__note" textAnchor="middle">רוחב מלא</text>
        <text x="250" y="120" className="vl-bp__note" textAnchor="start" transform="rotate(90 250 120)">3:2</text>
        <text x="138" y="292" className="vl-bp__note" textAnchor="middle">מרווח קבוע</text>
      </g>
    )}
    {k === 3 && (
      <g className="vl-bp__mat">
        <defs>
          <pattern id="vl-bp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" className="vl-bp__hatch-line" />
          </pattern>
        </defs>
        <rect x="20" y="190" width="112" height="62" fill="url(#vl-bp-hatch)" className="vl-bp__hatch" />
        <rect x="144" y="190" width="112" height="62" fill="url(#vl-bp-hatch)" className="vl-bp__hatch" />
        <rect x="268" y="190" width="112" height="62" fill="url(#vl-bp-hatch)" className="vl-bp__hatch" />
        <L k={0} d="M380 72H258" cls="vl-bp__ln--type" />
        <L k={0.15} d="M380 88H282" cls="vl-bp__ln--type" />
        <L k={0.3} d="M380 112H262M380 122H272M380 132H266" cls="vl-bp__ln--text" />
        <L k={0.45} d="M132 262H76M256 262H200M380 262H324" cls="vl-bp__ln--text" />
        <L k={0.6} d="M364 30h16M120 30H96M84 30H60M48 30H24" cls="vl-bp__ln--text" />
      </g>
    )}
    {k === 4 && (
      <g className="vl-bp__light">
        <rect x="20" y="56" width="216" height="118" className="vl-bp__fill vl-bp__fill--a" />
        <path d="M20 174L80 120l38 30 44-46 74 70Z" className="vl-bp__fill vl-bp__fill--hill" />
        <circle cx="196" cy="86" r="12" className="vl-bp__fill vl-bp__fill--sun" />
        <rect x="20" y="190" width="112" height="62" className="vl-bp__fill vl-bp__fill--b" />
        <rect x="144" y="190" width="112" height="62" className="vl-bp__fill vl-bp__fill--c" />
        <rect x="268" y="190" width="112" height="62" className="vl-bp__fill vl-bp__fill--d" />
        <rect x="300" y="282" width="80" height="16" rx="8" className="vl-bp__fill vl-bp__fill--cta" />
      </g>
    )}
  </svg>
);

const Blueprint = () => {
  const [on, setOn] = useState<boolean[]>(ALL);
  const [live, setLive] = useState(false);
  const [say, setSay] = useState("");

  /* The visitor starts from the grid; SSR (no JS) keeps the finished building. */
  useEffect(() => {
    setOn([true, false, false, false, false]);
    setLive(true);
  }, []);

  const count = on.filter(Boolean).length;
  const built = count === N;

  const toggle = (k: number) => {
    const next = on.map((v, i) => (i === k ? !v : v));
    setOn(next);
    const c = next.filter(Boolean).length;
    if (!next[k]) setSay(`גיליון ${LAYERS[k].name} הורם. ${c === 0 ? "נשארה מסגרת ריקה." : `${c} גיליונות על השרטוט.`}`);
    else if (c === N) setSay(`גיליון ${LAYERS[k].name} ירד, וכל חמשת הגיליונות מונחים: השרטוט נהיה אתר פורטפוליו גמור.`);
    else setSay(`גיליון ${LAYERS[k].name} ירד על השרטוט. ${LAYERS[k].line}`);
  };
  const all = () => {
    const to = !built;
    setOn(Array(N).fill(to));
    setSay(to ? "כל הגיליונות ירדו. השרטוט נהיה אתר פורטפוליו גמור." : "כל הגיליונות הורמו. נשארה המסגרת הריקה.");
  };

  return (
    <div className={cn("vl-bp", live && "is-live", built && "is-built")}>
      <div className="vl-bp__table">
        <div className="vl-bp__board">
          <svg className="vl-bp__svg vl-bp__base" viewBox="0 0 400 320" role="img" aria-label={`שרטוט של אתר פורטפוליו, ${count} מתוך ${N} שכבות מונחות`}>
            <rect x="6" y="6" width="388" height="308" className="vl-bp__frame" />
            <path d="M286 290H394M286 290V314M340 290V314" className="vl-bp__titleblock" />
            <text x="390" y="306" className="vl-bp__tb-text" textAnchor="end">
              פורטפוליו
            </text>
            <text x="336" y="306" className="vl-bp__tb-text" textAnchor="end">
              A-01
            </text>
          </svg>
          {LAYERS.map((l, k) => (
            <div key={l.name} data-k={k} className={cn("vl-bp__sheet", on[k] && "is-on")} style={{ ["--k" as string]: k }} aria-hidden="true">
              <span className="vl-bp__tape vl-bp__tape--a" />
              <span className="vl-bp__tape vl-bp__tape--b" />
              <Layer k={k} />
            </div>
          ))}
          <span className="vl-bp__stamp" aria-hidden="true">
            הבניין עומד
          </span>
        </div>
        <div className="vl-bp__tabs" role="group" aria-label="גיליונות השקף">
          {LAYERS.map((l, k) => (
            <button key={l.name} type="button" className={cn("vl-bp__tab", on[k] && "is-on")} aria-pressed={on[k]} onClick={() => toggle(k)}>
              <span className="vl-bp__tab-no">{pad(k)}</span>
              <span className="vl-bp__tab-name">{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="vl-bp__side">
        <p className="vl-bp__count" aria-hidden="true">
          <span className="vl-bp__count-num">{`${count}/${N}`}</span>
          <span>{built ? "הבניין עומד" : "גיליונות על השרטוט"}</span>
        </p>
        <p className="vl-bp__say" aria-live="polite">
          {say || (live ? "הרשת כבר מונחת. הורידו עוד גיליון, בכל סדר שתרצו." : "כל חמשת הגיליונות מונחים: זה אתר הפורטפוליו הגמור.")}
        </p>
        <ol className="vl-bp__legend">
          {LAYERS.map((l, k) => (
            <li key={l.name} className={cn(on[k] && "is-on")}>
              <span className="vl-bp__legend-no">{pad(k)}</span>
              <span className="vl-bp__legend-name">{l.name}</span>
              <span className="vl-bp__legend-line">{l.line}</span>
            </li>
          ))}
        </ol>
        <button type="button" className="vl-bp__all" onClick={all}>
          {built ? "להרים את כל הגיליונות" : "להוריד את כל הגיליונות"}
        </button>
      </div>
    </div>
  );
};

export default Blueprint;
