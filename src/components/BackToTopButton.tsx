import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const R = 21;
const C = 2 * Math.PI * R;

/**
 * Back-to-top control.
 *
 * Sits bottom-RIGHT on purpose: the WhatsApp FAB and the accessibility launcher
 * both live in the bottom-left stack, and stacking a third control there would
 * bury them. Appears only once there is a meaningful distance to scroll back.
 *
 * Renders a live progress ring around the arrow, so it doubles as a
 * "how far through the page am I" indicator.
 */
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const progressRef = useRef(0);
  const ringRef = useRef<SVGCircleElement>(null);

  /* One rAF-batched measurement per frame, and the ring is written straight to
     the DOM node. This used to setState the progress on every scroll event,
     which re-rendered the button — SVG, gradient defs and all — dozens of times
     a second on every page of the site. `visible` is still state, but it's a
     boolean React bails out of when unchanged. */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      progressRef.current = max > 0 ? Math.min(y / max, 1) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = `${C * (1 - progressRef.current)}`;
      }
      setVisible(y > window.innerHeight * 1.2);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={toTop}
          aria-label="חזרה לראש העמוד"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="glass-strong fixed bottom-6 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-foreground md:right-6"
        >
          {/* progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
            {/* The offset is seeded from the ref so the ring is already correct on
                the frame it mounts, then updated imperatively from then on. */}
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#nz-progress)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ strokeDashoffset: C * (1 - progressRef.current) }}
            />
            <defs>
              <linearGradient id="nz-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--brand-1))" />
                <stop offset="100%" stopColor="hsl(var(--brand-3))" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="relative h-[18px] w-[18px]" strokeWidth={2.4} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
