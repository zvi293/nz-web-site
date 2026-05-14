import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import { MessageCircle, ChevronDown, Monitor, Briefcase, CalendarDays, Target, Code2, Globe, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/* ── Service links shown in dropdown ── */
const serviceLinks = [
  { label: "בניית אתרים מקצועיים", href: "/services/web-development", icon: Monitor, desc: "Full-Stack, React, ביצועים גבוהים" },
  { label: "פיתוח אתרים", href: "/services/website-development", icon: Code2, desc: "ארכיטקטורה, API, מערכות מורכבות" },
  { label: "אתר תדמית לעסקים", href: "/services/business-website", icon: Briefcase, desc: "ייצוג מקצועי שממיר לידים" },
  { label: "מערכת ניהול תורים", href: "/services/appointment-system", icon: CalendarDays, desc: "הזמנות אונליין ואוטומציה" },
  { label: "דפי נחיתה", href: "/services/landing-page-development", icon: Target, desc: "ממירים גולשים ללקוחות" },
  { label: "React Development", href: "/services/react-development", icon: Globe, desc: "אפליקציות React מתקדמות" },
];

const navLinks = [
  { label: "שירותים", href: "/services", type: "services" }, // special type
  { label: "פרויקטים", href: "#portfolio", type: "hash" },
  { label: "מי אנחנו", href: "/about", type: "route" },
  { label: "שאלות נפוצות", href: "/faq", type: "route" },
];

const menuItems = [
  { label: "ראשי", href: "/", type: "route" },
  { label: "מי אנחנו", href: "/about", type: "route" },
  { label: "פרויקטים", href: "/projects", type: "route" },
  { label: "שאלות נפוצות", href: "/faq", type: "route" },
  { label: "בלוג", href: "/blog", type: "route" },
  { label: "צור קשר", href: "/contact", type: "route" },
];

const mobileNavLinks = [
  { label: "שירותים", href: "/services", type: "route" },
  { label: "פרויקטים", href: "/projects", type: "route" },
  { label: "אודות", href: "/about", type: "route" },
];

/* ── Services Dropdown ── */
const ServicesDropdown = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full left-1/2 z-50 mt-2 w-[520px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl"
      style={{ boxShadow: "0 20px 60px -12px hsl(var(--primary)/0.12), 0 4px 16px -4px hsl(var(--foreground)/0.08)" }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="p-4">
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          השירותים שלנו
        </p>
        <div className="grid grid-cols-2 gap-2">
          {serviceLinks.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.href}
                onClick={() => { navigate(svc.href); onClose(); }}
                className="group flex items-start gap-3 rounded-xl p-3 text-right transition-all duration-200 hover:bg-primary/[0.06]"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {svc.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-3 border-t border-border/40 pt-3">
          <button
            onClick={() => { navigate("/contact"); onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/[0.08] py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/[0.14]"
          >
            <MessageCircle className="h-4 w-4" />
            לא בטוחים איזה שירות? דברו איתנו
          </button>
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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (logoRef.current) tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.6 });
      const navItems = navRef.current ? Array.from(navRef.current.children) : [];
      if (navItems.length > 0) tl.from(navItems, { y: -20, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");
    });
    return () => ctx.revert();
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

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-500 border-b ${
          scrolled
            ? "bg-background/75 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_1px_30px_-4px_hsl(var(--primary)/0.1)] border-border/40"
            : "bg-background/20 backdrop-blur-xl border-transparent"
        }`}
      >
        {/* ── Desktop ── */}
        <div className="hidden md:flex container mx-auto items-center justify-between px-6 py-3">
          {/* Logo */}
          <a
            ref={logoRef}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === "/") window.scrollTo({ top: 0 });
              else { navigate("/"); setTimeout(() => window.scrollTo({ top: 0 }), 50); }
            }}
            className="text-2xl font-black tracking-tight text-foreground cursor-pointer select-none shrink-0"
            style={{ fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.02em" }}
          >
            NZ<span className="text-gradient-brand">-web</span>
          </a>

          {/* Centre nav */}
          <nav ref={navRef} className="flex items-center gap-6 lg:gap-8">
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
                  >
                    <button
                      onClick={() => { navigate("/services"); setServicesOpen(false); }}
                      className={`nav-link-hover relative flex items-center gap-1 pb-1 font-rubik text-[14px] font-medium tracking-wide transition-colors lg:text-[15px] ${
                        servicesOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      שירותים
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {servicesOpen && (
                        <ServicesDropdown onClose={() => setServicesOpen(false)} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              /* Regular links */
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="nav-link-hover relative pb-1 font-rubik text-[14px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground lg:text-[15px]"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); navigate("/contact"); }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97] btn-glow"
            >
              <MessageCircle className="h-4 w-4" />
              בואו נדבר
            </a>
            <ThemeToggle />
            {/* Full-menu trigger — opens the same Sheet as mobile (blog, about, all pages) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="פתח תפריט מלא"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 to-accent/10 text-foreground transition-all duration-200 hover:scale-105 hover:border-primary/30 hover:text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="flex md:hidden items-center justify-between px-3 py-2.5 gap-2">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === "/") window.scrollTo({ top: 0 });
              else { navigate("/"); setTimeout(() => window.scrollTo({ top: 0 }), 50); }
            }}
            className="text-lg font-black tracking-tight text-foreground cursor-pointer select-none shrink-0"
            style={{ fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.02em" }}
          >
            NZ<span className="text-gradient-brand">-web</span>
          </a>

          {/* Mobile nav links (always visible — short labels, no overflow) */}
          <nav className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
            {mobileNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                className="shrink-0 whitespace-nowrap rounded-lg px-2 py-1.5 text-[10.5px] font-semibold text-muted-foreground transition-colors hover:bg-primary/[0.07] hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile CTA + hamburger */}
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); navigate("/contact"); }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:brightness-110 btn-glow"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              בואו נדבר
            </a>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.button
                  className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl transition-all group"
                  aria-label="תפריט"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

              <SheetContent side="left" className="w-[300px] border-l-0 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-right font-heebo text-xl font-black text-white">
                    NZ<span className="text-yellow-300">-web</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-4 flex flex-col gap-1" dir="rtl">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate(item.href); }}
                      className="rounded-xl px-4 py-3 font-heebo text-base font-medium text-white/85 transition-all hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}

                  {/* Services sub-section */}
                  <div className="mt-3 border-t border-white/10 pt-3">
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
                          <Icon className="h-4 w-4 shrink-0 text-primary/80" strokeWidth={1.8} />
                          <span className="font-heebo text-sm text-white/75">{svc.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </nav>

                <div className="mt-5 px-1">
                  <a
                    href="/contact"
                    onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate("/contact"); }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-heebo text-base font-bold text-white shadow-lg transition-all hover:brightness-110"
                  >
                    <MessageCircle className="h-5 w-5" />
                    בואו נדבר
                  </a>
                </div>
                <div className="mt-4 px-1">
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
