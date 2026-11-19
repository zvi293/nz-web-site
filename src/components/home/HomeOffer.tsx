import { Section, Eyebrow, Display, Lede, Button, WhatsAppCta, Reveal } from "@/components/nz";
import { offer } from "@/content/offer";

/** "ההצעה" — one tailored offer: how it works and the building blocks. No prices, no tiers. */
const HomeOffer = () => (
  <Section id="pricing" tone="paper" aria-labelledby="hm-offer-title" className="hm-offer">
    <div className="hm-head">
      <Eyebrow index={5} rule>
        {offer.eyebrow}
      </Eyebrow>
      <Reveal>
        <Display id="hm-offer-title" size="h2" className="hm-head__title">
          {offer.title}
        </Display>
      </Reveal>
      <Reveal delay={80}>
        <Lede className="hm-head__lede">{offer.lede}</Lede>
      </Reveal>
    </div>

    <Reveal as="ol" variant="stagger" className="hm-offer__parts">
      {offer.parts.map((part, i) => (
        <li key={part.kicker} className="hm-offer__part">
          <p className="nz-label">
            <span className="nz-label__index">{String(i + 1).padStart(2, "0")}</span>
            <span>{part.kicker}</span>
          </p>
          <h3 className="hm-offer__part-title">{part.title}</h3>
          <p className="hm-offer__part-body">{part.body}</p>
        </li>
      ))}
    </Reveal>

    <div className="hm-scope">
      <div className="hm-scope__intro">
        <h3 className="hm-scope__title">{offer.scopeTitle}</h3>
        <p className="hm-scope__note">{offer.scopeNote}</p>
      </div>
      <dl className="hm-scope__groups">
        {offer.scope.map((group) => (
          <div key={group.title} className="hm-scope__group">
            <dt className="hm-scope__group-title">{group.title}</dt>
            <dd className="hm-scope__chips">
              <ul>
                {group.items.map((item) => (
                  <li key={item} className="hm-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>

    <div className="hm-offer__ctas">
      <WhatsAppCta label="לקבלת הצעה אישית בוואטסאפ" message={offer.whatsappMessage} size="lg" />
      <Button to={offer.cta.href} variant="quiet">
        {offer.cta.label}
      </Button>
    </div>
  </Section>
);

export default HomeOffer;
