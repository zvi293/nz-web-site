import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const ContactCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<(HTMLDivElement | null)[]>([]);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;

    const card = cardRef.current;
    const glowLine = glowLineRef.current;
    const icon = iconRef.current;
    const titles = [title1Ref.current, title2Ref.current].filter(Boolean);
    const desc = descRef.current;
    const btn = btnRef.current;
    const sparkles = sparklesRef.current.filter(Boolean);
    let entranceTl: gsap.core.Timeline | null = null;
    let floatTween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      gsap.set(card, { y: 40, opacity: 0, scale: 0.95 });
      if (glowLine) gsap.set(glowLine, { x: "-100%" });
      if (icon) gsap.set(icon, { y: 34, opacity: 0 });
      if (titles.length > 0) gsap.set(titles, { y: 42, opacity: 0 });
      if (desc) gsap.set(desc, { y: 28, opacity: 0 });
      if (btn) gsap.set(btn, { y: 24, opacity: 0, scale: 0.96 });
      if (sparkles.length > 0) gsap.set(sparkles, { scale: 0, opacity: 0 });

      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: -60, scale: 1.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: 50, x: 30,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          y: -40,
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      }

      entranceTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          floatTween = gsap.to(card, {
            y: -5,
            boxShadow: "0 8px 80px -12px hsl(217 91% 60% / 0.2)",
            duration: 4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        },
      });

      entranceTl.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.05,
        clearProps: "transform,opacity",
      });

      if (glowLine) {
        entranceTl.to(
          glowLine,
          {
            x: "200%",
            duration: 1.4,
            ease: "power2.inOut",
            clearProps: "transform",
          },
          "-=0.72",
        );
      }

      if (icon) {
        entranceTl.to(
          icon,
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            clearProps: "transform,opacity",
          },
          "-=0.82",
        );
      }

      if (titles.length > 0) {
        entranceTl.to(
          titles,
          {
            y: 0,
            opacity: 1,
            duration: 0.82,
            stagger: 0.16,
            clearProps: "transform,opacity",
          },
          "-=0.48",
        );
      }

      if (desc) {
        entranceTl.to(
          desc,
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            clearProps: "transform,opacity",
          },
          "-=0.36",
        );
      }

      if (btn) {
        entranceTl.to(
          btn,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.76,
            clearProps: "transform,opacity",
          },
          "-=0.28",
        );
      }

      if (sparkles.length > 0) {
        entranceTl.to(
          sparkles,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: { each: 0.06, from: "center" },
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.4",
        );
      }

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          entranceTl?.play(0);
        },
      });
    }, sectionRef);

    return () => {
      trigger?.kill();
      floatTween?.kill();
      entranceTl?.kill();
      ctx.revert();
    };
  }, []);

  const setSparkleRef = (i: number) => (el: HTMLDivElement | null) => {
    sparklesRef.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-20"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-accent/[0.08]" />

      {/* Orbs */}
      <div ref={orb1Ref} className="absolute -top-20 right-[5%] w-[400px] h-[400px] rounded-full bg-primary/[0.1] blur-[130px]" />
      <div ref={orb2Ref} className="absolute -bottom-16 left-[8%] w-[320px] h-[320px] rounded-full bg-primary/[0.08] blur-[110px]" />
      <div ref={orb3Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[150px]" />

      <div className="relative z-10 container mx-auto max-w-4xl px-6">
        {/* Main card */}
        <div ref={cardRef} className="relative rounded-[2rem] border border-primary/15 bg-card/80 backdrop-blur-xl p-10 md:p-16 text-center shadow-[0_8px_60px_-12px_hsl(var(--primary)/0.15)] overflow-hidden">

          {/* Animated glow line */}
          <div ref={glowLineRef} className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none" />

          {/* Inner glow */}
          <div className="absolute inset-[1px] rounded-[2rem] bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05] pointer-events-none" />

          {/* Sparkle dots */}
          <div ref={setSparkleRef(0)} className="absolute top-6 right-10 w-2.5 h-2.5 rounded-full bg-primary/40" />
          <div ref={setSparkleRef(1)} className="absolute top-14 left-12 w-2 h-2 rounded-full bg-primary/30" />
          <div ref={setSparkleRef(2)} className="absolute top-8 left-[40%] w-1.5 h-1.5 rounded-full bg-primary/25" />
          <div ref={setSparkleRef(3)} className="absolute bottom-10 right-20 w-3 h-3 rounded-full bg-primary/25" />
          <div ref={setSparkleRef(4)} className="absolute bottom-8 left-14 w-2 h-2 rounded-full bg-primary/35" />
          <div ref={setSparkleRef(5)} className="absolute bottom-16 right-[35%] w-2 h-2 rounded-full bg-primary/20" />

          <div className="relative z-10">
            {/* Logo */}
            <div ref={iconRef} className="mb-8">
              <span className="text-3xl font-black tracking-tight text-foreground font-heebo" style={{ letterSpacing: "-0.02em" }}>
                NZ<span className="text-gradient-brand">-web</span>
              </span>
            </div>

            <h2 ref={title1Ref} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.15] font-heebo mb-1">
              יש לכם רעיון?
            </h2>
            <h2 ref={title2Ref} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.15] font-heebo mb-5">
              <span className="text-gradient-brand">בואו נהפוך אותו למציאות</span>
            </h2>

            <p ref={descRef} className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed font-heebo">
              ספרו לנו על הפרויקט שלכם ונחזור אליכם עם הצעה מותאמת אישית
            </p>

            <div ref={btnRef}>
              <Link to="/contact/">
                <Button
                  size="lg"
                  className="gap-2.5 text-base font-semibold px-12 py-7 rounded-2xl btn-glow hover:scale-[1.04] active:scale-[0.97] transition-transform duration-200"
                >
                  צרו קשר עכשיו
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
