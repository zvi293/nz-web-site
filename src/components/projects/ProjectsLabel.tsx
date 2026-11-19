import { Fragment } from "react";
import { projectsCopy } from "./copy";

const c = projectsCopy.label;

/**
 * "How to read a label" (paper): one museum wall label blown up to poster size, with the
 * curator's pencil notes beside each line (a hand-drawn hook connects them; under each line on
 * phones). Below it the "materials" line that every work in the collection shares, set as a
 * colophon in serif with vermilion separators. The notes ink in one after another on reveal. Static.
 */
const ProjectsLabel = () => (
  <section className="nz-section nz-section--space-default pj-label" data-tone="paper" aria-labelledby="pj-label-title">
    <div className="nz-container pj-label__grid">
      <header className="pj-label__head">
        <p className="pj-label__room">
          <span className="pj-label__rule" aria-hidden="true" />
          {c.room}
        </p>
        <h2 id="pj-label-title" className="nz-display nz-display--h2">
          {c.title}
        </h2>
        <p className="pj-label__lede">{c.lede}</p>
      </header>

      <div className="pj-poster" data-reveal="fade" data-reveal-margin="0px 0px -20% 0px">
        <div className="pj-poster__card">
          {c.lines.map((l, i) => (
            <div key={l.text} className={`pj-poster__line pj-poster__line--${i}`} style={{ "--i": i } as React.CSSProperties}>
              <p className={`pj-poster__text${l.big ? " is-big" : ""}`}>{l.text}</p>
              <p className="pj-poster__note">
                <svg className="pj-poster__hook" viewBox="0 0 48 20" aria-hidden="true">
                  <path d="M47 2C30 2 22 4 14 10S5 18 1 18" />
                  <path d="M1 18l6-5M1 18l7 2" />
                </svg>
                <span>{l.note}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pj-materials">
        <p className="pj-materials__title">{c.materialsTitle}</p>
        <p className="pj-materials__line">
          {c.materials.map((m, i) => (
            <Fragment key={m}>
              {i > 0 && (
                <span className="pj-materials__sep" aria-hidden="true">
                  {" · "}
                </span>
              )}
              <span className="pj-materials__item">{m}</span>
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  </section>
);

export default ProjectsLabel;
