// Signature component: שורות נגדיות — scroll-linked counter-drift
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { manifesto } from "@/content/home";

/** A hand-painted vermilion stroke that paints itself under the last word. */
const BrushStroke = () => (
  <svg className="hm-brush" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path
      d="M6 21.5c38-6.2 79-9.4 121-10.4 52-1.3 101 1.6 151 3.9 36 1.6 75 2.7 115 1.2-34 3.6-70 6.6-108 8.5-56 2.7-110 1.6-165 .6-37-.7-76-.5-114 3.4z"
      fill="currentColor"
    />
    <path d="M22 26.5c64-3.5 132-4.3 199-2.4 50 1.4 101 2.2 151-.4-49 4.8-101 6.5-153 6.1-66-.5-131-1.6-197-3.3z" fill="currentColor" opacity=".55" />
  </svg>
);

/**
 * The ink room with one sentence. Signature: "שורות נגדיות" — the sentence is set as
 * huge serif lines that slide in opposite directions while the room passes through the
 * viewport (CSS scroll-driven animation, no JS); a vermilion brush paints under "במקומו".
 * The drift only ever moves a line inward from its aligned edge, so no line leaves the
 * gutter. On phones each line splits into its segments (two or three words each), and
 * the segments drift; from 768px the segments of a line join and whole lines drift.
 * A detail of one piece and the founder's signature close the room.
 * Fully static: no client JS. Without scroll-timeline support or with reduced motion,
 * the lines simply sit in their final, aligned places.
 */
const HomeManifesto = () => {
  const detail = getArt(manifesto.detail.slug);
  const lastLine = manifesto.lines.length - 1;
  let seg = 0;
  return (
    <section className="nz-section nz-section--space-default hm-manifesto" data-tone="ink" aria-labelledby="hm-manifesto-label">
      <div className="nz-container hm-manifesto__grid">
        <p id="hm-manifesto-label" className="nz-label nz-label--rule hm-manifesto__label">
          <span className="nz-label__index">{manifesto.room}</span>
          <span>{manifesto.eyebrow}</span>
        </p>

        <blockquote className="hm-manifesto__quote">
          <p className="nz-display hm-manifesto__text">
            {manifesto.lines.map((segments, li) => (
              <span key={segments.join(" ")} className={`hm-drift hm-drift--${li % 2 === 0 ? "a" : "b"}`}>
                {segments.map((text, si) => {
                  const parity = seg++ % 2 === 0 ? "a" : "b";
                  const isLast = li === lastLine && si === segments.length - 1;
                  return (
                    <span key={text} className={`hm-drift__seg hm-drift__seg--${parity}`}>
                      {text}
                      {isLast && (
                        <>
                          {" "}
                          <span className="hm-manifesto__accent">
                            <span className="nz-accent">{manifesto.accent}</span>
                            <BrushStroke />
                          </span>
                        </>
                      )}{" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </p>
          <footer className="hm-manifesto__sig">
            <span className="hm-manifesto__name">{manifesto.signature}</span>
            <span className="nz-label hm-manifesto__role">
              <span className="hm-cube" aria-hidden="true" />
              <span>
                {manifesto.signatureRole} <bdi dir="ltr">NZ-web</bdi>
              </span>
            </span>
          </footer>
        </blockquote>

        <figure className="hm-manifesto__detail">
          <Artwork
            slug={manifesto.detail.slug}
            sizes="(min-width: 1024px) 30vw, 92vw"
            frame
            alt={detail.alt}
            className="hm-static-art"
          />
          <MuseumLabel
            as="figcaption"
            index={manifesto.detail.prefix}
            prefix=""
            title={detail.title}
            medium={manifesto.detail.medium}
          />
        </figure>
      </div>
    </section>
  );
};

export default HomeManifesto;
