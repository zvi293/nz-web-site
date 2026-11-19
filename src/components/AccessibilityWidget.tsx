import { useCallback, useEffect, useRef, useState } from "react";
import "@/components/legal/floating-ui.css";
import {
  A11Y_LABELS,
  A11Y_OPEN_EVENT,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  countActive,
  isDefaultA11y,
  toggled,
  useA11ySettings,
  withFontSize,
  DEFAULT_A11Y,
  type A11yToggle,
} from "@/components/legal/a11y-store";
import { probeCovers, watchWhileScrolling } from "@/components/legal/floating";
import A11yGlyph from "@/components/legal/A11yGlyph";

/**
 * The accessibility widget (global chrome — BaseLayout: <AccessibilityWidget client:idle />).
 *
 *  - The bead: a compact ink disc docked bottom-right on desktop and bottom-left on phones (where
 *    RTL lines end ragged, so it covers the least text), inside the safe-area insets, riding above
 *    the cookie sheet (--nz-sheet-h). While the page scrolls it probes what it sits on (~10×/s);
 *    over text, a link, a button or a form field it docks as a half-disc tab on the edge so it
 *    never covers copy or a call to action, and comes back as soon as the spot is clear.
 *    It is never hidden: the control stays reachable at all times (legal requirement).
 *  - The panel: a native <dialog> (focus trap, Escape, top layer) — a bottom sheet on phones,
 *    a side panel on desktop. Opening adds one history entry so the phone BACK button closes it;
 *    page scroll is pinned without layout shift; focus returns to the bead.
 *  - Settings live in src/components/legal/a11y-store.ts (localStorage "a11y-settings-v2" +
 *    body classes, the same contract as BaseLayout's boot script). The statement page's
 *    switchboard flips the same settings; both stay in sync through the "nz:a11y" event.
 *  - Other code can open the panel: window.dispatchEvent(new Event("nz:a11y-open")).
 */

const GROUPS: { title: string; keys: A11yToggle[] }[] = [
  { title: "טקסט וקריאה", keys: ["readableFont", "highlightLinks", "highlightTitles"] },
  { title: "צבע וניגודיות", keys: ["highContrastDark", "highContrastLight", "grayscale", "invertColors"] },
  { title: "תנועה וניווט", keys: ["pauseAnimations", "bigCursor", "readingGuide", "focusOutline"] },
];

const AccessibilityWidget = () => {
  const [settings, setSettings, ready] = useA11ySettings();
  const [open, setOpen] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [announce, setAnnounce] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const beadRef = useRef<HTMLButtonElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  /* ── open / close (native dialog + one history entry for the BACK button) ── */
  const show = useCallback(() => {
    const dlg = dialogRef.current;
    if (!dlg || dlg.open) return;
    const html = document.documentElement;
    html.classList.add("nzc-scroll-pinned");
    dlg.showModal();
    /* The scrollable sheet would otherwise take the initial focus: start on "close". */
    dlg.querySelector<HTMLButtonElement>(".nzc-x")?.focus();
    setOpen(true);
    try {
      history.pushState({ ...(history.state ?? {}), nzA11y: true }, "");
    } catch {
      /* sandboxed: no history entry */
    }
  }, []);

  const requestClose = useCallback(() => {
    if (history.state?.nzA11y) history.back();
    else dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setOpen(false);
      document.documentElement.classList.remove("nzc-scroll-pinned");
      if (history.state?.nzA11y) history.back();
      beadRef.current?.focus({ preventScroll: true });
    };
    const onPop = () => {
      if (dlg.open) dlg.close();
    };
    const onOpenRequest = () => show();
    dlg.addEventListener("close", onClose);
    window.addEventListener("popstate", onPop);
    window.addEventListener(A11Y_OPEN_EVENT, onOpenRequest);
    return () => {
      dlg.removeEventListener("close", onClose);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener(A11Y_OPEN_EVENT, onOpenRequest);
    };
  }, [show]);

  /* ── the bead tucks into the edge while it would cover text, a link, a button or a field ── */
  useEffect(() => {
    let clear = 0;
    const probe = () => {
      const dock = dockRef.current;
      if (!dock) return;
      const hit = probeCovers(dock.getBoundingClientRect(), ["field", "target", "avoid", "text"]);
      if (hit) {
        clear = 0;
        setTucked(true);
      } else if (++clear >= 2) {
        setTucked(false);
      }
    };
    const stop = watchWhileScrolling(probe);
    const first = window.setTimeout(probe, 600);
    return () => {
      stop();
      window.clearTimeout(first);
    };
  }, []);

  /* ── reading guide: a hairline that follows the pointer (mouse, pen or finger) ── */
  useEffect(() => {
    if (!settings.readingGuide) return;
    const move = (e: PointerEvent) => {
      if (guideRef.current) guideRef.current.style.transform = `translate3d(0, ${Math.round(e.clientY)}px, 0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, [settings.readingGuide]);

  const flip = (key: A11yToggle) => {
    const next = setSettings((prev) => toggled(prev, key));
    setAnnounce(`${A11Y_LABELS[key]} ${next[key] ? "פועל" : "כבוי"}`);
  };
  const size = (delta: number) => {
    const next = setSettings((prev) => withFontSize(prev, prev.fontSize + delta));
    setAnnounce(`גודל טקסט ${next.fontSize}%`);
  };
  const reset = () => {
    setSettings({ ...DEFAULT_A11Y });
    setAnnounce("כל ההגדרות אופסו");
  };

  const active = ready ? countActive(settings) : 0;
  const pct = ((settings.fontSize - FONT_MIN) / (FONT_MAX - FONT_MIN)) * 100;

  return (
    <>
      <div ref={dockRef} className="nzc-dock nzc-dock--start" data-nz-float="" data-a11y-exclude="true" data-tucked={tucked ? "" : undefined}>
        <button
          ref={beadRef}
          type="button"
          className="nzc-bead nzc-bead--a11y"
          onClick={show}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="nz-a11y-panel"
          aria-label={active ? `תפריט נגישות (${active} הגדרות פעילות)` : "תפריט נגישות"}
        >
          <A11yGlyph className="nzc-bead__glyph" />
          {active > 0 && <span className="nzc-bead__dot" aria-hidden="true" />}
        </button>
      </div>

      {settings.readingGuide && <div ref={guideRef} className="nzc-guide" aria-hidden="true" data-nz-float="" />}

      <dialog
        ref={dialogRef}
        id="nz-a11y-panel"
        className="nzc-a11y"
        aria-labelledby="nz-a11y-title"
        data-a11y-exclude="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
      >
        <div className="nzc-a11y__sheet">
          <div className="nzc-a11y__head">
            <div>
              <p className="nzc-a11y__kicker">
                <span className="nzc-cube" aria-hidden="true" />
                נגישות
              </p>
              <h2 id="nz-a11y-title" className="nzc-a11y__title">
                התאמת התצוגה
              </h2>
            </div>
            <button type="button" className="nzc-x" onClick={requestClose} aria-label="סגירת תפריט הנגישות">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="nzc-a11y__body">
            <section className="nzc-a11y__group" aria-labelledby="nz-a11y-g0">
              <h3 id="nz-a11y-g0" className="nzc-a11y__gtitle">
                <span className="nzc-a11y__gnum">01</span> {GROUPS[0].title}
              </h3>
              <div className="nzc-size">
                <div className="nzc-size__row">
                  <span className="nzc-size__name" id="nz-a11y-size">
                    גודל טקסט
                  </span>
                  <output className="nzc-size__value" aria-labelledby="nz-a11y-size">
                    {settings.fontSize}%
                  </output>
                </div>
                <div className="nzc-size__ctrl">
                  <button
                    type="button"
                    className="nzc-size__btn"
                    onClick={() => size(-FONT_STEP)}
                    disabled={settings.fontSize <= FONT_MIN}
                    aria-label="הקטנת טקסט"
                  >
                    <span aria-hidden="true">א</span>
                    <span aria-hidden="true" className="nzc-size__sign">−</span>
                  </button>
                  <span className="nzc-size__meter" aria-hidden="true">
                    <span className="nzc-size__fill" style={{ transform: `scaleX(${pct / 100})` }} />
                    <span className="nzc-size__base" style={{ insetInlineStart: `${((100 - FONT_MIN) / (FONT_MAX - FONT_MIN)) * 100}%` }} />
                  </span>
                  <button
                    type="button"
                    className="nzc-size__btn nzc-size__btn--big"
                    onClick={() => size(FONT_STEP)}
                    disabled={settings.fontSize >= FONT_MAX}
                    aria-label="הגדלת טקסט"
                  >
                    <span aria-hidden="true">א</span>
                    <span aria-hidden="true" className="nzc-size__sign">+</span>
                  </button>
                </div>
              </div>
              <Rows keys={GROUPS[0].keys} settings={settings} onFlip={flip} />
            </section>

            {GROUPS.slice(1).map((g, gi) => (
              <section key={g.title} className="nzc-a11y__group" aria-labelledby={`nz-a11y-g${gi + 1}`}>
                <h3 id={`nz-a11y-g${gi + 1}`} className="nzc-a11y__gtitle">
                  <span className="nzc-a11y__gnum">{String(gi + 2).padStart(2, "0")}</span> {g.title}
                </h3>
                <Rows keys={g.keys} settings={settings} onFlip={flip} />
              </section>
            ))}
          </div>

          <div className="nzc-a11y__foot">
            <button type="button" className="nzc-pill" onClick={reset} disabled={isDefaultA11y(settings)}>
              איפוס הכול
            </button>
            <a href="/accessibility/" className="nzc-a11y__link">
              הצהרת הנגישות
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </div>
          <p className="nzc-a11y__note">ההגדרות נשמרות בדפדפן הזה ונטענות בכל עמוד באתר.</p>
          <p className="nz-sr" role="status" aria-live="polite">
            {announce}
          </p>
        </div>
      </dialog>
    </>
  );
};

const Rows = ({
  keys,
  settings,
  onFlip,
}: {
  keys: A11yToggle[];
  settings: Record<A11yToggle, boolean>;
  onFlip: (k: A11yToggle) => void;
}) => (
  <ul className="nzc-rows">
    {keys.map((k) => (
      <li key={k}>
        <button type="button" role="switch" aria-checked={settings[k]} className="nzc-row" onClick={() => onFlip(k)}>
          <span className="nzc-row__name">{A11Y_LABELS[k]}</span>
          <span className="nzc-row__switch" aria-hidden="true">
            <span className="nzc-row__knob" />
          </span>
        </button>
      </li>
    ))}
  </ul>
);

export default AccessibilityWidget;
