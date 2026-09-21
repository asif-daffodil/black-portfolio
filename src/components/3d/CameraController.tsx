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

const BASE_FOV = 52;
const MAX_FOV_BOOST = 6.5; // +6.5 deg FOV at midpoint (subtle warp sensation)

export default function CameraController() {
  const { camera } = useThree();
  const activeSection = useSceneStore((state) => state.activeSection);
  const setRailProgress = useSceneStore((state) => state.setRailProgress);

  // Cinematic flight, idle drift, and parallax state
  const stateRef = useRef({
    t: 0.0,
    prevT: 0.0,
    velocity: 0.0,
    bankAngle: 0.0,
    // Transition progress [0.0 = start, 0.5 = midpoint warp peak, 1.0 = arrival]
    isTransitioning: false,
    transitionProgress: 0.0,
    // Parallax blending weight [1.0 = full mouse influence, 0.0 = disabled during travel]
    parallaxWeight: 1.0,
    // Smooth lerped mouse rotation offsets (in radians)
    pointerYaw: 0.0,
    pointerPitch: 0.0,
    targetPointerYaw: 0.0,
    targetPointerPitch: 0.0,
    // Idle clock accumulator
    idleTime: 0.0,
  });

  const bootStage = useSceneStore((state) => state.bootStage);
  const prevSectionRef = useRef<SectionId>(activeSection);

  useEffect(() => {
    const targetT = SECTION_TO_T[activeSection] ?? 0.0;
    const isFirstRun = prevSectionRef.current === activeSection;
    prevSectionRef.current = activeSection;

    const s = stateRef.current;

    if (isFirstRun) {
      s.t = targetT;
      s.prevT = targetT;
      s.isTransitioning = false;
      s.transitionProgress = 0.0;
      setRailProgress(targetT);

      const targetPos = getRailPoint(targetT, SHIP_RAIL_RADIUS, SHIP_HEIGHT);
      const isAlreadyBooted = useSceneStore.getState().isBooted;

      if (isAlreadyBooted) {
        s.parallaxWeight = 1.0;
        camera.position.copy(targetPos);
        camera.lookAt(BLACK_HOLE_CENTER);
        return;
      }

      // During boot-up: start pulled back (+4.0 units further out), looking at black hole center
      s.parallaxWeight = 0.0;
      const startPos = new THREE.Vector3(targetPos.x, targetPos.y + 0.4, targetPos.z + 4.0);
      camera.position.copy(startPos);
      camera.lookAt(BLACK_HOLE_CENTER);
      return;
    }

    // Cinematic travel duration: 1.8s to 2.5s (2.1s standard)
    const travelDuration = useSceneStore.getState().travelDuration || 2.1;

    // Play subtle whoosh audio effect precisely synced with flight transition duration
    soundFX.playWhoosh(travelDuration);

    // Calculate shortest signed arc delta around the closed circular rail
    const currentT = s.t;
    const delta = getShortestRailDelta(currentT, targetT);
    const destT = currentT + delta;

    // ── 1. Kill any prior tweens on flight state ──
    gsap.killTweensOf(s);

    s.isTransitioning = true;
    s.transitionProgress = 0.0;

    // ── 2. Temporarily disable mouse-parallax during transitions ──
    // Smoothly fade out parallax weight so mouse input doesn't conflict with flight
    gsap.to(s, {
      parallaxWeight: 0.0,
      duration: 0.32,
      ease: 'power2.out',
    });

    // Fade parallax back in as ship decelerates into the station
    gsap.to(s, {
      parallaxWeight: 1.0,
      duration: 0.65,
      delay: travelDuration - 0.45,
      ease: 'power2.inOut',
    });

    // ── 3. Cubic Ease-In-Out (power3.inOut) Rail Travel ──
    gsap.to(s, {
      t: destT,
      transitionProgress: 1.0,
      duration: travelDuration,
      ease: 'power3.inOut',
      onUpdate: () => {
        const normT = ((s.t % 1) + 1) % 1;
        setRailProgress(normT);
      },
      onComplete: () => {
        s.isTransitioning = false;
        s.transitionProgress = 0.0;
        // Unwrap continuous integer laps cleanly
        const wrap = Math.floor(s.t);
        s.t -= wrap;
        s.prevT -= wrap;
        setRailProgress(s.t);
      },
    });
  }, [activeSection, camera, setRailProgress]);

  // ── Automatic camera push-in after boot sequence ──
  useEffect(() => {
    if (bootStage !== 'push_in') return;

    const s = stateRef.current;
    const targetPos = getRailPoint(SECTION_TO_T.bridge, SHIP_RAIL_RADIUS, SHIP_HEIGHT);

    // Play subtle warp whoosh for the push-in
    soundFX.playWhoosh(2.1);

    // Smooth automatic camera push-in toward the main screen over 2.0s
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 2.0,
      ease: 'power3.out',
      onUpdate: () => {
        camera.lookAt(BLACK_HOLE_CENTER);
      },
      onComplete: () => {
        // Fade mouse parallax in and hand control over to the user
        gsap.to(s, { parallaxWeight: 1.0, duration: 0.6, ease: 'power2.out' });
        useSceneStore.getState().setBootStage('ready');
        useSceneStore.getState().setBooted(true);
      },
    });
  }, [bootStage, camera]);

  useFrame((state, delta) => {
    const s = stateRef.current;
    s.idleTime += delta;
    const tClock = s.idleTime;

    // ── 1. FOV Warp / Acceleration Effect (Brief +5-8° at midpoint) ──
    if ('fov' in camera) {
      const perspCam = camera as THREE.PerspectiveCamera;
      let targetFov = BASE_FOV;

      if (s.isTransitioning) {
        // Bell-curve modulation using sin(progress * PI) -> 0 at start, peak at 0.5, 0 at end
        const warpCurve = Math.sin(s.transitionProgress * Math.PI);
        targetFov = BASE_FOV + warpCurve * MAX_FOV_BOOST;
      }

      // Smooth damp for buttery FOV transitions
      perspCam.fov = THREE.MathUtils.damp(perspCam.fov, targetFov, 6.0, delta);
      perspCam.updateProjectionMatrix();
    }

    // ── 2. Mouse Parallax (max ~1-2 degrees, smoothly lerped, disabled during transit) ──
    // 1.5 deg = ~0.026 rad max shift
    s.targetPointerYaw = -state.pointer.x * THREE.MathUtils.degToRad(1.6) * s.parallaxWeight;
    s.targetPointerPitch = state.pointer.y * THREE.MathUtils.degToRad(1.2) * s.parallaxWeight;

    // Smooth lerp for physical cockpit feel
    s.pointerYaw = THREE.MathUtils.damp(s.pointerYaw, s.targetPointerYaw, 4.2, delta);
    s.pointerPitch = THREE.MathUtils.damp(s.pointerPitch, s.targetPointerPitch, 4.2, delta);

    // ── 3. Continuous Subtle Idle Motion (Ship gently drifting in space, never stops) ──
    // Slow sinusoidal position sway (~0.02 - 0.04 units)
    const idlePosX = Math.sin(tClock * 0.45) * 0.034;
    const idlePosY = Math.cos(tClock * 0.38) * 0.026;
    const idlePosZ = Math.sin(tClock * 0.52 + 1.2) * 0.022;

    // Subtle sinusoidal rotational drift (~0.3 - 0.6 degrees)
    const idlePitch = Math.sin(tClock * 0.32) * THREE.MathUtils.degToRad(0.40);
    const idleYaw   = Math.cos(tClock * 0.28) * THREE.MathUtils.degToRad(0.35);
    const idleRoll  = Math.sin(tClock * 0.40) * THREE.MathUtils.degToRad(0.55);

    // ── 4. Dynamic Banking into Turns (Cubic Eased Angular Velocity) ──
    const dt = s.t - s.prevT;
    const instantaneousVel = THREE.MathUtils.clamp(dt / Math.max(delta, 0.001), -4.0, 4.0);
    s.velocity = THREE.MathUtils.damp(s.velocity, instantaneousVel, 4.5, delta);
    s.prevT = s.t;

    // Roll into the turn: bank angle peaks at maximum velocity, returns to 0 on station arrival
    const targetBank = THREE.MathUtils.clamp(s.velocity * -0.25, -0.15, 0.15);
    s.bankAngle = THREE.MathUtils.damp(s.bankAngle, targetBank, 4.0, delta);

    // ── 5. Compute Spatial Frame on Circular Rail ──
    // Current orbital base position
    const basePos = getRailPoint(s.t, SHIP_RAIL_RADIUS, SHIP_HEIGHT);

    // Coordinate basis: forward towards black hole, right along rail tangent, up
    const forward = new THREE.Vector3().subVectors(BLACK_HOLE_CENTER, basePos).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, worldUp).normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();

    // ── 6. Final Camera Position (Rail + Idle Sway) ──
    const camPos = basePos
      .clone()
      .addScaledVector(right, idlePosX)
      .addScaledVector(up, idlePosY)
      .addScaledVector(forward, idlePosZ);

    camera.position.copy(camPos);

    // ── 7. Camera Up Vector (Dynamic Banking + Idle Roll + Mouse Roll) ──
    const totalRoll = s.bankAngle + idleRoll + (-s.pointerYaw * 0.35);
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(forward, totalRoll);
    const dynamicUp = up.clone().applyQuaternion(rollQuat).normalize();
    camera.up.copy(dynamicUp);

    // ── 8. Camera Look-At Target (Black Hole + Parallax + Idle Rotation) ──
    // Multiply angular shifts by focal distance (~7.2 units) to aim view
    const totalYaw = s.pointerYaw + idleYaw;
    const totalPitch = s.pointerPitch + idlePitch;

    const targetLookAt = BLACK_HOLE_CENTER.clone()
      .addScaledVector(right, totalYaw * 7.0)
      .addScaledVector(up, totalPitch * 7.0);

    camera.lookAt(targetLookAt);
  });

  return null;
}
