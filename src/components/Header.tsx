import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import { MessageCircle, ChevronDown, Monitor, Briefcase, CalendarDays, Target, Code2, Globe, Menu, ArrowLeft, Package } from "lucide-react";
import { contactInfo, getWhatsAppHref } from "@/lib/contact-utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ── Service links shown in dropdown ── */
const serviceLinks = [
  { label: "בניית אתרים מקצועיים", href: "/services/web-development/", icon: Monitor, desc: "Full-Stack, React, ביצועים גבוהים" },
  { label: "פיתוח אתרים", href: "/services/website-development/", icon: Code2, desc: "ארכיטקטורה, API, מערכות מורכבות" },
  { label: "אתר תדמית לעסקים", href: "/services/business-website/", icon: Briefcase, desc: "ייצוג מקצועי שממיר לידים" },
  { label: "מערכת ניהול תורים", href: "/services/appointment-system/", icon: CalendarDays, desc: "הזמנות אונליין ואוטומציה" },
  { label: "דפי נחיתה", href: "/services/landing-page-development/", icon: Target, desc: "ממירים גולשים ללקוחות" },
  { label: "React Development", href: "/services/react-development/", icon: Globe, desc: "אפליקציות React מתקדמות" },
];

const navLinks = [
  { label: "שירותים", href: "/services/", type: "services" }, // special type
  { label: "חבילות", href: "#pricing", type: "hash" },
  { label: "פרויקטים", href: "#portfolio", type: "hash" },
  { label: "מי אנחנו", href: "/about/", type: "route" },
  { label: "שאלות נפוצות", href: "/faq/", type: "route" },
];

/* The one quick link kept inline in the mobile bar. Everything else — שירותים,
   אודות and the rest — lives in the drawer, so the bar stays uncrowded on a
   360px screen. Freeing that space is what pays for the chip treatment below. */
const mobileNavLinks = [
  { label: "חבילות", href: "/#pricing", icon: Package },
];

const menuItems = [
  { label: "ראשי", href: "/", type: "route" },
  { label: "שירותים", href: "/services/", type: "route" },
  { label: "מי אנחנו", href: "/about/", type: "route" },
  { label: "פרויקטים", href: "/projects/", type: "route" },
  { label: "חבילות", href: "/packages/", type: "route" },
  { label: "שאלות נפוצות", href: "/faq/", type: "route" },
  { label: "בלוג", href: "/blog/", type: "route" },
  { label: "צור קשר", href: "/contact/", type: "route" },
];

/* ── Wordmark ── */
const Wordmark = ({ compact = false }: { compact?: boolean }) => (
  /* dir="ltr" is load-bearing: the brand is a Latin string sitting inside an RTL
     page. Left to inherit, the bidi algorithm reorders "NZ" and "-web" and the
     logo reads "web-NZ". A flex/grid wrapper here would break it the same way,
     because each child becomes a separately-ordered box — keep this inline. */
  <span
    dir="ltr"
    className={`inline-block font-black tracking-tight text-foreground ${compact ? "text-lg" : "text-[27px]"}`}
    style={{ fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.03em" }}
  >
    NZ<span className="text-gradient-brand">-web</span>
  </span>
);

/* ── Services Dropdown ── */
const ServicesDropdown = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong absolute top-full left-1/2 z-50 mt-3 w-[540px] -translate-x-1/2 overflow-hidden rounded-3xl"
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--brand-2) / 0.7), hsl(var(--brand-3) / 0.7), transparent)" }}
      />

      <div className="p-4">
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          השירותים שלנו
        </p>
        {/* Anchors, not buttons: these six are the primary internal links to the
            service pages. A crawler cannot follow an onClick handler, and a
            keyboard user cannot Tab to a link that does not exist. */}
        <div className="grid grid-cols-2 gap-1.5">
          {serviceLinks.map((svc) => {
            const Icon = svc.icon;
            return (
              <a
                key={svc.href}
                href={svc.href}
                onClick={(e) => { e.preventDefault(); navigate(svc.href); onClose(); }}
                className="group flex items-start gap-3 rounded-2xl p-3 text-right transition-all duration-200 hover:bg-primary/[0.07] focus-visible:bg-primary/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-1/12 to-brand-3/12 transition-all duration-300 group-hover:from-brand-1/25 group-hover:to-brand-3/25 group-hover:scale-105">
                  <Icon aria-hidden="true" className="h-4 w-4 text-primary" strokeWidth={1.9} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {svc.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-3 border-t border-border/40 pt-3">
          <a
            href="/contact/"
            onClick={(e) => { e.preventDefault(); navigate("/contact/"); onClose(); }}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/[0.08] py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            לא בטוחים איזה שירות? דברו איתנו
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setServicesOpen(false); }, [location.pathname]);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      /* clearProps strips the inline opacity/transform once each tween lands —
         without it a killed or never-ticked tween leaves the whole nav at
         opacity 0, i.e. an invisible menu. */
      if (logoRef.current) {
        tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.6, clearProps: "opacity,transform" });
      }
      const navItems = navRef.current ? Array.from(navRef.current.children) : [];
      if (navItems.length > 0) {
        tl.from(
          navItems,
          { y: -20, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: "opacity,transform" },
          "-=0.3",
        );
      }
    });

    /* Belt and braces: the navigation must be on screen no matter what happens
       to the animation frame loop. */
    const failsafe = window.setTimeout(() => {
      if (tl && tl.progress() < 1) tl.progress(1);
    }, 2200);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: { label: string; href: string; type: string },
  ) => {
    e.preventDefault();
    if (link.type === "route") { navigate(link.href); return; }
    if (link.href === "#portfolio") {
      if (location.pathname === "/") { scrollToSelectorWithRetry(link.href); }
      else { navigate("/", { state: { scrollTo: "#portfolio", scrollNonce: Date.now() } }); }
      return;
    }
    if (location.pathname === "/") { scrollToSelectorWithRetry(link.href); }
    else { navigate("/" + link.href); }
  };

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.pathname === "/") window.scrollTo({ top: 0 });
    else { navigate("/"); setTimeout(() => window.scrollTo({ top: 0 }), 50); }
  };

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-50 px-3 pt-2 md:px-5 md:pt-3">
      <div
        /* nz-header-shell is a hook for index.css, which swaps the backdrop-blur
           for a flat fill on phones — a blurred bar over moving content is the
           single most expensive thing on a scrolling mobile page. */
        className={`nz-header-shell mx-auto max-w-7xl rounded-2xl transition-all duration-500 md:rounded-[1.35rem] ${
          scrolled
            ? "glass-strong border border-border/50 shadow-elevated"
            : "border border-transparent bg-background/45 backdrop-blur-md"
        }`}
      >
        {/* ── Desktop ── */}
        <div
          className={`hidden md:flex items-center justify-between gap-4 px-4 transition-all duration-500 lg:px-5 ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          {/* Logo */}
          <a
            ref={logoRef}
            href="/"
            onClick={goHome}
            className="shrink-0 cursor-pointer select-none"
            aria-label="NZ-web — לדף הבית"
          >
            <Wordmark />
          </a>

          {/* Centre nav */}
          <nav ref={navRef} className="flex items-center gap-1 rounded-full border border-border/40 bg-secondary/40 px-1.5 py-1 lg:gap-1.5">
            {navLinks.map((link) => {
              /* Services — dropdown trigger */
              if (link.type === "services") {
                return (
                  <div
                    key="services"
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    /* Focus mirrors hover, so the panel is reachable with Tab and
                       closes on Escape. It used to open on hover only, which meant
                       a keyboard user could never reach the six service links. */
                    onFocus={() => setServicesOpen(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && servicesOpen) {
                        e.preventDefault();
                        setServicesOpen(false);
                        servicesTriggerRef.current?.focus();
                      }
                    }}
                  >
                    <a
                      ref={servicesTriggerRef}
                      href="/services/"
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      onClick={(e) => { e.preventDefault(); navigate("/services/"); setServicesOpen(false); }}
                      className={`relative flex items-center gap-1 rounded-full px-3.5 py-2 font-rubik text-[13.5px] font-medium tracking-wide transition-all duration-200 lg:text-[14.5px] ${
                        servicesOpen
                          ? "bg-background text-foreground shadow-soft"
                          : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                      }`}
                    >
                      שירותים
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </a>
                    <AnimatePresence>
                      {servicesOpen && (
                        <ServicesDropdown onClose={() => setServicesOpen(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              /* Regular links */
              const isActive = link.type === "route" && location.pathname.startsWith(link.href.replace(/\/$/, ""));
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`relative rounded-full px-3.5 py-2 font-rubik text-[13.5px] font-medium tracking-wide transition-all duration-200 lg:text-[14.5px] ${
                    isActive
                      ? "bg-background text-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/contact/"
              onClick={(e) => { e.preventDefault(); navigate("/contact/"); }}
              className="btn-brand group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold hover:scale-[1.04] active:scale-[0.97]"
            >
              <MessageCircle className="h-4 w-4" />
              בואו נדבר
            </a>
            <ThemeToggle />
            {/* Full-menu trigger — opens the same Sheet as mobile (blog, about, all pages) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="פתח תפריט מלא"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-secondary/40 text-foreground transition-all duration-200 hover:scale-105 hover:border-primary/35 hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Mobile ──
            Order (RTL, right → left): logo · חבילות · CTA · menu */}
        <div className="flex md:hidden items-center justify-between gap-0.5 px-2 py-2 xs:gap-1 xs:px-2.5">
          {/* Logo */}
          <a
            href="/"
            onClick={goHome}
            className="shrink-0 cursor-pointer select-none"
            aria-label="NZ-web — לדף הבית"
          >
            <Wordmark compact />
          </a>

          {/* Quick link — the one destination people actually reach for, drawn as
              a branded chip. As 10.5px muted text it disappeared next to the logo
              and the CTA; now it reads as a tappable target (and clears the 44px
              touch height). Everything else lives in the drawer. */}
          {/* Sized by its content, not flex-1 — a growing nav box would let the
              labels spill over the logo and the CTA on 360px screens. */}
          <nav className="flex shrink-0 items-center gap-1">
            {mobileNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href.includes("#")) {
                      const hash = `#${link.href.split("#")[1]}`;
                      if (location.pathname === "/") {
                        scrollToSelectorWithRetry(hash);
                      } else {
                        navigate("/", { state: { scrollTo: hash, scrollNonce: Date.now() } });
                      }
                    } else {
                      navigate(link.href);
                    }
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/30 bg-primary/[0.09] px-2.5 py-2 text-[12px] font-extrabold text-primary transition-all duration-200 active:scale-[0.97] xs:px-3.5 xs:text-[13px]"
                  style={{ boxShadow: "0 2px 10px -5px hsl(var(--brand-2) / 0.55)" }}
                >
                  <Icon aria-hidden="true" className="h-[15px] w-[15px] shrink-0" strokeWidth={2.5} />
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile CTA + hamburger */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="/contact/"
              onClick={(e) => { e.preventDefault(); navigate("/contact/"); }}
              /* Matches the חבילות chip's type scale and height — the two sat at
                 different sizes and the bar looked unbalanced. */
              className="btn-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-bold xs:px-3.5 xs:text-[13px]"
            >
              <MessageCircle className="h-[15px] w-[15px] shrink-0" />
              בואו נדבר
            </a>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.button
                  /* rounded-full so the bar reads as one family of pills. */
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-secondary/40 transition-all"
                  aria-label="תפריט"
                  whileTap={{ scale: 0.94 }}
                >
                  <div className="flex flex-col items-end justify-center gap-[4.5px]">
                    <motion.span className="block h-[2px] rounded-full bg-foreground"
                      animate={isMenuOpen ? { rotate: 45, y: 6.5, width: 18 } : { rotate: 0, y: 0, width: 18 }}
                      transition={{ duration: 0.3, ease: "backOut" }}
                    />
                    <motion.span className="block h-[2px] rounded-full bg-primary"
                      animate={isMenuOpen ? { opacity: 0 } : { opacity: 1, width: 12 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span className="block h-[2px] rounded-full bg-foreground"
                      animate={isMenuOpen ? { rotate: -45, y: -6.5, width: 18 } : { rotate: 0, y: 0, width: 15 }}
                      transition={{ duration: 0.3, ease: "backOut" }}
                    />
                  </div>
                </motion.button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[320px] max-w-[88vw] overflow-y-auto border-l-0 p-5 text-white"
                style={{
                  background:
                    "linear-gradient(160deg, hsl(226 48% 9%) 0%, hsl(230 52% 12%) 45%, hsl(200 60% 12%) 100%)",
                }}
              >
                {/* ambient brand glow inside the drawer */}
                <div
                  className="pointer-events-none absolute -top-24 left-[-20%] h-64 w-64 rounded-full blur-[80px]"
                  style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.4), transparent 70%)" }}
                  aria-hidden="true"
                />

                <SheetHeader className="relative">
                  <SheetTitle dir="ltr" className="text-right font-heebo text-xl font-black text-white">
                    NZ<span style={{ color: "hsl(var(--brand-3))" }}>-web</span>
                  </SheetTitle>
                  <SheetDescription className="text-right text-sm text-white/55">
                    תפריט ניווט — כל העמודים והשירותים של NZ-web
                  </SheetDescription>
                </SheetHeader>

                <nav className="relative mt-5 flex flex-col gap-0.5" dir="rtl">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate(item.href); }}
                      className="group flex items-center justify-between rounded-xl px-4 py-3 font-heebo text-[15px] font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                      <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-70" />
                    </a>
                  ))}

                  {/* Services sub-section */}
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-white/40">השירותים שלנו</p>
                    {serviceLinks.map((svc) => {
                      const Icon = svc.icon;
                      return (
                        <a
                          key={svc.href}
                          href={svc.href}
                          onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate(svc.href); }}
                          className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all hover:bg-white/10"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07]">
                            <Icon className="h-4 w-4" style={{ color: "hsl(var(--brand-3))" }} strokeWidth={1.8} />
                          </span>
                          <span className="font-heebo text-sm text-white/80">{svc.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </nav>

                <div className="relative mt-6 flex flex-col gap-2.5">
                  <a
                    href="/contact/"
                    onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate("/contact/"); }}
                    className="btn-brand flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-heebo text-base font-bold"
                  >
                    <MessageCircle className="h-5 w-5" />
                    בואו נדבר
                  </a>
                  <a
                    href={getWhatsAppHref(contactInfo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 font-heebo text-sm font-bold text-white/90 transition-all hover:bg-white/[0.12]"
                  >
                    וואטסאפ מהיר
                  </a>
                </div>

                <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="font-heebo text-xs font-semibold text-white/60">מצב תצוגה</span>
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
