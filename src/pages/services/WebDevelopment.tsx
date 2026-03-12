import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Monitor, Code, Zap, Globe, Users, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-web-development";

const WebDevelopment = () => {
  useSeoMeta({
    title: "בניית אתרים מקצועיים | NZ-web",
    description:
      "בניית אתרים מהירים, מודרניים ואמינים לעסקים שרוצים נוכחות דיגיטלית מקצועית. Full-Stack, React, TypeScript ועיצוב UI/UX מרהיב.",
  });
  useBreadcrumb({ name: "בניית אתרים מקצועיים", path: "/services/web-development" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Web Development",
      name: "בניית אתרים מקצועיים",
      description:
        "פיתוח אתרים מהירים, מודרניים ואמינים לעסקים. React, TypeScript, Tailwind CSS ועיצוב UI/UX מרהיב.",
      provider: {
        "@type": "Organization",
        name: "NZ-web",
        url: "https://nz-web.com",
      },
      areaServed: {
        "@type": "Country",
        name: "Israel",
      },
      url: "https://nz-web.com/services/web-development",
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
              <Monitor className="h-4 w-4" />
              <span className="text-sm font-medium">שירות פיתוח אתרים</span>
            </div>
            <h1 className="font-heebo text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              בניית אתרים מקצועיים לעסקים
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              אנחנו בונים אתרים שלא רק נראים טוב – הם מהירים, יציבים, ומביאים תוצאות אמיתיות. כל פרויקט מתחיל מהבנה עמוקה של העסק שלכם.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
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
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                מה זה אתר מקצועי באמת
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                אתר מקצועי הוא לא רק עיצוב יפה. זה שילוב בין מהירות טעינה, ניווט ברור, תוכן שמדבר לקהל שלכם, ותשתית טכנולוגית שלא תיפול ברגע שהתנועה עולה.
              </p>
              <p>
                הרבה עסקים מגיעים אלינו עם אתר שנראה סביר אבל לא ממיר – כי הבניה שלו לא נעשתה עם הלוגיקה הנכונה. אתר מקצועי חייב לשרת מטרה עסקית ברורה, לא רק להיות קיים.
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
                <CheckCircle className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                תהליך העבודה שלנו
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                אנחנו לא שולחים שאלון של 40 שאלות ומתחילים לפתח. אנחנו מתחילים בשיחה – מה העסק שלכם צריך, מי הלקוחות שלכם, ומה הבעיה האמיתית שהאתר צריך לפתור.
              </p>
              <p>
                אחרי שיש תמונה ברורה, אנחנו בונים מבנה, מקבלים אישור, ומתחילים לפתח. אנחנו מציגים גרסאות ביניים כדי שתמיד תהיה לכם שליטה על התהליך.
              </p>
              <p>
                השקה אינה סוף העבודה. אנחנו עוקבים אחרי הביצועים ב-30 הימים הראשונים ומבצעים שיפורים לפי הצורך.
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
                <Code className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                טכנולוגיות שאנחנו עובדים איתן
              </h2>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              אנחנו בוחרים טכנולוגיות לפי מה שנכון לפרויקט, לא לפי מה שנוח לנו. הסטאק שלנו:
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "Vite"].map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  {tech}
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
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                למה חשוב אתר מהיר ואמין
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                גוגל מדרגת אתרים לפי מהירות. משתמשים שגולשים מנייד מצפים שהאתר יטען תוך שנייה. כל שנייה עיכוב עולה בנטישת גולשים – וזה נמדד.
              </p>
              <p>
                כשאנחנו בונים אתר, אנחנו מייעלים תמונות, כותבים קוד נקי, ומשתמשים בארכיטקטורה שנותנת ציונים גבוהים ב-Core Web Vitals. לא בגלל שזה תרגיל – בגלל שזה ישירות משפיע על הכסף שלכם.
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
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl md:text-3xl font-bold text-foreground">
                למי השירות מתאים
              </h2>
            </div>
            <div className="text-muted-foreground text-base leading-relaxed space-y-3">
              <p>
                אנחנו עובדים עם עצמאיים, עסקים קטנים ובינוניים, וסטארטאפים בשלב ראשוני. אם אתם צריכים אתר תדמית, פורטפוליו, חנות או מערכת – נשמח לשמוע.
              </p>
              <p>
                אנחנו בונים לטווח ארוך, עם קוד נקי שניתן לתחזק ולהרחיב – לא פתרונות מהירים שיתפרקו בעוד שנה.
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
              מוכנים לבנות אתר שעובד?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              דברו איתנו על הפרויקט שלכם – בלי התחייבות.
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

export default WebDevelopment;
