import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Gauge, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import heroVisual from "@/assets/hero-visual.png";

const stats = [
  { value: 50, suffix: "+", label: "פרויקטים" },
  { value: 5, suffix: "+", label: "שנות ניסיון" },
  { value: 100, suffix: "%", label: "שביעות רצון" },
];

const trustPoints = [
  { icon: Gauge, label: "ציוני ביצועים גבוהים" },
  { icon: Smartphone, label: "מובייל-פירסט 100%" },
  { icon: ShieldCheck, label: "נגישות ותקינה" },
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
const pricingLabel = "החבילות שלנו";
const heroImageAlt = "NZ-web – עיצוב ופיתוח אתרים מתקדם";

/* ── Stats strip — glass chips that read as "proof", not decoration ── */
const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="grid w-full max-w-md grid-cols-3 gap-2 pt-1 sm:gap-3"
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl px-3 py-2.5 text-center sm:px-4 sm:py-3"
        >
          <span className="block text-xl font-black leading-none text-transparent sm:text-2xl"
            style={{
              backgroundImage: "linear-gradient(120deg, hsl(var(--brand-1)), hsl(var(--brand-3)))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            <AnimatedNumber value={stat.value} suffix={stat.suffix} isInView={isInView} />
          </span>
          <span className="mt-1 block text-[10.5px] font-semibold text-muted-foreground sm:text-xs">
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

/* ── Small floating credential cards over the hero visual (sm+ only) ── */
const FloatingBadge = ({
  className,
  icon: Icon,
  title,
  subtitle,
  delay,
}: {
  className: string;
  icon: typeof Gauge;
  title: string;
  subtitle: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`glass-strong pointer-events-none absolute z-20 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:flex ${className}`}
  >
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-1/20 to-brand-3/20 text-primary">
      <Icon className="h-4 w-4" strokeWidth={2.2} />
    </span>
    <span className="text-right leading-tight">
      <span className="block text-[13px] font-black text-foreground">{title}</span>
      <span className="block text-[10.5px] font-medium text-muted-foreground">{subtitle}</span>
    </span>
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
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
      const badge = badgeRef.current;
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const subtext = subtextRef.current;
      const buttons = buttonsRef.current;

      if (prefersReducedMotion) {
        gsap.set([visualIntro, visualParallax, visualFloat, badge, line1, line2, subtext, buttons], {
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
      gsap.set([badge, subtext, buttons], { opacity: 0 });
      /* Lines rise out of their overflow-hidden mask — the classic editorial reveal. */
      gsap.set([line1, line2], { opacity: 0, yPercent: 108 });
      gsap.set(badge, { y: -12 });
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

      if (badge) {
        tl.to(badge, { opacity: 1, y: 0, duration: 0.6 }, "-=1.1");
      }

      if (line1) {
        tl.to(
          line1,
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.9,
            ease: "expo.out",
          },
          "-=0.62",
        );
      }

      if (line2) {
        tl.to(
          line2,
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.98,
            ease: "expo.out",
          },
          "-=0.74",
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
          "-=0.5",
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
          "-=0.4",
        );
      }
    }, sectionRef);

    /* Failsafe — the headline is the single most important element on the site,
       and the intro starts it at opacity 0. If rAF never runs (background tab on
       first paint, a throttling browser, a stalled tween), snap the timeline to
       its end so the hero can never be left invisible. */
    const failsafe = window.setTimeout(() => {
      const tl = introTimelineRef.current;
      if (tl && tl.progress() < 1) tl.progress(1);
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
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

    // Primary pointer is a mouse/trackpad. `(pointer: fine)` is reliable where
    // `(hover:)` lies on Android and `maxTouchPoints` lies on Windows laptops.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const MAX_DEG = 18; // tilt amount (degrees)
    const MAX_SHIFT = 16; // positional drift toward the cursor (px) — adds depth
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(tilt, {
        transformPerspective: 1100, // 3D depth lives on the element itself — never depends on a parent
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

    // Primary pointer is touch (coarse). Reliable where `(hover:)` lies on
    // Android and `maxTouchPoints` lies on Windows laptops.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!coarsePointer || reduced) return; // desktop already has the mouse-tilt

    let lastY = window.scrollY;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) < 0.5) return;
      const dir = delta > 0 ? 1 : -1; // down → +, up → −
      gsap.to(tilt, {
        transformPerspective: 1100, // 3D depth lives on the element itself — never depends on a parent
        rotateX: dir * 18,
        y: dir * 9,
        duration: 0.45,
        ease: "power2.out",
      });
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        gsap.to(tilt, { rotateX: 0, y: 0, duration: 0.85, ease: "power3.out" });
      }, 240);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(resetTimer);
      gsap.killTweensOf(tilt);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      aria-label={heroAriaLabel}
      className="nz-grain relative overflow-hidden bg-background"
    >
      {/* ── Atmosphere: aurora + technical grid + a soft ceiling wash ── */}
      <div className="nz-aurora" aria-hidden="true" />
      <div className="nz-grid opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
        style={{ background: "linear-gradient(to bottom, hsl(var(--brand-2) / 0.07), transparent)" }}
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-140px)] flex-col items-center gap-9 py-10 sm:gap-12 sm:py-14 lg:min-h-[calc(100svh-72px)] lg:flex-row lg:gap-16 lg:py-0 xl:gap-20">
        {/* Right Side - Content */}
        <div className="flex flex-1 flex-col items-start gap-5 sm:gap-6">
          {/* Availability pill */}
          <div ref={badgeRef} className="nz-eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="nz-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            פנויים לפרויקטים חדשים
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          {/* Headline */}
          <h1 className="text-display text-foreground">
            <span className="reveal-mask">
              <span ref={line1Ref} className="block">{heroLine1}</span>
            </span>
            <span className="reveal-mask mt-0.5 sm:mt-1.5">
              <span
                ref={line2Ref}
                className="block whitespace-normal text-gradient-brand sm:whitespace-nowrap"
              >
                {heroLine2}
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="text-lede max-w-lg text-pretty text-muted-foreground">
            {heroParagraph}
          </p>

          {/* Buttons */}
          {/* Mobile: one full-width primary, then the two secondaries side by side.
              sm+: everything collapses onto a single inline row (`sm:contents`). */}
          <div ref={buttonsRef} className="flex w-full max-w-md flex-col gap-2.5 pt-1 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-3.5">
            <Link
              to="/contact/"
              className="btn-brand group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-bold hover:scale-[1.03] active:scale-[0.97] sm:px-9 sm:text-base">
              {contactLabel}
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
            <div className="grid grid-cols-2 gap-2.5 sm:contents">
              <Link
                to="/services/"
                className="btn-ghost-glass inline-flex items-center justify-center rounded-2xl px-4 py-4 text-[14px] font-semibold text-foreground hover:scale-[1.03] active:scale-[0.97] sm:px-9 sm:text-base">
                {aboutLabel}
              </Link>
              <a
                href="#pricing"
                onClick={(e) => { e.preventDefault(); scrollToSelectorWithRetry("#pricing"); }}
                className="inline-flex items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.06] px-4 py-4 text-[14px] font-semibold text-primary transition-all duration-200 hover:scale-[1.03] hover:bg-primary/[0.12] active:scale-[0.97] sm:px-9 sm:text-base">
                {pricingLabel}
              </a>
            </div>
          </div>

          {/* Stats */}
          <StatsBar />

          {/* Trust row */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-muted-foreground sm:gap-x-5 sm:text-[13px]">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Left Side - Visual */}
        <div className="flex w-full flex-1 items-center justify-center">
          <div ref={visualParallaxRef} className="relative w-full will-change-transform">
            <div ref={visualIntroRef} className="will-change-transform">
              {/* float wrapper (CSS keyframe drift) → tilt wrapper (GSAP 3D tilt).
                  The tilt carries its own transformPerspective, so the 3D effect
                  never depends on — and can never be flattened by — a parent. */}
              <div ref={visualFloatRef} className="nz-hero-float relative will-change-transform">
                {/* glow bed behind the artwork */}
                <div
                  className="pointer-events-none absolute inset-6 -z-10 rounded-full opacity-70 blur-[70px]"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(var(--brand-2) / 0.35), hsl(var(--brand-1) / 0.2) 45%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div ref={tiltRef} className="relative mx-auto w-full max-w-sm will-change-transform sm:max-w-md lg:max-w-xl">
                  <div className="ring-gradient overflow-hidden rounded-[1.75rem] shadow-floating">
                    <img
                      src={heroVisual}
                      alt={heroImageAlt}
                      className="w-full"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <FloatingBadge
                    className="-top-4 right-2 lg:-right-6"
                    icon={Gauge}
                    title="ביצועים מהירים"
                    subtitle="טעינה חדה בכל מכשיר"
                    delay={1.15}
                  />
                  <FloatingBadge
                    className="-bottom-5 left-2 lg:-left-8"
                    icon={Smartphone}
                    title="מובייל-פירסט"
                    subtitle="מושלם בכל מסך"
                    delay={1.35}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue — desktop only, sits inside the hero's bottom padding */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
          גלול
        </span>
        <span className="flex h-8 w-5 items-start justify-center rounded-full border border-border pt-1.5">
          <span className="nz-scroll-cue h-1.5 w-1 rounded-full bg-primary" />
        </span>
      </div>

      {/* Bottom fade divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
