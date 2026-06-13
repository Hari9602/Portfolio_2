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

export default function Preloader() {
  const [done, setDone] = useState(true);
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // only first visit of the session, and never with reduced motion
    const seen = sessionStorage.getItem("phantom_boot");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setDone(true);
      return;
    }
    setDone(false);
    sessionStorage.setItem("phantom_boot", "1");
    document.body.style.overflow = "hidden";

    const lineTimer = setInterval(() => {
      setLine((l) => Math.min(l + 1, LINES.length));
    }, 320);

    const pctTimer = setInterval(() => {
      setPct((p) => Math.min(p + Math.random() * 9 + 4, 100));
    }, 90);

    const finish = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 2300);

    return () => {
      clearInterval(lineTimer);
      clearInterval(pctTimer);
      clearTimeout(finish);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-[var(--bg)]"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="aurora opacity-50" />
          <div className="grid-bg" />

          <div className="relative w-[min(90vw,520px)] px-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--aqua)] live-dot" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[var(--muted)]">
                Phantom Secure Boot
              </span>
            </div>

            <div className="font-mono text-[12.5px] space-y-1.5 min-h-[120px]">
              {LINES.slice(0, line).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between gap-4 text-[var(--muted)]"
                >
                  <span>
                    <span className="text-[var(--cyan)]">$</span> {l}
                  </span>
                </motion.div>
              ))}
              {line >= LINES.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-display text-2xl font-semibold text-gradient pt-2"
                >
                  {profile.name}
                </motion.div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex justify-between font-mono text-[10px] text-[var(--muted)] mb-2">
                <span>INITIALIZING</span>
                <span>{Math.floor(pct)}%</span>
              </div>
              <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--cyan)] via-[var(--azure)] to-[var(--violet)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
