import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Shield, BarChart3, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const COOKIE_CONSENT_KEY = "nz_web_cookie_consent";
const COOKIE_PREFERENCES_KEY = "nz_web_cookie_preferences";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
    // Load saved preferences if they exist
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleDecline = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Cannot toggle essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
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
                    באתר NZ-web אנחנו משתמשים בעוגיות כדי להבטיח לך את חוויית הגלישה הטובה והמדויקת ביותר. המשך השימוש באתר מהווה הסכמה למדיניות הפרטיות שלנו.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={handleAcceptAll}
                      size="sm"
                      className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      מאשר/ת הכל
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      הגדרות מתקדמות
                    </Button>
                    <Link
                      to="/privacy"
                      className="text-xs text-primary hover:underline transition-colors"
                    >
                      למידע נוסף
                    </Link>
                  </div>
                </div>
                <button
                  onClick={handleDecline}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shrink-0"
                  aria-label="סגור"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Cookie className="h-5 w-5 text-primary" />
              הגדרות עוגיות
            </DialogTitle>
            <DialogDescription>
              בחר אילו סוגי עוגיות תרצה לאפשר. ניתן לשנות את ההעדפות בכל עת.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">עוגיות הכרחיות</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    עוגיות אלו נחוצות לתפעול התקין של האתר.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.essential}
                disabled
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">עוגיות אנליטיקה</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    עוזרות לנו להבין איך גולשים משתמשים באתר כדי לשפר את חוויית המשתמש.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={() => togglePreference("analytics")}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Megaphone className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">עוגיות שיווק</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    משמשות להתאמת תכנים ופרסומים רלוונטיים עבורכם.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={() => togglePreference("marketing")}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              className="flex-1"
            >
              שמור העדפות
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1 transition-all duration-200 hover:scale-[1.02]"
            >
              אשר את כל העוגיות
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            <Link to="/privacy" className="text-primary hover:underline">
              קרא את מדיניות הפרטיות המלאה
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
