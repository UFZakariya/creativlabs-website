import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Safetyline | The house behind Sardauna",
  description:
    "Safetyline is a Nigerian AI-integration company. We build houses of agents that run real businesses — starting with our own systems, proven in production before we sold a single seat.",
};

const VALUES = [
  {
    title: "Agents never lie",
    body: "Every claim on this site maps to something running or something offered — and we tell you which is which. The same honesty is engineered into the agents we ship.",
  },
  {
    title: "Proof before pitch",
    body: "We ran our own systems in production — a farm, a food business, our own front desk — before asking anyone else to trust an agent with theirs.",
  },
  {
    title: "Built for here",
    body: "WhatsApp-first, naira-first, CAMA-and-VAT-aware. Nigerian business reality is the spec, not an afterthought.",
  },
];

/* placeholder card — owner supplies photo + bio before launch */
function TeamPlaceholder({ role }: { role: string }) {
  return (
    <div className="glass-ring flex flex-col items-center gap-3 rounded-[24px] bg-white p-8 text-center shadow-[0_16px_40px_rgba(16,20,42,0.06)]">
      <span className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-[var(--color-blue)]/30 bg-[var(--color-blue)]/5">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="1.6" opacity="0.5" aria-hidden>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      </span>
      <div>
        <p className="text-[15px] font-bold tracking-tight">{role}</p>
        <p className="mt-1 text-[12.5px] text-[var(--color-ink-soft)]/70">Photo &amp; bio coming soon</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      {/* light hero on the waves */}
      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            About Safetyline
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            We build the house. <span className="text-dawn-gradient">Agents run it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Safetyline is a Nigerian AI-integration company. We started by
            building and operating real systems — a farm&apos;s daily ledger, a
            food business&apos;s ops room, our own front desk — and turned what
            worked into Sardauna: a house of agents any serious business can
            hire.
          </p>
        </div>
      </section>

      {/* mission band */}
      <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
            The mission
          </p>
          <h2 className="text-display-2 text-white">
            Every Nigerian business,{" "}
            <span className="text-dawn-gradient-bright">fully staffed.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
            Most businesses here run under-staffed and over-worked — the owner
            is the ops manager, the accountant and the customer desk at once.
            Our mission is to put a house of agents behind every one of them:
            think, ideate, plan — while the agents do the dirty work.
          </p>
        </div>
      </section>

      {/* values */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            How we work
          </p>
          <h2 className="text-display-2 mx-auto max-w-2xl">
            Three rules <span className="text-dawn-gradient">we don&apos;t bend</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="glass-ring rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
            >
              <h3 className="text-lg font-bold tracking-tight text-[var(--color-blue)]">{v.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* team — placeholders until the owner supplies photos & bios */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-display-3 mx-auto max-w-2xl">The people behind the house</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            Faces and stories are on their way — for now, you can meet us the
            way our customers do: start a conversation.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl gap-5 sm:grid-cols-2">
          <TeamPlaceholder role="Founder" />
          <TeamPlaceholder role="The team" />
        </div>
        <p className="mt-8 text-center text-[13px] text-[var(--color-ink-soft)]/80">
          Safetyline Communications Ltd · RC 432180 · Lagos &amp; Abuja, Nigeria
        </p>
      </section>

      <CTABand />
      <Footer />
    </main>
  );
}
