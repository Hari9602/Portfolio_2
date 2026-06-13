"use client";

import { Reveal } from "./Reveal";
import ScrambleText from "./ScrambleText";

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
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl"}>
      <Reveal>
        <div
          className={`flex items-center gap-3 mb-5 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="font-mono text-xs text-[var(--cyan)]">{index}</span>
          <span className="h-px w-8 bg-[var(--line-strong)]" />
          <ScrambleText text={eyebrow} className="eyebrow" />
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.02] tracking-tight">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p
            className={`mt-5 text-base sm:text-lg text-[var(--muted)] leading-relaxed ${
              align === "center" ? "mx-auto" : ""
            } max-w-2xl`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
