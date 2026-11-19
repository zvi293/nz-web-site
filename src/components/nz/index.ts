/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  NZ-web kit — "הגלריה". Build every page with these. Rules: SITE-PLAYBOOK.md
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  import { Section, Container, Eyebrow, Display, Accent, Lede, Button, WhatsAppCta,
 *           Logo, Reveal } from "@/components/nz";
 *  import { Artwork, MuseumLabel } from "@/components/art";
 *
 *  LAYOUT
 *   <Section tone="bone|ink|paper" space="default|tight|none" lit id aria-labelledby>
 *      A room. Sets bg + text colour + tone vars (--fg, --fg-muted, --rule, --focus,
 *      --accent-text) via data-tone. Wraps children in <Container> unless contained={false}.
 *      Rhythm: 72px → 120px → 160px. Alternate bone walls and ink rooms deliberately.
 *   <Container as="div">  max 1440px, gutter 20 → 48 → 64 (CSS var --gutter).
 *
 *  TYPE
 *   <Eyebrow index={1} rule>שירותים</Eyebrow>   small Heebo label, vermilion "01", optional hairline.
 *   <Display as="h1|h2|p" size="xl|l|h2|h3">…</Display>   Frank Ruhl Libre 300, balanced.
 *      sizes: xl 56→168 · l 44→112 · h2 34→72 · h3 22→32 (fluid clamp).
 *   <Accent>מילה</Accent>   the ONE highlighted word (vermilion; deep vermilion on bone).
 *   <Lede>…</Lede>          intro paragraph, 18→22px, muted, ≤ 38ch.
 *   <Ltr>React</Ltr>        Latin words inside Hebrew (bdi dir=ltr).
 *   Tailwind equivalents: font-display, text-display-xl|display-l|h2|h3|lede|body|label.
 *
 *  ACTIONS
 *   <Button to="/projects/">           internal (react-router <Link>)
 *   <Button href="https://…">          external: new tab + rel="noopener noreferrer" + sr note
 *   <Button onClick>                   <button type="button">
 *      variant: "primary" (vermilion pill) | "secondary" (outline pill) | "quiet" (text link,
 *      underline draws in right→left, arrow nudges) · size: "sm" (44px) | "md" (48px) | "lg" (56px)
 *      icon: "arrow" | "whatsapp" | "external" | "none"
 *   <WhatsAppCta label="לשיחה בוואטסאפ" message="…" variant size />   wa.me via lib/contact-utils.
 *
 *  BRAND
 *   <Logo />  wordmark "NZ-web" + the vermilion cube, links home (size with font-size).
 *   <Wordmark />, <LogoMark size title />, logoMarkSvg (string, for favicon.svg).
 *
 *  MOTION
 *   <Reveal variant="rise|fade|curtain|stagger" delay={i * 60}>…</Reveal>
 *      IntersectionObserver entrance. Hidden start states exist ONLY under html.nz-motion
 *      (set by initMotionGate() in src/lib/motion.ts — off for reduced motion, the a11y
 *      widget's pause, and pre-render), so no-JS / reduced-motion always shows content.
 *   Hooks (src/lib/motion.ts): useInView(ref), useActiveIndex(getEls, deps), useMotionAllowed().
 *   Motion rules: animate transform / opacity / clip-path only; ease var(--ease-gallery);
 *   nothing loops; one or two scroll moments per page.
 *
 *  ART (src/components/art)
 *   <Artwork slug sizes priority frame lit hover ratio="3/2" position label={{ index: 1,
 *      prefix: "מוצג", medium: "…" }} />
 *      AVIF/WebP picture 640/1080/1600w, LQIP + dominant colour, lazy by default.
 *      priority = eager + fetchpriority=high + preload link (LCP only — one per page).
 *      label: true → manifest title; object → MuseumLabel props (title defaults to manifest).
 *   <MuseumLabel index={3} prefix="עבודה" title="…" medium="…" />  standalone wall card.
 *   getArt(slug) → { title, alt, width, height, color, lqip, tone, avifSrcSet, webpSrcSet, src }.
 *
 *  NAV DATA (./nav.ts): serviceNav (label, href, desc, art), mainNav, mobileNav, studioNav,
 *   legalNav, studio { email, hours }.
 *
 *  CSS CONVENTIONS
 *   Global kit classes are prefixed `nz-` (index.css). Page CSS lives in its own file next
 *   to the page with its own prefix (home: `hm-` in src/components/home/home.css).
 *   Colours: bone, bone-2, paper, ink, ink-2, ink-3, graphite, ash, vermilion(-deep/-fill),
 *   line, line-ink (Tailwind + CSS vars). Frames: rounded-frame (2px); cards rounded-card (6px);
 *   shadow-frame / shadow-frame-lift. Logical properties only (ms-/me-/ps-/pe-, inset-inline).
 *   LEGACY classes (nz-brand-dark, btn-brand, glass-*, nz-eyebrow, text-display, shadcn
 *   tokens…) live at the end of index.css — do not use them in new code.
 */
export { Container, Section, type Tone } from "./Layout";
export { Eyebrow, Label, Display, Accent, Lede, Ltr } from "./Type";
export { Button, WhatsAppCta } from "./Button";
export { Logo, Wordmark, LogoMark, logoMarkSvg } from "./Logo";
export { Reveal } from "./Reveal";
export { ArrowIcon, ExternalIcon, WhatsAppIcon } from "./icons";
export * from "./nav";
