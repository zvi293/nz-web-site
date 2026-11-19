import { Button, WhatsAppCta } from "@/components/nz";
import { projectsCopy } from "./copy";
import { works } from "./works";

const c = projectsCopy.next;

/**
 * Closing room (ink): an empty frame hangs from a nail on a wire, its mat dashed, waiting —
 * "the next wall is reserved for your business", numbered after the last real work. The CTA sits
 * inside the frame. The wire swings in once on reveal. Static.
 */
const ProjectsNext = () => (
  <section id="next" className="nz-section nz-section--space-default pj-next" data-tone="ink" aria-labelledby="pj-next-title">
    <div className="nz-container pj-next__wrap">
      <div className="pj-next__hang" data-reveal="fade">
        <svg className="pj-next__wire" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M100 6 L8 58 M100 6 L192 58" />
          <circle cx="100" cy="6" r="4" />
        </svg>
        <div className="pj-next__frame">
          <div className="pj-next__mat">
            <p className="nz-label pj-next__room">
              <span className="nz-label__index">{String(works.length + 1).padStart(2, "0")}</span>
              <span>{c.room}</span>
            </p>
            <h2 id="pj-next-title" className="nz-display pj-next__title">
              {c.title}
            </h2>
            <p className="pj-next__body">{c.body}</p>
            <div className="pj-next__ctas">
              <WhatsAppCta label={c.cta} message={c.message} size="lg" />
              <Button to={c.offer.href} variant="quiet">
                {c.offer.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ProjectsNext;
