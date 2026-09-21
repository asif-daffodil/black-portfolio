'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── 1. ACCRETION DISK SHADER ───────────────────────────────────────────────
// Thin glowing torus-like disk with radial color gradient:
// White-hot near center -> brilliant gold -> deep fiery orange -> blood red edges
// Keplerian differential rotation & relativistic Doppler beaming
const AccretionDiskShader = {
  uniforms: {
    uTime: { value: 0 },
    uInnerRadius: { value: 0.38 },
    uOuterRadius: { value: 0.94 },
    uGlowIntensity: { value: 1.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    uniform float uGlowIntensity;
    varying vec2 vUv;

    // Fast hash & smooth value noise
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      // Polar coords relative to center (0.5, 0.5)
      vec2 center = vUv - vec2(0.5);
      float r = length(center) * 2.0;
      float theta = atan(center.y, center.x);

      // Discard outside accretion bounds with smooth boundary feathering
      if (r < uInnerRadius || r > uOuterRadius) {
        discard;
      }

      // Smooth inner and outer edge alpha falloff
      float innerEdge = smoothstep(uInnerRadius, uInnerRadius + 0.06, r);
      float outerEdge = 1.0 - smoothstep(uOuterRadius - 0.16, uOuterRadius, r);
      float edgeMask = innerEdge * outerEdge;

      // Keplerian differential rotation (inner plasma spins faster than outer rim)
      float orbitalSpeed = 1.25 / sqrt(max(r, 0.14));
      float rotAngle = theta - uTime * orbitalSpeed;

      // Swirling magnetized plasma filaments
      vec2 swirlUv1 = vec2(rotAngle * 3.2, r * 16.0);
      vec2 swirlUv2 = vec2(rotAngle * 5.0 + uTime * 0.7, r * 26.0 - uTime * 0.4);
      float n1 = vnoise(swirlUv1);
      float n2 = vnoise(swirlUv2);
      float plasma = n1 * 0.65 + n2 * 0.35;

      // Normalized radial position [0.0 = ISCO inner rim, 1.0 = outer fringe]
      float normR = clamp((r - uInnerRadius) / (uOuterRadius - uInnerRadius), 0.0, 1.0);

      // ── Physical Radial Thermal Color Gradient ──
      // Inner rim: White-hot incandescent thermal radiation (> 30,000 K)
      vec3 whiteHot   = vec3(1.15, 1.1, 1.05);  // Incandescent white-hot
      vec3 brightGold  = vec3(1.0, 0.72, 0.16);  // Solar gold (~10,000 K)
      vec3 deepOrange  = vec3(0.95, 0.30, 0.03); // Fiery orange (~5,000 K)
      vec3 darkCrimson = vec3(0.48, 0.05, 0.01); // Cold red fringe (~2,500 K)

      vec3 diskColor;
      if (normR < 0.16) {
        diskColor = mix(whiteHot, brightGold, smoothstep(0.0, 0.16, normR));
      } else if (normR < 0.58) {
        diskColor = mix(brightGold, deepOrange, smoothstep(0.16, 0.58, normR));
      } else {
        diskColor = mix(deepOrange, darkCrimson, smoothstep(0.58, 1.0, normR));
      }

      // ── Relativistic Doppler Beaming ──
      // Approaching side (left) boosted, receding side (right) dimmed
      float dopplerPhase = cos(theta + 1.30);
      float dopplerFactor = 0.5 + 0.5 * dopplerPhase;
      float beaming = mix(0.45, 1.85, pow(dopplerFactor, 1.3));
      vec3 beamedColor = mix(diskColor * 0.75, diskColor * 1.25, dopplerFactor);

      // Combine plasma texture with beaming & glow
      vec3 finalColor = beamedColor * (0.8 + plasma * 1.3) * beaming * uGlowIntensity;
      float alpha = edgeMask * (0.8 + plasma * 0.35);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

// ── 2. GRAVITATIONAL LENSING DISTORTION SHADER ─────────────────────────────
// Warps and bends the background star field directly behind and around the disk
// using a fragment UV deflection offset based on distance to the singularity center (1/r)
// Renders the black hole shadow, curved Einstein arclets, and bright photon ring
const GravitationalLensingShader = {
  uniforms: {
    uTime: { value: 0 },
    uShadowRadius: { value: 0.38 },
    uLensingStrength: { value: 0.075 },
    uPhotonRingBrightness: { value: 2.1 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uShadowRadius;
    uniform float uLensingStrength;
    uniform float uPhotonRingBrightness;
    varying vec2 vUv;

    // Procedural pseudo-random hash for background stars
    float starHash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    // Procedural starfield generator with warped UVs - efficient direct cell sampling
    float getLensedStars(vec2 uv) {
      vec2 grid = uv * 32.0;
      vec2 id = floor(grid);
      vec2 gv = fract(grid) - 0.5;

      float h = starHash(id);
      if (h > 0.80) {
        vec2 starPos = (vec2(starHash(id + 1.2), starHash(id + 2.7)) - 0.5) * 0.65;
        float d = length(gv - starPos);
        return smoothstep(0.14, 0.0, d) * (0.6 + 0.4 * sin(uTime * 1.5 + h * 30.0));
      }
      return 0.0;
    }

    void main() {
      vec2 p = vUv - vec2(0.5);
      float r = length(p) * 2.0;

      // ── Event Horizon Shadow: Pure light absorption inside photon capture radius ──
      if (r < uShadowRadius) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // ── Gravitational Lensing Deflection ──
      // Deflection vector points radially outward from center
      vec2 dir = normalize(p);
      float deltaR = max(r - uShadowRadius + 0.02, 0.001);
      float deflection = uLensingStrength / pow(deltaR, 1.5);
      vec2 warpedUv = (p - dir * deflection) * 0.5 + vec2(0.5);

      // Sample background stars through warped gravitational metric
      float starIntensity = getLensedStars(warpedUv);
      vec3 starColor = mix(vec3(0.7, 0.85, 1.0), vec3(1.0, 0.9, 0.7), starHash(floor(warpedUv * 32.0)));
      vec3 lensedStarlight = starColor * starIntensity * 1.4;

      // ── Einstein Ring / Photon Sphere ──
      float photonR = uShadowRadius + 0.032;
      float photonRing = exp(-pow((r - photonR) / 0.018, 2.0)) * uPhotonRingBrightness;
      float diffuseHalo = exp(-pow((r - photonR) / 0.12, 2.0)) * 0.38;

      vec3 ringColor = vec3(1.0, 0.96, 0.90) * photonRing;
      vec3 haloColor = vec3(1.0, 0.60, 0.18) * diffuseHalo;

      // ── Upper & Lower Lensed Disk Projection Arcs (Gargantua Effect) ──
      float upperArc = exp(-pow((r - (uShadowRadius + 0.16)) / 0.08, 2.0)) * abs(dir.y);
      vec3 arcColor = vec3(1.0, 0.65, 0.18) * upperArc * 0.65;

      vec3 finalRgb = ringColor + haloColor + arcColor + lensedStarlight;
      float finalAlpha = clamp(photonRing + diffuseHalo * 0.6 + upperArc * 0.55 + starIntensity, 0.0, 1.0);

      if (finalAlpha < 0.005) {
        discard;
      }

      gl_FragColor = vec4(finalRgb, finalAlpha);
    }
  `,
};

export default function BlackHole() {
  const diskMeshRef = useRef<THREE.Mesh>(null);
  const diskMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const lensingMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const diskUniforms = useMemo(
    () => THREE.UniformsUtils.clone(AccretionDiskShader.uniforms),
    []
  );

  const lensingUniforms = useMemo(
    () => THREE.UniformsUtils.clone(GravitationalLensingShader.uniforms),
    []
  );

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (diskMaterialRef.current) {
      diskMaterialRef.current.uniforms.uTime.value = time;
    }
    if (lensingMaterialRef.current) {
      lensingMaterialRef.current.uniforms.uTime.value = time;
    }

    if (diskMeshRef.current) {
      // Gentle continuous rotation of disk plane
      diskMeshRef.current.rotation.z += delta * 0.08;
    }

    if (groupRef.current) {
      // Subtle organic sway reacting to mouse pointer parallax
      const targetX = state.pointer.x * 0.22;
      const targetY = state.pointer.y * 0.14;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.04
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0.5 + targetY,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, -4]}>
      {/* ── 1. Central Opaque Event Horizon Sphere ── */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* ── 2. Gravitational Lensing & Einstein Ring Distortion Quad ── */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[4.4, 4.4]} />
        <shaderMaterial
          ref={lensingMaterialRef}
          vertexShader={GravitationalLensingShader.vertexShader}
          fragmentShader={GravitationalLensingShader.fragmentShader}
          uniforms={lensingUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 3. Main Glowing Accretion Disk (Tilted toward viewer like Gargantua) ── */}
      <mesh
        ref={diskMeshRef}
        position={[0, 0, 0]}
        rotation={[Math.PI * 0.42, 0, -Math.PI * 0.08]}
      >
        <planeGeometry args={[7.4, 7.4]} />
        <shaderMaterial
          ref={diskMaterialRef}
          vertexShader={AccretionDiskShader.vertexShader}
          fragmentShader={AccretionDiskShader.fragmentShader}
          uniforms={diskUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
