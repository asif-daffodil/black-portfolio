'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { portfolioProjects, ProjectItem } from '@/data/portfolio';
import { soundFX } from '@/lib/sound';

function createMarkerTexture(beaconCode: string, title: string) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 70;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = 'rgba(6, 10, 20, 0.9)';
  ctx.fillRect(0, 0, 256, 70);

  // Border glow
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 66);

  // Beacon code subtext
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`[ ${beaconCode} ]`, 128, 22);

  // Project title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  const displayTitle = title.length > 20 ? title.substring(0, 18) + '...' : title;
  ctx.fillText(displayTitle, 128, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function WaypointBeacon({
  project,
  position,
  isVisible,
}: {
  project: ProjectItem;
  position: [number, number, number];
  isVisible: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const plaqueRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedProject = useSceneStore((state) => state.setSelectedProject);
  const selectedProjectId = useSceneStore((state) => state.selectedProjectId);
  const isSelected = selectedProjectId === project.id;

  const labelTexture = useMemo(
    () => createMarkerTexture(project.beaconCode, project.title),
    [project.beaconCode, project.title]
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Scale in/out smoothly based on visibility
      const targetScale = isVisible ? (hovered || isSelected ? 1.3 : 1.0) : 0.001;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 6
      );

      // Gentle continuous rotation of core beacon
      groupRef.current.rotation.y += delta * 0.7;
    }

    if (ringRef.current && isVisible) {
      // Pulsing radar ping ring
      const time = state.clock.getElapsedTime();
      const ping = (time * 1.5) % 1;
      ringRef.current.scale.set(1 + ping * 1.8, 1 + ping * 1.8, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1 - ping) * 0.6;
      }
    }

    if (plaqueRef.current) {
      // Always face active camera regardless of position on circular rail
      plaqueRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    setSelectedProject(project.id);

    // Also smoothly scroll project into view if present
    const cardEl = document.getElementById(`project-${project.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={0.001}
      onClick={handleClick}
      onPointerOver={(e) => {
        if (!isVisible) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Central Core Octahedron */}
      <mesh>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial
          color={isSelected ? '#f59e0b' : '#22d3ee'}
          emissive={isSelected ? '#d97706' : '#0891b2'}
          emissiveIntensity={hovered || isSelected ? 3.0 : 1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Expanding beacon radar ring */}
      <mesh ref={ringRef} rotation={[-Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.16, 0.20, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#f59e0b' : '#22d3ee'}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Billboard Title Plaque on Hover or when Selected */}
      {(hovered || isSelected) && labelTexture && (
        <mesh ref={plaqueRef} position={[0, 0.38, 0]}>
          <planeGeometry args={[0.85, 0.24]} />
          <meshBasicMaterial map={labelTexture} transparent depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export default function ProjectWaypoints() {
  const activeSection = useSceneStore((state) => state.activeSection);
  const isVisible = activeSection === 'portfolio';

  return (
    <group>
      {portfolioProjects.map((project) => (
        <WaypointBeacon
          key={project.id}
          project={project}
          position={project.sectorCoords}
          isVisible={isVisible}
        />
      ))}
    </group>
  );
}
