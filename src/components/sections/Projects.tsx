"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Workflow, ScanSearch, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/data";

const quadrants = [
  { key: "challenge", label: "Challenge", icon: Target },
  { key: "methodology", label: "Methodology", icon: Workflow },
  { key: "findings", label: "Findings", icon: ScanSearch },
  { key: "impact", label: "Impact", icon: TrendingUp },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- deterministic generative key-art per case ---------- */

function ArtScanner() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="sweep" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,45,45,0.45)" />
          <stop offset="1" stopColor="rgba(255,45,45,0)" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160, 200].map((r) => (
        <circle key={r} cx="260" cy="150" r={r} fill="none" stroke="rgba(255,60,45,0.28)" strokeWidth="1" />
      ))}
      <line x1="260" y1="0" x2="260" y2="400" stroke="rgba(255,60,45,0.25)" />
      <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,60,45,0.25)" />
      <g style={{ transformOrigin: "260px 150px" }} className="radar-sweep">
        <path d="M260 150 L460 150 A200 200 0 0 0 401 9 Z" fill="url(#sweep)" />
      </g>
      {[[300, 90], [210, 200], [330, 230], [180, 110]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#ff2d2d" className="radar-blip" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
    </svg>
  );
}

function ArtPackets() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      {Array.from({ length: 9 }, (_, i) => {
        const pts = Array.from({ length: 41 }, (_, k) => {
          const y = 60 + i * 34 + Math.sin(k * 0.55 + i * 1.3) * (6 + ((i * 7) % 5) * 4) + (k % 7 === i % 7 ? -18 : 0);
          return `${k * 10},${y.toFixed(1)}`;
        }).join(" ");
        return (
          <polyline
            key={i}
            points={pts}
            fill="none"
            stroke={i === 4 ? "#ff6b2c" : "rgba(255,60,45,0.35)"}
            strokeWidth={i === 4 ? 2 : 1}
          />
        );
      })}
    </svg>
  );
}

function ArtDecode() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
      {Array.from({ length: 256 }, (_, i) => {
        const v = ((i * 37) % 11) / 11;
        return (
          <rect
            key={i}
            x={(i % 16) * 25 + 4}
            y={Math.floor(i / 16) * 25 + 4}
            width="17"
            height="17"
            fill={v > 0.82 ? "#ff2d2d" : `rgba(255,70,55,${(v * 0.22).toFixed(3)})`}
          />
        );
      })}
    </svg>
  );
}

const ARTS = [ArtScanner, ArtPackets, ArtDecode];

/* ---------- carousel card ---------- */

function PosterCard({ p, idx, offset, onSelect }: { p: Project; idx: number; offset: number; onSelect: () => void }) {
  const Art = ARTS[idx % ARTS.length];
  const abs = Math.abs(offset);
  const active = offset === 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      data-cursor
      aria-label={`${p.name} — ${p.type}`}
      aria-pressed={active}
      animate={{
        x: `${offset * 68}%`,
        rotateY: offset * -34,
        z: -abs * 240,
        scale: active ? 1 : 0.86,
        opacity: abs > 1 ? 0.25 : active ? 1 : 0.62,
        filter: active ? "brightness(1) blur(0px)" : "brightness(0.55) blur(1.5px)",
      }}
      transition={{ duration: 0.9, ease }}
      style={{ zIndex: 10 - abs, WebkitBoxReflect: "below 10px linear-gradient(transparent 72%, rgba(0,0,0,0.28))" } as React.CSSProperties}
      className="absolute left-1/2 top-0 -ml-[min(42vw,210px)] w-[min(84vw,420px)] h-[min(64vh,540px)] text-left preserve-3d"
    >
      <div className="relative h-full w-full overflow-hidden rounded-md border border-[var(--line-strong)] bg-[#0c0606]">
        <div className="absolute inset-0 opacity-90">
          <Art />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,45,45,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute top-5 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
          <span>
            Case <span className="text-[var(--red)]">0{idx + 1}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)] rec-dot" /> {p.stack[0]}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 border border-[var(--red)]/50 text-[var(--red)] bg-black/60">
            {p.type}
          </span>
          <h3 className="mt-4 font-poster text-[clamp(2.6rem,9vw,4.2rem)] leading-[0.85] ember-fill">{p.name}</h3>
          <p className="mt-3 text-[13.5px] text-[var(--ink)]/75 leading-relaxed line-clamp-3">{p.summary}</p>
        </div>

        {active && (
          <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-[var(--red)] shadow-[0_0_60px_-10px_rgba(255,45,45,0.7)]" />
        )}
      </div>
    </motion.button>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const n = projects.length;
  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.getElementById("projects");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.5 || r.bottom < window.innerHeight * 0.5) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // shortest signed distance around the ring
  const offsetOf = (i: number) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  };

  const p = projects[active];

  return (
    <section id="projects" className="section overflow-hidden">
      <div className="aurora opacity-40" />
      <div className="container-x relative">
        <SectionHeading
          index="04"
          eyebrow="Field Work"
          title="Engagements, decoded."
          subtitle="Tooling and CTF work presented the way real assessments are reported — challenge, methodology, findings, and measurable impact."
        />
      </div>

      {/* curved cinema wall */}
      <Reveal className="relative mt-14">
        <motion.div
          className="relative stage-3d h-[min(64vh,540px)] mb-[min(18vh,140px)] touch-pan-y"
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) go(1);
            else if (info.offset.x > 50) go(-1);
          }}
        >
          <div className="absolute inset-0 preserve-3d">
            {projects.map((proj, i) => (
              <PosterCard key={proj.id} p={proj} idx={i} offset={offsetOf(i)} onSelect={() => setActive(i)} />
            ))}
          </div>
          {/* stage floor light */}
          <div className="pointer-events-none absolute left-1/2 -bottom-24 h-40 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,45,45,0.3),transparent_70%)] blur-xl" />
        </motion.div>

        <div className="container-x flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous case" className="grid h-12 w-12 place-items-center border border-[var(--line-strong)] hover:border-[var(--red)] hover:bg-[var(--red)]/10 transition-colors" data-cursor>
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {projects.map((proj, i) => (
              <button
                key={proj.id}
                onClick={() => setActive(i)}
                aria-label={proj.name}
                className={`h-[3px] transition-all duration-500 ${i === active ? "w-10 bg-[var(--red)] shadow-[0_0_10px_var(--red)]" : "w-5 bg-white/20"}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next case" className="grid h-12 w-12 place-items-center border border-[var(--line-strong)] hover:border-[var(--red)] hover:bg-[var(--red)]/10 transition-colors" data-cursor>
            <ChevronRight size={18} />
          </button>
        </div>
      </Reveal>

      {/* dossier for the active case */}
      <div className="container-x mt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease }}
            className="relative rounded-md border border-[var(--line-strong)] bg-black/40 backdrop-blur-md hud-corners"
          >
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 px-6 sm:px-9 pt-7 pb-6 border-b border-[var(--line)]">
              <span className="font-mono text-[11px] text-[var(--red)] tracking-[0.3em]">0{active + 1}</span>
              <h3 className="font-serif text-3xl sm:text-4xl">{p.name}</h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">{p.type}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {quadrants.map(({ key, label, icon: Icon }, qi) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.1 + qi * 0.08 }}
                  className="p-6 sm:p-8 border-b border-[var(--line)] sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <Icon size={14} className="text-[var(--red)]" />
                    <span className="eyebrow !text-[var(--muted)]">{label}</span>
                  </div>
                  <p className="text-[14px] text-[var(--ink)]/85 leading-relaxed">{p[key]}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 px-6 sm:px-9 py-6 border-t border-[var(--line)]">
              {p.stack.map((t) => (
                <span key={t} className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 border border-[var(--red)]/35 bg-[var(--red)]/[0.06] text-[var(--ink)]/80">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
