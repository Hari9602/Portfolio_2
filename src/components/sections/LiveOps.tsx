"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Radar, Clock, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/lib/data";

/* A stylized command-console band. The clock is real; the radar is decorative;
   the log visualizes the assessment methodology (recon → exploit → report). */

const LOG = [
  { t: "recon", msg: "enumerating attack surface", tone: "cyan" },
  { t: "scan", msg: "fingerprinting exposed services", tone: "azure" },
  { t: "vuln", msg: "correlating CVE intelligence", tone: "violet" },
  { t: "exploit", msg: "validating exploitability", tone: "magenta" },
  { t: "forensics", msg: "preserving evidence · chain of custody", tone: "aqua" },
  { t: "detect", msg: "mapping findings to MITRE ATT&CK", tone: "cyan" },
  { t: "report", msg: "drafting risk-rated remediation", tone: "azure" },
];

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function RadarSweep() {
  return (
    <div className="relative aspect-square w-full max-w-[260px] mx-auto">
      <div className="absolute inset-0 rounded-full border border-[var(--line-strong)]" />
      <div className="absolute inset-[18%] rounded-full border border-[var(--line)]" />
      <div className="absolute inset-[38%] rounded-full border border-[var(--line)]" />
      <div className="absolute inset-[58%] rounded-full border border-[var(--line)]" />
      {/* cross hairs */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--line)]" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--line)]" />
      {/* sweep */}
      <div
        className="absolute inset-0 rounded-full radar-sweep"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(52,231,255,0.05) 330deg, rgba(52,231,255,0.35) 360deg)",
        }}
      />
      {/* blips */}
      {[
        { x: "62%", y: "30%", d: "0s" },
        { x: "38%", y: "58%", d: "0.6s" },
        { x: "70%", y: "66%", d: "1.2s" },
        { x: "30%", y: "34%", d: "1.8s" },
      ].map((b, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 -ml-1 -mt-1 rounded-full bg-[var(--aqua)] radar-blip"
          style={{ left: b.x, top: b.y, animationDelay: b.d, boxShadow: "0 0 10px var(--aqua)" }}
        />
      ))}
      <span className="absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[var(--cyan)]" />
    </div>
  );
}

export default function LiveOps() {
  const clock = useClock();
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="ops" className="section !py-20">
      <div className="container-x">
        <Reveal>
          <div className="glass border-gradient rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_0.9fr] divide-y lg:divide-y-0 lg:divide-x divide-[var(--line)]">
              {/* radar */}
              <div className="p-5 sm:p-9">
                <div className="flex items-center gap-2.5 mb-6">
                  <Radar size={15} className="text-[var(--cyan)]" />
                  <span className="eyebrow !text-[var(--muted)]">Surface Sweep</span>
                </div>
                <RadarSweep />
                <p className="mt-6 text-center font-mono text-[11px] text-[var(--muted)]">
                  continuous attack-surface monitoring
                </p>
              </div>

              {/* live log */}
              <div className="p-5 sm:p-9">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Activity size={15} className="text-[var(--aqua)]" />
                    <span className="eyebrow !text-[var(--muted)]">Assessment Pipeline</span>
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--aqua)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" /> live
                  </span>
                </div>

                <div className="relative h-[200px] overflow-hidden font-mono text-[11px] sm:text-[12.5px] [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]">
                  <div ref={trackRef} className="ops-log space-y-2.5">
                    {[...LOG, ...LOG].map((l, i) => (
                      <div key={i} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className="text-[var(--muted)]/60 shrink-0">
                          {String((i % LOG.length) + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border shrink-0"
                          style={{
                            color: `var(--${l.tone})`,
                            borderColor: `color-mix(in oklab, var(--${l.tone}) 35%, transparent)`,
                          }}
                        >
                          {l.t}
                        </span>
                        <span className="text-[var(--ink)]/75 truncate min-w-0 flex-1">{l.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* status + metrics */}
              <div className="p-5 sm:p-9 flex flex-col">
                <div className="flex items-center gap-2.5 mb-6">
                  <ShieldCheck size={15} className="text-[var(--violet)]" />
                  <span className="eyebrow !text-[var(--muted)]">Operator Status</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-[var(--line)] px-4 py-3 mb-4">
                  <span className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
                    <Clock size={13} /> UTC
                  </span>
                  <motion.span
                    key={clock}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[15px] text-gradient-cyan tabular-nums"
                  >
                    {clock}
                  </motion.span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white/[0.02] border border-[var(--line)] p-3.5"
                    >
                      <div
                        className="font-display text-lg font-semibold"
                        style={{ color: `var(--${s.accent})` }}
                      >
                        {s.value}
                      </div>
                      <div className="text-[10.5px] text-[var(--muted)] leading-tight mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5 flex items-center gap-2 font-mono text-[10.5px] text-[var(--aqua)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
                  systems nominal · ready for engagement
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
