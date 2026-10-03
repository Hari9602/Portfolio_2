"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Crosshair, Network, Fingerprint, Radar, Bug, Server } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { expertise } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

/* procedural "key art" per domain — no images, all gradients + geometry */
const ART = [
  "radial-gradient(circle at 70% 30%, rgba(255,45,45,0.55), transparent 45%), radial-gradient(circle at 20% 80%, rgba(255,107,44,0.3), transparent 50%)",
  "radial-gradient(circle at 30% 25%, rgba(255,107,44,0.5), transparent 45%), conic-gradient(from 210deg at 70% 70%, transparent, rgba(255,45,45,0.35), transparent 30%)",
  "radial-gradient(ellipse at 50% 100%, rgba(224,38,63,0.6), transparent 55%), radial-gradient(circle at 80% 20%, rgba(255,182,72,0.2), transparent 40%)",
  "conic-gradient(from 90deg at 50% 45%, transparent, rgba(255,45,45,0.45), transparent 25%, rgba(255,107,44,0.25), transparent 55%)",
  "radial-gradient(circle at 25% 35%, rgba(255,61,110,0.45), transparent 45%), radial-gradient(circle at 75% 75%, rgba(255,45,45,0.35), transparent 45%)",
  "radial-gradient(circle at 60% 40%, rgba(255,182,72,0.35), transparent 40%), radial-gradient(ellipse at 20% 100%, rgba(255,45,45,0.5), transparent 55%)",
];

const GLYPHS = [Crosshair, Network, Fingerprint, Radar, Bug, Server];

function Panel({ item, idx }: { item: (typeof expertise)[number]; idx: number }) {
  const Glyph = GLYPHS[idx % GLYPHS.length];
  return (
    <article
      data-cursor
      className="xp-card group relative shrink-0 w-[80vw] sm:w-[min(56vw,460px)] lg:w-[min(36vw,520px)] h-[min(74svh,640px)] lg:h-[min(70vh,640px)] overflow-hidden rounded-md border border-[var(--line-strong)] bg-[#0b0606] preserve-3d"
    >
      {/* key art */}
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-[.is-active]:scale-110" style={{ background: ART[idx % ART.length] }} />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute right-[-14%] top-[-10%] h-[66%] aspect-square rounded-full border border-[var(--red)]/40 spin-slow">
        <span className="absolute left-1/2 -top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--red)] shadow-[0_0_12px_var(--red)]" />
      </div>
      <div className="absolute right-[0%] top-[4%] h-[42%] aspect-square rounded-full border border-dashed border-[var(--ember)]/45 spin-slow-rev" />
      <div className="absolute right-[10%] top-[13%] h-[24%] aspect-square grid place-items-center">
        <Glyph
          strokeWidth={1}
          className="h-full w-full text-[var(--red)] drop-shadow-[0_0_18px_rgba(255,45,45,0.85)] transition-transform duration-700 group-hover:scale-110 group-[.is-active]:scale-110 group-hover:rotate-6 group-[.is-active]:rotate-6"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <span className="absolute -left-2 top-4 font-poster stroke-text text-[6.5rem] sm:text-[9rem] leading-none opacity-70">
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div className="relative h-full flex flex-col justify-end p-5 sm:p-9">
        <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.3em] text-[var(--muted)]">
          <span>
            <span className="text-[var(--red)]">{String(idx + 1).padStart(2, "0")}</span> / {String(expertise.length).padStart(2, "0")}
          </span>
          <ArrowUpRight size={18} className="text-[var(--red)] transition-transform duration-500 group-hover:rotate-45 group-[.is-active]:rotate-45" />
        </div>
        <h3 className="mt-3 sm:mt-4 font-serif text-[1.75rem] sm:text-[2.4rem] leading-[1.02] text-[var(--ink)]">{item.title}</h3>
        <p className="mt-3 sm:mt-4 text-[13px] sm:text-[14px] text-[var(--muted)] leading-relaxed">{item.blurb}</p>
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
          {item.capabilities.map((c) => (
            <span
              key={c}
              className="font-mono text-[10.5px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[var(--red)]/30 bg-black/50 text-[var(--ink)]/80"
            >
              {c}
            </span>
          ))}
        </div>
        <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--red)] to-[var(--ember)] transition-transform duration-700 group-hover:scale-x-100 group-[.is-active]:scale-x-100" />
      </div>
    </article>
  );
}

export default function Expertise() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // phone address-bar show/hide must not re-measure the pin mid-swipe
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia();
    // same pinned cover-flow on every screen size; reduced-motion gets a swipe row
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (st) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${st.progress})`;
          },
        },
      });

      // cover-flow: each panel swings through the frame as it passes centre
      gsap.utils.toArray<HTMLElement>(".xp-card", track).forEach((card) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          })
          .fromTo(
            card,
            { rotateY: -32, scale: 0.86, opacity: 0.45 },
            { rotateY: 0, scale: 1, opacity: 1, ease: "none" }
          )
          .to(card, { rotateY: 32, scale: 0.86, opacity: 0.45, ease: "none" });

        // centred panel lights up exactly like hover — works hands-free on touch
        ScrollTrigger.create({
          trigger: card,
          containerAnimation: tween,
          start: "center 65%",
          end: "center 35%",
          toggleClass: "is-active",
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="expertise" className="relative pt-[clamp(6rem,12vw,11rem)]">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Capabilities"
          title="Full-spectrum security expertise"
          subtitle="Six core domains spanning offense, defense, and the infrastructure in between — each backed by hands-on practice and industry certification."
        />
      </div>

      <div
        ref={pinRef}
        className="relative h-[100svh] lg:h-screen flex items-center overflow-hidden motion-reduce:overflow-x-auto motion-reduce:snap-x motion-reduce:snap-mandatory"
      >
        <div
          ref={trackRef}
          className="stage-3d flex flex-row gap-5 lg:gap-10 pl-[10vw] pr-[20vw] lg:pr-[30vw] will-change-transform motion-reduce:[&>*]:snap-center"
        >
          {expertise.map((item, idx) => (
            <Panel key={item.id} item={item} idx={idx} />
          ))}
        </div>

        {/* scrub progress */}
        <div className="absolute bottom-6 lg:bottom-10 left-[10vw] right-[10vw] motion-reduce:hidden">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-3">
            <span>Capabilities</span>
            <span className="text-[var(--red)]">{String(expertise.length).padStart(2, "0")}</span>
          </div>
          <div className="h-px bg-[var(--line-strong)]">
            <div ref={barRef} className="h-px origin-left scale-x-0 bg-gradient-to-r from-[var(--red)] to-[var(--ember)] shadow-[0_0_10px_var(--red)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
