import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { contactInfo, getTelHref, getWhatsAppHref } from "@/lib/contact-utils";
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

/* The panel's art (and with it the art manifest) is its own chunk, fetched on first intent. */
const loadPanelArt = () => import("@/components/HeaderPanelArt");
const HeaderPanelArt = lazy(loadPanelArt);
const warmPanelArt = () => {
  void loadPanelArt();
};

/* ── Services panel ("the mega panel") ─────────────────────────────────────
   A quiet bone room under the bar: the service pages as numbered serif rows,
   and — the signature touch — the hovered/focused service's artwork hung on
   the left with its museum label. Always in the DOM (hidden when closed) so
   the service links are crawlable. The art + label are rendered only once the
   panel has opened (never in the server HTML), from a lazily loaded chunk. */
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
                <a
                  href={svc.href}
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
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-4">
            <a href="/services/" className="nz-link" onClick={onNavigate}>
              <span className="nz-link__text">לכל השירותים</span>
              <ArrowIcon className="nz-link__arrow" />
            </a>
            <span className="text-sm text-graphite">לא בטוחים מה מתאים? כתבו לנו בוואטסאפ ונכוון אתכם.</span>
          </div>
        </div>

        <div className="nz-mega__preview" aria-hidden="true">
          {open && (
            <Suspense fallback={null}>
              <HeaderPanelArt active={active} seen={seen} />
            </Suspense>
          )}
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
                <a
                  href={item.href}
                  className="nz-mobile-menu__link"
                  aria-current={samePath(pathname, item.href) ? "page" : undefined}
                  onClick={onClose}
                >
                  <span className="nz-mobile-menu__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="nz-mobile-menu__name">{item.label}</span>
                </a>
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

/* ── Header ───────────────────────────────────────────────────────────────
   An Astro island (BaseLayout: <Header client:idle pathname={Astro.url.pathname} />). The whole
   bar, the nav links and the services panel are server-rendered into the static HTML (crawlable);
   hydration only adds the panel / mobile-menu behaviour. `pathname` marks the current link. */
const Header = ({ pathname = "/" }: { pathname?: string }) => {
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
    warmPanelArt();
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
                  onFocus={warmPanelArt}
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
                  <a
                    href={item.href}
                    className="nz-nav__link"
                    aria-current={samePath(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* The actions adapt to the header's own width in rem (a container query, see index.css),
              so a 200% text zoom or a 320px phone sheds the pill label, then the pill, before
              anything is pushed off-screen. The menu button always stays. */}
          <div className="nz-header__actions">
            <WhatsAppCta size="sm" className="nz-header__wa nz-header__wa--long" />
            <a
              href={getWhatsAppHref(contactInfo)}
              target="_blank"
              rel="noopener noreferrer"
              className="nz-btn nz-btn--primary nz-btn--sm nz-header__wa nz-header__wa--short"
              aria-label="לשיחה בוואטסאפ (נפתח בכרטיסייה חדשה)"
            >
              <WhatsAppIcon className="nz-btn__icon" />
              <span className="nz-header__wa-text">וואטסאפ</span>
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
              <span className="nz-menu-btn__label" aria-hidden="true">
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
