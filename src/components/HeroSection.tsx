import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import heroVisual from "@/assets/hero-visual.png";

gsap.registerPlugin(ScrollTrigger);

const heroAriaLabel = "\u05E8\u05D0\u05E9\u05D9 \u2013 NZ-web \u05E1\u05D8\u05D5\u05D3\u05D9\u05D5 \u05DC\u05E4\u05D9\u05EA\u05D5\u05D7 \u05D5\u05E2\u05D9\u05E6\u05D5\u05D1 \u05D0\u05EA\u05E8\u05D9\u05DD";
const heroLine1 = "\u05E7\u05D5\u05D3 \u05E0\u05E7\u05D9.";
const heroLine2 = "\u05E2\u05D9\u05E6\u05D5\u05D1 \u05E9\u05D5\u05D1\u05E8 \u05E9\u05D2\u05E8\u05D4.";
const heroParagraph =
  "\u05D0\u05E0\u05D7\u05E0\u05D5 \u05D1-NZ-web \u05DE\u05E4\u05EA\u05D7\u05D9\u05DD \u05D7\u05D5\u05D5\u05D9\u05D5\u05EA \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05D5\u05EA \u05DE\u05E8\u05D4\u05D9\u05D1\u05D5\u05EA, \u05D4\u05D7\u05DC \u05DE\u05D0\u05EA\u05E8\u05D9 \u05EA\u05D3\u05DE\u05D9\u05EA \u05D9\u05D5\u05E7\u05E8\u05EA\u05D9\u05D9\u05DD \u05D5\u05E2\u05D3 \u05D7\u05E0\u05D5\u05D9\u05D5\u05EA \u05D0\u05D9\u05E7\u05D5\u05DE\u05E8\u05E1 \u05DE\u05D5\u05E8\u05DB\u05D1\u05D5\u05EA, \u05E2\u05DD \u05D1\u05D9\u05E6\u05D5\u05E2\u05D9\u05DD \u05D7\u05E1\u05E8\u05D9 \u05E4\u05E9\u05E8\u05D5\u05EA.";
const contactLabel = "\u05D3\u05D1\u05E8\u05D5 \u05D0\u05D9\u05EA\u05E0\u05D5";
const aboutLabel = "\u05E7\u05E6\u05EA \u05E2\u05DC\u05D9\u05E0\u05D5";
const heroImageAlt = "NZ-web \u2013 \u05E2\u05D9\u05E6\u05D5\u05D1 \u05D5\u05E4\u05D9\u05EA\u05D5\u05D7 \u05D0\u05EA\u05E8\u05D9\u05DD \u05DE\u05EA\u05E7\u05D3\u05DD";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const visualIntroRef = useRef<HTMLDivElement>(null);
  const visualParallaxRef = useRef<HTMLDivElement>(null);
  const visualFloatRef = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
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
      gsap.set(visualFloat, { y: 0 });

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
        onComplete: () => {
          if (visualFloat) {
            floatTweenRef.current = gsap.to(visualFloat, {
              y: -8,
              duration: 5.4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        },
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
      floatTweenRef.current?.kill();
      floatTweenRef.current = null;
      parallaxTweenRef.current?.kill();
      parallaxTweenRef.current = null;
      introTimelineRef.current?.kill();
      introTimelineRef.current = null;
      ctx.revert();
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

      <div className="container relative z-10 mx-auto flex min-h-[90vh] flex-col items-center gap-14 px-6 py-20 lg:flex-row lg:gap-20 lg:py-0">
        {/* Right Side - Content */}
        <div className="flex flex-1 flex-col items-start gap-8">
          {/* Studio badge */}

          {/* Headline */}
          <h1 className="text-[2.75rem] font-black leading-[1.1] tracking-tight text-foreground md:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem]">
            <span ref={line1Ref} className="block">{heroLine1}</span>
            <span ref={line2Ref} className="mt-2 block whitespace-nowrap text-gradient-brand">
              {heroLine2}
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="max-w-md text-[1.1rem] leading-[1.85] text-muted-foreground md:text-lg">
            {heroParagraph}
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/contact"
              className="btn-glow rounded-xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]">
              {contactLabel}
            </Link>
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
              className="rounded-xl border border-border/80 bg-background px-10 py-4 text-base font-medium text-foreground transition-all duration-200 hover:scale-[1.04] hover:border-primary/30 hover:bg-primary/[0.04] active:scale-[0.97]">
              {aboutLabel}
            </a>
          </div>
        </div>

        {/* Left Side - Visual */}
        <div className="flex flex-1 items-center justify-center">
          <div ref={visualParallaxRef} className="relative will-change-transform">
            <div ref={visualIntroRef} className="will-change-transform">
              <div ref={visualFloatRef} className="will-change-transform">
                <img
                  src={heroVisual}
                  alt={heroImageAlt}
                  className="soft-shadow-lg w-full max-w-lg rounded-2xl lg:max-w-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
