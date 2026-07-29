import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import UcShowcase from "@/components/UcShowcase";
import "../uc-demo.css";

export const metadata: Metadata = {
  alternates: { canonical: "/customers" },
  openGraph: { url: "/customers" },
  title: "Customers — Built on real operations, not demos | Safetyline",
  description:
    "The deployments behind Sardauna: a farm management system live in production, a food business's ops admin and ordering app, and a national membership portal.",
};

const BILLBOARDS = [
  {
    name: "UFMS",
    tag: "Agriculture · live in production",
    stat: ["Every egg, every batch,", "on one ledger."],
    body: "A working poultry farm runs its day through UFMS — lay rates, mortality, stock flow and batch economics — reported over WhatsApp agents and read on one dashboard.",
    href: "/customers/ufms",
    chips: ["Farm dashboard", "WhatsApp agents", "Daily ledger"],
    mono: "UF",
  },
  {
    name: "TruckVille OS",
    tag: "Food & hospitality · live",
    stat: ["A food business,", "closed out daily."],
    body: "Orders, vendors and end-of-day closeouts in one ops admin — fed by a phone-first ordering app, so the front of house and the books never drift apart.",
    href: "/customers/truckville",
    chips: ["Ops admin", "Ordering app", "Daily closeouts"],
    mono: "TV",
  },
  {
    name: "Membership portal",
    tag: "Civic organisation",
    stat: ["A member register,", "down to the ward."],
    body: "A national organisation's membership portal — registration, records and printable membership slips organised state by state, LGA by LGA, ward by ward.",
    href: null,
    chips: ["Member records", "Printable slips", "Nationwide structure"],
    mono: "MP",
  },
  {
    name: "Bari & Biba",
    tag: "Safetyline's own front desk · live now",
    stat: ["The front desk", "that never closes."],
    body: "The chat agents on safetyline.com.ng answering visitors and capturing leads right now — every conversation scored, every serious lead in the owner's morning digest.",
    href: null,
    chips: ["Website chat", "Lead capture", "Morning digest"],
    mono: "BB",
  },
];

export default function CustomersPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>

      {/* light hero on the waves */}
      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <Reveal immediate className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Customers
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            Built on real operations, <span className="text-dawn-gradient">not demos.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Before Sardauna was a product, its patterns were running businesses:
            a farm&apos;s daily ledger, a food operation&apos;s closeouts, a
            national member register, and our own front desk. These are the
            deployments we stand on.
          </p>
        </Reveal>
      </section>

      {/* live demos — the old site's device showcase, brought over whole */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:pb-24">
        <Reveal className="text-center">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Live demos
          </p>
          <h2 className="text-display-2 mx-auto max-w-3xl text-[var(--color-ink)]">
            Click around <span className="text-dawn-gradient">the real thing.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            The interfaces of the systems below, rebuilt for the browser — not
            videos, not mockups. Switch apps, click through UFMS&apos;s pages,
            scroll the screens, and pick the ordering app to watch the laptop
            become a phone.
          </p>
        </Reveal>
        <div className="mt-10">
          <UcShowcase />
        </div>
      </section>

      {/* billboards */}
      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-5 pb-20 sm:pb-24">
        {BILLBOARDS.map((b, bi) => {
          /* the logo tile alternates sides down the column — first card left,
             next right, and so on — so the eye zig-zags instead of running
             down one rail. Order is swapped rather than the DOM, so the
             heading still comes first for screen readers and on mobile. */
          const tileLeft = bi % 2 === 0;
          const inner = (
            <div
              className={`grid items-stretch ${
                tileLeft ? "md:grid-cols-[260px_1fr]" : "md:grid-cols-[1fr_260px]"
              }`}
            >
              <div className={`p-7 sm:p-9 ${tileLeft ? "md:order-2" : ""}`}>
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-soft)]/70">
                  {b.tag}
                </p>
                <h2 className="text-display-3 mt-3">
                  {b.stat[0]} <span className="text-dawn-gradient">{b.stat[1]}</span>
                </h2>
                <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
                  {b.body}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {b.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 px-3 py-1 text-[12px] font-semibold text-[var(--color-blue)]"
                    >
                      {c}
                    </span>
                  ))}
                  {b.href && (
                    <span className="ml-auto text-[13.5px] font-semibold text-[var(--color-blue)]">
                      Read the story →
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`bg-azure-dawn relative m-3 hidden place-items-center overflow-hidden rounded-3xl md:grid ${
                  tileLeft ? "md:order-1" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 left-1/4 h-32 w-44 rounded-full bg-[var(--color-cyan)]/25 blur-3xl"
                />
                <div className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-[19px] font-bold tracking-tight text-[var(--color-blue)] shadow-[0_14px_34px_rgba(2,10,50,0.45)]">
                    {b.mono}
                  </span>
                  <p className="mt-3 text-[14px] font-bold tracking-tight text-white">{b.name}</p>
                </div>
              </div>
            </div>
          );

          return b.href ? (
            <Reveal key={b.name} delay={(bi % 2) * 0.08}>
              <TiltCard maxTilt={4}>
                <a
                  href={b.href}
                  className="liquid-glass glass-ring relative block rounded-[32px] shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-transform hover:-translate-y-0.5"
                >
                  <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
                  {inner}
                </a>
              </TiltCard>
            </Reveal>
          ) : (
            <Reveal key={b.name} delay={(bi % 2) * 0.08}>
              <TiltCard maxTilt={4}>
                <div className="liquid-glass glass-ring relative rounded-[32px] shadow-[0_20px_60px_rgba(16,20,42,0.08)]">
                  <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
                  {inner}
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
        <p className="mt-2 text-center text-[12.5px] text-[var(--color-ink-soft)]/80">
          All four are real systems we built and operate — the numbers behind
          them are shared in conversation, not invented for a webpage.
        </p>
      </section>

      <CTABand />
      <Footer />
    </main>
    </>
  );
}
