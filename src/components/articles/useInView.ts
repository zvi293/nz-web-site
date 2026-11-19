import { useEffect, useState, type RefObject } from "react";

/** True while the element is (partly) on screen. Used to pause loops off-screen. */
export function useInView(ref: RefObject<Element>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** True when motion is allowed (html.nz-motion: no reduced-motion preference, widget not paused). */
export function useMotionOk(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setOk(html.classList.contains("nz-motion"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return ok;
}
