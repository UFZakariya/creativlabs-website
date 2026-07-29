import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import GlowingEffect from "@/components/GlowingEffect";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import WaMiniDemo from "@/components/WaMiniDemo";

export const metadata: Metadata = {
  alternates: { canonical: "/channels" },
  title: "Channels — One house, every door | Safetyline",
  description:
    "Sardauna is WhatsApp-first — proven live in production — with email in the design and Instagram, Facebook, X, Teams and Slack offered. One house behind every door: same agents, same approvals, one record.",
};

/* hand-drawn channel glyphs — no lifted brand assets */
const glyphs = {
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  ),
  instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21a9 9 0 1 0-9-9 8.9 8.9 0 0 0 3.4 7L6 21l3.3-1.5A9.2 9.2 0 0 0 12 21Z" />
      <path d="m7.5 13 3-3 2.5 2.5 3.5-3.5" />
    </svg>
  ),
  x: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />
    </svg>
  ),
  teams: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <circle cx="17.5" cy="9.5" r="2.4" />
      <path d="M15.5 14.6a4.5 4.5 0 0 1 5 4.9" />
    </svg>
  ),
  slack: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
    </svg>
  ),
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M8 10.5V17M8 7.5v.1M12 17v-4a2.2 2.2 0 0 1 4.4 0v4" />
    </svg>
  ),
  email: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
};

const CHANNELS = [
  {
    name: "Instagram",
    glyph: glyphs.instagram,
    tint: "#d62976",
    line: "DMs answered, orders taken, story replies handled — by the same house that runs your WhatsApp.",
    status: "Offered",
  },
  {
    name: "Facebook Messenger",
    glyph: glyphs.facebook,
    tint: "#0866ff",
    line: "Page messages routed into the house and resolved like any other conversation.",
    status: "Offered",
  },
  {
    name: "X",
    glyph: glyphs.x,
    tint: "#10142a",
    line: "Mentions and DMs triaged — the ones that matter reach you with context attached.",
    status: "Offered",
  },
  {
    name: "Microsoft Teams",
    glyph: glyphs.teams,
    tint: "#5059c9",
    line: "For businesses that live in Microsoft — the house joins the channels your team watches.",
    status: "Offered",
  },
  {
    name: "Slack",
    glyph: glyphs.slack,
    tint: "#611f69",
    line: "Department threads mirrored into your workspace, decisions pulled back into the house.",
    status: "Offered",
  },
  {
    name: "LinkedIn",
    glyph: glyphs.linkedin,
    tint: "#0a66c2",
    line: "Outreach and replies drafted for your approval — you press send.",
    status: "Draft-assist",
  },
  {
    name: "Email",
    glyph: glyphs.email,
    tint: "#083cff",
    line: "Quotes, receipts and follow-ups drafted by the house and filed in the right thread.",
    status: "In the design",
  },
];

export default function ChannelsPage() {
  return (
    <>
      <WaveBackground />
      <Navbar onLight />
      <main id="main" tabIndex={-1}>

      {/* light hero on the waves */}
      <section className="px-5 pb-14 pt-36 text-center sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Channels
          </p>
          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            One house. <span className="text-dawn-gradient">Every door.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Your customers don&apos;t come through a website form — they come
            through chat. Sardauna answers every door with the same agents,
            the same approvals and one record behind them all — starting with
            the door that matters most in Nigeria.
          </p>
        </div>
      </section>

      {/* featured: WhatsApp — the front door, proven live */}
      <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25d366] shadow-[0_14px_34px_rgba(37,211,102,0.35)] text-white">
                {glyphs.whatsapp}
              </span>
              <span className="rounded-full border border-[#7ef2a0]/40 bg-[#7ef2a0]/10 px-3.5 py-1 text-[12.5px] font-semibold text-[#7ef2a0]">
                Live in production today
              </span>
            </div>
            <h2 className="text-display-2 text-white">
              The front door is <span className="text-dawn-gradient-bright">WhatsApp</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
              Your customers already live there — so does your house. Orders,
              questions, follow-ups, your own approvals — one chat, with no
              app to download and no portal to teach anyone.
            </p>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/70">
              Proven, not promised: Safetyline&apos;s own front desk and
              working farm-management agents run on WhatsApp in production
              right now.
            </p>
          </Reveal>

          {/* mini chat strip — sequenced simulation, homepage-player style */}
          <Reveal delay={0.12} className="mx-auto w-full max-w-md">
            <WaMiniDemo />
          </Reveal>
        </div>
      </section>

      {/* the directory */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal className="mb-12 text-center">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            The directory
          </p>
          <h2 className="text-display-2 mx-auto max-w-3xl">
            More doors, <span className="text-dawn-gradient">on request</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Every channel below can be wired into your house as part of your
            build — tell us where your customers are and we&apos;ll meet them
            there.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal
              key={c.name}
              delay={(i % 3) * 0.07}
              className={`h-full ${
                i === CHANNELS.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <TiltCard maxTilt={8} className="h-full">
                <article className="liquid-glass glass-ring relative flex h-full flex-col gap-3 rounded-[24px] p-6 shadow-[0_16px_40px_rgba(16,20,42,0.06)]">
                  <GlowingEffect spread={38} proximity={56} inactiveZone={0.55} borderWidth={2} />
                  <div className="flex items-center justify-between">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-xl"
                      style={{ background: `${c.tint}14`, color: c.tint }}
                    >
                      {c.glyph}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${
                        c.status === "Offered"
                          ? "border border-black/10 bg-black/4 text-[var(--color-ink-soft)]"
                          : "border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 text-[var(--color-blue)]"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold tracking-tight">{c.name}</h3>
                  <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">{c.line}</p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* one house behind every door */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:pb-24">
        <Reveal>
        <div className="glass-ring rounded-[32px] bg-white px-6 py-12 shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:px-12">
          <div className="mb-10 text-center">
            <h2 className="text-display-3 mx-auto max-w-2xl">
              Eight doors. <span className="text-dawn-gradient">One house.</span>
            </h2>
          </div>
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              {
                title: "Same house",
                body: "Every door you open leads into the same house — the same agents serving the same customer, whichever channels you add.",
              },
              {
                title: "Same approvals",
                body: "Whatever the channel, anything outbound waits for your yes. The door changes; the gate doesn't.",
              },
              {
                title: "Same record",
                body: "Every conversation and action lands in one audit trail — reviewable from your dashboard, channel by channel.",
              },
            ].map((p) => (
              <div key={p.title}>
                <h3 className="text-[17px] font-bold tracking-tight text-[var(--color-blue)]">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>

      <CTABand />
      <Footer />
    </main>
    </>
  );
}
