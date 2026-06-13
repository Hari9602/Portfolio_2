"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, CheckCircle2, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="In the field, right now."
          subtitle="Where the methodology meets a live environment — applying offensive testing against real production infrastructure."
        />

        <div className="mt-14 space-y-5">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 0.08}>
              <div className="group relative glass border-gradient rounded-3xl p-7 sm:p-9 overflow-hidden">
                {/* ambient glow */}
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-50"
                  style={{ background: `var(--${job.accent})` }}
                />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_1.3fr]">
                  {/* left: identity */}
                  <div>
                    <div className="flex items-start gap-4">
                      <span
                        className="shrink-0 grid place-items-center h-14 w-14 rounded-2xl border border-[var(--line-strong)]"
                        style={{
                          background: `color-mix(in oklab, var(--${job.accent}) 12%, transparent)`,
                          color: `var(--${job.accent})`,
                        }}
                      >
                        <Briefcase size={22} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-display text-2xl font-semibold">{job.role}</h3>
                          {job.current && (
                            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--aqua)]/40 text-[var(--aqua)]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
                              Current
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[15px] text-[var(--ink)]/85">
                          {job.company}
                        </p>
                        <p className="text-[13px] text-[var(--muted)]">{job.type}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2.5 font-mono text-[12.5px] text-[var(--muted)]">
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                        <span>PERIOD</span>
                        <span className="text-[var(--ink)]/80">
                          {job.period}{" "}
                          <span className="text-[var(--cyan)]">· {job.duration}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                        <span>MODE</span>
                        <span className="text-[var(--ink)]/80">{job.mode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LOCATION</span>
                        <span className="flex items-center gap-1.5 text-[var(--ink)]/80">
                          <MapPin size={12} className="text-[var(--cyan)]" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* right: substance */}
                  <div className="lg:border-l lg:border-[var(--line)] lg:pl-8">
                    <p className="text-[15px] sm:text-base text-[var(--ink)]/85 leading-relaxed">
                      {job.summary}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {job.highlights.map((h, hi) => (
                        <motion.li
                          key={hi}
                          initial={{ opacity: 0, x: 12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + hi * 0.08 }}
                          className="flex gap-3 text-[14px] text-[var(--muted)] leading-relaxed"
                        >
                          <CheckCircle2
                            size={16}
                            className="shrink-0 mt-0.5"
                            style={{ color: `var(--${job.accent})` }}
                          />
                          <span>{h}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.stack.map((t) => (
                        <span
                          key={t}
                          className="text-[12px] font-mono px-3 py-1.5 rounded-lg bg-white/[0.03] border border-[var(--line)] text-[var(--muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowUpRight
                  size={20}
                  className="absolute top-7 right-7 text-[var(--muted)]/40 group-hover:text-[var(--cyan)] group-hover:rotate-45 transition-all duration-500"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
