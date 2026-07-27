import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";

export const metadata: Metadata = {
  title: "Pricing — Start free, scale when it works | Safetyline",
  description:
    "Sardauna's ladder: a free AI readiness audit, a one-time build scoped to it (₦300k–₦2M), and a managed retainer (₦40k–₦400k/mo) that keeps the house running and improving.",
};

const check = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="mt-[3px] shrink-0">
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

const TIERS = [
  {
    name: "AI Readiness Audit",
    price: "Free",
    priceSub: "one WhatsApp conversation",
    blurb:
      "We look at how your business actually runs and tell you what a house of agents would take off your plate first.",
    features: [
      "A conversation about your orders, money and busywork",
      "A readiness report: what agents take over first, and why",
      "A scoped build quote — no obligation",
      "You keep the report either way",
    ],
    cta: { label: "Start the free audit", href: "/contact" },
    featured: false,
  },
  {
    name: "The Build",
    price: "₦300k – ₦2M",
    priceSub: "one-time · scoped by your audit",
    blurb:
      "Your house configured and proven: the chief of staff, the departments you need, your data loaded, every agent tested before it touches a customer.",
    features: [
      "Chief of staff + the department agents your audit calls for",
      "WhatsApp wired in; other channels as agreed",
      "Your catalogue, prices and processes loaded",
      "Every agent run through evals before going live",
      "Approvals set up so nothing leaves without you",
    ],
    cta: { label: "Talk to us about a build", href: "/contact" },
    featured: true,
  },
  {
    name: "Managed Retainer",
    price: "₦40k – ₦400k",
    priceSub: "per month · sized to your house",
    blurb:
      "We run, watch and improve the house for you — so it keeps getting better at your business instead of quietly going stale.",
    features: [
      "The house monitored and tuned continuously",
      "New agents added as your needs grow",
      "A monthly review of what every agent did",
      "Priority support from the Safetyline team",
      "Cancel anytime — your data leaves with you",
    ],
    cta: { label: "Discuss a retainer", href: "/contact" },
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      {/* light hero on the waves */}
      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Pricing
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            Start free. <span className="text-dawn-gradient">Scale when it works.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            No subscriptions to nowhere. A free audit tells you what agents can
            do for your business; you pay once to build the house, and only
            keep paying if you want it run and improved for you.
          </p>
        </div>
      </section>

      {/* the three-step ladder */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="grid gap-5 md:grid-cols-3 md:items-stretch">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={
                t.featured
                  ? "bg-azure-dawn glass-ring relative flex flex-col overflow-hidden rounded-[32px] p-7 text-white shadow-[0_40px_90px_rgba(2,6,31,0.45)] sm:p-8"
                  : "liquid-glass glass-ring relative flex flex-col rounded-[32px] p-7 shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:p-8"
              }
            >
              {!t.featured && (
                <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
              )}
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-[var(--color-cyan)]">
                  Most businesses
                </span>
              )}
              <h2 className={`text-[15px] font-bold ${t.featured ? "text-[var(--color-cyan)]" : "text-[var(--color-blue)]"}`}>
                {t.name}
              </h2>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[38px] font-bold leading-none tracking-tight">{t.price}</span>
                <span className={`text-[13px] font-medium ${t.featured ? "text-white/60" : "text-[var(--color-ink-soft)]"}`}>
                  {t.priceSub}
                </span>
              </div>
              <p className={`mt-4 text-[14.5px] leading-relaxed ${t.featured ? "text-white/85" : "text-[var(--color-ink-soft)]"}`}>
                {t.blurb}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={`flex gap-2.5 text-[13.5px] leading-snug ${
                      t.featured ? "text-white/90 [&_svg]:text-[#7ef2a0]" : "text-[var(--color-ink)] [&_svg]:text-[#16a34a]"
                    }`}
                  >
                    {check}
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <a
                  href={t.cta.href}
                  className={
                    t.featured
                      ? "block rounded-full bg-white px-6 py-3.5 text-center text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
                      : "block rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  }
                >
                  {t.cta.label}
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-[12.5px] text-[var(--color-ink-soft)]/80">
          Ranges are indicative — your audit scopes the exact figure before you
          commit to anything.
        </p>
      </section>

      {/* who it's for */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="glass-ring rounded-[32px] bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:px-12">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Who it&apos;s for
          </p>
          <h2 className="text-display-3 mx-auto max-w-2xl">
            Built for businesses ready to delegate
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Sardauna fits teams of roughly 10–100 staff, or businesses doing
            ₦5M+ a month — enough moving parts that a house of agents pays for
            itself. Smaller than that? Take the free audit anyway: we&apos;ll
            tell you honestly if the numbers don&apos;t work for you yet,
            and what to do in the meantime.
          </p>
        </div>
      </section>

      <CTABand />
      <Footer />
    </main>
  );
}
