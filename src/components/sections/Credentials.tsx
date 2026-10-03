"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Trophy, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { certifications, achievements, type CertItem } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

// running cert number across issuer groups
const groupStart = certifications.map((_, gi) =>
  certifications.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0)
);

function CertRow({ c, n }: { c: CertItem; n: number }) {
  const verifiable = Boolean(c.url);
  const inner = (
    <>
      <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[var(--red)]/25 via-[var(--red)]/8 to-transparent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
      <span className="relative font-mono text-[11px] text-[var(--red)] w-7 shrink-0">{String(n).padStart(2, "0")}</span>
      <span className="relative flex-1 min-w-0 text-[14px] text-[var(--ink)]/90 transition-transform duration-500 group-hover:translate-x-1.5">
        {c.name}
      </span>
      <span className="relative hidden sm:block font-mono text-[11px] text-[var(--muted)] shrink-0">{c.date}</span>
      {verifiable && (
        <span className="relative inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--red)] transition-colors shrink-0">
          Verify
          <ArrowUpRight size={13} className="transition-transform duration-500 group-hover:rotate-45" />
        </span>
      )}
    </>
  );
  const cls = "group relative flex items-center gap-4 py-3.5 px-2 border-b border-[var(--line)] overflow-hidden";
  return verifiable ? (
    <a href={c.url} target="_blank" rel="noreferrer" data-cursor className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/* targeting reticle; achievement blips lock on when their row is hovered */
const BLIPS = [
  { x: 72, y: 26 },
  { x: 24, y: 34 },
  { x: 78, y: 70 },
  { x: 30, y: 76 },
  { x: 54, y: 14 },
];

function Reticle({ focus }: { focus: number }) {
  return (
    <div className="relative aspect-square w-full max-w-[380px] mx-auto">
      <div className="absolute inset-0 rounded-full border border-[var(--red)]/30" />
      <div className="absolute inset-[9%] rounded-full border border-dashed border-[var(--red)]/30 spin-slow" />
      <div className="absolute inset-[22%] rounded-full border border-[var(--red)]/20 spin-slow-rev" />
      <div className="absolute inset-[36%] rounded-full border border-[var(--red)]/35" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--red)]/25" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--red)]/25" />
      <div
        className="absolute inset-0 rounded-full radar-sweep"
        style={{ background: "conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(255,45,45,0.05) 320deg, rgba(255,45,45,0.35) 360deg)" }}
      />

      {BLIPS.map((b, i) => (
        <span key={i} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <span
            className={`absolute -ml-1.5 -mt-1.5 h-3 w-3 rounded-full transition-all duration-300 ${
              focus === i ? "bg-[var(--amber)] scale-150 shadow-[0_0_18px_var(--amber)]" : "bg-[var(--red)]/70"
            }`}
          />
          {focus === i && (
            <motion.span
              initial={{ scale: 2.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease }}
              className="absolute -ml-5 -mt-5 h-10 w-10 border border-[var(--amber)]"
            />
          )}
        </span>
      ))}

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-poster text-[clamp(3.4rem,8vw,4.6rem)] leading-none ember-fill">Top 1%</div>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--muted)] max-w-[12rem] mx-auto">
            Global standing on TryHackMe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Credentials() {
  const [focus, setFocus] = useState(-1);

  return (
    <section id="credentials" className="section">
      <div className="container-x">
        <SectionHeading
          index="07"
          eyebrow="Validation"
          title="Credentials & recognition"
          subtitle="Thirteen industry certifications and a competitive record that proves the skills in the open."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.45fr_1fr]">
          {/* Certifications */}
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <BadgeCheck size={18} className="text-[var(--red)]" />
              <h3 className="font-serif text-2xl">Certifications</h3>
              <span className="font-mono text-xs text-[var(--muted)]">— 13 earned</span>
            </div>

            <div className="space-y-10">
              {certifications.map((group, gi) => (
                <Reveal key={group.issuer} delay={gi * 0.06}>
                  <div>
                    <div className="flex items-end justify-between border-b border-[var(--line-strong)] pb-3">
                      <span className="font-poster text-[2rem] sm:text-[2.6rem] leading-none text-[var(--ink)]">{group.issuer}</span>
                      <span className="font-mono text-[11px] text-[var(--muted)]">
                        {group.items.length} cert{group.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    {group.items.map((c, ci) => (
                      <CertRow key={c.name} c={c} n={groupStart[gi] + ci + 1} />
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="flex items-center gap-2.5 mb-8">
              <Trophy size={18} className="text-[var(--red)]" />
              <h3 className="font-serif text-2xl">Competitive Record</h3>
            </div>

            <Reveal>
              <Reticle focus={focus} />
            </Reveal>

            <div className="mt-8 border-t border-[var(--line-strong)]" onMouseLeave={() => setFocus(-1)}>
              {achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease, delay: i * 0.07 }}
                  onMouseEnter={() => setFocus(i)}
                  data-cursor
                  className="group flex items-center gap-5 py-4 border-b border-[var(--line)]"
                >
                  <span className="font-poster text-[1.9rem] leading-none w-24 shrink-0 text-[var(--red)] group-hover:text-[var(--amber)] transition-colors">
                    {a.rank}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-serif text-xl leading-tight">{a.title}</h4>
                    <p className="font-mono text-[11px] text-[var(--muted)] mt-0.5">
                      {a.venue} · {a.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
