import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setVisible(y > window.innerHeight * 1.2);
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const R = 21;
  const C = 2 * Math.PI * R;

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
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="url(#nz-progress)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
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
