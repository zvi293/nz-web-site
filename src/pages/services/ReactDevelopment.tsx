import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layers, Code2, Cpu, Repeat, ArrowLeftRight, Smartphone, ShieldCheck, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-react-development";

const FAQS = [
  {
    q: "מה ההבדל בין אתר רגיל לאתר שנבנה ב-React?",
    a: "אתר רגיל (למשל על WordPress עם תבנית) מתאים לתוכן סטטי. React מתאים כשיש אינטראקטיביות, לוגיקה עסקית, אזורים אישיים או מסכים שמתעדכנים בזמן אמת — האתר מרגיש מהיר וחלק כמו אפליקציה, בלי טעינות עמוד מחדש.",
  },
  {
    q: "האם אתר React טוב ל-SEO?",
    a: "כן — כשהוא נבנה נכון. אנחנו בונים כל פרויקט React עם pre-rendering מלא, כך שגוגל מקבל HTML מלא עם כל התוכן מיד, בלי תלות בהרצת JavaScript. ככה נהנים גם מחוויית ה-React המהירה וגם מקריאוּת מלאה לגוגל.",
  },
  {
    q: "אפשר לחבר אתר React למערכת קיימת שיש לי?",
    a: "בהחלט. אנחנו מתחברים ל-REST APIs, GraphQL, Supabase, Webhooks ומערכות backend קיימות. אם יש לכם כבר מערכת — נשלב איתה. אם לא — נבנה גם את הצד האחורי.",
  },
  {
    q: "כמה זמן לוקח לפתח אתר או אפליקציית React?",
    a: "פרויקט React פשוט — 3 עד 5 שבועות. מערכת מורכבת עם אזור אישי, הרשאות ואינטגרציות — 6 עד 12 שבועות. נגדיר לוח זמנים מדויק אחרי אפיון הדרישות.",
  },
  {
    q: "האם אקבל קוד שאפשר לתחזק ולהרחיב?",
    a: "כן. אנחנו כותבים ב-TypeScript עם ארכיטקטורת רכיבים נקייה, הפרדה ברורה בין UI, state ו-API, ותיעוד. הקוד שלכם — וניתן להעביר אותו לכל מפתח React בעתיד.",
  },
  {
    q: "React מתאים גם לאתר תדמית פשוט?",
    a: "אפשר, אבל לא תמיד צריך. לאתר תדמית סטטי לגמרי גם פתרונות אחרים מספיקים. React מצדיק את עצמו כשיש אינטראקטיביות, מערכת ניהול עשירה או תוכנית להרחיב את האתר למערכת בעתיד. בשיחת ייעוץ נעזור לכם להחליט מה נכון.",
  },
];

const ReactDevelopment = () => {
  useSeoMeta({
    title: "פיתוח React מתקדם | אפליקציות ואתרים מהירים | NZ-web",
    description:
      "פיתוח אפליקציות ואתרים מבוססי React עם TypeScript. ביצועים גבוהים, ארכיטקטורה נקייה, SEO מובנה ושילוב עם מערכות backend. פיתוח React מקצועי בישראל.",
    keywords:
      "פיתוח React, React Developer Israel, אפליקציות React, פיתוח אפליקציות web, React TypeScript, SPA, פיתוח ממשקים, פיתוח Front End",
  });
  useBreadcrumb({ name: "פיתוח React", path: "/services/react-development", parent: { name: "שירותים", path: "/services" } });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "React Development",
      name: "פיתוח אתרי React מתקדמים",
      description:
        "פיתוח אפליקציות ואתרים מבוססי React עם TypeScript, ביצועים גבוהים ושילוב עם מערכות backend.",
      provider: {
        "@type": "Organization",
        name: "NZ-web",
        url: "https://nz-web.com",
      },
      areaServed: {
        "@type": "Country",
        name: "Israel",
      },
      url: "https://nz-web.com/services/react-development",
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
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />
      <BackToHome />

      <main id="page-content">

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary mb-6">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">פיתוח React</span>
            </div>
            <h1 className="text-display font-heebo text-balance text-foreground mb-4">
              פיתוח אתרי React מתקדמים
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              React היא הפלטפורמה שאנחנו הכי טובים בה. אנחנו בונים ממשקים שמרגישים חלקים, מגיבים, ומחזיקים טוב גם בקנה מידה גדול.
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
                <Code2 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                למה React
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                React היא לא סתם טרנד – היא הפכה לסטנדרט התעשייתי לבניית ממשקים מסיבות טובות. ארכיטקטורת component-based מאפשרת לנו לבנות מהר, לתחזק בקלות, ולשדרג מבלי לשבור דברים.
              </p>
              <p>
                מה שחשוב יותר: React עם TypeScript נותנת לנו בטחון בכל שינוי קוד. כשפרויקט גדל, זה ההבדל בין "עבד" ל"עובד גם בשנה הבאה".
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
                <Cpu className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                יתרונות ביצועים
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                עם React אנחנו יכולים לבצע code-splitting, lazy loading, ו-memoization. המשמעות בפועל: רק מה שהמשתמש צריך ברגע זה נטען – שאר האפליקציה נטענת ברקע.
              </p>
              <p>
                זה קריטי במיוחד למשתמשי מובייל. פרויקט React שנבנה נכון ירוויח ציוני Lighthouse גבוהים, וזה משתקף גם בדירוג בגוגל.
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
                <Repeat className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                התאמה למערכות מורכבות
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                React לא רק לאתרים פשוטים. בנינו מערכות ניהול מורכבות, דשבורדים עם נתונים בזמן אמת, ופלטפורמות עם הרשאות מרובות – הכל מבוסס React.
              </p>
              <p>
                כשיש לוגיקה עסקית מורכבת, אנחנו בונים ארכיטקטורה שמפרידה בין state management, UI components ו-API layer. זה נותן קוד שניתן לקרוא, לתחזק ולהעביר לצוות אחר ביום מן הימים.
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
                <ArrowLeftRight className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                שילוב עם מערכות backend
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                הפרונטאנד הוא רק חצי מהתמונה. אנחנו מתחברים ל-REST APIs, GraphQL, Supabase, ו-Webhooks. כל חיבור נבנה עם error handling נכון, loading states, ו-caching – כדי שהמשתמש תמיד יראה ממשק יציב.
              </p>
              <p>
                עובדים עם backend קיים? נשמח לשלב. בונים הכל מאפס? אנחנו עושים גם את זה.
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
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                Mobile-First בלי פשרות
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                יותר מ-70% מהגלישה בישראל היא מהנייד, ולכן אנחנו מתכננים כל ממשק React קודם למסך הקטן ורק אז מתרחבים. זה לא "להקטין את הדסקטופ" — זו חשיבה אחרת מההתחלה: כפתורים בגודל שנוח לאגודל, טפסים קצרים, וניווט שעובד במגע.
              </p>
              <p>
                React מאפשרת לנו לבנות רכיבים שמסתגלים חכם לכל רוחב מסך — כך שאותו קוד נותן חוויה מצוינת גם בנייד, גם בטאבלט וגם במסך גדול, בלי לתחזק שלוש גרסאות.
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
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                אבטחה, יציבות ו-SEO מובנים
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                פרויקט React טוב הוא לא רק מהיר — הוא גם בטוח ויציב. אנחנו מיישמים ניהול הרשאות נכון, ולידציה של קלט, הגנות מפני XSS ו-CSRF, ו-error handling שלא מפיל את הממשק כשמשהו משתבש בצד השרת.
              </p>
              <p>
                ולגבי גוגל — אנחנו בונים כל אתר React עם pre-rendering מלא: גוגל מקבל את כל התוכן כ-HTML מוכן, מיד, בלי תלות בהרצת JavaScript. כך אתם נהנים מחוויית ה-SPA המהירה מבלי לשלם על זה בחשיפה אורגנית.
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
              שאלות נפוצות על פיתוח React
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
              { label: "פיתוח אתרים מתקדם", href: "/services/website-development/" },
              { label: "בניית אתרים מקצועיים", href: "/services/web-development/" },
              { label: "אתר תדמית לעסקים", href: "/services/business-website/" },
              { label: "מערכת ניהול תורים", href: "/services/appointment-system/" },
              { label: "שיפור מהירות אתרים", href: "/services/website-performance/" },
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
              יש לכם פרויקט React?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              שתפו אותנו בדרישות – ונעזור לכם לבנות את זה נכון.
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

      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default ReactDevelopment;
