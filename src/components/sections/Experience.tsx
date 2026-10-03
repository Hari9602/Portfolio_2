"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import Tilt from "@/components/ui/Tilt";
import { experience, type Role } from "@/lib/data";
import { formatPeriod, useTenure } from "@/lib/tenure";

const ease = [0.16, 1, 0.3, 1] as const;

/* live tenure — ongoing roles fill in on the client and advance monthly */
function Tenure({ role, className }: { role: Role; className?: string }) {
  const t = useTenure(role.start, role.end);
  return <span className={className}>{t ? `· ${t}` : ""}</span>;
}

function RoleProgression({ roles }: { roles: Role[] }) {
  return (
    <ol className="mt-8 relative pl-6">
      <span className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--red)] to-[var(--line-strong)]" />
      {roles.map((r, ri) => {
        const current = !r.end;
        return (
          <motion.li
            key={r.title}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: 0.2 + ri * 0.12 }}
            className="relative py-2.5"
          >
            <span
              className={`absolute -left-6 top-[15px] h-[11px] w-[11px] rounded-full border-2 border-[#0b0606] ${
                current ? "bg-[var(--red)] shadow-[0_0_12px_var(--red)] rec-dot" : "bg-[var(--muted)]/60"
              }`}
            />
            <p className={`font-serif text-lg leading-tight ${current ? "text-[var(--ink)]" : "text-[var(--ink)]/70"}`}>{r.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">
              {formatPeriod(r.start, r.end)} <Tenure role={r} className="text-[var(--red)]" />
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}

function RoleIntel({ role, index }: { role: Role; index: number }) {
  return (
    <div className="[&+&]:mt-10 [&+&]:pt-10 [&+&]:border-t [&+&]:border-[var(--line-strong)]">
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--muted)]">
        <span className="text-[var(--red)]">Role {String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-6 bg-[var(--line-strong)]" />
        <span className="text-[var(--ink)]/80">{role.title}</span>
        <span>· {formatPeriod(role.start, role.end)}</span>
      </div>

      {role.summary && (
        <p className="font-serif text-[1.45rem] sm:text-[1.75rem] leading-snug text-[var(--ink)]/90">{role.summary}</p>
      )}

      {role.highlights && (
        <ol className="mt-8 border-t border-[var(--line)]">
          {role.highlights.map((h, hi) => (
            <motion.li
              key={hi}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.15 + hi * 0.12 }}
              className="relative flex gap-5 py-5 border-b border-[var(--line)] text-[14.5px] text-[var(--muted)] leading-relaxed"
            >
              <span className="font-poster text-2xl text-[var(--red)] leading-none pt-0.5 w-8 shrink-0">
                {String(hi + 1).padStart(2, "0")}
              </span>
              <span>{h}</span>
            </motion.li>
          ))}
        </ol>
      )}

      {role.stack && (
        <div className="mt-7 flex flex-wrap gap-2">
          {role.stack.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 border border-[var(--red)]/35 text-[var(--ink)]/80 bg-[var(--red)]/[0.06]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

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

        <div className="mt-16 space-y-8">
          {experience.map((job, i) => {
            const lead = job.roles[0];
            const current = !lead.end;
            const detailed = job.roles.filter((r) => r.summary || r.highlights?.length || r.stack?.length);
            return (
              <Reveal key={job.company} delay={i * 0.08}>
                <Tilt max={3}>
                  <article className="group relative overflow-hidden rounded-md border border-[var(--line-strong)] bg-gradient-to-br from-[#160909]/90 via-[#0b0606]/90 to-black/90 hud-corners">
                    <div className="scan-sweep" />
                    {/* ghosted start year of the current role */}
                    <span
                      aria-hidden
                      className="pointer-events-none select-none absolute -right-6 -bottom-10 font-poster stroke-text text-[clamp(8rem,20vw,16rem)] leading-none opacity-30"
                    >
                      {lead.start.slice(0, 4)}
                    </span>
                    <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[var(--red)]/20 blur-[90px]" />

                    <div className="relative grid lg:grid-cols-[1fr_1.25fr]">
                      {/* identity column */}
                      <div className="relative p-7 sm:p-10 lg:border-r border-[var(--line-strong)]">
                        <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.3em] text-[var(--muted)]">
                          <span className="text-[var(--red)]">FILE</span>
                          <span className="h-px flex-1 bg-[var(--line-strong)]" />
                          <span>{String(i + 1).padStart(3, "0")}</span>
                        </div>

                        <h3 className="mt-6 font-poster text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.85] ember-fill">
                          {lead.title}
                        </h3>
                        <p className="mt-4 font-serif italic text-2xl sm:text-3xl text-[var(--ink)]">{job.company}</p>
                        {lead.type && (
                          <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">{lead.type}</p>
                        )}

                        {current && (
                          <motion.span
                            initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                            whileInView={{ scale: 1, opacity: 1, rotate: -9 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
                            className="mt-5 inline-flex items-center gap-2 border-2 border-[var(--red)] px-3 py-1 font-poster text-xl tracking-[0.12em] text-[var(--red)] origin-left"
                          >
                            <span className="h-2 w-2 rounded-full bg-[var(--red)] rec-dot" />
                            Current
                          </motion.span>
                        )}

                        <dl className="mt-9 font-mono text-[12px]">
                          <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--line)]">
                            <dt className="text-[var(--muted)] tracking-[0.2em]">PERIOD</dt>
                            <dd className="text-[var(--ink)]/85 text-right">
                              {formatPeriod(lead.start, lead.end)} <Tenure role={lead} className="text-[var(--red)]" />
                            </dd>
                          </div>
                          <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--line)]">
                            <dt className="text-[var(--muted)] tracking-[0.2em]">MODE</dt>
                            <dd className="text-[var(--ink)]/85 text-right">{job.mode}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--line)]">
                            <dt className="text-[var(--muted)] tracking-[0.2em]">LOCATION</dt>
                            <dd className="text-[var(--ink)]/85 text-right inline-flex items-center gap-1.5">
                              <MapPin size={12} className="text-[var(--red)] shrink-0" />
                              {job.location}
                            </dd>
                          </div>
                        </dl>

                        {job.roles.length > 1 && <RoleProgression roles={job.roles} />}
                      </div>

                      {/* intel column */}
                      {detailed.length > 0 && (
                        <div className="relative p-7 sm:p-10">
                          {detailed.map((r) => (
                            <RoleIntel key={r.title} role={r} index={job.roles.indexOf(r)} />
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
