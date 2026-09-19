'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import {
  STATIONS,
  StationData,
  createRailCurve,
  getRailPoint,
  SHIP_RAIL_RADIUS,
  VISUAL_RAIL_HEIGHT,
  BLACK_HOLE_CENTER,
} from './railConfig';

function StationMarker({ station }: { station: StationData }) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const setSection = useSceneStore((state) => state.setSection);
  const isActive = activeSection === station.id;
  const [hovered, setHovered] = useState(false);

  const crystalRef = useRef<THREE.Mesh>(null);
  const pingRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const pos = useMemo(
    () => getRailPoint(station.t, SHIP_RAIL_RADIUS, VISUAL_RAIL_HEIGHT),
    [station.t]
  );

  // Direction vector towards black hole center to orient platform
  const lookDir = useMemo(() => {
    return new THREE.Vector3().subVectors(BLACK_HOLE_CENTER, pos).normalize();
  }, [pos]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (crystalRef.current) {
      // Rotation and gentle levitation of beacon crystal
      crystalRef.current.rotation.y += delta * (isActive ? 1.8 : 0.8);
      crystalRef.current.position.y =
        0.35 + Math.sin(time * 2 + station.t * 8) * 0.05;
    }

    if (pingRef.current && (isActive || hovered)) {
      // Expanding radar beacon ping
      const ping = (time * 1.5 + station.t) % 1;
      pingRef.current.scale.set(1 + ping * 1.6, 1, 1 + ping * 1.6);
      const mat = pingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1 - ping) * 0.7;
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    setSection(station.id);
  };

  return (
    <group position={pos}>
      {/* 1. Station Docking Platform Base */}
      <mesh
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
        <cylinderGeometry args={[0.52, 0.62, 0.12, 24]} />
        <meshStandardMaterial
          color="#0b101c"
          metalness={0.9}
          roughness={0.2}
          emissive={isActive ? station.color : '#070b14'}
          emissiveIntensity={isActive ? 0.6 : 0.1}
        />
      </mesh>

      {/* 2. Concentric Neon Rim */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.38, 0.48, 32]} />
        <meshBasicMaterial
          color={isActive ? '#38bdf8' : station.color}
          transparent
          opacity={isActive ? 0.95 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Pulsing Radar Ping Ring */}
      <mesh
        ref={pingRef}
        position={[0, 0.07, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <ringGeometry args={[0.48, 0.54, 32]} />
        <meshBasicMaterial
          color={station.beaconColor}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Central Energy Beacon Crystal */}
      <mesh ref={crystalRef} position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={station.beaconColor}
          emissive={station.beaconColor}
          emissiveIntensity={isActive || hovered ? 3.0 : 1.4}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* 5. Vertical Holo Beacon Pillar Light Beam */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.02, 0.1, 1.6, 16]} />
        <meshBasicMaterial
          color={station.beaconColor}
          transparent
          opacity={isActive ? 0.35 : hovered ? 0.25 : 0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 6. Active Point Light illumination */}
      {isActive && (
        <pointLight
          ref={lightRef}
          position={[0, 0.5, 0]}
          color={station.beaconColor}
          intensity={1.8}
          distance={3.5}
        />
      )}

      {/* 7. Comms Relay Array on Contact Station (Station 8) facing inward */}
      {station.id === 'contact' && (
        <group position={[lookDir.x * 0.35, 0.3, lookDir.z * 0.35]}>
          <mesh rotation={[0.4, Math.atan2(lookDir.x, lookDir.z), 0]}>
            <cylinderGeometry args={[0.22, 0.04, 0.15, 16]} />
            <meshStandardMaterial
              color="#0d1424"
              emissive="#14b8a6"
              emissiveIntensity={0.6}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshBasicMaterial color="#2dd4bf" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function RailSystem() {
  // Main glowing rail track curve
  const primaryCurve = useMemo(
    () => createRailCurve(SHIP_RAIL_RADIUS, VISUAL_RAIL_HEIGHT, 96),
    []
  );

  // Secondary inner guide track
  const secondaryCurve = useMemo(
    () => createRailCurve(SHIP_RAIL_RADIUS - 0.25, VISUAL_RAIL_HEIGHT - 0.05, 96),
    []
  );

  // Generate sleeper cross-ties between primary and secondary rails
  const sleepers = useMemo(() => {
    const list: { pos: THREE.Vector3; rotY: number }[] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const p1 = getRailPoint(t, SHIP_RAIL_RADIUS, VISUAL_RAIL_HEIGHT - 0.02);
      const p2 = getRailPoint(t, SHIP_RAIL_RADIUS - 0.25, VISUAL_RAIL_HEIGHT - 0.05);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const theta = t * Math.PI * 2;
      list.push({ pos: mid, rotY: theta });
    }
    return list;
  }, []);

  return (
    <group>
      {/* ── 1. PRIMARY GLOWING MAG-RAIL TUBE ── */}
      <mesh>
        <tubeGeometry args={[primaryCurve, 192, 0.034, 10, true]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00b4d8"
          emissiveIntensity={2.0}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* ── 2. SECONDARY INNER GUIDE TRACK ── */}
      <mesh>
        <tubeGeometry args={[secondaryCurve, 192, 0.016, 8, true]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={1.4}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* ── 3. RAIL SLEEPER STRUTS / CROSS-TIES ── */}
      {sleepers.map((s, idx) => (
        <mesh
          key={idx}
          position={s.pos}
          rotation={[0, s.rotY, 0]}
        >
          <boxGeometry args={[0.04, 0.02, 0.28]} />
          <meshStandardMaterial
            color="#080c16"
            emissive="#00f0ff"
            emissiveIntensity={0.25}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* ── 4. THE 8 STATION PLATFORMS ── */}
      {STATIONS.map((station) => (
        <StationMarker key={station.id} station={station} />
      ))}
    </group>
  );
}
