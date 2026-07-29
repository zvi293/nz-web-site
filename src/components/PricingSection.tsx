import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft, MessageCircle } from "lucide-react";
import FaqAccordionItem from "@/components/FaqAccordionItem";
import { getWhatsAppHref, contactInfo } from "@/lib/contact-utils";
import {
  PRICING_PLANS,
  PRICING_FAQS,
  PRICING_COMMITMENT,
  PRICING_INCLUDED_NOTE,
  PRICING_INTRO,
  getPlanDetailsHref,
  type PricingPlan,
} from "@/data/pricing";

/* ── single plan card ── */
const PlanCard = ({ plan, index }: { plan: PricingPlan; index: number }) => {
  const waHref = getWhatsAppHref(
    contactInfo,
    `היי! אני מעוניין/ת בחבילת ${plan.name} לאתר תדמית (עלות הקמה: ${plan.setup}, ${plan.monthly} לחודש). אשמח לפרטים ולהצעה.`,
  );
  return (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 18 } }}
    className={`group relative flex flex-col rounded-3xl border bg-card p-6 transition-shadow duration-300 hover:shadow-2xl md:p-7 ${
      plan.featured
        ? "border-primary/50 shadow-xl shadow-primary/10 ring-1 ring-primary/30 hover:shadow-primary/25"
        : "border-border/40 shadow-sm"
    }`}
  >
    {plan.badge && (
      <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-md">
        <Crown className="h-3.5 w-3.5" />
        {plan.badge}
      </div>
    )}

    <h3 className="text-xl font-black text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
      {plan.name}
    </h3>
    <p className="mt-0.5 text-sm font-bold text-primary">{plan.nickname}</p>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>

    {/* prices — one-time setup + monthly retainer */}
    <div className="mt-5 flex flex-col gap-4 border-y border-border/40 py-5">
      <div>
        <p className="text-xs font-semibold text-muted-foreground">הקמה חד-פעמית</p>
        <p className="mt-0.5 text-xs text-muted-foreground/80">{plan.setupNote}</p>
        <p className="mt-1 text-xl font-black text-foreground">{plan.setup}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground">מנוי חודשי</p>
        <p className="mt-0.5 text-xs text-muted-foreground/80">{plan.monthlyNote}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-foreground">{plan.monthly}</span>
          <span className="text-sm text-muted-foreground">/ לחודש</span>
        </div>
      </div>
    </div>

    {/* features — each tier lists what it adds on top of the previous one */}
    <div className="mt-5 flex flex-1 flex-col">
      {plan.inheritsNote && (
        <p className="mb-3 text-sm font-bold text-primary">{plan.inheritsNote}</p>
      )}
      <ul className="flex flex-col gap-3 text-right">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-sm leading-snug text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* CTA — opens WhatsApp with a message tailored to the chosen plan (lead capture only) */}
    <a
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] ${
        plan.featured
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 btn-glow"
          : "border border-primary/30 bg-primary/[0.06] text-primary hover:bg-primary/[0.12]"
      }`}
    >
      {plan.ctaText}
      <ArrowLeft className="h-4 w-4" />
    </a>

    {/* secondary link — the full breakdown of this package */}
    <Link
      to={getPlanDetailsHref(plan.slug)}
      className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-all duration-200 hover:gap-2.5 hover:underline"
    >
      לכל הפרטים של החבילה
      <ArrowLeft className="h-3.5 w-3.5" />
    </Link>
  </motion.div>
  );
};

interface PricingSectionProps {
  /** anchor id for the homepage CTA (default "pricing"). */
  id?: string;
  /** inject the pricing FAQ as FAQPage JSON-LD (default true). Set false on pages that already emit a FAQPage. */
  withFaqSchema?: boolean;
}

/**
 * Reusable אתר-תדמית pricing section (C7). Config-driven from src/data/pricing.ts.
 * No VAT wording; CTAs are lead capture only (no checkout).
 */
const PricingSection = ({ id = "pricing", withFaqSchema = true }: PricingSectionProps) => {
  const whatsappHref = getWhatsAppHref(
    contactInfo,
    "היי, אשמח לפרטים על חבילות אתר התדמית של NZ-web.",
  );

  /* FAQPage JSON-LD for the pricing FAQ (Google rich results). */
  useEffect(() => {
    if (!withFaqSchema) return;
    const id = "pricing-faq-schema";
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PRICING_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.getElementById(id)?.remove();
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [withFaqSchema]);

  return (
    <section id={id} dir="rtl" aria-labelledby="pricing-heading" className="scroll-mt-24 border-t border-border/30 bg-secondary/20 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-5 md:px-6">
        {/* heading */}
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">אתרי תדמית</p>
          <h2 id="pricing-heading" className="text-2xl font-black text-foreground md:text-3xl lg:text-4xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
            חבילות לאתר תדמית
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{PRICING_INTRO}</p>
        </motion.div>

        {/* plan cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <PlanCard key={plan.slug} plan={plan} index={i} />
          ))}
        </div>

        {/* what every plan includes */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
          {PRICING_INCLUDED_NOTE}
        </p>

        {/* WhatsApp quick option */}
        <div className="mt-8 text-center">
          <p className="mx-auto mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {PRICING_COMMITMENT}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            מעדיפים לשאול קודם? דברו איתנו בוואטסאפ
          </a>
        </div>

        {/* pricing FAQ */}
        <div className="mx-auto mt-14 max-w-2xl">
          <h3 className="mb-6 text-center text-xl font-black text-foreground md:text-2xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
            שאלות נפוצות על החבילות
          </h3>
          <div className="flex flex-col gap-3">
            {PRICING_FAQS.map((faq, i) => (
              <FaqAccordionItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
