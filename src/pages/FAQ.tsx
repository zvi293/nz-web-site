import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Search, X } from "lucide-react";
import FaqAccordionItem from "@/components/FaqAccordionItem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { visibleFaqItems } from "@/content/faq";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const FAQ = () => {
  const faqItems = visibleFaqItems;
  const [searchQuery, setSearchQuery] = useState("");

  useSeoMeta({
    title: "שאלות נפוצות על בניית אתרים ופיתוח | NZ-web",
    description:
      "כמה זמן לוקח לבנות אתר? מה כולל השירות? איך מקבלים הצעה? תשובות לכל השאלות על בניית אתרים ופיתוח אתרים — כל מה שצריך לדעת לפני שמתחילים.",
    keywords: "שאלות נפוצות בניית אתרים, תהליך בניית אתר, זמן בניית אתר, FAQ פיתוח אתרים, שאלות על בניית אתר, הצעת מחיר לבניית אתר",
  });
  useBreadcrumb({ name: "שאלות נפוצות", path: "/faq" });

  const filteredItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inject FAQPage JSON-LD structured data for Google rich results
  useEffect(() => {
    if (faqItems.length === 0) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-page-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
    const existing = document.getElementById("faq-page-schema");
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      document.getElementById("faq-page-schema")?.remove();
    };
  }, [faqItems]);

  return (
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />
      <BackToHome />

      <main id="page-content">

      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs items={[{ label: "שאלות נפוצות" }]} className="mb-0" />
      </div>

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary mb-6">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-medium">שאלות נפוצות</span>
            </div>
            <h1 className="text-display font-heebo text-balance text-foreground mb-4">
              שאלות נפוצות
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ריכזנו עבורכם את השאלות הנפוצות ביותר שאנחנו מקבלים מלקוחות. לא מצאתם תשובה?{" "}
              <Link to="/contact/" className="text-primary hover:underline">
                דברו איתנו
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Search */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="חפשו שאלה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card px-4 pr-12 py-3.5 transition-all duration-200 hover:border-primary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {searchQuery && filteredItems.length === 0 && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                לא נמצאו תוצאות עבור "{searchQuery}". נסו חיפוש אחר.
              </p>
            )}
          </motion.div>

          {/* FAQ Accordion — uses the site's shared FaqAccordionItem, which keeps
              every answer in the DOM. The Radix accordion that used to be here
              unmounts collapsed content, so the pre-rendered HTML shipped 15
              questions and zero answers: nothing for Google's FAQ rich result to
              match against, and nothing for an answer engine to quote. */}
          <div className="space-y-3">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <FaqAccordionItem faq={{ q: item.question, a: item.answer }} index={i} />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-16 text-center space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground">
              יש לכם שאלה נוספת? אנחנו תמיד כאן.
            </p>
            <Link
              to="/contact/"
              className="btn-brand inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-4 w-4" />
              צרו קשר
            </Link>
            <p className="text-sm text-muted-foreground pt-2">
              אם אתם בודקים דף ממוקד לקמפיין או להשארת פרטים,{" "}
              <Link to="/services/landing-page-development/" className="text-primary hover:underline">
                קראו על שירות בניית דפי הנחיתה שלנו
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default FAQ;
