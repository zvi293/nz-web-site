import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "nz_web_cookie_consent";
const COOKIE_PREFERENCES_KEY = "nz_web_cookie_preferences";

/**
 * Minimal cookie consent banner.
 * Shows once, on the first visit. A single "אישור" button records the choice
 * in localStorage so the banner never appears again for that user.
 * No dismiss (X) button — the user must accept, and then it is remembered.
 */
const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show the banner if the user has not made a choice yet.
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Persist the choice — the banner will not be shown again across the whole site.
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ essential: true, analytics: true, marketing: true })
    );
    setShowBanner(false);
    // Notify analytics/pixel trackers that consent was just granted, so they can load now.
    window.dispatchEvent(new Event("nz-consent-updated"));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-md z-[9999]"
          dir="rtl"
        >
          <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  באתר NZ-web אנחנו משתמשים בעוגיות כדי להבטיח לך את חוויית הגלישה הטובה והמדויקת ביותר. המשך השימוש באתר מהווה הסכמה ל
                  <Link to="/privacy/" className="text-primary hover:underline">מדיניות הפרטיות</Link>
                  {" "}שלנו.
                </p>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="w-full transition-all duration-200 hover:shadow-lg"
                >
                  אישור
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
