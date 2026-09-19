'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import Cockpit from './Cockpit';
import {
  SECTION_TO_T,
  getRailPoint,
  getShortestRailDelta,
  BLACK_HOLE_CENTER,
  SHIP_RAIL_RADIUS,
  SHIP_HEIGHT,
} from './railConfig';

export default function CameraController() {
  const { camera } = useThree();
  const activeSection = useSceneStore((state) => state.activeSection);
  const setRailProgress = useSceneStore((state) => state.setRailProgress);

  const rigRef = useRef<THREE.Group>(null);

  // Flight rail travel state
  const stateRef = useRef({
    t: 0.0,
    shake: 0,
  });

  const prevSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    const targetT = SECTION_TO_T[activeSection] ?? 0.0;
    const isFirstRun = prevSectionRef.current === activeSection;
    prevSectionRef.current = activeSection;

    if (isFirstRun) {
      // First mount: park at bridge (t=0)
      stateRef.current.t = targetT;
      setRailProgress(targetT);

      const initPos = getRailPoint(targetT, SHIP_RAIL_RADIUS, SHIP_HEIGHT);
      camera.position.copy(initPos);
      camera.lookAt(BLACK_HOLE_CENTER);

      if (rigRef.current) {
        rigRef.current.position.copy(initPos);
        rigRef.current.lookAt(BLACK_HOLE_CENTER);
      }
      return;
    }

    // Play whoosh thruster sound
    soundFX.playWhoosh();

    // Trigger transient screen shake impulse on thruster fire
    stateRef.current.shake = 1;
    gsap.to(stateRef.current, {
      shake: 0,
      duration: 0.6,
      ease: 'power2.out',
    });

    // Calculate shorter arc delta around the closed circular rail
    const currentT = stateRef.current.t;
    const delta = getShortestRailDelta(currentT, targetT);
    const destT = currentT + delta;

    // Read exact matching travel duration synchronized with content panel container
    const travelDuration = useSceneStore.getState().travelDuration || 1.3;

    // Smooth rail travel tween
    gsap.killTweensOf(stateRef.current, 't');
    gsap.to(stateRef.current, {
      t: destT,
      duration: travelDuration,
      ease: 'power3.inOut',
      onUpdate: () => {
        const normT = ((stateRef.current.t % 1) + 1) % 1;
        setRailProgress(normT);
      },
      onComplete: () => {
        // Normalize after arrival
        stateRef.current.t = targetT;
        setRailProgress(targetT);

        // Arrival braking thud impulse
        stateRef.current.shake = 0.35;
        gsap.to(stateRef.current, {
          shake: 0,
          duration: 0.45,
          ease: 'power2.out',
        });
      },
    });
  }, [activeSection, camera, setRailProgress]);

  useFrame((state) => {
    const s = stateRef.current;

    // Current position on the rail
    const pos = getRailPoint(s.t, SHIP_RAIL_RADIUS, SHIP_HEIGHT);

    // Compute local orientation vectors towards Black Hole center
    const forward = new THREE.Vector3()
      .subVectors(BLACK_HOLE_CENTER, pos)
      .normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, up).normalize();

    // Subtle pilot pointer parallax in ship's local coordinates
    const px = state.pointer.x * 0.12;
    const py = state.pointer.y * 0.08;

    // Screen shake impulse
    let shakeX = 0;
    let shakeY = 0;
    if (s.shake > 0.001) {
      shakeX = (Math.random() - 0.5) * 0.08 * s.shake;
      shakeY = (Math.random() - 0.5) * 0.08 * s.shake;
    }

    // Offset camera in ship's local frame
    const camPos = pos
      .clone()
      .addScaledVector(right, px + shakeX)
      .addScaledVector(up, py + shakeY);

    camera.position.copy(camPos);
    camera.lookAt(BLACK_HOLE_CENTER);

    // Synchronize cockpit rig to rail position and black hole orientation
    if (rigRef.current) {
      rigRef.current.position.copy(pos);
      rigRef.current.lookAt(BLACK_HOLE_CENTER);
    }
  });

  return (
    <group ref={rigRef}>
      {/* Cockpit mounted inside the ship rig at the canonical relative offset */}
      <group position={[0, 0.55, -3.0]}>
        <Cockpit />
      </group>
    </group>
  );
}
