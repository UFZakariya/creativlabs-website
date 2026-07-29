"use client";

import { useEffect } from "react";
import Link from "next/link";

/* There was no error boundary anywhere under app/, so any render error in a
   client component took the whole route to Next's default error screen. This
   keeps a broken section from costing us the page — and the visitor a way to
   reach us. Deliberately dependency-free: it must render even if a shared
   component is what failed. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="page-bg grid min-h-dvh place-items-center px-5 py-24 text-center">
      <div className="mx-auto max-w-xl">
        <h1 className="text-display-2 text-[var(--color-ink)]">
          Something went wrong on our side.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          This one is on us, not on you. Try again — and if it keeps happening,
          message us on WhatsApp and we&apos;ll sort it out.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-5 py-3 text-sm font-semibold text-[var(--color-blue)] transition-colors hover:bg-[var(--color-blue)]/10"
          >
            Back to the homepage
          </Link>
          <a
            href="https://wa.me/2348102354786"
            className="rounded-full border border-[var(--color-blue)]/25 px-5 py-3 text-sm font-semibold text-[var(--color-blue)] transition-colors hover:bg-[var(--color-blue)]/10"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </main>
  );
}
