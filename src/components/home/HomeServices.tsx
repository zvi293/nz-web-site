import { useState } from "react";
import { Link } from "react-router-dom";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Section, Eyebrow, Display, Lede, Button, Reveal, ArrowIcon } from "@/components/nz";
import { cn } from "@/lib/utils";
import { servicesHall } from "@/content/home";

/**
 * "The hall" — the services as large serif rows. On desktop, the row you hover or
 * focus hangs its artwork in a sticky frame beside the list; on mobile each row
 * carries a small thumbnail.
 */
const HomeServices = () => {
  const [active, setActive] = useState(0);
  const rows = servicesHall.rows;
  const activeRow = rows[active];

  return (
    <Section id="services" tone="bone" aria-labelledby="hm-services-title" className="hm-hall">
      <div className="hm-head">
        <Eyebrow index={1} rule>
          {servicesHall.eyebrow}
        </Eyebrow>
        <Reveal>
          <Display id="hm-services-title" size="h2" className="hm-head__title">
            {servicesHall.title}
          </Display>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="hm-head__lede">{servicesHall.lede}</Lede>
        </Reveal>
      </div>

      <div className="hm-hall__grid">
        <ol className="hm-hall__list" onPointerLeave={() => undefined}>
          {rows.map((row, i) => (
            <li key={row.href}>
              <Link
                to={row.href}
                className={cn("hm-hall__row", i === active && "is-active")}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="hm-hall__index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hm-hall__text">
                  <span className="hm-hall__name">{row.name}</span>
                  <span className="hm-hall__line">{row.line}</span>
                </span>
                <span className="hm-hall__thumb" aria-hidden="true">
                  <Artwork slug={row.art} sizes="112px" ratio="1 / 1" alt="" />
                </span>
                <ArrowIcon className="hm-hall__arrow" />
              </Link>
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
            <MuseumLabel
              index={active + 1}
              prefix="חדר"
              title={activeRow.name}
              medium={`מתוך האוסף: ${getArt(activeRow.art).title}`}
            />
          </div>
        </div>
      </div>

      <div className="hm-foot">
        <Button to={servicesHall.allLink.href} variant="quiet">
          {servicesHall.allLink.label}
        </Button>
      </div>
    </Section>
  );
};

export default HomeServices;
