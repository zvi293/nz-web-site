import type { ReactNode } from "react";
import { projectsCopy } from "./copy";

const c = projectsCopy.wall;

/**
 * The salon room (ink) that hosts the SalonWall island (children from the .astro page).
 * Opener: a hairline with the room name on one side and the hint on the other, the H2 set
 * small and centred above the hang, like the title painted on a museum wall. Static.
 */
const ProjectsSalon = ({ children }: { children?: ReactNode }) => (
  <section id="salon" className="nz-section pj-salon" data-tone="ink" aria-labelledby="pj-salon-title">
    <div className="nz-container">
      <header className="pj-salon__head">
        <p className="pj-salon__room">
          <span className="pj-salon__cube" aria-hidden="true" />
          {c.eyebrow}
        </p>
        <h2 id="pj-salon-title" className="nz-display pj-salon__title">
          {c.title}
        </h2>
        <p className="pj-salon__hint">{c.hint}</p>
      </header>
      {children}
    </div>
  </section>
);

export default ProjectsSalon;
