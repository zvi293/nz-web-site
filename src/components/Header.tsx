import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { contactInfo, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import {
  Logo,
  WhatsAppCta,
  WhatsAppIcon,
  ArrowIcon,
  serviceNav,
  mainNav,
  mobileNav,
  studio,
  samePath,
} from "@/components/nz";

/* ── Services panel ("the mega panel") ─────────────────────────────────────
   A quiet bone room under the bar: the service pages as numbered serif rows,
   and — the signature touch — the hovered/focused service's artwork hung on
   the left with its museum label. Always in the DOM (hidden when closed) so
   the service links are crawlable; hidden art is display:none, so nothing is
   downloaded until the panel first opens. */
const ServicesPanel = ({
  id,
  open,
  onNavigate,
}: {
  id: string;
  open: boolean;
  onNavigate: () => void;
}) => {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const activate = (i: number) => {
    setActive(i);
    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
  };
  const current = serviceNav[active];

  return (
    <div id={id} className="nz-mega" hidden={!open}>
      <div className="nz-container nz-mega__grid">
        <div>
          <p className="nz-label mb-5">
            <span className="nz-label__index">שירותים</span>
            <span>בחרו חדר בגלריה</span>
          </p>
          <ul className="nz-mega__list">
            {serviceNav.map((svc, i) => (
              <li key={svc.href}>
                <Link
                  to={svc.href}
                  className={cn("nz-mega__item", i === active && "is-active")}
                  onPointerEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                  onClick={onNavigate}
                >
                  <span className="nz-mega__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="nz-mega__name">{svc.label}</span>
                  <span className="nz-mega__desc">{svc.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-4">
            <Link to="/services/" className="nz-link" onClick={onNavigate}>
              <span className="nz-link__text">לכל השירותים</span>
              <ArrowIcon className="nz-link__arrow" />
            </Link>
            <span className="text-sm text-graphite">לא בטוחים מה מתאים? כתבו לנו בוואטסאפ ונכוון אתכם.</span>
          </div>
        </div>

        <div className="nz-mega__preview" aria-hidden="true">
          <div className="nz-mega__stack">
            {serviceNav.map((svc, i) =>
              seen.has(i) && open ? (
                <div key={svc.art} aria-hidden={i !== active ? "true" : undefined}>
                  <Artwork slug={svc.art} sizes="(min-width: 1440px) 520px, 36vw" frame alt="" />
                </div>
              ) : null,
            )}
          </div>
          <MuseumLabel index={active + 1} prefix="מוצג" title={current.label} medium={`מתוך האוסף: ${getArt(current.art).title}`} />
        </div>
      </div>
    </div>
  );
};

/* ── Mobile menu: a full-screen ink room ───────────────────────────────── */
const MobileMenu = ({
  id,
  onClose,
  pathname,
}: {
  id: string;
  onClose: () => void;
  pathname: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !ref.current) return;
    const focusables = Array.from(
      ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      ref={ref}
      id={id}
      className="nz-mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="תפריט ראשי"
      data-tone="ink"
      onKeyDown={onKeyDown}
    >
      <div className="nz-container flex min-h-full flex-col">
        <div className="nz-mobile-menu__bar">
          <Logo className="nz-header__logo text-bone" onClick={onClose} />
          <button ref={closeRef} type="button" className="nz-menu-btn text-bone" onClick={onClose}>
            <span>סגירה</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <nav aria-label="ניווט ראשי" className="pt-2">
          <ul className="nz-mobile-menu__list">
            {mobileNav.map((item, i) => (
              <li key={item.href} style={{ ["--i" as string]: i }}>
                <Link
                  to={item.href}
                  className="nz-mobile-menu__link"
                  aria-current={samePath(pathname, item.href) ? "page" : undefined}
                  onClick={onClose}
                >
                  <span className="nz-mobile-menu__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="nz-mobile-menu__name">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto grid gap-3 pb-5 pt-6">
          <WhatsAppCta size="lg" className="w-full" />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm text-ash">
            <a href={getTelHref(contactInfo.phone)} className="inline-flex min-h-[44px] items-center text-bone" dir="ltr">
              {contactInfo.phone}
            </a>
            <span>
              {studio.days} <bdi dir="ltr">{studio.time}</bdi>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ── Header ───────────────────────────────────────────────────────────── */
const Header = () => {
  const { pathname } = useLocation();
  const panelId = useId();
  const menuId = useId();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number>();
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* "Scrolled" without a scroll listener: watch a sentinel at the top of the page. */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Close everything on navigation. */
  useEffect(() => {
    setPanelOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  /* Escape closes the panel and returns focus to its trigger. */
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuBtnRef.current?.focus());
  }, []);

  const openSoon = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setPanelOpen(true);
  };
  const closeSoon = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPanelOpen(false), 160);
  };

  const servicesActive = pathname.startsWith("/services");

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-4" />
      <header className={cn("nz-header", (scrolled || panelOpen) && "is-scrolled")} data-tone="bone">
        <div className="nz-container nz-header__bar">
          <Logo className="nz-header__logo" />

          <nav aria-label="ניווט ראשי" className="nz-nav">
            <ul className="flex items-center gap-[clamp(0.25rem,1.1vw,1.25rem)]">
              <li
                onPointerEnter={openSoon}
                onPointerLeave={closeSoon}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPanelOpen(false);
                }}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  className="nz-nav__link"
                  aria-expanded={panelOpen}
                  aria-controls={panelId}
                  aria-current={servicesActive ? "page" : undefined}
                  onClick={() => setPanelOpen((v) => !v)}
                >
                  שירותים
                  <svg className="nz-nav__chev" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
                <ServicesPanel id={panelId} open={panelOpen} onNavigate={() => setPanelOpen(false)} />
              </li>
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="nz-nav__link"
                    aria-current={samePath(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nz-header__actions">
            <WhatsAppCta size="sm" className="hidden md:inline-flex" />
            <a
              href={getWhatsAppHref(contactInfo)}
              target="_blank"
              rel="noopener noreferrer"
              className="nz-btn nz-btn--primary nz-btn--sm md:hidden"
              aria-label="לשיחה בוואטסאפ (נפתח בכרטיסייה חדשה)"
            >
              <WhatsAppIcon className="nz-btn__icon" />
              <span>וואטסאפ</span>
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              className="nz-menu-btn"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label="פתיחת התפריט"
              onClick={() => setMenuOpen(true)}
            >
              <span className="hidden xs:inline" aria-hidden="true">
                תפריט
              </span>
              <span className="nz-menu-btn__lines" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      {menuOpen && <MobileMenu id={menuId} onClose={closeMenu} pathname={pathname} />}
    </>
  );
};

export default Header;
