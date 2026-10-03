"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/data";

const LINES = [
  "establishing secure channel ........ OK",
  "loading threat intelligence ........ OK",
  "mounting forensic toolkit .......... OK",
  "verifying operator credentials ..... OK",
  "decrypting profile //",
];

const ease = [0.76, 0, 0.24, 1] as const;

function announceBoot() {
  document.documentElement.dataset.boot = "done";
  window.dispatchEvent(new Event("boot:done"));
}

/* Cinematic cold-open: letterboxed boot log + countdown ring, the name slams
   in, then the frame splits open vertically to reveal the stage. */
export default function Preloader() {
  const [done, setDone] = useState(true);
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // only first visit of the session, and never with reduced motion
    const seen = sessionStorage.getItem("phantom_boot");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      announceBoot();
      return;
    }
    setDone(false);
    sessionStorage.setItem("phantom_boot", "1");
    document.body.style.overflow = "hidden";

    const lineTimer = window.setInterval(() => setLine((l) => Math.min(l + 1, LINES.length)), 330);
    const pctTimer = window.setInterval(() => setPct((p) => Math.min(p + Math.random() * 8 + 4, 100)), 90);
    const finish = window.setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
      // let the split-open play before the hero intro fires
      window.setTimeout(announceBoot, 450);
    }, 2600);

    return () => {
      clearInterval(lineTimer);
      clearInterval(pctTimer);
      clearTimeout(finish);
      document.body.style.overflow = "";
    };
  }, []);

  const r = 46;
  const circ = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[200] pointer-events-auto" exit={{ opacity: 1 }} transition={{ duration: 1 }}>
          {/* split halves */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#050303]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.95, ease }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050303]"
            exit={{ y: "100%" }}
            transition={{ duration: 0.95, ease }}
          />
          {/* seam flash */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--red)] shadow-[0_0_30px_6px_rgba(255,45,45,0.6)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pct / 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute inset-0 grid place-items-center"
            exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            {/* letterbox bars */}
            <div className="absolute inset-x-0 top-0 h-[9vh] bg-black border-b border-[var(--red)]/20" />
            <div className="absolute inset-x-0 bottom-0 h-[9vh] bg-black border-t border-[var(--red)]/20" />

            <div className="relative w-[min(92vw,620px)] px-5 grid sm:grid-cols-[auto_1fr] gap-7 items-center">
              {/* countdown ring */}
              <div className="relative h-28 w-28 mx-auto">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,60,45,0.15)" strokeWidth="1.5" />
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="#ff2d2d"
                    strokeWidth="2"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    style={{ filter: "drop-shadow(0 0 6px #ff2d2d)" }}
                  />
                </svg>
                <div className="absolute inset-0 grid place-items-center font-poster text-4xl text-[var(--ink)] tabular-nums">
                  {Math.floor(pct)}
                </div>
                <span className="absolute inset-0 rounded-full border border-dashed border-[var(--red)]/30 spin-slow" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-2 w-2 rounded-full bg-[var(--red)] rec-dot" />
                  <span className="font-mono text-[10.5px] tracking-[0.34em] uppercase text-[var(--muted)]">
                    Phantom Secure Boot
                  </span>
                </div>
                <div className="font-mono text-[11.5px] sm:text-[12.5px] space-y-1.5 min-h-[118px]">
                  {LINES.slice(0, line).map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[var(--muted)] truncate"
                    >
                      <span className="text-[var(--red)]">$</span> {l}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {line >= LINES.length && (
              <motion.div
                initial={{ opacity: 0, scale: 1.4, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.02em" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[14vh] inset-x-0 text-center font-poster text-[clamp(2.4rem,9vw,6rem)] leading-none ember-fill"
              >
                {profile.name}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
