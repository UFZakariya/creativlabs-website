/* Hero band: aurora beams over a vivid-blue dawn gradient (no navy tail —
   the band cuts off just past the showcase header, per owner direction).
   The showcase player overlaps out of the band onto the light canvas.
   Server component wrapping client islands. */

import ShowcasePlayer from "./ShowcasePlayer";

const TRUST_CHIPS = [
  "WhatsApp-first — proven in production",
  "Free readiness audit, no card",
  "You approve anything that leaves the house",
];

export default function Hero() {
  return (
    <>
      <section className="bg-azure-dawn-hero relative overflow-hidden rounded-b-[var(--radius-band)] px-4 pb-44 pt-32 sm:pb-48 sm:pt-40">
        <div className="aurora-beams" aria-hidden />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="text-display-1 mx-auto max-w-3xl text-white">
            A whole business,{" "}
            <span className="text-shimmer whitespace-nowrap">in your pocket.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Work on your business, not in it. Most businesses don&apos;t fail
            for lack of a great product — they fail because the owner spends
            every day running the shop instead of growing it. Sardauna, our AI
            business assistant, runs the day-to-day for you.
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
        </div>
      </section>

      {/* showcase rides out of the band — its header sits on the boundary */}
      <div id="showcase" className="relative z-10 -mt-36 px-4 sm:-mt-40">
        <div className="mx-auto max-w-5xl text-center">
          <ShowcasePlayer />
        </div>
      </div>
    </>
  );
}
