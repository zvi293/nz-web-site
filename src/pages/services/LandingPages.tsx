import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, TrendingUp, MousePointer, BarChart2, TestTube, Layers, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-landing-pages";

const FAQS = [
  {
    q: "מה ההבדל בין דף נחיתה לאתר?",
    a: "אתר הוא נוכחות דיגיטלית רחבה עם כמה עמודים וניווט. דף נחיתה הוא עמוד בודד עם מטרה אחת — בדרך כלל לקמפיין פרסומי. אין בו ניווט שיסיח את הגולש, וכל אלמנט בו מכוון לפעולה אחת: השארת פרטים, רכישה או התקשרות.",
  },
  {
    q: "כמה זמן לוקח לבנות דף נחיתה?",
    a: "בדרך כלל 7 עד 14 ימי עסקים מפגישת האפיון ועד דף חי ומפרסם. דף פשוט יכול להיות מוכן ב-5 ימים. אם יש לכם דדליין של קמפיין — נתאים את עצמנו אליו.",
  },
  {
    q: "הדף יתחבר למערכות הפרסום והמדידה שלי?",
    a: "כן. אנחנו מחברים כל דף ל-Google Analytics, Facebook Pixel, Google Tag Manager, מערכות CRM ורשימות תפוצה — כך שכל ליד נמדד ומגיע לאן שצריך, ואתם יודעים בדיוק מה ה-ROI של הקמפיין.",
  },
  {
    q: "אפשר לעדכן את הדף לבד אחרי שהוא עולה?",
    a: "כן — אנחנו בונים עם ממשק פשוט שמאפשר לכם לשנות טקסטים, הצעות ותמונות בלי לדעת קוד, כדי שתוכלו לרענן מבצעים באופן עצמאי.",
  },
  {
    q: "האם אתם גם מריצים את הקמפיין עצמו?",
    a: "אנחנו מתמחים בבנייה של הדף — הנכס שממיר את התנועה. את הקמפיין עצמו אתם או אנשי הפרסום שלכם מריצים, ואנחנו נשמח להמליץ על כלים, על מבנה A/B test ועל איך לנתח תוצאות.",
  },
  {
    q: "דף נחיתה מתאים גם לעסק קטן?",
    a: "בהחלט — ודווקא לעסק קטן זה קריטי. תקציב פרסום מוגבל מחייב שכל שקל יעבוד. דף נחיתה ממוקד מכפיל את ההמרה של אותו תקציב בדיוק, ולכן הוא אחת ההשקעות המשתלמות ביותר לעסק קטן שמפרסם.",
  },
];

const LandingPages = () => {
  useSeoMeta({
    title: "בניית דפי נחיתה שממירים | דף נחיתה לקמפיינים | NZ-web",
    description:
      "בניית דפי נחיתה מהירים, ממירים ומחוברים למערכות שיווק. UX מוכח לדפי מכירה, טעינה מתחת ל-2 שניות ו-SEO מובנה. דף נחיתה שמכפיל את ה-ROI של הקמפיין.",
    keywords:
      "בניית דפי נחיתה, דף נחיתה, landing page, דף נחיתה לקמפיין, עמוד נחיתה ממיר, דף נחיתה לגוגל, דף נחיתה לפייסבוק, בניית לנדינג פייג'",
  });
  useBreadcrumb({ name: "בניית דפי נחיתה", path: "/services/landing-pages", parent: { name: "שירותים", path: "/services" } });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Landing Page Development",
      name: "בניית דפי נחיתה שממירים",
      description:
        "פיתוח דפי נחיתה מהירים עם UX ממיר, מחוברים למערכות שיווק ו-CRM.",
      provider: {
        "@type": "Organization",
        name: "NZ-web",
        url: "https://nz-web.com",
      },
      areaServed: {
        "@type": "Country",
        name: "Israel",
      },
      url: "https://nz-web.com/services/landing-pages",
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
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">דפי נחיתה</span>
            </div>
            <h1 className="text-display font-heebo text-balance text-foreground mb-4">
              בניית דפי נחיתה שממירים
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              דף נחיתה הוא לא עוד עמוד. הוא כלי מכירה. כשהוא בנוי נכון, הוא ממיר. כשהוא לא – לא יעזרו לו שום פרסומות.
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
                <Target className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                מה גורם לדף נחיתה להמיר
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                המרה מתחילה הרבה לפני שהמשתמש מגיע לכפתור. היא מתחילה ב-headline שמדבר ישירות לבעיה שלו. ממשיכה בהוכחה שאתם יכולים לפתור אותה. ומסתיימת ב-CTA שברור, פשוט, ועושה את מה שצריך.
              </p>
              <p>
                אנחנו חוקרים את הקהל שלכם לפני שאנחנו כותבים שורה אחת. כי דף שמדבר לכולם לא מדבר לאף אחד.
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
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                חשיבות המהירות
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                קמפיין גוגל Ads שמוביל לדף שנטען ב-5 שניות הוא כסף שנזרק. מחקרים מראים שכל שנייה עיכוב מפחיתה את אחוז ההמרה בכ-7%. זה לא תיאוריה – זה כסף.
              </p>
              <p>
                הדפים שאנחנו בונים מגיעים ל-90+ ב-PageSpeed Insights. אנחנו לא מתפשרים על זה – זה חלק בלתי נפרד מהשירות.
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
                <MousePointer className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                UX נכון לדפי מכירה
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                דפי נחיתה טובים לא מנסים להיות יפים – הם מנסים להיות ברורים. זרימת קריאה נכונה, היררכיה ויזואלית נקייה, ו-friction מינימלי בדרך לכפתור.
              </p>
              <p>
                מנייד הכל נראה אחרת. כפתורים נגישים לאגודל, טפסים קצרים, ו-hero שמסביר הכל בשלוש שניות – אנחנו מתכננים לזה ספציפית.
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
                <BarChart2 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                חיבור למערכות שיווק
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                דף שממיר חייב להיות מחובר. אנחנו מחברים לפיקסל פייסבוק, Google Tag Manager, מערכות CRM, ורשימות תפוצה – כדי שכל ליד שנכנס מגיע לאנשים הנכונים.
              </p>
              <p>
                אנחנו גם מגדירים אנליטיקה נכונה, כדי שתדעו מאיפה מגיעים הלידים הכי איכותיים ותוכלו לאופטמז את הקמפיינים.
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
                <TestTube className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                בנוי מראש ל-A/B Testing
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                דף נחיתה טוב הוא נקודת התחלה, לא סוף. אנחנו בונים את הדף כך שיהיה קל להחליף ולבדוק גרסאות — כותרת אחרת, צבע כפתור אחר, תמונה אחרת — ולגלות על בסיס נתונים אמיתיים מה מביא יותר המרות.
              </p>
              <p>
                בלי מבנה שמתוכנן ל-A/B test מראש, כל שינוי הופך לפרויקט. עם המבנה הנכון, אתם משפרים את אחוז ההמרה שוב ושוב — ואותו תקציב פרסום מביא יותר ויותר לקוחות לאורך זמן.
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
                <Layers className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                דף נחיתה ו-SEO — איך זה עובד יחד
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                רוב דפי הנחיתה משרתים קמפיין ממומן — אבל דף נחיתה שבנוי נכון יכול גם להביא תנועה אורגנית. אנחנו בונים כל דף עם pre-rendering מלא, מבנה כותרות תקין ו-meta tags נכונים, כך שגוגל קורא את כל התוכן ויכול לדרג אותו.
              </p>
              <p>
                המשמעות: גם כשהקמפיין הממומן נעצר, הדף ממשיך לעבוד. הוא לא "נעלם" — הוא נכס שיכול להמשיך להביא לידים גם בלי תקציב פרסום שוטף.
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
              שאלות נפוצות על בניית דפי נחיתה
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
              { label: "בניית דפי נחיתה ממירים", href: "/services/landing-page-development/" },
              { label: "בניית אתרים מקצועיים", href: "/services/web-development/" },
              { label: "אתר תדמית לעסקים", href: "/services/business-website/" },
              { label: "שיפור מהירות אתרים", href: "/services/website-performance/" },
              { label: "מערכת ניהול תורים", href: "/services/appointment-system/" },
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
              רוצים דף שממיר?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              ספרו לנו על המוצר או השירות – נבנה דף שיביא תוצאות.
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

export default LandingPages;
