"use client";

/* Four-tab comparison: generic AI tools hand you homework; Sardauna hands
   you outcomes. Tab pill row (active = gradient fill) + side-by-side cards —
   muted competitor card left, branded gradient card right with a corner
   logo tile and artifact chip. Original copy throughout. */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TABS = [
  {
    key: "marketing",
    label: "Marketing",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 10v4l11 5V5L3 10Z" />
        <path d="M14 7.5a17 17 0 0 0 7-1.5v12a17 17 0 0 0-7-1.5M7.5 14.6V19a1.6 1.6 0 0 0 3.2 0v-3" />
      </svg>
    ),
    left: { name: "ChatGPT", mono: "G", line: "Hands you a 7-step marketing plan to run yourself." },
    right: {
      chip: "Runs the campaign.",
      rest: "Reads your analytics, creates and posts the content, and adjusts from live feedback.",
      artifact: { title: "Campaign-Report.pdf", sub: "this week · 4 posts live" },
    },
  },
  {
    key: "meetings",
    label: "Meeting Follow-ups",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
        <path d="M8 2.8V6m8-3.2V6M8 13.5l2.6 2.6 5.4-5.4" />
      </svg>
    ),
    left: { name: "Copilot", mono: "C", line: "Leaves you a tidy meeting summary." },
    right: {
      chip: "Closes the loop.",
      rest: "Turns decisions into tasks, sends every follow-up, and keeps the CRM current.",
      artifact: { title: "CRM updated", sub: "5 tasks · 3 follow-ups sent" },
    },
  },
  {
    key: "workflow",
    label: "Workflow Automation",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.8v3m0 12.4v3M2.8 12h3m12.4 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
    left: { name: "Zapier", mono: "Z", line: "Runs the rules you have to write yourself." },
    right: {
      chip: "Finds the busywork.",
      rest: "Spots what repeats across the business, takes it over, and reports the hours saved.",
      artifact: { title: "3 workflows live", sub: "9.5 hrs saved this month" },
    },
  },
  {
    key: "compliance",
    label: "Compliance & Reports",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2.8h8L19.2 8v13.2H6z" />
        <path d="M13.5 3v5.5H19M9.5 13h5m-5 4h5" />
      </svg>
    ),
    left: { name: "Spreadsheets", mono: "S", line: "Wait for you to type the numbers in." },
    right: {
      chip: "Compiles the pack.",
      rest: "VAT ready before the deadline, filings on the calendar, missing records chased down.",
      artifact: { title: "VAT-Pack.pdf", sub: "due in 6 days · ready" },
    },
  },
];

export default function ComparisonTabs() {
  const [key, setKey] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === key) ?? TABS[0];

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-4 text-center sm:pb-32">
      <h2 className="text-display-2">
        A reply is <span className="text-dawn-gradient">not a result.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Ask an AI tool and you get instructions. Ask Sardauna and the work
        comes back finished — with receipts.
      </p>

      {/* tab pill row */}
      <div className="mt-10 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto inline-flex min-w-max gap-1 rounded-full border border-black/5 bg-white p-1.5 shadow-[0_10px_30px_rgba(16,20,42,0.07)]">
          {TABS.map((t) => {
            const active = t.key === key;
            return (
              <button
                key={t.key}
                onClick={() => setKey(t.key)}
                className="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors"
                style={{ color: active ? "#fff" : "var(--color-ink-soft)" }}
              >
                {active && (
                  <motion.span
                    layoutId="cmp-tab-thumb"
                    className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(90deg,#083cff,#7b2ff7)] shadow-[0_10px_24px_rgba(8,60,255,0.35)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* side-by-side cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 grid gap-5 text-left md:grid-cols-2"
        >
          {/* competitor — muted */}
          <div className="glass-ring flex min-h-[250px] flex-col justify-between rounded-[28px] bg-white/70 p-7 shadow-[0_16px_40px_rgba(16,20,42,0.06)] backdrop-blur-sm sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-black/6 text-[15px] font-bold text-black/55">
                {tab.left.mono}
              </span>
              <span className="text-[17px] font-semibold text-[var(--color-ink)]/80">
                {tab.left.name}
              </span>
            </div>
            <p className="text-[21px] font-medium leading-snug text-[var(--color-ink-soft)]">
              {tab.left.line}
            </p>
          </div>

          {/* Sardauna — branded */}
          <div className="glass-ring relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b3bda_0%,#0a1d7a_55%,#050b3d_100%)] p-7 text-white shadow-[0_30px_60px_rgba(2,6,31,0.4)] sm:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/3 h-48 w-64 rounded-full bg-[var(--color-cyan)]/25 blur-3xl"
            />
            <div className="flex items-start justify-between gap-4">
              <span className="text-[19px] font-bold tracking-tight">Sardauna</span>
              <div className="flex flex-col items-end">
                <span className="grid h-13 w-13 place-items-center rounded-2xl bg-white p-2 shadow-[0_14px_34px_rgba(2,10,50,0.5)]" style={{ width: 52, height: 52 }}>
                  <img src="/logo-128.png" alt="" className="h-8 w-8" />
                </span>
                <div className="-mr-1 mt-2 rounded-lg border border-white/25 bg-white/12 px-3 py-1.5 text-right backdrop-blur-sm">
                  <div className="text-[11.5px] font-semibold">{tab.right.artifact.title}</div>
                  <div className="text-[10px] text-white/60">{tab.right.artifact.sub}</div>
                </div>
              </div>
            </div>
            <p className="max-w-[26rem] text-[21px] font-medium leading-snug">
              <span className="mr-1 rounded-md bg-white/22 px-2 py-0.5 font-semibold">
                {tab.right.chip}
              </span>
              <span className="text-white/90">{tab.right.rest}</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
