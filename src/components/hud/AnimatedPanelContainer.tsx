'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSceneStore, SectionId, TravelDirection } from '@/store/useSceneStore';
import BridgeHero from '@/components/sections/BridgeHero';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import AiSection from '@/components/sections/AiSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ContactSection from '@/components/sections/ContactSection';

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

export default function AnimatedPanelContainer() {
  const displayedSection = useSceneStore((state) => state.displayedSection);
  const transitionDirection = useSceneStore((state) => state.transitionDirection);
  const isFlashing = useSceneStore((state) => state.isFlashing);
  const enterDuration = useSceneStore((state) => state.enterDuration);
  const exitDuration = useSceneStore((state) => state.exitDuration);

  // Fallback to bridge if null
  const currentSection = displayedSection || 'bridge';
  const SectionComponent = SECTIONS[currentSection] || BridgeHero;

  // Reduced motion preference check
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Framer Motion variants for directional slide & pass-through flash
  const variants: Variants = {
    initial: (direction: TravelDirection) => {
      if (prefersReducedMotion || direction === 'none') {
        return { opacity: 0, x: 0, scale: 1 };
      }
      if (isFlashing) {
        return {
          opacity: 0,
          x: direction === 'forward' ? 160 : -160,
          scale: 0.95,
        };
      }
      return {
        opacity: 0,
        x: direction === 'forward' ? 140 : -140,
        scale: 0.97,
      };
    },
    animate: (direction: TravelDirection) => {
      if (prefersReducedMotion || direction === 'none') {
        return {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: { duration: 0.3, ease: 'easeOut' as const },
        };
      }
      if (isFlashing) {
        // High-speed pass-through flash for intermediate stations (~160ms)
        return {
          opacity: [0, 0.92, 0.92, 0],
          x: direction === 'forward' ? [160, 20, -20, -160] : [-160, -20, 20, 160],
          scale: 0.98,
          transition: {
            duration: 0.16,
            times: [0, 0.2, 0.8, 1],
            ease: 'linear' as const,
          },
        };
      }
      return {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: enterDuration,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      };
    },
    exit: (direction: TravelDirection) => {
      if (prefersReducedMotion || direction === 'none') {
        return {
          opacity: 0,
          x: 0,
          scale: 1,
          transition: { duration: 0.25, ease: 'easeIn' as const },
        };
      }
      return {
        opacity: 0,
        x: direction === 'forward' ? -140 : 140,
        scale: 0.97,
        transition: {
          duration: exitDuration,
          ease: [0.4, 0, 1, 1] as const,
        },
      };
    },
  };

  return (
    <div className="fixed inset-x-0 top-16 sm:top-20 bottom-24 sm:bottom-28 z-20 flex items-center justify-center p-3 sm:p-4 pointer-events-none overflow-hidden">
      <AnimatePresence mode="popLayout" custom={transitionDirection}>
        <motion.div
          key={currentSection}
          custom={transitionDirection}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          aria-hidden={isFlashing}
          className={`w-full flex items-center justify-center ${
            isFlashing ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <SectionComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
