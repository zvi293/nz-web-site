import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    let rafId = 0;
    let nestedRafId = 0;

    rafId = window.requestAnimationFrame(() => {
      nestedRafId = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(nestedRafId);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
