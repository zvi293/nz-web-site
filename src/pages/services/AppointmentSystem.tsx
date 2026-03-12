import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BellRing, CalendarClock, CheckCircle2, ClipboardList, Smile, UsersRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-appointment-system";

const AppointmentSystem = () => {
  useSeoMeta({
    title: "מערכת ניהול תורים לעסקים | NZ-WEB",
    description: "פיתוח מערכת ניהול תורים חכמה לעסקים שרוצים לנהל פגישות בצורה מסודרת, להפחית עומס ידני ולשפר את חוויית הלקוח.",
  });
  useBreadcrumb({ name: "מערכת ניהול תורים לעסקים", path: "/services/appointment-system" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Appointment Management System",
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
              <CalendarClock className="h-4 w-4" />
              <span className="text-sm font-medium">מערכת ניהול תורים</span>
            </div>
            <h1 className="mb-4 font-heebo text-3xl font-bold leading-tight text-foreground md:text-5xl">
              פיתוח מערכת ניהול תורים חכמה
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              כשעסק מתאם פגישות דרך הודעות, טלפונים ותזכורות ידניות, מהר מאוד נוצר עומס.
              מערכת ניהול תורים טובה מכניסה סדר לשגרה, מפחיתה בלבול, ועוזרת גם לצוות וגם ללקוח
              לדעת בדיוק מה קורה ומתי.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-16 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">למה עסקים צריכים מערכת ניהול תורים</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                הרבה פעמים הבעיה לא מתחילה בכמות העבודה, אלא בדרך שבה היא מתנהלת. תור שנקבע בהודעה,
                שינוי שנשכח, לקוח שלא קיבל אישור, או יומן שאף אחד לא רואה בזמן אמת. זה יוצר עומס,
                חוסר שקט ותחושת בלגן מיותרת.
              </p>
              <p>
                מערכת ניהול תורים מרכזת את הכול במקום אחד ומאפשרת לעסק לפעול בצורה שקטה יותר,
                בלי לרדוף אחרי כל קביעה מחדש.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">ניהול פגישות בלי כאוס מיותר</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                מערכת טובה מאפשרת להגדיר זמינות, סוגי פגישות, משכי זמן, סטטוסים וחלונות שירות,
                כך שכל אחד יודע מה הוזמן, מה אושר ומה דורש טיפול. במקום התנהלות מפוזרת, יש תמונה אחת ברורה.
              </p>
              <p>
                בפועל זה חוסך זמן, מפחית טעויות, ומאפשר לעבוד בצורה הרבה יותר רגועה גם כשהלו״ז עמוס.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4 rounded-2xl bg-secondary/30 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BellRing className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">התראות ואוטומציה שעוזרות באמת</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                אחד היתרונות החשובים במערכת כזו הוא האפשרות לשלוח אישורים, תזכורות ועדכונים בצורה אוטומטית.
                זה מוריד עומס מהצוות ומקטין מצבים שבהם דברים נופלים בין הכיסאות.
              </p>
              <p>
                מעבר לזה, אפשר לשלב טפסים, תיעוד פנימי או חיבורים למערכות נוספות, כך שניהול התורים
                הופך להיות חלק מזרימת העבודה של העסק ולא עוד משימה נפרדת.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">התאמה לעסקים קטנים ובינוניים</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                לא כל עסק צריך מערכת כבדה. ברוב המקרים עדיף לבנות פתרון שמתאים לאופי השירות,
                למספר אנשי הצוות, ולדרך שבה הלקוחות באמת קובעים תור.
              </p>
              <p>
                כשיש התאמה כזו, המערכת נשארת נוחה לשימוש לאורך זמן. היא לא מרגישה כמו שכבה מסובכת,
                אלא כמו משהו שעוזר לעבוד טוב יותר.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Smile className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">איך זה משפר את חוויית הלקוח</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                כשלקוח יכול לקבוע פגישה בקלות, להבין את הזמינות ולקבל עדכון בלי לרדוף אחרי העסק,
                כל החוויה מרגישה נעימה ובטוחה יותר. זה לא רק עניין תפעולי, אלא חלק מהשירות עצמו.
              </p>
              <p>
                בסוף, מערכת ניהול תורים טובה עוזרת לעסק לעבוד בשקט וללקוח להרגיש שהוא בידיים מסודרות.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 font-heebo text-3xl font-bold text-white md:text-4xl">רוצים להכניס יותר סדר ליומן?</h2>
            <p className="mb-8 text-lg text-white/70">אפשר לבנות מערכת שתתאים לאופן שבו השירות שלכם באמת מתנהל.</p>
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

export default AppointmentSystem;
