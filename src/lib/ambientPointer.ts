/* Pointer stand-in for touch devices. Desktop parallax and 3D camera rigs
   follow the mouse; phones have no hover, so they follow device tilt where
   the browser exposes it without a permission prompt, blended with a slow
   ambient drift so every scene stays alive hands-free. */

export type Vec2 = { x: number; y: number };

const tilt: Vec2 = { x: 0, y: 0 };
let listening = false;
let finePointer: boolean | null = null;

export function hasFinePointer() {
  if (finePointer === null) {
    finePointer =
      typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }
  return finePointer;
}

function listenTilt() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener(
    "deviceorientation",
    (e) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: left/right (-90..90), beta: front/back — centred on a ~45° hold
      tilt.x = Math.max(-1, Math.min(1, e.gamma / 35));
      tilt.y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
    },
    { passive: true }
  );
}

/** Normalised (-1..1) pointer for time t (seconds) on touch devices. */
export function ambientPointer(t: number): Vec2 {
  listenTilt();
  return {
    x: Math.sin(t * 0.35) * 0.55 + tilt.x * 0.6,
    y: Math.cos(t * 0.27) * 0.3 - tilt.y * 0.4,
  };
}
