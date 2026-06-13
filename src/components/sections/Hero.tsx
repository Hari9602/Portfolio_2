"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import CountUp from "@/components/ui/CountUp";
import { profile, stats } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block">
      {profile.roles.map((r, idx) => (
        <motion.span
          key={r}
          className="text-gradient-cyan"
          initial={false}
          animate={{
            opacity: i === idx ? 1 : 0,
            y: i === idx ? 0 : 14,
            filter: i === idx ? "blur(0px)" : "blur(8px)",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: i === idx ? "relative" : "absolute", left: 0, top: 0 }}
        >
          {r}
        </motion.span>
      ))}
    </span>
  );
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* backdrops */}
      <div className="aurora" />
      <div className="grid-bg" />

      {/* 3D scene */}
      <div className="absolute inset-0 md:left-auto md:right-0 md:w-[60%] opacity-90 pointer-events-none md:pointer-events-auto">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-transparent md:from-[var(--bg)] md:via-[var(--bg)]/20" />
      </div>

      <div className="container-x relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
            <span className="font-mono text-xs text-[var(--muted)] tracking-wide">
              Available for security roles
            </span>
          </motion.div>

          <h1 className="font-display font-semibold tracking-tight leading-[0.95] text-[clamp(2.7rem,8vw,5.6rem)]">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.4 }}
              className="block text-[var(--ink)]"
            >
              {profile.name.split(" ")[0]}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.5 }}
              className="block text-gradient"
            >
              {profile.name.split(" ").slice(1).join(" ")}
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.65 }}
            className="mt-6 font-display text-xl sm:text-2xl md:text-3xl font-medium h-[1.4em]"
          >
            <RotatingRole />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.8 }}
            className="mt-7 text-base sm:text-lg text-[var(--muted)] max-w-xl leading-relaxed"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.95 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a href="#projects" className="btn-primary" data-cursor>
                View Case Studies
                <ArrowUpRight size={18} />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="#contact" className="btn-ghost" data-cursor>
                Get in Touch
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1.1 }}
          className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden glass max-w-3xl"
        >
          {stats.map((s) => (
            <div key={s.label} className="p-5 sm:p-6 bg-white/[0.015]">
              <span style={{ color: `var(--${s.accent})` }}>
                <CountUp
                  value={s.value}
                  className="font-display text-2xl sm:text-3xl font-semibold block"
                />
              </span>
              <div className="mt-1 text-[12px] sm:text-[13px] text-[var(--muted)] leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
