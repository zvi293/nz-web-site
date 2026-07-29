import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Youtube,
  ArrowLeft,
} from "lucide-react";
import { siteSettings } from "@/content/site-settings";
import { getMailtoHref, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";

// ── CSS-animated wave shapes (reliable cross-browser, no framer-motion SVG path issues) ──
const WAVE1 = "M0,60 C120,100 240,40 480,80 C720,120 960,30 1200,70 C1320,90 1380,60 1440,80 L1440,200 L0,200 Z";
const WAVE2 = "M0,100 C180,60 360,130 600,80 C840,30 1020,110 1200,70 C1320,50 1400,90 1440,100 L1440,200 L0,200 Z";
const WAVE3 = "M0,130 C200,100 400,160 650,120 C900,80 1050,150 1250,110 C1350,90 1400,130 1440,130 L1440,200 L0,200 Z";
const WAVE4 = "M0,155 C160,130 320,170 520,145 C720,120 880,165 1080,140 C1240,120 1360,155 1440,150 L1440,200 L0,200 Z";

// ── Legacy type kept to avoid removing unused vars ──
type WavePathFrames = [string, ...string[]];

const backWavePaths: WavePathFrames = [
  "M0,60 C120,100 240,40 480,80 C720,120 960,30 1200,70 C1320,90 1380,60 1440,80 L1440,200 L0,200 Z",
  "M0,90 C120,40 360,110 540,60 C720,10 900,100 1100,50 C1300,0 1380,80 1440,60 L1440,200 L0,200 Z",
  "M0,50 C200,110 400,20 600,90 C800,160 1000,40 1200,100 C1350,130 1400,70 1440,90 L1440,200 L0,200 Z",
  "M0,60 C120,100 240,40 480,80 C720,120 960,30 1200,70 C1320,90 1380,60 1440,80 L1440,200 L0,200 Z",
];

const frontWavePaths: WavePathFrames = [
  "M0,155 C160,130 320,170 520,145 C720,120 880,165 1080,140 C1240,120 1360,155 1440,150 L1440,200 L0,200 Z",
  "M0,140 C160,170 340,125 520,155 C700,185 880,130 1080,160 C1240,180 1360,140 1440,145 L1440,200 L0,200 Z",
  "M0,160 C180,130 360,165 540,135 C720,105 900,155 1100,130 C1280,110 1380,155 1440,160 L1440,200 L0,200 Z",
  "M0,155 C160,130 320,170 520,145 C720,120 880,165 1080,140 C1240,120 1360,155 1440,150 L1440,200 L0,200 Z",
];

function createWaveAnimation(paths: WavePathFrames) {
  const [initialPath] = paths;
  return { d: initialPath, initial: { d: initialPath }, animate: { d: paths } };
}

const Footer = () => {
  const { contact, social, footer: footerSettings, socialVisibility } = siteSettings;
  const backWave = createWaveAnimation(backWavePaths);
  const frontWave = createWaveAnimation(frontWavePaths);

  const allSocialIcons = [
    { key: "facebook", url: social.facebook, icon: Facebook, label: "Facebook", alwaysShow: true },
    { key: "instagram", url: social.instagram, icon: Instagram, label: "Instagram", alwaysShow: false },
    { key: "linkedin", url: social.linkedin, icon: Linkedin, label: "LinkedIn", alwaysShow: false },
    { key: "twitter", url: social.twitter, icon: Twitter, label: "Twitter / X", alwaysShow: false },
    { key: "github", url: social.github, icon: Github, label: "GitHub", alwaysShow: false },
    { key: "youtube", url: social.youtube, icon: Youtube, label: "YouTube", alwaysShow: false },
  ];

  const socialIcons = allSocialIcons.filter((s) => {
    const visible = socialVisibility?.[s.key as keyof typeof socialVisibility] ?? true;
    return visible && (s.alwaysShow || (s.url && s.url.trim() !== ""));
  });

  const navigationLinks = [
    { label: "ראשי", href: "/" },
    { label: "מי אנחנו", href: "/about/" },
    { label: "פרויקטים", href: "/projects/" },
    { label: "שירותים", href: "/#services" },
    { label: "חבילות אתר תדמית", href: "/packages/" },
    { label: "שאלות נפוצות", href: "/faq/" },
    { label: "בלוג", href: "/blog/" },
    { label: "צור קשר", href: "/contact/" },
  ];

  const legalLinks = [
    { label: "הצהרת נגישות", href: "/accessibility/", highlight: true },
    { label: "מדיניות פרטיות", href: "/privacy/" },
    { label: "תנאי שימוש", href: "/terms/" },
  ];

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppHref(contact), "_blank");
  };

  return (
    <footer className="relative w-full overflow-hidden" dir="rtl">
      {/* Wave transition — CSS keyframe animation (reliable, no framer-motion SVG path morphing) */}
      <div className="relative h-28 bg-background md:h-40">
        <svg
          className="absolute bottom-0 left-0 h-full w-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="footerWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(222,47%,12%)" />
              <stop offset="50%" stopColor="hsl(217,45%,15%)" />
              <stop offset="100%" stopColor="hsl(222,47%,12%)" />
            </linearGradient>
            <linearGradient id="footerWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220,48%,11%)" />
              <stop offset="100%" stopColor="hsl(222,47%,12%)" />
            </linearGradient>
            <linearGradient id="footerWave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220,50%,10%)" />
              <stop offset="100%" stopColor="hsl(222,47%,10%)" />
            </linearGradient>
            <style>{`
              @keyframes footerWave1Anim {
                0%,100% { d: path("${WAVE1}"); }
                50% { d: path("M0,90 C120,40 360,110 540,60 C720,10 900,100 1100,50 C1300,0 1380,80 1440,60 L1440,200 L0,200 Z"); }
              }
              @keyframes footerWave2Anim {
                0%,100% { d: path("${WAVE2}"); }
                50% { d: path("M0,80 C180,130 380,50 580,110 C780,170 980,60 1180,110 C1330,140 1400,80 1440,80 L1440,200 L0,200 Z"); }
              }
              @keyframes footerWave3Anim {
                0%,100% { d: path("${WAVE3}"); }
                50% { d: path("M0,120 C200,160 380,90 600,145 C820,200 1000,110 1200,145 C1350,165 1400,120 1440,130 L1440,200 L0,200 Z"); }
              }
              @keyframes footerWave4Anim {
                0%,100% { d: path("${WAVE4}"); }
                50% { d: path("M0,145 C160,175 340,130 520,160 C700,190 880,135 1080,163 C1240,183 1360,143 1440,148 L1440,200 L0,200 Z"); }
              }
              .footer-wave-1 { animation: footerWave1Anim 8s ease-in-out infinite; }
              .footer-wave-2 { animation: footerWave2Anim 6s ease-in-out infinite; }
              .footer-wave-3 { animation: footerWave3Anim 4.5s ease-in-out infinite; }
              .footer-wave-4 { animation: footerWave4Anim 3.5s ease-in-out infinite; }
            `}</style>
          </defs>

          <path className="footer-wave-1" d={WAVE1} fill="url(#footerWave1)" fillOpacity="0.35" />
          <path className="footer-wave-2" d={WAVE2} fill="url(#footerWave1)" fillOpacity="0.5" />
          <path className="footer-wave-3" d={WAVE3} fill="url(#footerWave2)" fillOpacity="0.7" />
          <path className="footer-wave-4" d={WAVE4} fill="url(#footerWave3)" />
        </svg>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-primary/40"
              style={{ left: `${12 + i * 14}%`, bottom: `${25 + (i % 3) * 18}%` }}
              animate={{ y: [0, -22, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
              transition={{ duration: 2.4 + i * 0.35, ease: "easeInOut", repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative bg-gradient-to-b from-[hsl(222,47%,12%)] via-[hsl(220,50%,10%)] to-[hsl(222,52%,8%)]">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Top glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(var(--brand-1) / 0.5), hsl(var(--brand-3) / 0.6), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">

            {/* Column 1: Branding + tagline */}
            <div className="flex flex-col gap-5">
              <Link to="/" aria-label="NZ-web — לדף הבית">
                <motion.div
                  className="flex items-center gap-2.5 text-3xl font-black tracking-tight text-white font-heebo"
                  style={{ letterSpacing: "-0.02em" }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl text-sm text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--brand-1)), hsl(var(--brand-2)) 55%, hsl(var(--brand-3)))",
                      boxShadow: "0 8px 24px -8px hsl(var(--brand-2) / 0.7)",
                    }}
                    aria-hidden="true"
                  >
                    N
                  </span>
                  NZ
                  <span className="text-gradient-brand">-web</span>
                </motion.div>
              </Link>
              <p className="text-sm leading-relaxed text-white/50 italic font-heebo">
                {footerSettings.tagline}
              </p>

              {/* Social */}
              {socialIcons.length > 0 && (
                <div className="flex gap-2.5 pt-1">
                  {socialIcons.map(({ key, url, icon: Icon, label }) => {
                    const hasUrl = url && url.trim() !== "";
                    const cls =
                      "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/60 transition-all duration-200 hover:border-primary/30 hover:bg-primary/20 hover:text-primary";
                    return hasUrl ? (
                      <motion.a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={{ scale: 1.15, y: -2 }}
                        className={cls}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    ) : (
                      <motion.span
                        key={key}
                        aria-label={label}
                        whileHover={{ scale: 1.15, y: -2 }}
                        className={cls + " cursor-default"}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.span>
                    );
                  })}
                </div>
              )}

              {/* Animated dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1 w-1 rounded-full bg-primary/40"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-4">
              <h3 className="font-heebo text-sm font-bold uppercase tracking-widest text-white/40">
                ניווט
              </h3>
              <nav aria-label="ניווט בפוטר">
                <ul className="space-y-2">
                  {navigationLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="group inline-flex items-center gap-1.5 py-1.5 font-heebo text-sm text-white/70 transition-all duration-200 hover:text-white"
                      >
                        <ArrowLeft className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-4">
              <h3 className="font-heebo text-sm font-bold uppercase tracking-widest text-white/40">
                מידע ונגישות
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={`group inline-flex items-center gap-1.5 py-1.5 font-heebo text-sm transition-all duration-200 hover:text-white ${
                        link.highlight
                          ? "font-semibold text-amber-400/90 hover:text-amber-300"
                          : "text-white/70"
                      }`}
                    >
                      <ArrowLeft className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-4">
              <h3 className="font-heebo text-sm font-bold uppercase tracking-widest text-white/40">
                בואו נדבר
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={getTelHref(contact.phone)}
                    className="inline-flex items-center gap-2.5 font-heebo text-sm text-white/65 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-primary/70" />
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={getMailtoHref(contact.email)}
                    className="inline-flex items-center gap-2.5 font-heebo text-sm text-white/65 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-primary/70" />
                    {contact.email}
                  </a>
                </li>
              </ul>

              {/* WhatsApp */}
              <motion.button
                onClick={handleWhatsAppClick}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(142,70%,38%)] px-4 py-2.5 font-heebo text-sm font-bold text-white shadow-lg transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(22,163,74,0.35)]"
              >
                <MessageCircle className="h-4 w-4" />
                וואטסאפ
              </motion.button>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/[0.08] pt-8">
            <div className="flex flex-col items-center gap-3 text-center">
              {/* SEO links */}
              <p className="font-heebo text-xs text-white/25">
                <span className="text-white/20">שירותים: </span>
                {[
                  { label: "בניית אתרים", href: "/services/web-development/" },
                  { label: "פיתוח אתרים", href: "/services/website-development/" },
                  { label: "אתר תדמית", href: "/services/business-website/" },
                  { label: "מערכת תורים", href: "/services/appointment-system/" },
                  { label: "דפי נחיתה", href: "/services/landing-page-development/" },
                ].map((s, i, arr) => (
                  <span key={s.href}>
                    <Link to={s.href} className="transition-colors hover:text-white/50">
                      {s.label}
                    </Link>
                    {i < arr.length - 1 && (
                      <span className="mx-1.5 text-white/15">·</span>
                    )}
                  </span>
                ))}
              </p>

              <p className="font-heebo text-sm text-white/50">
                © {new Date().getFullYear()} {footerSettings.copyrightText}
              </p>
              <p className="font-heebo text-xs text-white/30">
                עוצב ופותח עם ❤️ בישראל
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
