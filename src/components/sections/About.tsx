"use client";

import { motion } from "framer-motion";
import { Crosshair, FileSearch, ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import ProfilePortrait from "@/components/ui/ProfilePortrait";
import AboutTerminal from "@/components/ui/AboutTerminal";
import { about } from "@/lib/data";

const icons = [Crosshair, FileSearch, ShieldCheck];

const marquee = [
  "Nmap", "Metasploit", "Wireshark", "Autopsy", "FTK Imager", "Burp Suite",
  "MITRE ATT&CK", "OWASP Top 10", "Python", "Bash", "Linux", "SearchSploit",
  "OSINT", "Cryptography", "Threat Modeling", "Docker",
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="The Operator"
          title="An adversary's instinct. A defender's discipline."
        />

        <div className="mt-14 grid gap-10 lg:gap-12 lg:grid-cols-[0.82fr_1.18fr] items-center">
          {/* 3D animated hologram portrait */}
          <ProfilePortrait />

          {/* animated about-me terminal */}
          <Reveal delay={0.1}>
            <AboutTerminal />
          </Reveal>
        </div>

        {/* principles row */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {about.principles.map((pr, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={pr.title} delay={i * 0.1}>
                <div className="glass glass-hover lift p-5 rounded-2xl h-full">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--violet)]/10 border border-[var(--line-strong)] text-[var(--cyan)]">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-[15px]">
                    {pr.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-[var(--muted)] leading-relaxed">
                    {pr.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* tooling marquee */}
      <div className="mt-20 relative overflow-hidden py-6 border-y border-[var(--line)]">
        <div className="absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />
        <motion.div className="flex gap-8 whitespace-nowrap marquee-track w-max">
          {[...marquee, ...marquee].map((m, i) => (
            <span
              key={i}
              className="font-mono text-sm text-[var(--muted)] flex items-center gap-8"
            >
              {m}
              <span className="text-[var(--cyan)]/40">//</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
