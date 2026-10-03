"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Crosshair, FileSearch, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import AboutTerminal from "@/components/ui/AboutTerminal";
import { about } from "@/lib/data";

const ArsenalUniverse = dynamic(() => import("@/components/three/ArsenalUniverse"), { ssr: false });

const icons = [Crosshair, FileSearch, ShieldCheck];

const marquee = [
  "Nmap", "Metasploit", "Wireshark", "Autopsy", "FTK Imager", "Burp Suite",
  "MITRE ATT&CK", "OWASP Top 10", "Python", "Bash", "Linux", "SearchSploit",
  "OSINT", "Cryptography", "Threat Modeling", "Docker",
];

export default function About() {
  return (
    <section id="about" className="section overflow-hidden">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="The Operator"
          title="An adversary's instinct. A defender's discipline."
        />
      </div>

      {/* 3D arsenal stage */}
      <Reveal className="relative mt-10 sm:mt-14">
        <div className="relative h-[72svh] min-h-[480px] max-h-[860px] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_55%,rgba(255,35,25,0.18),transparent_70%)]" />
          <ArsenalUniverse tools={marquee} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-4 sm:inset-x-10 sm:inset-y-6">
            {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
              <span key={c} className={`absolute h-6 w-6 border-[var(--red)]/60 ${c}`} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* tooling marquee */}
      <div className="relative overflow-hidden py-5 border-y border-[var(--line)] bg-black/30">
        <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />
        <motion.div className="flex gap-10 whitespace-nowrap marquee-track w-max">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="font-poster text-2xl sm:text-3xl text-[var(--ink)]/80 flex items-center gap-10">
              {m}
              <span className="text-[var(--red)] text-base">✕</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container-x mt-16 sm:mt-24 grid gap-12 lg:grid-cols-[1.25fr_1fr] items-start">
        {/* animated about-me terminal */}
        <Reveal>
          <AboutTerminal />
        </Reveal>

        {/* principles ledger */}
        <div className="divide-y divide-[var(--line-strong)] border-y border-[var(--line-strong)]">
          {about.principles.map((pr, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={pr.title} delay={i * 0.1}>
                <div className="group relative py-7 flex gap-5 overflow-hidden" data-cursor>
                  <span className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] bg-gradient-to-r from-[var(--red)]/12 to-transparent" />
                  <span className="relative font-poster text-5xl leading-none text-[var(--red)]/90 w-14 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className="text-[var(--red)]" />
                      <h3 className="font-serif text-2xl sm:text-[1.7rem] leading-tight">{pr.title}</h3>
                    </div>
                    <p className="mt-2 text-[14px] text-[var(--muted)] leading-relaxed">{pr.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
