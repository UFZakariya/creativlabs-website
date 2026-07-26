"use client";

/* Rotating positioning statement on the light wave background: the sentence
   ending cycles through three phrasings with an opacity+blur+lift transition.
   The rotating segment is a full-width centered block with absolutely stacked
   variants, so every ending — short or long — is perfectly centered and the
   line never causes layout shift (an invisible ghost reserves the tallest
   variant's height). A visually-hidden static sentence serves screen readers. */

import { useEffect, useState } from "react";

const ENDINGS = [
  "can't get to today.",
  "can't justify a hire for.",
  "shouldn't be doing yourself.",
];

const CYCLE_MS = 2600;

export default function RotatingStatement() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % ENDINGS.length), CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative px-5 py-24 text-center sm:py-36">
      <div className="mx-auto max-w-4xl">
        <img
          src="/logo-640.webp"
          alt=""
          width={96}
          height={101}
          className="mx-auto mb-10 h-24 w-auto drop-shadow-[0_18px_40px_rgba(8,60,255,0.35)]"
        />

        {/* full sentence for assistive tech */}
        <h2 className="sr-only">
          Sardauna is the AI business assistant that does the work you
          can&apos;t get to, can&apos;t justify a hire for, or shouldn&apos;t
          be doing yourself.
        </h2>

        <p aria-hidden className="text-display-2 text-[var(--color-ink)]">
          Sardauna is the AI Business Assistant that does the work you
          <span className="relative mt-1 block w-full">
            {/* ghost sizing: reserves the tallest variant's footprint */}
            <span className="invisible block">
              {ENDINGS.reduce((a, b) => (a.length >= b.length ? a : b))}
            </span>
            {ENDINGS.map((e, i) => (
              <span
                key={e}
                className="text-shimmer-ink absolute inset-0 flex items-center justify-center transition-all duration-500"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.645, 0.045, 0.355, 1)",
                  opacity: i === idx ? 1 : 0,
                  filter: i === idx ? "blur(0)" : "blur(10px)",
                  transform: i === idx ? "translateY(0)" : "translateY(10px)",
                }}
              >
                {e}
              </span>
            ))}
          </span>
        </p>

        <div className="mt-11">
          <a
            href="/contact"
            className="inline-block rounded-full bg-[var(--color-ink)] px-8 py-4 text-[15px] font-semibold text-white shadow-[0_18px_40px_rgba(16,20,42,0.25)] transition-opacity hover:opacity-90"
          >
            Get started for free
          </a>
        </div>
      </div>
    </section>
  );
}
