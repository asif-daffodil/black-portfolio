'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useSceneStore, SectionId, SECTION_ORDER } from '@/store/useSceneStore';
import { ArrowRight, Compass, X } from 'lucide-react';
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

const STATION_HOLO_THEMES: Record<
  SectionId,
  {
    border: string;
    glow: string;
    dot: string;
    textGlow: string;
    titleColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    bracketColor: string;
  }
> = {
  bridge: {
    border: 'border-amber-400/40',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-amber-400 shadow-[0_0_10px_#f59e0b]',
    textGlow: 'rgba(245, 158, 11, 0.65)',
    titleColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/35',
    badgeText: 'text-amber-300',
    bracketColor: 'border-amber-400/60',
  },
  about: {
    border: 'border-cyan-400/40',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-cyan-400 shadow-[0_0_10px_#06b6d4]',
    textGlow: 'rgba(6, 182, 212, 0.65)',
    titleColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/35',
    badgeText: 'text-cyan-300',
    bracketColor: 'border-cyan-400/60',
  },
  skills: {
    border: 'border-purple-400/40',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-purple-400 shadow-[0_0_10px_#8b5cf6]',
    textGlow: 'rgba(139, 92, 246, 0.65)',
    titleColor: 'text-purple-300',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/35',
    badgeText: 'text-purple-300',
    bracketColor: 'border-purple-400/60',
  },
  experience: {
    border: 'border-emerald-400/40',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-emerald-400 shadow-[0_0_10px_#10b981]',
    textGlow: 'rgba(16, 185, 129, 0.65)',
    titleColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/35',
    badgeText: 'text-emerald-300',
    bracketColor: 'border-emerald-400/60',
  },
  education: {
    border: 'border-amber-400/40',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-amber-400 shadow-[0_0_10px_#fbbf24]',
    textGlow: 'rgba(251, 191, 36, 0.65)',
    titleColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/35',
    badgeText: 'text-amber-300',
    bracketColor: 'border-amber-400/60',
  },
  ai: {
    border: 'border-pink-400/40',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-pink-400 shadow-[0_0_10px_#ec4899]',
    textGlow: 'rgba(236, 72, 153, 0.65)',
    titleColor: 'text-pink-300',
    badgeBg: 'bg-pink-500/10',
    badgeBorder: 'border-pink-500/35',
    badgeText: 'text-pink-300',
    bracketColor: 'border-pink-400/60',
  },
  portfolio: {
    border: 'border-indigo-400/40',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-indigo-400 shadow-[0_0_10px_#6366f1]',
    textGlow: 'rgba(99, 102, 241, 0.65)',
    titleColor: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/35',
    badgeText: 'text-indigo-300',
    bracketColor: 'border-indigo-400/60',
  },
  contact: {
    border: 'border-teal-400/40',
    glow: 'shadow-[0_0_30px_rgba(20,184,166,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-teal-400 shadow-[0_0_10px_#14b8a6]',
    textGlow: 'rgba(20, 184, 166, 0.65)',
    titleColor: 'text-teal-300',
    badgeBg: 'bg-teal-500/10',
    badgeBorder: 'border-teal-500/35',
    badgeText: 'text-teal-300',
    bracketColor: 'border-teal-400/60',
  },
};

// Staggered internal entrance variants (heading appears first, then body, then footer)
const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12, // 120ms stagger between elements
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.16, 1, 0.3, 1], // smooth ease-out
    },
  },
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
  const deactivateSection = useSceneStore((state) => state.deactivateSection);
  const currentIndex = SECTION_ORDER.indexOf(sectionId);
  const nextSectionId = SECTION_ORDER[(currentIndex + 1) % SECTION_ORDER.length];
  const nextLabel = SECTION_LABELS[nextSectionId];

  const theme = STATION_HOLO_THEMES[sectionId] || STATION_HOLO_THEMES.bridge;

  const handleNextStation = () => {
    soundFX.playButtonClick();
    setSection(nextSectionId);
  };

  const handleClose = () => {
    soundFX.playButtonClick();
    deactivateSection();
  };

  return (
    <div
      id={sectionId}
      className={`w-full mx-auto ${maxWidth} ${className} pointer-events-none hologram-float`}
    >
      <div className="pointer-events-auto">
        {/* ── 1. HOLOGRAPHIC 3D PANEL CONTAINER ── */}
        {/* Semi-transparent dark background + thin glowing accent border + slight backdrop-blur */}
        <div
          className={`relative rounded-3xl p-5 sm:p-7 md:p-8 bg-[#050914]/75 backdrop-blur-md border ${theme.border} ${theme.glow} transition-all duration-500 overflow-hidden`}
        >
          {/* Top holographic projection emitter notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Holographic sci-fi corner brackets */}
          <span className={`absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
          <span className={`absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />
          <span className={`absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
          <span className={`absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />

          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="w-full"
          >
            {/* ── 2. STAGGERED ELEMENT 1: TOP HUD TELEMETRY BAR (Appears First) ── */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 sm:pb-4 mb-5 sm:mb-6"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${theme.dot}`} />
                <span
                  className={`font-mono text-xs sm:text-sm font-bold tracking-widest uppercase holo-heading ${theme.titleColor}`}
                  style={{ textShadow: `0 0 12px ${theme.textGlow}` }}
                >
                  {sectorCode} // {sectorName}
                </span>
                {badge && (
                  <span
                    className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                  >
                    {badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono text-gray-400">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  TELEMETRY: ONLINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-gray-300 font-mono tracking-wider">
                  STATION 0{currentIndex + 1}
                </span>

                {/* ── DIEGETIC CONSOLE CLOSE (×) BUTTON ── */}
                <button
                  type="button"
                  onClick={handleClose}
                  onMouseEnter={() => soundFX.playHoverTick()}
                  title="Return node to orbital ring (ESC)"
                  aria-label="Close station and return to orbital ring"
                  className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#131d33] to-[#080d19] border border-white/15 hover:border-red-400/60 text-gray-300 hover:text-white shadow-sm hover:shadow-[0_0_14px_rgba(248,113,113,0.35)] active:scale-95 active:translate-y-[1px] transition-all cursor-pointer select-none"
                >
                  {/* Standby LED rim indicator */}
                  <span className="absolute top-0 inset-x-0 h-[1.5px] bg-red-400/40 group-hover:bg-red-400 group-hover:shadow-[0_0_6px_#f87171] transition-all rounded-t" />
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 group-hover:text-red-300">
                    DOCK // ESC
                  </span>
                  <X className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </motion.div>

            {/* ── 2. STAGGERED ELEMENT 2: MAIN HOLOGRAPHIC BODY CONTENT (120ms Stagger) ── */}
            <motion.div
              variants={itemVariants}
              className="max-h-[min(64vh,700px)] overflow-y-auto pr-1 sm:pr-3 space-y-6 scrollbar-thin pb-12 text-gray-100"
            >
              {children}

              {/* ── 2. STAGGERED ELEMENT 3: BOTTOM WAYPOINT NAVIGATION FOOTER ── */}
              <motion.div
                variants={itemVariants}
                className="pt-8 sm:pt-10 mt-10 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono"
              >
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                  <span className="tracking-wide">Sector dossier synchronized</span>
                </div>

                <button
                  onClick={handleNextStation}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-xs text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none shadow-md shadow-black/40"
                >
                  <span className="tracking-wider">Proceed to {nextLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
