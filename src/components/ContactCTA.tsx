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

    const ctx = gsap.context(() => {
      // Set initial hidden states
      gsap.set(card, { y: 40, opacity: 0, scale: 0.95 });
      gsap.set(glowLine, { x: "-100%" });
      gsap.set(icon, { opacity: 0, scale: 0.5, rotation: -90 });
      gsap.set(titles, { y: 30, opacity: 0 });
      gsap.set(desc, { y: 15, opacity: 0, filter: "blur(4px)" });
      gsap.set(btn, { y: 20, opacity: 0, scale: 0.9 });
      gsap.set(sparkles, { scale: 0, opacity: 0 });

      // Scrub-based parallax for orbs
      gsap.to(orb1Ref.current, {
        y: -60, scale: 1.2,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(orb2Ref.current, {
        y: 50, x: 30,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(orb3Ref.current, {
        y: -40,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });

      // Card entrance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: () => playEntrance(),
        onEnterBack: () => playEntrance(),
        onLeave: () => resetToHidden(),
        onLeaveBack: () => resetToHidden(),
      });

      function resetToHidden() {
        gsap.set(card, { y: 40, opacity: 0, scale: 0.95 });
        gsap.set(glowLine, { x: "-100%" });
        gsap.set(icon, { opacity: 0, scale: 0.5, rotation: -90 });
        gsap.set(titles, { y: 30, opacity: 0 });
        gsap.set(desc, { y: 15, opacity: 0, filter: "blur(4px)" });
        gsap.set(btn, { y: 20, opacity: 0, scale: 0.9 });
        gsap.set(sparkles, { scale: 0, opacity: 0 });
      }

      function playEntrance() {
        const tl = gsap.timeline();

        tl.to(card, {
          y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power3.out",
        })
        .to(glowLine, {
          x: "200%", duration: 1.6, ease: "power2.inOut",
        }, "-=0.8")
        .to(icon, {
          opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "power2.out",
        }, "-=1")
        .to(titles, {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: "power2.out",
        }, "-=0.6")
        .to(desc, {
          y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out",
        }, "-=0.4")
        .to(btn, {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power2.out",
        }, "-=0.3")
        .to(sparkles, {
          scale: 1, opacity: 1, duration: 0.6, stagger: { each: 0.08, from: "center" }, ease: "power2.out",
        }, "-=0.4");
      }

      // Floating + pulsing glow
      gsap.to(card, {
        y: -5,
        boxShadow: "0 8px 80px -12px hsl(217 91% 60% / 0.2)",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const setSparkleRef = (i: number) => (el: HTMLDivElement | null) => {
    sparklesRef.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 md:py-40"
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
                NZ<span className="text-gradient-brand">-WEB</span>
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
              <Link to="/contact">
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
