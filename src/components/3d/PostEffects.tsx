'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';

export default function PostEffects() {
  const chromaOffset = useMemo(
    () => new THREE.Vector2(0.0012, 0.0012),
    []
  );

  return (
    <EffectComposer multisampling={0}>
      {/* 1. Tasteful Bloom for emissive accretion disk & console buttons */}
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.3}
        mipmapBlur
      />

      {/* 2. Cinematic Vignette */}
      <Vignette
        eskil={false}
        offset={0.16}
        darkness={0.82}
      />

      {/* 3. Subtle Chromatic Aberration around viewport edges */}
      <ChromaticAberration
        offset={chromaOffset}
        radialModulation={true}
        modulationOffset={0.4}
      />
    </EffectComposer>
  );
}
