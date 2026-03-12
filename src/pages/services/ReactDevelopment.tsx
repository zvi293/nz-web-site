import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layers, Code2, Cpu, Repeat, ArrowLeftRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-react-development";

const ReactDevelopment = () => {
  useSeoMeta({
    title: "פיתוח React מתקדם | NZ-web",
    description:
      "פיתוח אפליקציות ואתרים מבוססי React עם TypeScript. ביצועים גבוהים, ארכיטקטורה נקייה, ושילוב עם מערכות backend.",
  });
  useBreadcrumb({ name: "פיתוח React", path: "/services/react-development" });

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
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">פיתוח React</span>
            </div>
            <h1 className="font-heebo text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
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
              יש לכם פרויקט React?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              שתפו אותנו בדרישות – ונעזור לכם לבנות את זה נכון.
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

export default ReactDevelopment;
