import { create } from 'zustand';

export type SectionId =
  | 'bridge'
  | 'about'
  | 'skills'
  | 'experience'
  | 'education'
  | 'ai'
  | 'portfolio'
  | 'contact';

export type ViewMode = '3d' | 'classic';

export type TravelDirection = 'forward' | 'backward' | 'none';

export const SECTION_ORDER: SectionId[] = [
  'bridge',      // 0
  'about',       // 1
  'skills',      // 2
  'experience',  // 3
  'education',   // 4
  'ai',          // 5
  'portfolio',   // 6
  'contact',     // 7
];

export function getRailPath(
  fromId: SectionId,
  toId: SectionId
): { direction: TravelDirection; intermediates: SectionId[] } {
  const fromIdx = SECTION_ORDER.indexOf(fromId);
  const toIdx = SECTION_ORDER.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) {
    return { direction: 'none', intermediates: [] };
  }

  let delta = toIdx - fromIdx;
  if (delta > 4) delta -= 8;
  if (delta <= -4) delta += 8;

  const direction: TravelDirection = delta > 0 ? 'forward' : 'backward';
  const step = delta > 0 ? 1 : -1;
  const count = Math.abs(delta);

  const intermediates: SectionId[] = [];
  for (let i = 1; i < count; i++) {
    const nextIdx = (fromIdx + i * step + 8) % 8;
    intermediates.push(SECTION_ORDER[nextIdx]);
  }

  return { direction, intermediates };
}

export function getRailTravelTiming(fromId: SectionId, toId: SectionId): {
  direction: TravelDirection;
  intermediates: SectionId[];
  travelDuration: number;
  exitDuration: number;
  enterDuration: number;
} {
  const { direction, intermediates } = getRailPath(fromId, toId);
  const intermediateCount = intermediates.length;

  if (intermediateCount === 0) {
    // Adjacent station hop (1 step, e.g. Bridge -> About)
    return {
      direction,
      intermediates,
      travelDuration: 2.10,
      exitDuration: 0.35,
      enterDuration: 0.70,
    };
  }

  // Multi-station hop (e.g. Bridge -> Education, 3 intermediates)
  const travelDuration = 2.10 + intermediateCount * 0.12;
  return {
    direction,
    intermediates,
    travelDuration,
    exitDuration: 0.35,
    enterDuration: 0.70,
  };
}

export type BootStage = 'loading' | 'powering' | 'flicker' | 'iris' | 'push_in' | 'ready';

export interface SceneStore {
  activeSection: SectionId;
  displayedSection: SectionId | null;
  transitionDirection: TravelDirection;
  isFlashing: boolean;
  travelDuration: number;
  exitDuration: number;
  enterDuration: number;
  setSection: (section: SectionId) => void;
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isBooted: boolean;
  setBooted: (booted: boolean) => void;
  bootStage: BootStage;
  setBootStage: (stage: BootStage) => void;
  bootPoweredCount: number;
  setBootPoweredCount: (count: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  detectionReason: string | null;
  initDetection: () => void;
  railProgress: number;
  setRailProgress: (progress: number) => void;
}

export function detectOptimalViewMode(): { mode: ViewMode; reason: string | null } {
  if (typeof window === 'undefined') {
    return { mode: '3d', reason: null };
  }

  // 1. Check user manual preference stored in localStorage
  try {
    const saved = localStorage.getItem('asif_portfolio_view_mode');
    if (saved === '3d' || saved === 'classic') {
      return { mode: saved, reason: 'user-preference' };
    }
  } catch {
    // ignore storage errors
  }

  // 1b. Check if client is a search engine crawler or bot
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || '';
    if (
      /bot|googlebot|crawler|spider|robot|crawling|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|headlesschrome/i.test(
        ua
      )
    ) {
      return { mode: 'classic', reason: 'search-crawler' };
    }
  }

  // 2. Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { mode: 'classic', reason: 'prefers-reduced-motion' };
  }

  // 3. Check Network Information API for slow connection or data-saver
  const nav = navigator as unknown as {
    connection?: { effectiveType?: string; saveData?: boolean };
    mozConnection?: { effectiveType?: string; saveData?: boolean };
    webkitConnection?: { effectiveType?: string; saveData?: boolean };
  };
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (conn) {
    if (conn.saveData) {
      return { mode: 'classic', reason: 'data-saver' };
    }
    if (
      conn.effectiveType === 'slow-2g' ||
      conn.effectiveType === '2g' ||
      conn.effectiveType === '3g'
    ) {
      return { mode: 'classic', reason: 'slow-connection' };
    }
  }

  // 4. Check low-end hardware (Device Memory API & Hardware Concurrency)
  const navDev = navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number };
  if (navDev.deviceMemory && navDev.deviceMemory < 4) {
    return { mode: 'classic', reason: 'low-memory-device' };
  }
  if (navDev.hardwareConcurrency && navDev.hardwareConcurrency <= 2) {
    return { mode: 'classic', reason: 'low-cpu-cores' };
  }

  // Default to full 3D experience
  return { mode: '3d', reason: null };
}

let transitionTimeouts: (ReturnType<typeof setTimeout>)[] = [];

export const useSceneStore = create<SceneStore>((set, get) => ({
  activeSection: 'bridge',
  displayedSection: 'bridge',
  transitionDirection: 'none',
  isFlashing: false,
  travelDuration: 2.10,
  exitDuration: 0.35,
  enterDuration: 0.70,
  setSection: (targetSection: SectionId) => {
    const currentSection = get().activeSection;
    if (currentSection === targetSection) return;

    // Clear any previous transition queues
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Respect prefers-reduced-motion: simple cross-fade with no slide or flash-through
    if (prefersReducedMotion) {
      set({
        activeSection: targetSection,
        displayedSection: targetSection,
        transitionDirection: 'none',
        isFlashing: false,
        travelDuration: 0.3,
        exitDuration: 0.2,
        enterDuration: 0.3,
      });
      return;
    }

    const {
      direction,
      travelDuration,
      exitDuration,
      enterDuration,
    } = getRailTravelTiming(currentSection, targetSection);

    // Step 1: Active section updates, outgoing panel immediately begins responsive exit (~0.35s)
    set({
      activeSection: targetSection,
      displayedSection: null,
      transitionDirection: direction,
      travelDuration,
      exitDuration,
      enterDuration,
      isFlashing: false,
    });

    // Step 2: Smooth cinematic handoff: camera approaches destination, and new holographic panel arrives
    const arrivalDelay = Math.max(Math.round((travelDuration - enterDuration * 0.75) * 1000), 500);
    const tArrive = setTimeout(() => {
      set({
        displayedSection: targetSection,
        isFlashing: false,
      });
    }, arrivalDelay);
    transitionTimeouts.push(tArrive);
  },
  selectedProjectId: null,
  setSelectedProject: (id: string | null) => set({ selectedProjectId: id }),
  isMuted: false, // audio system armed; engages upon first user click to satisfy browser autoplay policies
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  isBooted: false,
  setBooted: (booted: boolean) => {
    try {
      if (booted && typeof window !== 'undefined') {
        sessionStorage.setItem('asif_portfolio_has_booted', 'true');
      }
    } catch {
      // ignore storage errors
    }
    set({ isBooted: booted });
  },
  bootStage: 'loading',
  setBootStage: (stage: BootStage) => set({ bootStage: stage }),
  bootPoweredCount: 0,
  setBootPoweredCount: (count: number) => set({ bootPoweredCount: count }),
  viewMode: '3d',
  detectionReason: null,
  railProgress: 0,
  setRailProgress: (progress: number) => set({ railProgress: progress }),
  setViewMode: (mode: ViewMode) => {
    try {
      localStorage.setItem('asif_portfolio_view_mode', mode);
    } catch {
      // ignore storage error
    }
    set({ viewMode: mode });
  },
  initDetection: () => {
    const { mode, reason } = detectOptimalViewMode();
    set({ viewMode: mode, detectionReason: reason });
  },
}));
