"use client";

import { useEffect, useRef, useState } from "react";
import { profile, about, stats } from "@/lib/data";

type Kind = "cmd" | "out" | "ok" | "blank" | "head";
type Line = { kind: Kind; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "head", text: `${profile.name.toLowerCase().replace(/\s+/g, "_")}` },
  { kind: "out", text: `${profile.role}` },
  { kind: "blank", text: "" },
  { kind: "cmd", text: "cat ./operator.profile" },
  { kind: "out", text: about.lead },
  { kind: "blank", text: "" },
  { kind: "cmd", text: "./about --verbose" },
  ...about.body.map((b) => ({ kind: "out" as const, text: b })),
  { kind: "blank", text: "" },
  { kind: "cmd", text: "stat --highlights" },
  {
    kind: "out",
    text: stats.map((s) => `${s.value} ${s.label.split(" · ")[0]}`).join("   ·   "),
  },
  { kind: "blank", text: "" },
  { kind: "cmd", text: "status --availability" },
  { kind: "ok", text: "[ READY ]  systems nominal — available for engagement" },
];

export default function AboutTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<Line[]>([]);
  const [typing, setTyping] = useState<Line | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));

    const scrollDown = () => {
      const b = bodyRef.current;
      if (b) b.scrollTop = b.scrollHeight;
    };

    async function run() {
      if (reduce) {
        setDone(SCRIPT);
        return;
      }
      // eslint-disable-next-line no-constant-condition
      while (!cancelled) {
        setDone([]);
        setTyping(null);
        let first = true;
        for (const line of SCRIPT) {
          if (cancelled) return;
          if (line.kind === "cmd") {
            // a breather before each new command so the eye can settle
            if (!first) await wait(750);
            first = false;
            for (let i = 1; i <= line.text.length; i++) {
              if (cancelled) return;
              setTyping({ kind: "cmd", text: line.text.slice(0, i) });
              scrollDown();
              await wait(60 + Math.random() * 45); // slower, deliberate typing
            }
            await wait(520);
            setDone((p) => [...p, line]);
            setTyping(null);
          } else {
            // slower, readable line-by-line output reveal
            await wait(line.kind === "blank" ? 260 : 620);
            if (cancelled) return;
            setDone((p) => [...p, line]);
            scrollDown();
          }
        }
        // hold the finished output long enough to read it, then replay
        await wait(11000);
      }
    }

    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting && !started.current) {
          started.current = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      io.disconnect();
    };
  }, []);

  const renderLine = (l: Line, key: number, isTyping = false) => {
    if (l.kind === "blank") return <div key={key} className="h-3" />;
    if (l.kind === "cmd")
      return (
        <div key={key} className="flex flex-wrap gap-x-2 gap-y-0.5 text-[var(--ink)]">
          <span className="text-[var(--aqua)] select-none shrink-0">
            <span className="hidden sm:inline">harikrishnan@</span>phantom
            <span className="text-[var(--muted)]">:~$</span>
          </span>
          <span className="text-[var(--cyan)] break-all">
            {l.text}
            {isTyping && <span className="term-caret">▋</span>}
          </span>
        </div>
      );
    if (l.kind === "head")
      return (
        <div key={key} className="font-display text-base text-gradient-cyan font-semibold">
          {l.text}
        </div>
      );
    if (l.kind === "ok")
      return (
        <div key={key} className="text-[var(--aqua)]">
          {l.text}
        </div>
      );
    return (
      <div key={key} className="text-[var(--muted)] leading-relaxed">
        {l.text}
      </div>
    );
  };

  return (
    <div ref={ref} className="w-full">
      <div className="glass border-gradient rounded-2xl overflow-hidden shadow-[0_30px_80px_-40px_rgba(52,231,255,0.45)]">
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)] bg-white/[0.02]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[11px] text-[var(--muted)]">
            operator@phantom — ~/about
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[var(--aqua)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--aqua)] live-dot" />
            live
          </span>
        </div>

        {/* body */}
        <div
          ref={bodyRef}
          className="font-mono text-[11px] sm:text-[13px] p-4 sm:p-5 h-[360px] sm:h-[420px] overflow-y-auto overflow-x-hidden space-y-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {done.map((l, i) => renderLine(l, i))}
          {typing && renderLine(typing, -1, true)}
          {!typing && done.length > 0 && (
            <div className="flex gap-2 text-[var(--ink)]">
              <span className="text-[var(--aqua)] select-none">
                <span className="hidden sm:inline">harikrishnan@</span>phantom
                <span className="text-[var(--muted)]">:~$</span>
              </span>
              <span className="term-caret text-[var(--cyan)]">▋</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
