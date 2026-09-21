'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
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
  const enterDuration = useSceneStore((state) => state.enterDuration);
  const exitDuration = useSceneStore((state) => state.exitDuration);
  const isBooted = useSceneStore((state) => state.isBooted);

  // Reduced motion preference check
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Holographic 3D Floating Panel Motion Variants ──
  // 2. Entrance: Panel fades in + scales up from 90% to 100% + slight upward float (~0.6-0.8s, ease-out)
  // 3. Exit: Reverse of entrance, faster (~0.3-0.4s) for high responsiveness when clicking away
  const holographicVariants: Variants = {
    initial: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.90,
      y: prefersReducedMotion ? 0 : 22,
    },
    animate: {
      opacity: 1,
      scale: 1.0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : (enterDuration || 0.70),
        ease: [0.16, 1, 0.3, 1] as const, // Smooth cubic ease-out
      },
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.90,
      y: prefersReducedMotion ? 0 : 16,
      transition: {
        duration: prefersReducedMotion ? 0.15 : (exitDuration || 0.35),
        ease: [0.4, 0, 1, 1] as const, // Responsive fast ease
      },
    },
  };

  const SectionComponent = displayedSection ? SECTIONS[displayedSection] : null;

  return (
    <div className="fixed inset-x-0 top-16 sm:top-20 bottom-16 sm:bottom-20 z-20 flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        {isBooted && displayedSection && SectionComponent && (
          <motion.div
            key={displayedSection}
            variants={holographicVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex items-center justify-center pointer-events-auto"
          >
            <SectionComponent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
