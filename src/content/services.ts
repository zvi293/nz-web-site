import type { ServiceItem } from "@/content/types";

/** Homepage service blocks. Videos live in public/videos. */
export const services: ServiceItem[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    badge: "אפיון חכם",
    title: "מתכוננים להצלחה",
    body: "הכל מתחיל באפיון מדויק. אנחנו צוללים לעומק העסק שלכם, מבינים את קהל היעד ומתכננים מסע משתמש חכם שמוביל לפעולה. בלי ניחושים, רק אסטרטגיה מבוססת נתונים שמכינה את הקרקע להמרות.",
    image: "",
    video: "/videos/service-planning.mp4",
    iconType: "lucide",
    iconLucideName: "Target",
    reverse: false,
    tags: [
      "אסטרטגיה",
      "מחקר שוק",
      "מסע משתמש"
    ],
    bgGradient: "linear-gradient(135deg, hsl(45 80% 60% / 0.08), hsl(40 85% 60% / 0.12), hsl(45 70% 94%))",
    textColor: "hsl(40 50% 18%)",
    mutedTextColor: "hsl(40 30% 38%)",
    badgeBg: "hsl(45 80% 55% / 0.15)",
    badgeText: "hsl(45 80% 35%)",
    iconBg: "hsl(45 80% 50%)",
    iconShadow: "0 8px 30px -4px hsl(45 80% 50% / 0.4)",
    tagBg: "hsl(45 60% 92%)",
    tagText: "hsl(40 50% 30%)",
    order: 1,
    published: true
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    badge: "עיצוב UI/UX",
    title: "כשנראים טוב - מוכרים טוב",
    body: "אנחנו הפסגה של עיצוב חוויות דיגיטליות. עיצוב עוצר נשימה הוא לא רק יופי, הוא כלי מכירתי עוצמתי. אנחנו דואגים שהגולשים יחוו חוויה ייחודית ובלתי נשכחת שתבליט אתכם מעל כל המתחרים.",
    image: "",
    video: "/videos/service-uiux.mp4",
    iconType: "lucide",
    iconLucideName: "Palette",
    reverse: true,
    tags: [
      "עיצוב",
      "חווית משתמש",
      "יוקרה"
    ],
    bgGradient: "linear-gradient(135deg, hsl(270 60% 96%), hsl(300 50% 94% / 0.8), hsl(330 60% 95% / 0.6))",
    textColor: "hsl(270 40% 20%)",
    mutedTextColor: "hsl(270 25% 42%)",
    badgeBg: "hsl(270 60% 60% / 0.15)",
    badgeText: "hsl(270 60% 45%)",
    iconBg: "hsl(270 60% 58%)",
    iconShadow: "0 8px 30px -4px hsl(270 60% 58% / 0.4)",
    tagBg: "hsl(270 40% 93%)",
    tagText: "hsl(270 40% 35%)",
    order: 2,
    published: true
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    badge: "פיתוח ומוצר מוגמר",
    title: "בונים מוצר מוגמר שמביא כסף",
    body: "אנחנו מתרגמים את העיצוב לקוד נקי, מהיר ומתקדם. התוצאה? אתר עובד, יציב ומוכן לקלוט טראפיק ולהפוך אותו ללקוחות משלמים. אתם מקבלים מוצר מוגמר, מא׳ ועד ת׳, שמייצר לכם שקט נפשי והכנסות.",
    image: "",
    video: "/videos/service-dev.mp4",
    iconType: "lucide",
    iconLucideName: "Code2",
    reverse: false,
    tags: [
      "פיתוח",
      "ביצועים",
      "סקיילינג"
    ],
    bgGradient: "linear-gradient(135deg, hsl(160 50% 95%), hsl(170 60% 92% / 0.8), hsl(190 50% 93% / 0.6))",
    textColor: "hsl(170 40% 16%)",
    mutedTextColor: "hsl(170 25% 38%)",
    badgeBg: "hsl(170 60% 45% / 0.15)",
    badgeText: "hsl(170 60% 32%)",
    iconBg: "hsl(170 60% 42%)",
    iconShadow: "0 8px 30px -4px hsl(170 60% 42% / 0.4)",
    tagBg: "hsl(170 40% 92%)",
    tagText: "hsl(170 40% 30%)",
    order: 3,
    published: true
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    badge: "קידום אורגני",
    title: "SEO שמביא תוצאות אמיתיות",
    body: "אנחנו דואגים שהאתר שלכם יופיע בראש תוצאות החיפוש. מחקר מילות מפתח מעמיק, אופטימיזציה טכנית, תוכן ממוקד ובניית קישורים חכמה - הכל כדי שהלקוחות ימצאו אתכם לפני המתחרים.",
    image: "",
    video: "/videos/service-seo.mp4",
    iconType: "lucide",
    iconLucideName: "Search",
    reverse: true,
    tags: [
      "SEO",
      "קידום אורגני",
      "מילות מפתח"
    ],
    bgGradient: "linear-gradient(135deg, hsl(210 90% 94%), hsl(200 85% 90% / 0.8), hsl(220 70% 95% / 0.6))",
    textColor: "hsl(210 50% 18%)",
    mutedTextColor: "hsl(210 30% 40%)",
    badgeBg: "hsl(210 80% 55% / 0.15)",
    badgeText: "hsl(210 80% 40%)",
    iconBg: "hsl(210 80% 52%)",
    iconShadow: "0 8px 30px -4px hsl(210 80% 52% / 0.4)",
    tagBg: "hsl(210 50% 92%)",
    tagText: "hsl(210 50% 30%)",
    order: 4,
    published: true
  }
];

export const publishedServices = services
  .filter((service) => service.published)
  .sort((a, b) => a.order - b.order);
