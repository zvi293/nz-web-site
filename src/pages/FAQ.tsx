import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { fetchFaqItems } from "@/lib/faq-api";

const FAQ = () => {
  const faqItems = fetchFaqItems().filter(item => item.visible);

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <Header />
      <BackToHome />

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
            <h1 className="font-heebo text-3xl md:text-5xl font-bold text-foreground mb-4">
              שאלות נפוצות
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ריכזנו עבורכם את השאלות הנפוצות ביותר שאנחנו מקבלים מלקוחות. לא מצאתם תשובה?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                דברו איתנו
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <AccordionItem
                  value={`faq-${item.id}`}
                  className="border border-border rounded-2xl px-6 overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <AccordionTrigger className="font-heebo text-right text-base font-semibold text-foreground py-5 hover:no-underline gap-4">
                    <span className="flex items-center gap-3">
                      <span className="flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-heebo text-muted-foreground leading-relaxed text-sm pr-10 pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

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
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4" />
              צרו קשר
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

export default FAQ;
