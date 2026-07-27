import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Security & control — Autonomy you can audit | Safetyline",
  description:
    "Sardauna's trust story is real machinery: tiered autonomy where anything outbound waits for your approval, a full audit trail of every agent action, and agents promoted draft → evaluate → shadow → canary → live, with rollback.",
};

/* pillar art — small dark insets in the proof-card idiom */

function ApprovalArt() {
  return (
    <div className="w-full max-w-[240px]">
      <div className="overflow-hidden rounded-lg bg-white shadow-[0_10px_26px_rgba(2,10,50,0.35)]">
        <p className="px-3 pt-2 text-[12.5px] leading-snug text-[#111b21]">
          Supplier order ready — ₦230,000 to Alhaji Musa. Send it?
        </p>
        <div className="mt-2 flex border-t border-black/8">
          <span className="flex-1 py-1.5 text-center text-[12px] font-medium text-[#008ecc]">Approve</span>
          <span className="flex-1 border-l border-black/8 py-1.5 text-center text-[12px] font-medium text-[#008ecc]">Hold</span>
        </div>
      </div>
      <p className="mt-2 text-center text-[10.5px] font-medium uppercase tracking-wide text-white/50">
        waiting on you — nothing sent
      </p>
    </div>
  );
}

function LedgerArt() {
  const rows = [
    { who: "Ngozi", what: "sent INV-214 reminder", when: "14:02", ok: true },
    { who: "Kola", what: "updated stock count", when: "13:40", ok: true },
    { who: "Tunde", what: "outreach draft → queue", when: "13:12", ok: false },
  ];
  return (
    <div className="w-full max-w-[250px] overflow-hidden rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm">
      {rows.map((r, i) => (
        <div
          key={r.when}
          className={`flex items-center gap-2 px-3 py-2 ${i > 0 ? "border-t border-white/12" : ""}`}
        >
          <span
            className="grid shrink-0 place-items-center rounded-full"
            style={{ width: 16, height: 16, background: r.ok ? "#22c55e" : "#e8a723" }}
          >
            {r.ok ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
                <path d="m5 13 4.5 4.5L19 8" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
                <path d="M12 7v6m0 4v.1" />
              </svg>
            )}
          </span>
          <span className="min-w-0 flex-1 truncate text-[11.5px] text-white/85">
            <span className="font-semibold text-white">{r.who}</span> · {r.what}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-white/45">{r.when}</span>
        </div>
      ))}
    </div>
  );
}

function StagesArt() {
  const stages = ["Draft", "Evaluate", "Shadow", "Canary", "Live"];
  return (
    <div className="w-full max-w-[250px]">
      <div className="flex items-center justify-between">
        {stages.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
                i === 4 ? "bg-[#22c55e] text-white" : "border border-white/40 bg-white/10 text-white/70"
              }`}
            >
              {i + 1}
            </span>
            {i < 4 && <span className="h-px flex-1 bg-white/30" />}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[9px] font-medium uppercase tracking-wide text-white/55">
        <span>Draft</span>
        <span className="text-white/90">Live</span>
      </div>
      <div className="mt-3 flex justify-center">
        <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          v12 live · rollback ready
        </span>
      </div>
    </div>
  );
}

const PILLARS = [
  {
    title: "Nothing leaves without you",
    body: "Internal work runs on its own — drafts, checks, bookkeeping. Anything that goes out — a customer message, a payment, a supplier order — waits in your approvals queue until you say so.",
    Art: ApprovalArt,
  },
  {
    title: "Nothing happens off the record",
    body: "Every action every agent takes is logged: what it did, when, and what it touched. Review any decision after the fact, from your dashboard, channel by channel.",
    Art: LedgerArt,
  },
  {
    title: "Nothing goes live untested",
    body: "No agent goes live on vibes. Each one is promoted through a quality ladder — and if a new version underperforms, rollback is one step away.",
    Art: StagesArt,
  },
];

const LIFECYCLE = [
  {
    step: "01",
    name: "Draft",
    body: "The agent is built and configured for your business — your products, your tone, your rules.",
  },
  {
    step: "02",
    name: "Evaluate",
    body: "It runs against a suite of test scenarios drawn from work like yours, and has to pass.",
  },
  {
    step: "03",
    name: "Shadow",
    body: "It watches real work and answers privately — touching nothing — while we compare its calls.",
  },
  {
    step: "04",
    name: "Canary",
    body: "It handles a small slice of live work under close watch before earning the full desk.",
  },
  {
    step: "05",
    name: "Live",
    body: "Full duty — versioned, monitored, and reviewed like it's still week one.",
  },
];

export default function SecurityPage() {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      {/* light hero on the waves */}
      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Security &amp; control
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            Autonomy <span className="text-dawn-gradient">you can audit.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            A house of agents only works if you can trust it with your name.
            Sardauna&apos;s trust story isn&apos;t a promise — it&apos;s
            machinery: approval gates, an audit trail, and a quality ladder
            every agent climbs before it touches your customers.
          </p>
        </div>
      </section>

      {/* the three pillars */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ title, body, Art }, i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <TiltCard className="h-full">
                <article className="liquid-glass glass-ring relative h-full rounded-[32px] shadow-[0_20px_60px_rgba(16,20,42,0.08)]">
                  <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
                  <div className="bg-azure-dawn m-3 grid min-h-[210px] place-items-center overflow-hidden rounded-3xl p-5">
                    <Art />
                  </div>
                  <div className="px-6 pb-6 pt-3">
                    <h2 className="text-lg font-bold tracking-tight">{title}</h2>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* the quality ladder */}
      <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
              The quality ladder
            </p>
            <h2 className="text-display-2 mx-auto max-w-3xl text-white">
              How an agent <span className="text-dawn-gradient-bright">earns its job</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              Five stages between an idea and your customers. Most software
              ships and hopes; the house promotes and proves.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LIFECYCLE.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06} className="h-full">
                <div
                  className={`h-full rounded-[24px] border p-5 backdrop-blur-sm ${
                    i === 4
                      ? "border-[#7ef2a0]/40 bg-white/12"
                      : "border-white/15 bg-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-semibold text-[var(--color-cyan)]">{s.step}</span>
                    {i === 4 && (
                      <span className="grid place-items-center rounded-full bg-[#22c55e]" style={{ width: 18, height: 18 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
                          <path d="m5 13 4.5 4.5L19 8" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[17px] font-bold tracking-tight text-white">{s.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-[13px] text-white/50">
              Every agent is versioned — and a promotion can always be reversed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* your data */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <Reveal>
        <div className="glass-ring rounded-[32px] bg-white px-6 py-12 text-center shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:px-12">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Your data
          </p>
          <h2 className="text-display-3 mx-auto max-w-2xl">
            Your business stays your business
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 text-left sm:grid-cols-3 sm:text-center">
            {[
              {
                title: "Grounded in your records",
                body: "Agents answer from your real files and records — status comes from what's actually there, not from guesses.",
              },
              {
                title: "A readable record",
                body: "The audit trail is yours: every action, reviewable from your dashboard whenever you ask.",
              },
              {
                title: "A clean exit",
                body: "Leave anytime — your records and history export with you.",
              },
            ].map((p) => (
              <div key={p.title}>
                <h3 className="text-[15.5px] font-bold tracking-tight text-[var(--color-blue)]">{p.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      <CTABand />
      <Footer />
    </main>
  );
}
