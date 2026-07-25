/* Six capability cards — what the house actually runs day to day.
   Grounded in the claims register; original copy. */

const CAPS = [
  {
    icon: "🛒",
    title: "Orders & sales",
    body: "Enquiries answered, orders confirmed, payment links sent, dispatch scheduled — straight from your customer chats.",
  },
  {
    icon: "💬",
    title: "Customer support",
    body: "Complaints resolved with real fixes — replacements, refunds, credits — and escalated to you only when it matters.",
  },
  {
    icon: "🧾",
    title: "Finance & receivables",
    body: "Invoices raised, payments reconciled, overdue balances chased politely and persistently until they clear.",
  },
  {
    icon: "📈",
    title: "Growth & CRM",
    body: "Every new contact profiled and placed in the pipeline; leads qualified, follow-ups sent, deals kept warm.",
  },
  {
    icon: "🗓️",
    title: "Compliance & reports",
    body: "VAT packs compiled, filing deadlines on the calendar, month-end reports ready before you ask.",
  },
  {
    icon: "☀️",
    title: "The daily brief",
    body: "Every morning: sales, cash in, complaints, and the decisions waiting for you — one message, whole business.",
  },
];

export default function CapabilitiesGrid() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">
          What the house runs
        </p>
        <h2 className="text-display-3 mx-auto max-w-2xl">
          The day-to-day, handled end to end
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPS.map((c) => (
          <div
            key={c.title}
            className="glass-ring rounded-3xl bg-white p-6 shadow-[0_16px_44px_rgba(16,20,42,0.06)]"
          >
            <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-blue)]/8 text-xl">
              {c.icon}
            </span>
            <h3 className="text-[16.5px] font-bold tracking-tight">{c.title}</h3>
            <p className="mt-1.5 text-[13.8px] leading-relaxed text-[var(--color-ink-soft)]">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
