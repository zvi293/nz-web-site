import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Facebook, Instagram, Linkedin, Twitter, Github, Youtube } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings-api";
import { getMailtoHref, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";

const backWavePaths = [
  "M0,60 C120,100 240,40 480,80 C720,120 960,30 1200,70 C1320,90 1380,60 1440,80 L1440,200 L0,200 Z",
  "M0,90 C120,40 360,110 540,60 C720,10 900,100 1100,50 C1300,0 1380,80 1440,60 L1440,200 L0,200 Z",
  "M0,50 C200,110 400,20 600,90 C800,160 1000,40 1200,100 C1350,130 1400,70 1440,90 L1440,200 L0,200 Z",
  "M0,60 C120,100 240,40 480,80 C720,120 960,30 1200,70 C1320,90 1380,60 1440,80 L1440,200 L0,200 Z",
];

const middleWavePaths = [
  "M0,100 C180,60 360,130 600,80 C840,30 1020,110 1200,70 C1320,50 1400,90 1440,100 L1440,200 L0,200 Z",
  "M0,70 C180,120 400,50 600,110 C800,170 1000,60 1200,110 C1350,140 1400,80 1440,70 L1440,200 L0,200 Z",
  "M0,110 C150,50 350,120 550,70 C750,20 950,100 1150,60 C1300,30 1400,100 1440,110 L1440,200 L0,200 Z",
  "M0,100 C180,60 360,130 600,80 C840,30 1020,110 1200,70 C1320,50 1400,90 1440,100 L1440,200 L0,200 Z",
];

const frontMiddleWavePaths = [
  "M0,130 C200,100 400,160 650,120 C900,80 1050,150 1250,110 C1350,90 1400,130 1440,130 L1440,200 L0,200 Z",
  "M0,110 C200,150 380,90 600,140 C820,190 1000,100 1200,140 C1350,160 1400,110 1440,120 L1440,200 L0,200 Z",
  "M0,140 C160,100 340,150 560,110 C780,70 960,140 1180,100 C1320,80 1400,130 1440,140 L1440,200 L0,200 Z",
  "M0,130 C200,100 400,160 650,120 C900,80 1050,150 1250,110 C1350,90 1400,130 1440,130 L1440,200 L0,200 Z",
];

const frontWavePaths = [
  "M0,155 C160,130 320,170 520,145 C720,120 880,165 1080,140 C1240,120 1360,155 1440,150 L1440,200 L0,200 Z",
  "M0,140 C160,170 340,125 520,155 C700,185 880,130 1080,160 C1240,180 1360,140 1440,145 L1440,200 L0,200 Z",
  "M0,160 C180,130 360,165 540,135 C720,105 900,155 1100,130 C1280,110 1380,155 1440,160 L1440,200 L0,200 Z",
  "M0,155 C160,130 320,170 520,145 C720,120 880,165 1080,140 C1240,120 1360,155 1440,150 L1440,200 L0,200 Z",
];

const Footer = () => {
  const { settings: siteSettings } = useSiteSettings();
  const { contact, social, footer: footerSettings, socialVisibility } = siteSettings;

  const allSocialIcons = [
  { key: "facebook", url: social.facebook, icon: Facebook, label: "Facebook", alwaysShow: true },
  { key: "instagram", url: social.instagram, icon: Instagram, label: "Instagram", alwaysShow: false },
  { key: "linkedin", url: social.linkedin, icon: Linkedin, label: "LinkedIn", alwaysShow: false },
  { key: "twitter", url: social.twitter, icon: Twitter, label: "Twitter / X", alwaysShow: false },
  { key: "github", url: social.github, icon: Github, label: "GitHub", alwaysShow: false },
  { key: "youtube", url: social.youtube, icon: Youtube, label: "YouTube", alwaysShow: false }];

  const socialIcons = allSocialIcons.filter((s) => {
    const visible = socialVisibility?.[s.key as keyof typeof socialVisibility] ?? true;
    return visible && (s.alwaysShow || s.url && s.url.trim() !== "");
  });

  const navigationLinks = [
  { label: "ראשי", href: "/" },
  { label: "מי אנחנו", href: "/about" },
  { label: "פרויקטים", href: "/projects" },
  { label: "שירותים", href: "/#services" },
  { label: "שאלות נפוצות", href: "/faq" },
  { label: "צור קשר", href: "/contact" }];


  const legalLinks = [
  { label: "הצהרת נגישות", href: "/accessibility", highlight: true },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "תנאי שימוש", href: "/terms" }];


  const handleWhatsAppClick = () => {
    window.open(getWhatsAppHref(contact), "_blank");
  };

  return (
    <footer className="relative w-full overflow-hidden" dir="rtl">
      {/* Beautiful Flowing Waves */}
      <div className="relative h-28 md:h-40 bg-background">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg">
          
          <defs>
            <linearGradient id="wave1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220, 25%, 75%)" />
              <stop offset="50%" stopColor="hsl(210, 30%, 80%)" />
              <stop offset="100%" stopColor="hsl(220, 25%, 75%)" />
            </linearGradient>
            <linearGradient id="wave2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(215, 28%, 70%)" />
              <stop offset="50%" stopColor="hsl(220, 25%, 72%)" />
              <stop offset="100%" stopColor="hsl(215, 28%, 70%)" />
            </linearGradient>
            <linearGradient id="wave3Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220, 30%, 65%)" />
              <stop offset="100%" stopColor="hsl(215, 28%, 60%)" />
            </linearGradient>
            <linearGradient id="wave4Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(218, 30%, 62%)" />
              <stop offset="100%" stopColor="hsl(220, 28%, 58%)" />
            </linearGradient>
          </defs>
          
          {/* Back wave - slowest */}
          <motion.path
            d={backWavePaths[0]}
            fill="url(#wave1Gradient)"
            fillOpacity="0.35"
            animate={{
              d: backWavePaths
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity
            }} />
          
          {/* Second wave */}
          <motion.path
            d={middleWavePaths[0]}
            fill="url(#wave2Gradient)"
            fillOpacity="0.5"
            animate={{
              d: middleWavePaths
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity
            }} />
          
          {/* Third wave */}
          <motion.path
            d={frontMiddleWavePaths[0]}
            fill="url(#wave3Gradient)"
            fillOpacity="0.7"
            animate={{
              d: frontMiddleWavePaths
            }}
            transition={{
              duration: 4.5,
              ease: "easeInOut",
              repeat: Infinity
            }} />

          {/* Front wave - fastest */}
          <motion.path
            d={frontWavePaths[0]}
            fill="url(#wave4Gradient)"
            animate={{
              d: frontWavePaths
            }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              repeat: Infinity
            }} />
          
        </svg>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) =>
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${10 + i * 11}%`,
              bottom: `${20 + i % 4 * 15}%`
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 2.5 + i * 0.4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.3
            }} />
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative bg-gradient-to-b from-[hsl(220,30%,65%)] via-[hsl(218,28%,58%)] to-[hsl(215,30%,52%)]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            
            {/* Column 1: Navigation */}
            <div className="space-y-3">
              <h3 className="font-heebo text-xl font-bold text-white flex items-center gap-2">
                
                ניווט באתר
              </h3>
              <nav aria-label="ניווט בפוטר">
                <ul className="space-y-2.5">
                  {navigationLinks.map((link) =>
                  <li key={link.href}>
                      <Link
                      to={link.href}
                      className="inline-block font-heebo text-base text-white/80 transition-all duration-200 hover:text-white hover:translate-x-[-4px]">
                      
                        {link.label}
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Social Links */}
              {socialIcons.length > 0 &&
              <div className="flex gap-3 pt-3 border-t border-white/10">
                  {socialIcons.map(({ key, url, icon: Icon, label }) => {
                  const hasUrl = url && url.trim() !== "";
                  const classes = "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white";
                  return hasUrl ?
                  <motion.a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className={classes}>
                    
                        <Icon className="h-4 w-4" />
                      </motion.a> :

                  <motion.span
                    key={key}
                    aria-label={label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className={classes + " cursor-default"}>
                    
                        <Icon className="h-4 w-4" />
                      </motion.span>;

                })}
                </div>
              }
            </div>

            {/* Column 2: Legal & Accessibility */}
            <div className="space-y-3">
              <h3 className="font-heebo text-xl font-bold text-white">
                מידע ונגישות
              </h3>
              <ul className="space-y-2.5">
                {legalLinks.map((link) =>
                <li key={link.href}>
                    <Link
                    to={link.href}
                    className={`inline-block font-heebo transition-all duration-200 hover:translate-x-[-4px] ${
                    link.highlight ?
                    "text-yellow-300 font-semibold hover:text-yellow-200 underline underline-offset-4" :
                    "text-white/80 hover:text-white"}`
                    }>
                    
                      {link.label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-3">
              <h3 className="font-heebo text-xl font-bold text-white">
                בואו נדבר
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={getTelHref(contact.phone)}
                    className="inline-flex items-center gap-2 font-heebo text-base text-white/80 transition-colors hover:text-white">
                    
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={getMailtoHref(contact.email)}
                    className="inline-flex items-center gap-2 font-heebo text-base text-white/80 transition-colors hover:text-white">
                    
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </a>
                </li>
              </ul>

              {/* WhatsApp Button */}
              <motion.button
                onClick={handleWhatsAppClick}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-[hsl(142,70%,45%)] px-4 py-2 font-heebo text-sm font-bold text-white shadow-lg transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.4)]">
                
                <MessageCircle className="h-5 w-5" />
                אנחנו איתך גם בוואטסאפ
              </motion.button>
            </div>

            {/* Column 4: Branding */}
            <div className="flex flex-col items-start space-y-4 lg:items-end">
              <Link to="/">
                <motion.div
                  className="text-3xl font-bold text-white font-rubik tracking-tight"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  
                  NZ
                  <span className="text-yellow-300">-</span>
                  WEB
                </motion.div>
              </Link>
              <p className="font-heebo text-sm text-white/60 italic">
                {footerSettings.tagline}
              </p>
              
              {/* Animated dots */}
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2, 3, 4].map((i) =>
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white/40"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15
                  }} />

                )}
              </div>

              {/* Admin Link */}
              <Link
                to="/admin/portfolio"
                className="mt-3 font-heebo text-xs text-white/20 transition-colors duration-200 hover:text-white/50">
                
                ניהול
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-3 border-t border-white/20 pt-3">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="font-heebo text-base text-white/70">
                © {new Date().getFullYear()} {footerSettings.copyrightText}
              </p>
              <p className="font-heebo text-sm text-white/50">
                עוצב ופותח עם ❤️ בישראל
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;
