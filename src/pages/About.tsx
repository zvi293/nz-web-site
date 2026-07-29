import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import { motion, useInView } from "framer-motion";
import { Plus, Minus, Code2, Palette, Zap, Users, Award, Star, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { aboutContent } from "@/content/about";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

/* ── Animated counter ── */
const Counter = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let n = 0;
    const step = Math.ceil(value / 45);
    const t = setInterval(() => {
      n += step;
      if (n >= value) { setDisplay(value); clearInterval(t); }
      else setDisplay(n);
    }, 28);
    return () => clearInterval(t);
  }, [isInView, value]);
  return <>{display}{suffix}</>;
};

const statsData = [
  { icon: Code2, value: 50, suffix: "+", label: "פרויקטים הושלמו", color: "#3b82f6" },
  { icon: Users, value: 40, suffix: "+", label: "לקוחות מרוצים", color: "#8b5cf6" },
  { icon: Award, value: 5, suffix: "+", label: "שנות ניסיון", color: "#10b981" },
  { icon: Star, value: 100, suffix: "%", label: "שביעות רצון", color: "#f97316" },
];

const coreValues = [
  { icon: Code2, title: "קוד נקי", desc: "כל שורת קוד נכתבת עם תשומת לב מלאה לביצועים, קריאות ותחזוקה." },
  { icon: Palette, title: "עיצוב מדויק", desc: "כל פיקסל מתוכנן. חווית משתמש שמרגישה טבעית ומביאה תוצאות." },
  { icon: Zap, title: "ביצועים ראשונים", desc: "אתרים שנטענים מהר, עובדים חלק ומדורגים גבוה בגוגל." },
];

interface AccordionColumnProps {
  title: string;
  items: { title: string; desc: string }[];
  delayOffset?: number;
}

const AccordionColumn = ({ title, items, delayOffset = 0 }: AccordionColumnProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delayOffset }}
    >
      <h3 className="mb-8 text-xl font-extrabold text-foreground md:text-2xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `about-panel-${title.replace(/\s+/g, "-")}-${i}`;
          return (
            <div key={i} className="border-b border-border/50 pb-3">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 text-right group cursor-pointer"
              >
                <span className="text-base font-bold text-foreground transition-colors group-hover:text-primary md:text-lg">
                  {item.title}
                </span>
                <span aria-hidden="true" className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              {/* Collapsed, not unmounted — the copy has to survive into the
                  pre-rendered HTML, otherwise crawlers get bare headings. */}
              <motion.div
                id={panelId}
                aria-hidden={!isOpen}
                {...(isOpen ? {} : { inert: "" })}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.desc}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const About = () => {
  const data = aboutContent;
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  useSeoMeta({
    title: "מי אנחנו | NZ-web – סטודיו לבניית אתרים ופיתוח אתרים בישראל",
    description:
      "NZ-web – סטודיו מוביל לבניית אתרים ופיתוח אתרים בישראל בניהול צבי משה. 50+ פרויקטים, 5+ שנות ניסיון, 100% שביעות רצון. Perfect in every Pixel.",
    keywords: "NZ-web מי אנחנו, סטודיו לבניית אתרים, צבי משה, פיתוח אתרים ישראל, סטודיו לעיצוב אתרים",
  });
  useBreadcrumb({ name: "מי אנחנו", path: "/about" });

  return (
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <AmbientShapes />
      <Header />
      <BackToHome />

      <main id="page-content">

      <div className="container mx-auto max-w-3xl px-6 pt-6">
        <Breadcrumbs items={[{ label: "מי אנחנו" }]} className="mb-0" />
      </div>

      {/* ── Hero ── */}
      <section className="nz-grain relative overflow-hidden py-20 md:py-28">
        <div className="nz-aurora opacity-70" aria-hidden="true" />
        <div className="nz-grid opacity-60" aria-hidden="true" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="nz-eyebrow mb-5"
          >
            {data.heroSubtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display mb-6 text-balance text-foreground"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            {data.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lede mx-auto max-w-xl text-pretty text-muted-foreground"
          >
            {data.heroDescription.split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br className="hidden md:block" />}</span>
            ))}
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mt-10 max-w-lg border-r-4 border-primary pr-6 text-right text-base italic leading-relaxed text-muted-foreground md:text-lg"
          >
            "{data.heroQuote}"
          </motion.blockquote>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-border/40 bg-secondary/30 py-10 md:py-14">
        <div ref={statsRef} className="container mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-2 text-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-3xl font-black text-foreground md:text-4xl">
                    <Counter value={stat.value} suffix={stat.suffix} isInView={statsInView} />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground md:text-sm">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Core values ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center text-2xl font-black text-foreground md:text-4xl"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            הערכים שמנחים אותנו
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={i}
                  className="group rounded-3xl border border-border/40 bg-card p-7 transition-all duration-400 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-black text-foreground">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Services accordion ── */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center text-3xl font-black text-foreground md:text-5xl"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            {data.servicesTitle}
          </motion.h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {data.columns.map((col, i) => (
              <AccordionColumn key={i} title={col.title} items={col.items} delayOffset={i * 0.12} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/services/business-website/"
              className="font-heebo text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              לפרטים על שירות בניית אתר תדמית לעסקים ←
            </Link>
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl rounded-3xl border border-border/40 bg-card p-8 text-right shadow-sm md:p-12"
          >
            <h2
              className="mb-8 text-2xl font-black leading-snug text-foreground md:text-4xl"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              {data.visionTitle}
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {data.visionParagraphs.map((p, i) => (
                <p key={i}>
                  {i === 1 && p.startsWith("ובשביל זה NZ-web כאן.") ? (
                    <><span className="font-bold text-primary">ובשביל זה NZ-web כאן.</span>{p.slice("ובשביל זה NZ-web כאן.".length)}</>
                  ) : p}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/projects/" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                ראו את הפרויקטים שלנו
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden nz-brand-dark py-20 text-center md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container relative z-10 mx-auto max-w-2xl px-6"
        >
          <h2 className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
            {data.ctaTitle}
          </h2>
          <p className="mb-10 text-lg text-primary/90 md:text-xl">{data.ctaSubtitle}</p>
          <button
            onClick={() => { window.location.href = data.ctaButtonLink; }}
            className="btn-brand inline-block rounded-2xl px-12 py-5 text-lg font-bold shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 cursor-pointer btn-glow"
          >
            {data.ctaButtonText}
          </button>
        </motion.div>
      </section>

      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default About;
