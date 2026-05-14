import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Ear, Sparkles } from "lucide-react";

/**
 * Warm "getting to know us" intro section for the homepage.
 * Studio voice ("אנחנו"), grounded in the real About-page content.
 * Sits right after the hero — connects emotionally before talking services.
 *
 * The right-side visual is a looping "a website being built" animation.
 * It is driven by pure CSS @keyframes (see index.css: nz-build-block / nz-float-*
 * / nz-build-shimmer) rather than JS — so it always runs, regardless of
 * framer-motion timing or hydration. Each build block is phase-shifted with a
 * negative animation-delay, producing a perpetual staggered build.
 */

const VALUES = [
  {
    icon: Ear,
    title: "הקשבה לפני הכול",
    description:
      "כל פרויקט מתחיל בלהבין את העסק, הקהל והמטרה — לא בפתיחת קובץ עיצוב. אנחנו נשארים לצידכם גם אחרי ההשקה.",
    accent: "#3b82f6",
  },
  {
    icon: Sparkles,
    title: "מקצועיות בלי פשרות",
    description: "קוד נקי, ביצועים גבוהים ותשומת לב לכל פרט — Perfect in every Pixel.",
    accent: "#8b5cf6",
  },
];

const AboutIntroSection = () => {
  return (
    <section
      id="about-intro"
      dir="rtl"
      className="relative overflow-hidden py-16 md:py-24"
      aria-label="קצת עלינו"
    >
      {/* Soft ambient glow — consistent with the rest of the site */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-0 h-[420px] w-[420px] rounded-full bg-primary/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-right"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
              קצת עלינו
            </p>
            <h2
              className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              לא סתם עוד סטודיו{" "}
              <span className="text-gradient-brand">לבניית אתרים</span>
            </h2>
            <div className="space-y-4 text-base leading-[1.95] text-muted-foreground md:text-lg">
              <p>
                NZ-web הוא סטודיו קטן עם גישה גדולה. אנחנו מאמינים שאתר הוא לא רק עיצוב יפה או
                קוד נקי — הוא הדרך של העסק שלכם לפגוש את הלקוחות שלו. ולכן אנחנו ניגשים לכל
                פרויקט מתוך הקשבה אמיתית, לא מתוך תבנית.
              </p>
              <p>
                אנחנו לא רק מעצבים ובונים — אנחנו חושבים יחד אתכם. לוקחים את החזון שאתם חיים
                יום-יום, ומזקקים אותו למשהו ויזואלי, חד ומדויק. בכל פרויקט שיוצא מהידיים שלנו
                אנחנו משאירים חלק מעצמנו — והוא מדבר בדיוק בשפה שלכם.
              </p>
            </div>

            {/* Values */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {VALUES.map((value, i) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                    className="rounded-2xl border border-border/40 bg-card p-5"
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${value.accent}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: value.accent }} strokeWidth={1.9} />
                    </div>
                    <h3 className="mb-1.5 text-sm font-black text-foreground">{value.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:brightness-110"
              >
                דברו איתנו
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3"
              >
                להכיר אותנו קצת יותר
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* ── Animated "website being built" graphic — desktop only (decorative) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden items-center justify-center lg:flex"
          >
            <div className="relative w-full max-w-md">
              {/* ambient glow */}
              <div className="absolute inset-0 -z-10 mx-auto h-72 w-72 rounded-full bg-primary/15 blur-[110px]" />

              {/* floating accent shapes (pure-CSS animation) */}
              <div className="nz-float-a absolute -right-3 -top-5 z-20 h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-400 shadow-lg shadow-primary/30" />
              <div className="nz-float-b absolute -left-4 bottom-12 z-20 h-9 w-9 rounded-full bg-emerald-400/90 shadow-lg shadow-emerald-500/30" />
              <div className="nz-float-c absolute -left-2 top-6 z-20 h-7 w-7 rounded-lg border-2 border-primary/50" />

              {/* "design canvas" window */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/95 shadow-[0_24px_80px_-20px_hsl(var(--foreground)/0.18)] backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-[1px] rounded-[2rem] bg-gradient-to-br from-primary/[0.06] via-transparent to-emerald-500/[0.05]" />

                {/* window header */}
                <div className="relative flex items-center gap-1.5 border-b border-border/40 px-5 py-3.5" dir="ltr">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="ms-auto text-[11px] font-semibold tracking-wide text-muted-foreground">
                    nz-web.com
                  </span>
                </div>

                {/* animated build stage — pure-CSS keyframes, staggered via animation-delay */}
                <div className="relative p-5">
                  <div className="relative overflow-hidden">
                    <div className="flex flex-col gap-3">
                      {/* nav bar */}
                      <div className="nz-build-block flex items-center gap-2" style={{ animationDelay: "-3s" }}>
                        <div className="h-5 w-14 rounded-md bg-gradient-to-l from-primary to-blue-400" />
                        <div className="ms-auto flex gap-1.5">
                          <div className="h-2 w-7 rounded bg-muted-foreground/25" />
                          <div className="h-2 w-7 rounded bg-muted-foreground/25" />
                          <div className="h-2 w-7 rounded bg-muted-foreground/25" />
                        </div>
                      </div>

                      {/* hero — text column then visual block build separately */}
                      <div className="flex gap-3">
                        <div
                          className="nz-build-block flex w-[52%] flex-col justify-center gap-2"
                          style={{ animationDelay: "-2.6s" }}
                        >
                          <div className="h-3 w-full rounded bg-muted-foreground/30" />
                          <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                          <div className="mt-1.5 h-6 w-20 rounded-md bg-gradient-to-l from-primary to-blue-400" />
                        </div>
                        <div
                          className="nz-build-block h-[78px] flex-1 rounded-xl bg-gradient-to-br from-primary/75 to-emerald-400/65"
                          style={{ animationDelay: "-2.3s" }}
                        />
                      </div>

                      {/* section heading */}
                      <div
                        className="nz-build-block mx-auto h-2.5 w-28 rounded bg-muted-foreground/25"
                        style={{ animationDelay: "-1.9s" }}
                      />

                      {/* feature cards — assemble one by one */}
                      <div className="flex gap-2.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="nz-build-block flex-1 rounded-xl border border-border/50 bg-secondary/40 p-2.5"
                            style={{ animationDelay: `${-1.5 + i * 0.3}s` }}
                          >
                            <div className="mb-2 h-5 w-5 rounded-md bg-primary/60" />
                            <div className="mb-1 h-1.5 w-full rounded bg-muted-foreground/25" />
                            <div className="h-1.5 w-2/3 rounded bg-muted-foreground/15" />
                          </div>
                        ))}
                      </div>

                      {/* footer bar */}
                      <div className="nz-build-block flex items-center gap-2" style={{ animationDelay: "-0.4s" }}>
                        <div className="h-3 w-10 rounded bg-muted-foreground/20" />
                        <div className="ms-auto h-3 w-16 rounded bg-muted-foreground/15" />
                      </div>
                    </div>

                    {/* polish shimmer — sweeps across the finished page */}
                    <div className="nz-build-shimmer pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">Perfect in every Pixel</p>
                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                      NZ-web
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntroSection;
