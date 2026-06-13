"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { timeline } from "@/lib/data";

export default function Trajectory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 70%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="trajectory" className="section">
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow="Trajectory"
          title="A deliberate climb."
          subtitle="From foundational network-security certs to a stacked year of offensive specialization — every step compounding toward depth."
        />

        <div ref={ref} className="mt-16 relative pl-8 sm:pl-10">
          {/* track */}
          <div className="absolute left-0 sm:left-[3px] top-2 bottom-2 w-px bg-[var(--line-strong)]" />
          <motion.div
            style={{ height }}
            className="absolute left-0 sm:left-[3px] top-2 w-px bg-gradient-to-b from-[var(--cyan)] via-[var(--azure)] to-[var(--violet)]"
          />

          <div className="space-y-10">
            {timeline.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.05}>
                <div className="relative">
                  <span
                    className="absolute -left-8 sm:-left-[42px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg)]"
                    style={{
                      background: `var(--${t.accent})`,
                      boxShadow: `0 0 16px var(--${t.accent})`,
                    }}
                  />
                  <div className="glass glass-hover lift rounded-2xl p-6">
                    <span
                      className="font-mono text-xs"
                      style={{ color: `var(--${t.accent})` }}
                    >
                      {t.period}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold">{t.title}</h3>
                    <p className="text-[13px] text-[var(--muted)] mt-0.5">{t.org}</p>
                    <p className="mt-3 text-[14.5px] text-[var(--ink)]/80 leading-relaxed max-w-2xl">
                      {t.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
