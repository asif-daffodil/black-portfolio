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
      <div className="pointer-events-auto">
        <div className="glass-luxury rounded-3xl p-5 sm:p-7 md:p-9 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-2xl">
          {/* Top Subtle Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 sm:pb-4 mb-5 sm:mb-7">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-cyan-300 uppercase">
                {sectorCode} // {sectorName}
              </span>
              {badge && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                STATUS: ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-gray-300">
                CHAPTER 0{['bridge', 'about', 'skills', 'experience', 'education', 'ai', 'portfolio', 'contact'].indexOf(sectionId) + 1}
              </span>
            </div>
          </div>

          {/* Panel Interior Content */}
          <div className="max-h-[min(72vh,780px)] overflow-y-auto pr-1 sm:pr-3 space-y-6 scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
