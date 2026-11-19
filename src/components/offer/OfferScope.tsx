import type { ReactNode } from "react";
import { offerPage } from "@/content/offer";

const c = offerPage.scope;

/**
 * The room that hosts the signature (ScopeBubble island, passed in as children from the
 * .astro page). Opener: a stacked label with the vermilion cube, the H2, the lede, and a
 * three-beat "how it works" strip drawn as a hairline with three stops. After the island, one
 * line that walks on to the collection. Static.
 */
const OfferScope = ({ children }: { children?: ReactNode }) => (
  <section id="scope" className="nz-section nz-section--space-default of-scope" data-tone="bone" aria-labelledby="of-scope-title">
    <div className="nz-container">
      <header className="of-scope__head">
        <p className="of-stack-label">
          <span className="of-stack-label__cube" aria-hidden="true" />
          <span>{c.room}</span>
          <span className="of-stack-label__name">{c.eyebrow}</span>
        </p>
        <h2 id="of-scope-title" className="nz-display nz-display--h2 of-scope__title">
          {c.title}
        </h2>
        <p className="of-scope__lede">{c.lede}</p>
        <ol className="of-beats" aria-label="איך זה עובד">
          {c.beats.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ol>
      </header>
      {children}
      <p className="of-scope__after">
        {c.seeWorks.before}
        <a className="of-inlink" href={c.seeWorks.href}>
          {c.seeWorks.label}
        </a>
        {c.seeWorks.after}
      </p>
    </div>
  </section>
);

export default OfferScope;
