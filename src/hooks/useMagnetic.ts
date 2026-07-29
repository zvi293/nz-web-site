import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Magnetic hover — the element drifts toward the cursor while it is nearby and
 * springs back on leave. Attach the returned ref to any element.
 *
 * Fine pointers only. Touch devices and `prefers-reduced-motion` get nothing,
 * which is the correct behaviour rather than a degraded one.
 *
 *   const ref = useMagnetic<HTMLAnchorElement>();
 *   <Link ref={ref} …>
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32, radius = 90) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      // Only pull once the cursor is within `radius` of the element's edge.
      const withinX = Math.abs(dx) < rect.width / 2 + radius;
      const withinY = Math.abs(dy) < rect.height / 2 + radius;
      if (withinX && withinY) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [radius, strength]);

  return ref;
}

export default useMagnetic;
