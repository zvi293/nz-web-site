import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, User } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-api";
import { getMailtoHref, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";

const Accessibility = () => {
  const { settings: siteSettings } = useSiteSettings();
  const { accessibility, contact } = siteSettings;
  const lastUpdated = accessibility.lastUpdated;

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <Header />
      <BackToHome />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl md:text-5xl font-black text-foreground mb-8"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              הצהרת נגישות - NZ-web
            </h1>

            <div className="prose prose-lg max-w-none text-foreground space-y-8" style={{ fontFamily: "'Heebo', sans-serif" }}>
              <div className="bg-primary/5 rounded-3xl p-6 md:p-8 border border-primary/10">
                <h2 className="text-xl font-bold text-foreground mb-3">מבוא</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו ב-<span className="text-primary font-bold">NZ-web</span> רואים חשיבות עליונה בהנגשת השירותים הדיגיטליים שלנו
                  לכלל האוכלוסייה, ובכלל זה לאנשים עם מוגבלויות. אתר נגיש הוא לא רק דרישה חוקית, אלא ביטוי לערכים שלנו
                  ולרצון לאפשר לכל אדם חוויית גלישה עצמאית, מכובדת ושוויונית.
                </p>
              </div>

              <Section title="סטנדרט הנגישות">
                <p className="text-muted-foreground leading-relaxed">
                  אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.
                  התאמות הנגישות בוצעו בהתאם להמלצות התקן הישראלי (ת"י 5568) ברמת <strong className="text-primary">AA</strong>
                  ועל פי הנחיות מסמך <strong className="text-primary">WCAG 2.1</strong> הבינלאומי.
                </p>
              </Section>

              <Section title="התאמות הנגישות שבוצעו">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  באתר הוטמע תפריט נגישות מתקדם הכולל את האפשרויות הבאות:
                </p>
                <div className="grid gap-4">
                  <FeatureCard
                    title="ניווט מקלדת"
                    description="תמיכה מלאה בשימוש במקשי Tab ו-Enter למעבר בין רכיבים."
                  />
                  <FeatureCard
                    title="התאמות תצוגה"
                    description="שינוי ניגודיות, מעבר לגווני אפור, והגדלת סמן העכבר."
                  />
                  <FeatureCard
                    title="טקסט וקריאות"
                    description="הגדלת גופנים, מעבר לגופן קריא והדגשת קישורים וכותרות בצורה בולטת."
                  />
                  <FeatureCard
                    title="עזרי ניווט"
                    description="הדגשת פוקוס, עצירת אנימציות ושיפור השימוש ברכיבים נעים."
                  />
                  <FeatureCard
                    title="תאימות טכנולוגית"
                    description="האתר מותאם לדפדפנים מודרניים ולשימוש בתוכנות קורא מסך באמצעות מבנה סמנטי ותגיות ARIA."
                  />
                </div>
              </Section>

              <Section title="סייגים לנגישות">
                <p className="text-muted-foreground leading-relaxed">
                  אנו משקיעים מאמצים רבים בתחזוקת נגישות האתר. עם זאת, ייתכן שיתגלו דפים או חלקים שטרם הונגשו במלואם
                  עקב מגבלות טכנולוגיות או שינויי תוכן. במידה ומצאתם תקלה, נשמח אם תעדכנו אותנו כדי שנוכל לתקן בהקדם.
                </p>
              </Section>

              <Section title="תאימות סביבות הפעלה">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  האתר נבדק ונמצא תואם לסביבות ההפעלה הבאות:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">דפדפנים:</strong> Google Chrome, Mozilla Firefox, Safari, Microsoft Edge</li>
                  <li><strong className="text-foreground">מערכות הפעלה:</strong> Windows, macOS, Android, iOS</li>
                  <li><strong className="text-foreground">קוראי מסך:</strong> NVDA, JAWS, VoiceOver, TalkBack</li>
                  <li><strong className="text-foreground">ניווט:</strong> תמיכה מלאה בניווט מקלדת</li>
                </ul>
              </Section>

              <Section title="יצירת קשר עם רכז הנגישות">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  לכל שאלה, תקלה או הצעה לשיפור הנגישות, ניתן לפנות אלינו:
                </p>
                <div className="bg-secondary/40 rounded-2xl p-6 border border-border/50">
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">רכז הנגישות:</strong> {accessibility.coordinatorName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">טלפון:</strong> <a href={getTelHref(accessibility.coordinatorPhone)} className="text-primary hover:underline">{accessibility.coordinatorPhone}</a></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">אימייל:</strong> <a href={getMailtoHref(accessibility.coordinatorEmail)} className="text-primary hover:underline">{accessibility.coordinatorEmail}</a></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <p><strong className="text-foreground">וואטסאפ:</strong> <a href={getWhatsAppHref(contact)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">שלח הודעה</a></p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="דיווח על תקלות נגישות">
                <p className="text-muted-foreground leading-relaxed">
                  אם נתקלת בבעיית נגישות באתר, נשמח לשמוע ממך ולטפל בכך בהקדם.
                  בעת הפנייה, אנא ציין את הפרטים הבאים:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-3">
                  <li>כתובת הדף (URL) בו נתקלת בבעיה</li>
                  <li>תיאור הבעיה</li>
                  <li>סוג הדפדפן ומערכת ההפעלה</li>
                  <li>טכנולוגיה מסייעת בשימוש, אם רלוונטי</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  ניתן לפנות אלינו באמצעות פרטי רכז הנגישות המפורטים לעיל,
                  או דרך <Link to="/contact" className="text-primary hover:underline font-bold">טופס יצירת הקשר</Link> באתר.
                </p>
              </Section>

              <Section title="תקנות רלוונטיות">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  הצהרת נגישות זו נכתבה בהתאם לתקנות הבאות:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013</li>
                  <li>סעיף 34 - פרסום התאמות הנגישות שבוצעו בארגון</li>
                  <li>סעיף 35 - התאמות נגישות בשירותי האינטרנט</li>
                  <li>תקנה 91 - רכז הנגישות</li>
                  <li>תקן ישראלי 5568 - הנגשת תכנים באינטרנט</li>
                  <li>WCAG 2.1 ברמה AA</li>
                </ul>
              </Section>

              <div className="pt-6 border-t border-border text-sm text-muted-foreground">
                <p>תאריך עדכון אחרון: <strong className="text-foreground">{lastUpdated}</strong></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-bold text-foreground mb-3">{title}</h2>
    {children}
  </div>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
    <h3 className="font-bold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Accessibility;
