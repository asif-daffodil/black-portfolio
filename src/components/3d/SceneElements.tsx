'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore, SectionId } from '@/store/useSceneStore';

// Color map for different sections
const SECTION_COLORS: Record<SectionId, string> = {
  bridge: '#3b82f6',     // Blue
  about: '#06b6d4',      // Cyan
  skills: '#8b5cf6',     // Violet
  experience: '#10b981',  // Emerald
  education: '#f59e0b',  // Amber
  ai: '#ec4899',         // Pink
  portfolio: '#6366f1',  // Indigo
  contact: '#14b8a6',    // Teal
};

export function SceneElements() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particles coordinates
  const particleCount = 750;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [particleCount]);

  const targetColor = useMemo(
    () => new THREE.Color(SECTION_COLORS[activeSection] || '#3b82f6'),
    [activeSection]
  );

  useFrame((state, delta) => {
    // Gentle rotation of the ambient 3D geometric mesh
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;

      // Color lerp based on active section
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.lerp(targetColor, delta * 2.5);
      }
    }

    // Gentle rotation of particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
      particlesRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color={SECTION_COLORS[activeSection]} />

      {/* Floating geometric core */}
      <mesh ref={meshRef} position={[0, 0, -3]} scale={1.8}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          wireframe
          color="#3b82f6"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Ambient Particle constellation */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#60a5fa"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
}
