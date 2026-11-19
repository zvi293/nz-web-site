import { contactInfo, getMailtoHref, getTelHref } from "@/lib/contact-utils";
import { Wordmark, WhatsAppCta, serviceNav, studioNav, legalNav, studio } from "@/components/nz";

/**
 * The night room. Ink ground, the studio line, four quiet columns, and the
 * wordmark set huge across the bottom like the signature on a canvas.
 * The Zstore AI credit pill (white, fully rounded, logo only) stays exactly as the
 * owner wants it.
 * Rendered as static HTML by BaseLayout (no client directive, zero JS).
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="nz-footer" data-tone="ink" aria-labelledby="footer-title">
      <h2 id="footer-title" className="nz-sr">
        NZ-web, סטודיו לעיצוב ובניית אתרים
      </h2>

      <div className="nz-container pt-[72px] md:pt-[120px]">
        {/* Studio line + CTA */}
        <div className="grid gap-10 border-b border-line-ink pb-14 md:grid-cols-12 md:gap-12 md:pb-20">
          <p className="nz-display nz-display--h3 !font-light md:col-span-7 md:!text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] md:leading-[1.15]">
            סטודיו לעיצוב ובניית אתרים לעסקים. כל אתר מתוכנן, מעוצב ונבנה בהתאמה אישית, מהסקיצה הראשונה ועד ההשקה.
          </p>
          <div className="flex flex-col items-start gap-1 md:col-span-4 md:col-start-9 md:justify-end">
            <WhatsAppCta variant="quiet" label="לשיחה בוואטסאפ" />
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-12 md:py-20">
          <nav aria-labelledby="ft-services" className="col-span-2 sm:col-span-1 md:col-span-4">
            <p id="ft-services" className="nz-footer__col-title">
              שירותים
            </p>
            <ul className="nz-footer__links">
              {serviceNav.map((s) => (
                <li key={s.href}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
              <li>
                <a href="/services/">כל השירותים</a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="ft-studio" className="md:col-span-3">
            <p id="ft-studio" className="nz-footer__col-title">
              הסטודיו
            </p>
            <ul className="nz-footer__links">
              {studioNav.map((s) => (
                <li key={s.href}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="ft-info" className="md:col-span-2">
            <p id="ft-info" className="nz-footer__col-title">
              מידע
            </p>
            <ul className="nz-footer__links">
              {legalNav.map((s) => (
                <li key={s.href}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <p className="nz-footer__col-title">יצירת קשר</p>
            <address className="not-italic">
              <ul className="nz-footer__links">
                <li>
                  <a href={getTelHref(contactInfo.phone)}>
                    טלפון:&nbsp;<bdi dir="ltr">{contactInfo.phone}</bdi>
                  </a>
                </li>
                <li>
                  <a href={getMailtoHref(studio.email)}>
                    <bdi dir="ltr">{studio.email}</bdi>
                  </a>
                </li>
                <li className="pt-2 text-[0.9375rem] text-ash">
                  שעות פעילות: {studio.days} <bdi dir="ltr">{studio.time}</bdi>
                </li>
              </ul>
            </address>
          </div>
        </div>
      </div>

      {/* The signature */}
      <div className="nz-container overflow-hidden" aria-hidden="true">
        <Wordmark className="nz-footer__wordmark pb-[0.04em]" />
      </div>

      <div className="border-t border-line-ink">
        <div className="nz-container flex flex-col-reverse items-start gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ash">
            © <bdi dir="ltr">NZ-web</bdi> {year}
          </p>
          {/* Zstore AI credit — logo in a fully-rounded white pill (no caption on this site) */}
          <a
            href="https://zstore-ai.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zstore AI — מעבר לאתר"
            className="nz-credit"
          >
            <img src="/zstore-ai-logo.png" alt="Zstore AI" width="600" height="200" loading="lazy" className="h-7 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
