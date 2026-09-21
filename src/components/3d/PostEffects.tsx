'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

export default function PostEffects() {
  // Radial chromatic aberration vector: subtle edge dispersion
  const chromaOffset = useMemo(
    () => new THREE.Vector2(0.0008, 0.0008),
    []
  );

  return (
    <EffectComposer multisampling={0}>
      {/* ── PASS 1: RenderPass (implicit base pass in EffectComposer) ── */}

      {/* ── PASS 2: UnrealBloomPass ── */}
      {/* Tuned so only incandescent accretion disk, light shafts, and console glow bloom */}
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.25}
        radius={0.4}
        levels={5}
        mipmapBlur
      />

      {/* ── PASS 3: Subtle Vignette Pass ── */}
      {/* Darkens screen edges ~15-20% with soft feathering */}
      <Vignette
        eskil={false}
        offset={0.24}
        darkness={0.65}
      />

      {/* ── PASS 4: Very Subtle Film Grain ── */}
      {/* Low opacity animated per-frame noise for authentic analog texture */}
      <Noise
        opacity={0.05}
        blendFunction={BlendFunction.OVERLAY}
        premultiply
      />

      {/* ── PASS 5: Subtle Chromatic Aberration ── */}
      {/* Radial falloff ensures the center 55% remains crisp and clean */}
      <ChromaticAberration
        offset={chromaOffset}
        radialModulation={true}
        modulationOffset={0.55}
      />

      {/* ── PASS 6: ACES Filmic Tone Mapping ── */}
      {/* Deep blacks, rich midtones, and smooth highlight roll-off */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
