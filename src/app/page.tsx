'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSceneStore, SectionId, SECTION_ORDER } from '@/store/useSceneStore';
import Navbar from '@/components/layout/Navbar';
import ViewModeToggle from '@/components/ui/ViewModeToggle';
import CustomCursor from '@/components/ui/CustomCursor';
import AltitudeIndicator from '@/components/ui/AltitudeIndicator';
import ClassicPortfolio from '@/components/classic/ClassicPortfolio';
import AnimatedPanelContainer from '@/components/hud/AnimatedPanelContainer';
import { ChevronDown, ChevronUp, Compass } from 'lucide-react';
import { soundFX } from '@/lib/sound';

// Dynamically import Three.js scene for optimal loading
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  const viewMode = useSceneStore((state) => state.viewMode);
  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);
  const initDetection = useSceneStore((state) => state.initDetection);
  const [mounted, setMounted] = useState(false);

  const lastScrollTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    initDetection();
    setMounted(true);
  }, [initDetection]);

  const is3D = mounted && viewMode === '3d';

  // Navigate forward / backward along the 8 spatial stations
  const navigateStation = useCallback((direction: 'next' | 'prev') => {
    const currentIdx = SECTION_ORDER.indexOf(activeSection);
    let nextIdx: number;

    if (direction === 'next') {
      nextIdx = (currentIdx + 1) % SECTION_ORDER.length;
    } else {
      nextIdx = (currentIdx - 1 + SECTION_ORDER.length) % SECTION_ORDER.length;
    }

    soundFX.playButtonClick();
    setSection(SECTION_ORDER[nextIdx]);
  }, [activeSection, setSection]);

  // Wheel & Keyboard Continuous Scroll Listener for 3D Mode
  useEffect(() => {
    if (!is3D) return;

    const handleWheel = (e: WheelEvent) => {
      // If user is actively scrolling inside an overflowing scroll container, don't hijack immediately
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.overflow-y-auto');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 2 && e.deltaY < -20;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 4 &&
          e.deltaY > 20;

        if (!atTop && !atBottom) {
          return; // Allow natural content scroll
        }
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 900) return; // 900ms smooth debounce

      if (Math.abs(e.deltaY) > 35) {
        lastScrollTime.current = now;
        if (e.deltaY > 0) {
          navigateStation('next');
        } else {
          navigateStation('prev');
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in form inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const now = Date.now();
      if (now - lastScrollTime.current < 600) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        lastScrollTime.current = now;
        navigateStation('next');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        lastScrollTime.current = now;
        navigateStation('prev');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest('.overflow-y-auto');
      if (scrollable) {
        const atTop = scrollable.scrollTop <= 2 && deltaY < -40;
        const atBottom =
          scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 4 &&
          deltaY > 40;

        if (!atTop && !atBottom) return;
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;

      if (Math.abs(deltaY) > 60) {
        lastScrollTime.current = now;
        if (deltaY > 0) {
          navigateStation('next');
        } else {
          navigateStation('prev');
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [is3D, navigateStation]);

  const activeIndex = SECTION_ORDER.indexOf(activeSection);
  const nextSectionId = SECTION_ORDER[(activeIndex + 1) % SECTION_ORDER.length];
  const prevSectionId = SECTION_ORDER[(activeIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length];

  return (
    <main className="relative min-h-screen text-gray-100 bg-[#030509] selection:bg-cyan-500/30 selection:text-white overflow-hidden">
      {/* Custom Spring Magnetic Cursor */}
      <CustomCursor />

      {/* Floating Header Navigation */}
      <Navbar />

      {/* View Mode Toggle (Corner) */}
      <ViewModeToggle />

      {/* ── Fallback Classic Static View ── */}
      {!is3D && <ClassicPortfolio />}

      {/* ── Cinematic 3D Experience (Robin Payot / Atmos by Leeroy style) ── */}
      {is3D && (
        <>
          {/* Fullscreen 3D WebGL Canvas */}
          <SceneCanvas />

          {/* Right-Edge Vertical Altitude / Station Track */}
          <AltitudeIndicator />

          {/* Center Floating Glassmorphic Content Panels */}
          <AnimatedPanelContainer />

          {/* Bottom Floating Spatial Flight Controls */}
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 bg-[#070d1e]/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            {/* Prev Chapter Button */}
            <button
              onClick={() => navigateStation('prev')}
              aria-label="Previous Chapter"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-gray-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors focus:outline-none"
            >
              <ChevronUp size={14} />
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Prev</span>
            </button>

            {/* Current Chapter Indicator Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Compass size={13} className="text-cyan-400 animate-spin-slow" />
              <span className="tracking-widest">
                {activeIndex + 1} / {SECTION_ORDER.length}
              </span>
            </div>

            {/* Next Chapter Button */}
            <button
              onClick={() => navigateStation('next')}
              aria-label="Next Chapter"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-gray-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors focus:outline-none"
            >
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Next</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </>
      )}
    </main>
  );
}
