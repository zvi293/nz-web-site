import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Button } from "@/components/nz";
import { notFoundCopy } from "./copy";

/** Must equal lcpArt.sizes in src/pages/404.astro. Below 1024px the piece hangs as a small museum
    card (the tunnel below is the phone's hero visual). */
export const NF_ART_SIZES = "(min-width: 1440px) 760px, (min-width: 1024px) 52vw, 128px";
export const NF_ART_SLUG = "ceramic-portals";

const h = notFoundCopy.hero;

/**
 * 404 hero (bone): an empty room number ("אולם ∅"), the H1, the lead, and the ceramic portals
 * hung as the room's only piece (large from 1024px; a small card with its label on phones, so the
 * illustrated tunnel right below is not a second big picture of the same gates). Static.
 */
const NotFoundHero = () => {
  const art = getArt(NF_ART_SLUG);
  return (
    <section className="nz-section nf-hero nz-wall-light" data-tone="bone" aria-labelledby="nf-title">
      <div className="nz-container nf-hero__grid">
        <div className="nf-hero__text">
          <p className="nz-label nf-hero__room">
            <span className="nz-label__index">{h.room}</span>
            <span>{h.eyebrow}</span>
          </p>
          <h1 id="nf-title" className="nz-display nf-hero__title">
            {h.h1} <span className="nz-accent">{h.h1Accent}</span>
          </h1>
          <p className="lead nf-hero__lead">{h.lead}</p>
          <div className="nf-hero__ctas">
            <Button to="#gates" variant="primary" size="lg" icon="arrow">
              {h.toGates}
            </Button>
            <Button to={h.home.href} variant="quiet">
              {h.home.label}
            </Button>
          </div>
        </div>
        <figure className="nf-hero__art">
          <Artwork slug={NF_ART_SLUG} sizes={NF_ART_SIZES} priority frame lit alt={art.alt} />
          <MuseumLabel as="figcaption" index="∅" prefix="מוצג" title={art.title} medium={h.artMedium} />
        </figure>
      </div>
    </section>
  );
};

export default NotFoundHero;
