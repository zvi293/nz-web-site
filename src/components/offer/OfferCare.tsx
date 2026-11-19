import { Reveal } from "@/components/nz";
import { offerPage } from "@/content/offer";

const c = offerPage.care;

/** Orbit diagram: the site (a bubble with the cube) and the subscription as a ring of care. */
const Orbit = () => {
  const n = c.rows.length;
  const R = 158;
  return (
    <svg className="of-orbit" viewBox="0 0 400 400" aria-hidden="true">
      <circle className="of-orbit__ring" cx="200" cy="200" r={R} pathLength={100} />
      <circle className="of-orbit__ring of-orbit__ring--faint" cx="200" cy="200" r={R + 22} />
      <circle className="of-orbit__site" cx="200" cy="200" r="74" />
      <path className="of-orbit__shine" d="M152 168a62 62 0 0 1 40-40" />
      <rect className="of-orbit__cube" x="190" y="190" width="20" height="20" />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 200 - Math.cos(a) * R;
        const y = 200 + Math.sin(a) * R;
        return (
          <g key={i} className="of-orbit__node" style={{ "--i": i } as React.CSSProperties}>
            <circle cx={x} cy={y} r="17" />
            <text x={x} y={y + 5} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * "What the subscription covers" (bone): an orbit diagram (the subscription circles the site)
 * beside a museum "conservation card" whose numbered rows match the orbit's nodes, and a
 * footer of what is NOT included. The orbit draws itself in on reveal (motion-gated). Static.
 */
const OfferCare = () => (
  <section className="nz-section nz-section--space-default of-care" data-tone="bone" aria-labelledby="of-care-title">
    <div className="nz-container of-care__grid">
      <header className="of-care__head">
        <p className="nz-label nz-label--rule">
          <span className="nz-label__index">{c.room}</span>
          <span>{c.eyebrow}</span>
        </p>
        <h2 id="of-care-title" className="nz-display nz-display--h2">
          {c.title}
        </h2>
        <p className="of-care__lede">{c.lede}</p>
      </header>

      <Reveal className="of-care__diagram" variant="fade" margin="0px 0px -15% 0px">
        <Orbit />
      </Reveal>

      <div className="of-card">
        <p className="of-card__head">
          <span className="of-card__title">{c.cardTitle}</span>
          <span className="of-card__sub">{c.cardSub}</span>
        </p>
        <ol className="of-card__rows">
          {c.rows.map((r, i) => (
            <li key={r.name} className="of-card__row">
              <span className="of-card__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="of-card__name">{r.name}</h3>
              <p className="of-card__body">{r.body}</p>
            </li>
          ))}
        </ol>
        <div className="of-card__outside">
          <p className="of-card__outside-title">{c.outside.title}</p>
          <p>{c.outside.body}</p>
        </div>
      </div>
    </div>
  </section>
);

export default OfferCare;
