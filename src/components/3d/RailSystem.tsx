'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
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
  FOCUSED_NODE_SCALE,
  NODE_TRANSITION_DURATION,
  easeInOutCubic,
  STATIONS,
  StationData,
} from './railConfig';

/**
 * Creates high-resolution canvas texture for each docked node's billboarded HUD badge
 */
function createNodeBadgeTexture(station: StationData, isHovered: boolean, isActive: boolean) {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background chassis
  ctx.fillStyle = isHovered || isActive ? 'rgba(7, 13, 26, 0.95)' : 'rgba(5, 9, 18, 0.88)';
  ctx.beginPath();
  ctx.roundRect(6, 6, 372, 132, 12);
  ctx.fill();

  // Outer glowing border
  ctx.strokeStyle = isHovered || isActive ? station.beaconColor : 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = isHovered || isActive ? 4 : 2;
  ctx.stroke();

  // Corner sci-fi brackets
  const bracketColor = isHovered || isActive ? station.beaconColor : station.color;
  ctx.strokeStyle = bracketColor;
  ctx.lineWidth = 4;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(6, 30);
  ctx.lineTo(6, 6);
  ctx.lineTo(30, 6);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(354, 6);
  ctx.lineTo(378, 6);
  ctx.lineTo(378, 30);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(6, 114);
  ctx.lineTo(6, 138);
  ctx.lineTo(30, 138);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(354, 138);
  ctx.lineTo(378, 138);
  ctx.lineTo(378, 114);
  ctx.stroke();

  // Telemetry Code (e.g. [ NAV-01 ])
  ctx.font = 'bold 22px monospace, monospace';
  ctx.fillStyle = bracketColor;
  ctx.textAlign = 'left';
  ctx.fillText(`[ ${station.code} ]`, 24, 40);

  // Subtitle / domain (e.g. COMMAND DECK)
  ctx.font = 'bold 16px monospace, sans-serif';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.textAlign = 'right';
  ctx.fillText(station.sublabel, 360, 40);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 52);
  ctx.lineTo(360, 52);
  ctx.stroke();

  // Station Title (e.g. ORBIT, ORIGIN, ARSENAL)
  ctx.font = 'bold 36px "Segoe UI", Roboto, system-ui, sans-serif';
  ctx.fillStyle = isHovered || isActive ? '#ffffff' : 'rgba(241, 245, 249, 0.95)';
  ctx.textAlign = 'left';
  ctx.fillText(station.name, 24, 98);

  // Status Indicator Dot
  ctx.fillStyle = station.beaconColor;
  ctx.beginPath();
  ctx.arc(352, 90, 7, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Static Docking Berth Cradle permanently attached to the rotating ring conduit.
 * When a station node undocks toward the focused position, this cradle remains in its
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
 * Orbital Station Node that can undock, fly forward to the focused position in front
 * of the black hole/ring, hold steady facing the camera while the ring continues rotating,
 * and interpolate back into its LIVE moving slot angle upon deactivation.
 */
function OrbitalStationNode({
  station,
  focusLocal,
  getRingAngle,
}: {
  station: StationData;
  focusLocal: THREE.Vector3;
  getRingAngle: () => number;
}) {
  const activeSection = useSceneStore((state) => state.activeSection);
  const toggleSection = useSceneStore((state) => state.toggleSection);
  const isActive = activeSection === station.id;
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const pingRef = useRef<THREE.Mesh>(null);
  const badgeRef = useRef<THREE.Mesh>(null);

  // Animation state tracking weight w in [0, 1]
  const animRef = useRef({
    currentW: 0.0,
    startW: 0.0,
    targetW: 0.0,
    startTime: 0,
  });

  // Watch activeSection changes to initiate smooth ease-in-out transition
  useEffect(() => {
    const anim = animRef.current;
    const target = activeSection === station.id ? 1.0 : 0.0;
    if (anim.targetW !== target) {
      anim.startW = anim.currentW;
      anim.targetW = target;
      anim.startTime = performance.now();
    }
  }, [activeSection, station.id]);

  // Pre-generate badge textures for default and active/hovered states
  const badgeTextureDefault = useMemo(
    () => createNodeBadgeTexture(station, false, false),
    [station]
  );
  const badgeTextureActive = useMemo(
    () => createNodeBadgeTexture(station, true, true),
    [station]
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const anim = animRef.current;

    // 1. Advance ease-in-out transition weight w
    if (anim.startW !== anim.targetW) {
      const elapsed = (performance.now() - anim.startTime) / 1000;
      const u = THREE.MathUtils.clamp(elapsed / NODE_TRANSITION_DURATION, 0, 1);
      const eased = easeInOutCubic(u);
      anim.currentW = THREE.MathUtils.lerp(anim.startW, anim.targetW, eased);
      if (u >= 1) {
        anim.startW = anim.targetW;
      }
    }

    const w = anim.currentW;
    const ringAngle = getRingAngle();

    // 2. Compute live moving slot position on the rotating ring
    const currentSlotAngle = station.angle + ringAngle;
    const slotX = ORBITAL_RING_RADIUS * Math.cos(currentSlotAngle);
    const slotZ = ORBITAL_RING_RADIUS * Math.sin(currentSlotAngle);

    // 3. Interpolate position between live moving slot and focused staging position
    if (groupRef.current) {
      const idleHover = w > 0.8 ? Math.sin(time * 1.8 + station.index) * 0.04 * w : 0;
      const px = THREE.MathUtils.lerp(slotX, focusLocal.x, w);
      const py = THREE.MathUtils.lerp(0.06, focusLocal.y, w) + idleHover;
      const pz = THREE.MathUtils.lerp(slotZ, focusLocal.z, w);
      groupRef.current.position.set(px, py, pz);

      // 4. Orientation: radial on ring (w=0) to facing camera (w=1)
      const radialYaw = Math.atan2(slotX, slotZ);
      groupRef.current.rotation.set(
        THREE.MathUtils.lerp(0, -RING_TILT_X * 0.7, w),
        THREE.MathUtils.lerp(radialYaw, 0, w),
        THREE.MathUtils.lerp(0, -RING_TILT_Z * 0.7, w)
      );

      // 5. Scale boost: 1.0 (docked) / 1.15 (hovered) -> 1.65 (focused)
      const baseScale = hovered ? 1.15 : 1.0;
      const targetScale = THREE.MathUtils.lerp(baseScale, FOCUSED_NODE_SCALE, w);
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    // 6. Gentle levitation and spin of core energy octahedron
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * (w > 0.5 || hovered ? 2.6 : 1.0);
      coreRef.current.rotation.x = Math.sin(time * 1.8 + station.index) * 0.2;
      coreRef.current.position.y =
        0.28 + Math.sin(time * 2.4 + station.index * 0.8) * 0.04;
    }

    // 7. Expanding radar ping ring
    if (pingRef.current) {
      const pingCycle = (time * (w > 0.5 ? 1.6 : 1.2) + station.index * 0.125) % 1;
      const pingScale = 1.0 + pingCycle * 1.7;
      pingRef.current.scale.set(pingScale, pingScale, 1);
      const pingMat = pingRef.current.material as THREE.MeshBasicMaterial;
      if (pingMat) {
        pingMat.opacity = (1 - pingCycle) * (w > 0.5 || hovered ? 0.85 : 0.35);
      }
    }

    // 8. Billboard HUD badge always faces camera for pristine readability
    if (badgeRef.current) {
      badgeRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    toggleSection(station.id);
  };

  const isFocusedOrHovered = hovered || isActive || animRef.current.currentW > 0.05;
  const currentTexture = isFocusedOrHovered ? badgeTextureActive : badgeTextureDefault;

  return (
    <group ref={groupRef}>
      {/* ── 1. DOCKING PLATFORM BASE ── */}
      <mesh
        position={[0, 0.06, 0]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          soundFX.playHoverTick();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.42, 0.48, 0.12, 24]} />
        <meshStandardMaterial
          color="#080d1a"
          metalness={0.92}
          roughness={0.18}
          emissive={station.color}
          emissiveIntensity={isFocusedOrHovered ? 0.8 : 0.25}
        />
      </mesh>

      {/* ── 2. CONCENTRIC NEON ACCENT RING ── */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.30, 0.38, 32]} />
        <meshBasicMaterial
          color={station.beaconColor}
          transparent
          opacity={isFocusedOrHovered ? 0.95 : 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 3. PULSING RADAR PING RING ── */}
      <mesh
        ref={pingRef}
        position={[0, 0.135, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <ringGeometry args={[0.38, 0.44, 32]} />
        <meshBasicMaterial
          color={station.beaconColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 4. FLOATING CORE ENERGY OCTAHEDRON ── */}
      <mesh ref={coreRef} position={[0, 0.28, 0]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial
          color={station.beaconColor}
          emissive={station.beaconColor}
          emissiveIntensity={isFocusedOrHovered ? 3.5 : 1.8}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* ── 5. COMPACT BILLBOARDED SCI-FI HUD BADGE ── */}
      {currentTexture && (
        <mesh
          ref={badgeRef}
          position={[0, 0.72, 0]}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            soundFX.playHoverTick();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <planeGeometry args={[1.28, 0.48]} />
          <meshBasicMaterial
            map={currentTexture}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ── 6. POINT LIGHT ACCENT ON HOVER/ACTIVE ── */}
      {isFocusedOrHovered && (
        <pointLight
          position={[0, 0.4, 0]}
          color={station.beaconColor}
          intensity={1.8}
          distance={3.2}
        />
      )}
    </group>
  );
}

/**
 * Main Orbital Ring System:
 * - Single circular orbit path centered on black hole
 * - Tilted toward camera on X/Z axes
 * - 8 evenly distributed docked station nodes
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
      // Don't intercept interactions on form inputs, interactive links, or buttons
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a'))
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

        {/* ── 2. THE 8 STATION NODES (Undocking, Focused, and Concurrent Handoff) ── */}
        {STATIONS.map((station) => (
          <OrbitalStationNode
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
