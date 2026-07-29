import { useCallback } from "react";

/**
 * Cursor-following spotlight for `.spotlight` cards.
 *
 * Sets the `--mx` / `--my` custom properties on the hovered element, which the
 * `.spotlight::before` radial-gradient (see index.css) reads. Pointer-driven and
 * write-only — no state, no re-renders, so it is safe on long card grids.
 *
 * Usage:
 *   const onMove = useSpotlight();
 *   <div className="spotlight" onPointerMove={onMove} />
 */
export const useSpotlight = () =>
  useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

export default useSpotlight;
