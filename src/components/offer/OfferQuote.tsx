import type { CSSProperties } from "react";
import { offerPage } from "@/content/offer";

const q = offerPage.quote;

/* Widths of the grey "text" bars under each heading of the mock quote (%, no numbers shown). */
const BARS = [
  [92, 74],
  [86, 62],
  [90, 58],
  [74, 52],
  [88, 66],
];

/**
 * "What you'll find in the quote" (paper): the written quote drawn as one sheet of paper, annotated
 * like a proof — every part of the sheet carries a vermilion marker and, in the margin, a hand-set
 * note that explains it (beside the sheet on desktop, pinned over its edge on phones). Grey bars
 * stand for text — the mock never shows an amount. Static.
 */
const OfferQuote = () => (
  <section className="nz-section nz-section--space-default of-quote" data-tone="paper" aria-labelledby="of-quote-title">
    <div className="nz-container of-quote__grid">
      <header className="of-quote__head">
        <p className="nz-label nz-label--rule">
          <span className="nz-label__index">{q.room}</span>
          <span>{q.eyebrow}</span>
        </p>
        <h2 id="of-quote-title" className="nz-display nz-display--h2">
          {q.title}
        </h2>
        <p className="of-quote__lede">{q.lede}</p>
        <p className="of-quote__cost">
          {q.costLink.before}
          <a className="of-inlink" href={q.costLink.href}>
            {q.costLink.label}
          </a>
          {q.costLink.after}
        </p>
      </header>

      <div className="of-proof">
        <div className="of-proof__paper" aria-hidden="true" />
        <div className="of-proof__top" aria-hidden="true">
          <p className="of-paper__letterhead">
            <span className="of-paper__logo">
              NZ-web<span className="of-paper__cube" />
            </span>
            <span className="of-paper__doc">{q.sheetHead}</span>
          </p>
          <p className="of-paper__to">{q.sheetTo}</p>
        </div>
        {q.notes.map((note, i) => (
          <div key={note.line} className="of-proof__part" style={{ "--r": i + 2 } as CSSProperties}>
            <div className="of-proof__line" aria-hidden="true">
              <span className="of-paper__marker">{i + 1}</span>
              <p className="of-paper__h">{note.line}</p>
              {BARS[i % BARS.length].map((w, k) => (
                <span key={k} className="of-paper__bar" style={{ inlineSize: `${w}%` }} />
              ))}
            </div>
            <div className="of-proof__note">
              <h3 className="of-proof__title">
                <span className="nz-sr">{i + 1}. </span>
                {note.title}
              </h3>
              <p className="of-proof__body">{note.body}</p>
            </div>
          </div>
        ))}
        <div className="of-proof__sign" aria-hidden="true" style={{ "--r": q.notes.length + 2 } as CSSProperties}>
          <span>{q.sign}</span>
          <span className="of-paper__sign-line" />
        </div>
      </div>
    </div>
  </section>
);

export default OfferQuote;
