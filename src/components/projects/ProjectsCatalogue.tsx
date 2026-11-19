import { ExternalIcon } from "@/components/nz";
import { projectsCopy } from "./copy";
import { wallKey, works, type KeyRect } from "./works";

const c = projectsCopy.catalogue;
const KEY = wallKey();

/** The wall drawn as a schematic: every frame a rectangle, numbered; `focus` highlights one work. */
const WallKeySvg = ({ focus, numbers = false, className }: { focus?: number; numbers?: boolean; className?: string }) => {
  const pad = 16;
  const vb = `${-pad} ${-pad} ${1000 + pad * 2} ${KEY.height + pad * 2}`;
  /* one number per work, in the middle of its desktop frame */
  const labels = new Map<number, { x: number; y: number }>();
  if (numbers) {
    KEY.rects.forEach((r) => {
      if (r.kind === "desktop") labels.set(r.work, { x: r.x + r.w / 2, y: r.y + r.h / 2 + 15 });
    });
  }
  return (
    <svg className={className} viewBox={vb} aria-hidden="true">
      {KEY.rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          className={`pj-key__r pj-key__r--${r.kind}${focus !== undefined && r.work === focus ? " is-focus" : ""}`}
        />
      ))}
      {[...labels].map(([w, p]) => (
        <text key={w} x={p.x} y={p.y} textAnchor="middle" className="pj-key__n">
          {String(w + 1).padStart(2, "0")}
        </text>
      ))}
    </svg>
  );
};

/**
 * "קטלוג הקיר" (bone): the printed key of the salon hang (a schematic of the wall with every
 * pair numbered), then one museum label per work, each with its real phone screenshot framed at
 * the top: title, field, medium, address (real domains only), description, the outbound link
 * (target=_blank rel=noopener) and the service page it was built under. Phones: a horizontal strip
 * of labels that snaps card by card; desktop: a grid. The wall frames link here (#work-<id>) when
 * JavaScript is off. Static.
 */
const ProjectsCatalogue = () => (
  <section className="nz-section nz-section--space-default pj-cat" data-tone="bone" aria-labelledby="pj-cat-title">
    <div className="nz-container">
      <header className="pj-cat__head">
        <div className="pj-cat__intro">
          <p className="nz-label nz-label--rule">
            <span className="nz-label__index">{c.room}</span>
            <span>{works.length} עבודות</span>
          </p>
          <h2 id="pj-cat-title" className="nz-display nz-display--h2">
            {c.title}
          </h2>
          <p className="pj-cat__lede">{c.lede}</p>
          <p className="pj-cat__services">
            {c.servicesLink.before}
            <a className="pj-inlink" href={c.servicesLink.href}>
              {c.servicesLink.label}
            </a>
            {c.servicesLink.after}
          </p>
        </div>
        <figure className="pj-key">
          <WallKeySvg numbers className="pj-key__svg" />
          <figcaption className="pj-key__cap">{c.keyCaption}</figcaption>
        </figure>
      </header>

      <p className="pj-cat__swipe" aria-hidden="true">
        <span>{c.swipe}</span>
        <span className="pj-cat__swipe-line" />
      </p>
      <ol className="pj-cat__list">
        {works.map((w, i) => (
          <li key={w.id} id={`work-${w.id}`} className="pj-entry">
            <div className="pj-entry__pair">
              <div className="pj-entry__shot">
                <img
                  src={w.desktop.src}
                  srcSet={w.desktop.srcSet}
                  sizes="(min-width: 1280px) 26vw, (min-width: 768px) 44vw, 86vw"
                  width={w.desktop.width}
                  height={w.desktop.height}
                  loading="lazy"
                  decoding="async"
                  alt={`${w.title}: צילום מסך של האתר במחשב`}
                />
              </div>
              <div className="pj-entry__phone">
                <img
                  src={w.mobile.src}
                  srcSet={w.mobile.srcSet}
                  sizes="(min-width: 1024px) 8vw, 24vw"
                  width={w.mobile.width}
                  height={w.mobile.height}
                  loading="lazy"
                  decoding="async"
                  alt={`${w.title}: צילום מסך של האתר בנייד`}
                />
              </div>
            </div>
            <div className="pj-entry__label">
              <div className="pj-entry__top">
                <p className="pj-entry__index">עבודה {String(w.n).padStart(2, "0")}</p>
                <WallKeySvg focus={i} className="pj-entry__key" />
              </div>
              <h3 className="pj-entry__title">{w.title}</h3>
              <dl className="pj-entry__meta">
                <div>
                  <dt>{c.fieldLabel}</dt>
                  <dd>{w.field}</dd>
                </div>
                <div>
                  <dt>{c.mediumLabel}</dt>
                  <dd>{w.medium}</dd>
                </div>
                {w.host && (
                  <div>
                    <dt>{c.addressLabel}</dt>
                    <dd dir="ltr" className="pj-entry__host">
                      {w.host}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="pj-entry__desc">{w.description}</p>
              <div className="pj-entry__links">
                <a className="nz-link pj-entry__link" href={w.link} target="_blank" rel="noopener">
                  <span className="nz-link__text">{c.visit}</span>
                  <ExternalIcon className="nz-link__arrow" />
                  <span className="nz-sr"> {w.title} (נפתח בכרטיסייה חדשה)</span>
                </a>
                <p className="pj-entry__service">
                  <span>{c.serviceLabel}: </span>
                  <a className="pj-inlink" href={w.service.href}>
                    {w.service.label}
                  </a>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default ProjectsCatalogue;
