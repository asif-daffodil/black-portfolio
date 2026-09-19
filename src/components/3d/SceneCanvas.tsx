'use client';

import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';

export default function SceneCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: 'auto' }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'default',
        }}
        dpr={1}
        style={{ background: '#05070c' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
