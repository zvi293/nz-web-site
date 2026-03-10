// Site-wide settings API

export interface ContactInfo {
  ownerName: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export interface SeoSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  ogImage: string;
}

export interface FooterSettings {
  tagline: string;
  copyrightText: string;
  showAdminLink: boolean;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  github: string;
  youtube: string;
}

export interface SocialVisibility {
  facebook: boolean;
  instagram: boolean;
  linkedin: boolean;
  twitter: boolean;
  github: boolean;
  youtube: boolean;
}

export interface LegalPageSection {
  id: string;
  title: string;
  content: string;
}

export interface AccessibilitySettings {
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  lastUpdated: string;
  sections: LegalPageSection[];
}

export interface PrivacySettings {
  lastUpdated: string;
  sections: LegalPageSection[];
}

export interface TermsSettings {
  lastUpdated: string;
  sections: LegalPageSection[];
}

export interface SiteSettings {
  contact: ContactInfo;
  seo: SeoSettings;
  footer: FooterSettings;
  social: SocialLinks;
  socialVisibility: SocialVisibility;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  terms: TermsSettings;
}

const LS_KEY = "nz-web-site-settings";

const defaultSettings: SiteSettings = {
  contact: {
    ownerName: "צבי משה",
    phone: "058-7292029",
    email: "zvi293293@gmail.com",
    whatsappNumber: "972587292029",
    whatsappMessage: "היי, הגעתי מהאתר של NZ-WEB ואשמח לשמוע פרטים נוספים על שירותי פיתוח ועיצוב 🚀",
  },
  seo: {
    siteTitle: "NZ-WEB | פיתוח ועיצוב אתרים מקצועי",
    siteDescription: "סטודיו לפיתוח אתרים, עיצוב UI/UX ופתרונות דיגיטליים מתקדמים. Perfect in every Pixel.",
    keywords: "פיתוח אתרים, עיצוב אתרים, UI UX, React, Full Stack, בניית אתרים",
    ogImage: "",
  },
  footer: {
    tagline: "Perfect in every Pixel",
    copyrightText: "NZ WEB. כל הזכויות שמורות.",
    showAdminLink: true,
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    github: "",
    youtube: "",
  },
  socialVisibility: {
    facebook: true,
    instagram: true,
    linkedin: true,
    twitter: true,
    github: true,
    youtube: true,
  },
  accessibility: {
    coordinatorName: "צבי משה",
    coordinatorPhone: "058-7292029",
    coordinatorEmail: "zvi293293@gmail.com",
    lastUpdated: "9 במרץ 2026",
    sections: [
      { id: "1", title: "מבוא", content: "אנו ב-NZ-web רואים חשיבות עליונה בהנגשת השירותים הדיגיטליים שלנו לכלל האוכלוסייה, ובכלל זה לאנשים עם מוגבלויות." },
      { id: "2", title: "סטנדרט הנגישות", content: "אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע\"ג-2013. ברמת AA ועל פי הנחיות WCAG 2.1." },
      { id: "3", title: "סייגים לנגישות", content: "אנו משקיעים מאמצים רבים בתחזוקת נגישות האתר. עם זאת, ייתכן שיתגלו דפים או חלקים שטרם הונגשו במלואם." },
    ],
  },
  privacy: {
    lastUpdated: "9 במרץ 2026",
    sections: [
      { id: "1", title: "כללי", content: "אנו ב-NZ-web מכבדים את פרטיות המשתמשים באתר שלנו. מדיניות זו מפרטת כיצד אנו אוספים, משתמשים ומגינים על המידע." },
      { id: "2", title: "המידע שאנו אוספים", content: "מידע אישי שנמסר מרצון בעת מילוי טופס צור קשר. מידע טכני אוטומטי על אופן הגלישה." },
      { id: "3", title: "השימוש במידע", content: "המידע משמש למתן מענה לפניות, ניהול נתונים מאובטח ושיפור ביצועי האתר." },
      { id: "4", title: "אבטחת מידע", content: "אנו מיישמים נהלים ומערכות אבטחה מתקדמות כדי להגן על המידע מפני גישה בלתי מורשית." },
    ],
  },
  terms: {
    lastUpdated: "9 במרץ 2026",
    sections: [
      { id: "1", title: "כללי והסכמה לתנאים", content: "הגלישה והשימוש באתר מהווים הסכמה לתנאים המפורטים במסמך זה." },
      { id: "2", title: "השירותים המוצעים", content: "האתר מספק מידע ושירותים בתחומי פיתוח Full-Stack, עיצוב UI/UX והטמעת פתרונות AI." },
      { id: "3", title: "קניין רוחני", content: "כל הזכויות באתר שמורות. אין להעתיק או להפיץ ללא אישור." },
      { id: "4", title: "הגבלת אחריות", content: "מפעיל האתר לא יישא באחריות לנזק ישיר או עקיף מהסתמכות על מידע המופיע באתר." },
    ],
  },
};

export function fetchSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

export function getDefaultSettings(): SiteSettings {
  return defaultSettings;
}
