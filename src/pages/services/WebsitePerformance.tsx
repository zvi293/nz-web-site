import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gauge, Zap, ImageIcon, Timer, Search, Server, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-website-performance";

const FAQS = [
  {
    q: "איך אדע אם האתר שלי איטי מדי?",
    a: "הכלי הפשוט ביותר הוא Google PageSpeed Insights — מזינים את כתובת האתר ומקבלים ציון וניתוח. ציון מתחת ל-50 בנייד הוא בעיה אמיתית. גם תחושת בטן עובדת: אם האתר לוקח יותר מ-3 שניות להיטען, כבר הפסדתם חלק מהגולשים.",
  },
  {
    q: "כמה זמן לוקח לשפר את מהירות האתר?",
    a: "audit ראשוני וזיהוי הבעיות — כמה ימים. היישום עצמו תלוי בהיקף: אופטימיזציה של תמונות וקאשינג בסיסי — שבוע. אתר עם בעיות ארכיטקטורה עמוקות — שבועיים עד שלושה. תמיד נציג לכם הערכת זמן מדויקת אחרי ה-audit.",
  },
  {
    q: "מה זה Core Web Vitals ולמה זה חשוב?",
    a: "אלה שלושה מדדים שגוגל משתמשת בהם כגורם דירוג רשמי: LCP (מהירות טעינת התוכן הראשי), INP (מהירות התגובה לאינטראקציה) ו-CLS (יציבות ויזואלית — שדברים לא 'קופצים'). אתר שעובר את שלושתם מקבל יתרון בדירוג.",
  },
  {
    q: "אתם יכולים לשפר אתר שלא אתם בניתם?",
    a: "כן. שיפור ביצועים הוא שירות שאנחנו מבצעים גם על אתרים קיימים — וורדפרס, Wix, אתרים מותאמים אישית ועוד. אנחנו מבצעים audit, מזהים את צווארי הבקבוק ומתקנים, גם בלי לבנות את האתר מחדש.",
  },
  {
    q: "האם שיפור מהירות באמת משפיע על מכירות?",
    a: "כן, ישירות. מחקרים מראים שכל שנייה של עיכוב מורידה את אחוז ההמרה בכ-7%, ו-53% מהגולשים נוטשים אתר שלוקח מעל 3 שניות להיטען. אתר מהיר יותר = יותר גולשים שנשארים = יותר פניות ומכירות.",
  },
  {
    q: "מה אני מקבל בסוף התהליך?",
    a: "אתר מהיר יותר — וגם דוח 'לפני ואחרי' מסודר עם ציוני Lighthouse, PageSpeed Insights ו-GTmetrix, כך שתראו בדיוק מה השתפר ובכמה. השיפור מדיד ושקוף, לא הבטחה כללית.",
  },
];

const WebsitePerformance = () => {
  useSeoMeta({
    title: "שיפור מהירות אתרים | אופטימיזציית Core Web Vitals | NZ-web",
    description:
      "שיפור ביצועי אתרים וציוני Core Web Vitals. אופטימיזציה לתמונות, קיצור זמני טעינה ושיפור דירוג בגוגל. audit מלא עם דוח לפני ואחרי.",
    keywords:
      "שיפור מהירות אתר, אתר איטי, Core Web Vitals, אופטימיזציית אתרים, PageSpeed, שיפור ביצועי אתר, זמן טעינה, אופטימיזציה לגוגל",
  });
  useBreadcrumb({ name: "שיפור מהירות אתרים", path: "/services/website-performance", parent: { name: "שירותים", path: "/services" } });

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

    /* FAQPage schema — eligible for rich results in Google */
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.id = `${SCHEMA_ID}-faq`;
    faqScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    });
    document.getElementById(`${SCHEMA_ID}-faq`)?.remove();
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
      document.getElementById(`${SCHEMA_ID}-faq`)?.remove();
    };
  }, []);

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
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
            <h1 className="text-display font-heebo text-balance text-foreground mb-4">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                תשתית, אחסון ו-CDN
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                לפעמים הבעיה היא לא בקוד — היא בתשתית. אחסון איטי, שרת רחוק גאוגרפית מהגולשים, או היעדר CDN יכולים להוסיף שניות יקרות לזמן הטעינה, ולא משנה כמה האתר עצמו מותאם.
              </p>
              <p>
                אנחנו בודקים את כל השרשרת: זמן התגובה של השרת, הגדרות ה-CDN, דחיסה (gzip/brotli) ו-caching headers. לפעמים מעבר אחסון פשוט הוא השיפור הכי משמעותי שאפשר לעשות.
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
                <Search className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                איך מהירות משפיעה על הדירוג בגוגל
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                מהירות היא חלק רשמי מאלגוריתם הדירוג של גוגל דרך מדדי Core Web Vitals. שני אתרים עם תוכן דומה — המהיר יותר ידורג גבוה יותר. בשוק תחרותי כמו ישראל, זה ההבדל בין עמוד ראשון לעמוד שני.
              </p>
              <p>
                מעבר לדירוג עצמו — אתר מהיר נסרק טוב יותר על ידי גוגל, הגולשים נשארים בו יותר זמן, ושיעור הנטישה יורד. כל אלה סיגנלים שגוגל מתרגמת בסופו של דבר ליותר חשיפה.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-secondary/20" dir="rtl">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
              שאלות נפוצות על שיפור מהירות אתרים
            </h2>
          </div>
          <div className="space-y-5">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className="rounded-2xl border border-border/40 bg-card p-5 md:p-6"
              >
                <h3 className="font-heebo text-base md:text-lg font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="border-t border-border/30 py-10 md:py-14" dir="rtl">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            שירותים נוספים שיכולים לעניין אתכם
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {[
              { label: "בניית אתרים מקצועיים", href: "/services/web-development/" },
              { label: "פיתוח אתרים מתקדם", href: "/services/website-development/" },
              { label: "אתר תדמית לעסקים", href: "/services/business-website/" },
              { label: "פיתוח React", href: "/services/react-development/" },
              { label: "בניית דפי נחיתה", href: "/services/landing-page-development/" },
              { label: "כל השירותים", href: "/services/" },
            ].map((s) => (
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

      {/* CTA */}
      <section className="py-16 md:py-24 nz-brand-dark">
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
              to="/contact/"
              className="btn-brand inline-block font-bold text-base px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              צרו קשר
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </main>
  );
};

export default WebsitePerformance;
