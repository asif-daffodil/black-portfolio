'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

export default function Starfield({ count = 2000 }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'), // Pure white
      new THREE.Color('#93c5fd'), // Pale cyan-blue
      new THREE.Color('#fed7aa'), // Pale warm amber
      new THREE.Color('#c4b5fd'), // Soft lavender
      new THREE.Color('#67e8f9'), // Electric cyan
    ];

    for (let i = 0; i < count; i++) {
      // Distribute in a celestial sphere around the camera/scene
      const radius = 25 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.05 + Math.random() * 0.12;
    }

    return [pos, col, sz];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Extremely subtle celestial background drift
      pointsRef.current.rotation.y += delta * 0.006;
      pointsRef.current.rotation.x += delta * 0.003;

      // Parallax reaction to mouse pointer
      const targetX = state.pointer.x * 0.3;
      const targetY = state.pointer.y * 0.2;
      pointsRef.current.position.x = THREE.MathUtils.lerp(
        pointsRef.current.position.x,
        -targetX,
        0.05
      );
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        -targetY,
        0.05
      );
    }
  });

  return (
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
        size={0.08}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
