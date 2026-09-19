'use client';

import { useState, useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

const BOOT_LOGS = [
  'INITIALIZING FLIGHT SYSTEMS...',
  'CALIBRATING GRAVITATIONAL LENSING SENSORS... [OK]',
  'SYNCHRONIZING ACCRETION DISK TELEMETRY... [OK]',
  'LOCKING ORBIT AROUND SINGULARITY... [LOCKED]',
  'SCI-FI COCKPIT VIEWPORT ONLINE.',
];

export default function BootSequence() {
  const isBooted = useSceneStore((state) => state.isBooted);
  const setBooted = useSceneStore((state) => state.setBooted);

  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isBooted) return;

    // Progress counter (1.6 seconds total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        if (next % 20 === 0) {
          soundFX.playBootBeep(600 + next * 4, 0.04);
        }
        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isBooted]);

  useEffect(() => {
    // Reveal text lines sequentially based on progress
    const line = Math.min(
      Math.floor((progress / 100) * BOOT_LOGS.length),
      BOOT_LOGS.length - 1
    );
    setCurrentLineIndex(line);

    if (progress === 100) {
      const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          setBooted(true);
        }, 650);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, setBooted]);

  if (isBooted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07090e] transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-label="System Boot Sequence"
    >
      {/* Subtle CRT scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* Terminal HUD Container */}
      <div className="relative z-10 w-full max-w-lg mx-4 p-8 rounded-2xl bg-[#0d111c]/90 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              SYS.BOOT // AS-2026
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {progress}%
          </span>
        </div>

        {/* Boot Terminal Log Messages */}
        <div className="space-y-2 font-mono text-xs sm:text-sm min-h-[140px]">
          {BOOT_LOGS.slice(0, currentLineIndex + 1).map((log, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 ${
                idx === currentLineIndex
                  ? 'text-cyan-300 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-cyan-500 font-bold">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* High-Tech Progress Bar */}
        <div className="mt-8 space-y-2">
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            <span>Primary Core: Online</span>
            <span>Singularity Horizon: Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
