// Signature component: כרטיס הכניסה — tear-off ticket stub
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Button, WhatsAppCta } from "@/components/nz";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { offer } from "@/content/offer";
import { Plate } from "./OfferPlates";

const TEAR_AT = 76; // px of sideways pull that tears the stub

/** The vermilion cube stamp, pressed onto the ticket. */
const Stamp = ({ text }: { text: string }) => (
  <span className="hm-stamp" aria-hidden="true">
    <span className="hm-stamp__cube" />
    <span className="hm-stamp__text">{text}</span>
    <span className="hm-stamp__mark" dir="ltr">
      NZ-web
    </span>
  </span>
);

/** Fine guilloche lines for the ticket's security band (pure SVG, decorative): interfering sine waves. */
const GUILLOCHE_PATHS = Array.from({ length: 9 }, (_, i) => {
  const amp = 5 + (i % 3) * 4;
  const len = 22 + i * 3.5;
  const phase = i * 0.9;
  let d = "";
  for (let x = 0; x <= 320; x += 4) {
    const y = 20 + amp * Math.sin(x / len + phase);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
});
const Guilloche = () => (
  <svg className="hm-ticket__guilloche" viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    {GUILLOCHE_PATHS.map((d) => (
      <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth=".5" vectorEffect="non-scaling-stroke" />
    ))}
  </svg>
);

/**
 * The ticket. Main part = הקמה (one-time setup), perforation, stub = the optional monthly
 * subscription. Pull the stub sideways (touch or mouse) past the tear line to tear it off;
 * the button does the same for keyboard / screen-reader users and reattaches it.
 * Desktop with a fine pointer: a subtle 3D tilt. SSR: renders the whole, attached ticket.
 */
const AdmissionTicket = () => {
  const t = offer.ticket;
  const [torn, setTorn] = useState(false);
  const [announce, setAnnounce] = useState("");
  const tiltRef = useRef<HTMLDivElement>(null);
  const stubRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; dx: number; active: boolean } | null>(null);
  const raf = useRef(0);

  const setTornState = (next: boolean) => {
    setTorn(next);
    setAnnounce(next ? t.announceTorn : t.announceAttached);
  };

  /* ── pointer tilt (desktop, fine pointer, motion allowed) ── */
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const onMove = (e: PointerEvent) => {
      if (!fine.matches || !motionAllowed() || drag.current?.active) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-x", `${(-py * 5).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(px * 7).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ── tear gesture ── */
  const setPull = (dx: number) => {
    const el = stubRef.current;
    if (!el) return;
    el.style.setProperty("--pull", `${dx.toFixed(1)}px`);
    el.style.setProperty("--pull-rot", `${(dx * 0.045).toFixed(2)}deg`);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (torn || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, active: false };
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.active) {
      // a vertical gesture is a page scroll: let it go
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < 6) return;
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add("is-pulling");
    }
    d.dx = dx;
    // resistance: the paper gives a little, then more as it starts to tear
    const eased = Math.sign(dx) * Math.min(Math.abs(dx), 140) * 0.75;
    setPull(eased);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.active) return;
    e.currentTarget.classList.remove("is-pulling");
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (Math.abs(d.dx) >= TEAR_AT) {
      e.currentTarget.style.setProperty("--tear-dir", d.dx < 0 ? "-1" : "1");
      setPull(0);
      setTornState(true);
    } else {
      setPull(0);
    }
  };

  return (
    <div className={cn("hm-ticket-wrap", torn && "is-torn")}>
      <div ref={tiltRef} className="hm-ticket-tilt">
        <div className="hm-ticket">
          <div className="hm-ticket__piece hm-ticket__piece--main">
            <div className="hm-ticket__main">
              <div className="hm-ticket__band">
                <Guilloche />
                <span className="hm-ticket__admit">{t.admit}</span>
                <span className="hm-ticket__serial" dir="ltr">
                  № {t.serial}
                </span>
              </div>
              <p className="hm-ticket__venue">{t.venue}</p>
              <p className="hm-ticket__kicker">{t.main.kicker}</p>
              <h3 className="hm-ticket__title">{t.main.title}</h3>
              <ol className="hm-ticket__stages">
                {t.main.stages.map((stage, i) => (
                  <li key={stage}>
                    <span className="hm-ticket__field">שלב {String(i + 1).padStart(2, "0")}</span>
                    <span className="hm-ticket__value">{stage}</span>
                  </li>
                ))}
              </ol>
              <p className="hm-ticket__note">{t.main.note}</p>
              <Stamp text={t.stamp} />
            </div>
          </div>

          <div
            ref={stubRef}
            className="hm-ticket__piece hm-ticket__piece--stub"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <div className="hm-ticket__stub" role="group" aria-label={`${t.stub.kicker}: ${t.stub.title}`}>
              <p className="hm-ticket__kicker hm-ticket__kicker--stub">{t.stub.kicker}</p>
              <h3 className="hm-ticket__title hm-ticket__title--stub">{t.stub.title}</h3>
              <ul className="hm-ticket__items">
                {t.stub.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="hm-ticket__note hm-ticket__note--stub">{t.stub.note}</p>
              <p className="hm-ticket__grip" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <circle cx="6" cy="6" r="2.6" />
                  <circle cx="6" cy="18" r="2.6" />
                  <path d="M8.2 7.6 20 17M8.2 16.4 20 7" />
                </svg>
                <span>{t.tearHint}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hm-ticket__controls">
        <button type="button" className="nz-link hm-ticket__toggle" aria-pressed={torn} onClick={() => setTornState(!torn)}>
          <span className="nz-link__text">{torn ? t.reattachButton : t.tearButton}</span>
        </button>
        <p className="hm-ticket__torn-note" aria-hidden={!torn}>
          {t.tornNote}
        </p>
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

/**
 * "ההצעה" — one tailored offer, no prices, no tiers. The admission ticket explains the
 * model; the building blocks follow as a catalogue of drawn plates (one snap-scroll row
 * per group on mobile, a grid on desktop). Needs client JS for the ticket only.
 */
const HomeOffer = () => (
  <section id="pricing" className="nz-section nz-section--space-default hm-offer" data-tone="paper" aria-labelledby="hm-offer-title">
    <div className="nz-container">
      <div className="hm-offer__stage">
        <header className="hm-offer__head hm-sd">
          <p className="nz-label nz-label--rule">
            <span className="nz-label__index">אולם 05</span>
            <span>{offer.eyebrow}</span>
          </p>
          <h2 id="hm-offer-title" className="nz-display nz-display--h2 hm-offer__title">
            {offer.title}
          </h2>
          <p className="nz-lede hm-offer__lede">{offer.lede}</p>
          <div className="hm-offer__how">
            <p className="hm-offer__how-title">{offer.howTo.title}</p>
            <p className="hm-offer__how-body">{offer.howTo.body}</p>
          </div>
          <div className="hm-offer__ctas">
            <WhatsAppCta label="לקבלת הצעה אישית" message={offer.whatsappMessage} size="lg" />
            <Button href={offer.cta.href} variant="quiet">
              {offer.cta.label}
            </Button>
          </div>
        </header>

        <div className="hm-offer__ticket hm-sd">
          <AdmissionTicket />
        </div>
      </div>

      <div className="hm-catalog">
        <div className="hm-catalog__intro hm-sd">
          <h3 className="hm-catalog__title">{offer.scopeTitle}</h3>
          <p className="hm-catalog__note">{offer.scopeNote}</p>
        </div>
        {offer.scope.map((group, g) => (
          <section key={group.title} className="hm-catalog__group" aria-labelledby={`hm-catalog-g${g}`}>
            <h4 id={`hm-catalog-g${g}`} className="hm-catalog__group-title">
              <span className="hm-catalog__group-num">{String(g + 1).padStart(2, "0")}</span>
              <span>{group.title}</span>
              <span className="hm-catalog__group-count">{group.items.length} לוחות</span>
            </h4>
            <div className="hm-catalog__scroller" tabIndex={0} role="region" aria-label={group.title}>
              <ul className="hm-catalog__row">
                {group.items.map((item, i) => (
                  <li key={item} className="hm-plate">
                    <span className={cn("hm-plate__sheet", item === "עיצוב מותאם אישית" && "is-typeset")}>
                      <Plate item={item} />
                    </span>
                    <span className="hm-plate__caption">
                      <span className="hm-plate__index">
                        לוח {g + 1}.{i + 1}
                      </span>
                      <span className="hm-plate__name">{item}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  </section>
);

export default HomeOffer;
