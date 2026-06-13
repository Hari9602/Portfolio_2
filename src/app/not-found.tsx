import Link from "next/link";

export const metadata = { title: "404 — Access Denied" };

export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] grid place-items-center overflow-hidden">
      <div className="aurora" />
      <div className="grid-bg" />
      <div className="relative text-center px-6">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--magenta)]">
          403 / 404 · unauthorized path
        </p>
        <h1 className="mt-4 font-display text-[clamp(4rem,16vw,10rem)] font-bold leading-none text-gradient">
          404
        </h1>
        <p className="mt-4 font-mono text-sm text-[var(--muted)] max-w-md mx-auto">
          <span className="text-[var(--cyan)]">$</span> this resource is out of scope —
          no route matched the request.
        </p>
        <Link href="/" className="btn-primary mt-9 inline-flex">
          Return to safe zone
        </Link>
      </div>
    </main>
  );
}
