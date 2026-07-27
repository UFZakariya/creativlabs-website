"use client";

/* Function spotlight rows: one sale followed through the house — order lands,
   ops adjusts, money is accounted for, owner gets the beat. Alternating text +
   glass artifact cards in the site-wide card idiom (liquid-glass shell +
   pointer glow, azure stage). Every composition is a variants animation that
   replays on viewport entry and on hover (run-counter keyed remount, as the
   homepage proof cards do). Original copy. */

import { useState } from "react";
import { motion } from "framer-motion";
import GlowingEffect from "./GlowingEffect";
import Reveal from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/* shared variants factories */
const msgV = (d: number) => ({
  hide: { opacity: 0, y: 10, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay: d, duration: 0.34, ease: EASE } },
});
const popV = (d: number) => ({
  hide: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: [0.5, 1.15, 1], transition: { delay: d, duration: 0.4, times: [0, 0.65, 1], ease: EASE } },
});
const slideV = (d: number) => ({
  hide: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { delay: d, duration: 0.4, ease: EASE } },
});
const fadeV = (d: number) => ({
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { delay: d, duration: 0.3 } },
});
/* receipt/file cards land with a spring drop */
const dropV = (d: number) => ({
  hide: { opacity: 0, y: -22 },
  show: { opacity: 1, y: 0, transition: { delay: d, type: "spring" as const, stiffness: 380, damping: 17 } },
});

const check = (
  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0d2fb8] bg-[#22c55e]">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" aria-hidden>
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

/* 01 — the order lands: the exchange types itself in, then the order chip pops */
function OrderArt({ run }: { run: number }) {
  const dotsV = {
    hide: { opacity: 0 },
    show: { opacity: [0, 1, 1, 0], transition: { delay: 0.5, duration: 0.75, times: [0, 0.15, 0.8, 1] } },
  };
  return (
    <motion.div key={run} initial="hide" animate="show" className="flex w-full max-w-[320px] flex-col gap-2">
      <motion.div
        variants={msgV(0.15)}
        className="max-w-[85%] self-start rounded-lg rounded-tl-sm bg-white px-3 py-2 text-[13px] leading-snug text-[#111b21] shadow-[0_10px_26px_rgba(2,10,50,0.35)]"
      >
        Do you have the leather sandals in a 42?
      </motion.div>
      {/* typing dots bridge the question and the reply */}
      <motion.div
        variants={dotsV}
        className="flex items-center gap-[3px] self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-3 py-2.5 shadow-[0_10px_26px_rgba(2,10,50,0.35)]"
        aria-hidden
      >
        {[0, 1, 2].map((d) => (
          <span key={d} className="typing-dot h-[5px] w-[5px] rounded-full bg-black/40" />
        ))}
      </motion.div>
      <motion.div
        variants={msgV(1.3)}
        className="-mt-9 max-w-[85%] self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[13px] leading-snug text-[#111b21] shadow-[0_10px_26px_rgba(2,10,50,0.35)]"
      >
        We do — ₦18,500. Delivery or pickup?
      </motion.div>
      <motion.div
        variants={popV(2.0)}
        className="mt-2 flex items-center gap-2 self-center rounded-full border border-white/25 bg-white/12 px-4 py-2 backdrop-blur-sm"
      >
        <span className="grid place-items-center rounded-full bg-[#22c55e]" style={{ width: 18, height: 18 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" aria-hidden>
            <path d="m5 13 4.5 4.5L19 8" />
          </svg>
        </span>
        <span className="text-[12.5px] font-semibold text-white">Order #1090 created</span>
      </motion.div>
    </motion.div>
  );
}

/* 02 — the house adjusts: stock counts down 12→11, the rider chip slides in */
function OpsArt({ run }: { run: number }) {
  const outV = {
    hide: { opacity: 1, y: 0 },
    show: { opacity: 0, y: -10, transition: { delay: 1.05, duration: 0.3, ease: EASE } },
  };
  const inV = {
    hide: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { delay: 1.05, duration: 0.3, ease: EASE } },
  };
  return (
    <motion.div key={run} initial="hide" animate="show" className="flex items-center justify-center gap-4">
      <motion.span variants={popV(0.15)} className="inline-grid">
        <Tile>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2" aria-hidden>
            <path d="M12 2.8 20.2 7v10L12 21.2 3.8 17V7L12 2.8Z" />
            <path d="M3.8 7 12 11.2 20.2 7M12 11.2v10" />
          </svg>
        </Tile>
      </motion.span>
      <motion.span variants={fadeV(0.4)} className="h-px w-6 bg-white/40" />
      <div className="flex flex-col gap-2">
        <motion.div
          variants={msgV(0.55)}
          className="rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm"
        >
          Stock{" "}
          <span className="relative inline-grid overflow-hidden align-bottom">
            <motion.span variants={outV} className="col-start-1 row-start-1">12</motion.span>
            <motion.span variants={inV} className="col-start-1 row-start-1 text-[#7ef2ff]">11</motion.span>
          </span>{" "}
          <span className="text-white/50">units</span>
        </motion.div>
        <motion.div
          variants={slideV(1.45)}
          className="ml-5 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm"
        >
          Rider booked · <span className="text-[#7ef2a0]">Tue 2pm</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* 03 — the money is accounted for: payment pill pops, receipt drops in on a spring */
function FinanceArt({ run }: { run: number }) {
  return (
    <motion.div key={run} initial="hide" animate="show" className="flex flex-col items-center">
      <motion.div
        variants={popV(0.2)}
        className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/12 px-5 py-2.5 backdrop-blur-sm"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden>
            <path d="M12 20V4m0 16 5.5-5.5M12 20l-5.5-5.5" />
          </svg>
        </span>
        <span className="text-[13.5px] font-bold text-white">
          ₦18,500 received <span className="font-medium text-white/60">· matched</span>
        </span>
      </motion.div>
      <motion.span variants={fadeV(0.75)} className="h-4 w-px bg-white/40" />
      <motion.div variants={dropV(0.9)}>
        <FileCard title="Receipt-1090.pdf" sub="sent to customer · books current" />
      </motion.div>
    </motion.div>
  );
}

/* 04 — the beat: metric pills stagger in, the brief lands — compact stage */
function BriefArt({ run }: { run: number }) {
  return (
    <motion.div key={run} initial="hide" animate="show" className="flex items-center justify-center gap-3.5">
      <div className="flex flex-col gap-1.5">
        <motion.div
          variants={slideV(0.15)}
          className="rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm"
        >
          Sales today ₦96k <span className="text-[#7ef2a0]">▲</span>
        </motion.div>
        <motion.div
          variants={slideV(0.35)}
          className="ml-3 rounded-full border border-white/25 bg-white/12 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm"
        >
          Orders 7 · all fulfilled
        </motion.div>
      </div>
      <motion.span variants={fadeV(0.55)} className="h-px w-5 bg-white/40" />
      <motion.div variants={dropV(0.7)}>
        <FileCard title="Daily-Brief.pdf" sub="sales · cash · stock" />
      </motion.div>
    </motion.div>
  );
}

type Row = {
  step: string;
  eyebrow: string;
  title: string;
  body: string;
  Art: React.ComponentType<{ run: number }>;
  compact?: boolean;
};

const ROWS: Row[] = [
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
    compact: true,
  },
];

/* card shell in the site-wide idiom; run counter replays the composition on
   viewport entry and on every hover */
function SpotCard({ Art, compact }: { Art: React.ComponentType<{ run: number }>; compact?: boolean }) {
  const [run, setRun] = useState(0);
  return (
    <motion.div
      onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))}
      onHoverStart={() => setRun((r) => r + 1)}
      className="group liquid-glass glass-ring relative rounded-[32px] shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(8,60,255,0.18)]"
    >
      <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
      <div
        className={`bg-azure-dawn-hero relative m-3 grid place-items-center overflow-hidden rounded-3xl border border-white/10 p-6 ${
          compact ? "min-h-[180px]" : "min-h-[264px]"
        }`}
      >
        <Art run={run} />
      </div>
    </motion.div>
  );
}

export default function SpotlightRows() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <Reveal className="mb-14 text-center">
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
      </Reveal>

      <div className="flex flex-col gap-14 sm:gap-20">
        {ROWS.map(({ step, eyebrow, title, body, Art, compact }, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={step} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <Reveal className={flip ? "md:order-2" : ""}>
                <p className="font-mono text-[13px] font-semibold tracking-wide text-[var(--color-blue)]">
                  {step} — {eyebrow}
                </p>
                <h3 className="text-display-3 mt-3">{title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                  {body}
                </p>
              </Reveal>
              <Reveal delay={0.12} className={flip ? "md:order-1" : ""}>
                <SpotCard Art={Art} compact={compact} />
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
