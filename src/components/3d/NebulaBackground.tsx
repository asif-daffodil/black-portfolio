'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSafeTime, MAX_DELTA } from '@/lib/animationTime';

const NebulaShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#3b0764') },   // Deep cosmic violet
    uColorMid: { value: new THREE.Color('#1e1b4b') },    // Celestial indigo
    uColorOuter: { value: new THREE.Color('#0369a1') },  // Muted deep cyan
    uOpacity: { value: 0.32 },
    uScale: { value: 2.2 },
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
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorOuter;
    uniform float uOpacity;
    uniform float uScale;
    varying vec2 vUv;

    // Simplex-inspired 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float total = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 4; i++) {
        total += snoise(p * freq) * amp;
        freq *= 2.05;
        amp *= 0.48;
      }
      return total;
    }

    void main() {
      // Centered coordinate and soft radial falloff
      vec2 centered = vUv - vec2(0.5);
      float dist = length(centered) * 2.0;

      // Soft vignette mask so edges are 100% borderless
      float mask = smoothstep(1.0, 0.15, dist);
      if (mask <= 0.001) {
        discard;
      }

      // Slow cosmic drift
      vec2 drift = vec2(uTime * 0.012, -uTime * 0.008);
      vec2 st = (vUv - 0.5) * uScale + drift;

      // Multi-layer gas density
      float n1 = fbm(st);
      float n2 = fbm(st * 1.8 + vec2(1.7, 3.2) - drift * 0.5);
      float density = max(0.0, (n1 * 0.6 + n2 * 0.4 + 0.25) * mask);

      // Color mapping: Core violet -> Indigo -> Deep Cyan
      vec3 color = mix(uColorOuter, uColorMid, smoothstep(0.05, 0.45, density));
      color = mix(color, uColorCore, smoothstep(0.4, 0.85, density));

      float alpha = density * mask * uOpacity;
      gl_FragColor = vec4(color * 1.3, alpha);
    }
  `,
};

export default function NebulaBackground() {
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mat1Ref = useRef<THREE.ShaderMaterial>(null);
  const mat2Ref = useRef<THREE.ShaderMaterial>(null);

  const uniforms1 = useMemo(() => {
    const u = THREE.UniformsUtils.clone(NebulaShader.uniforms);
    u.uColorCore.value = new THREE.Color('#4a044e'); // Deep magenta-violet
    u.uColorMid.value = new THREE.Color('#1e1b4b');  // Midnight indigo
    u.uColorOuter.value = new THREE.Color('#083344'); // Deep cosmic teal
    u.uOpacity.value = 0.28;
    u.uScale.value = 1.9;
    return u;
  }, []);

  const uniforms2 = useMemo(() => {
    const u = THREE.UniformsUtils.clone(NebulaShader.uniforms);
    u.uColorCore.value = new THREE.Color('#312e81'); // Royal celestial blue
    u.uColorMid.value = new THREE.Color('#2e1065');  // Dark nebula purple
    u.uColorOuter.value = new THREE.Color('#022c22'); // Subdued emerald cyan
    u.uOpacity.value = 0.22;
    u.uScale.value = 2.4;
    return u;
  }, []);

  useFrame((state, delta) => {
    // Use the shared safe clock advanced by Starfield every frame.
    // This prevents the nebula from visually snapping forward when the tab returns
    // from background (where getElapsedTime() would jump by the full paused duration).
    const t = getSafeTime();
    // Clamp delta for rotation so it can't teleport on a big frame either.
    const safeDelta = Math.min(delta, MAX_DELTA);

    if (mat1Ref.current) {
      mat1Ref.current.uniforms.uTime.value = t;
    }
    if (mat2Ref.current) {
      mat2Ref.current.uniforms.uTime.value = t * 0.85;
    }

    // Slow parallax response to mouse pointer
    const px = state.pointer.x;
    const py = state.pointer.y;

    if (mesh1Ref.current) {
      mesh1Ref.current.position.x = THREE.MathUtils.lerp(
        mesh1Ref.current.position.x,
        -px * 1.2,
        0.02
      );
      mesh1Ref.current.position.y = THREE.MathUtils.lerp(
        mesh1Ref.current.position.y,
        1.5 - py * 0.8,
        0.02
      );
      mesh1Ref.current.rotation.z += safeDelta * 0.003;
    }

    if (mesh2Ref.current) {
      mesh2Ref.current.position.x = THREE.MathUtils.lerp(
        mesh2Ref.current.position.x,
        px * 0.9 + 4.0,
        0.02
      );
      mesh2Ref.current.position.y = THREE.MathUtils.lerp(
        mesh2Ref.current.position.y,
        -2.0 + py * 0.6,
        0.02
      );
      mesh2Ref.current.rotation.z -= safeDelta * 0.0025;
    }
  });

  return (
    <group>
      {/* Primary Cosmic Nebula Cloud */}
      <mesh
        ref={mesh1Ref}
        position={[-3, 1.5, -45]}
        scale={[85, 60, 1]}
      >
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          ref={mat1Ref}
          vertexShader={NebulaShader.vertexShader}
          fragmentShader={NebulaShader.fragmentShader}
          uniforms={uniforms1}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Counterpart Nebula Cloud */}
      <mesh
        ref={mesh2Ref}
        position={[6, -2.5, -38]}
        rotation={[0, 0, Math.PI * 0.25]}
        scale={[75, 55, 1]}
      >
        <planeGeometry args={[1, 1, 16, 16]} />
        <shaderMaterial
          ref={mat2Ref}
          vertexShader={NebulaShader.vertexShader}
          fragmentShader={NebulaShader.fragmentShader}
          uniforms={uniforms2}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
