import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, TrendingUp, MousePointer, BarChart2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-landing-pages";

const LandingPages = () => {
  useSeoMeta({
    title: "בניית דפי נחיתה שממירים | NZ-web",
    description:
      "בניית דפי נחיתה מהירים, ממירים ומחוברים למערכות שיווק. UX מוכח לדפי מכירה עם תשומת לב לכל פרט.",
  });
  useBreadcrumb({ name: "בניית דפי נחיתה", path: "/services/landing-pages" });

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
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">דפי נחיתה</span>
            </div>
            <h1 className="font-heebo text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
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
              רוצים דף שממיר?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              ספרו לנו על המוצר או השירות – נבנה דף שיביא תוצאות.
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

export default LandingPages;
