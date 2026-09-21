'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BLACK_HOLE_CENTER } from './railConfig';

const LightShaftShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffb74d') },
    uOpacity: { value: 0.10 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistanceAlongBeam;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      // Cylinder top (near black hole) is uv.y = 1.0.
      // Cylinder bottom (expanding towards camera) is uv.y = 0.0.
      // Normalize so 0.0 is origin at black hole, 1.0 is tip towards camera:
      vDistanceAlongBeam = 1.0 - uv.y;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistanceAlongBeam;

    void main() {
      // Smooth axial emergence from black hole (0.0 to 0.18)
      // and feather-soft taper towards camera (0.45 to 1.0)
      float sourceFade = smoothstep(0.0, 0.18, vDistanceAlongBeam);
      float cameraFade = smoothstep(1.0, 0.42, vDistanceAlongBeam);
      float lengthFade = sourceFade * cameraFade;

      // Soft volumetric rim / limb falloff
      vec3 viewDir = normalize(vViewPosition);
      float rim = 1.0 - abs(dot(vNormal, viewDir));
      float volumetricLimb = pow(clamp(rim, 0.0, 1.0), 1.6);

      // Subtle streaming stardust filaments
      float stream = sin(vUv.y * 14.0 - uTime * 0.9 + vUv.x * 6.0) * 0.14;
      float dustDensity = 0.86 + stream;

      float alpha = lengthFade * volumetricLimb * dustDensity * uOpacity;

      if (alpha < 0.001) {
        discard;
      }

      vec3 beamColor = uColor * (1.05 + stream * 0.25);
      gl_FragColor = vec4(beamColor, alpha);
    }
  `,
};

export default function LightShafts() {
  const shaft1Ref = useRef<THREE.Mesh>(null);
  const shaft2Ref = useRef<THREE.Mesh>(null);
  const shaft3Ref = useRef<THREE.Mesh>(null);

  const mat1Ref = useRef<THREE.ShaderMaterial>(null);
  const mat2Ref = useRef<THREE.ShaderMaterial>(null);
  const mat3Ref = useRef<THREE.ShaderMaterial>(null);

  // Sleek open-ended cones
  // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded)
  const [geo1, geo2, geo3] = useMemo(() => {
    return [
      new THREE.CylinderGeometry(0.10, 1.5, 9.5, 32, 16, true),
      new THREE.CylinderGeometry(0.08, 1.25, 8.5, 32, 16, true),
      new THREE.CylinderGeometry(0.10, 1.35, 9.0, 32, 16, true),
    ];
  }, []);

  // Primary amber-gold beam
  const uniforms1 = useMemo(() => {
    const u = THREE.UniformsUtils.clone(LightShaftShader.uniforms);
    u.uColor.value = new THREE.Color('#f59e0b');
    u.uOpacity.value = 0.11;
    return u;
  }, []);

  // Secondary radiant solar-white beam
  const uniforms2 = useMemo(() => {
    const u = THREE.UniformsUtils.clone(LightShaftShader.uniforms);
    u.uColor.value = new THREE.Color('#fef08a');
    u.uOpacity.value = 0.08;
    return u;
  }, []);

  // Tertiary high-energy ionization cyan beam
  const uniforms3 = useMemo(() => {
    const u = THREE.UniformsUtils.clone(LightShaftShader.uniforms);
    u.uColor.value = new THREE.Color('#38bdf8');
    u.uOpacity.value = 0.08;
    return u;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (mat1Ref.current) mat1Ref.current.uniforms.uTime.value = time;
    if (mat2Ref.current) mat2Ref.current.uniforms.uTime.value = time * 0.9;
    if (mat3Ref.current) mat3Ref.current.uniforms.uTime.value = time * 1.1;

    // Subtle gentle sway
    const breathe = Math.sin(time * 0.5) * 0.02;

    if (shaft1Ref.current) {
      shaft1Ref.current.rotation.z = THREE.MathUtils.degToRad(18) + breathe;
    }
    if (shaft2Ref.current) {
      shaft2Ref.current.rotation.z = THREE.MathUtils.degToRad(-16) - breathe;
    }
    if (shaft3Ref.current) {
      shaft3Ref.current.rotation.x = THREE.MathUtils.degToRad(84) + breathe * 0.8;
    }
  });

  return (
    <group position={[BLACK_HOLE_CENTER.x, BLACK_HOLE_CENTER.y, BLACK_HOLE_CENTER.z]}>
      {/* ── SHAFT 1: Amber Gold Ray (Emanating towards starboard cockpit) ── */}
      <mesh
        ref={shaft1Ref}
        geometry={geo1}
        position={[0.4, -0.3, 4.2]}
        rotation={[Math.PI * 0.52, THREE.MathUtils.degToRad(18), THREE.MathUtils.degToRad(8)]}
      >
        <shaderMaterial
          ref={mat1Ref}
          vertexShader={LightShaftShader.vertexShader}
          fragmentShader={LightShaftShader.fragmentShader}
          uniforms={uniforms1}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── SHAFT 2: Solar White Ray (Emanating towards port cockpit) ── */}
      <mesh
        ref={shaft2Ref}
        geometry={geo2}
        position={[-0.5, 0.1, 3.8]}
        rotation={[Math.PI * 0.48, THREE.MathUtils.degToRad(-16), THREE.MathUtils.degToRad(-10)]}
      >
        <shaderMaterial
          ref={mat2Ref}
          vertexShader={LightShaftShader.vertexShader}
          fragmentShader={LightShaftShader.fragmentShader}
          uniforms={uniforms2}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── SHAFT 3: Ionization Cyan Ray (Emanating upward towards canopy) ── */}
      <mesh
        ref={shaft3Ref}
        geometry={geo3}
        position={[0.1, 0.6, 4.4]}
        rotation={[Math.PI * 0.44, THREE.MathUtils.degToRad(6), THREE.MathUtils.degToRad(14)]}
      >
        <shaderMaterial
          ref={mat3Ref}
          vertexShader={LightShaftShader.vertexShader}
          fragmentShader={LightShaftShader.fragmentShader}
          uniforms={uniforms3}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
