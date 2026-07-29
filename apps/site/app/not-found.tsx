import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import Footer from "@/components/Footer";

/* Without this file a bad URL — or any notFound() from the case-study route —
   rendered Next's stock 404: unbranded, and with no way back into the site. */
export const metadata: Metadata = {
  title: "Page not found | Safetyline",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/customers", label: "Customers" },
  { href: "/pricing", label: "Pricing" },
];

export default function NotFound() {
  return (
    <main id="main">
      <WaveBackground />
      <Navbar onLight />

      <section className="px-5 pb-24 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-2xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            404
          </p>
          <h1 className="text-display-1 text-[var(--color-ink)]">
            That page isn&apos;t <span className="text-dawn-gradient">here.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            The link may be old, or we may have moved it. Here&apos;s the way
            back in — or ask Bari or Biba in the chat and they&apos;ll point you
            at the right page.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Back to the homepage
            </Link>
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-5 py-3 text-sm font-semibold text-[var(--color-blue)] transition-colors hover:bg-[var(--color-blue)]/10"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
