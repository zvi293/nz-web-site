import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gauge, LayoutPanelTop, Megaphone, MousePointerClick, Rows3, Target } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-landing-page-development";

const LandingPageDevelopment = () => {
  useSeoMeta({
    title: "בניית דפי נחיתה מקצועיים | NZ-WEB",
    description: "בניית דפי נחיתה מקצועיים לעסקים שרוצים לייצר פניות בצורה ברורה, מהירה ומדויקת לקמפיינים שיווקיים.",
  });
  useBreadcrumb({ name: "בניית דפי נחיתה מקצועיים", path: "/services/landing-page-development" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Landing Page Development",
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
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">בניית דפי נחיתה</span>
            </div>
            <h1 className="mb-4 font-heebo text-3xl font-bold leading-tight text-foreground md:text-5xl">
              בניית דפי נחיתה שמייצרים פניות
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              כדי שדף נחיתה באמת יעבוד, הוא צריך לומר את הדבר הנכון מהר ולהוביל לפעולה בלי להעמיס.
              אין כאן מקום לרעש מיותר. המסר, הכותרת, הטופס והקצב של הדף צריכים לעבוד יחד כדי להפוך
              כניסה קצרה לפנייה איכותית יותר.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-16 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">מה גורם לדף נחיתה לעבוד</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                דף נחיתה טוב לא מנסה להסביר הכול. הוא מתמקד בהצעה אחת, מדבר לקהל אחד,
                ומסביר מהר למה כדאי לעצור ולהשאיר פרטים. כשהכול ממוקד, גם ההחלטה של המשתמש נהיית פשוטה יותר.
              </p>
              <p>
                זה חשוב במיוחד כשמגיעים מקמפיין. למשתמש אין סבלנות לקרוא מסביב. הוא רוצה להבין מיד
                אם הוא במקום הנכון.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Rows3 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">מסר ברור ומבנה שמוביל לפעולה</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                מבנה טוב מתחיל בכותרת שמבהירה מיד מה מוצע, ממשיך בתוכן קצר ותומך, ובונה את הדרך אל הטופס
                או אל כפתור הפעולה בלי לבלבל. כל חלק צריך לקדם את אותו כיוון, לא לפתוח עוד ועוד מסלולים.
              </p>
              <p>
                כשיש רצף נכון בין הכותרת, ההסבר והפעולה המבוקשת, הדף מרגיש טבעי יותר ומוריד חיכוך בדרך לפנייה.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4 rounded-2xl bg-secondary/30 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutPanelTop className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">שילוב קריאה לפעולה במקום הנכון</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                CTA טוב לא עובד לבד. הוא צריך להגיע אחרי שהמשתמש כבר הבין מה מציעים לו,
                למה זה רלוונטי, ומה הצעד הבא. אחרת הוא מרגיש מוקדם מדי או מאולץ.
              </p>
              <p>
                הרבה פעמים השיפור האמיתי מגיע לא מהחלפת הכפתור, אלא מהדרך שבה הדף מוביל אליו.
                שם נבנית ההמרה.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Gauge className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">מהירות וביצועים בדפי נחיתה</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                בדף נחיתה כל שנייה מורגשת. אם הוא כבד, עמוס או איטי, חלק מהמשתמשים פשוט ימשיכו הלאה.
                לכן חשוב שהוא יהיה חד, קל לטעינה ונעים לשימוש גם במובייל.
              </p>
              <p>
                זה משפיע לא רק על התחושה, אלא גם על איכות התנועה שמצליחה להפוך לפנייה בפועל.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">התאמה לקמפיינים שיווקיים</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                דף נחיתה צריך להמשיך את מה שהמודעה התחילה. אם יש פער בין המסר בקמפיין לבין מה שמחכה
                למשתמש בדף, נוצר בלבול והאמון נפגע מהר.
              </p>
              <p>
                כשהעמוד מדבר באותה שפה של הקמפיין, הכול מרגיש רציף יותר. המשתמש מבין מהר שהגיע למקום הנכון,
                והפנייה שמתקבלת בדרך כלל איכותית יותר.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 font-heebo text-3xl font-bold text-white md:text-4xl">צריכים דף נחיתה ממוקד יותר?</h2>
            <p className="mb-8 text-lg text-white/70">אפשר לבנות עמוד חד, מהיר וברור יותר שיתאים לקמפיין ולמטרה שלו.</p>
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

export default LandingPageDevelopment;
