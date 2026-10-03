"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Billboard, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Embers from "./cine/Embers";
import NeonRibbon from "./cine/NeonRibbon";
import { useCanvasActive } from "./cine/useCanvasActive";
import { ambientPointer, hasFinePointer } from "@/lib/ambientPointer";

/* mouse on desktop; tilt + ambient drift on touch */
function scenePointer(state: { pointer: THREE.Vector2; clock: THREE.Clock }) {
  return hasFinePointer() ? state.pointer : ambientPointer(state.clock.elapsedTime);
}

/* "The arsenal" — the operator as a back-lit silhouette, ringed by orbiting
   dark-glass tool cubes and light trails. Tool names come from the page. */

/* ---------- silhouette (two passes: depth-writing body, soft halo) ---------- */

const silVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const silFrag = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uTime;
uniform float uMode;
varying vec2 vUv;
float aAt(vec2 o) { return texture2D(uTex, vUv + o).a; }
void main() {
  vec4 c = texture2D(uTex, vUv);
  float a = c.a;
  float nearA = 0.0;
  float farA = 0.0;
  for (int i = 0; i < 12; i++) {
    float ang = float(i) / 12.0 * 6.2831853;
    vec2 dir = vec2(cos(ang), sin(ang));
    nearA += aAt(dir * uTexel * 5.0);
    farA += aAt(dir * uTexel * 22.0);
  }
  nearA /= 12.0;
  farA /= 12.0;
  float feet = smoothstep(0.0, 0.2, vUv.y);
  float flick = 0.93 + 0.07 * sin(uTime * 7.0) * sin(uTime * 3.1);

  if (uMode < 0.5) {
    if (a < 0.5) discard;
    float rim = clamp(a * (1.0 - nearA) * 3.0, 0.0, 1.0);
    vec3 body = c.rgb * 0.2 + vec3(0.04, 0.0, 0.0);
    vec3 col = body + vec3(1.0, 0.3, 0.14) * rim * 2.2;
    gl_FragColor = vec4(col * flick * feet + body * (1.0 - feet) * 0.3, 1.0);
  } else {
    if (a > 0.5) discard;
    float halo = farA * (1.0 - a);
    gl_FragColor = vec4(vec3(1.0, 0.16, 0.08) * flick, halo * 0.7 * feet);
  }
}
`;

function silUniforms(tex: THREE.Texture, mode: number) {
  return {
    uTex: { value: tex },
    uTexel: { value: new THREE.Vector2(1 / 420, 1 / 850) },
    uTime: { value: 0 },
    uMode: { value: mode },
  };
}

function Silhouette() {
  const tex = useLoader(THREE.TextureLoader, "/profile-hero.png");
  const h = 4.3;
  const w = h * (420 / 850);
  const body = useMemo(() => silUniforms(tex, 0), [tex]);
  const halo = useMemo(() => silUniforms(tex, 1), [tex]);
  const bodyMat = useRef<THREE.ShaderMaterial>(null);
  const haloMat = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, d) => {
    if (bodyMat.current) bodyMat.current.uniforms.uTime.value += d;
    if (haloMat.current) haloMat.current.uniforms.uTime.value += d;
  });

  return (
    <group position={[0, -0.25, 0]}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <shaderMaterial ref={bodyMat} vertexShader={silVert} fragmentShader={silFrag} uniforms={body} />
      </mesh>
      <mesh position={[0, 0, -0.01]} scale={1.04}>
        <planeGeometry args={[w, h]} />
        <shaderMaterial
          ref={haloMat}
          vertexShader={silVert}
          fragmentShader={silFrag}
          uniforms={halo}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ---------- floor glow ---------- */

function FloorGlow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    if (g) {
      const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(255,60,30,0.85)");
      grad.addColorStop(0.35, "rgba(255,30,20,0.25)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.45, 0]}>
      <circleGeometry args={[4.2, 48]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ---------- tool cubes ---------- */

function splitLabel(text: string) {
  const words = text.split(" ");
  if (words.length < 2 || text.length <= 9) return [text];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function makeLabel(text: string, index: number, font: string) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  if (g) {
    const bg = g.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0, "#241010");
    bg.addColorStop(1, "#0b0505");
    g.fillStyle = bg;
    g.fillRect(0, 0, S, S);
    g.strokeStyle = "rgba(255,70,50,0.55)";
    g.lineWidth = 6;
    g.strokeRect(18, 18, S - 36, S - 36);
    g.fillStyle = "#ff2d2d";
    g.font = `600 40px ${font}`;
    g.fillText(String(index + 1).padStart(2, "0"), 50, 92);
    g.fillRect(50, S - 80, 90, 8);

    g.fillStyle = "#f3ebe4";
    g.textAlign = "center";
    g.textBaseline = "middle";
    const lines = splitLabel(text);
    const size = Math.min(92, Math.floor(820 / Math.max(...lines.map((l) => l.length + 2))));
    g.font = `700 ${size}px ${font}`;
    lines.forEach((l, i) => g.fillText(l, S / 2, S / 2 + (i - (lines.length - 1) / 2) * size * 1.08));
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

type CubeSpec = { name: string; index: number; radius: number; angle: number; y: number; size: number };

function ToolCube({ spec, font }: { spec: CubeSpec; font: string }) {
  const g = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const label = useMemo(() => makeLabel(spec.name, spec.index, font), [spec.name, spec.index, font]);
  const seed = spec.index * 1.7;

  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.position.y = Math.sin(t * 0.8 + seed) * 0.12;
    const target = hovered.current ? 1.3 : 1;
    g.current.scale.setScalar(g.current.scale.x + (target - g.current.scale.x) * 0.12);
    g.current.rotation.z = Math.sin(t * 0.5 + seed) * 0.08;
  });

  return (
    <group position={[Math.cos(spec.angle) * spec.radius, spec.y, Math.sin(spec.angle) * spec.radius]}>
      <Billboard>
        <group
          ref={g}
          onPointerOver={(e) => {
            e.stopPropagation();
            hovered.current = true;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hovered.current = false;
            document.body.style.cursor = "";
          }}
          // touch: a tap pops the cube for a beat, same feedback as hover
          onPointerDown={(e) => {
            if (e.pointerType === "mouse") return;
            hovered.current = true;
            window.setTimeout(() => (hovered.current = false), 1400);
          }}
        >
          <RoundedBox args={[spec.size, spec.size, spec.size]} radius={0.07} smoothness={4}>
            <meshPhysicalMaterial
              color="#160909"
              metalness={0.55}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.15}
              emissive="#3a0606"
              emissiveIntensity={0.35}
            />
          </RoundedBox>
          <mesh position={[0, 0, spec.size / 2 + 0.002]}>
            <planeGeometry args={[spec.size * 0.86, spec.size * 0.86]} />
            <meshBasicMaterial map={label} toneMapped={false} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

function Orbit({ tools }: { tools: string[] }) {
  const ring = useRef<THREE.Group>(null);
  const font = useMemo(() => getComputedStyle(document.body).fontFamily || "sans-serif", []);

  const specs = useMemo<CubeSpec[]>(() => {
    const half = Math.ceil(tools.length / 2);
    return tools.map((name, i) => {
      const inner = i < half;
      const k = inner ? i : i - half;
      const n = inner ? half : tools.length - half;
      return {
        name,
        index: i,
        radius: inner ? 2.75 : 4.05,
        angle: (k / n) * Math.PI * 2 + (inner ? 0 : 0.4),
        y: inner ? Math.sin(k * 1.9) * 1.3 + 0.2 : Math.cos(k * 1.3) * 1.7,
        size: inner ? 0.62 : 0.7,
      };
    });
  }, [tools]);

  useFrame((state, d) => {
    if (!ring.current) return;
    ring.current.rotation.y += d * 0.12;
    ring.current.rotation.x += (scenePointer(state).y * 0.12 + 0.08 - ring.current.rotation.x) * 0.03;
  });

  return (
    <group ref={ring}>
      {specs.map((s) => (
        <ToolCube key={s.name} spec={s} font={font} />
      ))}
    </group>
  );
}

function CameraRig() {
  const narrow = useThree((s) => s.size.width < 700);
  useFrame((state) => {
    const { camera } = state;
    const z = narrow ? 12.5 : 9.2;
    const p = scenePointer(state);
    camera.position.x += (p.x * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (0.4 + p.y * 0.5 - camera.position.y) * 0.04;
    camera.position.z += (z - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const ORBIT_TRAIL: [number, number, number][] = Array.from({ length: 16 }, (_, i) => {
  const t = (i / 16) * Math.PI * 2;
  return [Math.cos(t) * 3.4, Math.sin(t * 2) * 0.35 - 0.2, Math.sin(t) * 3.4];
});

const SWOOP: [number, number, number][] = [
  [-7, -2.6, -3],
  [-3.5, 1.8, -1.5],
  [0, 2.6, -3.2],
  [3.2, 0.4, -1],
  [7, 2.2, -3],
];

export default function ArsenalUniverse({ tools }: { tools: string[] }) {
  const { ref, frameloop } = useCanvasActive<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0.4, 9.2], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 2, -2.5]} intensity={60} color="#ff2a1a" distance={14} />
        <pointLight position={[-4, 3, 5]} intensity={36} color="#ff7a3a" distance={18} />
        <pointLight position={[4, -1, 4]} intensity={18} color="#ffd2b0" distance={14} />
        <CameraRig />
        <Suspense fallback={null}>
          <Silhouette />
        </Suspense>
        <FloorGlow />
        <Orbit tools={tools} />
        <NeonRibbon points={ORBIT_TRAIL} closed speed={0.1} thickness={0.018} />
        <NeonRibbon points={SWOOP} speed={0.07} offset={0.3} thickness={0.024} color="#ff5a1f" />
        <Embers count={320} spread={[14, 8, 8]} intensity={0.85} />
      </Canvas>
    </div>
  );
}
