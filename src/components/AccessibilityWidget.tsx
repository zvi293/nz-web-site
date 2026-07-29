import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, RotateCcw, Eye, Type, Palette, Navigation, 
  MousePointer, Link2, Focus, Minus, Plus, 
  Heading, SunMoon, Moon, Sun, Contrast
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import accessibilityIcon from "@/assets/accessibility-icon.png";

interface AccessibilitySettings {
  fontSize: number;
  readableFont: boolean;
  highlightLinks: boolean;
  highlightTitles: boolean;
  highContrastDark: boolean;
  highContrastLight: boolean;
  grayscale: boolean;
  invertColors: boolean;
  pauseAnimations: boolean;
  bigCursor: boolean;
  readingGuide: boolean;
  focusOutline: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  readableFont: false,
  highlightLinks: false,
  highlightTitles: false,
  highContrastDark: false,
  highContrastLight: false,
  grayscale: false,
  invertColors: false,
  pauseAnimations: false,
  bigCursor: false,
  readingGuide: false,
  focusOutline: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem("a11y-settings-v2");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [readingGuideY, setReadingGuideY] = useState(0);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Apply settings to DOM
  const applySettings = useCallback((s: AccessibilitySettings) => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.style.fontSize = s.fontSize === 100 ? "" : `${s.fontSize}%`;

    // Readable font
    body.classList.toggle("a11y-readable-font", s.readableFont);

    // Highlight links
    body.classList.toggle("a11y-highlight-links", s.highlightLinks);

    // Highlight titles
    body.classList.toggle("a11y-highlight-titles", s.highlightTitles);

    // High contrast modes (mutually exclusive)
    body.classList.remove("a11y-high-contrast-dark", "a11y-high-contrast-light");
    if (s.highContrastDark) {
      body.classList.add("a11y-high-contrast-dark");
    } else if (s.highContrastLight) {
      body.classList.add("a11y-high-contrast-light");
    }

    // Grayscale
    body.classList.toggle("a11y-grayscale", s.grayscale);

    // Invert colors
    body.classList.toggle("a11y-invert-colors", s.invertColors);

    // Pause animations
    body.classList.toggle("a11y-pause-animations", s.pauseAnimations);

    // Big cursor
    body.classList.toggle("a11y-big-cursor", s.bigCursor);

    // Reading guide
    body.classList.toggle("a11y-reading-guide-active", s.readingGuide);

    // Focus outline
    body.classList.toggle("a11y-focus-outline", s.focusOutline);

    localStorage.setItem("a11y-settings-v2", JSON.stringify(s));
  }, []);

  useEffect(() => {
    applySettings(settings);
  }, [settings, applySettings]);

  // Reading guide mouse tracking
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setReadingGuideY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [settings.readingGuide]);

  /* Escape closes; Tab is trapped inside the dialog.
     A `role="dialog" aria-modal="true"` that leaks focus back to the page behind
     it fails WCAG 2.4.3 — and this is the accessibility menu itself, so it has to
     be exemplary. */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  /* Move focus into the panel on open, and stop the page behind it scrolling. */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstButton = panelRef.current?.querySelector("button");
    firstButton?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };
      // Handle mutually exclusive contrast modes
      if (key === "highContrastDark" && value) {
        newSettings.highContrastLight = false;
      }
      if (key === "highContrastLight" && value) {
        newSettings.highContrastDark = false;
      }
      return newSettings;
    });
  };

  const adjustFontSize = (delta: number) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(200, Math.max(80, prev.fontSize + delta)),
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(defaultSettings);

  return (
    <>
      {/* Floating Accessibility Button */}
      {/* 48px, not 40: this is the legally-required accessibility control, so it
          has to clear the 44×44 minimum touch target comfortably. It also sits
          above the cookie banner's z-index band so it is never unreachable. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="accessibility-panel"
        className="fixed bottom-[92px] left-6 z-[10020] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 cursor-pointer"
      >
        <img src={accessibilityIcon} alt="" width={24} height={24} className="h-6 w-6 invert" aria-hidden="true" />
      </button>

      {/* Reading Guide Line */}
      {settings.readingGuide && (
        <div
          className="fixed left-0 right-0 h-[3px] bg-primary/80 pointer-events-none z-[10010] transition-transform duration-75"
          style={{ top: `${readingGuideY}px` }}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10030] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Side Panel */}
            <motion.div
              ref={panelRef}
              id="accessibility-panel"
              role="dialog"
              aria-modal="true"
              aria-label="תפריט נגישות"
              data-a11y-exclude="true"
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[10040] w-[380px] max-w-[92vw] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl overflow-y-auto"
              dir="rtl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 
                    className="text-xl font-bold text-white flex items-center gap-3"
                    style={{ fontFamily: "'Heebo', sans-serif" }}
                  >
                    <img src={accessibilityIcon} alt="" className="h-6 w-6 invert" aria-hidden="true" />
                    תפריט נגישות
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="סגור תפריט נגישות"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Reset Button */}
                {hasChanges && (
                  <button
                    onClick={resetSettings}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label="איפוס כל הגדרות הנגישות"
                  >
                    <RotateCcw className="h-4 w-4" />
                    איפוס הגדרות
                  </button>
                )}
              </div>

              <div className="p-5 space-y-6">
                {/* Content Adjustments */}
                <Section icon={<Type className="h-5 w-5" />} title="התאמות תוכן">
                  {/* Font Size */}
                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium text-sm">גודל טקסט</span>
                      <span className="text-primary font-bold text-sm">{settings.fontSize}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjustFontSize(-10)}
                        disabled={settings.fontSize <= 80}
                        className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="הקטן גודל טקסט"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => adjustFontSize(10)}
                        disabled={settings.fontSize >= 200}
                        className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="הגדל גודל טקסט"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ToggleButton
                      icon={<span className="text-lg font-serif">Aa</span>}
                      label="גופן קריא"
                      active={settings.readableFont}
                      onClick={() => updateSetting("readableFont", !settings.readableFont)}
                    />
                    <ToggleButton
                      icon={<Link2 className="h-5 w-5" />}
                      label="הדגש קישורים"
                      active={settings.highlightLinks}
                      onClick={() => updateSetting("highlightLinks", !settings.highlightLinks)}
                    />
                    <ToggleButton
                      icon={<Heading className="h-5 w-5" />}
                      label="הדגש כותרות"
                      active={settings.highlightTitles}
                      onClick={() => updateSetting("highlightTitles", !settings.highlightTitles)}
                    />
                  </div>
                </Section>

                {/* Visual Adjustments */}
                <Section icon={<Palette className="h-5 w-5" />} title="התאמות צבע וניגודיות">
                  <div className="grid grid-cols-2 gap-3">
                    <ToggleButton
                      icon={<Moon className="h-5 w-5" />}
                      label="ניגודיות גבוהה (כהה)"
                      active={settings.highContrastDark}
                      onClick={() => updateSetting("highContrastDark", !settings.highContrastDark)}
                    />
                    <ToggleButton
                      icon={<Sun className="h-5 w-5" />}
                      label="ניגודיות גבוהה (בהיר)"
                      active={settings.highContrastLight}
                      onClick={() => updateSetting("highContrastLight", !settings.highContrastLight)}
                    />
                    <ToggleButton
                      icon={<SunMoon className="h-5 w-5" />}
                      label="גווני אפור"
                      active={settings.grayscale}
                      onClick={() => updateSetting("grayscale", !settings.grayscale)}
                    />
                    <ToggleButton
                      icon={<Contrast className="h-5 w-5" />}
                      label="הפוך צבעים"
                      active={settings.invertColors}
                      onClick={() => updateSetting("invertColors", !settings.invertColors)}
                    />
                  </div>
                </Section>

                {/* Orientation & Navigation */}
                <Section icon={<Navigation className="h-5 w-5" />} title="ניווט ואוריינטציה">
                  <div className="grid grid-cols-2 gap-3">
                    <ToggleButton
                      icon={<span className="text-lg">⏸</span>}
                      label="עצור אנימציות"
                      active={settings.pauseAnimations}
                      onClick={() => updateSetting("pauseAnimations", !settings.pauseAnimations)}
                    />
                    <ToggleButton
                      icon={<MousePointer className="h-5 w-5" />}
                      label="סמן גדול"
                      active={settings.bigCursor}
                      onClick={() => updateSetting("bigCursor", !settings.bigCursor)}
                    />
                    <ToggleButton
                      icon={<Eye className="h-5 w-5" />}
                      label="קו עזר לקריאה"
                      active={settings.readingGuide}
                      onClick={() => updateSetting("readingGuide", !settings.readingGuide)}
                    />
                    <ToggleButton
                      icon={<Focus className="h-5 w-5" />}
                      label="מסגרת מיקוד"
                      active={settings.focusOutline}
                      onClick={() => updateSetting("focusOutline", !settings.focusOutline)}
                    />
                  </div>
                </Section>

                {/* Accessibility Statement Link */}
                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/accessibility/");
                    }}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="עבור לדף הצהרת הנגישות"
                  >
                    <span>📄</span>
                    הצהרת נגישות
                  </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-slate-500 text-center pt-2">
                  תפריט נגישות תואם WCAG 2.1 AA
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Section Component
const Section = ({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 pb-1">
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-bold text-white" style={{ fontFamily: "'Heebo', sans-serif" }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

// Toggle Button Component
const ToggleButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    role="switch"
    aria-checked={active}
    aria-label={label}
    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-right transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-primary ${
      active
        ? "bg-primary/20 border-primary text-white"
        : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60 hover:text-white"
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span className="text-xs font-medium leading-tight">{label}</span>
  </button>
);

export default AccessibilityWidget;