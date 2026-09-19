'use client';

import Starfield from './Starfield';
import BlackHole from './BlackHole';
import RailSystem from './RailSystem';
import PostEffects from './PostEffects';
import CameraController from './CameraController';
import ProjectWaypoints from './ProjectWaypoints';

export default function SceneContent() {
  return (
    <>
      {/* 1. Orbiting Ship Rig & Camera Controller (moves along circular rail) */}
      <CameraController />

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 4]} intensity={0.8} />
      <pointLight position={[0, -1, 1.5]} intensity={1.5} color="#00f0ff" distance={4} />

      {/* 2. Instanced Starfield with Parallax */}
      <Starfield count={3200} />

      {/* 3. Circular Orbital Rail & 8 Station Platforms */}
      <RailSystem />

      {/* 4. Shader-based Black Hole (Event Horizon, Doppler Accretion Disk, Lensing) */}
      <BlackHole />

      {/* 5. Interactive 3D Project Waypoint Beacons (Star Charts / Portfolio Mode) */}
      <ProjectWaypoints />

      {/* 6. Postprocessing Effects (Bloom, Vignette, Chromatic Aberration) */}
      <PostEffects />
    </>
  );
}
