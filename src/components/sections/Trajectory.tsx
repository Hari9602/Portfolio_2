"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;
// chronological left → right
const STEPS = [...timeline].reverse();
const STOPS = [0.1, 0.37, 0.63, 0.9];
const ARC = "M 0 250 C 220 40, 420 10, 560 70 S 860 230, 1000 120";

function Arc({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);
  const [lit, setLit] = useState(-1);
  const headX = useMotionValue(0);
  const headY = useMotionValue(250);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    setNodes(
      STOPS.map((t) => {
        const pt = p.getPointAtLength(L * t);
        return { x: pt.x, y: pt.y };
      })
    );
  }, []);

  useMotionValueEvent(progress, "change", (v) => {
    const p = pathRef.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * Math.min(Math.max(v, 0), 1));
    headX.set(pt.x);
    headY.set(pt.y);
    setLit(STOPS.filter((t) => v >= t - 0.02).length - 1);
  });

  return (
    <svg viewBox="0 0 1000 300" className="w-full h-auto overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="arcGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#ff2d2d" />
          <stop offset="0.6" stopColor="#ff6b2c" />
          <stop offset="1" stopColor="#ffb648" />
        </linearGradient>
        <filter id="arcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* rail */}
      <path ref={pathRef} d={ARC} fill="none" stroke="rgba(255,90,70,0.14)" strokeWidth="2" strokeDasharray="2 8" />
      {/* drawn trail */}
      <motion.path d={ARC} fill="none" stroke="url(#arcGrad)" strokeWidth="3" filter="url(#arcGlow)" style={{ pathLength: progress }} />
      {/* comet head */}
      <motion.circle r="18" fill="rgba(255,90,40,0.25)" style={{ cx: headX, cy: headY }} />
      <motion.circle r="7" fill="#ffe2c4" filter="url(#arcGlow)" style={{ cx: headX, cy: headY }} />

      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="11" fill="none" stroke={i <= lit ? "#ff2d2d" : "rgba(255,90,70,0.3)"} strokeWidth="1.5" style={{ transition: "stroke .5s" }} />
          <circle cx={n.x} cy={n.y} r="4.5" fill={i <= lit ? "#ff2d2d" : "rgba(255,90,70,0.35)"} filter={i <= lit ? "url(#arcGlow)" : undefined} style={{ transition: "fill .5s" }} />
          <text
            x={n.x}
            y={n.y - 26}
            textAnchor="middle"
            className="font-poster"
            style={{ fontSize: 30, fill: i <= lit ? "#f3ebe4" : "rgba(243,235,228,0.3)", transition: "fill .5s", letterSpacing: "0.02em" }}
          >
            {STEPS[i]?.period}
          </text>
        </g>
      ))}
    </svg>
  );
}

const FAN = [-16, -6, 6, 16];

export default function Trajectory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

  return (
    <section id="trajectory" className="section overflow-hidden">
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow="Trajectory"
          title="A deliberate climb."
          subtitle="From foundational network-security certs to a stacked year of offensive specialization — every step compounding toward depth."
        />

        <div ref={ref} className="relative mt-16">
          {/* desktop: arc + fanned cards */}
          <div className="hidden md:block">
            <Arc progress={scrollYProgress} />
            <div className="stage-3d -mt-4 grid grid-cols-4 gap-5">
              {STEPS.map((t, i) => (
                <motion.article
                  key={t.title}
                  initial={{ opacity: 0, y: 60, rotateX: 35, rotateY: FAN[i] }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 8, rotateY: FAN[i] }}
                  whileHover={{ rotateX: 0, rotateY: 0, y: -12, scale: 1.03 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1, ease, delay: i * 0.12 }}
                  data-cursor
                  className="relative rounded-md border border-[var(--line-strong)] bg-gradient-to-b from-[#170a09] to-black/90 p-6 shadow-[0_30px_60px_-30px_rgba(255,45,45,0.5)] preserve-3d"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--red)] to-transparent" />
                  <span className="font-mono text-[10.5px] tracking-[0.24em] text-[var(--red)]">{t.period}</span>
                  <h3 className="mt-3 font-serif text-[1.5rem] leading-tight">{t.title}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">{t.org}</p>
                  <p className="mt-4 text-[13.5px] text-[var(--ink)]/75 leading-relaxed">{t.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>

          {/* mobile: glowing rail */}
          <div className="md:hidden relative pl-8">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[var(--line-strong)]" />
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-[var(--red)] via-[var(--ember)] to-[var(--amber)] shadow-[0_0_10px_var(--red)]"
            />
            <div className="space-y-8">
              {STEPS.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.05}>
                  <div className="relative">
                    <span className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-[var(--red)] shadow-[0_0_14px_var(--red)]" />
                    <span className="font-poster text-3xl leading-none text-[var(--ink)]">{t.period}</span>
                    <h3 className="mt-2 font-serif text-2xl leading-tight">{t.title}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">{t.org}</p>
                    <p className="mt-3 text-[14px] text-[var(--ink)]/75 leading-relaxed">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
