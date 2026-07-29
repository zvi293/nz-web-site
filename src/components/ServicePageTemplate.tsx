import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, type LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import PricingSection from "@/components/PricingSection";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

/* ─────────────── Types ─────────────── */
export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string; // hex color
}

export interface ServiceStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceAudienceItem {
  title: string;
  description: string;
}

export interface ServiceDeepDiveBlock {
  heading: string;
  body: string;
}

export interface ServicePageConfig {
  seo: { title: string; description: string; keywords?: string };
  breadcrumb: { name: string; path: string; parent?: { name: string; path: string } };
  schemaId: string;
  schemaServiceType: string;
  schemaUrl: string;
  hero: {
    badge: string;
    badgeIcon: LucideIcon;
    title: string;
    highlight: string; // part of title shown in gradient
    subtitle: string;
    stats: { value: string; label: string }[];
    ctaText: string;
  };
  intro: {
    title: string;
    paragraphs: string[];
  };
  /** Long-form, keyword-rich content section (H2 + H3 blocks) — boosts depth & SEO */
  deepDive?: {
    title: string;
    blocks: ServiceDeepDiveBlock[];
  };
  features: ServiceFeature[];
  /** "Who is this service for" — vertical/audience targeting */
  whoFor?: {
    title: string;
    subtitle?: string;
    items: ServiceAudienceItem[];
  };
  process: ServiceStep[];
  techStack?: string[];
  results: { value: string; label: string; sub: string }[];
  faqs: ServiceFaq[];
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  /** Optional content image rendered in the intro (e.g. on vertical pages). */
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Optional curated internal links (hub-and-spoke). Overrides the default related-services list. */
  relatedLinks?: { label: string; href: string }[];
  /** Render the אתר-תדמית pricing packages section on this page (default off). */
  pricing?: boolean;
  /** Optional "by industry/type" grid linking to every spoke page (for hub pages). */
  industries?: { label: string; href: string; desc?: string }[];
}

/* ─────────────── Sub-components ─────────────── */

const FaqItem = ({ faq, index }: { faq: ServiceFaq; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="overflow-hidden rounded-2xl border border-border/40 bg-card transition-shadow duration-200 hover:shadow-md"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
      >
        <span className="text-sm font-bold text-foreground md:text-base">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
          {faq.a}
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────── Main Template ─────────────── */
const ServicePageTemplate = ({ config }: { config: ServicePageConfig }) => {
  useSeoMeta(config.seo);
  useBreadcrumb(config.breadcrumb);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, { once: true, margin: "-60px" });

  useEffect(() => {
    /* ── Service schema ── */
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = config.schemaId;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: config.schemaServiceType,
      name: config.seo.title,
      description: config.seo.description,
      provider: { "@type": "Organization", name: "NZ-web", url: "https://nz-web.com" },
      areaServed: { "@type": "Country", name: "Israel" },
      url: config.schemaUrl,
    });
    document.getElementById(config.schemaId)?.remove();
    document.head.appendChild(script);

    /* ── FAQPage schema — makes the FAQ eligible for rich results in Google ── */
    const faqSchemaId = `${config.schemaId}-faq`;
    let faqScript: HTMLScriptElement | null = null;
    if (config.faqs && config.faqs.length > 0) {
      faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.id = faqSchemaId;
      faqScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      });
      document.getElementById(faqSchemaId)?.remove();
      document.head.appendChild(faqScript);
    }

    return () => {
      document.getElementById(config.schemaId)?.remove();
      document.getElementById(faqSchemaId)?.remove();
    };
  }, [config]);

  const BadgeIcon = config.hero.badgeIcon;

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <AmbientShapes />
      <Header />
      <BackToHome />

      {/* ── Hero ── */}
      <section className="nz-brand-dark nz-grain relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.3), transparent 65%)" }}
          />
        </div>
        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 22}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
          />
        ))}
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 backdrop-blur-md">
              <BadgeIcon className="h-4 w-4" style={{ color: "hsl(var(--brand-3))" }} />
              <span className="text-sm font-semibold text-white/90">{config.hero.badge}</span>
            </div>
            <h1 className="text-display mb-5 text-white" style={{ fontFamily: "'Heebo', sans-serif" }}>
              {config.hero.title.replace(config.hero.highlight, "")}{" "}
              <span className="text-gradient-brand">{config.hero.highlight}</span>
            </h1>
            <p className="text-lede mx-auto mb-10 max-w-2xl text-pretty text-white/70">
              {config.hero.subtitle}
            </p>
            {/* Hero stats */}
            <div className="mx-auto mb-10 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-4">
              {config.hero.stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] px-2 py-3 backdrop-blur-md"
                >
                  <span className="text-xl font-black text-white sm:text-2xl md:text-3xl">{s.value}</span>
                  <span className="text-[10.5px] text-white/55 sm:text-xs">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/contact/"
                className="btn-brand group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-[1.04]"
              >
                {config.hero.ctaText}
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              <Link
                to="/projects/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                ראו דוגמאות עבודה
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >
            <h2 className="mb-6 text-section-title text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
              {config.intro.title}
            </h2>
            <div className="space-y-4">
              {config.intro.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-[1.9] text-muted-foreground md:text-lg">{p}</p>
              ))}
            </div>
            {config.image && (
              <figure className="mt-10 overflow-hidden rounded-3xl border border-border/40 bg-card shadow-sm">
                <div className="aspect-[16/9] w-full">
                  <img
                    src={config.image.src}
                    alt={config.image.alt}
                    width={config.image.width}
                    height={config.image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </figure>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Deep dive — long-form content ── */}
      {config.deepDive && config.deepDive.blocks.length > 0 && (
        <section className="border-t border-border/30 py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <motion.h2
              className="mb-10 text-section-title text-foreground"
              style={{ fontFamily: "'Heebo', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              {config.deepDive.title}
            </motion.h2>
            <div className="space-y-8">
              {config.deepDive.blocks.map((block, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="text-right"
                >
                  <h3 className="mb-3 text-lg font-bold text-foreground md:text-xl">{block.heading}</h3>
                  <p className="text-base leading-[1.95] text-muted-foreground md:text-lg">{block.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features grid ── */}
      <section className="bg-secondary/30 py-14 md:py-20">
        <div className="container mx-auto px-5 md:px-6">
          <motion.div
            className="mx-auto mb-12 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="nz-eyebrow mb-4">מה כולל השירות</p>
            <h2 className="text-section-title text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
              כל מה שאתם צריכים, במקום אחד
            </h2>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {config.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  className="spotlight group relative overflow-hidden rounded-[1.35rem] border border-border/50 bg-card p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-floating"
                  style={{ borderColor: `${f.accent}20` }}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  whileHover={{ boxShadow: `0 16px 48px -12px ${f.accent}25` }}
                >
                  <div
                    className="absolute left-0 top-0 h-[2px] w-full"
                    style={{ background: `linear-gradient(to left, transparent, ${f.accent}60, transparent)` }}
                  />
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${f.accent}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: f.accent }} strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2 text-base font-black text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Who is this for ── */}
      {config.whoFor && config.whoFor.items.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="container mx-auto max-w-5xl px-6">
            <motion.div
              className="mx-auto mb-12 max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p className="nz-eyebrow mb-4">למי זה מתאים</p>
              <h2 className="text-section-title text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
                {config.whoFor.title}
              </h2>
              {config.whoFor.subtitle && (
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">{config.whoFor.subtitle}</p>
              )}
            </motion.div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.whoFor.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="hover-lift rounded-2xl border border-border/50 bg-card p-6 text-right shadow-soft"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Check className="h-4 w-4 text-primary" strokeWidth={2.4} />
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Industries / types grid (hub → every spoke) ── */}
      {config.industries && config.industries.length > 0 && (
        <section className="border-t border-border/30 py-14 md:py-20">
          <div className="container mx-auto max-w-5xl px-6">
            <motion.div
              className="mx-auto mb-10 max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p className="nz-eyebrow mb-4">לפי תחום</p>
              <h2 className="text-section-title text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
                בחרו את התחום שלכם
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.industries.map((it, i) => (
                <motion.div
                  key={it.href}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                >
                  <Link
                    to={it.href}
                    className="group flex h-full flex-col rounded-2xl border border-border/40 bg-card p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <h3 className="mb-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">{it.label}</h3>
                    {it.desc && <p className="text-sm leading-relaxed text-muted-foreground">{it.desc}</p>}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="nz-eyebrow mb-4">איך זה עובד</p>
            <h2 className="text-2xl font-black text-foreground md:text-3xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
              תהליך העבודה שלנו
            </h2>
          </motion.div>
          <div className="flex flex-col gap-5">
            {config.process.map((step, i) => (
              <motion.div
                key={i}
                className="hover-lift flex gap-5 rounded-2xl border border-border/50 bg-card p-5 shadow-soft md:p-6"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                  {step.number}
                </div>
                <div>
                  <h3 className="mb-1.5 font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      {config.techStack && config.techStack.length > 0 && (
        <section className="bg-secondary/20 py-12 md:py-16">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="nz-eyebrow mb-3">הטכנולוגיות שאנחנו עובדים איתן</p>
              <p className="mb-7 text-xs text-muted-foreground">סטאק מודרני, מנוסה ומוכח בפרויקטים אמיתיים</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {config.techStack.map((tech) => (
                  <motion.span
                    key={tech}
                    className="rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary hover:shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tech}
                  </motion.span>
                ))}
                <span className="rounded-full border border-dashed border-primary/30 bg-primary/[0.04] px-4 py-2 text-sm font-semibold text-primary/70">
                  ועוד...
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Results / Stats ── */}
      <section className="py-14 md:py-20">
        <div ref={resultsRef} className="container mx-auto max-w-4xl px-6">
          <motion.p
            className="nz-eyebrow mx-auto mb-8 flex w-fit"
            initial={{ opacity: 0 }}
            animate={resultsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            בשביל מה בדיוק כל זה?
          </motion.p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {config.results.map((r, i) => (
              <motion.div
                key={i}
                className="hover-lift rounded-[1.5rem] border border-border/50 bg-card p-7 text-center shadow-soft"
                initial={{ opacity: 0, y: 24 }}
                animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55 }}
              >
                <div className="mb-2 text-4xl font-black text-primary">{r.value}</div>
                <div className="mb-1 text-base font-bold text-foreground">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-secondary/20 py-14 md:py-20">
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="nz-eyebrow mb-4">שאלות ותשובות</p>
            <h2 className="text-2xl font-black text-foreground md:text-3xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
              כל מה שרציתם לדעת
            </h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {config.faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              יש שאלה שלא ענינו עליה?{" "}
              <Link to="/contact/" className="font-semibold text-primary hover:underline">
                דברו איתנו ישירות
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing packages (opt-in via config.pricing) ── */}
      {config.pricing && <PricingSection withFaqSchema={false} />}

      {/* ── Internal links — related services ── */}
      <section className="border-t border-border/30 py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-6">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            שירותים נוספים שיכולים לעניין אתכם
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {(config.relatedLinks ?? [
              { label: "בניית אתרים מקצועיים", href: "/services/web-development/" },
              { label: "אתר תדמית לעסקים", href: "/services/business-website/" },
              { label: "מערכת ניהול תורים", href: "/services/appointment-system/" },
              { label: "דפי נחיתה ממירים", href: "/services/landing-page-development/" },
              { label: "פיתוח אתרים", href: "/services/website-development/" },
              { label: "React Development", href: "/services/react-development/" },
              { label: "כל השירותים", href: "/services/" },
              { label: "צרו קשר", href: "/contact/" },
            ])
              .filter((s) => s.href !== config.schemaUrl.replace("https://nz-web.com", ""))
              .slice(0, 6)
              .map((s) => (
                <Link
                  key={s.href}
                  to={s.href}
                  className="rounded-xl border border-border/40 bg-card px-4 py-3 text-center text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/[0.05] hover:text-primary"
                >
                  {s.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="nz-brand-dark nz-grain relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.28), transparent 65%)" }}
          />
        </div>
        <motion.div
          className="container relative z-10 mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <h2 className="text-section-title mb-5 text-white" style={{ fontFamily: "'Heebo', sans-serif" }}>
            {config.cta.title}
          </h2>
          <p className="text-lede mb-10 text-pretty text-white/65">{config.cta.subtitle}</p>
          <Link
            to="/contact/"
            className="btn-brand group inline-flex items-center gap-2.5 rounded-2xl px-10 py-5 text-lg font-bold transition-all duration-300 hover:scale-[1.04]"
          >
            {config.cta.buttonText}
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

export default ServicePageTemplate;
