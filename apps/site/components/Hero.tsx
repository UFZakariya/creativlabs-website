/* Hero band: badge, display headline (working copy = brief §9 option A until
   owner picks), trust chips, CTAs, and the showcase player. Server component
   wrapping client islands. */

import ShowcasePlayer from "./ShowcasePlayer";

const TRUST_CHIPS = [
  "WhatsApp-first — proven in production",
  "Free readiness audit, no card",
  "You approve anything that leaves the house",
];

export default function Hero() {
  return (
    <section className="bg-azure-dawn rounded-b-[var(--radius-band)] px-4 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-5xl text-center">
        <p className="glass-surface glass-ring mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-cyan)]" />
          Sardauna — the House of Agents, by Safetyline
        </p>

        <h1 className="text-display-1 mx-auto max-w-3xl text-white">
          Every department.{" "}
          <span className="text-dawn-gradient-bright">One agent away.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
          Think, ideate, plan — while the agents do the dirty work. Sardauna is
          your chief of staff, running departments of specialist agents across
          sales, support, finance and growth — on the WhatsApp your business
          already uses.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
          >
            Start with a free readiness audit
          </a>
          <a
            href="#showcase"
            className="glass-surface glass-ring rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Watch the agents work
          </a>
        </div>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60">
          {TRUST_CHIPS.map((c) => (
            <li key={c} className="flex items-center gap-1.5">
              <span aria-hidden className="text-[var(--color-cyan)]">✓</span>
              {c}
            </li>
          ))}
        </ul>

        <div id="showcase">
          <ShowcasePlayer />
        </div>
      </div>
    </section>
  );
}
