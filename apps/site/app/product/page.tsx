import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import WaveBackground from "@/components/WaveBackground";
import OrgChart from "@/components/OrgChart";
import CapabilitiesGrid from "@/components/CapabilitiesGrid";
import StepsSection from "@/components/StepsSection";
import ControlSafety from "@/components/ControlSafety";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Product — Sardauna, the AI Business Assistant | Safetyline",
  description:
    "Sardauna is a house of agents: a chief of staff running six departments of specialist AI agents for your business — on WhatsApp, with a dashboard, under your approval.",
};

const MODULES = [
  "Chief-of-Staff chat",
  "Operations",
  "Finance",
  "Marketing & CRM",
  "Projects",
  "Messages",
  "Agents & evals",
];

export default function ProductPage() {
  return (
    <main>
      <WaveBackground />
      <Navbar onLight />

      {/* light hero on the waves */}
      <section className="px-5 pb-16 pt-36 text-center sm:pb-20 sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#25d366] shadow-[0_14px_34px_rgba(37,211,102,0.35)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />
              </svg>
            </span>
            <span className="ig-ring grid h-14 w-14 place-items-center rounded-2xl p-[2.5px] shadow-[0_14px_34px_rgba(238,42,123,0.3)]">
              <span className="grid h-full w-full place-items-center rounded-[13px] bg-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d62976" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1.2" fill="#d62976" stroke="none" />
                </svg>
              </span>
            </span>
          </div>

          <h1 className="text-display-1 mx-auto max-w-3xl text-[var(--color-ink)]">
            A house of agents for your{" "}
            <span className="text-dawn-gradient">whole business.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Sardauna lives in the chats your customers already use — WhatsApp
            first, Instagram and more offered — and runs your operations,
            finance, growth and support through department agents you can
            watch, direct and approve.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start with a free readiness audit
            </a>
            <a
              href="/use-cases"
              className="glass-ring rounded-full bg-white/70 px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] backdrop-blur-sm transition-opacity hover:opacity-80"
            >
              See it in action
            </a>
          </div>
        </div>
      </section>

      {/* the org chart — our unique section */}
      <OrgChart />

      {/* what the house runs */}
      <CapabilitiesGrid />

      {/* the dashboard */}
      <section className="mx-auto max-w-5xl px-5 pb-20 text-center sm:pb-28">
        <div className="glass-ring rounded-[32px] bg-white px-6 py-12 shadow-[0_20px_60px_rgba(16,20,42,0.08)] sm:px-12">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Mission control
          </p>
          <h2 className="text-display-2 mx-auto max-w-3xl">
            A dashboard where you <span className="text-dawn-gradient">watch the house work</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
            Chat with Sardauna, track every department, review approvals and
            see each agent&apos;s performance — seven modules, one place.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {MODULES.map((m) => (
              <span
                key={m}
                className="rounded-full border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 px-4 py-2 text-[13px] font-semibold text-[var(--color-blue)]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* onboarding + control + close */}
      <StepsSection />
      <ControlSafety />
      <CTABand />
      <Footer />
    </main>
  );
}
