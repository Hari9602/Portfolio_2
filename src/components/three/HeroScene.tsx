"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* A network sphere: nodes on a fibonacci sphere + proximity edges.
   Reads like an attack-surface graph / threat map. */

function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius)
    );
  }
  return pts;
}

function NetworkSphere() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const { nodeGeo, edgeGeo, glowGeo } = useMemo(() => {
    const NODES = 140;
    const RADIUS = 2.4;
    const pts = fibonacciSphere(NODES, RADIUS);

    const nodePos = new Float32Array(NODES * 3);
    pts.forEach((p, i) => {
      nodePos[i * 3] = p.x;
      nodePos[i * 3 + 1] = p.y;
      nodePos[i * 3 + 2] = p.z;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));

    // edges between near neighbours
    const edges: number[] = [];
    const maxDist = RADIUS * 0.62;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          edges.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(edges), 3)
    );

    // a few bright "active" nodes
    const glow = pts.filter((_, i) => i % 11 === 0);
    const glowPos = new Float32Array(glow.length * 3);
    glow.forEach((p, i) => {
      glowPos[i * 3] = p.x;
      glowPos[i * 3 + 1] = p.y;
      glowPos[i * 3 + 2] = p.z;
    });
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));

    return { nodeGeo, edgeGeo, glowGeo };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    // gentle parallax toward pointer
    const tx = pointer.y * 0.25;
    const ty = pointer.x * 0.35;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.04;
    group.current.position.x += (ty * 0.4 - group.current.position.x) * 0.04;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          color="#4d7cff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points geometry={nodeGeo}>
        <pointsMaterial
          color="#9fb6ff"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={glowGeo}>
        <pointsMaterial
          color="#34e7ff"
          size={0.14}
          sizeAttenuation
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const N = 400;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.random() * 4;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.015;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#8b5cf6"
        size={0.03}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <NetworkSphere />
      <Particles />
    </Canvas>
  );
}
