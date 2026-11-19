// Signature component: אולם השירותים — focus/hover preview
import { useState } from "react";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Section, Display, Lede, Button, ArrowIcon } from "@/components/nz";
import { cn } from "@/lib/utils";
import { servicesHall } from "@/content/home";

/**
 * "The hall" — the services as large serif rows. Opener: a room plaque (room number,
 * plaque line, hairline). On desktop, the row you hover or focus hangs its artwork in a
 * sticky frame beside the list; on mobile each row carries its own small framed piece.
 * SSR: row 01 is active; client JS only swaps the sticky piece on hover/focus.
 */
const HomeServices = () => {
  const [active, setActive] = useState(0);
  const rows = servicesHall.rows;
  const activeRow = rows[active];

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
          <p className="nz-label hm-plaque__note">
            <span className="nz-label__index">{String(rows.length).padStart(2, "0")}</span>
            <span>{servicesHall.plaque}</span>
          </p>
        </div>
      </header>

      <div className="hm-hall__grid">
        <ol className="hm-hall__list">
          {rows.map((row, i) => (
            <li key={row.href} className="hm-sd">
              <a
                href={row.href}
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
                  <Artwork slug={row.art} sizes="104px" ratio="4 / 5" alt="" frame />
                </span>
                <ArrowIcon className="hm-hall__arrow" />
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
        <Button href={servicesHall.allLink.href} variant="quiet">
          {servicesHall.allLink.label}
        </Button>
      </div>
    </Section>
  );
};

export default HomeServices;
