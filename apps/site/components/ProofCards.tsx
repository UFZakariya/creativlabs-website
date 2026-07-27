"use client";

/* Four proof cards — liquid-glass shells with live, hover-reactive artifact
   panels (agent-template style): a chat that replays, an integration orbit,
   a metric line that draws itself, and a memory web that lights up. Every
   animation is variants-based (enter replays via keyed remount; hovering a
   card replays its panel). Original compositions and copy. */

import { useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const gridV = { hide: {}, show: { transition: { staggerChildren: 0.12 } } };
const cardV = {
  hide: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* 1 — the chat: request in, finished work back */
function ChatArt({ run }: { run: number }) {
  const msg = (delay: number) => ({
    hide: { opacity: 0, y: 10, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.34, ease: EASE } },
  });
  return (
    <motion.div key={run} initial="hide" animate="show" className="flex w-full max-w-[300px] flex-col gap-2">
      <motion.div
        variants={msg(0.15)}
        className="self-end rounded-2xl rounded-br-md bg-[var(--color-blue)] px-3.5 py-2 text-[13px] font-medium leading-snug text-white shadow-[0_8px_20px_rgba(8,60,255,0.25)]"
      >
        Compile this week&apos;s brief, please.
      </motion.div>
      <motion.div
        variants={msg(0.75)}
        className="flex items-start gap-2 self-start"
      >
        <img src="/logo-128.png" alt="" className="mt-0.5 h-6 w-6 shrink-0" />
        <div className="rounded-2xl rounded-bl-md border border-black/6 bg-white px-3.5 py-2 text-[13px] leading-snug text-[var(--color-ink)] shadow-sm">
          Done — sales, cash and stock, six pages. It&apos;s in your chat.
        </div>
      </motion.div>
      <motion.div variants={msg(1.35)} className="ml-8 flex items-center gap-2.5 self-start rounded-xl border border-black/6 bg-white px-3 py-2 shadow-sm">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-blue)]/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2" aria-hidden>
            <path d="M6 2.8h8L19.2 8v13.2H6z" />
            <path d="M13.5 3v5.5H19M9.5 13h5m-5 4h5" />
          </svg>
        </span>
        <span>
          <span className="block text-[12px] font-semibold text-[var(--color-ink)]">Weekly-Brief.pdf</span>
          <span className="block text-[10.5px] text-black/45">6 pages · ready</span>
        </span>
        <span className="ml-1 grid h-4.5 w-4.5 place-items-center rounded-full bg-[#22c55e]" style={{ width: 17, height: 17 }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" aria-hidden>
            <path d="m5 13 4.5 4.5L19 8" />
          </svg>
        </span>
      </motion.div>
    </motion.div>
  );
}

/* 2 — the orbit: departments circling one request */
function OrbitArt({ run }: { run: number }) {
  const DEPT = [
    { label: "Ops", angle: 0, r: 62 },
    { label: "Fin", angle: 130, r: 62 },
    { label: "Gro", angle: 245, r: 62 },
  ];
  const pop = (i: number) => ({
    hide: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1, transition: { delay: 0.2 + i * 0.14, duration: 0.4, ease: EASE } },
  });
  return (
    <motion.div key={run} initial="hide" animate="show" className="relative grid h-[190px] w-[190px] place-items-center">
      {/* rings */}
      <span aria-hidden className="absolute inset-0 rounded-full border border-[var(--color-blue)]/12" />
      <span aria-hidden className="absolute inset-[30px] rounded-full border border-[var(--color-blue)]/18" />
      {/* orbiting departments — slow spin, tiles counter-rotated upright */}
      <div aria-hidden className="absolute inset-0 [animation:orbit_22s_linear_infinite] group-hover:[animation-duration:7s]">
        {DEPT.map(({ label, angle, r }, i) => (
          <span
            key={label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateY(-${r}px)` }}
          >
            <span className="block [animation:orbit_22s_linear_infinite_reverse] group-hover:[animation-duration:7s]">
              <motion.span
                variants={pop(i)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-black/6 bg-white text-[10px] font-bold text-[var(--color-blue)] shadow-sm"
                style={{ margin: -18, rotate: `${-angle}deg` }}
              >
                {label}
              </motion.span>
            </span>
          </span>
        ))}
      </div>
      {/* centre */}
      <motion.span
        variants={pop(0)}
        className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-[0_14px_30px_rgba(8,60,255,0.22)]"
      >
        <span aria-hidden className="absolute -inset-2 -z-10 rounded-full bg-[var(--color-azure)]/20 blur-lg" />
        <img src="/logo-128.png" alt="" className="h-8 w-8" />
      </motion.span>
    </motion.div>
  );
}

/* 3 — the schedule: recurring work checking itself off, clock sweeping */
function ScheduleArt({ run }: { run: number }) {
  const rows = [
    { when: "07:00", what: "Daily brief", d: 0.45 },
    { when: "Mon", what: "Sales reconciliation", d: 0.95 },
    { when: "1st", what: "Month-end pack", d: 1.45 },
  ];
  const pop = (d: number) => ({
    hide: { opacity: 0, scale: 0.4 },
    show: { opacity: 1, scale: 1, transition: { delay: d, duration: 0.3, ease: EASE } },
  });
  const rowV = (d: number) => ({
    hide: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0, transition: { delay: d - 0.25, duration: 0.35, ease: EASE } },
  });
  return (
    <motion.div key={run} initial="hide" animate="show" className="w-full max-w-[250px]">
      <div className="rounded-2xl border border-black/6 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-blue)]/10">
              <span aria-hidden className="absolute h-5 w-5 rounded-full border-[1.8px] border-[#083cff]" />
              <span aria-hidden className="absolute bottom-1/2 left-1/2 h-[7px] w-[2px] origin-bottom rounded bg-[#083cff] [animation:orbit_5s_linear_infinite]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-black/40">On schedule</span>
          </span>
          <motion.span
            variants={pop(1.9)}
            className="rounded-full bg-[var(--color-blue)]/8 px-2.5 py-1 text-[10.5px] font-bold text-[var(--color-blue)]"
          >
            next · 07:00
          </motion.span>
        </div>
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <motion.div
              key={r.what}
              variants={rowV(r.d)}
              className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-[#f8faff] px-3 py-2"
            >
              <span className="w-9 shrink-0 font-mono text-[10px] font-bold text-[var(--color-blue)]">{r.when}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--color-ink)]">{r.what}</span>
              <motion.span
                variants={pop(r.d)}
                className="grid shrink-0 place-items-center rounded-full bg-[#22c55e]"
                style={{ width: 16, height: 16 }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" aria-hidden>
                  <path d="m5 13 4.5 4.5L19 8" />
                </svg>
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* 4 — the memory web: channels light up into one memory */
function MemoryArt({ run }: { run: number }) {
  const sats = [
    { x: 28, y: 28, icon: "chat" },
    { x: 212, y: 22, icon: "mail" },
    { x: 218, y: 108, icon: "doc" },
  ];
  const icons: Record<string, React.ReactNode> = {
    chat: <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
      </>
    ),
    doc: (
      <>
        <path d="M6 2.8h8L19.2 8v13.2H6z" />
        <path d="M13.5 3v5.5H19M9 13h6M9 17h6" />
      </>
    ),
  };
  const lineV = { hide: { pathLength: 0, opacity: 0 }, show: (i: number) => ({ pathLength: 1, opacity: 1, transition: { delay: 0.25 + i * 0.22, duration: 0.5, ease: "easeOut" as const } }) };
  const satV = (i: number) => ({
    hide: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { delay: 0.55 + i * 0.22, duration: 0.35, ease: EASE } },
  });
  return (
    <motion.div key={run} initial="hide" animate="show" className="relative h-[140px] w-full max-w-[260px]">
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 260 140" fill="none">
        {sats.map((s, i) => (
          <motion.path
            key={i}
            custom={i}
            variants={lineV}
            d={`M130 70 L ${s.x} ${s.y}`}
            stroke="rgba(8,60,255,0.3)"
            strokeWidth="1.5"
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
        ))}
      </svg>
      {sats.map((s, i) => (
        <motion.span
          key={i}
          variants={satV(i)}
          className="absolute grid h-9 w-9 place-items-center rounded-xl border border-black/6 bg-white text-[var(--color-blue)] shadow-sm"
          style={{ left: s.x - 18, top: s.y - 18 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            {icons[s.icon]}
          </svg>
        </motion.span>
      ))}
      <motion.span
        variants={satV(0)}
        className="absolute left-1/2 top-1/2 grid h-13 w-13 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-white shadow-[0_14px_30px_rgba(8,60,255,0.22)]"
        style={{ width: 52, height: 52 }}
      >
        <span aria-hidden className="absolute -inset-2 -z-10 rounded-full bg-[var(--color-cyan)]/25 blur-lg" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="1.9" aria-hidden>
          <path d="M12 3.5c1 2.6 2.9 4.5 5.5 5.5-2.6 1-4.5 2.9-5.5 5.5-1-2.6-2.9-4.5-5.5-5.5 2.6-1 4.5-2.9 5.5-5.5Z" />
          <path d="M18.5 14.5c.5 1.4 1.6 2.5 3 3-1.4.5-2.5 1.6-3 3-.5-1.4-1.6-2.5-3-3 1.4-.5 2.5-1.6 3-3Z" />
        </svg>
      </motion.span>
    </motion.div>
  );
}

const CARDS = [
  {
    title: "Finished work, not suggestions",
    body: "Agents come back with the order confirmed, the invoice sent, the brief compiled — artifacts, receipts and all.",
    Art: ChatArt,
  },
  {
    title: "One request, whole company",
    body: "Intelligent agentic orchestration, delegation and review. Ask Sardauna once — the chief of staff breaks the job down and hands each piece to the right department agent.",
    Art: OrbitArt,
  },
  {
    title: "Runs on a schedule",
    body: "Daily briefs, weekly reconciliations, month-end packs — recurring work happens without you asking twice.",
    Art: ScheduleArt,
  },
  {
    title: "It knows your business",
    body: "Built on agentic engineering, knowledge graphs and workflow optimization — your products, prices, people and history stay in the house's memory.",
    Art: MemoryArt,
  },
];

function ProofCard({ title, body, Art }: (typeof CARDS)[number]) {
  const [run, setRun] = useState(0);
  return (
    <motion.article
      variants={cardV}
      onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))}
      onHoverStart={() => setRun((r) => r + 1)}
      className="group liquid-glass glass-ring overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_32px_80px_rgba(8,60,255,0.18)]"
    >
      <div className="relative m-3 grid min-h-[264px] place-items-center overflow-hidden rounded-3xl border border-white/40 bg-white/20 p-5 backdrop-blur-sm">
        <Art run={run} />
      </div>
      <div className="px-6 pb-6 pt-3">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">{body}</p>
      </div>
    </motion.article>
  );
}

export default function ProofCards() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-4 inline-block rounded-full border border-[var(--color-blue)]/25 bg-[var(--color-blue)]/5 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-blue)]">
          Staff, not software
        </p>
        <h2 className="text-display-2 mx-auto max-w-3xl">
          Why it feels like <span className="text-dawn-gradient">a team</span> —
          not another app
        </h2>
      </div>

      <motion.div
        variants={gridV}
        initial="hide"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 md:grid-cols-2"
      >
        {CARDS.map((c) => (
          <ProofCard key={c.title} {...c} />
        ))}
      </motion.div>
    </section>
  );
}
