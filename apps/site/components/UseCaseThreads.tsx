"use client";

/* Tabbed starter demo: five department threads rendered as a WhatsApp-style
   workspace — chat-list sidebar + transcript pane. Owner talks, the agent
   works, approvals gate anything that leaves the house. Original copy;
   transcripts mirror the flows the suite actually runs. */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Msg =
  | { kind: "agent" | "owner"; text: string; time: string }
  | { kind: "buttons"; text: string; time: string; options: string[] }
  | { kind: "artifact"; title: string; sub: string; time: string };

type Thread = {
  key: string;
  tab: string;
  agent: string;
  dept: string;
  accent: string;
  preview: string;
  clock: string;
  unread?: number;
  msgs: Msg[];
};

const THREADS: Thread[] = [
  {
    key: "support",
    tab: "#Support",
    agent: "Zara",
    dept: "Comms",
    accent: "#7b2ff7",
    preview: "Inbox is clear.",
    clock: "09:14",
    msgs: [
      { kind: "agent", text: "New message on WhatsApp — Chidinma is asking where her order is.", time: "09:02" },
      { kind: "agent", text: "Found it: #1082 left this morning. I've sent her the rider's number and a 2pm ETA.", time: "09:03" },
      { kind: "owner", text: "Perfect. Anything else waiting?", time: "09:12" },
      { kind: "agent", text: "Two product questions — both answered from the catalogue. Inbox is clear.", time: "09:14" },
      { kind: "artifact", title: "3 conversations handled", sub: "avg. reply under 2 min", time: "09:14" },
    ],
  },
  {
    key: "sales",
    tab: "#Sales",
    agent: "Tunde",
    dept: "Growth",
    accent: "#083cff",
    preview: "She's in the CRM — follow-up set.",
    clock: "11:31",
    unread: 1,
    msgs: [
      { kind: "agent", text: "New lead from the Instagram ad — Mrs Bello, asking about bulk pricing.", time: "11:20" },
      { kind: "agent", text: "She fits the wholesale profile. I've sent the price list and proposed Thursday for a call.", time: "11:22" },
      { kind: "owner", text: "Good. Put her in the pipeline.", time: "11:29" },
      { kind: "agent", text: "Done — she's in the CRM under Wholesale with a follow-up set for Friday morning.", time: "11:31" },
      { kind: "artifact", title: "CRM updated", sub: "1 new lead · follow-up Fri 9:00", time: "11:31" },
    ],
  },
  {
    key: "ops",
    tab: "#Ops",
    agent: "Kola",
    dept: "Operations",
    accent: "#0ea5e9",
    preview: "PO-114 sent — delivery Tuesday.",
    clock: "13:07",
    msgs: [
      { kind: "agent", text: "Stock check: the ankara tote is down to 6 units — below your 10-unit floor.", time: "12:55" },
      {
        kind: "buttons",
        text: "Restock order drafted — 40 units from Alhaji Musa at the usual price. Send it?",
        time: "12:56",
        options: ["Approve", "Hold"],
      },
      { kind: "owner", text: "Approve.", time: "13:05" },
      { kind: "agent", text: "Sent. Delivery expected Tuesday — I'll log it in the moment it lands.", time: "13:07" },
      { kind: "artifact", title: "PO-114 sent", sub: "40 units · awaiting delivery", time: "13:07" },
    ],
  },
  {
    key: "finance",
    tab: "#Finance",
    agent: "Ngozi",
    dept: "Finance",
    accent: "#16a34a",
    preview: "Receipt issued — books current.",
    clock: "15:42",
    unread: 2,
    msgs: [
      { kind: "agent", text: "INV-208 is 9 days overdue. I've sent Mr Adewale a polite reminder.", time: "15:18" },
      { kind: "agent", text: "Update — he just paid. ₦85,000 received and matched to the invoice.", time: "15:36" },
      { kind: "owner", text: "Send him the receipt.", time: "15:40" },
      { kind: "agent", text: "Receipt issued, WHT noted, books updated. Outstanding invoices: two.", time: "15:42" },
      { kind: "artifact", title: "Receipt-208.pdf", sub: "₦85,000 · books current", time: "15:42" },
    ],
  },
  {
    key: "growth",
    tab: "#Growth",
    agent: "Emeka",
    dept: "Analyst",
    accent: "#e8a723",
    preview: "Best sales week this month.",
    clock: "07:00",
    msgs: [
      { kind: "agent", text: "Your 07:00 brief is ready.", time: "07:00" },
      { kind: "artifact", title: "Monday-Brief.pdf", sub: "sales · cash · stock — 4 pages", time: "07:00" },
      {
        kind: "agent",
        text: "Headline: best sales week this month, but two products drive 70% of it. One decision is waiting — the restock approval in #Ops.",
        time: "07:00",
      },
      { kind: "owner", text: "What would you push this week?", time: "07:24" },
      { kind: "agent", text: "The two movers. Tunde has a promo draft ready whenever you want to see it.", time: "07:25" },
    ],
  },
];

const listVariants = {
  hide: {},
  show: { transition: { staggerChildren: 0.055 } },
};
const itemVariants = {
  hide: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
};

const ticks = (
  <svg width="15" height="10" viewBox="0 0 18 12" fill="none" stroke="#53bdeb" strokeWidth="1.8" className="inline-block">
    <path d="m1 6.5 3 3L9.5 4" />
    <path d="m7.5 6.5 3 3L16 4" />
  </svg>
);

function Bubble({ msg, first }: { msg: Msg; first: boolean }) {
  const stamp = (
    <span className="float-right mb-[-2px] ml-2 mt-[7px] flex items-center gap-1 text-[10px] leading-none text-black/40">
      {msg.time}
      {msg.kind === "owner" && ticks}
    </span>
  );

  if (msg.kind === "owner") {
    return (
      <div className={`relative max-w-[78%] self-end rounded-lg bg-[#d9fdd3] px-3 py-1.5 shadow-sm ${first ? "wa-tail-out" : ""}`}>
        <p className="text-[13.5px] leading-snug text-[#111b21]">
          {msg.text}
          {stamp}
        </p>
      </div>
    );
  }

  if (msg.kind === "buttons") {
    return (
      <div className={`relative max-w-[78%] self-start overflow-hidden rounded-lg bg-white shadow-sm ${first ? "wa-tail-in" : ""}`}>
        <p className="px-3 pt-1.5 text-[13.5px] leading-snug text-[#111b21]">
          {msg.text}
          {stamp}
        </p>
        <div className="mt-1.5 flex border-t border-black/8">
          {msg.options.map((o, i) => (
            <span
              key={o}
              className={`flex-1 py-2 text-center text-[13px] font-medium text-[#008ecc] ${i > 0 ? "border-l border-black/8" : ""}`}
            >
              {o}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (msg.kind === "artifact") {
    return (
      <div className={`relative max-w-[78%] self-start rounded-lg bg-white p-1.5 shadow-sm ${first ? "wa-tail-in" : ""}`}>
        <div className="flex items-center gap-2.5 rounded-md bg-[#f0f2f5] px-2.5 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-blue)]/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2">
              <path d="M6 2.8h8L19.2 8v13.2H6z" />
              <path d="M13.5 3v5.5H19M9.5 13h5m-5 4h5" />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold text-[#111b21]">{msg.title}</div>
            <div className="text-[11px] text-black/50">{msg.sub}</div>
          </div>
        </div>
        <span className="float-right mt-1 pr-1 text-[10px] leading-none text-black/40">{msg.time}</span>
      </div>
    );
  }

  return (
    <div className={`relative max-w-[78%] self-start rounded-lg bg-white px-3 py-1.5 shadow-sm ${first ? "wa-tail-in" : ""}`}>
      <p className="text-[13.5px] leading-snug text-[#111b21]">
        {msg.text}
        {stamp}
      </p>
    </div>
  );
}

export default function UseCaseThreads() {
  const [key, setKey] = useState(THREADS[2].key); // open on #Ops — the approval story
  const thread = THREADS.find((t) => t.key === key) ?? THREADS[0];

  // deep-link / QA hook: ?t=<thread key> opens that thread on load
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("t");
    if (q && THREADS.some((t) => t.key === q)) setKey(q);
  }, []);

  return (
    <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
            The starter demo
          </p>
          <h2 className="text-display-2 mx-auto max-w-3xl text-white">
            Pick a department. <span className="text-dawn-gradient-bright">Watch it work.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Five threads from a running house — the conversations you&apos;d have
            with staff, minus the payroll. Anything that leaves the house waits
            for your approval.
          </p>
        </div>

        {/* thread tab row */}
        <div className="mb-6 overflow-x-auto pb-1 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto inline-flex min-w-max gap-1 rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur-sm">
            {THREADS.map((t) => {
              const active = t.key === key;
              return (
                <button
                  key={t.key}
                  onClick={() => setKey(t.key)}
                  className="relative rounded-full px-4.5 py-2 text-[14px] font-semibold transition-colors"
                  style={{ color: active ? "var(--color-ink)" : "rgba(255,255,255,0.75)", paddingInline: 18 }}
                >
                  {active && (
                    <motion.span
                      layoutId="uc-tab-thumb"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_10px_24px_rgba(2,6,31,0.35)]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {t.tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* workspace panel */}
        <div className="glass-ring mx-auto grid max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_rgba(2,6,31,0.45)] md:grid-cols-[280px_1fr]">
          {/* chat-list sidebar */}
          <aside className="hidden flex-col border-r border-black/8 bg-white md:flex">
            <div className="border-b border-black/6 px-4 py-3">
              <div className="rounded-lg bg-[#f0f2f5] px-3 py-2 text-[12.5px] text-black/45">
                Search or start a new chat
              </div>
            </div>
            {THREADS.map((t) => {
              const active = t.key === key;
              return (
                <button
                  key={t.key}
                  onClick={() => setKey(t.key)}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    active ? "bg-[#f0f2f5]" : "hover:bg-black/3"
                  }`}
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white"
                    style={{ background: t.accent }}
                  >
                    {t.agent[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold text-[#111b21]">
                        {t.tab} · {t.agent}
                      </span>
                      <span className="shrink-0 text-[10.5px] text-black/40">{t.clock}</span>
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12.5px] text-black/50">{t.preview}</span>
                      {!active && t.unread ? (
                        <span className="grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded-full bg-[#25d366] px-1 text-[10px] font-bold text-white">
                          {t.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              );
            })}
          </aside>

          {/* transcript pane */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-black/6 bg-[#f0f2f5] px-4 py-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold text-white"
                style={{ background: thread.accent }}
              >
                {thread.agent[0]}
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold leading-tight text-[#111b21]">
                  {thread.tab} · {thread.agent}
                </div>
                <div className="text-[11.5px] text-black/50">{thread.dept} · online</div>
              </div>
            </div>

            <div className="wa-wallpaper min-h-[380px] flex-1 px-4 py-4 sm:px-6">
              {/* keyed remount restarts the stagger on every thread switch —
                  no exit phase, so a swap can never strand a blank pane */}
              <motion.div
                key={thread.key}
                variants={listVariants}
                initial="hide"
                animate="show"
                className="flex flex-col gap-1.5"
              >
                  <motion.div variants={itemVariants} className="self-center">
                    <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10.5px] font-medium uppercase text-black/50 shadow-sm">
                      Today
                    </span>
                  </motion.div>
                  {thread.msgs.map((m, i) => {
                    const prev = thread.msgs[i - 1];
                    const side = (x: Msg) => (x.kind === "owner" ? "owner" : "agent");
                    const first = !prev || side(prev) !== side(m);
                    return (
                      <motion.div key={i} variants={itemVariants} className="flex flex-col">
                        <Bubble msg={m} first={first} />
                      </motion.div>
                    );
                  })}
                </motion.div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-white/50">
          Transcripts are illustrative — the WhatsApp flow mirrors how Sardauna
          runs in production today.
        </p>
      </div>
    </section>
  );
}
