/* Shared template for the four SEO landing routes carried over from the old
   site (same URLs, rewritten to Sardauna positioning). Server component. */

import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export type SeoLandingProps = {
  eyebrow: string;
  h1: [string, string];
  intro: string;
  points: { title: string; body: string }[];
  proof?: { text: string; href: string; label: string };
};

export default function SeoLanding({ eyebrow, h1, intro, points, proof }: SeoLandingProps) {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            {eyebrow}
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            {h1[0]} <span className="text-dawn-gradient">{h1[1]}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {intro}
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
              See how Sardauna works
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 sm:pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {points.map((p) => (
            <div
              key={p.title}
              className="glass-ring rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
            >
              <h2 className="text-lg font-bold tracking-tight text-[var(--color-blue)]">{p.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{p.body}</p>
            </div>
          ))}
        </div>
        {proof && (
          <div className="bg-azure-dawn mt-6 rounded-[32px] px-6 py-10 text-center">
            <p className="mx-auto max-w-2xl text-[16px] font-medium leading-relaxed text-white/90">
              {proof.text}
            </p>
            <a
              href={proof.href}
              className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
            >
              {proof.label}
            </a>
          </div>
        )}
      </section>

      <CTABand />
      <Footer />
    </main>
  );
}
