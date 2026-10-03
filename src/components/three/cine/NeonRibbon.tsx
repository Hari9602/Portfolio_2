"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* A glowing light-trail ribbon: a tube along a spline with a bright
   comet head racing along it and an exponential afterglow trail.
   Rendered twice — a thin hot core and a wide soft halo. */

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const frag = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uOffset;
uniform float uBase;
uniform float uGain;
uniform vec3 uColor;
uniform vec3 uHot;
varying vec2 vUv;
void main() {
  float head = fract(uTime * uSpeed + uOffset);
  float behind = fract(head - vUv.x);          // 0 at head, grows backwards
  float trail = exp(-behind * 3.2);
  float spark = exp(-behind * 60.0);
  vec3 col = mix(uColor, uHot, spark);
  float a = (uBase + trail * 0.9 + spark) * uGain;
  // soften the tube silhouette around its circumference
  a *= 0.55 + 0.45 * sin(vUv.y * 3.14159);
  gl_FragColor = vec4(col * (1.0 + trail * 1.5), a);
}
`;

type TubeProps = {
  curve: THREE.Curve<THREE.Vector3>;
  radius: number;
  gain: number;
  base: number;
  speed: number;
  offset: number;
  color: string;
  hot: string;
};

function Tube({ curve, radius, gain, base, speed, offset, color, hot }: TubeProps) {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 320, radius, 10, false), [curve, radius]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uOffset: { value: offset },
      uBase: { value: base },
      uGain: { value: gain },
      uColor: { value: new THREE.Color(color) },
      uHot: { value: new THREE.Color(hot) },
    }),
    [speed, offset, base, gain, color, hot]
  );

  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (mat.current) mat.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh geometry={geo}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function NeonRibbon({
  points,
  closed = false,
  speed = 0.12,
  offset = 0,
  thickness = 0.022,
  color = "#ff3a1c",
  hot = "#ffd9b0",
}: {
  points: [number, number, number][];
  closed?: boolean;
  speed?: number;
  offset?: number;
  thickness?: number;
  color?: string;
  hot?: string;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p)),
        closed,
        "catmullrom",
        0.5
      ),
    [points, closed]
  );

  return (
    <group>
      <Tube curve={curve} radius={thickness} gain={1} base={0.18} speed={speed} offset={offset} color={color} hot={hot} />
      <Tube curve={curve} radius={thickness * 7} gain={0.18} base={0.08} speed={speed} offset={offset} color={color} hot={color} />
    </group>
  );
}
