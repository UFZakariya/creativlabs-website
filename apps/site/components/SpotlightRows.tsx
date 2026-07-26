/* Function spotlight rows: one sale followed through the house — order lands,
   ops adjusts, money is accounted for, owner gets the beat. Alternating text +
   dark artifact compositions in the proof-card idiom. Original copy. */

const check = (
  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0a1b52] bg-[#22c55e]">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
      <path d="m5 13 4.5 4.5L19 8" />
    </svg>
  </span>
);

function Tile({ children, size = 56 }: { children: React.ReactNode; size?: number }) {
  return (
    <span
      className="relative inline-grid place-items-center rounded-2xl bg-white shadow-[0_14px_34px_rgba(2,10,50,0.45)]"
      style={{ width: size, height: size }}
    >
      <span aria-hidden className="absolute -inset-4 -z-10 rounded-full bg-[var(--color-cyan)]/25 blur-xl" />
      {children}
      {check}
    </span>
  );
}

function FileCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/25 bg-white/12 px-4 py-2.5 text-left backdrop-blur-sm">
      <div className="text-[13px] font-semibold text-white">{title}</div>
      <div className="text-[11px] text-white/60">{sub}</div>
    </div>
  );
}

/* 01 — the order lands: two-line WhatsApp exchange + confirmed chip */
function OrderArt() {
  return (
    <div className="flex w-full max-w-[320px] flex-col gap-2">
      <div className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-white px-3 py-2 text-[13px] leading-snug text-[#111b21] shadow-[0_10px_26px_rgba(2,10,50,0.35)]">
        Do you have the leather sandals in a 42?
      </div>
      <div className="max-w-[85%] self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[13px] leading-snug text-[#111b21] shadow-[0_10px_26px_rgba(2,10,50,0.35)]">
        We do — ₦18,500. Delivery or pickup?
      </div>
      <div className="mt-2 flex items-center gap-2 self-center rounded-full border border-white/25 bg-white/12 px-4 py-2 backdrop-blur-sm">
        <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-[#22c55e]" style={{ width: 18, height: 18 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
            <path d="m5 13 4.5 4.5L19 8" />
          </svg>
        </span>
        <span className="text-[12.5px] font-semibold text-white">Order #1090 created</span>
      </div>
    </div>
  );
}

/* 02 — the house adjusts: stock tile wired to delivery + calendar pills */
function OpsArt() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Tile>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
          <path d="M12 2.8 20.2 7v10L12 21.2 3.8 17V7L12 2.8Z" />
          <path d="M3.8 7 12 11.2 20.2 7M12 11.2v10" />
        </svg>
      </Tile>
      <span className="h-px w-6 bg-white/40" />
      <div className="flex flex-col gap-2">
        <div className="rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Stock 12 <span className="text-white/50">→</span> 11
        </div>
        <div className="ml-5 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Rider booked · <span className="text-[#7ef2a0]">Tue 2pm</span>
        </div>
      </div>
    </div>
  );
}

/* 03 — the money is accounted for: payment pill + hanging receipt card */
function FinanceArt() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/12 px-5 py-2.5 backdrop-blur-sm">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
            <path d="M12 20V4m0 16 5.5-5.5M12 20l-5.5-5.5" />
          </svg>
        </span>
        <span className="text-[13.5px] font-bold text-white">
          ₦18,500 received <span className="font-medium text-white/60">· matched</span>
        </span>
      </div>
      <span className="h-4 w-px bg-white/40" />
      <FileCard title="Receipt-1090.pdf" sub="sent to customer · books current" />
    </div>
  );
}

/* 04 — the beat: metric pills + evening brief card */
function BriefArt() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <div className="rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Sales today ₦96k <span className="text-[#7ef2a0]">▲</span>
        </div>
        <div className="ml-4 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
          Orders 7 · all fulfilled
        </div>
      </div>
      <span className="h-px w-6 bg-white/40" />
      <Tile>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
          <path d="M4 19.5V13m5.5 6.5V8.5M15 19.5V11m5 8.5V5.5" />
        </svg>
      </Tile>
    </div>
  );
}

const ROWS = [
  {
    step: "01",
    eyebrow: "The order lands",
    title: "A customer asks. The sale closes itself.",
    body: "The question arrives on the WhatsApp your business already uses. The agent answers from your real catalogue — sizes, prices, delivery options — and writes the order into the system the moment the customer says yes.",
    Art: OrderArt,
  },
  {
    step: "02",
    eyebrow: "The house adjusts",
    title: "Stock moves, delivery gets booked, nobody is reminded.",
    body: "One confirmed order ripples through the departments on its own: inventory comes down, a rider is scheduled, and the customer gets the tracking details — while you're doing something better with your morning.",
    Art: OpsArt,
  },
  {
    step: "03",
    eyebrow: "The money is accounted for",
    title: "Paid, matched, receipted — before you ask.",
    body: "The transfer is matched to the order, the receipt goes out, and the books stay current with WHT noted where it applies. Month-end stops being an archaeology project.",
    Art: FinanceArt,
  },
  {
    step: "04",
    eyebrow: "You get the beat",
    title: "One message a day tells you the whole story.",
    body: "Sales, cash in, stock warnings and the decisions waiting for you — compiled into a brief that lands in your chat. You direct the business; the house does the accounting of it.",
    Art: BriefArt,
  },
];

export default function SpotlightRows() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="mb-14 text-center">
        <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
          One sale, end to end
        </p>
        <h2 className="text-display-2 mx-auto max-w-3xl">
          Follow one order <span className="text-dawn-gradient">through the house</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
          From the first WhatsApp message to the evening brief — four beats,
          zero busywork on your side.
        </p>
      </div>

      <div className="flex flex-col gap-14 sm:gap-20">
        {ROWS.map(({ step, eyebrow, title, body, Art }, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={step} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className={flip ? "md:order-2" : ""}>
                <p className="font-mono text-[13px] font-semibold tracking-wide text-[var(--color-blue)]">
                  {step} — {eyebrow}
                </p>
                <h3 className="text-display-3 mt-3">{title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                  {body}
                </p>
              </div>
              <div className={flip ? "md:order-1" : ""}>
                <div className="glass-ring overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(16,20,42,0.08)]">
                  <div className="bg-azure-dawn m-3 grid min-h-[264px] place-items-center overflow-hidden rounded-3xl p-6">
                    <Art />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
