import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, LayoutTemplate, Layers3, Smartphone, Users, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const SCHEMA_ID = "service-schema-website-development";

const WebsiteDevelopment = () => {
  useSeoMeta({
    title: "פיתוח אתרים מקצועי | NZ-web",
    description: "פיתוח אתרים מודרניים לעסקים שרוצים נוכחות דיגיטלית יציבה, מהירה ומקצועית.",
  });
  useBreadcrumb({ name: "פיתוח אתרים מקצועי", path: "/services/website-development" });

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Website Development",
      provider: {
        "@type": "Organization",
        name: "NZ-web",
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
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-medium">שירות פיתוח אתרים</span>
            </div>
            <h1 className="mb-4 font-heebo text-3xl font-bold leading-tight text-foreground md:text-5xl">
              פיתוח אתרים בהתאמה מלאה לעסק
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              כשעסק צריך אתר חדש, השאלה היא לא רק איך הוא ייראה אלא איך הוא יעבוד ביום יום.
              פיתוח אתר טוב נשען על תשתית נכונה, חיבורים מדויקים למערכות שצריך, וחשיבה קדימה
              כדי שהאתר יישאר יציב, נוח לתחזוקה, ורלוונטי גם בהמשך.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-16 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">מה נכנס לפיתוח של אתר טוב</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                בפועל, פיתוח אתר כולל הרבה מעבר להרכבת עמודים. הוא מתחיל בהבנה של הצרכים העסקיים,
                ממשיך בבניית מסכים וזרימות עבודה, ומגיע עד לחיבורים לטפסים, אזורי ניהול, שירותים חיצוניים
                ובדיקות לפני עלייה לאוויר.
              </p>
              <p>
                המטרה היא לבנות נכס דיגיטלי שאפשר לעבוד איתו באמת. כזה שמציג את העסק בצורה טובה,
                אבל גם תומך בתפעול, בעדכונים עתידיים, וביכולת לגדול בלי להישען כל פעם על פתרונות זמניים.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers3 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">למה ארכיטקטורת אתר חשובה כל כך</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                הרבה פעמים ההבדל בין אתר שנעים לעבוד איתו לבין אתר שמתחיל להכביד אחרי כמה חודשים,
                נמצא בשכבה שלא רואים מיד. ארכיטקטורה טובה משפיעה על הניווט, על התחזוקה, על היכולת
                להוסיף פיצ׳רים, וגם על הדרך שבה מנועי חיפוש מבינים את האתר.
              </p>
              <p>
                כשהבסיס בנוי נכון, השינויים בעתיד נעשים טבעיים יותר. לא צריך לפרק כל פעם מחדש,
                ולא נוצר עומס מיותר של תיקונים קטנים רק כי החלטות היסוד לא נלקחו בזמן.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4 rounded-2xl bg-secondary/30 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">שילוב מערכות ואוטומציות</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                אתר לא אמור לעמוד לבד. בהרבה מקרים הוא צריך להתחבר לטפסים, CRM, מערכת תורים,
                דיוור, WhatsApp או אזור ניהול פנימי. החיבורים האלה הם לא תוספת צדדית, אלא חלק
                ממה שהופך את האתר לכלי עבודה אמיתי.
              </p>
              <p>
                כשזה נבנה נכון מההתחלה, האתר לא רק נראה טוב כלפי חוץ, אלא גם חוסך עבודה ידנית,
                מסדר פניות, ותומך בצורה שקטה בתהליך העבודה של העסק.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">התאמה למובייל ולביצועים גבוהים</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                כשלקוח נכנס לאתר מהנייד, אין הרבה זמן להסביר. האתר צריך להיטען מהר, להיות נוח לקריאה,
                לאפשר פעולה פשוטה, ולעבוד חלק גם על מסכים קטנים. זה חשוב בעיקר כשחלק גדול מהכניסות
                מגיעות ממובייל.
              </p>
              <p>
                מהירות וביצועים טובים משפיעים גם על התחושה הכללית וגם על התוצאה העסקית. אתר מהיר
                שומר טוב יותר על תשומת הלב של המשתמש ומקטין נטישה מיותרת בדרך לפנייה או לפעולה.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="font-heebo text-2xl font-bold text-foreground md:text-3xl">למי השירות מתאים</h2>
            </div>
            <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
              <p>
                השירות מתאים לעסקים שצריכים בסיס דיגיטלי יציב, לחברות שרוצות לשדרג אתר או מערכת קיימת,
                ולמי שמחפש פתרון רחב יותר מאתר תדמית פשוט. הוא מתאים במיוחד כשיש צורך לחבר בין נראות,
                תפעול וצרכים עסקיים אמיתיים.
              </p>
              <p>
                אם חשוב לכם שהאתר לא יהיה רק עמוד יפה אלא חלק ממערכת עבודה רחבה יותר,
                זה בדיוק המקום שבו פיתוח נכון עושה את ההבדל.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 font-heebo text-3xl font-bold text-white md:text-4xl">רוצים לבנות אתר על בסיס נכון?</h2>
            <p className="mb-8 text-lg text-white/70">אפשר להתחיל משיחה עניינית על מה שהאתר שלכם צריך לעשות בפועל.</p>
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

export default WebsiteDevelopment;
