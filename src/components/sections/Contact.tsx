"use client";

import { motion } from "framer-motion";
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

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative glass border-gradient rounded-[28px] overflow-hidden p-8 sm:p-14">
          <div className="aurora opacity-60" />
          <div className="grid-bg opacity-50" />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
                  <span className="font-mono text-[11px] text-[var(--muted)]">
                    {profile.status}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.0] tracking-tight">
                  Let&apos;s find the
                  <br />
                  <span className="text-gradient">gaps before they do.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 text-[var(--muted)] text-base max-w-md leading-relaxed">
                  Open to penetration testing roles, security engineering positions, and
                  collaborative research. If you need someone who thinks like an attacker
                  and ships like a defender — let&apos;s talk.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Magnetic>
                    <a href={profile.links.email} className="btn-primary" data-cursor>
                      Start a conversation
                      <ArrowUpRight size={18} />
                    </a>
                  </Magnetic>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--muted)] font-mono">
                    <MapPin size={14} className="text-[var(--cyan)]" />
                    {profile.location}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {channels.map((c, i) => (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group glass glass-hover lift rounded-2xl p-5"
                >
                  <c.icon size={18} className="text-[var(--cyan)]" />
                  <div className="mt-4">
                    <p className="eyebrow !text-[var(--muted)]">{c.label}</p>
                    <p className="mt-1 text-[13.5px] text-[var(--ink)]/90 group-hover:text-[var(--cyan)] transition-colors truncate">
                      {c.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
