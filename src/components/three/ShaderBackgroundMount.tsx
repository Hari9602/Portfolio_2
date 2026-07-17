"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), {
  ssr: false,
});

export default function ShaderBackgroundMount() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // skip heavy shader on reduced-motion or tiny/no-webgl devices
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (gl) setOn(true);
    } catch {
      /* no webgl -> keep static bg */
    }
  }, []);

  if (!on) return null;
  return <ShaderBackground />;
}
