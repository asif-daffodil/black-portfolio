'use client';

import React from 'react';
import { useSceneStore, SectionId, SECTION_ORDER } from '@/store/useSceneStore';
import { ArrowRight } from 'lucide-react';
import { soundFX } from '@/lib/sound';

interface FloatingPanelProps {
  sectionId: SectionId;
  sectorCode: string;
  sectorName: string;
  badge?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

const SECTION_LABELS: Record<SectionId, string> = {
  bridge: '00 ORBIT // BRIDGE',
  about: '01 ORIGIN // PROFILE',
  skills: '02 ARSENAL // SKILLS',
  experience: '03 FLIGHT LOG // CAREER',
  education: '04 CREDENTIALS // EDUCATION',
  ai: '05 NEURAL AI // AGENTS',
  portfolio: '06 SHOWCASE // PORTFOLIO',
  contact: '07 RELAY // CONTACT',
};

export default function FloatingPanel({
  sectionId,
  sectorCode,
  sectorName,
  badge,
  children,
  maxWidth = 'max-w-5xl',
  className = '',
}: FloatingPanelProps) {
  const setSection = useSceneStore((state) => state.setSection);
  const currentIndex = SECTION_ORDER.indexOf(sectionId);
  const nextSectionId = SECTION_ORDER[(currentIndex + 1) % SECTION_ORDER.length];
  const nextLabel = SECTION_LABELS[nextSectionId];

  const handleNextStation = () => {
    soundFX.playButtonClick();
    setSection(nextSectionId);
  };

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

          {/* Panel Interior Content with generous bottom padding so user can easily reach bottom */}
          <div className="max-h-[min(78vh,820px)] overflow-y-auto pr-1 sm:pr-3 space-y-6 scrollbar-thin pb-28 sm:pb-36">
            {children}

            {/* Bottom Station Waypoint Footer with breathing room */}
            <div className="pt-8 sm:pt-10 mt-10 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-ping" />
                <span>End of sector dossier</span>
              </div>

              <button
                onClick={handleNextStation}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-xs text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none"
              >
                <span>Proceed to {nextLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
