'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SceneContent from './SceneContent';

export default function SceneCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 52 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={1}
        style={{ background: '#030509' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
