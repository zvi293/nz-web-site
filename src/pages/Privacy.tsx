import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, Cookie, Database, UserCheck, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getMailtoHref, getTelHref, contactInfo } from "@/lib/contact-utils";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const Privacy = () => {
  useSeoMeta({
    title: "מדיניות פרטיות | NZ-web",
    description:
      "מדיניות הפרטיות של NZ-web – כיצד אנו אוספים, מנהלים ומגינים על המידע שלכם בהתאם לחוק הגנת הפרטיות הישראלי.",
  });
  useBreadcrumb({ name: "מדיניות פרטיות", path: "/privacy" });

  const sections = [
    { number: "1", title: "כללי", icon: <Shield className="h-5 w-5" /> },
    { number: "2", title: "המידע שאנו אוספים", icon: <Database className="h-5 w-5" /> },
    { number: "3", title: "השימוש במידע", icon: <UserCheck className="h-5 w-5" /> },
    { number: "4", title: "העברת מידע לצדדים שלישיים" },
    { number: "5", title: "עוגיות (Cookies)", icon: <Cookie className="h-5 w-5" /> },
    { number: "6", title: "אבטחת מידע", icon: <Lock className="h-5 w-5" /> },
    { number: "7", title: "זכויות המשתמש" },
    { number: "8", title: "שינויים במדיניות הפרטיות" },
    { number: "9", title: "יצירת קשר" },
  ];

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />
      <BackToHome />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 nz-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 border border-primary/40 mb-6 mx-auto"
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="text-display font-heebo text-balance text-white mb-4">
              מדיניות פרטיות
            </h1>
            <p className="text-white/80 text-lg">
              עודכן לאחרונה: 9 במרץ 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content with Sidebar TOC */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-10">

                {/* Section 1 */}
                <Section number="1" title="כללי" icon={<Shield className="h-5 w-5" />}>
                  <p>
                    אנו ב-NZ-web, המופעלת על ידי צבי משה, מכבדים את פרטיות המשתמשים באתר שלנו.
                    מדיניות זו מפרטת כיצד אנו אוספים, משתמשים ומגינים על המידע שנמסר לנו במסגרת
                    הגלישה באתר או השימוש בשירותינו, הכוללים פיתוח Full-Stack, עיצוב UI/UX ופתרונות AI.
                  </p>
                </Section>

                {/* Section 2 */}
                <Section number="2" title="המידע שאנו אוספים" icon={<Database className="h-5 w-5" />}>
                  <p className="mb-4">במסגרת הפעילות באתר, עשוי להיאסף מידע מהסוגים הבאים:</p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">א</span>
                      <div>
                        <strong className="text-foreground">מידע אישי שנמסר מרצון:</strong>
                        <span className="text-muted-foreground"> בעת מילוי טופס צור קשר או פנייה בוואטסאפ, נאספים פרטים כגון שם מלא, כתובת אימייל ומספר טלפון.</span>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">ב</span>
                      <div>
                        <strong className="text-foreground">מידע טכני אוטומטי:</strong>
                        <span className="text-muted-foreground"> נתונים על אופן הגלישה, כתובת IP, סוג דפדפן וזמני שהייה באתר, לצורך שיפור חוויית המשתמש ואופטימיזציה (SEO).</span>
                      </div>
                    </li>
                  </ul>
                </Section>

                {/* Section 3 */}
                <Section number="3" title="השימוש במידע" icon={<UserCheck className="h-5 w-5" />}>
                  <p className="mb-4">המידע שנאסף משמש את NZ-web למטרות הבאות בלבד:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      מתן מענה לפניות ומתן שירותי פיתוח ועיצוב.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      ניהול נתונים מאובטח באמצעות מערכות כגון Supabase.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      שיפור ביצועי האתר והתאמת התוכן לצרכי הלקוחות.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      דיוור ישיר או עדכונים (במידה והמשתמש נתן לכך הסכמה מפורשת).
                    </li>
                  </ul>
                </Section>

                {/* Section 4 */}
                <Section number="4" title="העברת מידע לצדדים שלישיים">
                  <p>
                    אנו לא מוכרים או משכירים מידע אישי לצדדים שלישיים. המידע עשוי לעבור לספקי
                    שירות חיצוניים רק לצורך תפעול האתר (לדוגמה: שירותי אחסון ב-Netlify או ניהול
                    בסיס נתונים ב-Supabase) ותחת התחייבותם לשמירה על פרטיות.
                  </p>
                </Section>

                {/* Section 5 */}
                <Section number="5" title="עוגיות (Cookies)" icon={<Cookie className="h-5 w-5" />}>
                  <p>
                    האתר משתמש ב-"עוגיות" לצורך תפעולו השוטף, איסוף נתונים סטטיסטיים ואבטחת מידע.
                    הגולש יכול לבחור לחסום את השימוש בעוגיות דרך הגדרות הדפדפן שלו, אך הדבר עלול
                    לפגוע בחלק מהפונקציות של האתר.
                  </p>
                </Section>

                {/* Section 6 */}
                <Section number="6" title="אבטחת מידע" icon={<Lock className="h-5 w-5" />}>
                  <p>
                    אנו מיישמים נהלים ומערכות אבטחה מתקדמות כדי להגן על המידע מפני גישה בלתי מורשית.
                    עם זאת, לא ניתן להבטיח חסינות מוחלטת בפני חדירה למערכות תקשורת דיגיטליות.
                  </p>
                </Section>

                {/* Section 7 */}
                <Section number="7" title="זכויות המשתמש">
                  <p>
                    בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, כל אדם זכאי לעיין במידע המוחזק עליו במאגר
                    מידע, לבקש לתקנו או למחוק אותו.
                  </p>
                </Section>

                {/* Section 8 */}
                <Section number="8" title="שינויים במדיניות הפרטיות">
                  <p>
                    NZ-web שומרת לעצמה את הזכות לעדכן מדיניות זו מעת לעת. המשך השימוש באתר לאחר
                    העדכון מהווה הסכמה לתנאים החדשים.
                  </p>
                </Section>

                {/* Section 9 - Contact */}
                <Section number="9" title="יצירת קשר">
                  <p className="mb-4">לכל שאלה בנושא פרטיות המידע, ניתן לפנות לצבי משה:</p>
                  <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
                    <a
                      href={getTelHref(contactInfo.phone)}
                      className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      {contactInfo.phone}
                    </a>
                    <a
                      href={getMailtoHref(contactInfo.email)}
                      className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      {contactInfo.email}
                    </a>
                  </div>
                </Section>
              </div>
            </div>

            {/* Sticky TOC Sidebar */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24 rounded-2xl border border-border/40 bg-card p-6"
              >
                <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">תוכן עניינים</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.number}
                      href={`#section-${section.number}`}
                      className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {section.number}
                      </span>
                      <span className="line-clamp-2 leading-tight">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </motion.div>
            </div>
          </div>

          {/* Back to Home */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה לדף הבית
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

// Section Component - Premium Card Style with Left Accent Bar
const Section = ({
  number,
  title,
  icon,
  children
}: {
  number: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <motion.div
    id={`section-${number}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative rounded-2xl border border-border/40 bg-card p-6 md:p-8 group hover:shadow-lg transition-shadow duration-300"
  >
    {/* Left Accent Bar */}
    <div className="absolute right-0 top-0 h-full w-1 rounded-r-2xl bg-gradient-to-b from-primary/60 to-primary/20"></div>

    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-black">
          {number}
        </span>
        {icon && <span className="text-primary/80 mt-1 group-hover:text-primary transition-colors">{icon}</span>}
        <h2 className="font-heebo text-lg md:text-xl font-bold text-foreground leading-tight">{title}</h2>
      </div>
      <div className="pr-12 text-muted-foreground leading-relaxed text-sm md:text-base">
        {children}
      </div>
    </div>
  </motion.div>
);

export default Privacy;
