'use client';

import { Canvas } from '@react-three/fiber';
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
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.75]}
        style={{ background: '#030509' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
