import { useEffect, useState, type RefObject } from "react";

/**
 * Motion gate (SITE-PLAYBOOK §3.4).
 *
 * Sets `html.nz-motion` only when motion is allowed:
 *   - the visitor has no `prefers-reduced-motion: reduce`,
 *   - the accessibility widget's "pause animations" (body.a11y-pause-animations) is off,
 *   - the page is not running in an automation browser (navigator.webdriver) — the
 *     pre-render step snapshots the DOM with puppeteer, and the class must never be
 *     baked into the static HTML (no-JS visitors would get hidden start states).
 *
 * All hidden start states in CSS live under `html.nz-motion`, so without JS (or with
 * motion off) every element simply renders in its final state.
 */
const MOTION_CLASS = "nz-motion";
let started = false;

export function initMotionGate(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  const html = document.documentElement;
  if (navigator.webdriver) {
    html.classList.remove(MOTION_CLASS);
    return;
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    const paused = document.body?.classList.contains("a11y-pause-animations") ?? false;
    const allowed = !mq.matches && !paused;
    if (html.classList.contains(MOTION_CLASS) !== allowed) {
      html.classList.toggle(MOTION_CLASS, allowed);
      window.dispatchEvent(new CustomEvent("nz:motionchange", { detail: allowed }));
    }
  };
  update();
  mq.addEventListener?.("change", update);
  if (document.body) {
    new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
}

/** True when the motion gate is open (safe to animate). */
export function motionAllowed(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains(MOTION_CLASS);
}

/** React hook mirroring the motion gate (re-renders when it flips). */
export function useMotionAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(motionAllowed());
    const onChange = () => setAllowed(motionAllowed());
    window.addEventListener("nz:motionchange", onChange);
    return () => window.removeEventListener("nz:motionchange", onChange);
  }, []);
  return allowed;
}

/**
 * IntersectionObserver hook. `once` (default) stops observing after the first hit.
 * Falls back to "in view" when IntersectionObserver is missing.
 */
export function useInView<T extends Element>(
  ref: RefObject<T>,
  { rootMargin = "0px 0px -10% 0px", threshold = 0, once = true }: { rootMargin?: string; threshold?: number | number[]; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}

/**
 * Tracks which of several elements is "active" as the page scrolls past a line in
 * the viewport (default: 45% from the top). Used for the sticky-art scroll moments.
 * No scroll listeners — one IntersectionObserver with a thin band as its root margin.
 */
export function useActiveIndex(
  getElements: () => (Element | null)[],
  deps: unknown[] = [],
  band = "-45% 0px -54% 0px",
): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = getElements().filter(Boolean) as Element[];
    if (!els.length) return;
    // On every crossing, recompute from geometry: the active item is the last one whose
    // top has passed the reading line (45% of the viewport) — 0 when above them all.
    const recompute = () => {
      const line = window.innerHeight * 0.45;
      let idx = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i;
      });
      setActive(idx);
    };
    const io = new IntersectionObserver(recompute, { rootMargin: band, threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return active;
}
