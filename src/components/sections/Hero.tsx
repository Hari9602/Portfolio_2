"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import CountUp from "@/components/ui/CountUp";
import { profile, stats } from "@/lib/data";
import { ambientPointer, hasFinePointer } from "@/lib/ambientPointer";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;
const FIRST = profile.name.split(" ")[0];
const REST = profile.name.split(" ").slice(1).join(" ");

/* waits for the boot preloader so the cinematic intro is actually seen */
function useBootReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const on = () => setReady(true);
    if (document.documentElement.dataset.boot === "done") {
      const raf = requestAnimationFrame(on);
      return () => cancelAnimationFrame(raf);
    }
    window.addEventListener("boot:done", on);
    const fallback = window.setTimeout(on, 3200);
    return () => {
      window.removeEventListener("boot:done", on);
      clearTimeout(fallback);
    };
  }, []);
  return ready;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setM(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return m;
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block">
      {profile.roles.map((r, idx) => (
        <motion.span
          key={r}
          className="whitespace-nowrap"
          initial={false}
          animate={{
            opacity: i === idx ? 1 : 0,
            y: i === idx ? 0 : 16,
            filter: i === idx ? "blur(0px)" : "blur(10px)",
          }}
          transition={{ duration: 0.7, ease }}
          style={{ position: i === idx ? "relative" : "absolute", left: 0, top: 0 }}
        >
          {r}
        </motion.span>
      ))}
    </span>
  );
}

function useTimecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const ms = performance.now() - start;
      const f = Math.floor((ms / 1000) * 24) % 24;
      const s = Math.floor(ms / 1000);
      const p = (n: number) => String(n).padStart(2, "0");
      setTc(`${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(f)}`);
    }, 1000 / 12);
    return () => clearInterval(id);
  }, []);
  return tc;
}

const letter: Variants = {
  hidden: { y: "105%", rotateX: -70, opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: { duration: 1.1, ease, delay: 0.25 + i * 0.055 },
  }),
};

function PosterName({ ready, variant }: { ready: boolean; variant: "fill" | "stroke" }) {
  const cls = variant === "fill" ? "ember-fill" : "stroke-text";
  return (
    <span
      aria-hidden={variant === "stroke"}
      className="relative inline-flex font-poster leading-[0.8] text-[clamp(4rem,17.8vw,19rem)] [perspective:900px]"
    >
      {FIRST.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
          <motion.span
            custom={i}
            variants={letter}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
            className={`inline-block origin-bottom ${cls}`}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ready = useBootReady();
  const mobile = useIsMobile();
  const tc = useTimecode();
  const ref = useRef<HTMLElement>(null);

  // scroll-driven depth: name pushes toward camera, portrait sinks, scene darkens
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 1.32]);
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const figY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const figScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
  const infoY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const infoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // pointer parallax (opposing layers = depth)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const nameX = useTransform(sx, (v) => v * 22);
  const figX = useTransform(sx, (v) => v * -14);
  const figRot = useTransform(sx, (v) => v * -2.2);
  const nameShiftY = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    // touch devices: same layered parallax, driven by tilt + ambient drift
    if (!hasFinePointer()) {
      let raf = 0;
      const t0 = performance.now();
      const loop = () => {
        const p = ambientPointer((performance.now() - t0) / 1000);
        mx.set(p.x * 0.5);
        my.set(p.y * 0.5);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const nameLayer = "absolute inset-x-0 top-[25%] sm:top-[13%] flex justify-center";

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* stage glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_70%,rgba(255,40,25,0.28),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_45%_60%_at_50%_100%,rgba(255,70,30,0.22),transparent_70%)]" />

      {/* WebGL: spotlight cone, light ribbons, embers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="absolute inset-0"
      >
        <HeroScene mobile={mobile} />
      </motion.div>

      {/* kicker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease, delay: 0.1 }}
        className="absolute inset-x-0 top-[19.5%] sm:top-[9.5%] z-10 flex justify-center"
      >
        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.42em] whitespace-nowrap uppercase text-[var(--muted)] flex items-center gap-3">
          <span className="text-[var(--red)]">• • •</span>
          Available for security roles
          <span className="text-[var(--red)]">• • •</span>
        </span>
      </motion.div>

      {/* BACK layer: filled poster name */}
      <motion.div
        style={{ scale: nameScale, y: nameY, opacity: nameOpacity, x: nameX }}
        className={`${nameLayer} z-10`}
      >
        <motion.div style={{ y: nameShiftY }} className="relative">
          <h1 aria-label={profile.name}>
            <PosterName ready={ready} variant="fill" />
          </h1>
          {/* chromatic ghost flicker */}
          <span
            aria-hidden
            className="chroma-ghost absolute inset-0 font-poster leading-[0.8] text-[clamp(4rem,17.8vw,19rem)] text-[rgba(0,220,255,0.35)] mix-blend-screen pointer-events-none"
          >
            {FIRST}
          </span>
          {/* surname tag */}
          <motion.span
            initial={{ opacity: 0, scale: 0.6, rotate: -14 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: -6 } : {}}
            transition={{ duration: 0.8, ease, delay: 1.1 }}
            className="absolute -top-1 sm:top-2 right-[2%] sm:right-[1%] font-mono text-[10px] sm:text-sm tracking-[0.3em] px-2 sm:px-3 py-1 border border-[var(--red)] text-[var(--red)] bg-[var(--red)]/10 backdrop-blur-sm"
          >
            &lt;{REST}&gt;
          </motion.span>
        </motion.div>
      </motion.div>

      {/* MID layer: the operator */}
      <motion.div
        style={{ y: figY, scale: figScale, x: figX, rotate: figRot }}
        className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 h-[64svh] sm:h-[84svh] aspect-[420/850] origin-bottom pointer-events-none"
      >
        <div
          className="relative h-full w-full"
          style={{
            maskImage: "linear-gradient(to bottom, #000 70%, transparent 99%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 99%)",
            animation: ready ? "light-on 1.8s ease-out 0.5s both" : undefined,
            opacity: ready ? undefined : 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile-hero.png"
            alt={`${profile.name} portrait`}
            className="h-full w-full object-contain object-bottom"
            style={{
              filter:
                "contrast(1.1) saturate(0.9) brightness(0.92) drop-shadow(0 0 1.5px rgba(255,90,60,0.8)) drop-shadow(0 0 38px rgba(255,30,20,0.4))",
            }}
          />
          {/* red rim light from stage-right, masked to the figure */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "linear-gradient(to left, rgba(255,50,30,0.55), transparent 42%), linear-gradient(to top, rgba(255,60,20,0.35), transparent 30%)",
              maskImage: "url(/profile-hero.png)",
              WebkitMaskImage: "url(/profile-hero.png)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "bottom",
              WebkitMaskPosition: "bottom",
            }}
          />
        </div>
      </motion.div>

      {/* FRONT layer: stroked echo of the name over the figure */}
      <motion.div
        style={{ scale: nameScale, y: nameY, opacity: nameOpacity, x: nameX }}
        className={`${nameLayer} z-30 pointer-events-none opacity-60`}
      >
        <motion.div style={{ y: nameShiftY }}>
          <PosterName ready={ready} variant="stroke" />
        </motion.div>
      </motion.div>

      {/* scroll shade */}
      <motion.div style={{ opacity: shade }} className="absolute inset-0 z-30 bg-[var(--bg)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-30 h-[42%] bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/70 to-transparent pointer-events-none" />

      {/* viewfinder HUD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.3 }}
        className="absolute inset-3 sm:inset-6 z-40 pointer-events-none"
      >
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
          <span key={c} className={`absolute h-5 w-5 sm:h-7 sm:w-7 border-[var(--red)]/70 ${c}`} />
        ))}
        <div className="absolute top-16 sm:top-20 left-1 sm:left-2 flex items-center gap-2 font-mono text-[10px] text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--red)] rec-dot shadow-[0_0_10px_var(--red)]" />
          <span className="tabular-nums">{tc}</span>
        </div>
        <div className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 flex-col gap-4 text-[var(--red)]/70">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[10px]" style={{ opacity: 1 - i * 0.16 }}>
              ▶
            </span>
          ))}
        </div>
        <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 flex-col items-end gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-px bg-[var(--red)]/60" style={{ width: i === 4 ? 22 : 10 }} />
          ))}
        </div>
      </motion.div>

      {/* info overlay */}
      <motion.div
        style={{ y: infoY, opacity: infoOpacity }}
        className="absolute inset-x-0 bottom-5 sm:bottom-9 z-40"
      >
        <div className="container-x grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
          {/* left: role + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 1.2 }}
            className="max-w-md"
          >
            <div className="font-serif italic text-[1.6rem] sm:text-[2.1rem] leading-none text-[var(--ink)] h-[1.15em]">
              <RotatingRole />
            </div>
            <p className="mt-3 text-[12.5px] sm:text-[13.5px] text-[var(--muted)] leading-relaxed max-w-sm">
              {profile.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#projects" className="btn-primary" data-cursor>
                  View Case Studies
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a href="#contact" className="btn-ghost" data-cursor>
                  Get in Touch
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <div className="hidden md:block w-[22vw]" />

          {/* right: stats ledger */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 1.35 }}
            className="grid grid-cols-4 md:grid-cols-2 gap-x-4 gap-y-3 md:gap-x-8 md:gap-y-5 md:justify-self-end"
          >
            {stats.map((s) => (
              <div key={s.label} className="min-w-0 md:border-l md:border-[var(--red)]/40 md:pl-3">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp
                    value={s.value}
                    className="font-poster text-[1.35rem] sm:text-[2.2rem] leading-none text-[var(--red)] block"
                  />
                  <span className="mt-1 block font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] leading-tight">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}
