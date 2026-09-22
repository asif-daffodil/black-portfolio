import * as THREE from 'three';
import { SectionId } from '@/store/useSceneStore';

export const BLACK_HOLE_CENTER = new THREE.Vector3(0, 0.5, -4.0);

// Single Circular Orbital Ring Parameters
export const ORBITAL_RING_RADIUS = 5.8;
export const ORBITAL_RING_INNER_RADIUS = 5.45;
export const ORBITAL_RING_TUBE_RADIUS = 0.038;

// Tilted plane: tilted toward camera (X axis) and subtle banking (Z axis)
// so the ring reads as an open, dynamic ellipse framing the accretion disk
export const RING_TILT_X = 0.44; // ~25.2 degrees tilt towards camera
export const RING_TILT_Y = 0.0;
export const RING_TILT_Z = -0.10; // ~ -5.7 degrees subtle lateral incline

// Base auto-rotation speed: ~1 full revolution per 105 seconds (within 90-120s specification)
export const RING_AUTO_ROTATION_SPEED = (2 * Math.PI) / 105; // ~0.0598 rad/s

// Focused staging position in front of black hole/ring along camera sightline
export const FOCUSED_NODE_WORLD_POS = new THREE.Vector3(
  0,
  0.5 + 7.5 * Math.sin(THREE.MathUtils.degToRad(18)),
  -4.0 + 7.5 * Math.cos(THREE.MathUtils.degToRad(18))
); // [0, ~2.82, ~3.13]
export const FOCUSED_NODE_SCALE = 1.65;
export const NODE_TRANSITION_DURATION = 0.95; // seconds

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Backward compatibility aliases
export const SHIP_RAIL_RADIUS = ORBITAL_RING_RADIUS;
export const SHIP_HEIGHT = 0.0;
export const VISUAL_RAIL_HEIGHT = 0.0;

export interface StationData {
  id: SectionId;
  index: number;
  angle: number; // base angular position on the ring in radians
  t: number;     // normalized [0, 1)
  code: string;
  name: string;
  sublabel: string;
  sectorName: string;
  badge: string;
  iconName: 'Compass' | 'User' | 'Cpu' | 'Briefcase' | 'GraduationCap' | 'Bot' | 'FolderGit2' | 'Mail';
  color: string;
  beaconColor: string;
}

export const STATIONS: StationData[] = [
  {
    id: 'bridge',
    index: 0,
    angle: 0 * ((2 * Math.PI) / 8),
    t: 0.0,
    code: 'NAV-01',
    name: 'ORBIT',
    sublabel: 'COMMAND',
    sectorName: 'ORBIT COMMAND',
    badge: 'SPATIAL CORE',
    iconName: 'Compass',
    color: '#3b82f6',
    beaconColor: '#60a5fa',
  },
  {
    id: 'about',
    index: 1,
    angle: 1 * ((2 * Math.PI) / 8),
    t: 0.125,
    code: 'BIO-02',
    name: 'ORIGIN',
    sublabel: 'PROFILE',
    sectorName: 'ORIGIN ARCHIVE',
    badge: 'SYSTEM ARCHITECT',
    iconName: 'User',
    color: '#06b6d4',
    beaconColor: '#22d3ee',
  },
  {
    id: 'skills',
    index: 2,
    angle: 2 * ((2 * Math.PI) / 8),
    t: 0.25,
    code: 'SYS-03',
    name: 'ARSENAL',
    sublabel: 'SYSTEMS',
    sectorName: 'ARSENAL CORE',
    badge: 'PHP & AI STACK',
    iconName: 'Cpu',
    color: '#8b5cf6',
    beaconColor: '#a78bfa',
  },
  {
    id: 'experience',
    index: 3,
    angle: 3 * ((2 * Math.PI) / 8),
    t: 0.375,
    code: 'LOG-04',
    name: 'FLIGHT LOG',
    sublabel: 'EXPERIENCE',
    sectorName: 'FLIGHT LOG ARCHIVE',
    badge: 'ENTERPRISE LEAD',
    iconName: 'Briefcase',
    color: '#10b981',
    beaconColor: '#34d399',
  },
  {
    id: 'education',
    index: 4,
    angle: 4 * ((2 * Math.PI) / 8),
    t: 0.5,
    code: 'ACD-05',
    name: 'CREDENTIALS',
    sublabel: 'DEGREES & ZCE',
    sectorName: 'CREDENTIALS MATRIX',
    badge: 'ZCE & DEGREES',
    iconName: 'GraduationCap',
    color: '#f59e0b',
    beaconColor: '#fbbf24',
  },
  {
    id: 'ai',
    index: 5,
    angle: 5 * ((2 * Math.PI) / 8),
    t: 0.625,
    code: 'AI-06',
    name: 'NEURAL AI',
    sublabel: 'AGENTIC PIPELINES',
    sectorName: 'NEURAL AI CORE',
    badge: 'AUTONOMOUS AGENTS',
    iconName: 'Bot',
    color: '#ec4899',
    beaconColor: '#f472b6',
  },
  {
    id: 'portfolio',
    index: 6,
    angle: 6 * ((2 * Math.PI) / 8),
    t: 0.75,
    code: 'PRJ-07',
    name: 'SHOWCASE',
    sublabel: 'DEPLOYMENTS',
    sectorName: 'SHOWCASE MATRIX',
    badge: 'PRODUCTION APPS',
    iconName: 'FolderGit2',
    color: '#6366f1',
    beaconColor: '#818cf8',
  },
  {
    id: 'contact',
    index: 7,
    angle: 7 * ((2 * Math.PI) / 8),
    t: 0.875,
    code: 'COM-08',
    name: 'RELAY',
    sublabel: 'SUBSPACE COMMS',
    sectorName: 'RELAY TERMINAL',
    badge: 'DIRECT LINK',
    iconName: 'Mail',
    color: '#14b8a6',
    beaconColor: '#2dd4bf',
  },
];

export const SECTION_TO_T: Record<SectionId, number> = {
  bridge: 0.0,
  about: 0.125,
  skills: 0.25,
  experience: 0.375,
  education: 0.5,
  ai: 0.625,
  portfolio: 0.75,
  contact: 0.875,
};

/**
 * Calculates local 3D position of a point on the circular orbital plane
 * (before parent tilt transformation is applied)
 */
export function getOrbitalLocalPoint(
  angle: number,
  radius = ORBITAL_RING_RADIUS,
  yOffset = 0.0
): THREE.Vector3 {
  return new THREE.Vector3(
    radius * Math.cos(angle),
    yOffset,
    radius * Math.sin(angle)
  );
}

/**
 * Backward compatibility helper for legacy rail queries
 */
export function getRailPoint(
  t: number,
  radius = ORBITAL_RING_RADIUS,
  y = SHIP_HEIGHT
): THREE.Vector3 {
  const normT = ((t % 1) + 1) % 1;
  const theta = normT * Math.PI * 2;
  return new THREE.Vector3(
    BLACK_HOLE_CENTER.x + radius * Math.cos(theta),
    y,
    BLACK_HOLE_CENTER.z + radius * Math.sin(theta)
  );
}

export function getShortestRailDelta(fromT: number, toT: number): number {
  let delta = toT - fromT;
  while (delta > 0.5) delta -= 1.0;
  while (delta <= -0.5) delta += 1.0;
  return delta;
}

export function createRailCurve(
  radius = ORBITAL_RING_RADIUS,
  y = VISUAL_RAIL_HEIGHT,
  numPoints = 64
): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints;
    points.push(getRailPoint(t, radius, y));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

