import { Artwork } from "@/components/art";
import { ArrowIcon, studio } from "@/components/nz";
import { contactInfo, getMailtoHref, getTelHref } from "@/lib/contact-utils";
import { thanksCopy } from "./copy";

const m = thanksCopy.meanwhile;

/**
 * "Meanwhile" (bone): three rooms of the gallery to wander into while you wait — each a small
 * hung piece (the room's own artwork as a thumbnail: a compact row on phones, a frame from 640px)
 * with a door-plate label — and a quiet
 * contact strip (phone, e-mail, hours) for when WhatsApp did not open. Static.
 */
const ThanksMeanwhile = () => (
  <section className="nz-section nz-section--space-default ty-more" data-tone="bone" aria-labelledby="ty-more-title">
    <div className="nz-container">
      <h2 id="ty-more-title" className="nz-display nz-display--h2 ty-more__title">
        {m.title}
      </h2>
      <ul className="ty-rooms">
        {m.rooms.map((r, i) => (
          <li key={r.href} className="ty-room">
            <a href={r.href} className="ty-room__link">
              <span className="ty-room__art" aria-hidden="true">
                <Artwork slug={r.art} sizes="(min-width: 1024px) 26vw, (min-width: 640px) 30vw, 120px" ratio="4 / 3" frame hover alt="" />
              </span>
              <span className="ty-room__plate">
                <span className="ty-room__label">
                  <span className="ty-room__i">{String(i + 1).padStart(2, "0")}</span>
                  {r.label}
                </span>
                <span className="ty-room__title">{r.title}</span>
                <span className="ty-room__body">{r.body}</span>
                <ArrowIcon className="ty-room__arrow" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="ty-contact">
        <div className="ty-contact__head">
          <p className="ty-contact__title">{m.contactTitle}</p>
          <p className="ty-contact__body">{m.contactBody}</p>
        </div>
        <ul className="ty-contact__list">
          <li>
            <span>טלפון</span>
            <a href={getTelHref(contactInfo.phone)} dir="ltr">
              {contactInfo.phone}
            </a>
          </li>
          <li>
            <span>מייל</span>
            <a href={getMailtoHref(studio.email)} dir="ltr">
              {studio.email}
            </a>
          </li>
          <li>
            <span>שעות</span>
            <span>
              {studio.days} <bdi dir="ltr">{studio.time}</bdi>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

export default ThanksMeanwhile;
