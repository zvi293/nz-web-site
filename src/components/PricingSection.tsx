import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, ArrowLeft, MessageCircle } from "lucide-react";
import FaqAccordionItem from "@/components/FaqAccordionItem";
import { getWhatsAppHref, contactInfo } from "@/lib/contact-utils";
import { useSpotlight } from "@/hooks/useSpotlight";
import {
  PRICING_PLANS,
  PRICING_FAQS,
  PRICING_COMMITMENT,
  PRICING_INCLUDED_NOTE,
  PRICING_INTRO,
  PRICING_QUOTE_NOTE,
  getPlanDetailsHref,
  type PricingPlan,
} from "@/data/pricing";

/* ── single plan card ── */
const PlanCard = ({ plan, index }: { plan: PricingPlan; index: number }) => {
  const onSpotlight = useSpotlight();
  const waHref = getWhatsAppHref(
    contactInfo,
    `היי! אני מעוניין/ת בחבילת ${plan.name} לאתר תדמית. אשמח לפרטים ולהצעה מותאמת.`,
  );
  return (
  <motion.div
    onPointerMove={onSpotlight}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300, damping: 18 } }}
    className={`spotlight group relative flex flex-col rounded-[1.75rem] border bg-card p-6 transition-shadow duration-300 md:p-7 ${
      plan.featured
        ? "z-10 border-primary/40 shadow-brand ring-1 ring-primary/25"
        : "border-border/50 shadow-soft hover:shadow-elevated"
    }`}
  >
    {/* featured cards get a living gradient halo */}
    {plan.featured && (
      <>
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-70 blur-xl"
          style={{ background: "linear-gradient(135deg, hsl(var(--brand-1) / 0.3), hsl(var(--brand-3) / 0.3))" }}
          aria-hidden="true"
        />
        <div className="ring-gradient pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
      </>
    )}

    {plan.badge && (
      <div
        className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-white shadow-brand"
        style={{ background: "linear-gradient(100deg, hsl(var(--brand-1)), hsl(var(--brand-2)) 55%, hsl(var(--brand-3)))" }}
      >
        <Crown className="h-3.5 w-3.5" />
        {plan.badge}
      </div>
    )}

    <h3 className="text-xl font-black text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
      {plan.name}
    </h3>
    <p className="mt-0.5 text-sm font-bold text-primary">{plan.nickname}</p>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>

    {/* payment model — no amounts anywhere: every package is quoted personally */}
    <div className="mt-5 flex flex-col gap-3.5 rounded-2xl border border-border/40 bg-secondary/30 p-4">
      <p
        className="text-2xl font-black text-transparent"
        style={{
          backgroundImage: "linear-gradient(120deg, hsl(var(--brand-1)), hsl(var(--brand-2)) 60%, hsl(var(--brand-3)))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        הצעה אישית
      </p>
      <div className="flex flex-col gap-2.5 border-t border-border/40 pt-3.5">
        <div>
          <p className="text-xs font-semibold text-foreground">הקמה חד-פעמית</p>
          <p className="mt-0.5 text-xs text-muted-foreground/90">{plan.setupNote}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">מנוי חודשי, ללא התחייבות</p>
          <p className="mt-0.5 text-xs text-muted-foreground/90">{plan.monthlyNote}</p>
        </div>
      </div>
      <p className="border-t border-border/40 pt-3 text-xs leading-relaxed text-muted-foreground">
        {PRICING_QUOTE_NOTE}
      </p>
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
      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.03] ${
        plan.featured
          ? "btn-brand"
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
    <section
      id={id}
      dir="rtl"
      aria-labelledby="pricing-heading"
      className="relative scroll-mt-24 overflow-hidden border-y border-border/40 bg-background py-16 md:py-24"
    >
      {/* atmosphere */}
      <div className="nz-aurora opacity-60" aria-hidden="true" />
      <div className="nz-grid opacity-50" aria-hidden="true" />

      <div className="container relative z-10 mx-auto max-w-6xl">
        {/* heading */}
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span className="nz-eyebrow mb-5">אתרי תדמית</span>
          <h2 id="pricing-heading" className="text-section-title text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
            חבילות ל<span className="text-gradient-brand">אתר תדמית</span>
          </h2>
          <p className="text-lede mt-4 text-pretty text-muted-foreground">{PRICING_INTRO}</p>
        </motion.div>

        {/* plan cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
