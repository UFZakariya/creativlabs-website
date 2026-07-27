/* Closing CTA band: dark azure-dawn rounded panel, one big ask. Stays a
   server component — the dock-opening behavior lives in DockOpenButton. */

import DockOpenButton from "@/components/DockOpenButton";

export default function CTABand() {
  return (
    <section className="mx-3 pb-6">
      <div className="bg-azure-dawn glass-ring mx-auto max-w-6xl rounded-[var(--radius-band)] px-6 py-16 text-center sm:py-24">
        <h2 className="text-display-2 mx-auto max-w-2xl text-white">
          Put a full staff{" "}
          <span className="text-dawn-gradient-bright">in your pocket.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75">
          Start with the free readiness audit — one conversation with Biba or
          Bari, and you&apos;ll know exactly what Sardauna can take off your
          plate.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <DockOpenButton
            label="Start free with Biba or Bari"
            className="cursor-pointer rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
          />
          <a
            href="/pricing"
            className="glass-surface glass-ring rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            See pricing
          </a>
        </div>
        <p className="mt-6 text-[12.5px] text-white/70">
          Free audit · No card · You approve anything that leaves the house
        </p>
      </div>
    </section>
  );
}
