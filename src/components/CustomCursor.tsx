import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateEnabledState = () => setIsEnabled(mediaQuery.matches);

    updateEnabledState();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateEnabledState);
      return () => mediaQuery.removeEventListener("change", updateEnabledState);
    }

    mediaQuery.addListener(updateEnabledState);
    return () => mediaQuery.removeListener(updateEnabledState);
  }, []);

  /* Only hide the native cursor while ours is actually on screen — the CSS rule
     in index.css keys off this attribute instead of a blanket `cursor: none`. */
  useEffect(() => {
    const root = document.documentElement;
    if (isEnabled) root.setAttribute("data-custom-cursor", "on");
    else root.removeAttribute("data-custom-cursor");
    return () => root.removeAttribute("data-custom-cursor");
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "power2.out",
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, [data-hover]";

    const grow = () => {
      gsap.to(cursor, { scale: 0.4, opacity: 0.6, duration: 0.3, ease: "power2.out" });
      gsap.to(follower, { scale: 1.8, opacity: 0.08, duration: 0.4, ease: "power2.out", borderWidth: 2 });
    };

    const shrink = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(follower, { scale: 1, opacity: 0.12, duration: 0.4, ease: "power2.out", borderWidth: 1.5 });
    };

    /* Two delegated listeners on the document — previously this queried every
       `a, button, input…` in the page and bound two listeners to each, then a
       MutationObserver re-ran that whole scan on any DOM change while only ever
       cleaning up the FIRST batch, so listeners accumulated for the whole
       session. Delegation is O(1) and cannot leak. */
    const onOver = (e: MouseEvent) => {
      const from = (e.relatedTarget as Element | null)?.closest?.(INTERACTIVE) ?? null;
      const to = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (to && to !== from) grow();
    };

    const onOut = (e: MouseEvent) => {
      const from = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      const to = (e.relatedTarget as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (from && from !== to) shrink();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Inner dot - bigger, bluer */}
      <div
        ref={cursorRef}
        data-nz-cursor="dot"
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10001] hidden lg:block"
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(var(--brand-3)), hsl(var(--brand-2)) 70%)",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "normal",
          boxShadow:
            "0 0 12px 3px hsl(var(--brand-2) / 0.45), 0 0 26px 8px hsl(var(--brand-1) / 0.18)",
        }}
      />
      {/* Outer follower ring - larger, softer glow */}
      <div
        ref={followerRef}
        data-nz-cursor="ring"
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden lg:block"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "hsl(var(--brand-2) / 0.07)",
          border: "1.5px solid hsl(var(--brand-2) / 0.28)",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 22px 5px hsl(var(--brand-2) / 0.09)",
        }}
      />
    </>
  );
};

export default CustomCursor;
