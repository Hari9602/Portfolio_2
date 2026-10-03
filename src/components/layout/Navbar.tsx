"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { navItems, profile } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div
          className={`transition-all duration-500 border-b ${
            scrolled ? "bg-[#070404]/75 backdrop-blur-xl border-[var(--red)]/20" : "bg-transparent border-transparent"
          }`}
        >
          <nav className="container-x flex items-center justify-between py-3.5">
            <a href="#top" className="flex items-center gap-3 group" data-cursor>
              <Avatar size={32} />
              <span className="glitch font-poster text-[1.35rem] leading-none tracking-[0.04em]">
                {profile.shortName}
                <span className="text-[var(--red)]">.</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative px-2 lg:px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] lg:tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  data-cursor
                >
                  <sup className="mr-1 text-[8px] text-[var(--red)]">0{i + 1}</sup>
                  {item.label}
                  <span className="absolute left-2 right-2 lg:left-3 lg:right-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--red)] transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profile.links.email}
                className="hidden sm:inline-flex md:hidden xl:inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] px-4 py-2 border border-[var(--red)]/40 hover:bg-[var(--red)]/10 transition-colors"
                data-cursor
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)] live-dot" />
                Available
              </a>
              <button
                onClick={() => setOpen(true)}
                className="md:hidden grid place-items-center h-10 w-10 border border-[var(--line-strong)]"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[80] md:hidden bg-[#070404] flex flex-col"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_90%,rgba(255,45,45,0.25),transparent_60%)]" />
            <div className="relative container-x flex justify-between items-center py-4">
              <span className="eyebrow">Navigate</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid place-items-center h-10 w-10 border border-[var(--line-strong)]">
                <X size={20} />
              </button>
            </div>
            <div className="relative container-x flex-1 flex flex-col justify-center gap-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.06 }}
                  className="flex items-baseline gap-4 py-1 border-b border-[var(--line)]"
                >
                  <span className="font-mono text-xs text-[var(--red)]">0{i + 1}</span>
                  <span className="font-poster text-[3.2rem] leading-[1.05]">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
