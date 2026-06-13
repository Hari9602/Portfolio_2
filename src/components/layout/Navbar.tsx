"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { navItems, profile } from "@/lib/data";

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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            scrolled
              ? "mt-3 max-w-5xl glass rounded-full"
              : "mt-0 max-w-full rounded-none border-transparent bg-transparent"
          }`}
        >
          <nav className="flex items-center justify-between px-5 sm:px-6 py-3.5">
            <a href="#top" className="flex items-center gap-2.5 group" data-cursor>
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] text-[#04060f]">
                <Shield size={16} strokeWidth={2.5} />
              </span>
              <span className="glitch font-display font-semibold tracking-tight text-[15px]">
                {profile.shortName}
                <span className="text-[var(--cyan)]">.</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 text-[13.5px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors rounded-full hover:bg-white/[0.04]"
                  data-cursor
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profile.links.email}
                className="hidden sm:inline-flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full border border-[var(--line-strong)] hover:border-[var(--cyan)]/50 hover:bg-[var(--cyan)]/[0.06] transition-all"
                data-cursor
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
                Available
              </a>
              <button
                onClick={() => setOpen(true)}
                className="md:hidden grid place-items-center h-9 w-9 rounded-lg border border-[var(--line-strong)]"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] md:hidden"
          >
            <div
              className="absolute inset-0 bg-[var(--bg)]/90 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              className="absolute right-0 top-0 bottom-0 w-[78%] max-w-sm glass border-l p-7 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="eyebrow">Navigate</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="font-display text-2xl py-2 border-b border-[var(--line)]"
                  >
                    <span className="text-[var(--cyan)] font-mono text-sm mr-3">
                      0{i + 1}
                    </span>
                    {item.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
