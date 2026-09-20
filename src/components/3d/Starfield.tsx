'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

export default function Starfield({ count = 2800 }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Distant stars
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#7dd3fc'), // Cyan sky
      new THREE.Color('#fde047'), // Warm gold
      new THREE.Color('#c084fc'), // Soft violet
      new THREE.Color('#38bdf8'), // Electric cyan
    ];

    for (let i = 0; i < count; i++) {
      const radius = 22 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.06 + Math.random() * 0.14;
    }

    return [pos, col, sz];
  }, [count]);

  // Floating atmospheric dust / stardust particles (Atmos feel)
  const [dustPositions, dustColors] = useMemo(() => {
    const dustCount = 450;
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;

      // Cyan-gold shimmer
      const isGold = Math.random() > 0.7;
      col[i * 3] = isGold ? 0.98 : 0.22;
      col[i * 3 + 1] = isGold ? 0.85 : 0.75;
      col[i * 3 + 2] = isGold ? 0.45 : 0.98;
    }

    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x += delta * 0.002;

      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.3;
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        -targetX,
        0.04
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        -targetY,
        0.04
      );
    }

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
      dustRef.current.rotation.z += delta * 0.006;
    }
  });

  return (
    <group>
      {/* 1. Distant Constellation Starfield */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Floating Atmospheric Stardust Spores (Cinematic Depth) */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[dustColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
