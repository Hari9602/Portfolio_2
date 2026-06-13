"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Trophy, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, itemVariants, Reveal } from "@/components/ui/Reveal";
import { certifications, achievements, type CertItem } from "@/lib/data";

function CertCard({ c, accent }: { c: CertItem; accent: string }) {
  const verifiable = Boolean(c.url);
  const Wrapper = verifiable ? motion.a : motion.div;
  const wrapperProps = verifiable
    ? { href: c.url, target: "_blank", rel: "noreferrer", "data-cursor": true }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      variants={itemVariants}
      style={{ ["--c" as string]: `var(--${accent})` }}
      className={`group/cert relative flex items-start gap-2.5 rounded-xl bg-white/[0.02] border border-[var(--line)] p-3 transition-all ${
        verifiable
          ? "cursor-pointer hover:bg-white/[0.04] hover:border-[var(--c)] hover:shadow-[0_8px_30px_-12px_var(--c)]"
          : ""
      }`}
    >
      <span
        className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
        style={{ background: `var(--${accent})` }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-snug text-[var(--ink)]/90 pr-5">{c.name}</p>
        <p className="font-mono text-[10.5px] text-[var(--muted)] mt-0.5">{c.date}</p>
      </div>
      {verifiable && (
        <span
          className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider opacity-0 group-hover/cert:opacity-100 transition-opacity"
          style={{ color: `var(--${accent})` }}
        >
          <ShieldCheck size={11} />
          Verify
        </span>
      )}
    </Wrapper>
  );
}

export default function Credentials() {
  return (
    <section id="credentials" className="section">
      <div className="container-x">
        <SectionHeading
          index="07"
          eyebrow="Validation"
          title="Credentials & recognition"
          subtitle="Thirteen industry certifications and a competitive record that proves the skills in the open."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Certifications */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <BadgeCheck size={18} className="text-[var(--cyan)]" />
              <h3 className="font-display font-semibold text-lg">Certifications</h3>
              <span className="font-mono text-xs text-[var(--muted)]">— 13 earned</span>
            </div>

            <div className="space-y-5">
              {certifications.map((group, gi) => (
                <Reveal key={group.issuer} delay={gi * 0.06}>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3.5">
                      <span
                        className="font-display font-semibold text-[15px]"
                        style={{ color: `var(--${group.accent})` }}
                      >
                        {group.issuer}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--muted)]">
                        {group.items.length} cert{group.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <Stagger className="grid sm:grid-cols-2 gap-2.5" gap={0.04}>
                      {group.items.map((c) => (
                        <CertCard key={c.name} c={c} accent={group.accent} />
                      ))}
                    </Stagger>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <Trophy size={18} className="text-[var(--magenta)]" />
              <h3 className="font-display font-semibold text-lg">Competitive Record</h3>
            </div>

            <Stagger className="space-y-3">
              {achievements.map((a) => (
                <motion.div
                  key={a.title}
                  variants={itemVariants}
                  data-cursor
                  className="group glass glass-hover lift rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="shrink-0 w-16 text-center">
                    <div className="font-display text-xl font-bold text-gradient-cyan">
                      {a.rank}
                    </div>
                  </div>
                  <div className="h-10 w-px bg-[var(--line-strong)]" />
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-[15px] leading-tight">
                      {a.title}
                    </h4>
                    <p className="text-[12.5px] text-[var(--muted)] mt-0.5">
                      {a.venue} · {a.note}
                    </p>
                  </div>
                </motion.div>
              ))}
            </Stagger>

            <Reveal delay={0.2}>
              <div className="mt-3 relative overflow-hidden glass rounded-2xl p-6 text-center border-gradient">
                <div className="shimmer absolute inset-0" />
                <div className="relative">
                  <div className="font-display text-4xl font-bold text-gradient">
                    Top 1%
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">
                    Global standing on TryHackMe
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
