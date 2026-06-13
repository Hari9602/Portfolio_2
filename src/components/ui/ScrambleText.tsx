"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+/<>?@";

/**
 * Decrypts text on view: each character settles from random glyphs to its
 * final value, left to right. Tasteful, SOC-terminal flavour — not a gimmick.
 */
export default function ScrambleText({
  text,
  className,
  as: Tag = "span",
  speed = 28,
  trigger = "view",
}: {
  text: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "p";
  speed?: number;
  trigger?: "view" | "mount";
}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      let frame = 0;
      const total = text.length;
      const interval = window.setInterval(() => {
        frame++;
        const revealed = Math.floor(frame / 2);
        let out = "";
        for (let i = 0; i < total; i++) {
          if (text[i] === " ") {
            out += " ";
          } else if (i < revealed) {
            out += text[i];
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(out);
        if (revealed >= total) {
          setDisplay(text);
          window.clearInterval(interval);
        }
      }, speed);
    };

    if (trigger === "mount") {
      run();
      return;
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed, trigger]);

  return (
    // @ts-expect-error dynamic tag with ref
    <Tag ref={ref} className={className} aria-label={text}>
      {display}
    </Tag>
  );
}
