// Signature component: המוצג הבא — switch exhibit (curtain wipe)
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
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
 * changes the piece with a curtain wipe (clip-path). Three ways in, one model:
 * tap/click the framed piece itself (the curtain starts from the side you touched),
 * the progress strip under the frame (one hairline per exhibit, direct navigation),
 * or the "המוצג הבא" button. The incoming piece is only revealed once its image has
 * loaded; reduced motion = instant swap. SSR: renders exhibit 01 complete.
 * The frame hit area is a pointer convenience (aria-hidden); keyboard and screen-reader
 * users get the strip and the button, and every change is announced (aria-live).
 */
type Side = "start" | "end";

const HeroExhibit = () => {
  const exhibits = hero.exhibits;
  const [layers, setLayers] = useState<number[]>([0]);
  const [revealing, setRevealing] = useState(false);
  const [side, setSide] = useState<Side>("start");
  const [announce, setAnnounce] = useState("");
  const fallbackTimer = useRef<number>();
  const current = layers[layers.length - 1];
  // The wall label follows what is actually on the wall: it switches when the curtain starts.
  const shown = layers.length > 1 && !revealing ? layers[0] : current;
  const nextIndex = (current + 1) % exhibits.length;
  const art = getArt(exhibits[shown].slug);

  useEffect(() => () => window.clearTimeout(fallbackTimer.current), []);

  const warm = useCallback((n: number) => prefetchArt(exhibits[n].slug, SIZES), [exhibits]);
  const warmNext = useCallback(() => warm(nextIndex), [warm, nextIndex]);

  /** Hang exhibit n; `from` = the side the curtain starts from (start = right in RTL). */
  const goTo = (n: number, from: Side) => {
    // A tap while a curtain is still moving starts the next one from the incoming piece.
    if (n === current) return;
    setAnnounce(`מוצג ${n + 1} מתוך ${exhibits.length}: ${getArt(exhibits[n].slug).title}`);
    if (!motionAllowed()) {
      setLayers([n]);
      return;
    }
    setSide(from);
    setLayers([current, n]);
    setRevealing(false);
    window.clearTimeout(fallbackTimer.current);
    // never wait forever for a slow image — the LQIP + colour still look intentional
    fallbackTimer.current = window.setTimeout(() => setRevealing(true), 1200);
  };

  const next = () => goTo(nextIndex, "start");

  /** A tap on the piece: next exhibit, the curtain enters from the touched half. */
  const onFrameClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const inStartHalf = rtl ? e.clientX > r.left + r.width / 2 : e.clientX < r.left + r.width / 2;
    goTo(nextIndex, inStartHalf ? "start" : "end");
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
    <>
      <figure className="hm-exhibit" aria-labelledby="hm-exhibit-label">
        <HangingWires />
        <div className={cn("hm-exhibit__stage", side === "end" && "from-end")}>
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
          <div className="hm-exhibit__hit" aria-hidden="true" onClick={onFrameClick} onPointerEnter={warmNext} onTouchStart={warmNext} />
        </div>

        <div className="hm-exhibit__controls">
          <div className="hm-exhibit__dots" role="group" aria-label={hero.dotsLabel}>
            {exhibits.map((ex, i) => (
              <button
                key={ex.slug}
                type="button"
                className={cn("hm-exhibit__dot", i === shown && "is-active")}
                aria-label={`מוצג ${i + 1} מתוך ${exhibits.length}: ${getArt(ex.slug).title}`}
                aria-current={i === shown ? "true" : undefined}
                onClick={() => goTo(i, i > current ? "start" : "end")}
                onPointerEnter={() => warm(i)}
                onFocus={() => warm(i)}
              >
                <span className="hm-exhibit__dot-line" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hm-exhibit__next"
            onClick={next}
            onPointerEnter={warmNext}
            onFocus={warmNext}
            aria-describedby="hm-exhibit-label"
          >
            <span className="nz-link__text">{hero.nextLabel}</span>
            <ArrowIcon className="nz-link__arrow" />
          </button>
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
        </figcaption>
      </figure>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </>
  );
};

/**
 * Home hero — "the entrance". Mobile: the statement, the lede and the actions (a CTA is
 * visible on first load even on a 360×640 phone), then the framed exhibit. The text
 * column precedes the art in the DOM, so keyboard order follows the reading order. Desktop: a grand serif statement whose first
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
              {/* read as one sentence by crawlers, speakable and TTS: "…לעסקים: כל אתר…" */}
              <span className="nz-sr">: </span>
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

        <div className="hm-hero__art">
          <HeroExhibit />
        </div>

        <nav className="hm-hero__floor" aria-label="מפת העמוד">
          <p className="nz-label hm-hero__room">
            <span className="hm-cube hm-cube--sm" aria-hidden="true" />
            <span>{hero.room}</span>
          </p>
          <ol className="hm-hero__rooms">
            {hero.rooms.map((room) => (
              <li key={room.href}>
                <a href={room.href} className="hm-hero__roomlink">
                  {room.label}
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
