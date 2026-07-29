import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowLeft,
  BarChart3,
  Check,
  Crown,
  Gauge,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Pencil,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import FaqAccordionItem from "@/components/FaqAccordionItem";
import { getWhatsAppHref, contactInfo } from "@/lib/contact-utils";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import {
  PACKAGES_FAQS,
  PACKAGES_PAGE,
  PRICING_INCLUDED_ITEMS,
  PRICING_PLANS,
  type PlanIconKey,
  type PricingPlan,
} from "@/data/pricing";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

/* Icon keys used by the package data → real icons. */
const ICONS: Record<PlanIconKey, LucideIcon> = {
  pages: Layers,
  content: Pencil,
  seo: Search,
  shield: ShieldCheck,
  support: MessageCircle,
  panel: LayoutDashboard,
  leads: Users,
  analytics: BarChart3,
  ai: Sparkles,
  globe: Globe,
  lock: Lock,
  mobile: Smartphone,
  accessibility: Accessibility,
  speed: Gauge,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────────────────────────
   Sticky package switcher — always know where you are, and jump.
   ───────────────────────────────────────────────────────────── */
const PackageNav = ({
  activeSlug,
  containerRef,
}: {
  activeSlug: string;
  containerRef: React.RefObject<HTMLElement>;
}) => {
  const [visible, setVisible] = useState(false);

  /* Only while the packages themselves are on screen — never over the hero,
     the FAQ or the footer. */
  useEffect(() => {
    const onScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return setVisible(false);
      setVisible(rect.top < 150 && rect.bottom > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  return (
    <div
      className={`fixed inset-x-0 top-[64px] z-40 transition-all duration-300 md:top-[76px] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <nav
          aria-label="ניווט בין החבילות"
          className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-border/50 bg-background/85 p-1.5 shadow-[0_8px_30px_-12px_hsl(220_20%_14%/0.25)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRICING_PLANS.map((plan) => {
            const isActive = activeSlug === plan.slug;
            return (
              <a
                key={plan.slug}
                href={`#${plan.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-bold transition-colors duration-200 md:text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {plan.featured && <Crown className="h-3.5 w-3.5 shrink-0" />}
                {plan.name}
                <span className={isActive ? "opacity-80" : "opacity-60"}>{plan.monthly}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Hero selector card — the price ladder at the top of the page.
   ───────────────────────────────────────────────────────────── */
const LadderCard = ({ plan, index }: { plan: PricingPlan; index: number }) => (
  <motion.a
    href={`#${plan.slug}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: 0.25 + index * 0.09, ease: EASE }}
    className={`group relative flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-right transition-all duration-300 hover:-translate-y-1 sm:flex-col sm:items-stretch sm:gap-2.5 sm:p-5 ${
      plan.featured
        ? "border-primary/45 bg-primary/[0.05] shadow-lg shadow-primary/10"
        : "border-border/50 bg-card/70 hover:border-primary/30 hover:shadow-lg"
    }`}
  >
    {plan.featured && (
      <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
        <Crown className="h-3 w-3" />
        {plan.badge}
      </span>
    )}

    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:justify-between">
        <span className="text-base font-black text-foreground md:text-lg">{plan.name}</span>
        <span className="text-xs font-bold text-primary">{plan.nickname}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground sm:mt-2.5">
        הקמה <span className="font-bold text-foreground/80">{plan.setup}</span>
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-2 sm:mt-1 sm:justify-between">
      <div className="text-left sm:text-right">
        <p className="text-xl font-black leading-none text-foreground md:text-2xl">{plan.monthly}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">לחודש</p>
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-all duration-200 group-hover:gap-2">
        <span className="hidden sm:inline">לפירוט המלא</span>
        <ArrowLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </span>
    </div>
  </motion.a>
);

/* ─────────────────────────────────────────────────────────────
   One package, in full.
   ───────────────────────────────────────────────────────────── */
const PackageSection = ({ plan, index }: { plan: PricingPlan; index: number }) => {
  const { details } = plan;
  const waHref = getWhatsAppHref(
    contactInfo,
    `היי! אני מעוניין/ת בחבילת ${plan.name} ${plan.nickname} לאתר תדמית (הקמה: ${plan.setup}, ${plan.monthly} לחודש). אשמח לפרטים ולהצעה.`,
  );

  return (
    <section id={plan.slug} className="scroll-mt-32 md:scroll-mt-36" aria-labelledby={`${plan.slug}-heading`}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`relative overflow-hidden rounded-[1.75rem] border md:rounded-[2rem] ${
          plan.featured
            ? "border-primary/40 bg-gradient-to-b from-primary/[0.045] to-card shadow-[0_24px_70px_-30px_hsl(217_91%_60%/0.45)] ring-1 ring-primary/20"
            : "border-border/50 bg-card shadow-[0_18px_60px_-32px_hsl(220_20%_14%/0.35)]"
        }`}
      >
        {/* top accent line */}
        <div
          className={`h-1 w-full ${
            plan.featured
              ? "bg-gradient-to-l from-primary via-sky-400 to-primary"
              : "bg-gradient-to-l from-border via-primary/30 to-border"
          }`}
        />

        <div className="grid grid-cols-1 gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10 lg:p-10">
          {/* ── summary column ── */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-400 text-sm font-black text-primary-foreground shadow-md shadow-primary/25"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2
                id={`${plan.slug}-heading`}
                className="text-2xl font-black text-foreground md:text-3xl"
                style={{ fontFamily: "'Heebo', sans-serif" }}
              >
                חבילת {plan.name}
              </h2>
              {plan.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">
                  <Crown className="h-3 w-3" />
                  {plan.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-lg font-bold text-primary">{plan.nickname}</p>

            {/* price block */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-border/50">
              <div className="flex divide-x divide-x-reverse divide-border/50">
                <div className="flex-1 bg-secondary/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    הקמה חד-פעמית
                  </p>
                  <p className="mt-1 text-xl font-black text-foreground md:text-2xl">{plan.setup}</p>
                </div>
                <div className="flex-1 bg-primary/[0.07] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
                    מנוי חודשי
                  </p>
                  <p className="mt-1 text-xl font-black text-primary md:text-2xl">{plan.monthly}</p>
                </div>
              </div>
              <p className="border-t border-border/50 bg-card px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
                {plan.monthlyNote} · ללא התחייבות
              </p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{details.intro}</p>

            <div className="mt-4 rounded-2xl border border-border/50 bg-secondary/40 p-4">
              <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-bold">למי זה מתאים: </span>
                  <span className="text-muted-foreground">{details.audience}</span>
                </span>
              </p>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {details.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {highlight}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.02] ${
                plan.featured
                  ? "btn-brand"
                  : "border border-primary/30 bg-primary/[0.06] text-primary hover:bg-primary/[0.12]"
              }`}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              {details.ctaText}
            </a>
            <p className="mt-2.5 text-center text-xs text-muted-foreground">
              מענה מהיר בוואטסאפ · בלי התחייבות
            </p>
          </div>

          {/* ── breakdown column ── */}
          <div>
            {/* how it works */}
            <div className="rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/[0.07] to-primary/[0.02] p-4 md:p-5">
              <p className="mb-1.5 flex items-center gap-2 text-sm font-black text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                איך זה עובד?
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{details.howItWorks}</p>
            </div>

            {plan.inheritsNote && (
              <p className="mt-6 flex items-center gap-2 text-sm font-bold text-primary md:text-base">
                <span className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
                {plan.inheritsNote}
                <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              </p>
            )}

            {/* feature groups */}
            <div className="mt-5 grid grid-cols-1 items-start gap-3.5 md:grid-cols-2">
              {details.groups.map((group, i) => {
                const Icon = ICONS[group.icon] ?? Check;
                return (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05, ease: EASE }}
                    className="rounded-2xl border border-border/50 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_30px_-18px_hsl(217_91%_60%/0.5)] md:p-5"
                  >
                    <h3 className="mb-3 flex items-center gap-2.5 text-sm font-black text-foreground md:text-base">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      {group.title}
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check
                            className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                          <span className="text-[13px] leading-relaxed text-muted-foreground md:text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {details.closingNote && (
        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-3 md:mt-7">
          <span className="h-px flex-1 bg-border" />
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {details.closingNote}
          </p>
          <span className="h-px flex-1 bg-border" />
        </div>
      )}
    </section>
  );
};

/**
 * /packages — the full breakdown of every אתר-תדמית package.
 * Each plan card on the homepage links here with an anchor (/packages/#pro).
 */
const Packages = () => {
  const { hash } = useLocation();
  const [activeSlug, setActiveSlug] = useState<string>(PRICING_PLANS[0].slug);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const whatsappHref = getWhatsAppHref(
    contactInfo,
    "היי, אשמח להמלצה על חבילת אתר התדמית שמתאימה לעסק שלי.",
  );

  useSeoMeta({
    title: PACKAGES_PAGE.seoTitle,
    description: PACKAGES_PAGE.seoDescription,
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PACKAGES_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  });
  useBreadcrumb({ name: "חבילות אתר תדמית", path: PACKAGES_PAGE.path });

  /* Land on the right package when arriving with an anchor (ScrollToTop resets
     the scroll on every route change, so the hash has to be handled here). */
  useEffect(() => {
    if (!hash) return;
    return scrollToSelectorWithRetry(hash);
  }, [hash]);

  /* Highlight the package currently in view inside the sticky nav. */
  useEffect(() => {
    const root = sectionsRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSlug(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    root.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />
      <BackToHome />
      <PackageNav activeSlug={activeSlug} containerRef={sectionsRef} />

      {/* ── hero ── */}
      <section className="relative overflow-hidden pb-10 pt-10 md:pb-14 md:pt-16">
        {/* atmosphere */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-[8%] top-[-6rem] h-[26rem] w-[26rem] rounded-full bg-primary/[0.10] blur-[120px]" />
          <div className="absolute left-[6%] top-[4rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/[0.10] blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-5xl px-5 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="nz-eyebrow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {PACKAGES_PAGE.eyebrow} · שלוש חבילות
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="text-display mt-5 text-balance text-foreground"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              בניית אתר תדמית{" "}
              <span className="text-gradient-brand">שעובד בשביל העסק שלך</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
              className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-lg"
            >
              {PACKAGES_PAGE.subtitle}
            </motion.p>
          </div>

          {/* price ladder */}
          <div className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-3 md:mt-11 md:gap-4">
            {PRICING_PLANS.map((plan, i) => (
              <LadderCard key={plan.slug} plan={plan} index={i} />
            ))}
          </div>

          {/* what every package includes */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-border/40 bg-card/50 px-4 py-4 sm:grid-cols-3 md:mt-8 md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-7 md:py-3.5"
          >
            {PRICING_INCLUDED_ITEMS.map((item) => {
              const Icon = ICONS[item.icon] ?? Check;
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground md:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {item.label}
                </li>
              );
            })}
          </motion.ul>
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground md:text-[13px]">
            בכל החבילות. האתר באוויר, מאובטח ומתוחזק כל עוד המנוי החודשי פעיל.
          </p>
        </div>
      </section>

      {/* ── the packages ── */}
      <div ref={sectionsRef} className="container mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        <div className="flex flex-col gap-12 md:gap-16">
          {PRICING_PLANS.map((plan, i) => (
            <PackageSection key={plan.slug} plan={plan} index={i} />
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="border-t border-border/30 bg-secondary/25 py-14 md:py-20">
        <div className="container mx-auto max-w-2xl px-5 md:px-6">
          <div className="mb-8 text-center">
            <p className="nz-eyebrow mb-3">שאלות נפוצות</p>
            <h2
              className="text-2xl font-black text-foreground md:text-3xl"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              מה שכולם שואלים לפני שבוחרים חבילה
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {PACKAGES_FAQS.map((faq) => (
              <FaqAccordionItem key={faq.q} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── closing CTA ── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-5 md:px-6">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-l from-primary/[0.09] via-primary/[0.04] to-sky-400/[0.08] px-6 py-12 text-center md:rounded-[2rem] md:px-10 md:py-16">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-[70px]"
              aria-hidden="true"
            />
            <h2
              className="relative text-2xl font-black text-foreground md:text-3xl"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              {PACKAGES_PAGE.ctaTitle}
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              {PACKAGES_PAGE.ctaSubtitle}
            </p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold transition-all hover:scale-[1.03] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                {PACKAGES_PAGE.ctaButton}
              </a>
              <a
                href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-background/70 px-8 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/[0.08] sm:w-auto"
              >
                או התקשרו: {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </main>
  );
};

export default Packages;
