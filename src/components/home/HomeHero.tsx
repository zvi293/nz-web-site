import { useCallback, useRef, useState } from "react";
import { Artwork, MuseumLabel, getArt, prefetchArt } from "@/components/art";
import { Button, WhatsAppCta, ArrowIcon } from "@/components/nz";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { hero } from "@/content/home";

const SIZES = "(min-width: 1440px) 820px, (min-width: 1024px) 56vw, 100vw";
const RATIO = "8 / 5";

/**
 * "The exhibit" — the hero artwork hung on the bone wall. Signature: "המוצג הבא"
 * changes the piece with a curtain wipe (clip-path, right → left). The incoming
 * piece is only revealed once its image has loaded; reduced motion = instant swap.
 */
const HeroExhibit = () => {
  const exhibits = hero.exhibits;
  const [layers, setLayers] = useState<number[]>([0]);
  const [revealing, setRevealing] = useState(false);
  const [announce, setAnnounce] = useState("");
  const fallbackTimer = useRef<number>();
  const current = layers[layers.length - 1];
  // The wall label follows what is actually on the wall: it switches when the curtain starts.
  const shown = layers.length > 1 && !revealing ? layers[0] : current;
  const nextIndex = (current + 1) % exhibits.length;
  const art = getArt(exhibits[shown].slug);

  const warmNext = useCallback(() => prefetchArt(exhibits[nextIndex].slug, SIZES), [exhibits, nextIndex]);

  const next = () => {
    if (layers.length > 1) return;
    const n = nextIndex;
    setAnnounce(`מוצג ${n + 1} מתוך ${exhibits.length}: ${getArt(exhibits[n].slug).title}`);
    if (!motionAllowed()) {
      setLayers([n]);
      return;
    }
    setLayers([current, n]);
    setRevealing(false);
    window.clearTimeout(fallbackTimer.current);
    // never wait forever for a slow image — the LQIP + colour still look intentional
    fallbackTimer.current = window.setTimeout(() => setRevealing(true), 1200);
  };

  const onIncomingLoad = () => {
    window.clearTimeout(fallbackTimer.current);
    setRevealing(true);
  };

  const onRevealEnd = (n: number) => {
    setLayers([n]);
    setRevealing(false);
  };

  return (
    <figure className="hm-exhibit" aria-labelledby="hm-exhibit-label">
      <div className="hm-exhibit__stage">
        {layers.map((i, li) => {
          const incoming = li === 1;
          return (
            <div
              key={exhibits[i].slug}
              className={cn("hm-exhibit__layer", incoming && "is-incoming", incoming && revealing && "is-revealing")}
              onAnimationEnd={incoming ? (e) => e.target === e.currentTarget && onRevealEnd(i) : undefined}
            >
              <Artwork
                slug={exhibits[i].slug}
                sizes={SIZES}
                ratio={RATIO}
                priority={i === 0}
                eager
                frame
                lit
                onLoad={incoming ? onIncomingLoad : undefined}
              />
            </div>
          );
        })}
      </div>

      <figcaption className="hm-exhibit__caption">
        <MuseumLabel
          id="hm-exhibit-label"
          index={shown + 1}
          prefix="מוצג"
          title={art.title}
          medium={exhibits[shown].medium}
          className="hm-exhibit__label"
        />
        <button
          type="button"
          className="hm-exhibit__next"
          onClick={next}
          onPointerEnter={warmNext}
          onFocus={warmNext}
          aria-describedby="hm-exhibit-label"
        >
          <span className="hm-exhibit__count" aria-hidden="true">
            {String(shown + 1).padStart(2, "0")} / {String(exhibits.length).padStart(2, "0")}
          </span>
          <span className="nz-link__text">{hero.nextLabel}</span>
          <ArrowIcon className="nz-link__arrow" />
        </button>
      </figcaption>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </figure>
  );
};

const HomeHero = () => (
  <section className="hm-hero nz-section nz-wall-light" data-tone="bone" aria-labelledby="hm-hero-title">
    <div className="nz-container hm-hero__grid">
      <div className="hm-hero__text">
        <h1 id="hm-hero-title" className="hm-hero__title">
          <span className="nz-label hm-hero__kicker hm-enter" style={{ ["--d" as string]: "0ms" }}>
            <span className="hm-hero__cube" aria-hidden="true" />
            <span>{hero.eyebrow}</span>
          </span>{" "}
          <span className="nz-display nz-display--l hm-hero__statement">
            {hero.h1Statement.map((line, i) => (
              <span className="hm-line" key={line}>
                {i > 0 && " "}
                <span className="hm-line__inner" style={{ ["--d" as string]: `${120 + i * 90}ms` }}>
                  {line}
                  {i === hero.h1Statement.length - 1 && (
                    <>
                      {" "}
                      <span className="nz-accent">{hero.h1Accent}</span>
                    </>
                  )}
                </span>
              </span>
            ))}
          </span>
        </h1>
        <p className="nz-lede hm-hero__lede hm-enter" style={{ ["--d" as string]: "420ms" }}>
          {hero.lede}
        </p>
        <div className="hm-hero__ctas hm-enter" style={{ ["--d" as string]: "520ms" }}>
          <WhatsAppCta size="lg" label={hero.primaryCta} />
          <Button to={hero.secondaryCta.href} variant="secondary" size="lg">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="hm-hero__art">
        <HeroExhibit />
      </div>
    </div>
  </section>
);

export default HomeHero;
