/* Mega footer: link columns, contact + legal line, and a giant cropped
   wordmark anchoring the page's end. */

const COLS: { head: string; links: { label: string; href: string }[] }[] = [
  {
    head: "Product",
    links: [
      { label: "Product", href: "/product" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Channels", href: "/channels" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Customers", href: "/customers" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    head: "Trust",
    links: [
      { label: "Security", href: "/security" },
      /* relative on purpose: this must survive the cutover to safetyline.com.ng
         (the old site's #contact anchor won't exist on the new one) */
      { label: "Talk to Bari & Biba", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-10 pt-14 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/logo-128.png" alt="" width={30} height={32} />
            <span className="text-[15px] font-bold tracking-tight">Safetyline</span>
          </div>
          <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
            Sardauna — the AI business assistant that runs a house of agents
            for your business, on the WhatsApp you already use.
          </p>
          <p className="mt-4 text-[13px] text-[var(--color-ink-soft)]">
            <a href="tel:+2348102354786" className="hover:text-[var(--color-blue)]">
              +234 810 235 4786
            </a>
            <span className="mx-2">·</span>
            Lagos · Abuja · Remote, Nigeria
          </p>
        </div>

        {COLS.map((col) => (
          <nav key={col.head} aria-label={col.head}>
            {/* /40 composited to #999 on white = 2.85:1, under AA for 12px text */}
            <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-black/60">
              {col.head}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-blue)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-black/5 px-6 py-5 text-[12px] text-black/55">
        <span>© {new Date().getFullYear()} Safetyline Communications Ltd (RC 432180)</span>
        <span>Think, ideate, plan — the agents do the dirty work.</span>
      </div>

      {/* giant cropped wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <div className="text-dawn-gradient -mb-[0.34em] text-center text-[clamp(4rem,14.5vw,13rem)] font-bold leading-none tracking-[-0.05em] opacity-25">
          Safetyline
        </div>
      </div>
    </footer>
  );
}
