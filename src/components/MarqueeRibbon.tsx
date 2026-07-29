import { Sparkle } from "lucide-react";

const DEFAULT_ITEMS = [
  "בניית אתרים",
  "אתרי תדמית",
  "דפי נחיתה ממירים",
  "מערכות ניהול תורים",
  "React & TypeScript",
  "קידום אורגני",
  "ביצועים 100/100",
  "מובייל-פירסט",
  "נגישות מלאה",
];

interface MarqueeRibbonProps {
  items?: string[];
  /** seconds for one full loop — lower is faster */
  duration?: number;
  /** tilt in degrees; 0 keeps it flat */
  tilt?: number;
  className?: string;
}

/**
 * Infinite brand ribbon.
 *
 * The track holds the item list twice and slides exactly -50%, so the seam
 * lands on an identical frame and the loop is invisible. Duplicated content is
 * `aria-hidden` and the whole strip is decorative — screen readers get the list
 * once, from the first copy.
 */
const MarqueeRibbon = ({
  items = DEFAULT_ITEMS,
  duration = 38,
  tilt = -1.6,
  className = "",
}: MarqueeRibbonProps) => {
  const Row = ({ clone = false }: { clone?: boolean }) => (
    <ul className="flex shrink-0 items-center gap-8 px-4 sm:gap-12" aria-hidden={clone || undefined}>
      {items.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-8 sm:gap-12">
          <span className="whitespace-nowrap text-sm font-black tracking-tight text-white/90 sm:text-base md:text-lg">
            {item}
          </span>
          <Sparkle className="h-3.5 w-3.5 shrink-0 text-white/45" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`relative w-[104%] overflow-hidden py-3.5 sm:py-4 ${className}`}
      style={{
        /* one transform property — a `-translate-x` utility here would be
           silently overwritten by this inline rotate */
        transform: `translateX(2%) rotate(${tilt}deg)`,
        background:
          "linear-gradient(100deg, hsl(var(--brand-1)), hsl(var(--brand-2)) 45%, hsl(var(--brand-3)) 78%, hsl(var(--brand-1)))",
        boxShadow: "0 12px 40px -14px hsl(var(--brand-2) / 0.6)",
      }}
    >
      {/* inner sheen so the band reads as a physical strip, not a flat rectangle */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(0 0% 100% / 0.22), transparent 45%, hsl(0 0% 0% / 0.12))",
        }}
        aria-hidden="true"
      />
      <div className="nz-marquee flex w-max" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        <Row />
        <Row clone />
      </div>
    </div>
  );
};

export default MarqueeRibbon;
