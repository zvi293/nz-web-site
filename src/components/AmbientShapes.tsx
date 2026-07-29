/**
 * Site-wide atmosphere layer.
 *
 * Fixed behind everything: slow-drifting brand orbs + a whisper of film grain.
 * All colours come from the brand tokens, so the whole thing re-tints in dark
 * mode instead of turning into grey smudges. Intentionally low-contrast — the
 * hero and CTA sections carry their own, stronger aurora on top of this.
 */
const AmbientShapes = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Top-right — brand blue */}
      <div
        className="animate-float-slow absolute -top-32 -right-24 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.13) 0%, transparent 68%)" }}
      />

      {/* Mid-left organic blob — violet */}
      <div
        className="animate-float absolute top-[26%] -left-24 h-[460px] w-[460px] rotate-45 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-1) / 0.11) 0%, transparent 68%)" }}
      />

      {/* Centre-right — cyan accent */}
      <div
        className="absolute top-[52%] right-[2%] h-[380px] w-[380px] rotate-12 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"
        style={{ background: "radial-gradient(ellipse, hsl(var(--brand-3) / 0.10) 0%, transparent 65%)" }}
      />

      {/* Bottom-left */}
      <div
        className="animate-float-slow absolute bottom-[6%] -left-24 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-2) / 0.11) 0%, transparent 68%)" }}
      />

      {/* Bottom-right small accent blob */}
      <div
        className="absolute bottom-[20%] right-[8%] h-[300px] w-[300px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-3) / 0.09) 0%, transparent 62%)" }}
      />

      {/* Top-left organic shape */}
      <div
        className="absolute top-[10%] left-[6%] h-[340px] w-[340px] -rotate-12 rounded-[50%_50%_20%_80%/25%_80%_20%_75%]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-1) / 0.10) 0%, transparent 65%)" }}
      />
    </div>
  );
};

export default AmbientShapes;
