import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Monitor, Code2, Briefcase, CalendarDays, Target, Globe,
  ArrowLeft, Zap, CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import BackToHome from "@/components/BackToHome";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const services = [
  {
    icon: Monitor,
    title: "בניית אתרים מקצועיים",
    subtitle: "Full-Stack Development",
    description: "אתרים מהירים, יציבים ומרהיבים שבנויים לביצועים ולתוצאות עסקיות אמיתיות.",
    features: ["React + TypeScript", "מובייל-פירסט", "SEO טכני", "ממשק ניהול"],
    href: "/services/web-development",
    accent: "#3b82f6",
    accentRgb: "59,130,246",
    popular: false,
  },
  {
    icon: Briefcase,
    title: "אתר תדמית לעסקים",
    subtitle: "Business Website",
    description: "כרטיס הביקור הדיגיטלי שלכם — עובד 24/6, בונה אמון ומביא לידים.",
    features: ["עיצוב ייחודי לברנד", "תוכן ממיר", "סוציאל פרוף", "SEO אורגני"],
    href: "/services/business-website",
    accent: "#8b5cf6",
    accentRgb: "139,92,246",
    popular: true,
  },
  {
    icon: Code2,
    title: "פיתוח אתרים",
    subtitle: "Advanced Development",
    description: "ארכיטקטורה נכונה שמחזיקה לאורך שנים — מסד נתונים, API ומערכות מורכבות.",
    features: ["ארכיטקטורה מתקדמת", "Supabase + PostgreSQL", "CI/CD", "Scalable"],
    href: "/services/website-development",
    accent: "#10b981",
    accentRgb: "16,185,129",
    popular: false,
  },
  {
    icon: CalendarDays,
    title: "מערכת ניהול תורים",
    subtitle: "Appointment System",
    description: "תפסיקו לנהל תורים בטלפון — מערכת חכמה שחוסכת שעות בשבוע.",
    features: ["הזמנות אונליין 24/6", "תזכורות אוטומטיות", "דוחות ואנליטיקס", "Google Calendar"],
    href: "/services/appointment-system",
    accent: "#f97316",
    accentRgb: "249,115,22",
    popular: false,
  },
  {
    icon: Target,
    title: "דפי נחיתה",
    subtitle: "Landing Pages",
    description: "דפים שממירים גולשים ללקוחות — בנויים לקמפיינים ממומנים ולקידום אורגני.",
    features: ["עיצוב ממוקד המרה", "זמן טעינה <2s", "A/B Testing", "אינטגרציה לפרסום"],
    href: "/services/landing-page-development",
    accent: "#ec4899",
    accentRgb: "236,72,153",
    popular: false,
  },
  {
    icon: Globe,
    title: "React Development",
    subtitle: "SPA & Web Apps",
    description: "אפליקציות React מתקדמות — Single Page Applications, דשבורדים ומערכות UI.",
    features: ["React 18 + Hooks", "State Management", "Performance", "TypeScript"],
    href: "/services/react-development",
    accent: "#14b8a6",
    accentRgb: "20,184,166",
    popular: false,
  },
];

const whyUs = [
  { icon: Zap, text: "ביצועים מדידים — ניקוד 90+ ב-PageSpeed לכל אתר" },
  { icon: CheckCircle, text: "תמיכה 30 יום אחרי השקה — אנחנו לא נעלמים" },
  { icon: Monitor, text: "עיצוב מותאם לקהל שלכם, לא תבנית גנרית" },
  { icon: Code2, text: "קוד נקי שניתן לתחזק ולהרחיב לאורך שנים" },
];

const ServicesIndex = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true });

  useSeoMeta({
    title: "השירותים שלנו | NZ-web – פיתוח אתרים ועיצוב UI/UX",
    description: "כל שירותי NZ-web במקום אחד — בניית אתרים, אתרי תדמית, פיתוח React, מערכת תורים ודפי נחיתה. Full-Stack, UI/UX ואוטומציות AI.",
  });
  useBreadcrumb({ name: "שירותים", path: "/services" });

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <AmbientShapes />
      <Header />
      <BackToHome />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/[0.04] blur-[120px]" />
        </div>
        <div ref={headerRef} className="container relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            מה אנחנו עושים
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 text-4xl font-black leading-tight text-foreground md:text-6xl"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            הפתרונות שיקחו את{" "}
            <span className="text-gradient-brand">העסק שלכם קדימה</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            מפיתוח אתרים מלא ועד מערכות אוטומציה — אנחנו בונים פתרונות דיגיטליים שעובדים.
            כל פרויקט מתחיל מהבנת הצרכים שלכם ומסתיים בתוצאות מדידות.
          </motion.p>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto max-w-6xl px-5 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.href}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  {svc.popular && (
                    <div className="absolute -top-3 right-6 z-10 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-lg shadow-primary/30">
                      ✦ הכי פופולרי
                    </div>
                  )}
                  <button
                    onClick={() => navigate(svc.href)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-card p-7 text-right transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{
                      borderColor: svc.popular ? `rgba(${svc.accentRgb},0.35)` : "hsl(var(--border)/0.5)",
                    }}
                  >
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle at 50% 0%, rgba(${svc.accentRgb},0.07), transparent 70%)` }}
                    />
                    {/* Top accent line */}
                    <div
                      className="absolute right-0 top-0 h-[3px] w-full transition-all duration-500"
                      style={{ background: `linear-gradient(to left, transparent, rgba(${svc.accentRgb},0.6), transparent)` }}
                    />

                    {/* Icon */}
                    <div
                      className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `rgba(${svc.accentRgb},0.12)` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: svc.accent }} strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <div className="relative z-10 flex flex-1 flex-col">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: svc.accent }}>
                        {svc.subtitle}
                      </p>
                      <h2 className="mb-3 text-xl font-black leading-snug text-foreground"
                        style={{ fontFamily: "'Heebo', sans-serif" }}>
                        {svc.title}
                      </h2>
                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground flex-1">
                        {svc.description}
                      </p>

                      {/* Feature tags */}
                      <div className="mb-5 flex flex-wrap gap-2">
                        {svc.features.map((f) => (
                          <span
                            key={f}
                            className="rounded-full px-3 py-1 text-[11px] font-medium"
                            style={{ backgroundColor: `rgba(${svc.accentRgb},0.1)`, color: svc.accent }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div
                        className="flex items-center gap-2 text-sm font-bold transition-all duration-200 group-hover:gap-3"
                        style={{ color: svc.accent }}
                      >
                        קרא עוד
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why us strip ── */}
      <section className="bg-secondary/30 py-14 md:py-18">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.p
            className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            למה NZ-web?
          </motion.p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {whyUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card p-5"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.45 }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 py-20 text-center md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />
        </div>
        <motion.div
          className="container relative z-10 mx-auto max-w-2xl px-6"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <h2 className="mb-5 text-3xl font-black leading-tight text-white md:text-5xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
            לא בטוחים איזה שירות מתאים לכם?
          </h2>
          <p className="mb-10 text-lg text-white/60">
            דברו איתנו — נבין את הצרכים ונמליץ על הפתרון הנכון. בלי התחייבות.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.04] hover:brightness-110 btn-glow"
          >
            <MessageCircle className="h-5 w-5" />
            פגישת ייעוץ ללא עלות
          </button>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

// Inline import for icon (same file)
const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default ServicesIndex;
