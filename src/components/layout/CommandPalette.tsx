"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Command,
  Search,
  CornerDownLeft,
  Mail,
  ArrowRight,
  Crosshair,
  FileSearch,
  Trophy,
  BadgeCheck,
  User,
  FolderGit2,
  Briefcase,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/lib/data";

type Item = {
  label: string;
  hint: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (hash: string) => () => {
    setOpen(false);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };
  const ext = (url: string) => () => {
    setOpen(false);
    window.open(url, url.startsWith("http") ? "_blank" : "_self");
  };

  const items: Item[] = useMemo(
    () => [
      { label: "About", hint: "The operator", icon: User, action: go("#about"), keywords: "bio profile" },
      { label: "Experience", hint: "VAPT Intern", icon: Briefcase, action: go("#experience"), keywords: "work job internship bima sugam" },
      { label: "Expertise", hint: "Capabilities", icon: Crosshair, action: go("#expertise"), keywords: "skills vapt" },
      { label: "Case Studies", hint: "Field work", icon: FolderGit2, action: go("#projects"), keywords: "projects work" },
      { label: "Skills", hint: "Proficiency", icon: FileSearch, action: go("#skills") },
      { label: "Trajectory", hint: "Timeline", icon: ArrowRight, action: go("#trajectory"), keywords: "education journey" },
      { label: "Credentials", hint: "Certs & awards", icon: BadgeCheck, action: go("#credentials"), keywords: "certifications" },
      { label: "Achievements", hint: "CTF record", icon: Trophy, action: go("#credentials") },
      { label: "Contact", hint: "Get in touch", icon: Mail, action: go("#contact") },
      { label: "Send Email", hint: profile.email, icon: Mail, action: ext(profile.links.email), keywords: "mail reach" },
      { label: "GitHub", hint: "@Hari9602", icon: GithubIcon, action: ext(profile.links.github) },
      { label: "LinkedIn", hint: "harikrishnan-v-j", icon: LinkedinIcon, action: ext(profile.links.linkedin) },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.hint} ${i.keywords ?? ""}`.toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.action();
    }
  };

  return (
    <>
      {/* trigger chip (desktop) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden md:flex items-center gap-2 glass glass-hover rounded-full pl-3.5 pr-2.5 py-2.5 text-[12.5px] text-[var(--muted)]"
        data-cursor
        aria-label="Open command palette"
      >
        <Command size={13} className="text-[var(--cyan)]" />
        <span>Quick nav</span>
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-[var(--line)]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] grid place-items-start justify-center pt-[14vh] px-4"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-[var(--bg)]/70 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onListKey}
              className="relative w-full max-w-xl glass border-gradient rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)]">
                <Search size={17} className="text-[var(--muted)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, links, actions…"
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[var(--muted)]/60"
                />
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-[var(--line)] text-[var(--muted)]">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <div className="px-3 py-8 text-center text-[var(--muted)] text-sm font-mono">
                    no matches — try “contact” or “projects”
                  </div>
                )}
                {filtered.map((item, i) => (
                  <button
                    key={item.label}
                    onMouseEnter={() => setActive(i)}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      i === active ? "bg-[var(--cyan)]/[0.1]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`grid place-items-center h-8 w-8 rounded-lg border ${
                        i === active
                          ? "border-[var(--cyan)]/40 text-[var(--cyan)]"
                          : "border-[var(--line)] text-[var(--muted)]"
                      }`}
                    >
                      <item.icon size={15} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-[var(--ink)]">{item.label}</div>
                      <div className="text-[11.5px] text-[var(--muted)] truncate">
                        {item.hint}
                      </div>
                    </div>
                    {i === active && (
                      <CornerDownLeft size={14} className="text-[var(--muted)]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--line)] font-mono text-[10.5px] text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)]" /> secure session
                </span>
                <span>↑↓ navigate · ↵ select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
