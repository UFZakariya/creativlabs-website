/* Token-proof page: the azure-dawn hero band + glass chrome + type scale.
   This is scaffolding verification, not the real homepage — the full hero
   (nav pill, showcase player, wave shader) lands per the brief's build plan. */
export default function Home() {
  return (
    <main>
      <section className="bg-azure-dawn rounded-b-[var(--radius-band)] px-5 pb-24 pt-28 text-center sm:pb-32 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <p className="glass-surface glass-ring mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
            Sardauna · by Safetyline
          </p>
          <h1 className="text-display-1 text-white">
            Every department.{" "}
            <span className="text-dawn-gradient">One agent away.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Think, ideate, plan — while the agents do the dirty work. A chief
            of staff running departments of specialists, on the WhatsApp your
            business already uses.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
            >
              Start with a free readiness audit
            </a>
            <a
              href="#"
              className="glass-surface glass-ring rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              See Sardauna work
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center">
        <h2 className="text-display-2">
          A reply is <span className="text-dawn-gradient">not a result.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-[var(--color-ink-soft)]">
          Token check: canvas, ink, fluid display scale, gradient text, glass
          ring, band radius. If you can read this in Geist, the scaffold works.
        </p>
      </section>
    </main>
  );
}
