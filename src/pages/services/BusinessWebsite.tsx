import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BadgeCheck, Building2, FileText, Search, ShieldCheck, LayoutPanelTop } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-business-website";

const BusinessWebsite = () => {
  useSeoMeta({
    title: "בניית אתר תדמית לעסקים | NZ-WEB",
    description: "בניית אתר תדמית מקצועי לעסקים שרוצים להציג שירותים בצורה ברורה, לבנות אמון ולהיראות נכון בגוגל.",
  });
  useBreadcrumb({ name: "בניית אתר תדמית לעסקים", path: "/services/business-website" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Business Website",
      provider: {
        "@type": "Organization",
        name: "NZ-WEB",
        url: "https://nz-web.com",
      },
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

      <section className="relative bg-gradient-to-b from-secondary to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">שירות אתר תדמית</span>
            </div>
            <h1 className="mb-4 font-heebo text-3xl font-bold leading-tight text-foreground md:text-5xl">
              בניית אתר תדמית שמייצג את העסק בצורה מקצועית
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              הרבה פעמים אתר תדמית הוא המפגש הראשון של לקוח עם העסק. בתוך כמה שניות הוא צריך להבין
              מי אתם, מה אתם עושים, והאם יש כאן עסק שאפשר לסמוך עליו. המטרה היא לא להרשים בכוח,
              אלא להציג את הדברים בצורה נעימה, ברורה ומשכנעת.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-16 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><LayoutPanelTop className="h-5 w-5" /></div><h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">למה כמעט כל עסק צריך אתר תדמית</h2></div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                גם אם רוב הפניות מגיעות מהמלצות, רשתות חברתיות או WhatsApp, לקוחות עדיין מחפשים מקום
                מסודר שבו אפשר להבין עם מי הם עומדים לדבר. אתר תדמית נותן לעסק בית קבוע ברשת ומסדר
                את המידע במקום אחד.
              </p>
              <p>
                הוא לא מחליף שיחה אישית, אבל הוא כן יוצר את הקרקע לשיחה הזו. הוא עוזר ללקוח להגיע
                מוכן יותר, בטוח יותר, ועם הבנה טובה יותר של מה שהעסק מציע.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div><h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">איך אתר תדמית בונה אמון</h2></div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                אמון נבנה מפרטים קטנים: ניסוח נעים, סדר נכון של מידע, עמוד צור קשר נגיש, והבנה מהירה
                של מי עומד מאחורי העסק. כשלקוח נכנס לאתר ומרגיש שהכול יושב במקום, משהו בתקשורת נהיה פשוט יותר.
              </p>
              <p>
                זה חשוב בעיקר כשמדובר בשירותים שמבקשים מהלקוח להשאיר פרטים, לקבוע שיחה או לבחור בספק.
                אתר שנראה מחושב ויציב משדר תחושת רצינות עוד לפני המגע הראשון.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4 rounded-2xl bg-secondary/30 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div><h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">מבנה שעוזר להציג את העסק נכון</h2></div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                אתר תדמית טוב לא מעמיס. הוא מוביל את הגולש בין עמוד בית, אודות, שירותים, דוגמאות עבודה
                ויצירת קשר בצורה טבעית. כל חלק בדף צריך לענות על שאלה אמיתית של לקוח, ולא רק למלא מקום.
              </p>
              <p>
                כשהסדר נכון, קל יותר להבין את הערך של העסק. אין צורך לחפש בכוח את המידע החשוב,
                והחוויה כולה מרגישה מדויקת ובטוחה יותר.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BadgeCheck className="h-5 w-5" /></div><h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">שילוב בין תוכן לתדמית מקצועית</h2></div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                התוכן הוא חלק מהאופן שבו העסק נתפס. הוא צריך להסביר את הדברים בפשטות, אבל גם לשקף
                ניסיון, בהירות וביטחון. לא טקסט שיווקי מדי, ולא ניסוח קר ומרוחק.
              </p>
              <p>
                כשיש התאמה בין השפה, הכותרות, הטון והעיצוב, האתר מרגיש אמין יותר. זה לא עניין של סיסמאות,
                אלא של הדרך שבה העסק מציג את עצמו.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Search className="h-5 w-5" /></div><h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">התאמה למנועי חיפוש</h2></div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                אתר תדמית צריך לעבוד קודם כול בשביל אנשים, אבל חשוב שגם גוגל יוכל להבין אותו כמו שצריך.
                כותרות מסודרות, חלוקה נכונה לעמודים, תוכן ממוקד וניווט פנימי טוב עוזרים לזה לקרות.
              </p>
              <p>
                זה לא מבטיח הכול מעצמו, אבל כן יוצר בסיס חזק לנוכחות אורגנית יציבה יותר לאורך זמן.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 font-heebo text-3xl font-bold text-white md:text-4xl">רוצים אתר שמציג את העסק כמו שצריך?</h2>
            <p className="mb-8 text-lg text-white/70">אפשר לבנות אתר תדמית נעים, ברור ואמין שייתן לעסק נוכחות טובה יותר ברשת.</p>
            <Link to="/contact" className="inline-block rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">צרו קשר</Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

export default BusinessWebsite;
