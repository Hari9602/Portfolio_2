"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import ScrambleText from "./ScrambleText";

/** Editorial section title: mono index rail, serif headline whose final word
 *  turns italic blood-red, and a giant stroked index drifting on scroll. */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["30%", "-40%"]);

  const words = title.split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];
  const centered = align === "center";

  return (
    <div ref={ref} className={`relative ${centered ? "text-center mx-auto max-w-3xl" : "max-w-4xl"}`}>
      <motion.span
        aria-hidden
        style={{ y: ghostY }}
        className={`pointer-events-none select-none absolute -top-10 sm:-top-16 font-poster stroke-text leading-none text-[clamp(7rem,22vw,17rem)] opacity-40 ${
          centered ? "left-1/2 -translate-x-1/2" : "right-0 sm:-right-10"
        }`}
      >
        {index}
      </motion.span>

      <Reveal>
        <div className={`relative flex items-center gap-3 mb-6 ${centered ? "justify-center" : ""}`}>
          <span className="font-mono text-[11px] text-[var(--red)] tracking-[0.2em]">[{index}]</span>
          <span className="h-px w-10 bg-gradient-to-r from-[var(--red)] to-transparent" />
          <ScrambleText text={eyebrow} className="eyebrow" />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="relative font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.95] tracking-[-0.01em] text-[var(--ink)]">
          {head && <>{head} </>}
          <em className="italic text-gradient-cyan pr-2">{tail}</em>
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.1}>
          <p
            className={`relative mt-6 text-[15px] sm:text-[17px] text-[var(--muted)] leading-relaxed max-w-2xl ${
              centered ? "mx-auto" : "pl-4 border-l border-[var(--red)]/50"
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
