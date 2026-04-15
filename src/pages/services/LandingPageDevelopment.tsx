import { Target, TrendingUp, Zap, MousePointer, BarChart3, TestTube, Megaphone, Clock, Shield } from "lucide-react";
import ServicePageTemplate, { type ServicePageConfig } from "@/components/ServicePageTemplate";

const config: ServicePageConfig = {
  seo: {
    title: "בניית דפי נחיתה ממירים לעסקים בישראל | NZ-web",
    description: "בניית דפי נחיתה מקצועיים לקמפיינים ממומנים ואורגניים. עיצוב ממוקד המרה, טעינה מתחת ל-2 שניות, A/B testing. מכפיל את ה-ROI של הפרסום שלכם.",
    keywords: "בניית דפי נחיתה, דף נחיתה, landing page, בניית לנדינג פייג', עמוד נחיתה ממיר, דף נחיתה לגוגל, דף נחיתה לפייסבוק, קמפיין ממומן",
  } as const,
  breadcrumb: { name: "בניית דפי נחיתה", path: "/services/landing-page-development", parent: { name: "שירותים", path: "/services" } },
  schemaId: "service-schema-landing-page",
  schemaServiceType: "Landing Page Development",
  schemaUrl: "https://nz-web.com/services/landing-page-development",
  hero: {
    badge: "דפי נחיתה",
    badgeIcon: Target,
    title: "דף נחיתה שממיר גולשים ללקוחות",
    highlight: "ממיר גולשים ללקוחות",
    subtitle: "כשאתם מוציאים כסף על פרסום — הדף שאליו מגיעים האנשים הוא מה שקובע אם הם ישאירו פרטים. דף נחיתה מקצועי מכפיל את ה-ROI של הקמפיין שלכם.",
    stats: [{ value: "30%+", label: "המרה ממוצעת" }, { value: "<2s", label: "זמן טעינה" }, { value: "A/B", label: "בדיקות מוכנות" }],
    ctaText: "בנו לי דף נחיתה",
  },
  intro: {
    title: "למה רוב דפי הנחיתה לא עובדים?",
    paragraphs: [
      "יש עסקים שמוציאים אלפי שקלים על פרסום בגוגל ופייסבוק — ומפנים את הגולשים לדף שלא ממיר. ה-CTR מצוין אבל אחוז ההמרה עלוב. הבעיה? הדף לא נבנה עם לוגיקת שכנוע.",
      "דף נחיתה מקצועי בנוי סביב מטרה אחת בלבד: גרום לגולש לבצע פעולה (להשאיר פרטים, לרכוש, להתקשר). כל אלמנט בדף — הכותרת, התמונה, הטקסט, כפתור ה-CTA — עובד לאותה מטרה.",
      "אנחנו בונים דפי נחיתה עם הבנת עולם השיווק הדיגיטלי — לא רק קוד יפה.",
    ],
  },
  features: [
    { icon: MousePointer, title: "עיצוב ממוקד המרה", description: "כל אלמנט בדף מכוון לפעולה אחת — השאר פרטים, רכוש, התקשר. אין הסחות דעת.", accent: "#3b82f6" },
    { icon: Zap, title: "מהירות שמשפיעה על ROI", description: "כל שנייה עיכוב בטעינה מורידה את ההמרה ב-7%. הדפים שלנו נטענים בפחות מ-2 שניות.", accent: "#8b5cf6" },
    { icon: TestTube, title: "מוכן ל-A/B Testing", description: "בונים את הדף עם אפשרות לבדיקת גרסאות — כותרת, צבע כפתור, תמונה. מייעלים לאחר שיש נתונים.", accent: "#10b981" },
    { icon: BarChart3, title: "אינטגרציה לכלי אנליטיקס", description: "חיבור ל-Google Analytics, Facebook Pixel, Google Tag Manager — כל המרה נמדדת.", accent: "#f97316" },
    { icon: Megaphone, title: "תואם לכל פלטפורמת פרסום", description: "Google Ads, Facebook, Instagram, TikTok, ועוד — הדף עובד עם כולם.", accent: "#ec4899" },
    { icon: Shield, title: "הוכחה חברתית מובנית", description: "המלצות, לוגואים, מספרים וסטטיסטיקות — בדיוק במקומות שיגרמו לגולש לסמוך עליכם.", accent: "#14b8a6" },
  ],
  process: [
    { number: "01", title: "הגדרת מטרה וקהל", description: "מבינים את הקמפיין, מי הקהל, מה ההצעה ומהי הפעולה שרוצים שהגולש יעשה." },
    { number: "02", title: "ארכיטקטורת שכנוע", description: "בונים את מבנה הדף — כותרת, תת-כותרת, Benefit bullets, ביטול התנגדויות, CTA." },
    { number: "03", title: "עיצוב ופיתוח", description: "עיצוב ממוקד המרה, פיתוח מהיר עם ביצועים גבוהים ואינטגרציות למערכות הפרסום." },
    { number: "04", title: "השקה ואופטימיזציה", description: "עלייה לאוויר, בדיקות ביצועים והגדרת A/B test ראשון לשיפור ההמרה." },
  ],
  results: [
    { value: "2–5×", label: "שיפור בהמרה", sub: "ממוצע לאחר שדרוג מדף כללי לדף ייעודי" },
    { value: "<2s", label: "זמן טעינה", sub: "גם בחיבור סלולרי איטי" },
    { value: "7–14", label: "ימים למסירה", sub: "מגילוי ועד דף חי ומפרסם" },
  ],
  faqs: [
    { q: "מה ההבדל בין דף נחיתה לאתר?", a: "אתר הוא נוכחות דיגיטלית רחבה עם מספר עמודים. דף נחיתה הוא עמוד בודד עם מטרה ספציפית אחת — בדרך כלל לקמפיין פרסומי. הוא לא כולל ניווט שיוציא את הגולש מהמסלול." },
    { q: "כמה זמן לוקח לבנות דף נחיתה?", a: "7–14 ימי עסקים מגילוי ועד דף חי. תלוי במורכבות — דף פשוט יכול להיות מוכן ב-5 ימים." },
    { q: "האם אפשר לשנות את הדף בעצמי?", a: "כן — אנחנו בונים עם CMS פשוט שמאפשר לשנות טקסטים, תמונות ותוכן בלי לדעת קוד." },
    { q: "האם אתם גם עושים A/B testing?", a: "אנחנו בונים את הדף כך שיהיה קל להריץ A/B test. אנחנו לא מריצים את הפרסום עצמו אבל נשמח להמליץ על כלים ואיך לנתח תוצאות." },
  ],
  cta: {
    title: "הפסיקו לבזבז תקציב פרסום על דפים שלא ממירים",
    subtitle: "שיחת ייעוץ ראשונית — נבדוק ביחד מה לשפר.",
    buttonText: "בואו נשפר את ה-ROI",
  },
};

const LandingPageDevelopment = () => <ServicePageTemplate config={config} />;
export default LandingPageDevelopment;
