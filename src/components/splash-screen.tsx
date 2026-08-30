"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2.5}s`,
        animationDuration: `${2.5 + Math.random() * 3}s`,
        width: `${1.5 + Math.random() * 2.5}px`,
        height: `${1.5 + Math.random() * 2.5}px`,
      })),
    []
  );

  useEffect(() => {
    // Smooth progress animation
    const startTime = Date.now();
    const duration = 2200;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural feel
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    const exitTimer = setTimeout(() => setPhase("exiting"), 2600);
    const doneTimer = setTimeout(() => setPhase("done"), 3400);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        phase === "exiting"
          ? "opacity-0 scale-105 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, #0d0d2b 0%, #050510 70%)" }}
    >
      {/* Animated aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="splash-blob splash-blob-1" />
        <div className="splash-blob splash-blob-2" />
        <div className="splash-blob splash-blob-3" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:clamp(30px,5vw,60px)_clamp(30px,5vw,60px)] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="splash-particle bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full absolute"
            style={p}
          />
        ))}
      </div>

      {/* Central content — fully responsive */}
      <div className="relative flex flex-col items-center z-10 px-4 w-full max-w-[90vw] sm:max-w-md">
        
        {/* Orbital rings — scale with viewport */}
        <div className="absolute w-[60vw] h-[60vw] sm:w-[320px] sm:h-[320px] max-w-[320px] max-h-[320px] rounded-full border-[1.5px] border-indigo-500/10 animate-spin-slow" />
        <div className="absolute w-[48vw] h-[48vw] sm:w-[250px] sm:h-[250px] max-w-[250px] max-h-[250px] rounded-full border-[1.5px] border-violet-500/10 animate-spin-reverse" />
        <div className="absolute w-[36vw] h-[36vw] sm:w-[180px] sm:h-[180px] max-w-[180px] max-h-[180px] rounded-full border border-indigo-400/20 splash-orbit-pulse" />

        {/* Multi-layer glow behind logo */}
        <div className="absolute w-[40vw] h-[40vw] sm:w-44 sm:h-44 max-w-44 max-h-44 rounded-full bg-indigo-600/30 blur-[60px] splash-glow-pulse" />
        <div className="absolute w-[30vw] h-[30vw] sm:w-32 sm:h-32 max-w-32 max-h-32 rounded-full bg-violet-500/20 blur-[50px] splash-glow-pulse-alt" />
        <div className="absolute w-[20vw] h-[20vw] sm:w-20 sm:h-20 max-w-20 max-h-20 rounded-full bg-fuchsia-500/20 blur-[30px] splash-glow-pulse" />

        {/* Logo container with premium frame */}
        <div className="splash-logo-enter relative mb-8 sm:mb-10">
          {/* Outer rotating ring */}
          <div className="absolute -inset-4 sm:-inset-5 rounded-[2rem] sm:rounded-[2.5rem] border-[1.5px] border-white/[0.1] border-l-indigo-500 border-r-fuchsia-500 splash-ring-rotate" />
          
          {/* Inner glass ring */}
          <div className="absolute -inset-2 sm:-inset-3 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] splash-logo-float" />
          
          {/* Logo */}
          <div className="relative w-[80px] h-[80px] sm:w-28 sm:h-28 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-[1.5px] border-white/20 bg-black/40 backdrop-blur-xl splash-logo-float flex items-center justify-center p-4">
            <Image
              src="/phygital_ultra_logo.png"
              alt="Phygital"
              width={96}
              height={96}
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              priority
            />
            {/* Shimmer sweep over logo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.15] to-transparent splash-shimmer-sweep" />
          </div>
        </div>

        {/* Brand text */}
        <div className="splash-text-enter flex flex-col items-center gap-2 sm:gap-3 mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white tracking-tight drop-shadow-sm">
            🏁 CLAIM.
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 uppercase tracking-[0.4em] sm:tracking-[0.5em]">
            3 WORD PIN
          </p>
        </div>

        {/* Premium progress indicator */}
        <div className="splash-bar-enter w-full max-w-[220px] sm:max-w-[280px] flex flex-col items-center gap-4 sm:gap-5">
          {/* Status row */}
          <div className="flex w-full items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                System Boot
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono font-black text-indigo-300">
              {progress}%
            </span>
          </div>

          {/* Track */}
          <div className="w-full h-[3px] sm:h-[4px] rounded-full bg-black/40 shadow-inner overflow-hidden relative border border-white/5">
            {/* Fill */}
            <div
              className="h-full rounded-full transition-all duration-150 ease-out relative"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f46e5, #ec4899, #f97316)",
                boxShadow: "0 0 10px rgba(236,72,153,0.5)"
              }}
            >
              {/* Glowing tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white blur-[4px] opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom watermark */}
      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center z-10 splash-text-enter opacity-50">
        <span className="text-[9px] sm:text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 uppercase tracking-[0.6em]">
          Base Sepolia Network
        </span>
      </div>
    </div>
  );
}
