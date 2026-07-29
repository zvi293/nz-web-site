import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Phone,
  Mail,
  Shield,
  Scale,
  Globe,
  AlertTriangle,
} from "lucide-react";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { getMailtoHref, getTelHref, contactInfo } from "@/lib/contact-utils";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

/* ── Section card component ── */
const Section = ({
  number,
  title,
  icon,
  children,
}: {
  number: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) => (
  <motion.div
    id={`section-${number}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-8"
  >
    {/* Right accent bar */}
    <div className="absolute right-0 top-0 h-full w-1 rounded-r-2xl bg-gradient-to-b from-primary/60 to-primary/20" />

    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
          {number}
        </span>
        {icon && <span className="mt-0.5 text-primary">{icon}</span>}
        <h2 className="font-heebo text-lg font-bold leading-tight text-foreground md:text-xl">
          {title}
        </h2>
      </div>
      <div className="pr-11 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </div>
    </div>
  </motion.div>
);

/* ── Page ── */
const Terms = () => {
  useSeoMeta({
    title: "תנאי שימוש | NZ-web",
    description:
      "תנאי השימוש של אתר NZ-web – זכויות, אחריות ומדיניות השימוש בשירותי הפיתוח, עיצוב ה-UI/UX ופתרונות ה-AI שלנו.",
  });
  useBreadcrumb({ name: "תנאי שימוש", path: "/terms" });

  const tocItems = [
    { number: "1", title: "כללי והסכמה לתנאים" },
    { number: "2", title: "השירותים המוצעים" },
    { number: "3", title: "קניין רוחני" },
    { number: "4", title: "הגבלת אחריות" },
    { number: "5", title: "שימוש הוגן באתר" },
    { number: "6", title: "קישורים לצדדים שלישיים" },
    { number: "7", title: "פרטיות ונגישות" },
    { number: "8", title: "שינויים בתנאים ובאתר" },
    { number: "9", title: "סמכות שיפוט" },
    { number: "10", title: "יצירת קשר" },
  ];

  return (
    <main className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <Header />
      <BackToHome />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden nz-brand-dark py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/20">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-display mb-4 font-heebo text-balance text-white">
              תנאי שימוש
            </h1>
            <p className="text-lg text-white/80">עודכן לאחרונה: 9 במרץ 2026</p>
          </motion.div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

            {/* Main content — spans 3 cols */}
            <div className="space-y-8 lg:col-span-3">

              <Section number="1" title="כללי והסכמה לתנאים" icon={<FileText className="h-5 w-5" />}>
                <p>
                  ברוכים הבאים לאתר NZ-web (להלן: &quot;האתר&quot;), המופעל על ידי צבי משה (להלן:
                  &quot;מפעיל האתר&quot;). הגלישה והשימוש באתר, על כלל שירותיו ותכניו, מהווים הסכמה
                  מצדך (להלן: &quot;המשתמש&quot;) לתנאים המפורטים במסמך זה. במידה ואינך מסכים
                  לתנאים אלו, הנך מתבקש לחדול מהשימוש באתר באופן מיידי.
                </p>
              </Section>

              <Section number="2" title="השירותים המוצעים">
                <p>
                  האתר מספק מידע ושירותים בתחומי פיתוח Full-Stack (React, Node.js), עיצוב חוויית
                  משתמש (UI/UX), הטמעת מערכות ניהול נתונים (Supabase) ופתרונות אוטומציה מבוססי
                  בינה מלאכותית (AI). מפעיל האתר שואף לדיוק מרבי תחת הסלוגן &quot;Perfect in every
                  Pixel&quot;, אך התוכן באתר מוצג כפי שהוא (As-Is).
                </p>
              </Section>

              <Section number="3" title="קניין רוחני" icon={<Shield className="h-5 w-5" />}>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    כל הזכויות באתר, לרבות הקוד, העיצוב הגרפי, המבנה, הטקסטים, סימני המסחר והלוגו של NZ-web, שמורות לצבי משה בלבד.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    אין להעתיק, לשכפל, להפיץ או להשתמש בכל חלק מהאתר ללא אישור בכתב ומראש ממפעיל האתר.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    פרויקטים וקוד המועברים ללקוחות במסגרת שירותי פיתוח יוסדרו בחוזה התקשרות נפרד ופרטני.
                  </li>
                </ul>
              </Section>

              <Section number="4" title="הגבלת אחריות" icon={<AlertTriangle className="h-5 w-5" />}>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    מפעיל האתר משקיע מאמצים רבים באבטחה ותקינות האתר, אך אינו מתחייב שהשירות יהיה חסין מתקלות טכניות, וירוסים או גישה בלתי מורשית של צדדים שלישיים.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    מפעיל האתר לא יישא באחריות לכל נזק ישיר או עקיף שייגרם למשתמש כתוצאה מהסתמכות על מידע המופיע באתר.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    פתרונות אוטומציה ו-AI מסופקים ככלי עזר, והאחריות על השימוש בהם חלה על המשתמש בלבד.
                  </li>
                </ul>
              </Section>

              <Section number="5" title="שימוש הוגן באתר">
                <p className="mb-3">המשתמש מתחייב שלא לבצע פעולות שיש בהן כדי לשבש את פעילות האתר, לרבות:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    הרצת סקריפטים או תוכנות לאיסוף מידע (Scraping).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
                    ניסיון לעקוף מנגנוני אבטחה.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-primary">•</span>
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
                  <Link to="/privacy/" className="mx-1 text-primary hover:underline">מדיניות הפרטיות</Link>
                  ול
                  <Link to="/accessibility/" className="mx-1 text-primary hover:underline">הצהרת הנגישות</Link>
                  המפורסמות באתר, המהוות חלק בלתי נפרד מתנאי שימוש אלו.
                </p>
              </Section>

              <Section number="8" title="שינויים בתנאים ובאתר">
                <p>
                  מפעיל האתר רשאי לשנות את תנאי השימוש, מבנה האתר או תכניו בכל עת וללא הודעה
                  מוקדמת. מומלץ להתעדכן בדף זה מעת לעת.
                </p>
              </Section>

              <Section number="9" title="סמכות שיפוט" icon={<Scale className="h-5 w-5" />}>
                <p>
                  על תנאים אלו יחולו אך ורק דיני מדינת ישראל. מקום השיפוט הבלעדי בכל עניין הנובע
                  מהסכם זה יהיה בבתי המשפט המוסמכים במחוז המרכז/תל אביב.
                </p>
              </Section>

              <Section number="10" title="יצירת קשר">
                <p className="mb-4">בכל שאלה או הבהרה לגבי תנאי השימוש, ניתן לפנות לצבי משה:</p>
                <div className="space-y-3 rounded-2xl border border-border/40 bg-secondary/30 p-5">
                  <a
                    href={getTelHref(contactInfo.phone)}
                    className="flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    {contactInfo.phone}
                  </a>
                  <a
                    href={getMailtoHref(contactInfo.email)}
                    className="flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    {contactInfo.email}
                  </a>
                </div>
              </Section>

              {/* Back link */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <ArrowRight className="h-4 w-4" />
                  חזרה לדף הבית
                </Link>
              </motion.div>
            </div>

            {/* TOC Sidebar — 4th column */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24 rounded-2xl border border-border/40 bg-card p-5"
              >
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  תוכן עניינים
                </h3>
                <nav className="space-y-1.5">
                  {tocItems.map((item) => (
                    <a
                      key={item.number}
                      href={`#section-${item.number}`}
                      className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-all hover:bg-primary/[0.06] hover:text-primary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        {item.number}
                      </span>
                      <span className="leading-tight">{item.title}</span>
                    </a>
                  ))}
                </nav>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </main>
  );
};

export default Terms;
