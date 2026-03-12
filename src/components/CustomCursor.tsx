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

    const onEnterInteractive = () => {
      gsap.to(cursor, { scale: 0.4, opacity: 0.6, duration: 0.3, ease: "power2.out" });
      gsap.to(follower, { scale: 1.8, opacity: 0.08, duration: 0.4, ease: "power2.out", borderWidth: 2 });
    };

    const onLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(follower, { scale: 1, opacity: 0.12, duration: 0.4, ease: "power2.out", borderWidth: 1.5 });
    };

    window.addEventListener("mousemove", onMove);

    const attachEvents = () => {
      const interactiveElements = document.querySelectorAll("a, button, [role='button'], input, textarea, [data-hover]");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      return interactiveElements;
    };

    const elements = attachEvents();

    // Re-attach on DOM changes for dynamic content
    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      attachEvents();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
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
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:block"
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(217 91% 65%), hsl(217 91% 50%))",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "normal",
          boxShadow: "0 0 12px 3px hsl(217 91% 60% / 0.4), 0 0 24px 6px hsl(217 91% 60% / 0.15)",
        }}
      />
      {/* Outer follower ring - larger, softer glow */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden lg:block"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "hsl(217 91% 60% / 0.08)",
          border: "1.5px solid hsl(217 91% 60% / 0.25)",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 20px 4px hsl(217 91% 60% / 0.08)",
        }}
      />
    </>
  );
};

export default CustomCursor;
