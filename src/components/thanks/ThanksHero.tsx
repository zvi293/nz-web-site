import type { ReactNode } from "react";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Button, WhatsAppCta } from "@/components/nz";
import { thanksCopy } from "./copy";

/** Must equal lcpArt.sizes in src/pages/thank-you.astro. Phones: the island zooms the picture ~1.4×
    into a 4/5 crop (cover of a 3/2 work), so it is drawn about 2.1 × the viewport wide. */
export const THANKS_ART_SIZES = "(min-width: 1440px) 780px, (min-width: 1024px) 54vw, (min-width: 640px) 100vw, 210vw";
export const THANKS_ART_SLUG = "embroidered-comet";

const h = thanksCopy.hero;
const c = thanksCopy.comet;

/**
 * /thank-you/ hero (ink): the H1, the lead, a WhatsApp retry, and the embroidered artwork hung
 * large — the signature island (ThanksComet, passed as children) lays its golden stitch over the
 * canvas. "What happens now" is a static ordered list (#ty-steps) that the island lights step by
 * step (data-step); without JS every step is simply shown. Static.
 */
const ThanksHero = ({ children }: { children?: ReactNode }) => {
  const art = getArt(THANKS_ART_SLUG);
  return (
    <section className="nz-section ty-hero" data-tone="ink" aria-labelledby="ty-title">
      <div className="nz-container ty-hero__grid">
        <div className="ty-hero__text">
          <p className="nz-label ty-hero__room">
            <span className="nz-label__index">{h.room}</span>
            <span>{h.eyebrow}</span>
          </p>
          <h1 id="ty-title" className="nz-display ty-hero__title">
            {h.h1} <span className="nz-accent">{h.h1Accent}</span>
          </h1>
          <p className="lead ty-hero__lead">{h.lead}</p>
          <div className="ty-hero__ctas">
            <WhatsAppCta label={h.retry} message={h.retryMessage} variant="secondary" className="ty-retry" />
            <Button to={h.home.href} variant="quiet">
              {h.home.label}
            </Button>
          </div>
        </div>

        <figure className="ty-hero__art">
          <div className="ty-frame">
            <div className="ty-canvas">
              <Artwork slug={THANKS_ART_SLUG} sizes={THANKS_ART_SIZES} priority alt={art.alt} className="ty-canvas__art" />
              {children}
            </div>
          </div>
          <MuseumLabel as="figcaption" index={9} prefix="מוצג" title={art.title} medium={h.artMedium} />
        </figure>

        <div className="ty-steps-wrap">
          <h2 className="ty-steps__title">{c.title}</h2>
          <ol id="ty-steps" className="ty-steps" data-step="3">
            {c.steps.map((s, i) => (
              <li key={s.title} className="ty-step" data-n={i + 1}>
                <span className="ty-step__knot" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="ty-step__title">{s.title}</h3>
                  <p className="ty-step__body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ThanksHero;
