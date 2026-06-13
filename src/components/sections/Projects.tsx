"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Workflow, ScanSearch, TrendingUp, Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/data";

const quadrants = [
  { key: "challenge", label: "Challenge", icon: Target },
  { key: "methodology", label: "Methodology", icon: Workflow },
  { key: "findings", label: "Findings", icon: ScanSearch },
  { key: "impact", label: "Impact", icon: TrendingUp },
] as const;

function CaseStudy({ p, idx }: { p: Project; idx: number }) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <Reveal delay={idx * 0.08}>
      <div className="border-gradient glass rounded-3xl overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left p-6 sm:p-8 flex items-start gap-5 sm:gap-7"
          data-cursor
        >
          <span className="font-mono text-sm text-[var(--muted)] mt-1.5 shrink-0">
            0{idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3
                className="font-display text-2xl sm:text-3xl font-semibold"
                style={{ color: open ? `var(--${p.accent})` : undefined }}
              >
                {p.name}
              </h3>
              <span
                className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border"
                style={{
                  color: `var(--${p.accent})`,
                  borderColor: `color-mix(in oklab, var(--${p.accent}) 35%, transparent)`,
                }}
              >
                {p.type}
              </span>
            </div>
            <p className="mt-2.5 text-[var(--muted)] text-[15px] leading-relaxed max-w-2xl">
              {p.summary}
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 grid place-items-center h-10 w-10 rounded-full border border-[var(--line-strong)]"
          >
            <Plus size={18} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 sm:px-8 pb-8 pt-1">
                <div className="grid gap-4 sm:grid-cols-2">
                  {quadrants.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="rounded-2xl bg-white/[0.02] border border-[var(--line)] p-5"
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <Icon size={15} style={{ color: `var(--${p.accent})` }} />
                        <span className="eyebrow !text-[var(--muted)]">{label}</span>
                      </div>
                      <p className="text-[14px] text-[var(--ink)]/85 leading-relaxed">
                        {p[key]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="text-[12px] font-mono px-3 py-1.5 rounded-lg bg-white/[0.03] border border-[var(--line)] text-[var(--muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="aurora opacity-40" />
      <div className="container-x relative">
        <SectionHeading
          index="04"
          eyebrow="Field Work"
          title="Engagements, decoded."
          subtitle="Tooling and CTF work presented the way real assessments are reported — challenge, methodology, findings, and measurable impact."
        />

        <div className="mt-14 space-y-5">
          {projects.map((p, i) => (
            <CaseStudy key={p.id} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
