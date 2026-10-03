"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* deterministic PRNG keeps geometry generation pure */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Rising ember / spark field. GPU-animated: CPU only advances uTime. */

const vert = /* glsl */ `
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform float uHeight;
uniform float uPixelRatio;
varying float vSeed;
varying float vLife;
void main() {
  vec3 p = position;
  float speed = 0.18 + aSeed * 0.55;
  float y = mod(p.y + uTime * speed + aSeed * 23.0, uHeight) - uHeight * 0.5;
  p.y = y;
  p.x += sin(uTime * 0.55 + aSeed * 12.0) * 0.35 * (0.4 + aSeed);
  p.z += cos(uTime * 0.37 + aSeed * 7.0) * 0.25;
  vLife = (y + uHeight * 0.5) / uHeight;
  vSeed = aSeed;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (18.0 / -mv.z);
}
`;

const frag = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying float vSeed;
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.6);
  float flicker = 0.6 + 0.4 * sin(uTime * (3.0 + vSeed * 6.0) + vSeed * 40.0);
  vec3 hot = vec3(1.0, 0.78, 0.42);
  vec3 red = vec3(1.0, 0.14, 0.08);
  vec3 col = mix(hot, red, smoothstep(0.0, 0.75, vLife + vSeed * 0.35));
  float fade = smoothstep(0.0, 0.12, vLife) * (1.0 - smoothstep(0.68, 1.0, vLife));
  gl_FragColor = vec4(col, a * flicker * fade * uIntensity);
}
`;

const DEFAULT_SPREAD: [number, number, number] = [18, 10, 7];

export default function Embers({
  count = 700,
  spread = DEFAULT_SPREAD,
  intensity = 1,
}: {
  count?: number;
  spread?: [number, number, number];
  intensity?: number;
}) {
  const dpr = useThree((s) => s.viewport.dpr);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geo = useMemo(() => {
    const rand = mulberry32(count * 7919 + spread[0] * 31);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * spread[0];
      pos[i * 3 + 1] = (rand() - 0.5) * spread[1];
      pos[i * 3 + 2] = (rand() - 0.5) * spread[2] - 1;
      seed[i] = rand();
      // mostly fine sparks, a few large soft bokeh embers
      size[i] = rand() < 0.8 ? 1 + rand() * 1.8 : 3.5 + rand() * 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count, spread]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeight: { value: spread[1] },
      uPixelRatio: { value: 1 },
      uIntensity: { value: intensity },
    }),
    [spread, intensity]
  );

  useFrame((_, delta) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uPixelRatio.value = dpr;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
