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
  activeSection: SectionId | null;
  displayedSection: SectionId | null;
  departingSection: SectionId | null;
  pendingSection: SectionId | null;
  transitionStartTime: number;
  transitionDuration: number;
  transitionDirection: TravelDirection;
  isFlashing: boolean;
  travelDuration: number;
  exitDuration: number;
  enterDuration: number;
  setSection: (section: SectionId | null) => void;
  activateSection: (section: SectionId) => void;
  deactivateSection: () => void;
  toggleSection: (section: SectionId) => void;
  setDisplayedSection: (section: SectionId | null) => void;
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
  ringAngle: number;
  setRingAngle: (angle: number) => void;
  isDraggingRing: boolean;
  setIsDraggingRing: (isDragging: boolean) => void;
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
  activeSection: null, // Initially null so all 8 nodes are docked and the orbital ring is in clear view
  displayedSection: null,
  departingSection: null,
  pendingSection: null,
  transitionStartTime: 0,
  transitionDuration: 0.95,
  setDisplayedSection: (section: SectionId | null) => set({ displayedSection: section }),
  transitionDirection: 'none',
  isFlashing: false,
  travelDuration: 0.95,
  exitDuration: 0.35,
  enterDuration: 0.70,

  activateSection: (targetSection: SectionId) => {
    const current = get().activeSection;
    const pending = get().pendingSection;
    const departing = get().departingSection;

    // If target is already active or already pending in stage 2, nothing to do
    if (current === targetSection || pending === targetSection) return;

    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = 0.95;

    // Case 1: A section is currently active/focused.
    // SEQUENTIAL HANDOFF:
    // (a) First animate the CURRENTLY active page back down to its live ring slot
    // and let that motion fully complete (~0.95s).
    if (current) {
      set({
        activeSection: null,
        departingSection: current,
        pendingSection: targetSection,
        displayedSection: targetSection,
        transitionStartTime: now,
        transitionDuration: duration,
        transitionDirection: 'none',
        isFlashing: false,
      });

      // (b) Only once step (a) has visually finished, start animating the newly selected page
      // from its ring slot up to the focused position.
      const tNext = setTimeout(() => {
        set({
          activeSection: targetSection,
          departingSection: null,
          pendingSection: null,
          displayedSection: targetSection,
          transitionStartTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
          transitionDuration: duration,
        });
      }, Math.round(duration * 1000));
      transitionTimeouts.push(tNext);
      return;
    }

    // Case 2: A section is currently in flight returning to the ring (departingSection).
    if (departing) {
      set({
        pendingSection: targetSection,
        displayedSection: targetSection,
      });

      const elapsed = (now - get().transitionStartTime) / 1000;
      const remainingMs = Math.max(50, Math.round((duration - elapsed) * 1000));

      const tNext = setTimeout(() => {
        set({
          activeSection: targetSection,
          departingSection: null,
          pendingSection: null,
          displayedSection: targetSection,
          transitionStartTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
          transitionDuration: duration,
        });
      }, remainingMs);
      transitionTimeouts.push(tNext);
      return;
    }

    // Case 3: No section is active or departing (e.g. initial docked ring state).
    // Direct dock-to-focus animation.
    set({
      activeSection: targetSection,
      departingSection: null,
      pendingSection: null,
      displayedSection: targetSection,
      transitionStartTime: now,
      transitionDuration: duration,
      transitionDirection: 'none',
      isFlashing: false,
    });
  },

  deactivateSection: () => {
    const current = get().activeSection;
    const pending = get().pendingSection;

    if (!current) {
      if (pending) {
        transitionTimeouts.forEach(clearTimeout);
        transitionTimeouts = [];
        set({ pendingSection: null, displayedSection: null });
      }
      return;
    }

    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = 0.95;

    // Single-stage return to ring
    set({
      activeSection: null,
      departingSection: current,
      pendingSection: null,
      displayedSection: null,
      transitionStartTime: now,
      transitionDuration: duration,
      transitionDirection: 'none',
      isFlashing: false,
    });

    const tClear = setTimeout(() => {
      if (get().departingSection === current) {
        set({ departingSection: null });
      }
    }, Math.round(duration * 1000));
    transitionTimeouts.push(tClear);
  },

  toggleSection: (targetSection: SectionId) => {
    const current = get().activeSection;
    const pending = get().pendingSection;
    if (current === targetSection || pending === targetSection) {
      get().deactivateSection();
    } else {
      get().activateSection(targetSection);
    }
  },

  setSection: (targetSection: SectionId | null) => {
    if (targetSection === null) {
      get().deactivateSection();
    } else {
      get().toggleSection(targetSection);
    }
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
  ringAngle: 0,
  setRingAngle: (angle: number) => set({ ringAngle: angle }),
  isDraggingRing: false,
  setIsDraggingRing: (isDragging: boolean) => set({ isDraggingRing: isDragging }),
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

if (typeof window !== 'undefined') {
  (window as unknown as { __SCENE_STORE__?: typeof useSceneStore }).__SCENE_STORE__ = useSceneStore;
}
