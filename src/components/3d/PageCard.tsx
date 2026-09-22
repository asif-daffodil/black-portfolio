'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore, SectionId, SECTION_ORDER } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import {
  ORBITAL_RING_RADIUS,
  DOCKED_CARD_SCALE,
  FOCUSED_CARD_SCALE,
  NODE_TRANSITION_DURATION,
  easeInOutCubic,
  StationData,
} from './railConfig';
import {
  STATION_HOLO_THEMES,
  SECTION_LABELS,
} from '@/components/hud/FloatingPanel';
import {
  Compass,
  User,
  Cpu,
  Briefcase,
  GraduationCap,
  Bot,
  FolderGit2,
  Mail,
  ArrowRight,
  X,
} from 'lucide-react';

// Station Content Components
import BridgeHero from '@/components/sections/BridgeHero';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import AiSection from '@/components/sections/AiSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';

const STATION_ICONS: Record<StationData['iconName'], React.ComponentType<{ className?: string; size?: number }>> = {
  Compass,
  User,
  Cpu,
  Briefcase,
  GraduationCap,
  Bot,
  FolderGit2,
  Mail,
};

const SECTIONS: Record<SectionId, React.ComponentType> = {
  bridge: BridgeHero,
  about: AboutSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  education: EducationSection,
  ai: AiSection,
  portfolio: PortfolioSection,
  contact: ContactSection,
};

interface PageCardProps {
  station: StationData;
  focusLocal: THREE.Vector3;
  getRingAngle: () => number;
}

export default function PageCard({
  station,
  focusLocal,
  getRingAngle,
}: PageCardProps) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const toggleSection = useSceneStore((state) => state.toggleSection);
  const setSection = useSceneStore((state) => state.setSection);
  const deactivateSection = useSceneStore((state) => state.deactivateSection);

  const isActive = activeSection === station.id;
  const [hovered, setHovered] = useState(false);
  const [wState, setWState] = useState(0.0);

  const groupRef = useRef<THREE.Group>(null);
  const animRef = useRef({
    currentW: 0.0,
    startW: 0.0,
    targetW: 0.0,
    startTime: 0,
  });

  // Next station calculation for waypoint navigation
  const currentIndex = SECTION_ORDER.indexOf(station.id);
  const nextSectionId = SECTION_ORDER[(currentIndex + 1) % SECTION_ORDER.length];
  const nextLabel = SECTION_LABELS[nextSectionId];

  const theme = STATION_HOLO_THEMES[station.id] || STATION_HOLO_THEMES.bridge;
  const IconComponent = STATION_ICONS[station.iconName] || Compass;
  const SectionComponent = SECTIONS[station.id];

  // Initiate ease-in-out transition when activeSection changes
  useEffect(() => {
    const anim = animRef.current;
    const target = activeSection === station.id ? 1.0 : 0.0;
    if (anim.targetW !== target) {
      anim.startW = anim.currentW;
      anim.targetW = target;
      anim.startTime = performance.now();
    }
  }, [activeSection, station.id]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const anim = animRef.current;

    // 1. Advance ease-in-out transition weight w
    if (anim.startW !== anim.targetW) {
      const elapsed = (performance.now() - anim.startTime) / 1000;
      const u = THREE.MathUtils.clamp(elapsed / NODE_TRANSITION_DURATION, 0, 1);
      const eased = easeInOutCubic(u);
      anim.currentW = THREE.MathUtils.lerp(anim.startW, anim.targetW, eased);
      if (u >= 1) {
        anim.startW = anim.targetW;
      }
      setWState(anim.currentW);
    }

    const w = anim.currentW;
    const ringAngle = getRingAngle();

    // 2. Compute live moving slot position on the rotating ring
    const currentSlotAngle = station.angle + ringAngle;
    const slotX = ORBITAL_RING_RADIUS * Math.cos(currentSlotAngle);
    const slotZ = ORBITAL_RING_RADIUS * Math.sin(currentSlotAngle);

    // 3. Interpolate 3D position directly from live slot to focused staging position
    if (groupRef.current) {
      const idleHover = w > 0.8 ? Math.sin(time * 1.8 + station.index) * 0.04 * w : 0;
      const px = THREE.MathUtils.lerp(slotX, focusLocal.x, w);
      const py = THREE.MathUtils.lerp(0.08, focusLocal.y, w) + idleHover;
      const pz = THREE.MathUtils.lerp(slotZ, focusLocal.z, w);
      groupRef.current.position.set(px, py, pz);

      // 4. Always billboard to camera
      groupRef.current.quaternion.copy(state.camera.quaternion);

      // 5. Interpolate 3D scale cleanly between DOCKED_CARD_SCALE and FOCUSED_CARD_SCALE
      const baseDocked = hovered && w < 0.2 ? DOCKED_CARD_SCALE * 1.08 : DOCKED_CARD_SCALE;
      const currentScale = THREE.MathUtils.lerp(baseDocked, FOCUSED_CARD_SCALE, w);
      groupRef.current.scale.set(currentScale, currentScale, currentScale);
    }
  });

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    toggleSection(station.id);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    deactivateSection();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    setSection(nextSectionId);
  };

  // Smooth cross-fades during motion
  const dockedOpacity = THREE.MathUtils.clamp((0.35 - wState) / 0.35, 0, 1);
  const contentOpacity = THREE.MathUtils.clamp((wState - 0.30) / 0.40, 0, 1);
  const currentCardScale = THREE.MathUtils.lerp(
    hovered && wState < 0.2 ? DOCKED_CARD_SCALE * 1.08 : DOCKED_CARD_SCALE,
    FOCUSED_CARD_SCALE,
    wState
  );

  return (
    <group ref={groupRef}>
      {/* ── MECHANICAL BERTH ALIGNMENT CLAMP (Sits on rail when docked) ── */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.32]} />
        <meshStandardMaterial
          color="#060a14"
          metalness={0.92}
          roughness={0.25}
          emissive={station.color}
          emissiveIntensity={wState > 0.8 ? 0.9 : 0.25}
        />
      </mesh>

      {/* Sizing is controlled purely via wrapping Object3D scale; distanceFactor and sprite omitted */}
      <Html
        transform
        center
        zIndexRange={isActive || wState > 0.05 ? [100, 50] : [10, 0]}
        wrapperClass="page-card-3d-wrapper pointer-events-none select-none"
      >
        {/* ══════════════════════════════════════════════════════════════
            STATE A: COMPACT DOCKED CARD VIEW (When in orbit on ring)
        ══════════════════════════════════════════════════════════════ */}
        {wState < 0.45 && (
          <div
            className={`page-card-interactive pointer-events-auto cursor-pointer transition-shadow duration-200 w-[240px] h-[100px] rounded-2xl bg-[#050914]/90 backdrop-blur-md border ${
              theme.border
            } ${theme.glow} p-3 overflow-hidden relative select-none ${
              hovered ? 'shadow-[0_0_20px_rgba(56,189,248,0.45)] border-white/40' : ''
            }`}
            onClick={handleCardClick}
            onMouseEnter={() => {
              setHovered(true);
              soundFX.playHoverTick();
            }}
            onMouseLeave={() => setHovered(false)}
            style={{
              opacity: dockedOpacity,
            }}
          >
            {/* Top holographic projection emitter notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            {/* Holographic sci-fi corner brackets */}
            <span className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />

            {/* Header row: Sector code & status beacon */}
            <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
              <span className={`font-bold tracking-wider ${theme.titleColor}`}>
                [ {station.code} ]
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] tracking-widest text-gray-400">
                  {station.sublabel}
                </span>
                <span className={`w-2 h-2 rounded-full animate-pulse ${theme.dot}`} />
              </div>
            </div>

            {/* Main row: Icon + Station Title */}
            <div className="flex items-center gap-2.5 pt-1">
              <div
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0"
                style={{ color: station.beaconColor }}
              >
                <IconComponent size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-wide text-white truncate drop-shadow-sm">
                  {station.name}
                </span>
                <span className="text-[10px] font-mono text-gray-400 truncate">
                  {station.badge}
                </span>
              </div>
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/80 pt-1 border-t border-white/5 mt-0.5">
              <span>BERTH {station.index + 1} / 8</span>
              <span className="hover:text-cyan-300 font-semibold">ENGAGE ↗</span>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STATE B: FULL READABLE ACTIVE PANEL (When focused in front)
        ══════════════════════════════════════════════════════════════ */}
        {wState > 0.25 && (
          <div
            className={`page-card-interactive pointer-events-auto w-[720px] max-w-[88vw] h-[480px] max-h-[70vh] rounded-3xl bg-[#050914]/88 backdrop-blur-md border ${
              theme.border
            } ${theme.glow} p-6 overflow-hidden relative flex flex-col justify-between`}
            style={{
              opacity: contentOpacity,
            }}
          >
            {/* Top holographic projection emitter notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-28 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            {/* Holographic sci-fi corner brackets */}
            <span className={`absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 ${theme.bracketColor} pointer-events-none`} />
            <span className={`absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 ${theme.bracketColor} pointer-events-none`} />

            {/* 1. TOP HUD TELEMETRY BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${theme.dot}`} />
                <span
                  className={`font-mono text-xs sm:text-sm font-bold tracking-widest uppercase ${theme.titleColor}`}
                  style={{ textShadow: `0 0 12px ${theme.textGlow}` }}
                >
                  {station.code} // {station.sectorName}
                </span>
                <span
                  className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                >
                  {station.badge}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-mono text-gray-400">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  TELEMETRY: ONLINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] text-gray-300 font-mono tracking-wider">
                  STATION 0{currentIndex + 1}
                </span>

                {/* DIEGETIC CONSOLE CLOSE (×) BUTTON */}
                <button
                  type="button"
                  onClick={handleClose}
                  onMouseEnter={() => soundFX.playHoverTick()}
                  title="Return node to orbital ring (ESC)"
                  aria-label="Close station and return to orbital ring"
                  className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#131d33] to-[#080d19] border border-white/15 hover:border-red-400/60 text-gray-300 hover:text-white shadow-sm hover:shadow-[0_0_14px_rgba(248,113,113,0.35)] active:scale-95 active:translate-y-[1px] transition-all cursor-pointer select-none"
                >
                  <span className="absolute top-0 inset-x-0 h-[1.5px] bg-red-400/40 group-hover:bg-red-400 group-hover:shadow-[0_0_6px_#f87171] transition-all rounded-t" />
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 group-hover:text-red-300">
                    DOCK // ESC
                  </span>
                  <X className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* 2. SCROLLABLE BODY CONTENT */}
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-5 scrollbar-thin text-gray-100 min-h-0">
              {SectionComponent && <SectionComponent />}
            </div>

            {/* 3. BOTTOM WAYPOINT NAVIGATION FOOTER */}
            <div className="pt-3 mt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs shrink-0">
              <div className="flex items-center gap-2 text-gray-400">
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span className="tracking-wide">Sector dossier synchronized</span>
              </div>

              <button
                onClick={handleNext}
                onMouseEnter={() => soundFX.playHoverTick()}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-xs text-gray-300 hover:text-white transition-all cursor-pointer focus:outline-none shadow-md shadow-black/40"
              >
                <span className="tracking-wider">Proceed to {nextLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </Html>
    </group>
  );
}
