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
import BootSequence from '@/components/3d/BootSequence';
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
    const currentIdx = activeSection ? SECTION_ORDER.indexOf(activeSection) : -1;
    let nextIdx: number;

    if (currentIdx === -1) {
      nextIdx = direction === 'next' ? 0 : SECTION_ORDER.length - 1;
    } else if (direction === 'next') {
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

    let overscrollAccumulator = 0;

    const handleWheel = (e: WheelEvent) => {
      // Check active panel's scrollable container anywhere inside the view
      const scrollable = document.querySelector('.overflow-y-auto') as HTMLElement | null;

      if (scrollable) {
        const canScroll = scrollable.scrollHeight > scrollable.clientHeight + 15;
        if (canScroll) {
          const atTop = scrollable.scrollTop <= 2;
          const atBottom =
            scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 8;

          // While user is actively scrolling through content, allow natural scroll without hijacking
          if ((!atTop && e.deltaY < 0) || (!atBottom && e.deltaY > 0)) {
            overscrollAccumulator = 0;
            return;
          }

          // User is at boundary: require deliberate, sustained overscroll (> 240 delta)
          if (atBottom && e.deltaY > 0) {
            overscrollAccumulator += e.deltaY;
            if (overscrollAccumulator < 240) {
              return;
            }
            overscrollAccumulator = 0;
          } else if (atTop && e.deltaY < 0) {
            overscrollAccumulator += Math.abs(e.deltaY);
            if (overscrollAccumulator < 240) {
              return;
            }
            overscrollAccumulator = 0;
          } else {
            overscrollAccumulator = 0;
            return;
          }
        }
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 1100) return; // 1100ms smooth debounce

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

      if (e.key === 'Escape') {
        const displayed = useSceneStore.getState().displayedSection;
        if (displayed) {
          e.preventDefault();
          soundFX.playButtonClick();
          useSceneStore.getState().setDisplayedSection(null);
          return;
        }
      }

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

      const scrollable = document.querySelector('.overflow-y-auto') as HTMLElement | null;
      if (scrollable) {
        const canScroll = scrollable.scrollHeight > scrollable.clientHeight + 15;
        if (canScroll) {
          const atTop = scrollable.scrollTop <= 2 && deltaY < -60;
          const atBottom =
            scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 8 &&
            deltaY > 60;

          if (!atTop && !atBottom) return;
        }
      }

      const now = Date.now();
      if (now - lastScrollTime.current < 900) return;

      if (Math.abs(deltaY) > 75) {
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

  const activeIndex = activeSection ? SECTION_ORDER.indexOf(activeSection) : -1;

  return (
    <main className="relative min-h-screen text-gray-100 bg-[#030509] selection:bg-cyan-500/30 selection:text-white overflow-hidden">
      {/* Cockpit Intro Boot Sequence */}
      <BootSequence />

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
              onMouseEnter={() => soundFX.playHoverTick()}
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
                {activeIndex >= 0 ? `${activeIndex + 1} / ${SECTION_ORDER.length}` : 'ORBIT // 8 NODES'}
              </span>
            </div>

            {/* Next Chapter Button */}
            <button
              onClick={() => navigateStation('next')}
              onMouseEnter={() => soundFX.playHoverTick()}
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
