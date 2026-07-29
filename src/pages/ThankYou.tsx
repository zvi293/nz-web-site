import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, MessageSquare, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const ThankYou = () => {
  useSeoMeta({
    title: "תודה על הפנייה | NZ-web",
    description: "תודה שפנית אלינו! קיבלנו את הפנייה שלך ונחזור אליך בהקדם.",
    /* Transactional page — it has a static file so a refresh works, but it must
       never enter the index (it is also Disallow-ed in robots.txt). */
    noindex: true,
  });
  useBreadcrumb({ name: "תודה על הפנייה", path: "/thank-you" });

  const steps = [
    {
      number: "1",
      icon: <Mail className="h-6 w-6" />,
      title: "הפנייה נשלחה בוואטסאפ",
      description: "ההודעה עם הפרטים שמילאתם נפתחה בוואטסאפ שלנו",
    },
    {
      number: "2",
      icon: <Users className="h-6 w-6" />,
      title: "ניצור איתכם קשר",
      description: "ניצור איתכם קשר תוך 24 שעות",
    },
    {
      number: "3",
      icon: <MessageSquare className="h-6 w-6" />,
      title: "שיחת ייעוץ חינם",
      description: "נקיים שיחת ייעוץ ראשונית חינם ללא התחייבות",
    },
  ];

  return (
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />

      <main id="page-content">

      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="text-center space-y-8">
            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                duration: 0.8,
              }}
              className="mx-auto"
            >
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80"
                >
                  <Check className="h-10 w-10 text-primary-foreground" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-3"
            >
              <h1 className="text-display font-heebo text-balance text-foreground">
                הפנייה נשלחה בהצלחה!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                קיבלנו את הפנייה שלכם ונחזור אליכם בהקדם
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="relative rounded-2xl border border-border/40 bg-card p-6 group hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Top Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary/60 to-primary/20"></div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {step.icon}
                    </div>
                    <h3 className="font-heebo font-bold text-foreground text-lg">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link
                to="/"
                className="btn-brand inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-bold transition-all duration-300 hover:scale-105"
              >
                חזרה לדף הבית
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/projects/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/40 bg-card text-foreground font-bold px-8 py-3 hover:bg-secondary transition-all duration-300"
              >
                ראו פרויקטים
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Support Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-sm text-muted-foreground pt-8"
            >
              אם יש לכם שאלה כלשהי, אתם יכולים{" "}
              <a href="https://wa.me/" className="text-primary hover:underline">
                לפנות אלינו בוואטסאפ
              </a>
              .
            </motion.p>
          </div>
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

export default ThankYou;
