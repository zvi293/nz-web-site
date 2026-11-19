import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  /** Vermilion index before the text, e.g. 1 → "01". */
  index?: number | string;
  /** Hairline above (museum-label style). */
  rule?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}

/** Small Heebo label: tabular numerals, letter-spacing .04em, vermilion index. */
export const Eyebrow = ({ index, rule = false, as: Tag = "p", className, id, children }: EyebrowProps) => (
  <Tag id={id} className={cn("nz-label", rule && "nz-label--rule", className)}>
    {index !== undefined && (
      <span className="nz-label__index">{typeof index === "number" ? String(index).padStart(2, "0") : index}</span>
    )}
    <span>{children}</span>
  </Tag>
);
/** Alias — same component. */
export const Label = Eyebrow;

interface DisplayProps {
  as?: ElementType;
  /** xl 56→168 · l 44→112 · h2 34→72 · h3 22→32 (fluid). */
  size?: "xl" | "l" | "h2" | "h3";
  className?: string;
  id?: string;
  children: ReactNode;
}

/* Literal class names — Tailwind only keeps @layer classes it can find in the source. */
const DISPLAY_SIZE = {
  xl: "nz-display--xl",
  l: "nz-display--l",
  h2: "nz-display--h2",
  h3: "nz-display--h3",
} as const;

/** Serif statement (Frank Ruhl Libre 300, tight leading, balanced). */
export const Display = ({ as: Tag = "h2", size = "h2", className, id, children }: DisplayProps) => (
  <Tag id={id} className={cn("nz-display", DISPLAY_SIZE[size], className)}>
    {children}
  </Tag>
);

/** The one highlighted word in a statement (vermilion). */
export const Accent = ({ children }: { children: ReactNode }) => <span className="nz-accent">{children}</span>;

/** Intro paragraph under a heading (18→22px, muted, ≤ 38ch). */
export const Lede = ({ className, children, as: Tag = "p" }: { className?: string; children: ReactNode; as?: ElementType }) => (
  <Tag className={cn("nz-lede", className)}>{children}</Tag>
);

/** Latin text inside Hebrew (brand names, tech terms) — keeps bidi order. */
export const Ltr = ({ children }: { children: ReactNode }) => <bdi dir="ltr">{children}</bdi>;
