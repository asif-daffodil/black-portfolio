'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ConsoleButtons from './ConsoleButtons';

export default function Cockpit() {
  const cockpitRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cockpitRef.current) {
      // Subtle cockpit inertia for spacecraft simulation
      const targetX = state.pointer.x * 0.05;
      const targetY = state.pointer.y * 0.03;
      cockpitRef.current.position.x = THREE.MathUtils.lerp(
        cockpitRef.current.position.x,
        targetX,
        0.05
      );
      cockpitRef.current.position.y = THREE.MathUtils.lerp(
        cockpitRef.current.position.y,
        targetY,
        0.05
      );
    }
  });

  return (
    <group ref={cockpitRef} position={[0, 0, 0]}>
      {/* ── 1. MAIN LOWER DASHBOARD / CONSOLE DECK ── */}
      {/* Central console bed */}
      <mesh position={[0, -1.05, 0.9]} rotation={[-Math.PI * 0.32, 0, 0]}>
        <boxGeometry args={[4.8, 0.9, 0.3]} />
        <meshStandardMaterial
          color="#0c0f18"
          metalness={0.92}
          roughness={0.25}
        />
      </mesh>

      {/* Emissive cyan trim strip along console rim */}
      <mesh position={[0, -0.68, 1.05]} rotation={[-Math.PI * 0.32, 0, 0]}>
        <boxGeometry args={[4.6, 0.02, 0.02]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Emissive amber warning accent trim */}
      <mesh position={[0, -0.71, 1.07]} rotation={[-Math.PI * 0.32, 0, 0]}>
        <boxGeometry args={[2.4, 0.012, 0.02]} />
        <meshBasicMaterial color="#ff7700" />
      </mesh>

      {/* Left Wing Console Panel */}
      <mesh
        position={[-2.4, -0.9, 0.7]}
        rotation={[-Math.PI * 0.28, Math.PI * 0.22, -Math.PI * 0.08]}
      >
        <boxGeometry args={[1.5, 0.8, 0.25]} />
        <meshStandardMaterial
          color="#090c15"
          metalness={0.88}
          roughness={0.3}
        />
      </mesh>

      {/* Right Wing Console Panel */}
      <mesh
        position={[2.4, -0.9, 0.7]}
        rotation={[-Math.PI * 0.28, -Math.PI * 0.22, Math.PI * 0.08]}
      >
        <boxGeometry args={[1.5, 0.8, 0.25]} />
        <meshStandardMaterial
          color="#090c15"
          metalness={0.88}
          roughness={0.3}
        />
      </mesh>

      {/* ── 2. VIEWPORT STRUTS & CANOPY PILLARS ── */}
      {/* Left A-Pillar */}
      <mesh
        position={[-2.15, 0.3, 0.6]}
        rotation={[0.04, -Math.PI * 0.16, -Math.PI * 0.12]}
      >
        <boxGeometry args={[0.22, 3.2, 0.25]} />
        <meshStandardMaterial
          color="#070910"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      {/* Left pillar emissive neon accent */}
      <mesh
        position={[-2.05, 0.3, 0.66]}
        rotation={[0.04, -Math.PI * 0.16, -Math.PI * 0.12]}
      >
        <boxGeometry args={[0.015, 2.9, 0.015]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Right A-Pillar */}
      <mesh
        position={[2.15, 0.3, 0.6]}
        rotation={[0.04, Math.PI * 0.16, Math.PI * 0.12]}
      >
        <boxGeometry args={[0.22, 3.2, 0.25]} />
        <meshStandardMaterial
          color="#070910"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      {/* Right pillar emissive neon accent */}
      <mesh
        position={[2.05, 0.3, 0.66]}
        rotation={[0.04, Math.PI * 0.16, Math.PI * 0.12]}
      >
        <boxGeometry args={[0.015, 2.9, 0.015]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* ── 3. OVERHEAD CANOPY VISOR ── */}
      <mesh position={[0, 1.45, 0.7]} rotation={[Math.PI * 0.16, 0, 0]}>
        <boxGeometry args={[4.6, 0.35, 0.28]} />
        <meshStandardMaterial
          color="#06080e"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Overhead glowing HUD bar */}
      <mesh position={[0, 1.3, 0.8]} rotation={[Math.PI * 0.16, 0, 0]}>
        <boxGeometry args={[2.8, 0.015, 0.015]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* ── 4. PHYSICAL CONSOLE BUTTONS ── */}
      <ConsoleButtons />
    </group>
  );
}
