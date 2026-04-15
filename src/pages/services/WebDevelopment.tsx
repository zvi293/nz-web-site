import { Monitor, Zap, Code2, Globe, Shield, Smartphone, Search, LayoutDashboard, RefreshCw } from "lucide-react";
import ServicePageTemplate, { type ServicePageConfig } from "@/components/ServicePageTemplate";

const config: ServicePageConfig = {
  seo: {
    title: "בניית אתרים מקצועיים | NZ-web",
    description: "בניית אתרים מהירים, מודרניים ואמינים לעסקים שרוצים נוכחות דיגיטלית מקצועית. Full-Stack, React, TypeScript ועיצוב UI/UX מרהיב.",
  },
  breadcrumb: { name: "בניית אתרים מקצועיים", path: "/services/web-development" },
  schemaId: "service-schema-web-development",
  schemaServiceType: "Web Development",
  schemaUrl: "https://nz-web.com/services/web-development",

  hero: {
    badge: "שירות פיתוח אתרים",
    badgeIcon: Monitor,
    title: "בניית אתרים שמביאים תוצאות אמיתיות",
    highlight: "תוצאות אמיתיות",
    subtitle: "אנחנו בונים אתרים שלא רק נראים טוב — הם מהירים, יציבים, ממירים גולשים ללקוחות ומדורגים גבוה בגוגל. כל פרויקט מתחיל מהבנה עמוקה של העסק שלכם.",
    stats: [
      { value: "50+", label: "אתרים בנויים" },
      { value: "<1s", label: "זמן טעינה ממוצע" },
      { value: "100%", label: "מובייל-פירסט" },
    ],
    ctaText: "קבלו הצעת מחיר",
  },

  intro: {
    title: "מה הופך אתר לכלי עסקי אמיתי?",
    paragraphs: [
      "אתר מקצועי הוא לא רק עיצוב יפה. זה שילוב בין מהירות טעינה, ניווט אינטואיטיבי, תוכן שמדבר לקהל שלכם, ותשתית טכנולוגית שלא תיפול ברגע שהתנועה עולה.",
      "הרבה עסקים מגיעים אלינו עם אתר שנראה סביר — אבל לא ממיר. הסיבה? הבניה לא נעשתה עם לוגיקה עסקית. אתר מקצועי חייב לשרת מטרה ברורה, לא רק להיות קיים.",
      "אנחנו בונים לטווח ארוך: קוד נקי שניתן לתחזק ולהרחיב, עם ביצועים שנמדדים ומשתפרים לאורך זמן.",
    ],
  },

  features: [
    { icon: Zap, title: "ביצועים גבוהים", description: "ניקוד 90+ ב-Google PageSpeed. תמונות מאופטמות, קוד מינימלי, CDN — כל מה שגורם לגוגל לאהוב אתכם.", accent: "#3b82f6" },
    { icon: Smartphone, title: "מובייל-פירסט", description: "יותר מ-70% מהגלישה היא מהנייד. אנחנו מתכננים קודם למסכים קטנים ומתרחבים למסכים גדולים.", accent: "#8b5cf6" },
    { icon: Search, title: "SEO טכני מובנה", description: "מבנה URL נכון, structured data, meta tags, sitemap — כל הבסיס לדירוג גבוה בגוגל כבר בשלב הפיתוח.", accent: "#10b981" },
    { icon: Shield, title: "אבטחה ואמינות", description: "HTTPS, הגנות מפני XSS ו-CSRF, backup אוטומטי. האתר שלכם עובד גם כשהתנועה עולה פתאום.", accent: "#f97316" },
    { icon: LayoutDashboard, title: "ממשק ניהול", description: "מערכת ניהול תוכן (CMS) שמאפשרת לכם לעדכן תוכן, פרויקטים ועמודים בלי לגעת בקוד.", accent: "#ec4899" },
    { icon: RefreshCw, title: "תחזוקה ועדכונים", description: "30 יום תמיכה אחרי השקה. עדכוני אבטחה, בדיקות ביצועים ותיקונים — אנחנו לא נעלמים.", accent: "#14b8a6" },
  ],

  process: [
    { number: "01", title: "פגישת גילוי", description: "שיחה פתוחה להבנת העסק, הקהל, המתחרים ומה הבעיה האמיתית שהאתר צריך לפתור." },
    { number: "02", title: "תכנון ועיצוב", description: "Wireframes, UI design ומקאפ אינטראקטיבי לאישורכם לפני שנגע בשורת קוד." },
    { number: "03", title: "פיתוח ובדיקות", description: "פיתוח Full-Stack עם React + TypeScript, בדיקות cross-browser ובדיקות ביצועים." },
    { number: "04", title: "השקה ומעקב", description: "העלאה לאוויר, מעקב ב-30 הימים הראשונים ושיפורים לפי הצורך. אנחנו לא נעלמים." },
  ],

  techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Supabase", "Node.js", "Framer Motion", "GSAP"],

  results: [
    { value: "3×", label: "יותר המרות", sub: "ממוצע לאחר שדרוג מאתר ישן" },
    { value: "90+", label: "PageSpeed Score", sub: "ניקוד מהירות ממוצע לאתרים שלנו" },
    { value: "48h", label: "זמן תגובה", sub: "לכל שינוי או תיקון בתקופת הגרייס" },
  ],

  faqs: [
    { q: "כמה זמן לוקח לבנות אתר?", a: "אתר תדמית בסיסי לוקח 2–4 שבועות. אתר מורכב עם מערכות ו-CMS — 4–8 שבועות. הכל תלוי בהיקף הפרויקט ובמהירות האישורים מצדכם." },
    { q: "האם אוכל לעדכן את האתר לבד?", a: "כן — אנחנו בונים ממשק ניהול (CMS) שמאפשר לכם לעדכן תוכן, תמונות, מחירים ועמודים בלי לדעת כלום על קוד." },
    { q: "מה קורה אחרי ההשקה?", a: "30 יום תמיכה מלאה ללא עלות. אחר כך יש אפשרות לחבילת תחזוקה חודשית הכוללת עדכוני אבטחה, גיבויים ותיקונים קטנים." },
    { q: "האם האתר יהיה מותאם לגוגל?", a: "בהחלט. SEO טכני הוא חלק בלתי נפרד מכל אתר שאנחנו בונים — structured data, meta tags, מהירות, mobile-first ו-sitemap כלולים תמיד." },
  ],

  cta: {
    title: "מוכנים לבנות אתר שעובד?",
    subtitle: "דברו איתנו על הפרויקט שלכם — פגישת ייעוץ ראשונית ללא עלות.",
    buttonText: "קבלו הצעת מחיר",
  },
};

const WebDevelopment = () => <ServicePageTemplate config={config} />;
export default WebDevelopment;
