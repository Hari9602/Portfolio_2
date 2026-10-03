"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { skillClusters } from "@/lib/data";

const SEGMENTS = 20;

/* LED signal meter: segments ignite one by one up to the level */
function Meter({ name, level, delay }: { name: string; level: number; delay: number }) {
  const lit = Math.round((level / 100) * SEGMENTS);
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2.5">
        <span className="text-[14px] text-[var(--ink)]/90 group-hover:text-white transition-colors">{name}</span>
        <span className="font-poster text-xl leading-none text-[var(--red)]">{level}</span>
      </div>
      <div className="flex gap-[3px]" role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={name}>
        {Array.from({ length: SEGMENTS }, (_, s) => {
          const on = s < lit;
          const hot = s >= SEGMENTS - 4;
          return (
            <motion.span
              key={s}
              className="h-3 flex-1 skew-x-[-18deg]"
              initial={{ backgroundColor: "rgba(255,255,255,0.05)", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              whileInView={
                on
                  ? {
                      backgroundColor: hot ? "#ffb648" : s > lit - 3 ? "#ff6b2c" : "#ff2d2d",
                      boxShadow: hot ? "0 0 10px rgba(255,182,72,0.7)" : "0 0 8px rgba(255,45,45,0.6)",
                    }
                  : {}
              }
              viewport={{ once: true }}
              transition={{ duration: 0.12, delay: delay + s * 0.035 }}
            />
          );
        })}
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

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {skillClusters.map((cluster, ci) => (
            <Reveal key={cluster.group} delay={ci * 0.12}>
              <div className="relative h-full rounded-md border border-[var(--line-strong)] bg-black/40 backdrop-blur-sm p-7 hud-corners overflow-hidden">
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[var(--red)]/15 blur-3xl" />
                <div className="relative flex items-center justify-between mb-8">
                  <h3 className="font-serif text-[1.8rem] leading-none">{cluster.group}</h3>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted)]">
                    CH-<span className="text-[var(--red)]">0{ci + 1}</span>
                  </span>
                </div>
                <div className="relative space-y-6">
                  {cluster.skills.map((s, si) => (
                    <Meter key={s.name} name={s.name} level={s.level} delay={si * 0.12} />
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
