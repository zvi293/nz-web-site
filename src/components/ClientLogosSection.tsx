import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useInView } from "framer-motion";

import { visibleClientLogos } from "@/content/client-logos";
import type { ClientLogo } from "@/content/types";
import { createLabeledImageDataUri, isRenderableAssetUrl } from "@/lib/runtime-safety";

gsap.registerPlugin(ScrollTrigger);

const LogoCard = ({ logo }: { logo: ClientLogo }) => {
  const fallbackSrc = createLabeledImageDataUri(logo.name, {
    background: "#ffffff",
    foreground: "#0f172a",
    fontSize: 28,
  });
  const [src, setSrc] = useState(
    isRenderableAssetUrl(logo.image) ? logo.image : fallbackSrc,
  );

  useEffect(() => {
    setSrc(isRenderableAssetUrl(logo.image) ? logo.image : fallbackSrc);
  }, [fallbackSrc, logo.image]);

  return (
    <div className="flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-card/80 p-4 opacity-70 grayscale backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-primary/25 hover:opacity-100 hover:shadow-elevated hover:grayscale-0 md:h-24 md:w-40 md:p-5">
      <img
        src={src}
        alt={`לוגו לקוח - ${logo.name}`}
        className="max-h-9 max-w-full object-contain md:max-h-11"
        loading="lazy"
        decoding="async"
        onError={() => setSrc(fallbackSrc)}
      />
    </div>
  );
};

const ClientLogosSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  const visibleLogos = useMemo(
    () => visibleClientLogos.filter((logo) => Boolean(logo.name.trim())),
    [],
  );

  useEffect(() => {
    if (
      visibleLogos.length === 0 ||
      !sectionRef.current ||
      !scrollerRef.current ||
      !scrollerInnerRef.current
    )
      return;

    const inner = scrollerInnerRef.current;
    const clones = Array.from(inner.querySelectorAll("[data-clone]"));
    clones.forEach((el) => el.remove());

    Array.from(inner.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("data-clone", "true");
      inner.appendChild(clone);
    });

    const totalWidth = inner.scrollWidth / 2;
    if (totalWidth <= 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { x: 0 },
        {
          x: -totalWidth,
          duration: Math.max(visibleLogos.length * 3.5, 14),
          ease: "none",
          repeat: -1,
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      Array.from(inner.querySelectorAll("[data-clone]")).forEach((el) =>
        el.remove(),
      );
    };
  }, [visibleLogos]);

  /* No logos configured in src/content/client-logos.ts → the strip stays hidden. */
  if (visibleLogos.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden bg-surface-2 py-10 md:py-14"
      aria-label="לקוחות שבחרו בנו"
    >
      {/* Subtle background */}
      <div className="nz-dots opacity-50" aria-hidden="true" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="container mx-auto mb-7 px-4 text-center md:mb-10 md:px-6"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nz-eyebrow mb-4">הם כבר בחרו בנו</span>
          <h2 className="text-section-title text-foreground">
            עסקים שמאמינים ב
            <span className="text-gradient-brand">NZ-web</span>
          </h2>
        </motion.div>

        {/* Scrolling logos with fade masks */}
        <div className="relative">
          {/* Fade left */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-surface-2/0 to-surface-2 md:w-40" />
          {/* Fade right */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-surface-2/0 to-surface-2 md:w-40" />

          <div ref={scrollerRef} className="relative w-full overflow-hidden">
            <div ref={scrollerInnerRef} className="flex w-max gap-5 md:gap-7">
              {visibleLogos.map((logo) => (
                <LogoCard key={logo.id} logo={logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
