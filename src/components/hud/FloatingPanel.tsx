'use client';

import React from 'react';
import { SectionId } from '@/store/useSceneStore';

interface FloatingPanelProps {
  sectionId: SectionId;
  sectorCode: string;
  sectorName: string;
  badge?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function FloatingPanel({
  sectionId,
  sectorCode,
  sectorName,
  badge,
  children,
  maxWidth = 'max-w-5xl',
  className = '',
}: FloatingPanelProps) {
  return (
    <div
      id={sectionId}
      className={`w-full mx-auto ${maxWidth} ${className} pointer-events-none`}
    >
      {/* Floating HUD Glassmorphic Shell with idle micro-motion */}
      <div className="hud-floating pointer-events-auto">
        <div className="glass-panel hud-bracket rounded-3xl p-5 sm:p-7 md:p-9 border border-cyan-500/25 shadow-2xl shadow-cyan-950/60 relative overflow-hidden backdrop-blur-xl">
          {/* Top Telemetry Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-400 uppercase">
                {sectorCode} // {sectorName}
              </span>
              {badge && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                HUD TELEMETRY: SYNCED
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                SEC-0{['bridge', 'about', 'skills', 'experience', 'education', 'ai', 'portfolio', 'contact'].indexOf(sectionId) + 1}
              </span>
            </div>
          </div>

          {/* Panel Interior Content with custom scroll */}
          <div className="max-h-[min(65vh,680px)] overflow-y-auto pr-1.5 sm:pr-3 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

