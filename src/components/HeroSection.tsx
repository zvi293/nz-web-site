import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import heroVisual from "@/assets/hero-visual.png";

const stats = [
  { value: 50, suffix: "+", label: "פרויקטים" },
  { value: 5, suffix: "+", label: "שנות ניסיון" },
  { value: 100, suffix: "%", label: "שביעות רצון" },
];

const AnimatedNumber = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value]);
  return <span>{display}{suffix}</span>;
};

gsap.registerPlugin(ScrollTrigger);

const heroAriaLabel = "ראשי – NZ-web סטודיו לפיתוח ועיצוב אתרים";
const heroLine1 = "קוד נקי.";
const heroLine2 = "עיצוב שובר שגרה.";
const heroParagraph =
  "אנחנו ב-NZ-web מפתחים חוויות דיגיטליות מרהיבות, החל מאתרי תדמית יוקרתיים ועד חנויות איקומרס מורכבות, עם ביצועים חסרי פשרות.";
const contactLabel = "דברו איתנו";
const aboutLabel = "השירותים שלנו";
const heroImageAlt = "NZ-web – עיצוב ופיתוח אתרים מתקדם";

const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap gap-4 pt-2 sm:gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2.5">
          {i > 0 && <div className="h-6 w-px bg-border/60" />}
          <div className="flex flex-col">
            <span className="text-xl font-black leading-none text-foreground sm:text-2xl">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} isInView={isInView} />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const visualIntroRef = useRef<HTMLDivElement>(null);
  const visualParallaxRef = useRef<HTMLDivElement>(null);
  const visualFloatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const parallaxTweenRef = useRef<gsap.core.Tween | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const visualIntro = visualIntroRef.current;
      const visualParallax = visualParallaxRef.current;
      const visualFloat = visualFloatRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const subtext = subtextRef.current;
      const buttons = buttonsRef.current;

      if (prefersReducedMotion) {
        gsap.set([visualIntro, visualParallax, visualFloat, line1, line2, subtext, buttons], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
        });
        return;
      }

      gsap.set(visualIntro, {
        opacity: 0,
        x: -58,
        y: 28,
        scale: 0.86,
        rotate: -2.2,
        transformOrigin: "50% 50%",
      });
      gsap.set(visualParallax, { y: 0 });
      gsap.set([line1, line2, subtext, buttons], { opacity: 0 });
      gsap.set(line1, { x: 34, y: 14 });
      gsap.set(line2, { x: 40, y: 18 });
      gsap.set(subtext, { y: 18 });
      gsap.set(buttons, { y: 20, scale: 0.97, transformOrigin: "50% 50%" });

      if (sectionRef.current && visualParallax) {
        parallaxTweenRef.current = gsap.to(visualParallax, {
          y: -26,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });
      }

      introTimelineRef.current = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      const tl = introTimelineRef.current;

      if (visualIntro) {
        tl.to(visualIntro, {
          opacity: 0.82,
          x: -10,
          y: 6,
          scale: 0.965,
          rotate: -0.45,
          duration: 0.96,
          ease: "power2.out",
        });

        tl.to(visualIntro, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.84,
          ease: "power2.out",
        });
      }

      if (line1) {
        tl.to(
          line1,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.82,
          },
          "-=0.54",
        );
      }

      if (line2) {
        tl.to(
          line2,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
          },
          "-=0.58",
        );
      }

      if (subtext) {
        tl.to(
          subtext,
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
          },
          "-=0.44",
        );
      }

      if (buttons) {
        tl.to(
          buttons,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.68,
          },
          "-=0.36",
        );
      }
    }, sectionRef);

    return () => {
      parallaxTweenRef.current?.kill();
      parallaxTweenRef.current = null;
      introTimelineRef.current?.kill();
      introTimelineRef.current = null;
      ctx.revert();
    };
  }, []);

  /* Subtle 3D mouse-tilt on the hero visual — desktop / hover-capable devices only. */
  useEffect(() => {
    const tilt = tiltRef.current;
    const section = sectionRef.current;
    if (!tilt || !section) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduced) return;

    const MAX_DEG = 15; // tilt amount (degrees)
    const MAX_SHIFT = 12; // positional drift toward the cursor (px) — adds depth
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(tilt, {
        rotateY: px * MAX_DEG,
        rotateX: -py * MAX_DEG,
        x: px * MAX_SHIFT,
        y: py * MAX_SHIFT,
        duration: 0.6,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(tilt, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.9, ease: "power3.out" });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(tilt);
    };
  }, []);

  /* Mobile / touch: tilt the hero visual slightly toward the scroll direction. */
  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canHover || reduced) return; // desktop already has the mouse-tilt

    let lastY = window.scrollY;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) < 1) return;
      const dir = delta > 0 ? 1 : -1; // down → +, up → −
      gsap.to(tilt, { rotateX: dir * 13, duration: 0.4, ease: "power2.out" });
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        gsap.to(tilt, { rotateX: 0, duration: 0.7, ease: "power3.out" });
      }, 170);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(resetTimer);
      gsap.killTweensOf(tilt);
    };
  }, []);

  return (
    <section ref={sectionRef} dir="rtl" aria-label={heroAriaLabel} className="relative overflow-hidden bg-background">
      {/* Subtle ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute top-1/2 right-[10%] h-[200px] w-[200px] rounded-full bg-accent/[0.05] blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[78vh] flex-col items-center gap-8 px-5 py-10 sm:gap-12 sm:py-14 lg:min-h-[88vh] lg:flex-row lg:gap-20 lg:py-0">
        {/* Right Side - Content */}
        <div className="flex flex-1 flex-col items-start gap-5 sm:gap-7">
          {/* Headline */}
          <h1 className="text-[2.2rem] font-black leading-[1.1] tracking-tight text-foreground sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]">
            <span ref={line1Ref} className="block">{heroLine1}</span>
            <span ref={line2Ref} className="mt-1 block whitespace-nowrap text-gradient-brand sm:mt-2">
              {heroLine2}
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="max-w-md text-[1rem] leading-[1.85] text-muted-foreground sm:text-[1.1rem] md:text-lg">
            {heroParagraph}
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-3 pt-1 sm:gap-4 sm:pt-2">
            <Link
              to="/contact"
              className="btn-glow rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97] sm:px-10 sm:py-4 sm:text-base">
              {contactLabel}
            </Link>
            <Link
              to="/services"
              className="rounded-xl border border-border/80 bg-background px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-200 hover:scale-[1.04] hover:border-primary/30 hover:bg-primary/[0.04] active:scale-[0.97] sm:px-10 sm:py-4 sm:text-base">
              {aboutLabel}
            </Link>
          </div>

          {/* Stats bar */}
          <StatsBar />
        </div>

        {/* Left Side - Visual */}
        <div className="flex w-full flex-1 items-center justify-center">
          <div ref={visualParallaxRef} className="relative w-full will-change-transform">
            <div ref={visualIntroRef} className="will-change-transform">
              {/* perspective parent — enables the 3D mouse-tilt on the child */}
              <div ref={visualFloatRef} className="nz-hero-float will-change-transform" style={{ perspective: "1100px" }}>
                <div ref={tiltRef} className="will-change-transform">
                  <img
                    src={heroVisual}
                    alt={heroImageAlt}
                    className="soft-shadow-lg mx-auto w-full max-w-sm rounded-2xl sm:max-w-md lg:max-w-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
