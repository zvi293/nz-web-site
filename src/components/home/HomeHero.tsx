// Signature component: המוצג הבא — switch exhibit (curtain wipe)
import { useCallback, useEffect, useRef, useState } from "react";
import { Artwork, MuseumLabel, getArt, prefetchArt } from "@/components/art";
import { WhatsAppCta, ArrowIcon } from "@/components/nz";
import { motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { hero } from "@/content/home";

const SIZES = "(min-width: 1440px) 760px, (min-width: 1024px) 54vw, 100vw";
const RATIO = "8 / 5";

/** Two picture wires from the rail to the frame — a quiet detail of a real hang. */
const HangingWires = () => (
  <svg className="hm-exhibit__wires" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M200 4 L84 60 M200 4 L316 60" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
  </svg>
);

/**
 * "The exhibit" — the hero artwork hung on the bone wall. Signature: "המוצג הבא"
 * changes the piece with a curtain wipe (clip-path, right → left). The incoming
 * piece is only revealed once its image has loaded; reduced motion = instant swap.
 * SSR: renders exhibit 01 complete; the switcher only acts on click.
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

  useEffect(() => () => window.clearTimeout(fallbackTimer.current), []);

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
      <HangingWires />
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

/**
 * Home hero — "the entrance". Mobile: the statement, then the framed exhibit inside the
 * first screen, then the lede and actions. Desktop: a grand serif statement whose first
 * line sweeps across the wall above the hung piece; the exhibit overlaps the grid.
 * Needs client JS only for the exhibit switcher (HeroExhibit).
 */
const HomeHero = () => {
  const [first, second] = hero.h1Statement;
  return (
    <section className="hm-hero nz-section" data-tone="bone" aria-labelledby="hm-hero-title">
      <div className="hm-hero__light" aria-hidden="true" />
      <div className="nz-container hm-hero__grid">
        <div className="hm-hero__head">
          <h1 id="hm-hero-title" className="hm-hero__title">
            <span className="nz-label hm-hero__kicker hm-enter" style={{ ["--d" as string]: "0ms" }}>
              <span className="hm-cube" aria-hidden="true" />
              <span>{hero.eyebrow}</span>
            </span>{" "}
            <span className="nz-display hm-hero__statement">
              <span className="hm-line hm-line--1">
                <span className="hm-line__inner" style={{ ["--d" as string]: "120ms" }}>
                  {first}
                </span>
              </span>{" "}
              <span className="hm-line hm-line--2">
                <span className="hm-line__inner" style={{ ["--d" as string]: "210ms" }}>
                  {second}
                </span>
              </span>{" "}
              <span className="hm-line hm-line--3">
                <span className="hm-line__inner" style={{ ["--d" as string]: "300ms" }}>
                  <span className="nz-accent">{hero.h1Accent}</span>
                </span>
              </span>
            </span>
          </h1>
        </div>

        <div className="hm-hero__art">
          <HeroExhibit />
        </div>

        <div className="hm-hero__body">
          <p className="nz-lede hm-hero__lede hm-enter" style={{ ["--d" as string]: "420ms" }}>
            {hero.lede}
          </p>
          <div className="hm-hero__ctas hm-enter" style={{ ["--d" as string]: "520ms" }}>
            <WhatsAppCta size="lg" label={hero.primaryCta} />
            <a href={hero.secondaryCta.href} className="nz-link hm-hero__secondary">
              <span className="nz-link__text">{hero.secondaryCta.label}</span>
              <ArrowIcon className="nz-link__arrow" />
            </a>
          </div>
        </div>

        <nav className="hm-hero__floor" aria-label="מפת העמוד">
          <p className="nz-label hm-hero__room">
            <span className="hm-cube hm-cube--sm" aria-hidden="true" />
            <span>{hero.room}</span>
          </p>
          <ol className="hm-hero__rooms">
            {hero.rooms.map((room, i) => (
              <li key={room.href}>
                <a href={room.href} className="hm-hero__roomlink">
                  <span className="hm-hero__roomnum" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{room.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default HomeHero;
