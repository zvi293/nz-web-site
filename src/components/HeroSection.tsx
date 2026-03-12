import { useEffect, useRef } from "react";
import gsap from "gsap";
import heroVisual from "@/assets/hero-visual.png";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
  const stackTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let isActive = true;
    const layers: HTMLDivElement[] = [];
    const revealTargets = [h1Ref.current, subtextRef.current, buttonsRef.current, imgRef.current].filter(
      (node): node is HTMLElement => Boolean(node),
    );
    const forceVisible = () => {
      if (!isActive) {
        return;
      }

      revealTargets.forEach((target) => {
        gsap.set(target, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: "visibility" });
      });
    };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        forceVisible();
        return;
      }

      introTimelineRef.current = gsap.timeline({ defaults: { ease: "power2.out" } });
      const tl = introTimelineRef.current;

      if (h1Ref.current) {
        tl.fromTo(h1Ref.current, { opacity: 0.88, y: 14 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false });
      }
      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { opacity: 0.9, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, immediateRender: false },
          "-=0.22",
        );
      }
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0.92, y: 10, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, immediateRender: false },
          "-=0.18",
        );
      }

      const imgEl = imgRef.current;
      if (!imgEl) {
        return;
      }

      const container = imgEl.parentElement;
      if (!container) {
        return;
      }
      container.style.position = "relative";

      layers.push(
        ...[0, 1, 2].map((i) => {
          const layer = document.createElement("div");
          layer.style.cssText = `
            position: absolute; inset: 0; border-radius: 1rem;
            background: hsl(var(--primary) / ${0.07 - i * 0.015});
            transform: translateY(${(3 - i) * 18}px) scale(${0.92 + i * 0.025});
            opacity: 0; pointer-events: none;
          `;
          container.insertBefore(layer, imgEl);
          return layer;
        }),
      );

      stackTimelineRef.current = gsap.timeline({ onInterrupt: forceVisible });
      const stackTl = stackTimelineRef.current;

      layers.forEach((layer, i) => {
        stackTl.to(layer, {
          opacity: 1,
          y: (3 - i) * 6,
          duration: 0.22,
          ease: "power1.out"
        }, i * 0.08);
      });

      stackTl.fromTo(
        imgEl,
        { opacity: 0.92, y: 18, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power1.out",
          immediateRender: false,
        },
        0.08,
      );

      stackTl.to(layers, {
        opacity: 0,
        duration: 0.28,
        ease: "power1.inOut",
        stagger: 0.12,
        onComplete: () => {
          if (fallbackTimeoutRef.current !== null) {
            window.clearTimeout(fallbackTimeoutRef.current);
            fallbackTimeoutRef.current = null;
          }
          layers.forEach((l) => l.remove());
          floatTweenRef.current = gsap.to(imgEl, {
            y: -30,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }, "+=0.1");
    }, sectionRef);

    if (!prefersReducedMotion) {
      fallbackTimeoutRef.current = window.setTimeout(() => {
        forceVisible();
        layers.forEach((layer) => layer.remove());
      }, 650);
    } else {
      forceVisible();
    }

    return () => {
      isActive = false;
      if (fallbackTimeoutRef.current !== null) {
        window.clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
      floatTweenRef.current?.kill();
      floatTweenRef.current = null;
      stackTimelineRef.current?.kill();
      stackTimelineRef.current = null;
      introTimelineRef.current?.kill();
      introTimelineRef.current = null;
      ctx.revert();
      layers.forEach((layer) => layer.remove());
    };
  }, []);

  return (
    <section ref={sectionRef} dir="rtl" aria-label="ראשי – NZ-web סטודיו לפיתוח ועיצוב אתרים" className="relative overflow-hidden bg-background">
      {/* Subtle ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 right-[10%] h-[200px] w-[200px] rounded-full bg-accent/[0.05] blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col items-center gap-14 px-6 py-20 lg:flex-row lg:gap-20 lg:py-0">
        {/* Right Side – Content */}
        <div className="flex flex-1 flex-col items-start gap-8">
          {/* Studio badge */}
          





          

          {/* Headline */}
          <h1
            ref={h1Ref}
            className="text-[2.75rem] font-black leading-[1.1] tracking-tight text-foreground md:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]">
            
            <span className="block">קוד נקי.</span>
            <span className="mt-2 block text-gradient-brand whitespace-nowrap">עיצוב שובר שגרה.</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="max-w-md text-[1.1rem] leading-[1.85] text-muted-foreground md:text-lg">
            
            אנחנו ב-NZ-WEB מפתחים חוויות דיגיטליות מרהיבות, החל מאתרי תדמית
            יוקרתיים ועד חנויות איקומרס מורכבות, עם ביצועים חסרי פשרות.
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 pt-2">
            <a
              href="/contact"
              className="btn-glow rounded-xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]">
              
              דברו איתנו
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                const target = document.querySelector("#services");
                if (target) {
                  const top = target.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="rounded-xl border border-border/80 bg-background px-10 py-4 text-base font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.04] hover:scale-[1.04] active:scale-[0.97]">
              
              קצת עלינו
            </a>
          </div>
        </div>

        {/* Left Side – Visual */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative">
            <img
              ref={imgRef}
              src={heroVisual}
              alt="NZ-WEB – עיצוב ופיתוח אתרים מתקדם"
              className="w-full max-w-lg soft-shadow-lg rounded-2xl lg:max-w-xl" />
            
          </div>
        </div>
      </div>

      {/* Bottom fade divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>);

};

export default HeroSection;
