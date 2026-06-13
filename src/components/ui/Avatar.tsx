"use client";

import { useState } from "react";
import { profile } from "@/lib/data";

/** Circular avatar with animated gradient ring. Falls back to the monogram
 *  if /profile.jpg is not present, so the UI always looks intentional. */
export default function Avatar({ size = 34 }: { size?: number }) {
  const [ok, setOk] = useState(true);

  return (
    <span
      className="relative inline-grid place-items-center rounded-full p-[1.5px]"
      style={{
        width: size + 4,
        height: size + 4,
        background: "conic-gradient(from 180deg, #34e7ff, #4d7cff, #8b5cf6, #ff2e9a, #34e7ff)",
      }}
    >
      <span
        className="relative grid place-items-center rounded-full overflow-hidden bg-[var(--bg)]"
        style={{ width: size, height: size }}
      >
        {ok ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/profile.jpg"
            alt={profile.name}
            onError={() => setOk(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display font-semibold text-[12px] text-gradient-cyan">
            {profile.initials}
          </span>
        )}
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--aqua)] border-2 border-[var(--bg)]" />
    </span>
  );
}
