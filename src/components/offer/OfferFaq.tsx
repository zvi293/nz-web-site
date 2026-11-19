import { Button, WhatsAppCta } from "@/components/nz";
import { offerPage, offerPageFaq } from "@/content/offer";

const f = offerPage.faq;

/**
 * Offer FAQ (bone): a pull-quote opener (the H2 set as a huge serif line), then native <details> questions — verbatim from `offerPageFaq`, which the
 * page also emits as FAQPage JSON-LD in the same order — and a closing WhatsApp nudge. Static.
 */
const OfferFaq = () => (
  <section className="nz-section nz-section--space-default of-faq" data-tone="bone" aria-labelledby="of-faq-title">
    <div className="nz-container of-faq__grid">
      <header className="of-faq__head">
        <p className="nz-label">
          <span className="nz-label__index">{f.room}</span>
          <span>{f.eyebrow}</span>
        </p>
        <h2 id="of-faq-title" className="of-faq__quote">
          {f.quote}
        </h2>
        <Button to={f.allLink.href} variant="quiet" className="of-faq__all">
          {f.allLink.label}
        </Button>
      </header>

      <div className="of-faq__main">
        <div className="of-faq__list">
          {offerPageFaq.map((item, i) => (
            <details key={item.question} className="of-qa" name="of-faq">
              <summary className="of-qa__q">
                <span className="of-qa__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="of-qa__text">{item.question}</span>
                <span className="of-qa__icon" aria-hidden="true" />
              </summary>
              <div className="of-qa__a">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <aside className="of-nudge" aria-labelledby="of-nudge-title">
          <p id="of-nudge-title" className="of-nudge__title">
            {f.nudgeTitle}
          </p>
          <p className="of-nudge__body">{f.nudgeBody}</p>
          <WhatsAppCta label={f.nudgeCta} message={f.nudgeMessage} variant="secondary" />
          <p className="of-nudge__alt">
            {f.contactLink.before}
            <a className="of-inlink" href={f.contactLink.href}>
              {f.contactLink.label}
            </a>
            {f.contactLink.after}
          </p>
        </aside>
      </div>
    </div>
  </section>
);

export default OfferFaq;
