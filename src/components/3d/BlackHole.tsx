'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Accretion Disk Custom Shader
const AccretionDiskShader = {
  uniforms: {
    uTime: { value: 0 },
    uInnerRadius: { value: 0.28 },
    uOuterRadius: { value: 0.98 },
    uGlowIntensity: { value: 2.2 },
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

    // Procedural noise approximation
    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
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

      // Discard outside accretion bounds with soft feathering
      if (r < uInnerRadius || r > uOuterRadius) {
        discard;
      }

      float edgeAlpha = smoothstep(uInnerRadius, uInnerRadius + 0.06, r) * 
                         (1.0 - smoothstep(uOuterRadius - 0.1, uOuterRadius, r));

      // Differential orbital rotation (Keplerian: inner rotates faster)
      float speed = 1.4 / sqrt(max(r, 0.1));
      float rotAngle = theta - uTime * speed;

      // Swirling noise filaments
      vec2 swirlUv = vec2(rotAngle * 2.5, r * 12.0);
      float n1 = noise(swirlUv);
      float n2 = noise(swirlUv * 2.2 + vec2(uTime * 1.2, -uTime * 0.8));
      float plasma = n1 * 0.6 + n2 * 0.4;

      // Normalized radial coordinate (0 at inner edge, 1 at outer edge)
      float normR = (r - uInnerRadius) / (uOuterRadius - uInnerRadius);

      // Color Gradient:
      // Inner: Intense glowing warm amber/gold (#ff9500 to #ff5e00)
      // Rim: Cooler blue-white incandescent rim (#60a5fa to #e0f2fe)
      vec3 coreWarm = vec3(1.0, 0.45, 0.08); // Hot amber/orange
      vec3 coreGold = vec3(1.0, 0.75, 0.2);  // Rich gold
      vec3 rimBlue  = vec3(0.5, 0.78, 1.0);  // Doppler blue-white
      vec3 deepRed  = vec3(0.7, 0.12, 0.02); // Outer red fringe

      vec3 color = mix(coreWarm, coreGold, smoothstep(0.0, 0.35, normR));
      color = mix(color, rimBlue, smoothstep(0.65, 1.0, normR));

      // Relativistic Doppler Beaming Effect:
      // Approaching side (left side: cos(theta + offset) > 0) is significantly brighter and blue-shifted
      // Receding side (right side) is dimmer and red-shifted
      float dopplerFactor = 0.5 + 0.5 * cos(theta + 1.25);
      float beaming = mix(0.4, 1.95, dopplerFactor);
      vec3 dopplerColor = mix(deepRed, color, dopplerFactor * 0.7 + 0.3);

      // Combine plasma texture, temperature colors, and beaming
      vec3 finalColor = dopplerColor * (0.8 + plasma * 1.4) * beaming * uGlowIntensity;
      float alpha = edgeAlpha * (0.75 + plasma * 0.35);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

// Gravitational Lensing Halo / Einstein Ring Shader
const GravitationalLensingShader = {
  uniforms: {
    uTime: { value: 0 },
    uDistortion: { value: 0.18 },
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
    uniform float uDistortion;
    varying vec2 vUv;

    void main() {
      vec2 center = vUv - vec2(0.5);
      float r = length(center) * 2.0;

      // Einstein ring: bright halo tightly hugging the photon sphere (r ~ 0.65 - 0.85)
      float ring = exp(-pow((r - 0.72) / 0.045, 2.0));
      float halo = exp(-pow((r - 0.88) / 0.12, 2.0)) * 0.35;

      // Color of gravitationally deflected light
      vec3 ringColor = vec3(0.9, 0.95, 1.0) * 2.2;
      vec3 haloColor = vec3(1.0, 0.65, 0.25) * 1.4;
      vec3 finalColor = ringColor * ring + haloColor * halo;

      float alpha = (ring + halo) * 0.85;
      if (alpha < 0.01) discard;

      gl_FragColor = vec4(finalColor, alpha);
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
      const targetX = state.pointer.x * 0.25;
      const targetY = state.pointer.y * 0.15;
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
      {/* 1. Pure Event Horizon: Absorbs all light */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Gravitational Lensing / Einstein Ring Halo */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.2, 3.2]} />
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

      {/* 3. Accretion Disk (Tilted toward viewer like Gargantua) */}
      <mesh
        ref={diskMeshRef}
        position={[0, 0, 0]}
        rotation={[Math.PI * 0.42, 0, -Math.PI * 0.06]}
      >
        <planeGeometry args={[7.2, 7.2]} />
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

      {/* 4. Secondary Secondary Cross-Ring (Upper & Lower Lensed Disk Projection) */}
      <mesh
        position={[0, 0, -0.05]}
        rotation={[0, 0, 0]}
        scale={[1.1, 1.1, 1.1]}
      >
        <ringGeometry args={[1.1, 2.8, 64]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
