/** Anything a call site may pass to cn(): a class string, or a falsy value from `cond && "cls"`. */
export type ClassValue = string | number | bigint | boolean | null | undefined;

/**
 * Joins class names, skipping falsy values: cn("a", on && "is-on", className).
 * Dependency-free: the site uses BEM classes, so no Tailwind conflict merging is needed.
 */
export function cn(...inputs: ClassValue[]): string {
  let out = "";
  for (const input of inputs) {
    if (!input) continue;
    const s = String(input).trim();
    if (s) out = out ? `${out} ${s}` : s;
  }
  return out.replace(/\s+/g, " ");
}
