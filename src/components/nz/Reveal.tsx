import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

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
  /** IntersectionObserver rootMargin. */
  margin?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}

/**
 * Scroll-triggered entrance. No-JS safe: the hidden start state only exists under
 * html.nz-motion (src/lib/motion.ts), and the element is marked [data-in] the moment
 * it scrolls into view (or immediately when IntersectionObserver is missing).
 */
export const Reveal = ({
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  margin = "0px 0px -8% 0px",
  className,
  style,
  id,
  children,
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-in", "");
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  const mergedStyle = delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;

  return (
    <Tag ref={ref} id={id} data-reveal={variant} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
};
