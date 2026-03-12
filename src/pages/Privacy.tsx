import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, Cookie, Database, UserCheck, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getMailtoHref, getTelHref, useContactInfo } from "@/lib/contact-utils";
import { useSeoMeta } from "@/hooks/useSeoMeta";

const Privacy = () => {
  const contact = useContactInfo();

  useSeoMeta({
    title: "מדיניות פרטיות | NZ-web",
    description:
      "מדיניות הפרטיות של NZ-web – כיצד אנו אוספים, מנהלים ומגינים על המידע שלכם בהתאם לחוק הגנת הפרטיות הישראלי.",
  });

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <Header />
      <BackToHome />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">מדיניות פרטיות</span>
            </div>
            <h1 className="font-heebo text-3xl md:text-4xl font-bold text-foreground mb-4">
              מדיניות פרטיות – NZ-web
            </h1>
            <p className="text-muted-foreground">
              תאריך עדכון אחרון: 9 במרץ 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
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
              <div className="bg-secondary rounded-2xl p-6 space-y-3">
                <a 
                  href={getTelHref(contact.phone)} 
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  {contact.phone}
                </a>
                <a 
                  href={getMailtoHref(contact.email)} 
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  {contact.email}
                </a>
              </div>
            </Section>

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
      <AccessibilityWidget />
    </main>
  );
};

// Section Component
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
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="space-y-4"
  >
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {number}
      </span>
      {icon && <span className="text-primary">{icon}</span>}
      <h2 className="font-heebo text-xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="pr-11 text-muted-foreground leading-relaxed">
      {children}
    </div>
  </motion.div>
);

export default Privacy;
