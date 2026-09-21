'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';

interface ButtonConfig {
  id: SectionId;
  label: string;
  code: string;
  color: string;
}

const BUTTONS: ButtonConfig[] = [
  { id: 'bridge', label: 'HOME', code: 'NAV-00', color: '#f59e0b' },
  { id: 'about', label: 'ABOUT', code: 'BIO-01', color: '#06b6d4' },
  { id: 'skills', label: 'SKILLS', code: 'SYS-02', color: '#8b5cf6' },
  { id: 'experience', label: 'EXP', code: 'LOG-03', color: '#10b981' },
  { id: 'education', label: 'EDU', code: 'ACD-04', color: '#fbbf24' },
  { id: 'ai', label: 'AI WORK', code: 'AI-05', color: '#ec4899' },
  { id: 'portfolio', label: 'CHARTS', code: 'PRJ-06', color: '#6366f1' },
  { id: 'contact', label: 'COMMS', code: 'COM-07', color: '#14b8a6' },
];

function createPlaqueTexture(label: string, code: string, color: string, active: boolean) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background plaque
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, 256, 128);

  // Border
  ctx.strokeStyle = active ? color : 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 248, 120);

  // Corner tech markers
  ctx.fillStyle = color;
  ctx.fillRect(4, 4, 16, 6);
  ctx.fillRect(236, 4, 16, 6);
  ctx.fillRect(4, 118, 16, 6);
  ctx.fillRect(236, 118, 16, 6);

  // Label text
  ctx.fillStyle = active ? '#ffffff' : '#cbd5e1';
  ctx.font = 'bold 36px "Segoe UI", Roboto, monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 128, 52);

  // Code sub-text
  ctx.fillStyle = active ? color : '#64748b';
  ctx.font = '600 20px monospace, sans-serif';
  ctx.fillText(code, 128, 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function ConsoleButton({
  config,
  index,
  total,
}: {
  config: ButtonConfig;
  index: number;
  total: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);

  const isActive = activeSection === config.id;

  // Plaque textures for active / inactive states
  const activeTexture = useMemo(
    () => createPlaqueTexture(config.label, config.code, config.color, true),
    [config.label, config.code, config.color]
  );
  const inactiveTexture = useMemo(
    () => createPlaqueTexture(config.label, config.code, config.color, false),
    [config.label, config.code, config.color]
  );

  // Ergonomic arch positioning along the console
  const spacing = 0.32;
  const xOffset = (index - (total - 1) / 2) * spacing;
  const archCurve = Math.cos((index - (total - 1) / 2) * 0.28) * 0.04;
  const basePosY = -0.73 + archCurve;
  const basePosZ = 1.08;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Hover scaling
      const targetScale = hovered ? 1.08 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 12
      );

      // Press depression physics
      const targetY = pressed ? basePosY - 0.025 : basePosY;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 18
      );
    }

    if (materialRef.current) {
      // 2. Idle State Standby Glow Pulse (2.6s cycle, 0.7 to 1.0)
      const breath = Math.sin(time * 2.4 + index * 0.4) * 0.15 + 0.85;
      const baseEmissive = new THREE.Color(config.color);

      if (isActive) {
        materialRef.current.emissive.copy(baseEmissive);
        materialRef.current.emissiveIntensity = 2.4 * breath;
      } else if (hovered) {
        materialRef.current.emissive.copy(baseEmissive);
        materialRef.current.emissiveIntensity = 1.8;
      } else {
        materialRef.current.emissive.copy(baseEmissive);
        materialRef.current.emissiveIntensity = 0.45 * breath;
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();

    // 4. Trigger tactile press depression
    setPressed(true);
    setTimeout(() => setPressed(false), 160);

    // Audio feedback
    soundFX.playButtonClick();

    // Update global store
    setSection(config.id);
  };

  return (
    <group
      ref={meshRef}
      position={[xOffset, basePosY, basePosZ]}
      rotation={[-Math.PI * 0.32, 0, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Beveled mounting base plate */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[0.30, 0.16, 0.025]} />
        <meshStandardMaterial
          color="#0b0e17"
          metalness={0.92}
          roughness={0.32}
        />
      </mesh>

      {/* 2. Interactive physical button cap with emissive border */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.28, 0.14, 0.022]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#101726"
          emissive={config.color}
          emissiveIntensity={0.6}
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>

      {/* 3. Text Label Plaque using clean 2D Canvas texture */}
      {(isActive ? activeTexture : inactiveTexture) && (
        <mesh position={[0, 0, 0.024]}>
          <planeGeometry args={[0.26, 0.13]} />
          <meshBasicMaterial
            map={(isActive || hovered ? activeTexture : inactiveTexture) || undefined}
            transparent
          />
        </mesh>
      )}
    </group>
  );
}

export default function ConsoleButtons() {
  return (
    <group position={[0, 0, 0]}>
      {BUTTONS.map((btn, idx) => (
        <ConsoleButton
          key={btn.id}
          config={btn}
          index={idx}
          total={BUTTONS.length}
        />
      ))}
    </group>
  );
}
