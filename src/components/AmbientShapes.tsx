const AmbientShapes = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top-right large circle */}
      <div
        className="absolute -top-24 -right-24 h-[550px] w-[550px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.14) 0%, transparent 70%)" }}
      />

      {/* Mid-left organic blob */}
      <div
        className="absolute top-[28%] -left-16 h-[450px] w-[450px] rotate-45 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
        style={{ background: "radial-gradient(circle, hsl(199 89% 48% / 0.12) 0%, transparent 70%)" }}
      />

      {/* Center-right soft shape */}
      <div
        className="absolute top-[52%] right-[2%] h-[380px] w-[380px] rotate-12 rounded-[30%_70%_70%_30%/30%_30%_70%_70%]"
        style={{ background: "radial-gradient(ellipse, hsl(217 91% 60% / 0.11) 0%, transparent 65%)" }}
      />

      {/* Bottom-left large circle */}
      <div
        className="absolute bottom-[6%] -left-20 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.13) 0%, transparent 70%)" }}
      />

      {/* Bottom-right small accent blob */}
      <div
        className="absolute bottom-[20%] right-[10%] h-[280px] w-[280px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"
        style={{ background: "radial-gradient(circle, hsl(199 89% 48% / 0.1) 0%, transparent 60%)" }}
      />

      {/* Top-left organic shape */}
      <div
        className="absolute top-[10%] left-[6%] h-[340px] w-[340px] -rotate-12 rounded-[50%_50%_20%_80%/25%_80%_20%_75%]"
        style={{ background: "radial-gradient(circle, hsl(217 91% 60% / 0.12) 0%, transparent 65%)" }}
      />
    </div>
  );
};

export default AmbientShapes;
