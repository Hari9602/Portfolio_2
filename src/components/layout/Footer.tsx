"use client";

import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import Avatar from "@/components/ui/Avatar";
import { profile, navItems } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] mt-10">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar size={36} />
              <span className="font-display font-semibold text-lg">
                {profile.name}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed">
              {profile.role}. Building secure systems by understanding how they break.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs font-mono text-[var(--aqua)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
              {profile.status}
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {navItems.map((i) => (
                <li key={i.href}>
                  <a
                    href={i.href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: GithubIcon, href: profile.links.github, label: "GitHub" },
                { icon: LinkedinIcon, href: profile.links.linkedin, label: "LinkedIn" },
                { icon: Mail, href: profile.links.email, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid place-items-center h-10 w-10 rounded-xl glass glass-hover"
                  data-cursor
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <a
              href={profile.links.email}
              className="block mt-5 text-sm text-[var(--muted)] hover:text-[var(--cyan)] transition-colors break-all"
            >
              {profile.email}
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[var(--muted)]/70 font-mono">
          <span>© {new Date().getFullYear()} {profile.name}. All systems secured.</span>
          <span>Designed & engineered with an adversarial eye.</span>
        </div>
      </div>
    </footer>
  );
}
