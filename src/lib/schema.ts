/**
 * schema.ts — page-level JSON-LD builders for NZ-web (schema.org, one @graph per page).
 *
 * ── How the graph is put together ──────────────────────────────────────────────────────────
 * index.html carries the site-wide stubs, in every page's HTML:
 *     https://nz-web.com/#organization  (Organization + ProfessionalService, "NZ-web")
 *     https://nz-web.com/#website       (WebSite, publisher → #organization)
 *     https://nz-web.com/#founder       (Person, צבי משה, worksFor → #organization)
 * Page nodes built here only REFERENCE those stubs by @id ({ "@id": ORG_ID }) and never
 * redefine them. Page node ids are the canonical URL + a fragment:
 *     <canonical>#webpage  #breadcrumb  #faq  #service  #article  #itemlist  #howto  #primaryimage
 *
 * ── Usage in a page ───────────────────────────────────────────────────────────────────────
 *     import { useMemo } from "react";
 *     import { useSeoMeta } from "@/hooks/useSeoMeta";
 *     import { useBreadcrumb } from "@/hooks/useBreadcrumb";
 *     import { webPage, service, faqPage, imageObject, OG_IMAGES } from "@/lib/schema";
 *     import heroUrl from "@/assets/art/darkroom-glow-1080.webp";   // hashed URL from Vite
 *
 *     const PATH = "/services/";
 *     const jsonLd = useMemo(() => {
 *       const hero = imageObject("darkroom-glow", heroUrl, { path: PATH, variant: 1080 });
 *       return [
 *         webPage({ path: PATH, title, description, primaryImage: hero, dateModified: "2026-11-19" }),
 *         service({ path: PATH, name: "בניית אתרים לעסקים", description, image: hero.url as string }),
 *         faqPage(faqItems, PATH),            // the SAME items, same order, as the visible <details>
 *       ];
 *     }, []);
 *     useSeoMeta({ title, description, ogImage: OG_IMAGES.services, ogImageAlt: "…", jsonLd });
 *     useBreadcrumb({ name: "שירותים", path: PATH });
 *
 *   - Memoise `jsonLd` (useMemo / module constant): useSeoMeta compares it by reference.
 *   - useSeoMeta merges `jsonLd`, the legacy `schema` prop and the breadcrumb from useBreadcrumb
 *     into ONE <script type="application/ld+json" id="page-jsonld"> {"@context", "@graph": [...]}.
 *   - If no node with id <canonical>#webpage is passed, useSeoMeta adds a plain WebPage itself
 *     (indexable pages only), so every page has one. Pass webPage()/aboutPage()/contactPage()/
 *     collectionPage() to control it (speakable, primary image, dates).
 *   - Duplicate @ids are merged by useSeoMeta: a node that appears twice (e.g. the same licensed
 *     ImageObject inside both WebPage and BlogPosting) is emitted in full once, then by reference,
 *     so keys such as `creator` are never duplicated.
 *
 * ── Builders (all return plain objects; `path` is a site path like "/about" or "/about/") ──
 *   pageUrl(path)                       absolute canonical URL with trailing slash
 *   ref(id)                             { "@id": id }
 *   webPage({ path, title, description, type?, primaryImage?, datePublished?, dateModified?,
 *             speakable? (true → ["h1", ".lead"] | string[] of CSS selectors), breadcrumb?,
 *             about?, mainEntity? })
 *   aboutPage(opts) / contactPage(opts)  webPage with type AboutPage / ContactPage, about #organization
 *   breadcrumb(items[{name,path}], path?)  BreadcrumbList; first item should be דף הבית "/"
 *   faqPage(items[{question,answer}], path)  FAQPage (#faq); answers are plain text
 *   service({ path, name, description, image?, serviceType?, alternateName? })  Service (#service),
 *             provider #organization, areaServed Israel. Never offers/price.
 *   article({ path, headline, description, image, datePublished, dateModified?, section?,
 *             keywords?, wordCount?, readMinutes?, about? })  BlogPosting (#article), author
 *             #founder, publisher #organization, licensed ImageObject.
 *   collectionPage({ path, title, description, items[{name,path|url,description?,image?}],
 *             primaryImage?, dateModified?, speakable? })  → [CollectionPage, ItemList] (spread it)
 *   howTo({ path, name, description?, steps[{name,text,image?,url?}], totalTime? })  HowTo (#howto)
 *   definedTermSet({ path, name, description?, terms[{name, description, slug?}] })  glossary
 *   licensedImage({ url, width?, height?, caption?, description?, id? })  ImageObject with the
 *             licensing fields (license, acquireLicensePage, creditText, copyrightNotice, creator ONCE)
 *   imageObject(slug, url, { path?, variant? })  licensedImage from src/content/art-manifest.json
 *             (caption = exhibit title, description = alt). `url` is the HASHED asset URL
 *             (import x from "@/assets/art/<slug>-1080.webp"); it is made absolute here.
 *   OG_IMAGES / OG_IMAGE_SIZE           per-page social cards (re-exported from site-url.ts)
 *   SITE_LAST_UPDATED                   a fixed date to use as dateModified when a page has none
 *
 * Rules (SITE-PLAYBOOK §1, §5, §10): no prices / offers / priceRange / ratings / reviews; FAQ text
 * identical to the visible Q&A; same @id → same name everywhere.
 */
import artManifest from "@/content/art-manifest.json";
import { getAbsoluteAssetUrl, OG_IMAGES, OG_IMAGE_SIZE, DEFAULT_OG_IMAGE } from "@/lib/site-url";

export { OG_IMAGES, OG_IMAGE_SIZE, DEFAULT_OG_IMAGE };
export type { OgImageName } from "@/lib/site-url";

export const SITE = "https://nz-web.com";
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const FOUNDER_ID = `${SITE}/#founder`;
export const BLOG_ID = `${SITE}/blog/#blog`;

/** Fallback dateModified for pages without their own date (bump when the site is refreshed). */
export const SITE_LAST_UPDATED = "2026-11-19";

export const LICENSE_URL = `${SITE}/terms/#ip`;
export const ACQUIRE_LICENSE_URL = `${SITE}/contact/`;
export const CREDIT_TEXT = "NZ-web";
export const COPYRIGHT_NOTICE = "© צבי משה, NZ-web";

export type JsonLdNode = Record<string, unknown>;
export interface Ref {
  "@id": string;
}

export const ref = (id: string): Ref => ({ "@id": id });

/* ─────────────────────────── URLs ─────────────────────────── */

/** "/about" | "/about/" | "https://nz-web.com/about" → "https://nz-web.com/about/" */
export function pageUrl(path = "/"): string {
  let p = path.trim();
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname;
    } catch {
      p = "/";
    }
  }
  p = p.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/") && !/\.[a-z0-9]{2,5}$/i.test(p)) p = `${p}/`;
  return `${SITE}${p}`;
}

/** Absolute URL for a root-relative asset or page link; absolute input is returned as is. */
function absolute(urlOrPath: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return getAbsoluteAssetUrl(urlOrPath);
}

const nodeId = (path: string, fragment: string) => `${pageUrl(path)}#${fragment}`;

/** Drops undefined / null / empty-string / empty-array values (keeps JSON-LD tidy). */
function clean<T extends JsonLdNode>(node: T): T {
  const out: JsonLdNode = {};
  for (const [k, v] of Object.entries(node)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as T;
}

/* ─────────────────────────── Images ─────────────────────────── */

export interface LicensedImageInput {
  url: string;
  width?: number;
  height?: number;
  /** Short visible title (e.g. the exhibit title). */
  caption?: string;
  /** Longer description (e.g. the Hebrew alt text). */
  description?: string;
  /** Explicit @id. Defaults to <url>#image. Use pageUrl(path) + "#primaryimage" for a hero. */
  id?: string;
}

/**
 * ImageObject with the licensing fields Google Images reads (playbook §10).
 * `creator` is set exactly once, here, as a reference to the founder.
 */
export function licensedImage({ url, width, height, caption, description, id }: LicensedImageInput): JsonLdNode {
  const abs = absolute(url);
  return clean({
    "@type": "ImageObject",
    "@id": id ?? `${abs}#image`,
    url: abs,
    contentUrl: abs,
    width,
    height,
    caption,
    description,
    inLanguage: "he",
    license: LICENSE_URL,
    acquireLicensePage: ACQUIRE_LICENSE_URL,
    creditText: CREDIT_TEXT,
    copyrightNotice: COPYRIGHT_NOTICE,
    creator: ref(FOUNDER_ID),
  });
}

interface ArtEntry {
  width: number;
  height: number;
  title?: string;
  alt?: string;
}
const ART = artManifest as unknown as Record<string, ArtEntry>;

/** Manifest entry for an art slug (undefined if the slug is unknown). */
export function artInfo(slug: string): ArtEntry | undefined {
  return ART[slug];
}

/**
 * Licensed ImageObject for a gallery artwork.
 * @param slug     art slug from src/content/art-manifest.json
 * @param url      the hashed asset URL Vite gives you for the file you actually serve
 *                 (e.g. `import u from "@/assets/art/<slug>-1080.webp"`); made absolute here
 * @param options.path     when set, the node id is <canonical>#primaryimage (the page hero)
 * @param options.variant  pixel width of the served file (640 | 1080 | 1600) → exact width/height
 */
export function imageObject(
  slug: string,
  url: string,
  options: { path?: string; variant?: number } = {},
): JsonLdNode {
  const info = ART[slug];
  let width = info?.width;
  let height = info?.height;
  if (info && options.variant && options.variant < info.width) {
    width = options.variant;
    height = Math.round((info.height * options.variant) / info.width);
  }
  return licensedImage({
    url,
    width,
    height,
    caption: info?.title,
    description: info?.alt,
    id: options.path ? nodeId(options.path, "primaryimage") : undefined,
  });
}

type ImageInput = string | JsonLdNode;

function toImage(img: ImageInput | undefined, path?: string): JsonLdNode | undefined {
  if (!img) return undefined;
  if (typeof img === "string") {
    return licensedImage({ url: img, id: path ? nodeId(path, "primaryimage") : undefined });
  }
  return img;
}

/* ─────────────────────────── Pages ─────────────────────────── */

export type WebPageType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage"
  | "FAQPage"
  | "ItemPage"
  | "CheckoutPage"
  | "SearchResultsPage";

export interface WebPageInput {
  path: string;
  title: string;
  description?: string;
  type?: WebPageType | WebPageType[];
  /** A licensedImage()/imageObject() node, or a URL (wrapped as a licensed ImageObject). */
  primaryImage?: ImageInput;
  datePublished?: string;
  dateModified?: string;
  /** true → SpeakableSpecification for ["h1", ".lead"]; or your own CSS selectors. */
  speakable?: boolean | string[];
  /** Link to <canonical>#breadcrumb (default: true for every page except "/"). */
  breadcrumb?: boolean;
  about?: Ref | JsonLdNode;
  mainEntity?: Ref | JsonLdNode;
}

export function webPage({
  path,
  title,
  description,
  type = "WebPage",
  primaryImage,
  datePublished,
  dateModified,
  speakable,
  breadcrumb: withBreadcrumb,
  about,
  mainEntity,
}: WebPageInput): JsonLdNode {
  const url = pageUrl(path);
  const image = toImage(primaryImage, path);
  const isHome = url === `${SITE}/`;
  const selectors = speakable === true ? ["h1", ".lead"] : Array.isArray(speakable) ? speakable : undefined;
  return clean({
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "he",
    isPartOf: ref(WEBSITE_ID),
    about: about ?? ref(ORG_ID),
    publisher: ref(ORG_ID),
    primaryImageOfPage: image,
    image: image ? ref(String(image["@id"])) : undefined,
    datePublished,
    dateModified,
    breadcrumb: (withBreadcrumb ?? !isHome) ? ref(`${url}#breadcrumb`) : undefined,
    mainEntity,
    speakable: selectors ? { "@type": "SpeakableSpecification", cssSelector: selectors } : undefined,
  });
}

export function aboutPage(opts: Omit<WebPageInput, "type">): JsonLdNode {
  return webPage({ ...opts, type: "AboutPage", about: opts.about ?? ref(ORG_ID), mainEntity: opts.mainEntity ?? ref(ORG_ID) });
}

export function contactPage(opts: Omit<WebPageInput, "type">): JsonLdNode {
  return webPage({ ...opts, type: "ContactPage", about: opts.about ?? ref(ORG_ID), mainEntity: opts.mainEntity ?? ref(ORG_ID) });
}

/* ─────────────────────────── Breadcrumb ─────────────────────────── */

export interface Crumb {
  name: string;
  path: string;
}

/**
 * BreadcrumbList. `items` in order, normally starting with { name: "דף הבית", path: "/" }.
 * `path` = the page the list belongs to (defaults to the last item's path).
 */
export function breadcrumb(items: Crumb[], path?: string): JsonLdNode {
  const owner = path ?? items[items.length - 1]?.path ?? "/";
  return {
    "@type": "BreadcrumbList",
    "@id": nodeId(owner, "breadcrumb"),
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: pageUrl(c.path),
    })),
  };
}

/* ─────────────────────────── FAQ ─────────────────────────── */

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage. Text must match the visible <details> word for word, in the same order. */
export function faqPage(items: FaqItem[], path: string): JsonLdNode {
  const url = pageUrl(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    inLanguage: "he",
    isPartOf: ref(`${url}#webpage`),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/* ─────────────────────────── Service ─────────────────────────── */

export interface ServiceInput {
  path: string;
  name: string;
  description: string;
  image?: ImageInput;
  serviceType?: string;
  alternateName?: string | string[];
}

/** Service with provider #organization. Never add offers / price (playbook §1.2). */
export function service({ path, name, description, image, serviceType, alternateName }: ServiceInput): JsonLdNode {
  const url = pageUrl(path);
  const img = typeof image === "string" ? absolute(image) : image ? ref(String(image["@id"])) : undefined;
  return clean({
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name,
    alternateName,
    description,
    serviceType: serviceType ?? name,
    inLanguage: "he",
    provider: ref(ORG_ID),
    brand: ref(ORG_ID),
    areaServed: { "@type": "Country", name: "Israel" },
    availableLanguage: "he",
    image: img,
    mainEntityOfPage: ref(`${url}#webpage`),
  });
}

/* ─────────────────────────── Article ─────────────────────────── */

export interface ArticleInput {
  path: string;
  headline: string;
  description: string;
  /** Cover: an imageObject()/licensedImage() node, or a URL (wrapped with the licensing fields). */
  image: ImageInput;
  datePublished: string;
  dateModified?: string;
  section?: string;
  keywords?: string | string[];
  wordCount?: number;
  readMinutes?: number;
  about?: Ref | JsonLdNode | Array<Ref | JsonLdNode>;
}

/** BlogPosting: author #founder, publisher #organization, licensed cover image. */
export function article({
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  section,
  keywords,
  wordCount,
  readMinutes,
  about,
}: ArticleInput): JsonLdNode {
  const url = pageUrl(path);
  return clean({
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline,
    description,
    image: toImage(image, path),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "he",
    author: ref(FOUNDER_ID),
    publisher: ref(ORG_ID),
    mainEntityOfPage: ref(`${url}#webpage`),
    isPartOf: ref(BLOG_ID),
    articleSection: section,
    keywords,
    wordCount,
    timeRequired: readMinutes ? `PT${readMinutes}M` : undefined,
    about,
  });
}

/* ─────────────────────────── Collections ─────────────────────────── */

export interface CollectionItem {
  name: string;
  /** Site path ("/blog/x") or absolute URL (external project). */
  path?: string;
  url?: string;
  description?: string;
  image?: string;
}

export interface CollectionPageInput extends Omit<WebPageInput, "type" | "mainEntity"> {
  items: CollectionItem[];
}

/** Hub pages: returns [CollectionPage, ItemList] — spread it into jsonLd. */
export function collectionPage({ items, ...page }: CollectionPageInput): JsonLdNode[] {
  const url = pageUrl(page.path);
  const listId = `${url}#itemlist`;
  return [
    webPage({ ...page, type: "CollectionPage", mainEntity: ref(listId) }),
    {
      "@type": "ItemList",
      "@id": listId,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) =>
        clean({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          url: item.url ? absolute(item.url) : pageUrl(item.path ?? "/"),
          description: item.description,
          image: item.image ? absolute(item.image) : undefined,
        }),
      ),
    },
  ];
}

/* ─────────────────────────── HowTo ─────────────────────────── */

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  /** Optional anchor on the page for the step, e.g. "#step-1". */
  url?: string;
}

export function howTo({
  path,
  name,
  description,
  steps,
  totalTime,
}: {
  path: string;
  name: string;
  description?: string;
  steps: HowToStep[];
  /** ISO 8601 duration, e.g. "P14D". Only if it is a real, stated figure. */
  totalTime?: string;
}): JsonLdNode {
  const url = pageUrl(path);
  return clean({
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    description,
    inLanguage: "he",
    totalTime,
    isPartOf: ref(`${url}#webpage`),
    step: steps.map((s, i) =>
      clean({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
        url: s.url ? `${url}${s.url.startsWith("#") ? s.url : `#${s.url}`}` : undefined,
        image: s.image ? absolute(s.image) : undefined,
      }),
    ),
  });
}

/* ─────────────────────────── Glossary ─────────────────────────── */

export function definedTermSet({
  path,
  name,
  description,
  terms,
}: {
  path: string;
  name: string;
  description?: string;
  terms: Array<{ name: string; description: string; slug?: string }>;
}): JsonLdNode {
  const url = pageUrl(path);
  const setId = `${url}#terms`;
  return clean({
    "@type": "DefinedTermSet",
    "@id": setId,
    name,
    description,
    url,
    inLanguage: "he",
    hasDefinedTerm: terms.map((t) =>
      clean({
        "@type": "DefinedTerm",
        "@id": t.slug ? `${url}#${t.slug}` : undefined,
        name: t.name,
        description: t.description,
        url: t.slug ? `${url}#${t.slug}` : undefined,
        inDefinedTermSet: ref(setId),
      }),
    ),
  });
}

/* ─────────────────────────── Graph assembly (used by useSeoMeta) ─────────────────────────── */

/**
 * Flattens nodes (and nested "@graph" arrays), strips per-node "@context", and de-duplicates
 * by @id: the first full occurrence wins (later full copies are merged into it, filling missing
 * keys); any later nested full copy is replaced by a bare { "@id" } reference.
 */
export function buildGraph(nodes: unknown[]): JsonLdNode[] {
  const flat: JsonLdNode[] = [];
  const push = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) return n.forEach(push);
    const obj = { ...(n as JsonLdNode) };
    delete obj["@context"];
    if (Array.isArray(obj["@graph"])) return (obj["@graph"] as unknown[]).forEach(push);
    flat.push(obj);
  };
  nodes.forEach(push);

  const top = new Map<string, JsonLdNode>();
  const out: JsonLdNode[] = [];
  for (const node of flat) {
    const id = typeof node["@id"] === "string" ? (node["@id"] as string) : undefined;
    if (id && top.has(id)) {
      const existing = top.get(id)!;
      for (const [k, v] of Object.entries(node)) if (!(k in existing)) existing[k] = v;
      continue;
    }
    if (id) top.set(id, node);
    out.push(node);
  }

  const seen = new Set<string>(top.keys());
  const walk = (value: unknown, depth: number): unknown => {
    if (Array.isArray(value)) return value.map((v) => walk(v, depth));
    if (!value || typeof value !== "object") return value;
    const obj = value as JsonLdNode;
    const id = typeof obj["@id"] === "string" ? (obj["@id"] as string) : undefined;
    const isFull = Object.keys(obj).some((k) => k !== "@id");
    if (depth > 0 && id && isFull) {
      if (seen.has(id)) return { "@id": id };
      seen.add(id);
    }
    const copy: JsonLdNode = {};
    for (const [k, v] of Object.entries(obj)) copy[k] = walk(v, depth + 1);
    return copy;
  };
  return out.map((n) => walk(n, 0) as JsonLdNode);
}
