import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setVisible(v > 0.01));
    return unsub;
  }, [scrollYProgress]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, hsl(var(--brand-1)), hsl(var(--brand-2)) 50%, hsl(var(--brand-3)))",
        boxShadow: "0 0 12px 1px hsl(var(--brand-2) / 0.55)",
      }}
    />
  );
};

export default ScrollProgressBar;
