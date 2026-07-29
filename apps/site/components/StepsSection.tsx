/* Three-step onboarding: from first WhatsApp message to a fully delegated
   business. Static section; original copy grounded in the real flow. */

const STEPS = [
  {
    n: "1",
    title: "Say hello to Bari or Biba",
    body: "Start with the free readiness audit — a short conversation, no installs, no card. You'll get an instant Readiness Report (free), and what Sardauna can take off your plate.",
  },
  {
    n: "2",
    title: "Sardauna learns your business",
    body: "Products, prices, customers, suppliers, how you like things done — the house builds a working memory of your business and keeps it current.",
  },
  {
    n: "3",
    title: "Delegate the dirty work",
    body: "Orders, support, invoices, follow-ups, reports — department agents run it, Sardauna coordinates it, and you approve anything that leaves the house.",
  },
];

export default function StepsSection() {
  return (
    <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-4 inline-block rounded-full border border-white/25 bg-[#0a1d7a] px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
            Up and running in minutes, not months
          </p>
          <h2 className="text-display-2 mx-auto max-w-2xl text-white">
            Three steps to a staffed business
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="glass-surface glass-ring rounded-3xl p-6 text-left"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg font-bold text-[var(--color-ink)]">
                {s.n}
              </span>
              <h3 className="text-lg font-bold tracking-tight text-white">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/75">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
