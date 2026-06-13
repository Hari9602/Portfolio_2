"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, itemVariants } from "@/components/ui/Reveal";
import Tilt from "@/components/ui/Tilt";
import { expertise } from "@/lib/data";

function Card({ item, idx }: { item: (typeof expertise)[number]; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Tilt className="h-full">
      <div
        ref={ref}
        onMouseMove={onMove}
        data-cursor
        className="group relative h-full glass glass-hover rounded-2xl p-6 overflow-hidden"
      >
        {/* spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(340px circle at var(--mx) var(--my), rgba(52,231,255,0.1), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-start justify-between">
            <span
              className="font-mono text-xs px-2.5 py-1 rounded-md border"
              style={{
                color: `var(--${item.accent})`,
                borderColor: `color-mix(in oklab, var(--${item.accent}) 35%, transparent)`,
                background: `color-mix(in oklab, var(--${item.accent}) 8%, transparent)`,
              }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <ArrowUpRight
              size={18}
              className="text-[var(--muted)] group-hover:text-[var(--cyan)] group-hover:rotate-45 transition-all duration-400"
            />
          </div>

          <h3 className="mt-5 font-display text-lg font-semibold leading-snug">
            {item.title}
          </h3>
          <p className="mt-2.5 text-[13.5px] text-[var(--muted)] leading-relaxed">
            {item.blurb}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.capabilities.map((c) => (
              <span
                key={c}
                className="text-[11.5px] font-mono px-2.5 py-1 rounded-md bg-white/[0.03] border border-[var(--line)] text-[var(--muted)]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          className="absolute -bottom-px left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
          style={{ background: `var(--${item.accent})` }}
        />
      </div>
      </Tilt>
    </motion.div>
  );
}

export default function Expertise() {
  return (
    <section id="expertise" className="section">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Capabilities"
          title="Full-spectrum security expertise"
          subtitle="Six core domains spanning offense, defense, and the infrastructure in between — each backed by hands-on practice and industry certification."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, idx) => (
            <Card key={item.id} item={item} idx={idx} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
