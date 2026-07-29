import type { SiteSettings } from "@/content/types";

/** Site-wide contact details, SEO defaults, footer text and the legal pages. */
export const siteSettings: SiteSettings = {
  siteUrl: "https://nz-web.com",
  contact: {
    email: "nzweb295@gmail.com",
    phone: "058-7292029",
    ownerName: "צבי משה",
    whatsappNumber: "972587292029",
    whatsappMessage: "היי, הגעתי מהאתר של NZ-WEB ואשמח לשמוע פרטים נוספים על שירותי פיתוח ועיצוב 🚀"
  },
  seo: {
    ogImage: "https://nz-web.com/og-image.png",
    keywords: "אתר תדמית לעסק, מערכת קביעת תורים, בניית אתר מכירות, חנות אונליין, פיתוח אתר React, פיתוח Full Stack, בניית דפי נחיתה, פיתוח מערכות לעסקים, בניית אתרים,עיצוב אתרים,פתרונות לעסקים,קידום אתרים,בניית אתר אינטרנט,מערכת ניהול תורים,בניית אתר מכירות,",
    siteTitle: "NZ-WEB | פיתוח ועיצוב אתרים מקצועי",
    siteDescription: "סטודיו לפיתוח אתרים, בניית אתר תדמית, חנות אונליין ומערכות קביעת תורים. אתרים מהירים, מודרניים ומותאמים לעסק שלך עם עיצוב UI/UX מקצועי."
  },
  footer: {
    tagline: "Perfect in every Pixel",
    copyrightText: "NZ WEB. כל הזכויות שמורות."
  },
  social: {
    github: "",
    twitter: "",
    youtube: "",
    facebook: "",
    linkedin: "",
    instagram: ""
  },
  socialVisibility: {
    github: true,
    twitter: true,
    youtube: true,
    facebook: true,
    linkedin: true,
    instagram: true
  },
  accessibility: {
    sections: [
      {
        id: "1",
        title: "מבוא",
        content: "אנו ב-NZ-web רואים חשיבות עליונה בהנגשת השירותים הדיגיטליים שלנו לכלל האוכלוסייה, ובכלל זה לאנשים עם מוגבלויות."
      },
      {
        id: "2",
        title: "סטנדרט הנגישות",
        content: "אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע\"ג-2013. ברמת AA ועל פי הנחיות WCAG 2.1."
      },
      {
        id: "3",
        title: "סייגים לנגישות",
        content: "אנו משקיעים מאמצים רבים בתחזוקת נגישות האתר. עם זאת, ייתכן שיתגלו דפים או חלקים שטרם הונגשו במלואם."
      }
    ],
    lastUpdated: "29 ביולי 2026",
    coordinatorName: "צבי משה",
    coordinatorEmail: "zvi293293@gmail.com",
    coordinatorPhone: "058-7292029"
  },
  privacy: {
    sections: [
      {
        id: "1",
        title: "כללי",
        content: "אנו ב-NZ-web מכבדים את פרטיות המשתמשים באתר שלנו. מדיניות זו מפרטת כיצד אנו אוספים, משתמשים ומגינים על המידע."
      },
      {
        id: "2",
        title: "המידע שאנו אוספים",
        content: "מידע אישי שנמסר מרצון בעת מילוי טופס צור קשר. מידע טכני אוטומטי על אופן הגלישה."
      },
      {
        id: "3",
        title: "השימוש במידע",
        content: "המידע משמש למתן מענה לפניות, ניהול נתונים מאובטח ושיפור ביצועי האתר."
      },
      {
        id: "4",
        title: "אבטחת מידע",
        content: "אנו מיישמים נהלים ומערכות אבטחה מתקדמות כדי להגן על המידע מפני גישה בלתי מורשית."
      }
    ],
    lastUpdated: "9 במרץ 2026"
  },
  terms: {
    sections: [
      {
        id: "1",
        title: "כללי והסכמה לתנאים",
        content: "הגלישה והשימוש באתר מהווים הסכמה לתנאים המפורטים במסמך זה."
      },
      {
        id: "2",
        title: "השירותים המוצעים",
        content: "האתר מספק מידע ושירותים בתחומי פיתוח Full-Stack, עיצוב UI/UX והטמעת פתרונות AI."
      },
      {
        id: "3",
        title: "קניין רוחני",
        content: "כל הזכויות באתר שמורות. אין להעתיק או להפיץ ללא אישור."
      },
      {
        id: "4",
        title: "הגבלת אחריות",
        content: "מפעיל האתר לא יישא באחריות לנזק ישיר או עקיף מהסתמכות על מידע המופיע באתר."
      }
    ],
    lastUpdated: "9 במרץ 2026"
  }
};
