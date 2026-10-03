import { useSyncExternalStore } from "react";

/* Date helpers for experience tenure. Dates are ISO "YYYY-MM-DD" strings and
   parsed by hand so no timezone shift can move a role into another month. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type YM = { y: number; m: number }; // m: 0-11

function parse(iso: string): YM {
  const [y, m] = iso.split("-").map(Number);
  return { y, m: m - 1 };
}

export function formatMonth(iso: string) {
  const { y, m } = parse(iso);
  return `${MONTHS[m]} ${y}`;
}

export function formatPeriod(start: string, end?: string) {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : "Present"}`;
}

/** Inclusive calendar-month count (LinkedIn convention: Apr–Sep = 6 mos). */
export function monthsBetween(start: string, end: string) {
  const a = parse(start);
  const b = parse(end);
  return Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1);
}

export function formatTenure(months: number) {
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const y = yrs ? `${yrs} yr${yrs > 1 ? "s" : ""}` : "";
  const m = mos ? `${mos} mo${mos > 1 ? "s" : ""}` : "";
  return [y, m].filter(Boolean).join(" ");
}

/* ---------- live "today" (client only) ---------- */

function todayIso() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const HOUR = 60 * 60 * 1000;

function subscribe(onChange: () => void) {
  // an open tab still rolls over to the next month
  const id = window.setInterval(onChange, HOUR);
  return () => window.clearInterval(id);
}

/** Today's ISO date on the client; null during static render / hydration. */
export function useToday(): string | null {
  return useSyncExternalStore(subscribe, todayIso, () => null);
}

/** Tenure label for a role. Ended roles are deterministic (render statically);
 *  ongoing roles resolve on the client from the visitor's current date. */
export function useTenure(start: string, end?: string): string | null {
  const today = useToday();
  if (end) return formatTenure(monthsBetween(start, end));
  return today ? formatTenure(monthsBetween(start, today)) : null;
}
