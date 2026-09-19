'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

const ORDERED_SECTIONS: SectionId[] = [
  'bridge',
  'about',
  'skills',
  'experience',
  'education',
  'ai',
  'portfolio',
  'contact',
];

export default function NavigationShortcuts() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept keystrokes when typing into form fields
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInput) return;

      let targetSection: SectionId | null = null;

      // 1 to 8 digit navigation
      if (e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key, 10) - 1;
        if (ORDERED_SECTIONS[index]) {
          targetSection = ORDERED_SECTIONS[index];
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const currentIndex = ORDERED_SECTIONS.indexOf(activeSection);
        const nextIndex = (currentIndex + 1) % ORDERED_SECTIONS.length;
        targetSection = ORDERED_SECTIONS[nextIndex];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const currentIndex = ORDERED_SECTIONS.indexOf(activeSection);
        const prevIndex =
          (currentIndex - 1 + ORDERED_SECTIONS.length) % ORDERED_SECTIONS.length;
        targetSection = ORDERED_SECTIONS[prevIndex];
      }

      if (targetSection && targetSection !== activeSection) {
        e.preventDefault();
        soundFX.playButtonClick();
        setSection(targetSection);
        document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Touch swipe handling for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return;

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      // Check for horizontal swipe dominance (> 60px and dx > 1.5 * dy)
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const currentIndex = ORDERED_SECTIONS.indexOf(activeSection);
        let targetIndex = currentIndex;

        if (deltaX < 0) {
          // Swipe Left -> Next Section
          targetIndex = (currentIndex + 1) % ORDERED_SECTIONS.length;
        } else {
          // Swipe Right -> Previous Section
          targetIndex =
            (currentIndex - 1 + ORDERED_SECTIONS.length) % ORDERED_SECTIONS.length;
        }

        const targetSection = ORDERED_SECTIONS[targetIndex];
        if (targetSection && targetSection !== activeSection) {
          soundFX.playButtonClick();
          setSection(targetSection);
          document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, setSection]);

  return null;
}
