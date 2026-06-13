"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";

/**
 * A futuristic portrait module: real photo presented as a holographic,
 * facial-recognition style readout with pointer-driven 3D parallax depth,
 * animated frame, scanline sweep and floating HUD overlays.
 * Drop the photo at /public/profile.jpg — falls back to a monogram crest.
 */
export default function ProfilePortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ rx: -py * 12, ry: px * 14, mx: 50 + px * 40, my: 50 + py * 40 });
  };
  const reset = () => setT({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[360px]"
      style={{ perspective: "1100px" }}
    >
      {/* ambient glow */}
      <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(77,124,255,0.35),transparent_70%)] blur-2xl" />

      {/* continuous idle 3D sway — keeps the hologram alive without a pointer */}
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: [-5, 5, -5], rotateX: [2.5, -2.5, 2.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        data-cursor
        className="portrait-card relative aspect-[3/4] rounded-[26px] overflow-hidden"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* animated gradient border */}
        <div className="portrait-border absolute inset-0 rounded-[26px] z-30 pointer-events-none" />

        {/* holographic projection chamber (behind the figure) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_25%,rgba(18,38,86,0.65),rgba(4,6,15,0.96))]" />
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(52,231,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(52,231,255,0.5) 1px,transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage: "radial-gradient(80% 80% at 50% 40%, #000, transparent 80%)",
              WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, #000, transparent 80%)",
            }}
          />
          {/* projection base glow under the figure */}
          <div className="absolute inset-x-8 bottom-7 h-24 bg-[radial-gradient(closest-side,rgba(52,231,255,0.4),transparent)] blur-xl" />
        </div>

        {/* figure — background removed, projected like a hologram */}
        <div className="absolute inset-0 z-[5]" style={{ transform: "translateZ(24px)" }}>
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/profile-cut.png"
              alt={profile.name}
              onError={() => setImgOk(false)}
              className="portrait-img holo-img holo-flicker h-full w-full object-contain object-bottom drop-shadow-[0_0_22px_rgba(52,231,255,0.55)]"
            />
          ) : (
            <div className="h-full w-full grid place-items-center">
              <span className="font-display text-7xl font-bold text-gradient">
                {profile.initials}
              </span>
            </div>
          )}
        </div>

        {/* holographic colour grade — keeps the face but pushes it cyan-violet */}
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-color opacity-[0.55] bg-gradient-to-tr from-[var(--cyan)] via-[var(--azure)]/70 to-[var(--violet)]" />
        {/* additive cyan bloom from the top (projection light) */}
        <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30 bg-[radial-gradient(120%_85%_at_50%_0%,rgba(52,231,255,0.4),transparent_60%)]" />
        {/* pointer light */}
        <div
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-60"
          style={{
            background: `radial-gradient(300px circle at ${t.mx}% ${t.my}%, rgba(52,231,255,0.3), transparent 60%)`,
          }}
        />
        {/* inner edge glow — reads like a contained hologram */}
        <div className="absolute inset-0 z-20 pointer-events-none rounded-[26px] shadow-[inset_0_0_45px_rgba(52,231,255,0.3),inset_0_0_2px_rgba(52,231,255,0.7)]" />
        {/* bottom fade for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />

        {/* holographic interlace scanlines */}
        <div className="holo-interlace absolute inset-0 z-20 pointer-events-none" />

        {/* scanline sweep */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
          <div className="portrait-scan absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-[var(--cyan)]/30 to-transparent" />
          {/* bright hologram data bar */}
          <div className="holo-bar absolute inset-x-0 h-[2px] bg-[var(--cyan)]/80 shadow-[0_0_16px_var(--cyan)]" />
        </div>

        {/* HUD: corner brackets */}
        <div className="absolute inset-3 z-30 pointer-events-none" style={{ transform: "translateZ(45px)" }}>
          {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
            (c) => (
              <span key={c} className={`absolute h-5 w-5 border-[var(--cyan)]/70 ${c}`} />
            )
          )}
        </div>

        {/* HUD: top tag */}
        <div
          className="absolute top-4 left-4 z-30 flex items-center gap-2"
          style={{ transform: "translateZ(60px)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
          <span className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-[var(--aqua)] bg-[var(--bg)]/60 px-2 py-1 rounded backdrop-blur-sm">
            Subject Identified
          </span>
        </div>

        {/* HUD: reticle */}
        <div
          className="absolute top-4 right-4 z-30 h-8 w-8 rounded-full border border-[var(--cyan)]/50 grid place-items-center"
          style={{ transform: "translateZ(50px)" }}
        >
          <span className="h-1 w-1 rounded-full bg-[var(--cyan)]" />
        </div>

        {/* HUD: bottom identity readout */}
        <div
          className="absolute bottom-4 left-4 right-4 z-30"
          style={{ transform: "translateZ(55px)" }}
        >
          <div className="font-mono text-[10px] text-[var(--cyan)] mb-1">
            // OPERATOR_PROFILE
          </div>
          <div className="font-display text-lg font-semibold leading-tight">
            {profile.name}
          </div>
          <div className="flex items-center justify-between mt-1.5 font-mono text-[9.5px] text-[var(--muted)]">
            <span>CLEARANCE · PURPLE</span>
            <span className="text-[var(--aqua)]">● ACTIVE</span>
          </div>
        </div>
      </div>
      </motion.div>

      {/* hologram projection base */}
      <div className="holo-base absolute left-1/2 -bottom-4 h-9 w-3/5 rounded-[50%] bg-[radial-gradient(closest-side,rgba(52,231,255,0.45),transparent)] blur-md pointer-events-none" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-12 w-1/2 bg-[linear-gradient(to_top,rgba(52,231,255,0.12),transparent)] blur-sm pointer-events-none" />

    </motion.div>
  );
}
