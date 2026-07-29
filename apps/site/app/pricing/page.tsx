import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";
import TiltCard from "@/components/TiltCard";
import TierName, { type TierKey } from "@/components/TierName";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" },
  title: "Pricing — Start free, scale when it works | Safetyline",
  description:
    "Sardauna's four tiers: Lite is free (we keep 2.5% of remote sales), Plus+ is ₦19,999/month, Elite ₦49,999/month with payments integrated, and Premier is a custom build priced per project.",
};

const check = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="mt-[3px] shrink-0">
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

type Tier = {
  name: string;
  tier: TierKey;
  price: string;
  priceSub: string;
  blurb: string;
  features: string[];
  cta: { label: string; href: string };
  featured: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Sardauna Lite",
    tier: "lite",
    price: "Free",
    priceSub: "tier 1 · get seen · 2.5% of remote sales",
    blurb:
      "Get your business onto the platform and see it work — a clean website, a WhatsApp door for customers, and a mini-audit of what an AI employee would take off your plate. No monthly fee: we earn 2.5% of the remote sales the platform brings you, so it only costs you when it works.",
    features: [
      "A professional business website — one clean template",
      "AI-readiness & WhatsApp-response mini-audit",
      "Basic contact capture, consent-gated",
      "WhatsApp click-to-chat wired to your number",
      "No monthly fee — 2.5% of remote sales instead",
    ],
    cta: { label: "Start free", href: "/contact" },
    featured: false,
  },
  {
    name: "Sardauna Plus+",
    tier: "plus",
    price: "₦19,999",
    priceSub: "per month · tier 2 · get answered",
    blurb:
      "The core AI-employee promise: your business stops losing enquiries. Messages, calls, bookings and reviews — answered around the clock on your site and WhatsApp.",
    features: [
      "Everything in Sardauna Lite, plus:",
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
    name: "Sardauna Elite",
    tier: "elite",
    price: "₦49,999",
    priceSub: "per month · tier 3 · get run",
    blurb:
      "Your business isn't just answered — it's operated. The full back-office AI staff: money, follow-ups, funnels, compliance, content and a daily brief.",
    features: [
      "Everything in Sardauna Plus+, plus:",
      "Payments integrated — Paystack, Moniepoint, OPay and the rest",
      "Follow-up sequences, nurture and a funnel builder",
      "Unified inbox across your channels",
      "Finance & invoicing — NGN, WHT/VAT-aware — plus proposals",
      "Support tickets and multi-channel social",
      "Compliance calendar (Nigeria), SOPs, operating plans and the daily brief",
      "The full AI-staff org — voice AI receptionist as a premium add-on",
    ],
    cta: { label: "Talk about Elite", href: "/contact" },
    featured: false,
  },
  {
    name: "Sardauna Premier",
    tier: "premier",
    price: "Per project",
    priceSub: "tier 4 · on top of any tier",
    blurb:
      "A full custom build: every feature above, plus the systems your business needs that nothing off the shelf covers — designed, built and delivered on a board you can watch.",
    features: [
      "Everything in Sardauna Elite, plus:",
      "Full custom build — bespoke features on demand",
      "Custom AI systems and automation builds",
      "A projects & delivery board with honest status",
      "Scoped and quoted before any work starts",
    ],
    cta: { label: "Scope a build", href: "/contact" },
    featured: false,
  },
];

/* the three monthly rungs render as columns; Premier is a project
   engagement layered on any of them, so it gets its own wide row below */
const SUBSCRIPTION_TIERS = TIERS.filter((t) => t.tier !== "premier");
const PREMIER = TIERS.find((t) => t.tier === "premier")!;

export default function PricingPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>

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
            Start with nothing to pay. Sardauna Lite is free — we simply keep
            2.5% of the remote sales it brings you, so it only earns when you
            do. From there the ladder is a clean climb: get answered on Plus+
            at &#8358;19,999 a month, get your back office run on Elite at
            &#8358;49,999, and get built for you on Premier — priced per
            project. Naira-billed, and only when you choose it.
          </p>
        </div>
      </section>

      {/* the ladder. One grid holds all four: on a phone they stack, on a
          tablet they land 2x2 (Premier beside Elite), and on desktop the three
          monthly rungs are columns with Premier spanning beneath them —
          it isn't a monthly rung but a project engagement layered on any tier */}
      <section className="mx-auto max-w-7xl px-5 pb-8">
        {/* the row is pulled in from the full width and centred; 85% is about
            as narrow as it goes while the display-size nameplates still sit on
            one line (the longest, "Sardauna Plus+", needs ~271px of text) */}
        <div className="mx-auto grid gap-5 md:grid-cols-2 md:items-stretch xl:w-[85%] xl:grid-cols-3">
          {SUBSCRIPTION_TIERS.map((t, ti) => (
            <Reveal key={t.name} delay={ti * 0.08} className="h-full">
            <TiltCard maxTilt={6} className="h-full">
            <article
              className={
                t.featured
                  ? "bg-azure-dawn-card glass-ring relative flex h-full flex-col overflow-hidden rounded-[32px] p-7 text-white shadow-[0_40px_90px_rgba(2,6,31,0.45)]"
                  : "liquid-glass glass-ring relative flex h-full flex-col rounded-[32px] p-7 shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
              }
            >
              {!t.featured && (
                <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
              )}
              {/* the badge keeps its own row on every card (empty when not
                  featured) so the nameplates below stay on one baseline —
                  absolute positioning collided with the display-size name */}
              <div className="mb-2.5 flex h-7 items-center justify-end">
                {t.featured && (
                  <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-white">
                    The core promise
                  </span>
                )}
              </div>
              <h2 className={`text-[32px] font-bold tracking-tight ${t.featured ? "text-[var(--color-cyan)]" : "text-[var(--color-blue)]"}`}>
                <TierName tier={t.tier} />
              </h2>
              <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[15px] font-bold leading-none tracking-tight">{t.price}</span>
              </div>
              <p className={`mt-1.5 text-[13px] font-medium ${t.featured ? "text-white/70" : "text-[var(--color-ink-soft)]"}`}>
                {t.priceSub}
              </p>
              <p className={`mt-4 text-[14.5px] leading-relaxed ${t.featured ? "text-white/90" : "text-[var(--color-ink-soft)]"}`}>
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
            </TiltCard>
            </Reveal>
          ))}

          {/* Premier — the blue azure-dawn card. A plain cell up to tablet (so
              it lands beside Elite in the 2x2); on desktop it spans the three
              columns at 82.35% of this 85% row, which is 70% of the section */}
          <Reveal delay={0.24} className="block h-full xl:col-span-3">
            <div className="mx-auto h-full w-full xl:w-[82.35%]">
              <TiltCard maxTilt={3} className="h-full">
                {/* two columns on desktop (pitch above its CTA, features
                    alongside); narrower than that it flows pitch -> features ->
                    CTA, so nobody meets the button before they know what it buys */}
                <article className="bg-azure-dawn-card glass-ring relative flex h-full flex-col gap-8 overflow-hidden rounded-[32px] p-8 text-white shadow-[0_40px_90px_rgba(2,6,31,0.45)] xl:grid xl:grid-cols-2 xl:items-start xl:gap-x-12 xl:gap-y-8 xl:p-11">
                  <div className="xl:col-start-1 xl:row-start-1">
                    <h2 className="text-[32px] font-bold tracking-tight text-[var(--color-cyan)]">
                      <TierName tier={PREMIER.tier} />
                    </h2>
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[15px] font-bold leading-none tracking-tight">{PREMIER.price}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] font-medium text-white/85">
                      {PREMIER.priceSub}
                    </p>
                    <p className="mt-4 text-[14.5px] leading-relaxed text-white/90">
                      {PREMIER.blurb}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-3.5 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:self-center">
                    {PREMIER.features.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2.5 text-[13.5px] leading-snug text-white/90 [&_svg]:text-[#7ef2a0]"
                      >
                        {check}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={PREMIER.cta.href}
                    className="mt-auto block rounded-full bg-white px-6 py-3.5 text-center text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90 xl:mt-0 xl:col-start-1 xl:row-start-2 xl:self-start"
                  >
                    {PREMIER.cta.label}
                  </a>
                </article>
              </TiltCard>
            </div>
          </Reveal>
        </div>

        <p className="mt-5 text-center text-[12.5px] text-[var(--color-ink-soft)]/80">
          Prices are in naira and billed monthly; Premier is quoted per project
          before any work starts. Sardauna Lite carries no monthly fee — we keep
          2.5% of the remote sales it brings you instead. No card needed to
          start, and nothing is charged until you choose a paid tier.
        </p>
      </section>

      {/* who it's for */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal className="liquid-glass glass-ring relative rounded-[32px] px-6 py-10 text-center shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:px-12">
          <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Who it&apos;s for
          </p>
          <h2 className="text-display-3 mx-auto max-w-2xl">
            Built for businesses ready to delegate
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Sardauna&apos;s full staff pays for itself fastest in teams of
            roughly 10–100 people, or businesses doing ₦5M+ a month — enough
            moving parts for Sardauna Elite to earn its keep. Smaller than
            that? Start on Sardauna Lite — it&apos;s free — and climb the
            ladder when the enquiries justify it.
          </p>
        </Reveal>
      </section>

      <Reveal>
        <CTABand />
      </Reveal>
      <Footer />
    </main>
    </>
  );
}
