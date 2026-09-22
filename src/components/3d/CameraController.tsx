'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useSceneStore } from '@/store/useSceneStore';
import { soundFX } from '@/lib/sound';
import {
  BLACK_HOLE_CENTER,
  ORBITAL_RING_RADIUS,
} from './railConfig';

const BASE_FOV = 48;
// Bounding radius covering the orbital ring plus docked node badges and platform extent
const BOUNDING_RADIUS = ORBITAL_RING_RADIUS + 0.95; // ~6.75 units
// Generous margin factor (35% extra buffer around the system)
const MARGIN_FACTOR = 1.35;
// Viewing elevation angle above the orbital plane
const ELEVATION_ANGLE = THREE.MathUtils.degToRad(18); // ~18 degrees elevation

export default function CameraController() {
  const { camera, size } = useThree();
  const isBooted = useSceneStore((state) => state.isBooted);
  const bootStage = useSceneStore((state) => state.bootStage);

  const stateRef = useRef({
    distance: 21.0,
    targetDistance: 21.0,
    bootOffset: isBooted ? 0.0 : 5.0,
    parallaxWeight: isBooted ? 1.0 : 0.0,
    pointerYaw: 0.0,
    pointerPitch: 0.0,
    targetPointerYaw: 0.0,
    targetPointerPitch: 0.0,
    idleTime: 0.0,
  });

  // Dynamically compute spacious camera distance based on viewport width/height and camera FOV
  // Recalculates automatically whenever the window or canvas resizes
  useEffect(() => {
    if (!('fov' in camera)) return;
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov = BASE_FOV;
    perspCam.updateProjectionMatrix();

    const halfFovV = (perspCam.fov * Math.PI) / 360;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.1);
    const halfFovH = Math.atan(Math.tan(halfFovV) * aspect);

    // Required distance along vertical and horizontal dimensions to guarantee full containment
    const distV = (BOUNDING_RADIUS * MARGIN_FACTOR) / Math.tan(halfFovV);
    const distH = (BOUNDING_RADIUS * MARGIN_FACTOR) / Math.tan(halfFovH);

    // Pick maximum distance so system stays comfortably inside frame with generous margin on all sides
    const computedDistance = Math.max(distV, distH, 18.0);
    stateRef.current.targetDistance = computedDistance;

    // If first load or immediately after boot, initialize current distance
    if (Math.abs(stateRef.current.distance - 21.0) < 0.1) {
      stateRef.current.distance = computedDistance;
    }
  }, [size.width, size.height, camera]);

  // Handle immediate boot bypass
  useEffect(() => {
    if (isBooted) {
      const s = stateRef.current;
      gsap.killTweensOf(s);
      s.bootOffset = 0.0;
      s.parallaxWeight = 1.0;
    }
  }, [isBooted]);

  // Cinematic automatic slow camera push-in after boot sequence completes
  useEffect(() => {
    if (bootStage !== 'push_in') return;

    const s = stateRef.current;
    soundFX.playWhoosh(2.1);

    gsap.killTweensOf(s);
    gsap.to(s, {
      bootOffset: 0.0,
      duration: 2.2,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to(s, { parallaxWeight: 1.0, duration: 0.6, ease: 'power2.out' });
        useSceneStore.getState().setBootStage('ready');
        useSceneStore.getState().setBooted(true);
        // Auto-focus the Home (bridge) page once the viewscreen is fully open,
        // exactly as if the user had clicked the Home menu item.
        useSceneStore.getState().activateSection('bridge');
      },
    });
  }, [bootStage]);


  useFrame((state, delta) => {
    const s = stateRef.current;
    s.idleTime += delta;
    const tClock = s.idleTime;

    // Smoothly interpolate camera distance to target on window resize
    s.distance = THREE.MathUtils.damp(s.distance, s.targetDistance, 3.5, delta);
    const effectiveDistance = s.distance + s.bootOffset;

    // Subtle pointer parallax (max ~1.5 deg, smoothly damped)
    s.targetPointerYaw = -state.pointer.x * THREE.MathUtils.degToRad(1.4) * s.parallaxWeight;
    s.targetPointerPitch = state.pointer.y * THREE.MathUtils.degToRad(1.0) * s.parallaxWeight;
    s.pointerYaw = THREE.MathUtils.damp(s.pointerYaw, s.targetPointerYaw, 4.0, delta);
    s.pointerPitch = THREE.MathUtils.damp(s.pointerPitch, s.targetPointerPitch, 4.0, delta);

    // Continuous subtle organic idle drift (ship observation deck sensation)
    const idleX = Math.sin(tClock * 0.35) * 0.08;
    const idleY = Math.cos(tClock * 0.28) * 0.06;
    const idleZ = Math.sin(tClock * 0.42 + 1.0) * 0.05;

    // Base position elevated at ELEVATION_ANGLE looking towards BLACK_HOLE_CENTER
    const baseDirY = Math.sin(ELEVATION_ANGLE);
    const baseDirZ = Math.cos(ELEVATION_ANGLE);

    const camX = BLACK_HOLE_CENTER.x + idleX + s.pointerYaw * 2.5;
    const camY = BLACK_HOLE_CENTER.y + effectiveDistance * baseDirY + idleY + s.pointerPitch * 2.0;
    const camZ = BLACK_HOLE_CENTER.z + effectiveDistance * baseDirZ + idleZ;

    camera.position.set(camX, camY, camZ);
    camera.up.set(0, 1, 0);

    // Aim precisely at the black hole core with subtle parallax offset
    const lookTarget = BLACK_HOLE_CENTER.clone().add(
      new THREE.Vector3(s.pointerYaw * 1.5, s.pointerPitch * 1.2, 0)
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

