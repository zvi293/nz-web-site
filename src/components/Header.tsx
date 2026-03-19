import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "שירותים", href: "#services", type: "hash" },
  { label: "פרויקטים", href: "#portfolio", type: "hash" },
  { label: "מי אנחנו", href: "/about", type: "route" },
  { label: "צור קשר", href: "/contact", type: "route" },
];

const menuItems = [
  { label: "ראשי", href: "/", type: "route" },
  { label: "מי אנחנו", href: "/about", type: "route" },
  { label: "פרויקטים", href: "/projects", type: "route" },
  { label: "שאלות נפוצות", href: "/faq", type: "route" },
  { label: "צור קשר", href: "/contact", type: "route" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (logoRef.current) {
        tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.6 });
      }

      const navItems = navRef.current ? Array.from(navRef.current.children) : [];
      if (navItems.length > 0) {
        tl.from(navItems, { y: -20, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <header dir="rtl" className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-500 border-b ${
          scrolled
            ? "bg-background/70 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_1px_30px_-4px_hsl(var(--primary)/0.1)] border-border/40"
            : "bg-background/20 backdrop-blur-xl border-transparent shadow-none"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          {/* Logo */}
          <a
            ref={logoRef}
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === "/") {
                window.scrollTo({ top: 0 });
              } else {
                navigate("/");
                setTimeout(() => window.scrollTo({ top: 0 }), 50);
              }
            }}
            className="text-xl md:text-2xl font-black tracking-tight text-foreground cursor-pointer"
            style={{ fontFamily: "'Heebo', sans-serif", letterSpacing: "-0.02em" }}
          >
            NZ<span className="text-gradient-brand">-web</span>
          </a>

          {/* Nav */}
          <nav ref={navRef} className="flex items-center gap-3 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (link.type === "route") {
                    navigate(link.href);
                    return;
                  }
                  if (link.href === "#portfolio") {
                    if (location.pathname === "/") {
                      scrollToSelectorWithRetry(link.href);
                    } else {
                      navigate("/", {
                        state: {
                          scrollTo: "#portfolio",
                          scrollNonce: Date.now(),
                        },
                      });
                    }
                    return;
                  }

                  const isHomePage = location.pathname === "/";
                  if (isHomePage) {
                    scrollToSelectorWithRetry(link.href);
                  } else {
                    navigate("/" + link.href);
                  }
                }}
                className="nav-link-hover relative font-rubik text-[12px] md:text-[17px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground pb-1 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Theme Toggle & Hamburger Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Hamburger Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <motion.button
                  className="relative p-2.5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl border border-primary/15 shadow-[0_2px_20px_-4px_hsl(var(--primary)/0.15)] hover:shadow-[0_4px_30px_-4px_hsl(var(--primary)/0.25)] hover:border-primary/30 transition-all duration-300 w-11 h-11 flex items-center justify-center group overflow-hidden"
                  aria-label="תפריט"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col gap-[5px] items-end justify-center">
                    <motion.span
                      className="block h-[2.5px] rounded-full bg-foreground origin-center"
                      animate={isMenuOpen ? { rotate: 45, y: 7.5, width: 20 } : { rotate: 0, y: 0, width: 20 }}
                      transition={{ duration: 0.35, ease: "backOut" }}
                    />
                    <motion.span
                      className="block h-[2.5px] rounded-full bg-primary origin-center"
                      animate={isMenuOpen ? { opacity: 0, x: 12 } : { opacity: 1, x: 0, width: 14 }}
                      transition={{ duration: 0.25 }}
                    />
                    <motion.span
                      className="block h-[2.5px] rounded-full bg-foreground origin-center"
                      animate={isMenuOpen ? { rotate: -45, y: -7.5, width: 20 } : { rotate: 0, y: 0, width: 17 }}
                      transition={{ duration: 0.35, ease: "backOut" }}
                    />
                  </div>
                </motion.button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 border-l-0">
                <SheetHeader>
                  <SheetTitle className="text-right text-white">תפריט</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8" dir="rtl">
                  {menuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        if (item.type === "route") {
                          navigate(item.href);
                          return;
                        }
                        if (item.href === "#") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          const target = document.querySelector(item.href);
                          if (target) {
                            const headerOffset = window.innerWidth < 768 ? 56 : 100;
                            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                            window.scrollTo({ top, behavior: "smooth" });
                          }
                        }
                      }}
                      className="text-lg font-medium text-white/90 hover:text-emerald-400 transition-colors py-3 border-b border-white/10"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="md:hidden pt-4 border-t border-white/10">
                    <ThemeToggle />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
