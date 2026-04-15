import { Globe, Code2, Database, Layers, RefreshCw, Zap, Shield, LayoutDashboard, Users } from "lucide-react";
import ServicePageTemplate, { type ServicePageConfig } from "@/components/ServicePageTemplate";

const config: ServicePageConfig = {
  seo: {
    title: "פיתוח אתרים מקצועי בישראל | React TypeScript | NZ-web",
    description: "פיתוח אתרים מתקדם עם ארכיטקטורה שמחזיקה לשנים. React, TypeScript, Supabase. מסד נתונים, API, ממשק ניהול. פיתוח מערכות לעסקים בישראל.",
    keywords: "פיתוח אתרים, פיתוח אתרים מקצועי, פיתוח מערכות לעסקים, פיתוח Full Stack, React Developer Israel, TypeScript, Supabase, בניית מערכת ניהול",
  } as const,
  breadcrumb: { name: "פיתוח אתרים", path: "/services/website-development", parent: { name: "שירותים", path: "/services" } },
  schemaId: "service-schema-website-development",
  schemaServiceType: "Website Development",
  schemaUrl: "https://nz-web.com/services/website-development",
  hero: {
    badge: "פיתוח אתרים מתקדם",
    badgeIcon: Code2,
    title: "אתרים עם ארכיטקטורה שמחזיקה לאורך שנים",
    highlight: "שמחזיקה לאורך שנים",
    subtitle: "הרבה עסקים בונים אתר ואחרי שנה צריכים לבנות מחדש. אנחנו בונים עם ארכיטקטורה נכונה שמאפשרת גדילה, שינויים ואינטגרציות — בלי לשבור הכל בכל פעם.",
    stats: [{ value: "50+", label: "אתרים בפיתוח" }, { value: "0", label: "אתרים ששוחזרו" }, { value: "99%", label: "uptime ממוצע" }],
    ctaText: "רוצה לדבר על הפרויקט",
  },
  intro: {
    title: "למה ארכיטקטורה חשובה יותר מעיצוב?",
    paragraphs: [
      "עסקים רבים מתמקדים בשאלה 'איך האתר ייראה' — ולא 'איך הוא יעבוד'. עיצוב יפה על ארכיטקטורה גרועה הוא בית שנבנה על חול: נראה טוב בהתחלה, ומתפרק כשיש עומס.",
      "פיתוח אתרים מקצועי מתחיל בבחירת הטכנולוגיה הנכונה לפרויקט, בניית מסד נתונים נכון, קוד שניתן לתחזק ולהרחיב ו-API ארכיטקטורה שעובדת גם כשיש אלפי משתמשים בו-זמנית.",
      "אנחנו לא בונים רק 'אתרים' — אנחנו בונים מוצרים דיגיטליים שצומחים עם העסק שלכם.",
    ],
  },
  features: [
    { icon: Layers, title: "ארכיטקטורה נכונה", description: "Component architecture, state management, API design — הכל בנוי לצמיחה ולא לפרויקט הנוכחי בלבד.", accent: "#3b82f6" },
    { icon: Database, title: "מסד נתונים מתוכנן", description: "Schema design, RLS policies, indexes — מסד נתונים שמהיר, מאובטח ולא יתפרק תחת עומס.", accent: "#8b5cf6" },
    { icon: Zap, title: "ביצועים מדידים", description: "Core Web Vitals, lazy loading, code splitting, caching — אנחנו מודדים לפני ואחרי כל שינוי.", accent: "#10b981" },
    { icon: Shield, title: "אבטחה מובנית", description: "Authentication, authorization, input validation, CSRF protection — אבטחה אינה תוספת, היא חלק מהפיתוח.", accent: "#f97316" },
    { icon: LayoutDashboard, title: "ממשק ניהול מלא", description: "Dashboard לניהול תוכן, משתמשים, הזמנות, פרויקטים — כל מה שהעסק שלכם צריך לנהל.", accent: "#ec4899" },
    { icon: RefreshCw, title: "CI/CD ועדכונים", description: "תהליך deployment אוטומטי, rollback מהיר במקרה בעיה ומעקב אחר שינויים.", accent: "#14b8a6" },
  ],
  process: [
    { number: "01", title: "ניתוח דרישות טכניות", description: "מה המערכת צריכה לעשות, כמה משתמשים, אילו אינטגרציות ומה ה-scale הצפוי — לפני שמתחילים." },
    { number: "02", title: "תכנון ארכיטקטורה", description: "ERD למסד הנתונים, API design, component hierarchy — הכל מתועד ומאושר לפני שורת קוד." },
    { number: "03", title: "פיתוח איטרטיבי", description: "ספרינטים קצרים עם deliverables ברורים. אתם רואים התקדמות כל שבוע, לא רק בסוף." },
    { number: "04", title: "בדיקות והשקה", description: "בדיקות יחידה, בדיקות אינטגרציה, load testing — לא עולים לאוויר בלי וידוא שהכל עובד." },
  ],
  techStack: ["React 18", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite", "Node.js", "Framer Motion", "GSAP", "React Query"],
  results: [
    { value: "99%+", label: "uptime", sub: "לאתרים שאנחנו בונים ומארחים" },
    { value: "0", label: "אתרים שנבנו מחדש", sub: "בגלל ארכיטקטורה שגויה — אנחנו בונים נכון מהתחלה" },
    { value: "3×", label: "מהר יותר", sub: "מהממוצע בתעשיה בזמן פיתוח" },
  ],
  faqs: [
    { q: "מה ההבדל בין פיתוח אתרים לבניית אתרים?", a: "בניית אתרים מתייחסת לרוב לאתרים פשוטים יחסית. פיתוח אתרים כולל מערכות מורכבות יותר — עם מסד נתונים, לוגיקה עסקית, API, ממשקי ניהול ואינטגרציות עם שירותים חיצוניים." },
    { q: "האם אני יכול להתחיל קטן ולגדול?", a: "בהחלט. אנחנו בונים עם ארכיטקטורה שמאפשרת הוספת features בלי לשבור מה שקיים. תתחילו עם MVP ותרחיבו לפי הצורך." },
    { q: "מה עם תחזוקה אחרי השקה?", a: "יש חבילות תחזוקה חודשיות הכוללות עדכוני אבטחה, גיבויים, monitoring ותמיכה טכנית. אנחנו לא בונים ונעלמים." },
    { q: "האם תוכלו לעבוד עם קוד קיים?", a: "כן — אנחנו גם מבצעים code review ושדרוג של קוד קיים, migration בין טכנולוגיות ורפקטורינג של מערכות קיימות." },
  ],
  cta: {
    title: "בואו נבנה משהו שיחזיק לאורך שנים",
    subtitle: "שיחת ייעוץ טכנית ללא עלות — נגדיר יחד מה הפרויקט שלכם צריך.",
    buttonText: "קבלו ייעוץ טכני",
  },
};

const WebsiteDevelopment = () => <ServicePageTemplate config={config} />;
export default WebsiteDevelopment;
