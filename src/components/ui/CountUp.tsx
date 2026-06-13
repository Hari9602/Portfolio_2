"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to a numeric target when scrolled into view.
 *  Preserves any non-numeric prefix/suffix (e.g. "Top 1%", "10+"). */
export default function CountUp({
  value,
  className,
  duration = 1400,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : 0;
  const [n, setN] = useState(match ? 0 : target);
  const ran = useRef(false);

  useEffect(() => {
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !ran.current) {
        ran.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, match]);

  const rendered = match ? value.replace(/\d+/, String(n)) : value;
  return (
    <span ref={ref} className={className}>
      {rendered}
    </span>
  );
}
