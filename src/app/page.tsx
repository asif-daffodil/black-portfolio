'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSceneStore } from '@/store/useSceneStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ViewModeToggle from '@/components/ui/ViewModeToggle';
import ClassicPortfolio from '@/components/classic/ClassicPortfolio';
import AnimatedPanelContainer from '@/components/hud/AnimatedPanelContainer';
import AudioToggle from '@/components/ui/AudioToggle';
import HudRadar from '@/components/ui/HudRadar';
import NavigationShortcuts from '@/components/layout/NavigationShortcuts';
import SemanticNav from '@/components/layout/SemanticNav';
import BootSequence from '@/components/3d/BootSequence';

// Dynamically import Three.js scene so classic view never pays Three.js bundle overhead
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas'),
  {
    ssr: false,
    loading: () => <BootSequence />,
  }
);

export default function Home() {
  const viewMode = useSceneStore((state) => state.viewMode);
  const initDetection = useSceneStore((state) => state.initDetection);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initDetection();
    setMounted(true);
  }, [initDetection]);

  const is3D = mounted && viewMode === '3d';

  return (
    <main className="relative min-h-screen text-gray-100 bg-[#05070c] selection:bg-cyan-500/30 selection:text-white">
      {/* Universal Top Navigation Header */}
      <Navbar />

      {/* Always-visible Corner View Mode Toggle */}
      <ViewModeToggle />

      {/* Fallback / Classic Static View (No 3D Canvas, Fast Scroll-Based) */}
      {!is3D && <ClassicPortfolio />}

      {/* Immersive 3D Cockpit Mode */}
      {is3D && (
        <>
          <NavigationShortcuts />
          <SemanticNav />
          <BootSequence />
          <SceneCanvas />
          <HudRadar />
          <AudioToggle />

          {/* Animated Glass/HUD Panel Container driven by rail travel */}
          <AnimatedPanelContainer />

          <Footer />
        </>
      )}
    </main>
  );
}
