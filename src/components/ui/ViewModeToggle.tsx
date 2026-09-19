'use client';

import React from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import { Zap, Sparkles } from 'lucide-react';

export default function ViewModeToggle() {
  const viewMode = useSceneStore((state) => state.viewMode);
  const setViewMode = useSceneStore((state) => state.setViewMode);

  const isClassic = viewMode === 'classic';

  const handleToggle = () => {
    soundFX.playButtonClick();
    setViewMode(isClassic ? '3d' : 'classic');
  };

  return (
    <div className="fixed top-18 sm:top-20 right-4 sm:right-6 z-40 pointer-events-auto">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          isClassic
            ? 'Launch 3D Cockpit View with interactive space animations'
            : 'Skip Animation // Classic View (Fast, static scroll-based layout)'
        }
        aria-pressed={isClassic}
        className={`group flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070c] ${
          isClassic
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 shadow-cyan-950/50'
            : 'bg-[#0b101e]/90 text-gray-200 border border-white/15 hover:border-cyan-400/50 hover:text-white backdrop-blur-md shadow-black/60'
        }`}
      >
        {isClassic ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Launch 3D Cockpit</span>
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Skip Animation //</span>
            <span>Classic View</span>
          </>
        )}
      </button>
    </div>
  );
}
