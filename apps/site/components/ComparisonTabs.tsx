"use client";

/* Four-tab comparison: generic AI tools hand you homework; Sardauna hands
   you outcomes. Tab pill row (active = gradient fill) + side-by-side cards —
   muted competitor card left, branded gradient card right with a corner
   logo tile and artifact chip. Original copy throughout. */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* real competitor marks, inlined (owner direction) */
const LOGOS: Record<string, React.ReactNode> = {
  chatgpt: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#10a37f" aria-hidden>
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.21 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.5 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.54-3.01l.14.09 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.97v5.68a.77.77 0 0 0 .39.68l5.83 3.37-2.02 1.16a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.6 3.86-5.83-3.39 2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.12v-5.68a.79.79 0 0 0-.41-.68zm2-3.02-.14-.09-4.77-2.79a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.78a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.13-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.4.68zm1.1-2.36 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
    </svg>
  ),
  copilot: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="9.5" height="9.5" fill="#f25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7fba00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00a4ef" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#ffb900" />
    </svg>
  ),
  zapier: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4f00" aria-hidden>
      <path d="M14.5 12c0 .74-.13 1.45-.38 2.11-.66.25-1.37.39-2.12.39s-1.46-.14-2.12-.39A5.96 5.96 0 0 1 9.5 12c0-.74.13-1.45.38-2.11.66-.25 1.37-.39 2.12-.39s1.46.14 2.12.39c.25.66.38 1.37.38 2.11zm7.3-1.5h-5.8l4.1-4.1a9.6 9.6 0 0 0-1.06-1.26 9.6 9.6 0 0 0-1.25-1.05l-4.1 4.1V2.4A9.2 9.2 0 0 0 12.2 2.25h-.02c-.5 0-1 .05-1.48.15v5.79l-4.1-4.1c-.44.31-.86.66-1.25 1.05-.39.4-.74.82-1.05 1.26l4.1 4.1H2.6s-.15.98-.15 1.49v.02c0 .5.05 1 .15 1.49h5.8l-4.1 4.1c.62.9 1.4 1.68 2.3 2.3l4.1-4.1v5.8c.48.1.98.15 1.48.15h.03c.5 0 1-.05 1.48-.15v-5.8l4.1 4.1a9.83 9.83 0 0 0 2.31-2.3l-4.1-4.1h5.8c.1-.48.15-.98.15-1.48v-.03c0-.5-.05-1-.15-1.48z" />
    </svg>
  ),
  sheets: (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#0f9d58" />
      <path d="M8 10h8v8H8z" fill="#fff" opacity=".92" />
      <path d="M8 12.6h8M8 15.2h8M10.7 10v8M13.4 10v8" stroke="#0f9d58" strokeWidth="1" />
    </svg>
  ),
};

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
    left: { name: "ChatGPT", logo: "chatgpt", line: "Hands you a 7-step marketing plan to run yourself." },
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
    left: { name: "Copilot", logo: "copilot", line: "Leaves you a tidy meeting summary." },
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
    left: { name: "Zapier", logo: "zapier", line: "Runs the rules you have to write yourself." },
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
    left: { name: "Spreadsheets", logo: "sheets", line: "Wait for you to type the numbers in." },
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
        Chatbots reply. Sardauna gives results. Ask an AI tool and you get
        instructions — ask Sardauna and the work comes back finished, with
        receipts.
      </p>

      {/* tab pill row */}
      <div className="mt-10 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label="Compare what you get"
          className="mx-auto inline-flex min-w-max gap-1 rounded-full border border-black/5 bg-white p-1.5 shadow-[0_10px_30px_rgba(16,20,42,0.07)]"
        >
          {TABS.map((t) => {
            const active = t.key === key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`cmp-tab-${t.key}`}
                aria-selected={active}
                aria-controls="cmp-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setKey(t.key)}
                onKeyDown={(e) => {
                  /* arrow keys move between tabs, as a tablist is expected to */
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const i = TABS.findIndex((x) => x.key === key);
                  const nextIdx =
                    e.key === "ArrowRight"
                      ? (i + 1) % TABS.length
                      : (i - 1 + TABS.length) % TABS.length;
                  const nextKey = TABS[nextIdx].key;
                  setKey(nextKey);
                  document.getElementById(`cmp-tab-${nextKey}`)?.focus();
                }}
                className="relative isolate flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors"
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
          id="cmp-panel"
          role="tabpanel"
          aria-labelledby={`cmp-tab-${tab.key}`}
          className="mt-8 grid gap-5 text-left md:grid-cols-2"
        >
          {/* competitor — muted */}
          <div className="liquid-glass glass-ring flex min-h-[250px] flex-col justify-between rounded-[28px] p-7 shadow-[0_16px_40px_rgba(16,20,42,0.06)] transition-all duration-300 hover:-translate-y-1 sm:p-9">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm">
                {LOGOS[tab.left.logo]}
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
          <div className="glass-ring group/sard relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b3bda_0%,#0a1d7a_55%,#050b3d_100%)] p-7 text-white shadow-[0_30px_60px_rgba(2,6,31,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(2,6,31,0.55)] sm:p-9">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/3 h-48 w-64 rounded-full bg-[var(--color-cyan)]/25 blur-3xl"
            />
            <div className="flex items-start justify-between gap-4">
              <span className="text-[19px] font-bold tracking-tight">Sardauna</span>
              <div className="flex flex-col items-end">
                <img
                  src="/logo-128.png"
                  alt=""
                  className="h-12 w-12 drop-shadow-[0_12px_28px_rgba(2,10,50,0.6)] transition-transform duration-300 group-hover/sard:scale-105"
                />
                <div className="-mr-1 mt-2 rounded-lg border border-white/25 bg-white/12 px-3 py-1.5 text-right backdrop-blur-sm">
                  <div className="text-[11.5px] font-semibold">{tab.right.artifact.title}</div>
                  <div className="text-[10px] text-white/70">{tab.right.artifact.sub}</div>
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
