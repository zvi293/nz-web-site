import { Section, Eyebrow, Display, Button } from "@/components/nz";
import { offerFaq } from "@/content/offer";
import { faqBlock } from "@/content/home";

/** Short FAQ (process & offer) as native <details>. The FAQPage JSON-LD is emitted by the page from the same data. */
const HomeFaq = () => (
  <Section id="faq" tone="paper" aria-labelledby="hm-faq-title" className="hm-faq">
    <div className="hm-faq__grid">
      <div className="hm-faq__head">
        <Eyebrow index={7} rule>
          {faqBlock.eyebrow}
        </Eyebrow>
        <Display id="hm-faq-title" size="h2" className="hm-head__title">
          {faqBlock.title}
        </Display>
        <Button to={faqBlock.allLink.href} variant="quiet" className="mt-4">
          {faqBlock.allLink.label}
        </Button>
      </div>
      <div className="hm-faq__list">
        {offerFaq.map((item) => (
          <details key={item.question} className="hm-qa">
            <summary className="hm-qa__q">
              <span>{item.question}</span>
              <span className="hm-qa__icon" aria-hidden="true" />
            </summary>
            <p className="hm-qa__a">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </Section>
);

export default HomeFaq;
