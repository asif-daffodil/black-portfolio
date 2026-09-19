import * as THREE from 'three';
import { SectionId } from '@/store/useSceneStore';

export const BLACK_HOLE_CENTER = new THREE.Vector3(0, 0.5, -4.0);
export const SHIP_RAIL_RADIUS = 7.2;
export const SHIP_HEIGHT = 0.0;
export const VISUAL_RAIL_HEIGHT = -1.1;

export interface StationData {
  id: SectionId;
  t: number;
  code: string;
  name: string;
  color: string;
  beaconColor: string;
}

export const STATIONS: StationData[] = [
  { id: 'bridge', t: 0.0, code: 'NAV-01', name: 'BRIDGE', color: '#3b82f6', beaconColor: '#60a5fa' },
  { id: 'about', t: 0.125, code: 'BIO-02', name: 'PROFILE', color: '#06b6d4', beaconColor: '#22d3ee' },
  { id: 'skills', t: 0.25, code: 'SYS-03', name: 'SYSTEMS', color: '#8b5cf6', beaconColor: '#a78bfa' },
  { id: 'experience', t: 0.375, code: 'LOG-04', name: 'LOGS', color: '#10b981', beaconColor: '#34d399' },
  { id: 'education', t: 0.5, code: 'ACD-05', name: 'ARCHIVE', color: '#f59e0b', beaconColor: '#fbbf24' },
  { id: 'ai', t: 0.625, code: 'AI-06', name: 'AI CORE', color: '#ec4899', beaconColor: '#f472b6' },
  { id: 'portfolio', t: 0.75, code: 'PRJ-07', name: 'CHARTS', color: '#6366f1', beaconColor: '#818cf8' },
  { id: 'contact', t: 0.875, code: 'COM-08', name: 'HAILING', color: '#14b8a6', beaconColor: '#2dd4bf' },
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
 * Calculates a point on the circular orbital rail
 * t in [0, 1) where t=0 is Bridge (Home)
 */
export function getRailPoint(
  t: number,
  radius = SHIP_RAIL_RADIUS,
  y = SHIP_HEIGHT
): THREE.Vector3 {
  const normT = ((t % 1) + 1) % 1;
  const theta = normT * Math.PI * 2;
  return new THREE.Vector3(
    BLACK_HOLE_CENTER.x + radius * Math.sin(theta),
    y,
    BLACK_HOLE_CENTER.z + radius * Math.cos(theta)
  );
}

/**
 * Calculates the shortest signed delta around the closed circle
 * Guarantees |delta| <= 0.5 (shorter arc wraparound)
 */
export function getShortestRailDelta(fromT: number, toT: number): number {
  let delta = toT - fromT;
  while (delta > 0.5) delta -= 1.0;
  while (delta <= -0.5) delta += 1.0;
  return delta;
}

/**
 * Builds the closed CatmullRomCurve3 for rendering the circular rail tube
 */
export function createRailCurve(
  radius = SHIP_RAIL_RADIUS,
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
