// Signature component: מגירת הכרטיסים — riffle a card-catalogue drawer (scrub along the card tops)
import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { altParts } from "./alt-parts";

/**
 * "The card drawer" — the glossary's signature (/glossary/). A library card-catalogue drawer holds
 * one index card per term, standing in alphabetical order; guide cards with taller tabs carry the
 * letters, like a real catalogue — their tabs stand at three heights in turn (like guides cut in
 * thirds), so neighbouring letters never collide even on a 360px phone. Run a thumb (or the mouse) along the card tops and the drawer
 * riffles: the card under the finger rises out of the drawer and is read on the large card above
 * (term, the other name, field, definition), its neighbours lift a little in a wave. "ראו גם" on
 * the card are cross-reference tabs: tap one and the drawer riffles to that card. The full entry in
 * the list below is one link away (#term-<slug>).
 * Keyboard: the card row is a slider (←/↓ next, →/↑ previous, PageDown/PageUp next/previous
 * letter, Home/End); plus "הקודם / הבא" buttons. The settled card is announced (aria-live).
 * No JS: the first card shows with a pointer to the list (the row and buttons are hidden).
 * Reduced motion: cards swap without rising.
 */

export interface DrawerTerm {
  slug: string;
  name: string;
  alt?: string;
  tag: string;
  definition: string;
  letter: string;
  seeAlso: { slug: string; name: string }[];
}

interface Props {
  terms: DrawerTerm[];
}

const GlossaryDrawer = ({ terms }: Props) => {
  const [i, setI] = useState(0);
  const [riffling, setRiffling] = useState(false);
  const [announce, setAnnounce] = useState("");
  const rowRef = useRef<HTMLDivElement>(null);
  const settle = useRef(0);
  const total = terms.length;
  const t = terms[i];
  const index = useMemo(() => new Map(terms.map((x, k) => [x.slug, k])), [terms]);
  const guides = useMemo(() => terms.map((x, k) => k === 0 || terms[k - 1].letter !== x.letter), [terms]);
  /* the tab height of each guide card: 0, 1, 2, 0, … in letter order */
  const tiers = useMemo(() => {
    let g = -1;
    return guides.map((isGuide) => (isGuide ? ++g % 3 : 0));
  }, [guides]);

  /* announce the card once the riffle settles (not on the first render) */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => setAnnounce(`${t.name}: ${t.definition}`), 450);
    return () => window.clearTimeout(settle.current);
  }, [t]);

  const go = (k: number) => setI(Math.max(0, Math.min(total - 1, k)));

  const fromX = (x: number) => {
    const r = rowRef.current?.getBoundingClientRect();
    if (!r) return i;
    /* RTL: the first card (א) stands at the right */
    return Math.floor(((r.right - x) / r.width) * total);
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    rowRef.current?.setPointerCapture(e.pointerId);
    setRiffling(true);
    go(fromX(e.clientX));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (riffling) go(fromX(e.clientX));
  };
  const onUp = () => setRiffling(false);

  const nextLetter = (dir: 1 | -1) => {
    let k = i;
    const cur = terms[i].letter;
    if (dir === 1) {
      while (k < total - 1 && terms[k].letter === cur) k++;
    } else {
      k = i - 1;
      while (k > 0 && !guides[k]) k--;
      if (k >= 0 && terms[k].letter === cur) {
        k--;
        while (k > 0 && !guides[k]) k--;
      }
    }
    go(k);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, () => void> = {
      ArrowLeft: () => go(i + 1),
      ArrowDown: () => go(i + 1),
      ArrowRight: () => go(i - 1),
      ArrowUp: () => go(i - 1),
      Home: () => go(0),
      End: () => go(total - 1),
      PageDown: () => nextLetter(1),
      PageUp: () => nextLetter(-1),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className={`gl-cat${riffling ? " is-riffling" : ""}`}>
      <div className="gl-cat__stage">
        <article key={t.slug} className="gl-card" aria-labelledby="gl-card-name">
          <p className="gl-card__top">
            <span className="gl-card__letter">{t.letter}</span>
            <span className="gl-card__tag">{t.tag}</span>
            <span className="gl-card__no" dir="ltr">
              {String(i + 1).padStart(2, "0")} / {total}
            </span>
          </p>
          <h3 id="gl-card-name" className="gl-card__name">
            {t.name}
          </h3>
          {t.alt && (
            <p className="gl-card__alt" dir="auto">
              {altParts(t.alt).map((p, k) => (
                <Fragment key={k}>
                  {k > 0 && " · "}
                  {p.en ? (
                    <span lang="en" dir="ltr">
                      {p.text}
                    </span>
                  ) : (
                    p.text
                  )}
                </Fragment>
              ))}
            </p>
          )}
          <p className="gl-card__def">{t.definition}</p>
          {t.seeAlso.length > 0 && (
            <div className="gl-card__xref">
              <span className="gl-card__k">ראו גם</span>
              {t.seeAlso.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  className="gl-xref"
                  onClick={() => {
                    const k = index.get(s.slug);
                    if (k !== undefined) go(k);
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <a className="gl-card__link" href={`#term-${t.slug}`}>
            לרשומה במילון
          </a>
          <span className="gl-card__hole" aria-hidden="true" />
        </article>
      </div>

      <div className="gl-cat__drawer">
        <div
          ref={rowRef}
          className="gl-cat__row"
          role="slider"
          tabIndex={0}
          aria-label="מגירת הכרטיסים: דפדפו בין המונחים"
          aria-orientation="horizontal"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={i + 1}
          aria-valuetext={`${t.name}, כרטיס ${i + 1} מתוך ${total}`}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {terms.map((x, k) => {
            const d = Math.abs(k - i);
            return (
              <span
                key={x.slug}
                className={`gl-cat__c${k === i ? " is-up" : ""}${guides[k] ? " is-guide" : ""}`}
                style={{
                  ["--lift" as string]: String(Math.max(0, 3 - d)),
                  ...(guides[k] ? { ["--tier" as string]: String(tiers[k]) } : {}),
                }}
              >
                {guides[k] && <b>{x.letter}</b>}
              </span>
            );
          })}
        </div>
        <div className="gl-cat__front" aria-hidden="true">
          <span className="gl-cat__plate">
            <span>א–ת · A–Z</span>
            <span className="gl-cat__plate-n">{total} כרטיסים</span>
          </span>
          <span className="gl-cat__pull" />
        </div>
      </div>

      <div className="gl-cat__nav">
        <button type="button" className="gl-cat__btn" onClick={() => go(i - 1)} disabled={i === 0}>
          <span aria-hidden="true">→</span> הקודם
        </button>
        <p className="gl-cat__hint">העבירו אצבע על ראשי הכרטיסים</p>
        <button type="button" className="gl-cat__btn" onClick={() => go(i + 1)} disabled={i === total - 1}>
          הבא <span aria-hidden="true">←</span>
        </button>
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default GlossaryDrawer;
