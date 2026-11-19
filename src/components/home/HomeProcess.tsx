import { useRef } from "react";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Section, Eyebrow, Display, Lede, Reveal } from "@/components/nz";
import { useActiveIndex, useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { processSteps } from "@/content/home";

/**
 * "The making of" — four steps. Desktop: a scroll moment, the art hangs in a sticky
 * frame on the left and changes (curtain wipe) as each step passes the middle of the
 * viewport. Mobile: a stacked editorial layout, each step with its own piece.
 */
const HomeProcess = () => {
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const active = useActiveIndex(() => stepRefs.current, []);
  /* The wiped pieces sit under a full clip-path, which lazy loading treats as invisible —
     so once the (desktop-only) aside nears the viewport, load all four eagerly.
     On mobile the aside is display:none, never intersects, and nothing is fetched. */
  const asideRef = useRef<HTMLDivElement>(null);
  const asideNear = useInView(asideRef, { rootMargin: "60% 0px 60% 0px" });
  const steps = processSteps.steps;

  return (
    <Section id="process" tone="ink" lit aria-labelledby="hm-process-title" className="hm-process">
      <div className="hm-head">
        <Eyebrow index={2} rule>
          {processSteps.eyebrow}
        </Eyebrow>
        <Reveal>
          <Display id="hm-process-title" size="h2" className="hm-head__title">
            {processSteps.title}
          </Display>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="hm-head__lede">{processSteps.lede}</Lede>
        </Reveal>
      </div>

      <div className="hm-process__grid">
        <ol className="hm-process__steps">
          {steps.map((step, i) => (
            <li
              key={step.name}
              ref={(el) => (stepRefs.current[i] = el)}
              className={cn("hm-step", i === active && "is-active")}
            >
              <div className="hm-step__art">
                <Artwork slug={step.art} sizes="(min-width: 768px) 80vw, 100vw" ratio="3 / 2" frame />
              </div>
              <Reveal className="hm-step__body">
                <p className="nz-label">
                  <span className="nz-label__index">שלב {String(i + 1).padStart(2, "0")}</span>
                  <span>מתוך {String(steps.length).padStart(2, "0")}</span>
                </p>
                <h3 className="hm-step__name">{step.name}</h3>
                <p className="hm-step__text">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <div ref={asideRef} className="hm-process__aside" aria-hidden="true">
          <div className="hm-process__sticky">
            <div className="hm-stack hm-stack--wipe">
              {steps.map((step, i) => (
                <div key={step.art} className={cn("hm-stack__item", i === active && "is-active", i < active && "is-past")}>
                  <Artwork slug={step.art} sizes="(min-width: 1440px) 640px, 44vw" ratio="4 / 3" frame alt="" eager={asideNear} />
                </div>
              ))}
            </div>
            <MuseumLabel
              index={active + 1}
              prefix="שלב"
              title={steps[active].name}
              medium={`מתוך האוסף: ${getArt(steps[active].art).title}`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HomeProcess;
