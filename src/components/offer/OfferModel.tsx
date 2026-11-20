import { Reveal } from "@/components/nz";
import { offerPage } from "@/content/offer";

const m = offerPage.model;

/** The mark drawn on the time line for each kind of step. */
const Node = ({ kind }: { kind: string }) => {
  if (kind === "launch") return <span className="of-line__node of-line__node--cube" aria-hidden="true" />;
  if (kind === "quote")
    return (
      <span className="of-line__node of-line__node--sheet" aria-hidden="true">
        <svg viewBox="0 0 16 20" width="16" height="20">
          <path d="M1.5 1.5h9l4 4v13h-13z" />
          <path d="M4.5 9h7M4.5 12h7M4.5 15h4" />
        </svg>
      </span>
    );
  if (kind === "setup" || kind === "care") return null;
  return <span className="of-line__node" aria-hidden="true" />;
};

/**
 * "Two parts, one time line" (ink room): the offer drawn as a time line, not as text.
 * talk → written quote → setup (a solid vermilion bar = paid once, with its four stages
 * ticked on it) → launch (the brand cube) → the optional subscription (the line turns
 * into a dotted run of months that fades out) → the exit note. Vertical on phones,
 * horizontal (right → left) from 1024px. Then the "formula" of what sets the quote.
 * The line draws itself in when it enters the viewport (Reveal + CSS, motion-gated). Static.
 */
const OfferModel = () => (
  <section className="nz-section nz-section--space-default of-model" data-tone="ink" aria-labelledby="of-model-title">
    <div className="nz-container">
      <header className="of-split">
        <p className="nz-label of-split__label">
          <span className="nz-label__index">{m.room}</span>
          <span>{m.eyebrow}</span>
        </p>
        <h2 id="of-model-title" className="nz-display nz-display--h2 of-split__title">
          {m.title}
        </h2>
        <p className="of-split__lede">{m.lede}</p>
      </header>

      <Reveal as="ol" variant="fade" className="of-line" margin="0px 0px -20% 0px">
        {m.steps.map((s, i) => (
          <li key={s.kind} className={`of-line__step of-line__step--${s.kind}`} style={{ "--i": i } as React.CSSProperties}>
            <div className="of-line__mark">
              <Node kind={s.kind} />
              {s.kind === "setup" && (
                <span className="of-line__bar" aria-hidden="true">
                  {m.stages.map((st) => (
                    <span key={st} className="of-line__tick">
                      <span>{st}</span>
                    </span>
                  ))}
                </span>
              )}
              {s.kind === "care" && (
                <span className="of-line__months" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, k) => (
                    <span key={k} className="of-line__moon" style={{ "--k": k } as React.CSSProperties} />
                  ))}
                </span>
              )}
            </div>
            <div className="of-line__text">
              <h3 className="of-line__title">
                {s.title}
                {"tag" in s && s.tag && <span className={`of-line__tag of-line__tag--${s.kind}`}>{s.tag}</span>}
              </h3>
              <p className="of-line__body">{s.body}</p>
              {s.kind === "setup" && (
                <p className="nz-sr">שלבי ההקמה: {m.stages.join(", ")}.</p>
              )}
            </div>
          </li>
        ))}
      </Reveal>

      <p className="of-line__exit">
        <svg className="of-line__fork" viewBox="0 0 40 24" width="40" height="24" aria-hidden="true">
          <path d="M39 12H22c-6 0-8-10-15-10H1M22 12c-6 0-8 10-15 10H1" />
        </svg>
        <span>{m.exit}</span>
      </p>

      <div className="of-formula">
        <p className="nz-label nz-label--rule of-formula__label">{m.formula.title}</p>
        <p className="of-formula__eq">
          {/* read as one sentence; the visual "+ / =" equation is hidden from assistive tech */}
          <span className="nz-sr">{`${m.formula.terms.join(" ועוד ")} שווה ${m.formula.result}`}</span>
          {m.formula.terms.map((t, i) => (
            <span key={t} className="of-formula__term" aria-hidden="true">
              {i > 0 && <span className="of-formula__op">+</span>}
              {t}
            </span>
          ))}
          <span className="of-formula__term of-formula__term--result" aria-hidden="true">
            <span className="of-formula__op">=</span>
            <span className="of-formula__result">{m.formula.result}</span>
          </span>
        </p>
        <p className="of-formula__note">
          {m.formula.note} {m.formula.link.before}
          <a className="of-inlink" href={m.formula.link.href}>
            {m.formula.link.label}
          </a>
          {m.formula.link.after}
        </p>
      </div>
    </div>
  </section>
);

export default OfferModel;
