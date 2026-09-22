'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { advanceSafeTime } from '@/lib/animationTime';

interface StarfieldProps {
  deepCount?: number;
  midCount?: number;
  foreCount?: number;
}

export default function Starfield({
  deepCount = 2800,
  midCount = 1400,
  foreCount = 380,
}: StarfieldProps) {
  const deepPointsRef = useRef<THREE.Points>(null);
  const midPointsRef = useRef<THREE.Points>(null);
  const forePointsRef = useRef<THREE.Points>(null);

  // Soft circular glow star sprite texture (prevents square pixel particles)
  const starTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // ── LAYER 1: Deep Cosmos Stars (Furthest Shell, Pinpoint Sparkles) ──
  const [deepPositions, deepColors, deepSizes] = useMemo(() => {
    const pos = new Float32Array(deepCount * 3);
    const col = new Float32Array(deepCount * 3);
    const sz = new Float32Array(deepCount);

    const palette = [
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#e0f2fe'), // Pale icy blue
      new THREE.Color('#93c5fd'), // Soft azure
      new THREE.Color('#cbd5e1'), // Stellar silver
      new THREE.Color('#fef08a'), // Soft star white-gold
    ];

    for (let i = 0; i < deepCount; i++) {
      const radius = 65 + Math.random() * 75; // Distant shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.08 + Math.random() * 0.08;
    }

    return [pos, col, sz];
  }, [deepCount]);

  // ── LAYER 2: Mid-Field Constellation Stars (Mid Depth, Distinct Hues) ──
  const [midPositions, midColors, midSizes] = useMemo(() => {
    const pos = new Float32Array(midCount * 3);
    const col = new Float32Array(midCount * 3);
    const sz = new Float32Array(midCount);

    const palette = [
      new THREE.Color('#38bdf8'), // Electric cyan
      new THREE.Color('#fde047'), // Warm gold
      new THREE.Color('#c084fc'), // Radiant violet
      new THREE.Color('#60a5fa'), // Bright blue
      new THREE.Color('#ffffff'), // Brilliant white
      new THREE.Color('#fb923c'), // Amber dwarf
    ];

    for (let i = 0; i < midCount; i++) {
      const radius = 28 + Math.random() * 38; // Intermediate shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.16 + Math.random() * 0.14;
    }

    return [pos, col, sz];
  }, [midCount]);

  // ── LAYER 3: Foreground Stardust & Velocity Spores (Immediate Depth) ──
  const [forePositions, foreColors, foreSizes] = useMemo(() => {
    const pos = new Float32Array(foreCount * 3);
    const col = new Float32Array(foreCount * 3);
    const sz = new Float32Array(foreCount);

    for (let i = 0; i < foreCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 2;

      const isCyan = Math.random() > 0.45;
      const isGold = !isCyan && Math.random() > 0.5;

      if (isCyan) {
        col[i * 3] = 0.22;
        col[i * 3 + 1] = 0.85;
        col[i * 3 + 2] = 1.0;
      } else if (isGold) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.78;
        col[i * 3 + 2] = 0.28;
      } else {
        col[i * 3] = 0.82;
        col[i * 3 + 1] = 0.55;
        col[i * 3 + 2] = 1.0;
      }

      sz[i] = 0.22 + Math.random() * 0.18;
    }

    return [pos, col, sz];
  }, [foreCount]);

  useFrame((state, delta) => {
    // Starfield is the primary advancer of the shared safe clock.
    // All other components call getSafeTime() — this is the only call to advanceSafeTime().
    // The returned `safeDelta` is clamped to MAX_DELTA (50 ms) and is 0 on the first
    // frame after the tab regains visibility, preventing any visible jump.
    const safeDelta = advanceSafeTime(delta);
    const px = state.pointer.x;
    const py = state.pointer.y;

    // ── 1. Deep Field Parallax (Slowest, Anchoring Background) ──
    if (deepPointsRef.current) {
      deepPointsRef.current.rotation.y += safeDelta * 0.0015;
      deepPointsRef.current.position.x = THREE.MathUtils.lerp(
        deepPointsRef.current.position.x,
        -px * 0.15,
        0.02
      );
      deepPointsRef.current.position.y = THREE.MathUtils.lerp(
        deepPointsRef.current.position.y,
        -py * 0.1,
        0.02
      );
    }

    // ── 2. Mid Field Parallax (Moderate Motion & Swirl) ──
    if (midPointsRef.current) {
      midPointsRef.current.rotation.y += safeDelta * 0.004;
      midPointsRef.current.rotation.x += safeDelta * 0.002;
      midPointsRef.current.position.x = THREE.MathUtils.lerp(
        midPointsRef.current.position.x,
        -px * 0.55,
        0.035
      );
      midPointsRef.current.position.y = THREE.MathUtils.lerp(
        midPointsRef.current.position.y,
        -py * 0.38,
        0.035
      );
    }

    // ── 3. Foreground Spores Parallax + Cosmic Drift Stream ──
    if (forePointsRef.current) {
      forePointsRef.current.position.x = THREE.MathUtils.lerp(
        forePointsRef.current.position.x,
        -px * 1.35,
        0.06
      );
      forePointsRef.current.position.y = THREE.MathUtils.lerp(
        forePointsRef.current.position.y,
        -py * 0.95,
        0.06
      );

      // Continuous flight stream forward along Z.
      // Using safeDelta here is critical: a raw delta of 60+ seconds after a background
      // tab would move every particle ~130 units in one frame, causing ALL of them to
      // cross the z > 7.5 recycling threshold simultaneously — the visible "re-spawn" flash.
      const posAttr = forePointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;
      const streamSpeed = safeDelta * 2.2;

      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i + 2] += streamSpeed;
        if (posArray[i + 2] > 7.5) {
          posArray[i + 2] = -18.5;
          posArray[i] = (Math.random() - 0.5) * 26;
          posArray[i + 1] = (Math.random() - 0.5) * 16;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* ── LAYER 1: Deep Cosmos Starfield ── */}
      <points ref={deepPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[deepPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[deepColors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[deepSizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.10}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          map={starTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ── LAYER 2: Mid-Field Constellations ── */}
      <points ref={midPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[midPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[midColors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[midSizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          map={starTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ── LAYER 3: Foreground Stardust & Velocity Spores ── */}
      <points ref={forePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[forePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[foreColors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[foreSizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          vertexColors
          transparent
          opacity={0.65}
          sizeAttenuation
          map={starTexture || undefined}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
