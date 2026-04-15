import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Phone, Mail, Shield, Scale, Globe, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getMailtoHref, getTelHref, useContactInfo } from "@/lib/contact-utils";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const Terms = () => {
  const contact = useContactInfo();

  useSeoMeta({
    title: "תנאי שימוש | NZ-web",
    description:
      "תנאי השימוש של אתר NZ-web – זכויות, אחריות ומדיניות השימוש בשירותי הפיתוח, עיצוב ה-UI/UX ופתרונות ה-AI שלנו.",
  });
  useBreadcrumb({ name: "תנאי שימוש", path: "/terms" });

  const sections = [
    { number: "1", title: "כללי והסכמה לתנאים" },
    { number: "2", title: "השירותים המוצעים" },
    { number: "3", title: "קניין רוחני", icon: <Shield className="h-5 w-5" /> },
    { number: "4", title: "הגבלת אחריות", icon: <AlertTriangle className="h-5 w-5" /> },
    { number: "5", title: "שימוש הוגן באתר" },
    { number: "6", title: "קישורים לצדדים שלישיים", icon: <Globe className="h-5 w-5" /> },
    { number: "7", title: "פרטיות ונגישות" },
    { number: "8", title: "שינויים בתנאים ובאתר" },
    { number: "9", title: "סמכות שיפוט", icon: <Scale className="h-5 w-5" /> },
    { number: "10", title: "יצירת קשר" },
  ];

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <Header />
      <BackToHome />

      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[hsl(222,47%,10%)] via-[hsl(218,42%,16%)] to-[hsl(215,38%,22%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 border border-primary/40 mb-6 mx-auto"
            >
              <Scale className="h-6 w-6 text-primary" />
            </motion.div>
            <h1 className="font-heebo text-3xl md:text-5xl font-black text-white mb-4">
              תנאי שימוש
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

                <Section number="1" title="כללי והסכמה לתנאים" icon={<FileText className="h-5 w-5" />}>
                  <p>
                    ברוכים הבאים לאתר NZ-web (להלן: &quot;האתר&quot;), המופעל על ידי צבי משה (להלן: &quot;מפעיל האתר&quot;).
                    הגלישה והשימוש באתר, על כלל שירותיו ותכניו, מהווים הסכמה מצדך (להלן: &quot;המשתמש&quot;) לתנאים
                    המפורטים במסמך זה. במידה ואינך מסכים לתנאים אלו, הנך מתבקש לחדול מהשימוש באתר באופן מיידי.
                  </p>
                </Section>

                <Section number="2" title="השירותים המוצעים">
                  <p>
                    האתר מספק מידע ושירותים בתחומי פיתוח Full-Stack (React, Node.js), עיצוב חוויית משתמש (UI/UX),
                    הטמעת מערכות ניהול נתונים (Supabase) ופתרונות אוטומציה מבוססי בינה מלאכותית (AI).
                    מפעיל האתר שואף לדיוק מרבי תחת הסלוגן &quot;Perfect in every Pixel&quot;, אך התוכן באתר מוצג כפי שהוא (As-Is).
                  </p>
                </Section>

                <Section number="3" title="קניין רוחני" icon={<Shield className="h-5 w-5" />}>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      כל הזכויות באתר, לרבות הקוד, העיצוב הגרפי, המבנה, הטקסטים, סימני המסחר והלוגו של NZ-web, שמורות לצבי משה בלבד.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      אין להעתיק, לשכפל, להפיץ או להשתמש בכל חלק מהאתר ללא אישור בכתב ומראש ממפעיל האתר.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      פרויקטים וקוד המועברים ללקוחות במסגרת שירותי פיתוח יוסדרו בחוזה התקשרות נפרד ופרטני.
                    </li>
                  </ul>
                </Section>

                <Section number="4" title="הגבלת אחריות" icon={<AlertTriangle className="h-5 w-5" />}>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      מפעיל האתר משקיע מאמצים רבים באבטחה ותקינות האתר, אך אינו מתחייב שהשירות יהיה חסין מתקלות טכניות, וירוסים או גישה בלתי מורשית של צדדים שלישיים.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      מפעיל האתר לא יישא באחריות לכל נזק ישיר או עקיף שייגרם למשתמש כתוצאה מהסתמכות על מידע המופיע באתר או שימוש בכלים ופתרונות ה-AI המוצגים בו.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      בפרט, פתרונות אוטומציה ו-AI מסופקים ככלי עזר, והאחריות על השימוש בהם ובתוצרים שלהם חלה על המשתמש בלבד.
                    </li>
                  </ul>
                </Section>

                <Section number="5" title="שימוש הוגן באתר">
                  <p className="mb-3">המשתמש מתחייב שלא לבצע פעולות שיש בהן כדי לשבש את פעילות האתר, לרבות:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      הרצת סקריפטים או תוכנות לאיסוף מידע (Scraping).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      ניסיון לעקוף מנגנוני אבטחה.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      העלאת תוכן פוגעני או בלתי חוקי דרך טפסי יצירת הקשר.
                    </li>
                  </ul>
                </Section>

                <Section number="6" title="קישורים לצדדים שלישיים" icon={<Globe className="h-5 w-5" />}>
                  <p>
                    האתר עשוי לכלול קישורים לשירותים חיצוניים (כגון WhatsApp, GitHub, או שירותי ענן).
                    מפעיל האתר אינו אחראי לתוכן, למדיניות הפרטיות או לתקינות של שירותים אלו.
                  </p>
                </Section>

                <Section number="7" title="פרטיות ונגישות">
                  <p>
                    השימוש באתר כפוף ל
                    <Link to="/privacy" className="text-primary hover:underline mx-1">מדיניות הפרטיות</Link>
                    ול
                    <Link to="/accessibility" className="text-primary hover:underline mx-1">הצהרת הנגישות</Link>
                    המפורסמות באתר, המהוות חלק בלתי נפרד מתנאי שימוש אלו.
                  </p>
                </Section>

                <Section number="8" title="שינויים בתנאים ובאתר">
                  <p>
                    מפעיל האתר רשאי לשנות את תנאי השימוש, מבנה האתר או תכניו בכל עת וללא הודעה מוקדמת.
                    מומלץ להתעדכן בדף זה מעת לעת.
                  </p>
                </Section>

                <Section number="9" title="סמכות שיפוט" icon={<Scale className="h-5 w-5" />}>
                  <p>
                    על תנאים אלו יחולו אך ורק דיני מדינת ישראל. מקום השיפוט הבלעדי בכל עניין הנובע מהסכם זה
                    יהיה בבתי המשפט המוסמכים במחוז המרכז/תל אביב.
                  </p>
                </Section>

                <Section number="10" title="יצירת קשר">
                  <p className="mb-4">בכל שאלה או הבהרה לגבי תנאי השימוש, ניתן לפנות לצבי משה:</p>
                  <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
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

            {/* Back */}
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

const Section = ({
  number,
  title,
  icon,
  children,
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

export default Terms;
