"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Embers from "./cine/Embers";
import NeonRibbon from "./cine/NeonRibbon";
import { useCanvasActive } from "./cine/useCanvasActive";
import { ambientPointer, hasFinePointer } from "@/lib/ambientPointer";

/* Cinematic hero stage: a volumetric red spotlight falling on the operator,
   rising embers, and two light-trail ribbons sweeping behind the figure.
   The portrait itself is a DOM layer composited above this canvas. */

const coneVert = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalV;
varying vec3 vViewDir;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const coneFrag = /* glsl */ `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormalV;
varying vec3 vViewDir;
void main() {
  // brightest at the source (top), fading toward the floor
  float along = smoothstep(0.0, 1.0, vUv.y);
  // soft edges: facing-ratio falloff reads as a volumetric beam
  float facing = abs(dot(vNormalV, vViewDir));
  float body = pow(facing, 2.2);
  float dust = 0.85 + 0.15 * sin(vUv.y * 40.0 - uTime * 1.5 + vUv.x * 12.0);
  float a = body * along * 0.16 * dust;
  gl_FragColor = vec4(vec3(1.0, 0.22, 0.12) * 1.4, a);
}
`;

function SpotCone() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, d) => {
    if (mat.current) mat.current.uniforms.uTime.value += d;
  });
  return (
    <mesh position={[0, 1.6, -2.2]}>
      <coneGeometry args={[3.4, 8, 64, 1, true]} />
      <shaderMaterial
        ref={mat}
        vertexShader={coneVert}
        fragmentShader={coneFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// sweeping S-curve behind the figure + a tilted orbit loop
const SWEEP: [number, number, number][] = [
  [-8, -3.2, -2],
  [-4.5, -0.6, -0.5],
  [-1.6, 1.6, -2.6],
  [1.2, 0.2, -3],
  [3.6, -1.8, -1],
  [6, -0.2, -2.2],
  [9, 1.8, -3],
];

const LOOP: [number, number, number][] = Array.from({ length: 14 }, (_, i) => {
  const t = (i / 14) * Math.PI * 2;
  return [Math.cos(t) * 3.4, Math.sin(t) * 0.7 - 0.6 + Math.cos(t) * 0.5, Math.sin(t) * 1.6 - 1.8];
});

function Rig({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const { x, y } = hasFinePointer() ? state.pointer : ambientPointer(state.clock.elapsedTime);
    g.current.rotation.y += (x * 0.18 - g.current.rotation.y) * 0.04;
    g.current.rotation.x += (-y * 0.08 - g.current.rotation.x) * 0.04;
  });
  return <group ref={g}>{children}</group>;
}

export default function HeroScene({ mobile = false }: { mobile?: boolean }) {
  const { ref, frameloop } = useCanvasActive<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Rig>
          <SpotCone />
          <NeonRibbon points={SWEEP} speed={0.09} thickness={0.026} />
          <NeonRibbon points={LOOP} closed speed={0.14} offset={0.5} thickness={0.016} color="#ff5a1f" />
          <Embers count={mobile ? 260 : 620} />
        </Rig>
      </Canvas>
    </div>
  );
}
