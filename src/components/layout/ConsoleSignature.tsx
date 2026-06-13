"use client";

import { useEffect } from "react";
import { profile } from "@/lib/data";

export default function ConsoleSignature() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const big = "color:#34e7ff;font-size:22px;font-weight:700;font-family:monospace";
    const dim = "color:#8b95ad;font-size:12px;font-family:monospace";
    const ok = "color:#2ff5c8;font-size:12px;font-family:monospace";

    // eslint-disable-next-line no-console
    console.log("%c⬡ PHANTOM // ACCESS GRANTED", big);
    // eslint-disable-next-line no-console
    console.log(`%c${profile.name} — ${profile.role}`, dim);
    // eslint-disable-next-line no-console
    console.log("%c> You found the console. An attacker's instinct. I like that.", ok);
    // eslint-disable-next-line no-console
    console.log(`%c> Let's talk: ${profile.email}`, dim);
  }, []);

  return null;
}
