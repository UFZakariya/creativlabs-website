"use client";

/* FAQ split layout: sticky heading left, accordion right. Native <details>
   for a11y with styled markers. Original questions grounded in the claims
   register. */

const ITEMS = [
  {
    q: "What exactly is Sardauna?",
    a: "Sardauna is Safetyline's AI business assistant — a chief-of-staff agent that runs a house of specialist department agents (sales, support, operations, finance, growth) for your business. You talk to Sardauna; the house does the work.",
  },
  {
    q: "Which channels does it work on?",
    a: "WhatsApp first — that's where Nigerian business happens, and it's where Sardauna is proven in production today. Instagram, Facebook, X, Microsoft Teams and Slack are offered as integrations, alongside email and the Sardauna dashboard.",
  },
  {
    q: "What can the agents actually do?",
    a: "Take and confirm orders, send payment links, resolve support issues, chase invoices, prepare VAT and compliance packs, qualify leads into your pipeline, and compile your daily brief — with every piece of work reported back to you with receipts.",
  },
  {
    q: "Do I stay in control?",
    a: "Always. Internal work runs automatically, but anything that leaves the house — bulk customer messages, spending, admin changes — waits for your approval. Every action is audit-logged, and you can review any agent's work at any time.",
  },
  {
    q: "How do the agents get better?",
    a: "Every agent is versioned and moves through an evaluation lifecycle — drafted, evaluated against real scenarios, shadowed alongside the live agent, trialled on a small slice, then promoted — with instant rollback if quality slips.",
  },
  {
    q: "What does it cost?",
    a: "Sardauna is a ladder of four tiers. Sardauna Lite is free — a website, a WhatsApp door and a readiness mini-audit. Sardauna Plus+ adds the 24/7 AI employee so you stop losing enquiries; Sardauna Elite puts your whole back office on AI staff; Sardauna Premier is project work layered on top of any tier. Paid tiers are naira-billed monthly and priced with you on the intro call — real numbers before you commit to anything.",
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
            Straight answers
          </p>
          <h2 className="text-display-3">Questions owners ask</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
            No jargon, no hedging — the same answers Bari and Biba give in the
            chat, written down.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ITEMS.map((item) => (
            <details
              key={item.q}
              className="glass-ring group rounded-2xl bg-white px-5 py-4 shadow-[0_10px_30px_rgba(16,20,42,0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-blue)]/8 text-[15px] font-bold text-[var(--color-blue)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
