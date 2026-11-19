// Signature component: אולם השירותים — focus/hover preview
import { useEffect, useRef, useState } from "react";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Section, Display, Lede, Button, ArrowIcon } from "@/components/nz";
import { cn } from "@/lib/utils";
import { servicesHall } from "@/content/home";

/** Phones, tablets and touch screens: the row in focus is the one at the middle of the viewport. */
const SCROLL_FOCUS = "(max-width: 1023px), (hover: none)";

/**
 * "The hall" — the services as large serif rows. Opener: a room plaque (room number,
 * hairline, title, lede). One model, two inputs: on desktop the row you hover or focus
 * hangs its artwork in a sticky frame beside the list; on phones and touch screens the
 * row passing the middle of the viewport is the focused one (its small framed piece
 * lifts and the vermilion arrow appears), so the hall comes alive while you scroll.
 * SSR: row 1 is active; client JS swaps the focused row.
 */
const HomeServices = () => {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rows = servicesHall.rows;
  const activeRow = rows[active];

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const mq = window.matchMedia(SCROLL_FOCUS);
    let io: IntersectionObserver | null = null;
    const start = () => {
      io?.disconnect();
      io = null;
      if (!mq.matches) return;
      const els = rowRefs.current.filter(Boolean) as HTMLAnchorElement[];
      // On every crossing of the middle band, pick the row whose centre is nearest the middle.
      const pick = () => {
        const mid = window.innerHeight / 2;
        let best = -1;
        let bestDist = Infinity;
        els.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (r.bottom > 0 && r.top < window.innerHeight && d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      };
      io = new IntersectionObserver(pick, { rootMargin: "-38% 0px -38% 0px", threshold: [0, 0.5, 1] });
      els.forEach((el) => io!.observe(el));
    };
    start();
    mq.addEventListener("change", start);
    return () => {
      io?.disconnect();
      mq.removeEventListener("change", start);
    };
  }, []);

  return (
    <Section id="services" tone="bone" aria-labelledby="hm-services-title" className="hm-hall">
      <header className="hm-plaque hm-sd">
        <p className="hm-plaque__room">
          <span className="hm-plaque__num">{servicesHall.room}</span>
          <span className="hm-plaque__name">{servicesHall.eyebrow}</span>
        </p>
        <Display id="hm-services-title" size="h2" className="hm-plaque__title">
          {servicesHall.title}
        </Display>
        <div className="hm-plaque__side">
          <Lede className="hm-plaque__lede">{servicesHall.lede}</Lede>
        </div>
      </header>

      <div className="hm-hall__grid">
        <ol className="hm-hall__list">
          {rows.map((row, i) => (
            <li key={row.href} className="hm-sd">
              <a
                ref={(el) => (rowRefs.current[i] = el)}
                href={row.href}
                className={cn("hm-hall__row", i === active && "is-active")}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="hm-hall__text">
                  <span className="hm-hall__name">
                    {row.name}
                    <ArrowIcon className="hm-hall__arrow hm-hall__arrow--inline" />
                  </span>
                  <span className="hm-hall__line">{row.line}</span>
                </span>
                <span className="hm-hall__thumb" aria-hidden="true">
                  <Artwork slug={row.art} sizes="112px" alt="" frame />
                </span>
                <ArrowIcon className="hm-hall__arrow hm-hall__arrow--end" />
              </a>
            </li>
          ))}
        </ol>

        <div className="hm-hall__aside" aria-hidden="true">
          <div className="hm-hall__sticky">
            <div className="hm-stack">
              {rows.map((row, i) => (
                <div key={row.art} className={cn("hm-stack__item", i === active && "is-active")}>
                  <Artwork slug={row.art} sizes="(min-width: 1440px) 560px, 38vw" ratio="4 / 3" frame lit alt="" />
                </div>
              ))}
            </div>
            <MuseumLabel title={activeRow.name} medium={`מתוך האוסף: ${getArt(activeRow.art).title}`} />
          </div>
        </div>
      </div>

      <div className="hm-foot">
        <Button href={servicesHall.allLink.href} variant="quiet">
          {servicesHall.allLink.label}
        </Button>
      </div>
    </Section>
  );
};

export default HomeServices;
