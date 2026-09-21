'use client';

import Starfield from './Starfield';
import NebulaBackground from './NebulaBackground';
import BlackHole from './BlackHole';
import LightShafts from './LightShafts';
import RailSystem from './RailSystem';
import PostEffects from './PostEffects';
import CameraController from './CameraController';
import ProjectWaypoints from './ProjectWaypoints';
import Cockpit from './Cockpit';

export default function SceneContent() {
  return (
    <>
      {/* 1. Orbiting Ship Rig & Camera Controller (moves along circular rail) */}
      <CameraController />

      {/* 2. Spacecraft Cockpit Frame & Console Deck (follows camera) */}
      <Cockpit />

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 4]} intensity={0.85} />
      <pointLight position={[0, -1, 1.5]} intensity={1.5} color="#00f0ff" distance={4} />

      {/* 3. Soft Cosmic Nebula Clouds (Muted purple/blue dust in deep background) */}
      <NebulaBackground />

      {/* 4. 3-Layer Multi-Depth Parallax Starfield */}
      <Starfield />

      {/* 5. Circular Orbital Rail & 8 Station Platforms */}
      <RailSystem />

      {/* 6. Shader-based Black Hole (Accretion Disk, Event Horizon, Gravitational Lensing) */}
      <BlackHole />

      {/* 7. Volumetric Light Shafts (Emanating from Black Hole toward ship viewport) */}
      <LightShafts />

      {/* 8. Interactive 3D Project Waypoint Beacons (Star Charts / Portfolio Mode) */}
      <ProjectWaypoints />

      {/* 9. Postprocessing Effects (Bloom, Vignette, Chromatic Aberration) */}
      <PostEffects />
    </>
  );
}
