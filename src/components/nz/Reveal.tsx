import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  as?: ElementType;
  /**
   * rise    — fade + 16px rise (default)
   * fade    — opacity only
   * curtain — clip-path wipe from the top (for art)
   * stagger — each direct child rises in turn, 60ms apart
   */
  variant?: "rise" | "fade" | "curtain" | "stagger";
  /** Extra delay in ms (use i * 60 for manual staggering). */
  delay?: number;
  /** IntersectionObserver rootMargin (default "0px 0px -8% 0px"). */
  margin?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}

/**
 * Scroll-triggered entrance — markup only, no hooks, so it renders the same in a static
 * Astro section and inside a hydrated island.
 *
 * The behaviour lives in src/scripts/global.ts (bundled on every page by BaseLayout): one
 * IntersectionObserver marks each [data-reveal] element [data-in] when it scrolls into view
 * (immediately when IntersectionObserver is missing); a MutationObserver picks up elements an
 * island renders later. No-JS safe: the hidden start state only exists under html.nz-motion.
 */
export const Reveal = ({
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  margin,
  className,
  style,
  id,
  children,
}: RevealProps) => {
  const mergedStyle = delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;

  return (
    <Tag id={id} data-reveal={variant} data-reveal-margin={margin} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
};
