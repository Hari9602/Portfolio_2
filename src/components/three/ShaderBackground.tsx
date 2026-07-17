"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Fullscreen animated fluid-gradient shader. Dark, mouse-reactive.
   Deep void -> violet -> cyan filaments flowing via FBM noise. */

const frag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

// hash + value noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 asp = vec2(uRes.x/uRes.y, 1.0);
  vec2 p = (uv-0.5)*asp;

  float t = uTime*0.05;
  vec2 m = (uMouse-0.5)*asp;

  // flowing domain-warped noise
  vec2 q = vec2(fbm(p*1.5 + t), fbm(p*1.5 - t + 4.0));
  float f = fbm(p*2.0 + q*1.6 + vec2(t*0.7, -t*0.5));

  // mouse ripple
  float md = length(p - m);
  f += 0.18*exp(-md*3.0)*sin(md*10.0 - uTime*1.5);

  // palette: void -> deep blue -> violet -> cyan filaments
  vec3 void_ = vec3(0.015, 0.024, 0.059);
  vec3 blue  = vec3(0.055, 0.11, 0.30);
  vec3 viol  = vec3(0.31, 0.18, 0.55);
  vec3 cyan  = vec3(0.20, 0.83, 1.0);

  vec3 col = void_;
  col = mix(col, blue, smoothstep(0.25,0.65,f));
  col = mix(col, viol, smoothstep(0.55,0.85,f)*0.7);
  // thin cyan filaments on ridges
  float ridge = smoothstep(0.72,0.80,f) * (1.0-smoothstep(0.80,0.9,f));
  col += cyan*ridge*0.6;

  // vignette + keep it dark for legibility
  float vig = smoothstep(1.2,0.2,length((uv-0.5)*asp));
  col *= 0.35 + 0.65*vig;
  col *= 0.9;

  gl_FragColor = vec4(col, 1.0);
}
`;

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function Plane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    const el = state.gl.domElement;
    // pointer normalized 0..1 (y flipped)
    target.current.set(
      (state.pointer.x + 1) / 2,
      (state.pointer.y + 1) / 2
    );
    mouse.current.lerp(target.current, 0.05);
    uniforms.uTime.value += delta;
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uRes.value.set(el.width, el.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        fragmentShader={frag}
        vertexShader={vert}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1] }}
        frameloop="always"
      >
        <Plane />
      </Canvas>
    </div>
  );
}
