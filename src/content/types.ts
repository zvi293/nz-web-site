/**
 * Types for the site's static content.
 *
 * All content lives in this folder as plain TypeScript — there is no CMS and no
 * backend. To change what the site shows, edit the matching file here.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** Imported asset from src/assets/projects, or "" when there is no screenshot. */
  image: string;
  link: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  badge: string;
  title: string;
  body: string;
  image: string;
  video?: string;
  iconType: "lucide" | "svg" | "image";
  iconLucideName?: string;
  iconSvg?: string;
  iconImage?: string;
  reverse: boolean;
  tags: string[];
  bgGradient: string;
  textColor: string;
  mutedTextColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconShadow: string;
  tagBg: string;
  tagText: string;
  order: number;
  published: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  /** LEGACY raster cover (pre-gallery). Optional: covers now come from `art` (<Artwork>). */
  cover_image?: string;
  /** LEGACY intrinsic pixel size of `cover_image`. Optional. */
  cover_width?: number;
  cover_height?: number;
  author: string;
  read_time: number;
  published_at: string;
  /** Optional shorter <title> (without the "| NZ-web" suffix) when `title` is too long for search results. */
  seo_title?: string;
  /** Cover artwork slug from src/content/art-manifest.json (render with <Artwork slug=… />).
   *  Each slug is used by at most one post. */
  art?: string;
  /** ISO date of the last material edit (feeds BlogPosting.dateModified). */
  updated_at?: string;
  /** Visible Q&A block at the end of the article (also feeds FAQPage JSON-LD). */
  faq?: BlogFaqItem[];
  /** Optional per-article signature component key (registry: src/components/articles/index.ts).
   *  Rendered where `content` has a line "[[signature]]" (or after the 2nd H2 section). */
  signature?: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  image: string;
  visible: boolean;
  order: number;
}

export interface AboutAccordionItem {
  title: string;
  desc: string;
}

export interface AboutColumn {
  title: string;
  items: AboutAccordionItem[];
}

export interface AboutPageContent {
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroQuote: string;
  servicesTitle: string;
  columns: [AboutColumn, AboutColumn, AboutColumn];
  visionTitle: string;
  visionParagraphs: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  /** Optional: short label for the founder block (e.g. "המייסד"). */
  founderLabel?: string;
  /** Optional: founder name + role line + a few paragraphs about him. */
  founder?: { name: string; role: string; paragraphs: string[] };
  /** Optional: non-numeric working principles (replaces the old stats bar). */
  principlesTitle?: string;
  principles?: AboutAccordionItem[];
}

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
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  github: string;
  youtube: string;
}

export type SocialVisibility = Record<keyof SocialLinks, boolean>;

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

export interface LegalSettings {
  lastUpdated: string;
  sections: LegalPageSection[];
}

export interface SiteSettings {
  siteUrl: string;
  contact: ContactInfo;
  seo: SeoSettings;
  footer: FooterSettings;
  social: SocialLinks;
  socialVisibility: SocialVisibility;
  accessibility: AccessibilitySettings;
  privacy: LegalSettings;
  terms: LegalSettings;
}
