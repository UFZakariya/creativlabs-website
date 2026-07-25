"use client";

/* Floating glass pill navbar: 3-column on desktop, compact pill + sheet on
   mobile, gains a solid surface once scrolled off the hero. Original build. */

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/channels", label: "Channels" },
  { href: "/customers", label: "Customers" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar({ onLight = false }: { onLight?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const dark = !scrolled && !onLight; // white text only over dark heroes
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div
        className={`glass-surface glass-ring mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pl-4 pr-2 transition-shadow duration-500 ${
          scrolled ? "shadow-[0_12px_40px_rgba(2,6,31,0.25)]" : ""
        }`}
        style={scrolled ? { background: "rgba(255,255,255,0.82)" } : undefined}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-128.png" alt="" width={30} height={32} />
          <span
            className={`text-[15px] font-bold tracking-tight ${
              !dark ? "text-[var(--color-ink)]" : "text-white"
            }`}
          >
            Safetyline
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                !dark
                  ? "text-[var(--color-ink-soft)] hover:text-[var(--color-blue)]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${
              !dark ? "text-[var(--color-ink)]" : "text-white"
            }`}
          >
            <span className="flex flex-col gap-[5px]">
              <span className="h-[2px] w-5 rounded bg-current" />
              <span className="h-[2px] w-5 rounded bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="glass-surface glass-ring mx-auto mt-2 flex max-w-5xl flex-col gap-1 rounded-3xl bg-white/90 p-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-[var(--color-ink)] hover:bg-black/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
