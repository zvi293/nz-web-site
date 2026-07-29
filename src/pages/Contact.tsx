import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Phone, Mail, Sparkles } from "lucide-react";
import gsap from "gsap";
import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getMailtoHref, getTelHref, contactInfo } from "@/lib/contact-utils";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const floatingParticles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  x: 10 + Math.random() * 80,
  y: 10 + Math.random() * 80,
  delay: i * 0.3,
  duration: 4 + Math.random() * 3
}));

const Contact = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  useSeoMeta({
    title: "צרו קשר | קבלו הצעת מחיר לבניית אתר | NZ-web",
    description:
      "צרו קשר עם NZ-web לקבלת הצעת מחיר לבניית אתר, פיתוח אתרים או מערכת ניהול תורים. שיחת ייעוץ ראשונית חינם. נחזור אליכם תוך 24 שעות.",
    keywords: "הצעת מחיר לבניית אתר, צרו קשר NZ-web, ייעוץ בניית אתר חינם, בניית אתר מחיר",
  });
  useBreadcrumb({ name: "צרו קשר", path: "/contact" });
  const infoCards = [
    {
      icon: Phone,
      title: "טלפון",
      value: contactInfo.phone,
      href: getTelHref(contactInfo.phone)
    },
    {
      icon: Mail,
      title: "אימייל",
      value: contactInfo.email,
      href: getMailtoHref(contactInfo.email)
    },
    {
      icon: Clock,
      title: "שעות פעילות",
      value: "א׳–ה׳ 09:00–18:00"
    }
  ];

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll(".hero-anim");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out" }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />

      {/* ג”€ג”€ Hero Banner ג”€ג”€ */}
      <section
        ref={heroRef}
        className="nz-brand-dark nz-grain relative overflow-hidden py-24 md:py-32">

        {/* Floating particles */}
        {floatingParticles.map((p) =>
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }} />

        )}

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.32), transparent 65%)" }}
          />
          <div
            className="absolute bottom-0 right-[10%] w-[320px] h-[320px] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-1) / 0.26), transparent 65%)" }}
          />
        </div>

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <span className="hero-anim nz-eyebrow mb-6 border-white/15 bg-white/[0.07] text-white/85">
            <Sparkles className="h-3.5 w-3.5" />
            שיחת ייעוץ ראשונה ללא עלות
          </span>
          <h1 className="hero-anim text-display mb-5 text-white font-heebo">
            בואו נבנה משהו
            <span className="text-gradient-brand"> מדהים </span>
            יחד
          </h1>

          <p className="hero-anim text-lede mx-auto max-w-2xl text-pretty text-white/70 font-heebo">
            ספרו לנו על הפרויקט שלכם ואנחנו נחזור אליכם עם הצעה מותאמת אישית
          </p>
        </div>
      </section>

      {/* ג”€ג”€ Info Cards ג”€ג”€ */}
      <section className="relative z-20 -mt-12 mb-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              const inner =
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-5 text-center shadow-elevated transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-floating">
                
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                  <span className="text-sm font-bold text-foreground">{card.value}</span>
                </motion.div>;

              return card.href ?
              <a key={i} href={card.href} className="no-underline">
                  {inner}
                </a> :
              <div key={i}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ג”€ג”€ Contact Form ג”€ג”€ */}
      <ContactSection />

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </main>);

};

export default Contact;
