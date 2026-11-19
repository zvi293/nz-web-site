import { offerPage } from "@/content/offer";

const o = offerPage.ownership;

/**
 * Ownership & leaving (ink room): a paper "deed of ownership" with a vermilion seal (what is
 * yours, what the contract fixes in advance), and beside it a fork diagram of what happens if
 * you stop the subscription: one start, two paths agreed in advance, one constant at the
 * bottom (your domain and content stay yours). Static.
 */
const OfferOwnership = () => (
  <section className="nz-section nz-section--space-default of-own" data-tone="ink" aria-labelledby="of-own-title">
    <div className="nz-container">
      <header className="of-own__head">
        <p className="nz-label">
          <span className="nz-label__index">{o.room}</span>
          <span>{o.eyebrow}</span>
        </p>
        <h2 id="of-own-title" className="nz-display nz-display--h2 of-own__title">
          {o.title}
        </h2>
      </header>

      <div className="of-own__grid">
        <article className="of-deed" aria-labelledby="of-deed-title">
          <div className="of-deed__border">
            <p className="of-deed__kicker">NZ-web · הגלריה</p>
            <h3 id="of-deed-title" className="of-deed__title">
              {o.deed.title}
            </h3>
            <p className="of-deed__sub">{o.deed.sub}</p>
            <dl className="of-deed__rows">
              {o.deed.rows.map((r) => (
                <div key={r.term} className="of-deed__row">
                  <dt>{r.term}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
            <p className="of-deed__stamp">
              <span className="of-deed__stamp-big">{o.deed.stamp}</span>
              <span className="of-deed__stamp-small">{o.deed.stampNote}</span>
            </p>
          </div>
        </article>

        <div className="of-exit" aria-labelledby="of-exit-title">
          <h3 id="of-exit-title" className="of-exit__title">
            {o.exit.title}
          </h3>
          <div className="of-fork">
            <p className="of-fork__start">
              <strong>{o.exit.start}</strong>
              <span>{o.exit.startNote}</span>
            </p>
            <span className="of-fork__split" aria-hidden="true" />
            <ul className="of-fork__paths">
              {o.exit.paths.map((p) => (
                <li key={p.title}>
                  <strong>{p.title}</strong>
                  <span>{p.body}</span>
                </li>
              ))}
            </ul>
            <p className="of-fork__note">{o.exit.pathsNote}</p>
            <p className="of-fork__keep">
              <span className="of-fork__keep-cube" aria-hidden="true" />
              {o.exit.keep}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default OfferOwnership;
