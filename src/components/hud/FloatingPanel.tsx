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

export const SECTION_LABELS: Record<SectionId, string> = {
  bridge: '00 ORBIT // BRIDGE',
  about: '01 ORIGIN // PROFILE',
  skills: '02 ARSENAL // SKILLS',
  experience: '03 FLIGHT LOG // CAREER',
  education: '04 CREDENTIALS // EDUCATION',
  ai: '05 NEURAL AI // AGENTS',
  portfolio: '06 SHOWCASE // PORTFOLIO',
  contact: '07 RELAY // CONTACT',
};

export type StationHoloTheme = {
  border: string;
  glow: string;
  dot: string;
  textGlow: string;
  titleColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  bracketColor: string;
};

export const STATION_HOLO_THEMES: Record<SectionId, StationHoloTheme> = {
  bridge: {
    border: 'border-blue-400/40',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]',
    dot: 'bg-blue-400 shadow-[0_0_10px_#3b82f6]',
    textGlow: 'rgba(59, 130, 246, 0.65)',
    titleColor: 'text-blue-300',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/35',
    badgeText: 'text-blue-300',
    bracketColor: 'border-blue-400/60',
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

export default function FloatingPanel({
  children,
  className = '',
}: FloatingPanelProps) {
  return (
    <div className={`w-full text-gray-100 ${className}`}>
      {children}
    </div>
  );
}
