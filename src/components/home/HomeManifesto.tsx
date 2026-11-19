import { Section, Eyebrow, Reveal } from "@/components/nz";
import { manifesto } from "@/content/home";

/** An ink room with one sentence about the craft. No claims, no numbers. */
const HomeManifesto = () => (
  <Section tone="ink" aria-labelledby="hm-manifesto-label" className="hm-manifesto">
    <Eyebrow id="hm-manifesto-label" index={4} rule>
      {manifesto.eyebrow}
    </Eyebrow>
    <Reveal as="blockquote" className="hm-manifesto__quote">
      <p className="nz-display hm-manifesto__text">
        {manifesto.lead} <span className="nz-accent">{manifesto.accent}</span>
      </p>
      <footer className="nz-label hm-manifesto__sig">
        <span className="hm-manifesto__cube" aria-hidden="true" />
        <span>
          {manifesto.signature} · <bdi dir="ltr">NZ-web</bdi>
        </span>
      </footer>
    </Reveal>
  </Section>
);

export default HomeManifesto;
