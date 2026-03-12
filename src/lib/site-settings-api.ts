import { useEffect, useSyncExternalStore } from "react";

import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

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

interface SiteSettingsStoreState {
  settings: SiteSettings;
  isLoading: boolean;
  error: string | null;
}

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
type SiteSettingsInsert = Database["public"]["Tables"]["site_settings"]["Insert"];

const SITE_SETTINGS_ROW_ID = "default";

const defaultSettings: SiteSettings = {
  contact: {
    ownerName: "צבי משה",
    phone: "058-7292029",
    email: "nzweb295@gmail.com",
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
    coordinatorEmail: "nzweb295@gmail.com",
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

let siteSettingsState: SiteSettingsStoreState = {
  settings: cloneSettings(defaultSettings),
  isLoading: false,
  error: null,
};

let inFlightLoad: Promise<SiteSettings> | null = null;
let hasLoadedSiteSettings = false;
let hasAttemptedInitialLoad = false;
const listeners = new Set<() => void>();

function cloneSettings(settings: SiteSettings): SiteSettings {
  return JSON.parse(JSON.stringify(settings)) as SiteSettings;
}

function emitSiteSettingsChange() {
  listeners.forEach((listener) => listener());
}

function setSiteSettingsState(nextState: SiteSettingsStoreState) {
  siteSettingsState = nextState;
  emitSiteSettingsChange();
}

function subscribeSiteSettings(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSiteSettingsSnapshot() {
  return siteSettingsState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeLegalSections(value: unknown, fallback: LegalPageSection[]): LegalPageSection[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((section, index) => {
    if (!isRecord(section)) {
      return fallback[index] ?? { id: crypto.randomUUID(), title: "", content: "" };
    }

    return {
      id: typeof section.id === "string" && section.id ? section.id : fallback[index]?.id ?? crypto.randomUUID(),
      title: typeof section.title === "string" ? section.title : fallback[index]?.title ?? "",
      content: typeof section.content === "string" ? section.content : fallback[index]?.content ?? "",
    };
  });
}

function mergeSiteSettings(input: unknown): SiteSettings {
  const source = isRecord(input) ? input : {};
  const contact = isRecord(source.contact) ? source.contact : {};
  const seo = isRecord(source.seo) ? source.seo : {};
  const footer = isRecord(source.footer) ? source.footer : {};
  const social = isRecord(source.social) ? source.social : {};
  const socialVisibility = isRecord(source.socialVisibility) ? source.socialVisibility : {};
  const accessibility = isRecord(source.accessibility) ? source.accessibility : {};
  const privacy = isRecord(source.privacy) ? source.privacy : {};
  const terms = isRecord(source.terms) ? source.terms : {};

  return {
    contact: {
      ...defaultSettings.contact,
      ownerName: typeof contact.ownerName === "string" ? contact.ownerName : defaultSettings.contact.ownerName,
      phone: typeof contact.phone === "string" ? contact.phone : defaultSettings.contact.phone,
      email: typeof contact.email === "string" ? contact.email : defaultSettings.contact.email,
      whatsappNumber:
        typeof contact.whatsappNumber === "string" ? contact.whatsappNumber : defaultSettings.contact.whatsappNumber,
      whatsappMessage:
        typeof contact.whatsappMessage === "string"
          ? contact.whatsappMessage
          : defaultSettings.contact.whatsappMessage,
    },
    seo: {
      ...defaultSettings.seo,
      siteTitle: typeof seo.siteTitle === "string" ? seo.siteTitle : defaultSettings.seo.siteTitle,
      siteDescription:
        typeof seo.siteDescription === "string" ? seo.siteDescription : defaultSettings.seo.siteDescription,
      keywords: typeof seo.keywords === "string" ? seo.keywords : defaultSettings.seo.keywords,
      ogImage: typeof seo.ogImage === "string" ? seo.ogImage : defaultSettings.seo.ogImage,
    },
    footer: {
      ...defaultSettings.footer,
      tagline: typeof footer.tagline === "string" ? footer.tagline : defaultSettings.footer.tagline,
      copyrightText:
        typeof footer.copyrightText === "string" ? footer.copyrightText : defaultSettings.footer.copyrightText,
      showAdminLink:
        typeof footer.showAdminLink === "boolean" ? footer.showAdminLink : defaultSettings.footer.showAdminLink,
    },
    social: {
      ...defaultSettings.social,
      facebook: typeof social.facebook === "string" ? social.facebook : defaultSettings.social.facebook,
      instagram: typeof social.instagram === "string" ? social.instagram : defaultSettings.social.instagram,
      linkedin: typeof social.linkedin === "string" ? social.linkedin : defaultSettings.social.linkedin,
      twitter: typeof social.twitter === "string" ? social.twitter : defaultSettings.social.twitter,
      github: typeof social.github === "string" ? social.github : defaultSettings.social.github,
      youtube: typeof social.youtube === "string" ? social.youtube : defaultSettings.social.youtube,
    },
    socialVisibility: {
      ...defaultSettings.socialVisibility,
      facebook:
        typeof socialVisibility.facebook === "boolean"
          ? socialVisibility.facebook
          : defaultSettings.socialVisibility.facebook,
      instagram:
        typeof socialVisibility.instagram === "boolean"
          ? socialVisibility.instagram
          : defaultSettings.socialVisibility.instagram,
      linkedin:
        typeof socialVisibility.linkedin === "boolean"
          ? socialVisibility.linkedin
          : defaultSettings.socialVisibility.linkedin,
      twitter:
        typeof socialVisibility.twitter === "boolean"
          ? socialVisibility.twitter
          : defaultSettings.socialVisibility.twitter,
      github:
        typeof socialVisibility.github === "boolean"
          ? socialVisibility.github
          : defaultSettings.socialVisibility.github,
      youtube:
        typeof socialVisibility.youtube === "boolean"
          ? socialVisibility.youtube
          : defaultSettings.socialVisibility.youtube,
    },
    accessibility: {
      ...defaultSettings.accessibility,
      coordinatorName:
        typeof accessibility.coordinatorName === "string"
          ? accessibility.coordinatorName
          : defaultSettings.accessibility.coordinatorName,
      coordinatorPhone:
        typeof accessibility.coordinatorPhone === "string"
          ? accessibility.coordinatorPhone
          : defaultSettings.accessibility.coordinatorPhone,
      coordinatorEmail:
        typeof accessibility.coordinatorEmail === "string"
          ? accessibility.coordinatorEmail
          : defaultSettings.accessibility.coordinatorEmail,
      lastUpdated:
        typeof accessibility.lastUpdated === "string"
          ? accessibility.lastUpdated
          : defaultSettings.accessibility.lastUpdated,
      sections: normalizeLegalSections(accessibility.sections, defaultSettings.accessibility.sections),
    },
    privacy: {
      ...defaultSettings.privacy,
      lastUpdated: typeof privacy.lastUpdated === "string" ? privacy.lastUpdated : defaultSettings.privacy.lastUpdated,
      sections: normalizeLegalSections(privacy.sections, defaultSettings.privacy.sections),
    },
    terms: {
      ...defaultSettings.terms,
      lastUpdated: typeof terms.lastUpdated === "string" ? terms.lastUpdated : defaultSettings.terms.lastUpdated,
      sections: normalizeLegalSections(terms.sections, defaultSettings.terms.sections),
    },
  };
}

function mapSiteSettingsRow(row: SiteSettingsRow | null): SiteSettings {
  if (!row) {
    return cloneSettings(defaultSettings);
  }

  return mergeSiteSettings(row.settings);
}

function mapSiteSettingsInsert(settings: SiteSettings): SiteSettingsInsert {
  return {
    id: SITE_SETTINGS_ROW_ID,
    settings: settings as unknown as Database["public"]["Tables"]["site_settings"]["Insert"]["settings"],
  };
}

export function fetchSiteSettings(): SiteSettings {
  return siteSettingsState.settings;
}

export function getDefaultSettings(): SiteSettings {
  return cloneSettings(defaultSettings);
}

export async function loadSiteSettings(force = false): Promise<SiteSettings> {
  if (!force && inFlightLoad) {
    return inFlightLoad;
  }

  if (force) {
    hasAttemptedInitialLoad = true;
  }

  setSiteSettingsState({
    ...siteSettingsState,
    isLoading: true,
    error: null,
  });

  inFlightLoad = (async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", SITE_SETTINGS_ROW_ID).maybeSingle();

      if (error) {
        throw error;
      }

      const settings = mapSiteSettingsRow(data ?? null);
      hasLoadedSiteSettings = true;
      setSiteSettingsState({
        settings,
        isLoading: false,
        error: null,
      });
      return settings;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSiteSettingsState({
        settings: siteSettingsState.settings,
        isLoading: false,
        error: message,
      });
      throw error;
    } finally {
      inFlightLoad = null;
    }
  })();

  return inFlightLoad;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(mapSiteSettingsInsert(settings), { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const mergedSettings = mapSiteSettingsRow(data);
  setSiteSettingsState({
    settings: mergedSettings,
    isLoading: false,
    error: null,
  });
  return mergedSettings;
}

export function useSiteSettings() {
  const snapshot = useSyncExternalStore(subscribeSiteSettings, getSiteSettingsSnapshot, getSiteSettingsSnapshot);

  useEffect(() => {
    if (!hasAttemptedInitialLoad && !snapshot.isLoading && inFlightLoad === null) {
      hasAttemptedInitialLoad = true;
      void loadSiteSettings().catch(() => undefined);
    }
  }, [snapshot.isLoading]);

  return snapshot;
}

export function useContactInfo(): ContactInfo {
  const { settings } = useSiteSettings();
  return settings.contact;
}
