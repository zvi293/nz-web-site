import type { ReactNode } from "react";

/**
 * "Catalogue plates" for the building blocks of the offer: each block is drawn as a tiny
 * architectural schematic in ink hairlines with ONE vermilion detail — like plates in an
 * exhibition catalogue, not icon tiles. viewBox 160 × 100, stroke = currentColor.
 * Keyed by the exact Hebrew item text in src/content/offer.ts (scope items).
 */
const V = "var(--hm-plate-accent)";

const lines = (x: number, y: number, w: number[], gap = 6) =>
  w.map((len, i) => <path key={i} d={`M${x} ${y + i * gap}h${len}`} />);

const page = (x = 22, y = 10, w = 116, h = 80) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx="2" />
    <path d={`M${x} ${y + 9}h${w}`} />
    <circle cx={x + 6} cy={y + 4.5} r="1.2" />
    <circle cx={x + 11} cy={y + 4.5} r="1.2" />
  </>
);

const PLATES: Record<string, ReactNode> = {
  "אתר תדמית לעסק": (
    <>
      {page()}
      <rect x="84" y="27" width="44" height="34" rx="1" />
      <path d="m84 61 14-14 9 9 7-6 14 11" />
      {lines(32, 30, [40, 34, 26], 7)}
      <rect x="32" y="52" width="22" height="8" rx="4" fill={V} stroke="none" />
      {lines(32, 72, [96, 80], 6)}
    </>
  ),
  "דף נחיתה לקמפיין": (
    <>
      <rect x="52" y="6" width="56" height="88" rx="3" />
      {lines(60, 18, [40, 32], 7)}
      {lines(60, 38, [40, 40, 28], 5)}
      <rect x="60" y="60" width="40" height="11" rx="5.5" fill={V} stroke="none" />
      <path d="M80 78v8m-3-3 3 3 3-3" />
    </>
  ),
  "אתר תוכן ומגזין": (
    <>
      {page()}
      <rect x="30" y="26" width="48" height="30" rx="1" />
      <path d="M30 26l48 30M78 26 30 56" opacity=".35" />
      <rect x="30" y="62" width="10" height="3" fill={V} stroke="none" />
      {lines(30, 70, [48, 40], 6)}
      {lines(88, 28, [42, 36, 42, 30, 42, 38, 26, 42, 34], 6.2)}
    </>
  ),
  "חנות אונליין": (
    <>
      {page()}
      {[30, 64, 98].map((x) => (
        <g key={x}>
          <rect x={x} y="26" width="28" height="28" rx="1" />
          <path d={`M${x} 60h20M${x} 65h12`} />
        </g>
      ))}
      <rect x="98" y="71" width="28" height="9" rx="4.5" fill={V} stroke="none" />
      <rect x="30" y="71" width="28" height="9" rx="4.5" />
      <rect x="64" y="71" width="28" height="9" rx="4.5" />
    </>
  ),
  "עמודי שירות": (
    <>
      <rect x="46" y="22" width="76" height="68" rx="2" opacity=".4" />
      <rect x="40" y="16" width="76" height="68" rx="2" opacity=".7" fill="var(--hm-plate-bg)" />
      <rect x="34" y="10" width="76" height="68" rx="2" fill="var(--hm-plate-bg)" />
      <rect x="34" y="10" width="20" height="5" fill={V} stroke="none" />
      {lines(42, 26, [52, 40], 7)}
      {lines(42, 44, [60, 60, 46, 56], 6)}
    </>
  ),
  "גלריית עבודות": (
    <>
      <rect x="20" y="14" width="40" height="30" rx="1" />
      <rect x="66" y="14" width="26" height="40" rx="1" />
      <rect x="98" y="14" width="42" height="26" rx="1" />
      <rect x="20" y="50" width="40" height="36" rx="1" />
      <rect x="66" y="60" width="26" height="26" rx="1" />
      <rect x="98" y="46" width="42" height="40" rx="1" />
      <rect x="104" y="52" width="30" height="28" fill="none" stroke={V} />
      <path d="M10 94h140" opacity=".5" />
    </>
  ),
  "עמוד אודות": (
    <>
      {page()}
      <rect x="88" y="26" width="38" height="46" rx="1" />
      <circle cx="107" cy="42" r="8" />
      <path d="M93 72c2-10 8-14 14-14s12 4 14 14" />
      {lines(32, 30, [44, 36], 7)}
      {lines(32, 50, [46, 46, 40, 46, 30], 5.5)}
      <rect x="32" y="20" width="5" height="5" fill={V} stroke="none" />
    </>
  ),
  "שאלות נפוצות": (
    <>
      <path d="M24 22h112M24 54h112M24 70h112M24 86h112" opacity=".6" />
      <path d="M34 16h60M34 32h70M34 64h56M34 80h66" />
      <path d="M34 40h80M34 46h64" opacity=".5" />
      <path d="M126 12v8M122 16h8M126 60v8M122 64h8M126 76v8M122 80h8" />
      <path d="M122 32h8" stroke={V} strokeWidth="1.8" />
    </>
  ),
  "בלוג / מגזין": (
    <>
      <path d="M80 18c-14-6-38-8-56-4v70c18-4 42-2 56 4 14-6 38-8 56-4V14c-18-4-42-2-56 4Zm0 0v70" />
      <rect x="32" y="26" width="10" height="11" fill={V} stroke="none" />
      {lines(46, 28, [26, 26], 6)}
      {lines(32, 44, [38, 38, 34, 38, 30], 6)}
      {lines(88, 28, [38, 38, 30, 38, 38, 26, 34], 6)}
    </>
  ),
  "טופס פנייה לוואטסאפ": (
    <>
      <rect x="22" y="12" width="70" height="76" rx="2" />
      <rect x="30" y="22" width="54" height="9" rx="1" />
      <rect x="30" y="37" width="54" height="9" rx="1" />
      <rect x="30" y="52" width="54" height="18" rx="1" />
      <rect x="30" y="76" width="30" height="7" rx="3.5" />
      <path d="M104 30h40a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6h-26l-10 9v-9h-4a6 6 0 0 1-6-6V36a6 6 0 0 1 6-6Z" stroke={V} />
      <path d="M110 42h28M110 50h20" />
      <path d="M86 79h12" strokeDasharray="2 3" />
    </>
  ),
  "מערכת קביעת תורים": (
    <>
      <rect x="28" y="10" width="104" height="80" rx="2" />
      <path d="M28 24h104" />
      <path d="M44 6v8M116 6v8" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4, 5, 6].map((c) => (
          <rect key={`${r}${c}`} x={34 + c * 13.5} y={30 + r * 14} width="9" height="9" rx="1" opacity=".55" />
        )),
      )}
      <rect x={34 + 4 * 13.5} y={30 + 2 * 14} width="9" height="9" rx="1" fill={V} stroke="none" />
    </>
  ),
  "תזכורות אוטומטיות": (
    <>
      <circle cx="56" cy="52" r="30" />
      <path d="M56 30v22l14 9" />
      <path d="M56 22v3M56 79v3M26 52h3M83 52h3" />
      <rect x="92" y="20" width="52" height="24" rx="4" fill="var(--hm-plate-bg)" />
      <circle cx="102" cy="32" r="3.5" fill={V} stroke="none" />
      <path d="M110 28h26M110 35h18" />
      <rect x="92" y="52" width="52" height="24" rx="4" opacity=".45" />
      <path d="M110 60h26M110 67h18" opacity=".45" />
    </>
  ),
  "אזור ניהול": (
    <>
      <rect x="18" y="10" width="124" height="80" rx="2" />
      <path d="M50 10v80" />
      {lines(26, 22, [16, 12, 16, 14], 9)}
      {[24, 42, 60].map((y) => (
        <g key={y}>
          <path d={`M58 ${y + 6}h44`} />
          <rect x="114" y={y} width="20" height="12" rx="6" />
        </g>
      ))}
      <rect x="114" y="24" width="20" height="12" rx="6" fill={V} stroke="none" />
      <circle cx="128" cy="30" r="4" fill="var(--hm-plate-bg)" stroke="none" />
      <circle cx="120" cy="48" r="4" />
      <circle cx="120" cy="66" r="4" />
    </>
  ),
  "עיצוב מותאם אישית": (
    <>
      <text x="58" y="72" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="300" fontSize="62" fill="currentColor" stroke="none">
        אב
      </text>
      <path d="M18 78h82" opacity=".5" />
      <rect x="112" y="16" width="26" height="15" rx="1" fill={V} stroke="none" />
      <rect x="112" y="37" width="26" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="112" y="58" width="26" height="15" rx="1" />
      <path d="M112 84h26" strokeDasharray="2 3" />
    </>
  ),
  "התאמה מלאה למובייל": (
    <>
      <rect x="14" y="16" width="92" height="60" rx="2" />
      <path d="M44 86h32M60 76v10" />
      {lines(22, 28, [48, 40], 7)}
      <rect x="22" y="46" width="76" height="22" rx="1" opacity=".5" />
      <rect x="114" y="22" width="34" height="66" rx="5" fill="var(--hm-plate-bg)" />
      {lines(120, 34, [20, 16], 6)}
      <rect x="120" y="50" width="22" height="16" rx="1" opacity=".5" />
      <path d="M125 82h12" stroke={V} strokeWidth="2" />
    </>
  ),
  "נגישות לפי ת״י 5568": (
    <>
      <rect x="28" y="38" width="62" height="22" rx="11" />
      <path d="M44 49h30" />
      <rect x="22" y="32" width="74" height="34" rx="17" stroke={V} strokeDasharray="3 3" />
      <circle cx="124" cy="49" r="20" />
      <path d="M124 29a20 20 0 0 1 0 40Z" fill="currentColor" stroke="none" />
      <path d="M30 82h100" opacity=".5" />
      <path d="M30 88h60" opacity=".5" />
    </>
  ),
  "תשתית SEO": (
    <>
      {[16, 40, 64].map((y, i) => (
        <g key={y} opacity={i === 0 ? 1 : 0.55}>
          <path d={`M52 ${y}h64`} stroke={i === 0 ? V : undefined} strokeWidth={i === 0 ? 1.8 : undefined} />
          <path d={`M52 ${y + 7}h86M52 ${y + 13}h70`} />
        </g>
      ))}
      <circle cx="30" cy="34" r="12" />
      <path d="m39 43 10 10" strokeWidth="2.2" />
    </>
  ),
  "חיבור לגוגל אנליטיקס": (
    <>
      <path d="M20 86h124M20 86V12" />
      {[28, 44, 60, 76, 92, 108, 124].map((x, i) => {
        const h = [16, 24, 20, 34, 30, 46, 58][i];
        return <rect key={x} x={x} y={86 - h} width="10" height={h} rx="1" fill={i === 6 ? V : "none"} stroke={i === 6 ? "none" : undefined} />;
      })}
      <path d="M33 62 49 52l16 6 16-18 16 4 16-16 16-8" strokeDasharray="3 3" opacity=".7" />
    </>
  ),
};

/** Draw a plate for an item (falls back to an empty sheet). */
export const Plate = ({ item }: { item: string }) => (
  <svg
    className="hm-plate__svg"
    viewBox="0 0 160 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {PLATES[item] ?? page()}
  </svg>
);
