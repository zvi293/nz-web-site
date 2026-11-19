import { Button, WhatsAppCta } from "@/components/nz";
import { offerFaq } from "@/content/offer";
import { faqBlock } from "@/content/home";

/**
 * Short FAQ (process & offer) as an editorial composition: a sticky column with the title
 * and a short lede (desktop), serif questions as native <details> that open with a smooth
 * height transition where supported, the link to the full FAQ, and a closing WhatsApp note.
 * The DOM follows the reading order (title → questions → link → note) for keyboard users.
 * The FAQPage JSON-LD is emitted by the page from the same `offerFaq` data — keep the
 * visible question/answer text identical (it is rendered verbatim here). Static (no client JS).
 */
const HomeFaq = () => (
  <section id="faq" className="nz-section nz-section--space-default hm-faq" data-tone="paper" aria-labelledby="hm-faq-title">
    <div className="nz-container hm-faq__grid">
      <div className="hm-faq__aside">
        <div className="hm-faq__sticky">
          <p className="nz-label nz-label--rule">
            <span className="nz-label__index">{faqBlock.room}</span>
            <span>{faqBlock.eyebrow}</span>
          </p>
          <h2 id="hm-faq-title" className="nz-display nz-display--h2 hm-faq__title">
            {faqBlock.title}
          </h2>
          <p className="hm-faq__lede">{faqBlock.lede}</p>
        </div>
      </div>

      <div className="hm-faq__main">
        <ul className="hm-faq__list">
          {offerFaq.map((item) => (
            <li key={item.question} className="hm-sd">
              <details className="hm-qa" name="hm-faq">
                <summary className="hm-qa__q">
                  <span className="hm-qa__text">{item.question}</span>
                  <span className="hm-qa__icon" aria-hidden="true" />
                </summary>
                <div className="hm-qa__a">
                  <p>{item.answer}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <Button href={faqBlock.allLink.href} variant="quiet" className="hm-faq__all">
          {faqBlock.allLink.label}
        </Button>

        <aside className="hm-nudge hm-sd" aria-labelledby="hm-nudge-title">
          <div className="hm-nudge__text">
            <p id="hm-nudge-title" className="hm-nudge__title">
              {faqBlock.nudge.title}
            </p>
            <p className="hm-nudge__body">{faqBlock.nudge.body}</p>
          </div>
          <WhatsAppCta label={faqBlock.nudge.cta} message={faqBlock.nudge.message} className="hm-nudge__cta" />
        </aside>
      </div>
    </div>
  </section>
);

export default HomeFaq;
