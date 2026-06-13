"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "trajectory", label: "Trajectory" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

export default function ScrollSpy() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActive(id);
        },
        { rootMargin: "-45% 0px -45% 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3.5"
    >
      {SECTIONS.map(({ id, label }) => {
        const on = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-3"
            aria-current={on ? "true" : undefined}
          >
            <span
              className={`relative h-px transition-all duration-500 ${
                on ? "w-8 bg-[var(--cyan)]" : "w-4 bg-[var(--line-strong)] group-hover:w-6"
              }`}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                on
                  ? "text-[var(--cyan)] opacity-100"
                  : "text-[var(--muted)] opacity-0 group-hover:opacity-100"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
