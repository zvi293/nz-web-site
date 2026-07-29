import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "nz_web_cookie_consent";
const COOKIE_PREFERENCES_KEY = "nz_web_cookie_preferences";

/**
 * Cookie consent banner.
 *
 * Shows once, on the first visit, and records the choice in localStorage.
 * Declining is a real, equally-prominent option — consent that can only be given
 * is not consent, under either the GDPR or Israel's Privacy Protection Law. Until
 * a visitor accepts, `Analytics` loads no tracker at all; the site itself only
 * uses functional storage (accessibility settings, theme).
 */
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show the banner if the user has not made a choice yet.
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent) return;
    } catch {
      /* storage blocked (private mode / hardened browser) — show the banner. */
    }
    const timer = setTimeout(() => setShowBanner(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const persist = (value: "accepted" | "declined") => {
    const optedIn = value === "accepted";
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
      localStorage.setItem(
        COOKIE_PREFERENCES_KEY,
        JSON.stringify({ essential: true, analytics: optedIn, marketing: optedIn }),
      );
    } catch {
      /* Nothing to persist to — the banner simply reappears next visit. */
    }
    setShowBanner(false);
    // Tell the tracker loader the choice changed, so it can act on it now.
    window.dispatchEvent(new Event("nz-consent-updated"));
  };

  const handleAccept = () => persist("accepted");
  const handleDecline = () => persist("declined");

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          /* 152px clears the whole bottom-left FAB stack (WhatsApp ends at 80px,
             the accessibility launcher at 140px) at EVERY breakpoint. It must not
             be relaxed to `md:bottom-4` — on desktop the banner is ~158px tall,
             so a 16px offset puts it straight over both buttons, and the
             accessibility launcher has to stay reachable at all times. */
          className="fixed bottom-[152px] left-4 right-4 z-[10000] md:right-auto md:max-w-md"
          dir="rtl"
          role="dialog"
          aria-modal="false"
          aria-label="הסכמה לשימוש בעוגיות"
        >
          <div className="glass-strong ring-gradient rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-gradient-to-br from-brand-1/15 to-brand-3/15 p-2.5">
                <Cookie aria-hidden="true" className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  אנחנו משתמשים בעוגיות חיוניות להפעלת האתר, ובעוגיות סטטיסטיקה רק אם תאשרו.
                  אפשר לקרוא עוד ב
                  <Link to="/privacy/" className="text-primary hover:underline">מדיניות הפרטיות</Link>
                  {" "}שלנו.
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleAccept} size="sm" className="btn-brand flex-1 rounded-xl">
                    אישור
                  </Button>
                  <Button
                    onClick={handleDecline}
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    רק חיוניות
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
