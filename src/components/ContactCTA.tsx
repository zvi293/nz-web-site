import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contactInfo, getWhatsAppHref } from "@/lib/contact-utils";

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
      className="nz-grain relative overflow-hidden py-16 md:py-24"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-1/[0.07] via-background to-brand-3/[0.09]" />
      <div className="nz-grid opacity-60" aria-hidden="true" />

      {/* Orbs */}
      <div ref={orb1Ref} className="absolute -top-20 right-[5%] w-[400px] h-[400px] rounded-full bg-brand-2/[0.14] blur-[130px]" />
      <div ref={orb2Ref} className="absolute -bottom-16 left-[8%] w-[320px] h-[320px] rounded-full bg-brand-1/[0.12] blur-[110px]" />
      <div ref={orb3Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-3/[0.07] blur-[150px]" />

      <div className="relative z-10 container mx-auto max-w-4xl px-6">
        {/* Main card */}
        <div ref={cardRef} className="glass-strong ring-gradient relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-10 md:p-16">

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

            <h2 ref={title1Ref} className="text-section-title mb-1 font-heebo text-foreground">
              יש לכם רעיון?
            </h2>
            <h2 ref={title2Ref} className="text-section-title mb-5 font-heebo">
              <span className="text-gradient-brand">בואו נהפוך אותו למציאות</span>
            </h2>

            <p ref={descRef} className="text-lede mx-auto mb-9 max-w-lg text-pretty font-heebo text-muted-foreground">
              ספרו לנו על הפרויקט שלכם ונחזור אליכם עם הצעה מותאמת אישית
            </p>

            <div ref={btnRef} className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/contact/"
                className="btn-brand group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:w-auto sm:px-12"
              >
                צרו קשר עכשיו
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              <a
                href={getWhatsAppHref(contactInfo)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-glass inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-foreground sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                וואטסאפ
              </a>
            </div>

            <p className="mt-6 text-xs font-medium text-muted-foreground/80">
              בדרך כלל חוזרים אליכם באותו יום עסקים · ללא התחייבות
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
