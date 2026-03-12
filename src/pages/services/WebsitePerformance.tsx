import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gauge, Zap, ImageIcon, Timer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-website-performance";

const WebsitePerformance = () => {
  useSeoMeta({
    title: "שיפור מהירות אתרים | NZ-web",
    description:
      "שיפור ביצועי אתרים וציוני Core Web Vitals. אופטימיזציה לתמונות, קיצור זמני טעינה ושיפור דירוג בגוגל.",
  });
  useBreadcrumb({ name: "שיפור מהירות אתרים", path: "/services/website-performance" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Website Performance Optimization",
      name: "שיפור מהירות אתרים",
      description:
        "שיפור ביצועי אתרים, ציוני Core Web Vitals, אופטימיזציה לתמונות וקיצור זמני טעינה.",
      provider: {
        "@type": "Organization",
        name: "NZ-web",
        url: "https://nz-web.com",
      },
      areaServed: {
        "@type": "Country",
        name: "Israel",
      },
      url: "https://nz-web.com/services/website-performance",
    });
    document.getElementById(SCHEMA_ID)?.remove();
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, []);

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
              <Gauge className="h-4 w-4" />
              <span className="text-sm font-medium">ביצועי אתרים</span>
            </div>
            <h1 className="font-heebo text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              שיפור מהירות אתרים
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              אתר איטי הוא לא רק בעיית UX – זו בעיית SEO, בעיית מכירות, ובעיית אמון. אנחנו מאתרים בדיוק מה מאיט ומתקנים את זה.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 space-y-16">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                למה מהירות חשובה
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                גוגל כוללת את מהירות הדף כגורם דירוג ישיר. אתר שנטען ב-3 שניות נדחה לדף 2. אתר שנטען ב-1 שנייה מקבל יתרון תחרותי אמיתי.
              </p>
              <p>
                מעבר ל-SEO – משתמשים לא מחכים. אם האתר לא נטען תוך 2 שניות, חלק גדול מהגולשים עוברים למתחרים. כל עסקה שהפסדתם בגלל אתר איטי הרווחתם לאחד אחר.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gauge className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                Core Web Vitals
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                גוגל מודדת שלושה מדדים עיקריים: LCP (זמן טעינה של אלמנט ראשי), INP (תגובה לאינטראקציה), ו-CLS (יציבות ויזואלית).
              </p>
              <p>
                אנחנו מבצעים audit מלא לכל מדד, מזהים בדיוק את מקורות הבעיה, ומתקנים – בין אם מדובר ב-render-blocking scripts, בתמונות לא מאופטמזות, או ב-layout shifts.
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[
                { label: "LCP", desc: "זמן טעינת אלמנט ראשי < 2.5s" },
                { label: "INP", desc: "תגובה לאינטראקציה < 200ms" },
                { label: "CLS", desc: "יציבות ויזואלית < 0.1" },
              ].map((item) => (
                <li key={item.label} className="rounded-xl bg-background p-4 border border-border/50">
                  <p className="font-bold text-primary text-lg">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                אופטימיזציה לתמונות
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                תמונות הן בדרך כלל הגורם הכבד ביותר בטעינת עמוד. אנחנו ממירים ל-WebP/AVIF, מוסיפים lazy loading, ומגדירים srcset נכון לכל breakpoint.
              </p>
              <p>
                PNG של 2MB שנראה בסדר ב-desktop הוא אסון ב-mobile. אנחנו אוטומטים את תהליך האופטימיזציה כדי שכל תמונה שתועלה בעתיד תהיה מאופטמזת אוטומטית.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Timer className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                שיפור זמן טעינה
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                מעבר לתמונות, אנחנו מטפלים ב-bundle size (code splitting, tree shaking), caching strategies, preloading של משאבים קריטיים, ו-CDN configuration.
              </p>
              <p>
                בכל פרויקט אנחנו מציגים דוח לפני ואחרי – ציוני Lighthouse, GTmetrix, ו-PageSpeed Insights – כדי שיהיה ברור בדיוק מה השתפר.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heebo text-3xl md:text-4xl font-bold text-white mb-4">
              האתר שלכם איטי מדי?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              שתפו אותנו בבעיה – נבצע audit ונציע פתרון.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-primary text-primary-foreground font-bold text-base px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
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

export default WebsitePerformance;
