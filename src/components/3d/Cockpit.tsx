'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ConsoleButtons from './ConsoleButtons';
import { useSceneStore, SectionId } from '@/store/useSceneStore';

const SECTION_COCKPIT_COLORS: Record<SectionId, string> = {
  bridge: '#f59e0b',     // Warm amber-gold (tied to black hole accretion disk)
  about: '#06b6d4',      // Radiant cyan
  skills: '#8b5cf6',     // Violet
  experience: '#10b981',  // Emerald
  education: '#fbbf24',  // Gold
  ai: '#ec4899',         // Pink
  portfolio: '#6366f1',  // Indigo
  contact: '#14b8a6',    // Teal
};

export default function Cockpit() {
  const cockpitRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const activeSection = useSceneStore((state) => state.activeSection);

  useFrame(({ camera }, delta) => {
    // Keep cockpit locked to camera frame
    if (cockpitRef.current) {
      cockpitRef.current.position.copy(camera.position);
      cockpitRef.current.quaternion.copy(camera.quaternion);
    }

    // Faint cockpit ambient light color subtly shifting based on black hole view
    if (pointLightRef.current) {
      const targetHex = SECTION_COCKPIT_COLORS[activeSection] || '#f59e0b';
      pointLightRef.current.color.lerp(new THREE.Color(targetHex), delta * 2.5);
    }
  });

  return (
    <group ref={cockpitRef}>
      {/* ── FAINT COCKPIT INTERIOR AMBIENT LIGHT ── */}
      {/* Subtle interior lighting shifting with black hole view */}
      <pointLight
        ref={pointLightRef}
        position={[0, -0.4, 0.9]}
        intensity={0.45}
        distance={3.5}
        color="#f59e0b"
      />

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

      {/* ── 4. PHYSICAL 3D CONSOLE BUTTONS ── */}
      <ConsoleButtons />
    </group>
  );
}
