import type { ReactNode } from "react";
import { notFoundCopy } from "./copy";

const g = notFoundCopy.gates;

/** The ink room that hosts the PortalTunnel island (children from the .astro page). Static. */
const NotFoundGates = ({ children }: { children?: ReactNode }) => (
  <section id="gates" className="nz-section nz-section--space-default nf-gates" data-tone="ink" aria-labelledby="nf-gates-title">
    <div className="nz-container">
      <header className="nf-gates__head">
        <p className="nz-label nz-label--rule">
          <span className="nz-label__index">∅</span>
          <span>{g.eyebrow}</span>
        </p>
        <h2 id="nf-gates-title" className="nz-display nz-display--h2">
          {g.title}
        </h2>
        <p className="nf-gates__hint">{g.hint}</p>
      </header>
      {children}
    </div>
  </section>
);

export default NotFoundGates;
