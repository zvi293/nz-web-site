import { useRef } from "react";
import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { Section, Eyebrow, Display, Lede } from "@/components/nz";
import { useActiveIndex, useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { processSteps } from "@/content/home";

/**
 * "The making of" — four steps in the ink room. Opener: the title over a hairline
 * "ruler" that names the four stations. Desktop: a scroll moment — the art hangs in a
 * sticky frame and changes (curtain wipe) as each step passes the middle of the viewport.
 * Mobile: each step is a framed piece with its wall card pinned over the frame's corner,
 * alternating sides along a hairline. SSR: step 01 active; JS only drives the desktop wipe.
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
  const total = String(steps.length).padStart(2, "0");

  return (
    <Section id="process" tone="ink" lit aria-labelledby="hm-process-title" className="hm-process">
      <header className="hm-ruler-head hm-sd">
        <Eyebrow index={processSteps.room} rule>
          {processSteps.eyebrow}
        </Eyebrow>
        <Display id="hm-process-title" size="h2" className="hm-ruler-head__title">
          {processSteps.title}
        </Display>
        <Lede className="hm-ruler-head__lede">{processSteps.lede}</Lede>
        <ol className="hm-ruler" aria-label="ארבעת השלבים">
          {steps.map((step, i) => (
            <li key={step.name} className={cn("hm-ruler__stop", i === active && "is-active")}>
              <span className="hm-ruler__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="hm-ruler__name">{step.name}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="hm-process__grid">
        <ol className="hm-process__steps">
          {steps.map((step, i) => (
            <li
              key={step.name}
              ref={(el) => (stepRefs.current[i] = el)}
              className={cn("hm-step", i % 2 === 1 && "hm-step--alt", i === active && "is-active")}
            >
              <div className="hm-step__art hm-sd">
                <Artwork slug={step.art} sizes="(min-width: 768px) 70vw, 88vw" ratio="4 / 3" frame />
                <span className="hm-step__pin" aria-hidden="true">
                  <span className="hm-step__pin-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hm-step__pin-of">/ {total}</span>
                </span>
              </div>
              <div className="hm-step__body hm-sd">
                <p className="nz-label">
                  <span className="nz-label__index">שלב {String(i + 1).padStart(2, "0")}</span>
                  <span>מתוך {total}</span>
                </p>
                <h3 className="hm-step__name">{step.name}</h3>
                <p className="hm-step__text">{step.body}</p>
              </div>
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
            <div className="hm-process__meter">
              <span className="hm-process__meter-fill" style={{ ["--p" as string]: (active + 1) / steps.length }} />
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
