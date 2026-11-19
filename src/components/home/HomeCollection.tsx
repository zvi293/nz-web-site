import { FramedImage } from "@/components/art";
import { Section, Eyebrow, Display, Lede, Button, Reveal } from "@/components/nz";
import { projects } from "@/content/projects";
import { collection } from "@/content/home";

/** Featured + published first, then by order. Only projects with a screenshot. */
const works = projects
  .filter((p) => p.published && p.image)
  .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order)
  .slice(0, 4);

/**
 * "The collection" — real client sites hung as framed screenshots in an asymmetric
 * editorial grid, each with its museum label and an outbound link.
 */
const HomeCollection = () => (
  <Section id="portfolio" tone="bone" aria-labelledby="hm-collection-title" className="hm-collection">
    <div className="hm-head">
      <Eyebrow index={3} rule>
        {collection.eyebrow}
      </Eyebrow>
      <Reveal>
        <Display id="hm-collection-title" size="h2" className="hm-head__title">
          {collection.title}
        </Display>
      </Reveal>
      <Reveal delay={80}>
        <Lede className="hm-head__lede">{collection.lede}</Lede>
      </Reveal>
    </div>

    <ul className="hm-works">
      {works.map((p, i) => (
        <li key={p.id} className={`hm-work hm-work--${i + 1}`}>
          <Reveal>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hm-work__frame"
              tabIndex={-1}
              aria-hidden="true"
            >
              <FramedImage
                src={p.image}
                width={1200}
                height={600}
                alt=""
                ratio="2 / 1"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </a>
            <div className="hm-work__meta">
              <div className="nz-museum hm-work__label">
                <span className="nz-museum__head">
                  <span className="nz-museum__index">עבודה {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="nz-museum__title hm-work__title">{p.title}</h3>
                </span>
                <span className="nz-museum__medium">{p.tags.join(" · ")}</span>
              </div>
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="nz-link hm-work__visit"
                aria-label={`${p.title}: ${collection.visit} (נפתח בכרטיסייה חדשה)`}
              >
                <span className="nz-link__text">{collection.visit}</span>
                <svg className="nz-link__arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M14 6 5.5 14.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </a>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>

    <div className="hm-foot">
      <Button to={collection.allLink.href} variant="secondary">
        {collection.allLink.label}
      </Button>
    </div>
  </Section>
);

export default HomeCollection;
