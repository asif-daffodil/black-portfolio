'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import PageCard from './PageCard';
import {
  BLACK_HOLE_CENTER,
  ORBITAL_RING_RADIUS,
  ORBITAL_RING_INNER_RADIUS,
  ORBITAL_RING_TUBE_RADIUS,
  RING_TILT_X,
  RING_TILT_Y,
  RING_TILT_Z,
  RING_AUTO_ROTATION_SPEED,
  FOCUSED_NODE_WORLD_POS,
  STATIONS,
  StationData,
} from './railConfig';

/**
 * Creates high-resolution canvas texture for each docked node's billboarded HUD badge


/**
 * Static Docking Berth Cradle permanently attached to the rotating ring conduit.
 * When a page card undocks toward the focused position, this cradle remains in its
 * rotating ring slot with glowing standby guide markers indicating an open bay.
 */
function DockingBerthCradle({
  station,
  isUndocked,
}: {
  station: StationData;
  isUndocked: boolean;
}) {
  const pos = useMemo(() => {
    return new THREE.Vector3(
      ORBITAL_RING_RADIUS * Math.cos(station.angle),
      0,
      ORBITAL_RING_RADIUS * Math.sin(station.angle)
    );
  }, [station.angle]);

  const yaw = useMemo(() => {
    const radial = pos.clone().normalize();
    return Math.atan2(radial.x, radial.z);
  }, [pos]);

  return (
    <group position={pos} rotation={[0, yaw, 0]}>
      {/* Mechanical Mag-Rail Docking Caliper Clamp */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.24, 0.08, 0.44]} />
        <meshStandardMaterial
          color="#0b101d"
          metalness={0.92}
          roughness={0.22}
          emissive="#1e293b"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Twin Mag-Lock Guide Struts */}
      <mesh position={[-0.13, 0.035, 0]}>
        <boxGeometry args={[0.024, 0.05, 0.34]} />
        <meshStandardMaterial
          color="#080c18"
          emissive={station.color}
          emissiveIntensity={isUndocked ? 0.85 : 0.25}
        />
      </mesh>
      <mesh position={[0.13, 0.035, 0]}>
        <boxGeometry args={[0.024, 0.05, 0.34]} />
        <meshStandardMaterial
          color="#080c18"
          emissive={station.color}
          emissiveIntensity={isUndocked ? 0.85 : 0.25}
        />
      </mesh>

      {/* Standby Beacon Ring on the ring conduit (pulses when berth is empty) */}
      {isUndocked && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[0.18, 0.24, 24]} />
          <meshBasicMaterial
            color={station.beaconColor}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Main Orbital Ring System:
 * - Single circular orbit path centered on black hole
 * - Tilted toward camera on X/Z axes
 * - 8 evenly distributed docked station nodes (unified PageCards)
 * - Continuous slow auto-rotation (1 rev per ~105s)
 * - Click-and-drag manual rotation with inertia / momentum damping
 */
export default function RailSystem() {
  const rotatingGroupRef = useRef<THREE.Group>(null);
  const setRingAngle = useSceneStore((state) => state.setRingAngle);
  const setIsDraggingRing = useSceneStore((state) => state.setIsDraggingRing);

  // Motion and drag physics state
  const physicsRef = useRef({
    angle: 0.0,
    velocity: RING_AUTO_ROTATION_SPEED,
    isDragging: false,
    lastX: 0,
    lastTime: 0,
  });

  // Attach global pointer drag listeners for real-time scene drag rotation
  useEffect(() => {
    const p = physicsRef.current;

    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag ring if interacting with buttons, links, inputs, or card content
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.page-card-interactive') ||
          target.closest('.page-card-3d-wrapper'))
      ) {
        return;
      }

      p.isDragging = true;
      p.lastX = e.clientX;
      p.lastTime = performance.now();
      p.velocity = 0;
      setIsDraggingRing(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!p.isDragging) return;

      const now = performance.now();
      const dt = Math.max((now - p.lastTime) / 1000, 0.008);
      const dx = e.clientX - p.lastX;

      // Sensitivity: ~0.0038 rad per pixel (feels natural and responsive on both mouse and touch)
      const sensitivity = 0.0038;
      const dAngle = dx * sensitivity;

      p.angle += dAngle;

      // Instantaneous drag velocity with smoothing for realistic release inertia
      const instVelocity = dAngle / dt;
      p.velocity = THREE.MathUtils.lerp(p.velocity, instVelocity, 0.4);

      p.lastX = e.clientX;
      p.lastTime = now;
    };

    const handlePointerUp = () => {
      if (!p.isDragging) return;

      p.isDragging = false;
      setIsDraggingRing(false);

      // Clamp release velocity to prevent disorientation
      p.velocity = THREE.MathUtils.clamp(p.velocity, -2.4, 2.4);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [setIsDraggingRing]);

  // Frame loop: updates rotation angle and damps release momentum smoothly back to base speed
  useFrame((_, delta) => {
    const p = physicsRef.current;

    if (!p.isDragging) {
      // Smooth momentum / inertia damping:
      // Returns from fling velocity to base auto-rotation speed over ~1.5s
      p.velocity = THREE.MathUtils.damp(
        p.velocity,
        RING_AUTO_ROTATION_SPEED,
        1.8,
        delta
      );

      // Continuous advance
      p.angle += p.velocity * delta;
    }

    if (rotatingGroupRef.current) {
      rotatingGroupRef.current.rotation.y = p.angle;
    }

    setRingAngle(p.angle);
  });

  // Circumferential sleeper struts connecting inner and outer rail
  const sleeperStruts = useMemo(() => {
    const list: { pos: THREE.Vector3; rotY: number }[] = [];
    const count = 48;
    const rMid = (ORBITAL_RING_RADIUS + ORBITAL_RING_INNER_RADIUS) * 0.5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const pos = new THREE.Vector3(
        rMid * Math.cos(angle),
        0,
        rMid * Math.sin(angle)
      );
      list.push({ pos, rotY: -angle });
    }
    return list;
  }, []);

  const activeSection = useSceneStore((state) => state.activeSection);
  const departingSection = useSceneStore((state) => state.departingSection);

  // Compute local focused coordinate inside the tilted orbital group
  const focusLocal = useMemo(() => {
    const euler = new THREE.Euler(RING_TILT_X, RING_TILT_Y, RING_TILT_Z, 'XYZ');
    const quat = new THREE.Quaternion().setFromEuler(euler).invert();
    return FOCUSED_NODE_WORLD_POS.clone()
      .sub(BLACK_HOLE_CENTER)
      .applyQuaternion(quat);
  }, []);

  return (
    /* Center the orbital system on the black hole singularity */
    <group position={BLACK_HOLE_CENTER}>
      {/* Tilt the orbital plane so it reads well against the accretion disk */}
      <group rotation={[RING_TILT_X, RING_TILT_Y, RING_TILT_Z]}>
        {/* ── 1. ROTATING RIGID GROUP (Rail Conduit & Docking Berths) ── */}
        <group ref={rotatingGroupRef}>
          {/* Primary glowing mag-rail conduit */}
          <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
            <torusGeometry
              args={[
                ORBITAL_RING_RADIUS,
                ORBITAL_RING_TUBE_RADIUS,
                24,
                160,
              ]}
            />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00b4d8"
              emissiveIntensity={2.2}
              roughness={0.16}
              metalness={0.9}
            />
          </mesh>

          {/* Secondary inner guide rail */}
          <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
            <torusGeometry
              args={[
                ORBITAL_RING_INNER_RADIUS,
                0.016,
                16,
                128,
              ]}
            />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#1d4ed8"
              emissiveIntensity={1.5}
              roughness={0.25}
              metalness={0.85}
            />
          </mesh>

          {/* Circumferential sleeper struts / cross-ties */}
          {sleeperStruts.map((s, idx) => (
            <mesh
              key={idx}
              position={s.pos}
              rotation={[0, s.rotY, 0]}
            >
              <boxGeometry args={[0.035, 0.018, 0.38]} />
              <meshStandardMaterial
                color="#090d18"
                emissive="#00f0ff"
                emissiveIntensity={0.22}
                metalness={0.92}
                roughness={0.28}
              />
            </mesh>
          ))}

          {/* 8 Mechanical Docking Berth Calipers (permanently fixed to the rotating ring) */}
          {STATIONS.map((station) => (
            <DockingBerthCradle
              key={station.id}
              station={station}
              isUndocked={activeSection === station.id || departingSection === station.id}
            />
          ))}
        </group>

        {/* ── 2. THE 8 UNIFIED PAGE CARDS (Docked in Orbit, In-Flight, or Focused) ── */}
        {STATIONS.map((station) => (
          <PageCard
            key={station.id}
            station={station}
            focusLocal={focusLocal}
            getRingAngle={() => physicsRef.current.angle}
          />
        ))}
      </group>
    </group>
  );
}
