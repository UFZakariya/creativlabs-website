import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";

export const metadata: Metadata = {
  title: "Pricing — Start free, scale when it works | Safetyline",
  description:
    "Sardauna's four-tier ladder: get seen free with Presence, get answered 24/7, get your whole back office run, or get custom systems built for you. Naira-billed, WhatsApp-first, priced with you before you commit.",
};

const check = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="mt-[3px] shrink-0">
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

const TIERS = [
  {
    name: "Presence",
    price: "Free",
    priceSub: "tier 1 · get seen",
    blurb:
      "Get your business onto the platform and see it work — a clean website, a WhatsApp door for customers, and a mini-audit of what an AI employee would take off your plate.",
    features: [
      "A professional business website — one clean template",
      "AI-readiness & WhatsApp-response mini-audit",
      "Basic contact capture, consent-gated",
      "WhatsApp click-to-chat wired to your number",
    ],
    cta: { label: "Start free", href: "/contact" },
    featured: false,
  },
  {
    name: "Answered",
    price: "Monthly",
    priceSub: "tier 2 · get answered · naira-billed",
    blurb:
      "The core AI-employee promise: your business stops losing enquiries. Messages, calls, bookings and reviews — answered around the clock on your site and WhatsApp.",
    features: [
      "AI chat that answers 24/7 — website and WhatsApp",
      "Online booking and calendar",
      "Missed-call text-back, so no enquiry rings out",
      "Review automation",
      "CRM, contacts and a lead pipeline",
      "Basic content & social",
    ],
    cta: { label: "Get answered", href: "/contact" },
    featured: true,
  },
  {
    name: "Run",
    price: "Monthly",
    priceSub: "tier 3 · get run · naira-billed",
    blurb:
      "Your business isn't just answered — it's operated. The full back-office AI staff: money, follow-ups, funnels, compliance, content and a daily brief.",
    features: [
      "Follow-up sequences, nurture and a funnel builder",
      "Unified inbox across your channels",
      "Finance & invoicing — NGN, WHT/VAT-aware — plus proposals",
      "Support tickets and multi-channel social",
      "Compliance calendar (Nigeria), SOPs, operating plans and the daily brief",
      "The full AI-staff org — voice AI receptionist as a premium add-on",
    ],
    cta: { label: "Talk about Run", href: "/contact" },
    featured: false,
  },
  {
    name: "Built for you",
    price: "Per project",
    priceSub: "tier 4 · on top of any tier",
    blurb:
      "A services engagement layered on any subscription: we design and build the custom AI systems your business needs, on a delivery board you can watch.",
    features: [
      "Custom AI systems and automation builds",
      "A projects & delivery board with honest status",
      "Scoped and quoted before any work starts",
      "Layers on whichever tier you're on",
    ],
    cta: { label: "Scope a build", href: "/contact" },
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
            No subscriptions. No charges. That&apos;s how you start — Presence
            is free. From there the ladder is a clean climb: get answered, get
            run, get built for you — each step naira-billed, and only when you
            choose it.
          </p>
        </div>
      </section>

      {/* the four-tier ladder */}
      <section className="mx-auto max-w-7xl px-5 pb-8">
        <div className="grid gap-5 md:grid-cols-2 md:items-stretch xl:grid-cols-4">
          {TIERS.map((t) => (
            <article
              key={t.name}
              className={
                t.featured
                  ? "bg-azure-dawn glass-ring relative flex flex-col overflow-hidden rounded-[32px] p-7 text-white shadow-[0_40px_90px_rgba(2,6,31,0.45)]"
                  : "liquid-glass glass-ring relative flex flex-col rounded-[32px] p-7 shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
              }
            >
              {!t.featured && (
                <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
              )}
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-[var(--color-cyan)]">
                  The core promise
                </span>
              )}
              <h2 className={`text-[15px] font-bold ${t.featured ? "text-[var(--color-cyan)]" : "text-[var(--color-blue)]"}`}>
                {t.name}
              </h2>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[32px] font-bold leading-none tracking-tight">{t.price}</span>
              </div>
              <p className={`mt-1.5 text-[13px] font-medium ${t.featured ? "text-white/60" : "text-[var(--color-ink-soft)]"}`}>
                {t.priceSub}
              </p>
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
          Price bands are being finalised. Until they&apos;re published, every
          paid tier is priced with you on the intro call — real numbers, in
          naira, before you commit to anything.
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
            Sardauna&apos;s full staff pays for itself fastest in teams of
            roughly 10–100 people, or businesses doing ₦5M+ a month — enough
            moving parts for Run to earn its keep. Smaller than that? Start on
            Presence — it&apos;s free — and climb the ladder when the
            enquiries justify it.
          </p>
        </div>
      </section>

      <CTABand />
      <Footer />
    </main>
  );
}
