/* Four proof cards. Each dark visual holds an in-character agent line at the
   top and a hand-built artifact illustration anchored below — glowing icon
   tiles, connector lines, floating file/metric cards — matching the
   reference's production quality with our own compositions and content. */

const check = (
  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0a1b52] bg-[#22c55e]">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
      <path d="m5 13 4.5 4.5L19 8" />
    </svg>
  </span>
);

function Tile({ children, size = 60 }: { children: React.ReactNode; size?: number }) {
  return (
    <span className="relative inline-grid place-items-center rounded-2xl bg-white shadow-[0_14px_34px_rgba(2,10,50,0.45)]" style={{ width: size, height: size }}>
      <span aria-hidden className="absolute -inset-4 -z-10 rounded-full bg-[var(--color-cyan)]/25 blur-xl" />
      {children}
      {check}
    </span>
  );
}

/* 1 — finished artifact: download tile + hanging file card */
function FileArt() {
  return (
    <div className="flex flex-col items-center">
      <Tile>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
          <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
          <path d="M4.5 19.5h15" />
        </svg>
      </Tile>
      <span className="h-4 w-px bg-white/40" />
      <div className="w-56 rounded-xl border border-white/25 bg-white/12 px-4 py-2.5 text-left backdrop-blur-sm">
        <div className="text-[13px] font-semibold text-white">Weekly-Brief.pdf</div>
        <div className="text-[11px] text-white/60">6 pages · PDF</div>
      </div>
    </div>
  );
}

/* 2 — one request, whole company: hub tile wired to a department pill */
function StackArt() {
  return (
    <div className="flex items-center justify-center">
      <Tile>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
          <path d="M20 8a8 8 0 0 0-14.9-2M4 16a8 8 0 0 0 14.9 2" />
          <path d="M4.5 2.5V6H8M19.5 21.5V18H16" />
        </svg>
      </Tile>
      <span className="h-px w-7 bg-white/40" />
      <div className="flex items-center gap-4 rounded-full border border-white/25 bg-white/12 px-6 py-3.5 backdrop-blur-sm">
        <span className="text-[13.5px] font-bold tracking-tight text-white">Ops</span>
        <span className="h-4 w-px bg-white/25" />
        <span className="text-[13.5px] font-bold tracking-tight text-white">Finance</span>
        <span className="h-4 w-px bg-white/25" />
        <span className="text-[13.5px] font-bold tracking-tight text-white">Growth</span>
      </div>
    </div>
  );
}

/* 3 — schedule: app tile + stacked metric pills */
function ScheduleArt() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Tile>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 9.5h17M8 2.8V6m8-3.2V6" />
        </svg>
      </Tile>
      <div className="flex flex-col gap-2">
        <div className="rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Sales ₦412k <span className="text-[#7ef2a0]">▲ 12%</span>
        </div>
        <div className="ml-5 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Cash in ₦180k
        </div>
      </div>
    </div>
  );
}

/* 4 — memory: centre tile wired to satellite channels */
function MemoryArt() {
  const sat = "absolute grid h-11 w-11 place-items-center rounded-xl border border-white/25 bg-white/12 backdrop-blur-sm";
  return (
    <div className="relative mx-auto h-[120px] w-[300px]">
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 300 120" fill="none">
        <path d="M60 38C90 20 120 42 138 54" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
        <path d="M240 30C214 26 186 40 164 52" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
        <path d="M244 96C220 100 190 84 166 68" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
      </svg>
      <span className={`${sat} left-6 top-4`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8">
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />
        </svg>
      </span>
      <span className={`${sat} right-8 top-1`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m3.5 6.5 8.5 6 8.5-6" />
        </svg>
      </span>
      <span className={`${sat} bottom-1 right-5`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8">
          <path d="M6 2.8h8L19.2 8v13.2H6z" />
          <path d="M13.5 3v5.5H19M9 13h6M9 17h6" />
        </svg>
      </span>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Tile size={64}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="1.9">
            <path d="M12 3.5c1 2.6 2.9 4.5 5.5 5.5-2.6 1-4.5 2.9-5.5 5.5-1-2.6-2.9-4.5-5.5-5.5 2.6-1 4.5-2.9 5.5-5.5Z" />
            <path d="M18.5 14.5c.5 1.4 1.6 2.5 3 3-1.4.5-2.5 1.6-3 3-.5-1.4-1.6-2.5-3-3 1.4-.5 2.5-1.6 3-3Z" />
          </svg>
        </Tile>
      </span>
    </div>
  );
}

const CARDS = [
  {
    title: "Finished work, not suggestions",
    body: "Agents come back with the order confirmed, the invoice sent, the brief compiled — artifacts, receipts and all.",
    agent: "Sardauna",
    msg: "Done. The brief is in your chat.",
    Art: FileArt,
  },
  {
    title: "One request, whole company",
    body: "Ask Sardauna once. The chief of staff breaks the job down and hands each piece to the right department agent.",
    agent: "Sardauna",
    msg: "On it — Ops, Finance and Growth each have their piece.",
    Art: StackArt,
  },
  {
    title: "Runs on a schedule",
    body: "Daily briefs, weekly reconciliations, month-end packs — recurring work happens without you asking twice.",
    agent: "Sardauna",
    msg: "Your Monday numbers are in — next drop, same time.",
    Art: ScheduleArt,
  },
  {
    title: "It knows your business",
    body: "Built on agentic engineering, knowledge graphs and workflow optimization — your products, prices, people and history stay in the house's memory.",
    agent: "Kola",
    msg: "Set up the way you like it — no need to repeat yourself.",
    Art: MemoryArt,
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
        {CARDS.map(({ title, body, agent, msg, Art }) => (
          <article
            key={title}
            className="glass-ring overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(16,20,42,0.08)]"
          >
            <div className="bg-azure-dawn relative m-3 flex min-h-[264px] flex-col justify-between overflow-hidden rounded-3xl p-5">
              <div className="flex items-baseline gap-2 text-[13.5px]">
                <span className="font-bold text-[var(--color-cyan)]">{agent}</span>
                <span className="rounded bg-white/15 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white/80">
                  Agent
                </span>
                <span className="min-w-0 text-white/90">{msg}</span>
              </div>
              <div className="pb-1 pt-6">
                <Art />
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <h3 className="text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
                {body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
