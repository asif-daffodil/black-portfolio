'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSceneStore, SectionId } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
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

  // Flight rail travel state
  const stateRef = useRef({
    t: 0.0,
    prevT: 0.0,
    velocity: 0.0,
    pointerX: 0.0,
    pointerY: 0.0,
    targetPointerX: 0.0,
    targetPointerY: 0.0,
  });

  const prevSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    const targetT = SECTION_TO_T[activeSection] ?? 0.0;
    const isFirstRun = prevSectionRef.current === activeSection;
    prevSectionRef.current = activeSection;

    if (isFirstRun) {
      // First mount: park at bridge (t=0)
      stateRef.current.t = targetT;
      stateRef.current.prevT = targetT;
      setRailProgress(targetT);

      const initPos = getRailPoint(targetT, SHIP_RAIL_RADIUS, SHIP_HEIGHT);
      camera.position.copy(initPos);
      camera.lookAt(BLACK_HOLE_CENTER);
      return;
    }

    // Play subtle whoosh sound
    soundFX.playWhoosh();

    // Calculate shorter arc delta around the closed circular rail
    const currentT = stateRef.current.t;
    const delta = getShortestRailDelta(currentT, targetT);
    const destT = currentT + delta;

    const travelDuration = useSceneStore.getState().travelDuration || 1.4;

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
        stateRef.current.t = targetT;
        stateRef.current.prevT = targetT;
        setRailProgress(targetT);
      },
    });
  }, [activeSection, camera, setRailProgress]);

  useFrame((state, delta) => {
    const s = stateRef.current;

    // Smooth pointer lerp for organic inertia
    s.targetPointerX = state.pointer.x;
    s.targetPointerY = state.pointer.y;
    s.pointerX = THREE.MathUtils.damp(s.pointerX, s.targetPointerX, 4, delta);
    s.pointerY = THREE.MathUtils.damp(s.pointerY, s.targetPointerY, 4, delta);

    // Compute angular velocity for dynamic banking
    const dt = s.t - s.prevT;
    s.velocity = THREE.MathUtils.damp(s.velocity, dt / Math.max(delta, 0.001), 6, delta);
    s.prevT = s.t;

    // Current position along circular celestial rail
    const pos = getRailPoint(s.t, SHIP_RAIL_RADIUS, SHIP_HEIGHT);

    // Forward, up, right orientation vectors towards celestial center
    const forward = new THREE.Vector3()
      .subVectors(BLACK_HOLE_CENTER, pos)
      .normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, up).normalize();

    // Idle organic breathing drift (Atmos/Robin Payot feel)
    const time = state.clock.getElapsedTime();
    const idleHoverX = Math.sin(time * 0.4) * 0.05;
    const idleHoverY = Math.cos(time * 0.3) * 0.04;
    const idleHoverZ = Math.sin(time * 0.5) * 0.03;

    // Mouse parallax offset (ethereal 3D perspective shift)
    const px = s.pointerX * 0.45 + idleHoverX;
    const py = s.pointerY * 0.32 + idleHoverY;

    // Camera target position with parallax
    const camPos = pos
      .clone()
      .addScaledVector(right, px)
      .addScaledVector(up, py + idleHoverZ);

    camera.position.copy(camPos);

    // Dynamic bank / roll into the turn
    const bankAngle = THREE.MathUtils.clamp(s.velocity * -0.35, -0.22, 0.22);
    camera.up.set(
      Math.sin(bankAngle) * right.x,
      Math.cos(bankAngle),
      Math.sin(bankAngle) * right.z
    ).normalize();

    // Look slightly towards center with parallax compensation
    const targetLookAt = BLACK_HOLE_CENTER.clone().add(
      new THREE.Vector3(px * 0.3, py * 0.3, 0)
    );
    camera.lookAt(targetLookAt);
  });

  return null;
}
