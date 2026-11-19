import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "bone" | "ink" | "paper";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  id?: string;
}

/** Max 1440px, side gutter 20 → 48 → 64 (var(--gutter)). */
export const Container = ({ as: Tag = "div", className, children, id }: ContainerProps) => (
  <Tag id={id} className={cn("nz-container", className)}>
    {children}
  </Tag>
);

interface SectionProps {
  as?: ElementType;
  /** bone = gallery wall (default) · ink = night room · paper = reading surface. */
  tone?: Tone;
  /** Vertical rhythm: default 72 → 160px, tight ≈ 60% of that, none = 0. */
  space?: "default" | "tight" | "none";
  /** Wrap children in <Container>. Default true. */
  contained?: boolean;
  /** Soft "gallery light" from above on the wall. */
  lit?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

/* Literal class names — Tailwind only keeps @layer classes it can find in the source. */
const SPACE_CLASS = { default: "nz-section--space-default", tight: "nz-section--space-tight", none: "" } as const;

/**
 * A room of the gallery. Sets background, text colour and the tone-aware CSS vars
 * (--fg, --fg-muted, --rule, --focus, --accent-text) through data-tone.
 */
export const Section = ({
  as: Tag = "section",
  tone = "bone",
  space = "default",
  contained = true,
  lit = false,
  id,
  className,
  containerClassName,
  style,
  children,
  ...aria
}: SectionProps) => (
  <Tag
    id={id}
    data-tone={tone}
    style={style}
    className={cn("nz-section", SPACE_CLASS[space], lit && "nz-wall-light", className)}
    {...aria}
  >
    {contained ? <Container className={containerClassName}>{children}</Container> : children}
  </Tag>
);
