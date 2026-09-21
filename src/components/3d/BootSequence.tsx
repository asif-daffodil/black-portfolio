'use client';

import { useState, useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

const BOOT_STATUS_STAGES = [
  { threshold: 0, label: 'CORE INITIALIZING // COCKPIT HARDWARE' },
  { threshold: 22, label: 'CALIBRATING GRAVITATIONAL LENSING MATRIX' },
  { threshold: 45, label: 'POWERING FLIGHT RAIL CONSOLE BUS [STAGGERED]' },
  { threshold: 72, label: 'SYNCHRONIZING ACCRETION DISK TELEMETRY' },
  { threshold: 88, label: 'OPENING PRIMARY VIEWSCREEN APERTURE' },
  { threshold: 98, label: 'SYSTEM READY // ENGAGING STATION DOCK' },
];

export default function BootSequence() {
  const isBooted = useSceneStore((state) => state.isBooted);
  const setBooted = useSceneStore((state) => state.setBooted);
  const bootStage = useSceneStore((state) => state.bootStage);
  const setBootStage = useSceneStore((state) => state.setBootStage);
  const setBootPoweredCount = useSceneStore((state) => state.setBootPoweredCount);

  const [progress, setProgress] = useState(0);
  const [showFlicker, setShowFlicker] = useState(false);
  const [isIrisOpening, setIsIrisOpening] = useState(false);
  const hasStartedSequence = useRef(false);

  // Check if session has already completed boot intro once
  useEffect(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        sessionStorage.getItem('asif_portfolio_has_booted') === 'true'
      ) {
        setBootPoweredCount(9);
        setBootStage('ready');
        setBooted(true);
      }
    } catch {
      // ignore
    }
  }, [setBooted, setBootStage, setBootPoweredCount]);

  // Handle Skip
  const handleSkip = () => {
    soundFX.playButtonClick();
    setBootPoweredCount(9);
    setBootStage('ready');
    setBooted(true);
  };

  useEffect(() => {
    if (isBooted || hasStartedSequence.current) return;
    hasStartedSequence.current = true;

    // ── 1. Minimal Boot Progress Bar Progression ──
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Smooth logarithmic deceleration toward 100%
        const increment = prev < 50 ? 3.5 : prev < 80 ? 2.5 : 1.8;
        return Math.min(Math.round(prev + increment), 100);
      });
    }, 45);

    // ── 2. Sequential Console Buttons Power-Up (Staggered 180ms each) ──
    // Buttons: 00 HOME, 01 ABOUT, 02 SKILLS, 03 EXP, 04 CREDS, 05 AI, 06 PORTFOLIO, 07 CONTACT, + AUDIO
    const powerTimers: ReturnType<typeof setTimeout>[] = [];
    const baseDelay = 450; // start powering up console after initial kernel load
    const buttonStagger = 180; // ~180ms stagger per button

    for (let i = 0; i <= 8; i++) {
      const t = setTimeout(() => {
        setBootPoweredCount(i + 1);
        soundFX.playBootBeep(520 + i * 45, 0.035);
      }, baseDelay + i * buttonStagger);
      powerTimers.push(t);
    }

    // ── 3. HUD Flicker / Static Glitch Effect ──
    // Triggers right after all buttons illuminate (~2.15s)
    const flickerTimer = setTimeout(() => {
      setBootStage('flicker');
      setShowFlicker(true);
      soundFX.playBootBeep(1250, 0.05);

      setTimeout(() => {
        setShowFlicker(false);
      }, 300);
    }, baseDelay + 9 * buttonStagger + 80);

    // ── 4. Main Viewscreen Aperture Iris-In ──
    // Black hole view irises in (~2.65s)
    const irisTimer = setTimeout(() => {
      setBootStage('iris');
      setIsIrisOpening(true);
    }, baseDelay + 9 * buttonStagger + 450);

    // ── 5. Automatic Camera Push-In toward Main Screen ──
    // Once aperture opens, push-in starts (~3.15s)
    const pushInTimer = setTimeout(() => {
      setBootStage('push_in');
    }, baseDelay + 9 * buttonStagger + 950);

    return () => {
      clearInterval(progressInterval);
      powerTimers.forEach(clearTimeout);
      clearTimeout(flickerTimer);
      clearTimeout(irisTimer);
      clearTimeout(pushInTimer);
    };
  }, [isBooted, setBootPoweredCount, setBootStage, setBooted]);

  if (isBooted) return null;

  const currentStatus =
    [...BOOT_STATUS_STAGES]
      .reverse()
      .find((stage) => progress >= stage.threshold)?.label || BOOT_STATUS_STAGES[0].label;

  return (
    <>
      {/* ── 3. Brief HUD CRT Static / Flicker Overlay ── */}
      {showFlicker && (
        <div className="fixed inset-0 z-50 pointer-events-none hud-flicker-overlay bg-[linear-gradient(to_bottom,rgba(255,255,255,0.15),rgba(0,0,0,0.6)_50%,rgba(0,240,255,0.2))] bg-[length:100%_4px] mix-blend-screen" />
      )}

      {/* ── 1 & 2. Pure Black Boot Curtain & Minimal Sci-Fi System Progress Bar ── */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#020408] transition-all duration-700 ${
          isIrisOpening
            ? 'viewscreen-iris pointer-events-none'
            : 'opacity-100 pointer-events-auto'
        }`}
        aria-label="Cockpit System Boot Sequence"
      >
        {/* Subtle aerospace grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#09101d_1px,transparent_1px),linear-gradient(to_bottom,#09101d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Center Minimal System Boot Loader Module */}
        <div className="relative z-10 w-full max-w-md mx-6 px-6 py-8 rounded-2xl bg-[#060a14]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] backdrop-blur-2xl">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                SYS.BOOT // CORE KERNEL
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {progress}%
            </span>
          </div>

          {/* Minimal High-Tech Progress Track */}
          <div className="space-y-3">
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden p-[1px] border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Live System Boot Log String */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 tracking-wider">
              <span className="truncate text-gray-300">
                &gt; {currentStatus}
              </span>
              <span className="text-emerald-400 shrink-0 ml-2">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Skip Prompt */}
        <button
          onClick={handleSkip}
          className="absolute bottom-8 text-[11px] font-mono tracking-widest text-gray-500 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-white/[0.04]"
        >
          [ CLICK OR PRESS ESC TO SKIP ]
        </button>
      </div>
    </>
  );
}
