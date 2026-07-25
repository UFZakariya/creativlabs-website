/* Four proof cards: why Sardauna feels like staff, not software. Each card
   tops with a dark visual inset carrying a one-line in-character agent
   message, then a claim + one sentence. Grounded in real capabilities. */

const CARDS = [
  {
    title: "Finished work, not suggestions",
    body: "Agents come back with the order confirmed, the invoice sent, the brief compiled — artifacts, receipts and all.",
    visual: {
      agent: "Ngozi",
      msg: "Reminder sent. INV-208 marked chased — I'll escalate politely on Friday if it stays unpaid.",
    },
  },
  {
    title: "One request, whole company",
    body: "Ask Sardauna once. The chief of staff breaks it down and hands each piece to the right department agent.",
    visual: {
      agent: "Sardauna",
      msg: "On it — Kola handles the restock, Ngozi raises the PO, Tunde updates the launch plan.",
    },
  },
  {
    title: "Runs on a schedule",
    body: "Daily briefs, weekly reconciliations, month-end packs — recurring work happens without you asking twice.",
    visual: {
      agent: "Sardauna",
      msg: "07:00 — your morning brief is ready: sales, cash in, complaints, and one approval waiting.",
    },
  },
  {
    title: "It knows your business",
    body: "Built on agentic engineering, knowledge graphs and workflow optimization — your products, prices, people and history stay in the house's memory.",
    visual: {
      agent: "Kola",
      msg: "Same customer as order #1029 — I've applied her delivery credit automatically.",
    },
  },
];

export default function ProofCards() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">
          Staff, not software
        </p>
        <h2 className="text-display-3 mx-auto max-w-2xl">
          Why it feels like a team — not another app to manage
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="glass-ring overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
          >
            <div className="bg-azure-dawn relative m-3 rounded-3xl p-5 sm:min-h-40">
              <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-cyan)]">
                  {c.visual.agent}
                  <span className="rounded bg-white/15 px-1 py-px text-[8.5px] font-bold uppercase tracking-wide text-white/80">
                    Agent
                  </span>
                </div>
                <p className="text-[13.5px] leading-snug text-white/90">{c.visual.msg}</p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {c.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
