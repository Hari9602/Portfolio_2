"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillClusters } from "@/lib/data";

function Bar({ name, level, accent, delay }: { name: string; level: number; accent: string; delay: number }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[14px] text-[var(--ink)]/90">{name}</span>
        <span className="font-mono text-[12px]" style={{ color: `var(--${accent})` }}>
          {level}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, var(--${accent}) 60%, transparent), var(--${accent}))`,
            boxShadow: `0 0 16px color-mix(in oklab, var(--${accent}) 60%, transparent)`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow="Proficiency"
          title="Where the depth is."
          subtitle="A self-assessed map across the three pillars I operate in — offense, defense, and the systems beneath both."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {skillClusters.map((cluster, ci) => (
            <Reveal key={cluster.group} delay={ci * 0.12}>
              <div className="glass rounded-2xl p-6 h-full border-gradient">
                <div className="flex items-center gap-3 mb-7">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: `var(--${cluster.accent})`,
                      boxShadow: `0 0 12px var(--${cluster.accent})`,
                    }}
                  />
                  <h3 className="font-display font-semibold text-lg">{cluster.group}</h3>
                </div>
                <div className="space-y-5">
                  {cluster.skills.map((s, si) => (
                    <Bar
                      key={s.name}
                      name={s.name}
                      level={s.level}
                      accent={cluster.accent}
                      delay={si * 0.08}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
