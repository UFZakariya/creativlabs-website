/* The House of Agents org chart — the section only Sardauna can show:
   a real chief of staff commanding real department heads. Hand-built tiles,
   glows and SVG connectors on the azure-dawn band. */

const DEPARTMENTS = [
  { name: "Kola", role: "Operations" },
  { name: "Ngozi", role: "Finance" },
  { name: "Tunde", role: "Growth" },
  { name: "Zara", role: "Comms & Support" },
  { name: "Amara", role: "Delivery" },
  { name: "Emeka", role: "Research" },
];

export default function OrgChart() {
  return (
    <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--color-cyan)]">
          The House of Agents
        </p>
        <h2 className="text-display-3 mx-auto max-w-2xl text-white">
          One chief of staff. Six departments. Your org chart, staffed.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
          You talk to Sardauna. Sardauna runs the departments — and every
          department head runs specialists of its own.
        </p>

        {/* chief of staff */}
        <div className="mt-12 flex flex-col items-center">
          <div className="relative">
            <span aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-[var(--color-cyan)]/25 blur-2xl" />
            <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-[0_18px_44px_rgba(2,10,50,0.5)]">
              <img src="/logo-128.png" alt="" className="h-9 w-9" />
              <span className="text-left leading-tight">
                <span className="block text-[16px] font-bold tracking-tight text-[var(--color-ink)]">
                  Sardauna
                </span>
                <span className="block text-[11.5px] font-medium text-[var(--color-ink-soft)]">
                  Chief of Staff
                </span>
              </span>
            </div>
          </div>

          {/* connector */}
          <span className="h-6 w-px bg-white/40" />
          <span className="hidden h-px w-[min(680px,86%)] bg-white/30 sm:block" />

          {/* departments */}
          <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.name}
                className="glass-surface glass-ring rounded-2xl px-4 py-3.5 text-left"
              >
                <span className="block text-[14.5px] font-bold tracking-tight text-white">
                  {d.name}
                </span>
                <span className="block text-[11.5px] font-medium text-white/65">
                  {d.role}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[12.5px] font-medium uppercase tracking-[0.18em] text-white/45">
            Hire more agents any time — the house grows with you
          </p>
        </div>
      </div>
    </section>
  );
}
