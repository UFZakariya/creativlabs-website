import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import UseCaseThreads from "@/components/UseCaseThreads";
import SpotlightRows from "@/components/SpotlightRows";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Use cases — See the house at work | Safetyline",
  description:
    "Five department threads from a running house of agents — plus the same house answering Instagram DMs: support answered, leads qualified, stock reordered under your approval, books kept current, and a daily brief that tells you the whole story.",
};

export default function UseCasesPage() {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      {/* light hero on the waves */}
      <section className="px-5 pb-16 pt-36 text-center sm:pb-20 sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Use cases
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            See the house <span className="text-dawn-gradient">at work.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Five departments, one chief of staff, real conversations. Pick a
            thread below and watch how orders, money, stock and growth move
            through Sardauna — on WhatsApp or in your Instagram DMs, with you
            approving what matters.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start with a free readiness audit
            </a>
            <a
              href="/product"
              className="glass-ring rounded-full bg-white/70 px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] backdrop-blur-sm transition-opacity hover:opacity-80"
            >
              Explore the product
            </a>
          </div>
        </div>
      </section>

      {/* the tabbed starter demo */}
      <UseCaseThreads />

      {/* one order followed through the house */}
      <SpotlightRows />

      <CTABand />
      <Footer />
    </main>
  );
}
