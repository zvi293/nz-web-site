import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Button } from "@/components/nz";
import { projectsCopy } from "./copy";
import { works } from "./works";

/** Must equal lcpArt.sizes in src/pages/projects.astro. */
export const PROJECTS_HERO_SIZES = "(min-width: 1440px) 690px, (min-width: 1024px) 47vw, calc(100vw - 64px)";
export const PROJECTS_HERO_SLUG = "neon-gallery-door";

const h = projectsCopy.hero;

/**
 * Hero of /projects/ (bone): the room label, the keyword H1, the answer-first lead, and the
 * signature art (a neon line leading into a gallery) hung large, and a "thread" link to the
 * wall below. Static.
 */
const ProjectsHero = () => {
  const art = getArt(PROJECTS_HERO_SLUG);
  return (
    <section className="nz-section pj-hero nz-wall-light" data-tone="bone" aria-labelledby="pj-hero-title">
      <div className="nz-container pj-hero__grid">
        <div className="pj-hero__text">
          <p className="nz-label pj-hero__room">
            <span className="nz-label__index">{h.room}</span>
            <span>{h.eyebrow}</span>
          </p>
          <h1 id="pj-hero-title" className="nz-display pj-hero__title">
            {h.h1} <span className="nz-accent">{h.h1Accent}</span>
          </h1>
          <p className="lead pj-hero__lead">{h.lead}</p>
          <p className="pj-hero__meta">
            <span className="pj-hero__count">{h.countLine(works.length)}</span>
            <Button to="#salon" variant="quiet">
              {h.toWall}
            </Button>
          </p>
        </div>
        <figure className="pj-hero__art">
          <Artwork slug={PROJECTS_HERO_SLUG} sizes={PROJECTS_HERO_SIZES} priority frame lit alt={art.alt} />
          <MuseumLabel as="figcaption" index={3} prefix="מוצג" title={art.title} medium={h.artMedium} />
        </figure>
      </div>
    </section>
  );
};

export default ProjectsHero;
