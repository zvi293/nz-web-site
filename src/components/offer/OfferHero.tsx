import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Button, WhatsAppCta } from "@/components/nz";
import { offerPage } from "@/content/offer";

/** Must equal lcpArt.sizes in src/pages/packages.astro, or the hero downloads twice. */
export const OFFER_HERO_SIZES = "(min-width: 1440px) 680px, (min-width: 1024px) 48vw, 100vw";
export const OFFER_HERO_SLUG = "chair-bubble";

const h = offerPage.hero;

/**
 * Hero of /packages/ ("ההצעה"): stacked room label, the keyword H1 with one accent,
 * the answer-first lead (.lead → speakable), the two CTAs, and the signature artwork
 * (chair-bubble) hung large with its museum label. Under the art: a three-term
 * "spec plate" (setup · subscription · quote) set like a catalogue colophon. Static.
 */
const OfferHero = () => {
  const art = getArt(OFFER_HERO_SLUG);
  return (
    <section className="nz-section of-hero nz-wall-light" data-tone="bone" aria-labelledby="of-hero-title">
      <div className="nz-container of-hero__grid">
        <div className="of-hero__text">
          <p className="of-hero__room">
            <span className="of-hero__room-num">{h.room}</span>
            <span className="of-hero__room-sep" aria-hidden="true" />
            <span>{h.eyebrow}</span>
          </p>
          <h1 id="of-hero-title" className="nz-display of-hero__title">
            {h.h1} <span className="nz-accent">{h.h1Accent}</span>
          </h1>
          <p className="lead of-hero__lead">{h.lead}</p>
          <div className="of-hero__ctas">
            <WhatsAppCta label={h.primaryCta} message={offerPage.whatsappMessage} size="lg" />
            <Button to={h.secondaryCta.href} variant="quiet">
              {h.secondaryCta.label}
            </Button>
          </div>
        </div>

        <figure className="of-hero__art">
          <Artwork slug={OFFER_HERO_SLUG} sizes={OFFER_HERO_SIZES} priority frame lit alt={art.alt} />
          <MuseumLabel as="figcaption" index={5} prefix="מוצג" title={art.title} medium={h.artMedium} />
        </figure>

        <dl className="of-hero__facts" aria-label="ההצעה בשלוש מילים">
          {h.facts.map((f, i) => (
            <div key={f.term} className="of-hero__fact">
              <dt>
                <span className="of-hero__fact-i" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.term}
              </dt>
              <dd className="of-hero__v">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default OfferHero;
