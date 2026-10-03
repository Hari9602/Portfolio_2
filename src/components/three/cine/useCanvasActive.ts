"use client";

import { useEffect, useRef, useState } from "react";

/** Pauses an R3F render loop while its container is off-screen, so several
 *  WebGL scenes on one page never burn GPU at the same time. */
export function useCanvasActive<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setActive(entries[0].isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, frameloop: active ? ("always" as const) : ("never" as const) };
}
