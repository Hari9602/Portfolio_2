"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, ArrowUpRight, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import { profile } from "@/lib/data";

const channels = [
  { icon: Mail, label: "Email", value: profile.email, href: profile.links.email },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { icon: LinkedinIcon, label: "LinkedIn", value: "harikrishnan-v-j", href: profile.links.linkedin },
  { icon: GithubIcon, label: "GitHub", value: "Hari9602", href: profile.links.github },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rowA = useTransform(scrollYProgress, [0, 1], ["8%", "-38%"]);
  const rowB = useTransform(scrollYProgress, [0, 1], ["-40%", "6%"]);

  return (
    <section ref={ref} id="contact" className="section overflow-hidden">
      <div className="absolute inset-x-0 top-1/3 h-[60%] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(255,40,25,0.2),transparent_70%)] pointer-events-none" />

      {/* giant scroll-driven headline */}
      <h2 className="relative select-none" aria-label="Let's find the gaps before they do.">
        <motion.span aria-hidden style={{ x: rowA }} className="block whitespace-nowrap font-poster text-[clamp(4.5rem,15vw,15rem)] leading-[0.86] text-[var(--ink)]">
          Let&apos;s find the &nbsp;<span className="stroke-text">Let&apos;s find the</span>&nbsp; Let&apos;s find the
        </motion.span>
        <motion.span aria-hidden style={{ x: rowB }} className="block whitespace-nowrap font-poster text-[clamp(4.5rem,15vw,15rem)] leading-[0.86] ember-fill">
          gaps before they do. &nbsp;gaps before they do. &nbsp;gaps before they do.
        </motion.span>
      </h2>

      <div className="container-x relative mt-16 sm:mt-24 grid gap-14 lg:grid-cols-[1fr_1.15fr] items-start">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2.5 border border-[var(--red)]/40 bg-[var(--red)]/[0.07] px-3.5 py-1.5 mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)] live-dot" />
              <span className="font-mono text-[11px] text-[var(--ink)]/80">{profile.status}</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="font-serif text-[1.5rem] sm:text-[1.9rem] leading-snug text-[var(--ink)]/90 max-w-lg">
              Open to penetration testing roles, security engineering positions, and
              collaborative research. If you need someone who thinks like an attacker
              and ships like a defender — let&apos;s talk.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Magnetic>
                <a href={profile.links.email} className="btn-primary" data-cursor>
                  Start a conversation
                  <ArrowUpRight size={16} />
                </a>
              </Magnetic>
              <div className="flex items-center gap-2 text-[13px] text-[var(--muted)] font-mono">
                <MapPin size={14} className="text-[var(--red)]" />
                {profile.location}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="border-t border-[var(--line-strong)]">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              data-cursor
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.08 }}
              className="group relative flex items-center gap-5 py-6 border-b border-[var(--line-strong)] overflow-hidden"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-[var(--red)] to-[#b5101c] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
              <c.icon size={18} className="relative text-[var(--red)] group-hover:text-white transition-colors" />
              <span className="relative font-mono text-[10.5px] uppercase tracking-[0.3em] text-[var(--muted)] group-hover:text-white/80 w-20 shrink-0 transition-colors">
                {c.label}
              </span>
              <span className="relative flex-1 min-w-0 truncate font-serif text-xl sm:text-2xl text-[var(--ink)] group-hover:text-white transition-colors">
                {c.value}
              </span>
              <ArrowUpRight size={20} className="relative text-[var(--muted)] group-hover:text-white group-hover:rotate-45 transition-all duration-500" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
