"use client";

/* Mission control — a hand-built showcase of the Safetyline Business Suite:
   browser-chrome frame, dark sidebar with the real 7-module set, and a main
   pane of KPI cards, the approvals queue and the audit-logged agent feed.
   Chief-of-Staff chat / Operations / Finance open prepared panes via keyed
   remounts (no AnimatePresence). Variants-based, whileInView-triggered,
   replays on hover. Figures are the same demo figures as the homepage. */

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import GlowingEffect from "./GlowingEffect";

const EASE = [0.22, 1, 0.36, 1] as const;

type PaneKey = "chat" | "operations" | "finance";

/* ---------- shared variants ---------- */

const popV = (d: number) => ({
  hide: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: [0.5, 1.15, 1],
    transition: { delay: d, duration: 0.45, times: [0, 0.6, 1], ease: EASE },
  },
});
const rowV = (d: number) => ({
  hide: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { delay: d, duration: 0.38, ease: EASE } },
});
const cardV = (d: number) => ({
  hide: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { delay: d, duration: 0.45, ease: EASE } },
});
const msgV = (d: number) => ({
  hide: { opacity: 0, y: 10, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay: d, duration: 0.34, ease: EASE } },
});

/* ---------- the 7 modules (real Suite module set, per brief) ---------- */

const modIcon = (paths: ReactNode) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {paths}
  </svg>
);

const MODULES: { label: string; pane?: PaneKey; icon: ReactNode }[] = [
  {
    label: "Chief-of-Staff chat",
    pane: "chat",
    icon: modIcon(<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />),
  },
  {
    label: "Operations",
    pane: "operations",
    icon: modIcon(
      <>
        <path d="M12 2.8 20 7v10l-8 4.2L4 17V7l8-4.2Z" />
        <path d="M4 7l8 4.2L20 7M12 11.2v10" />
      </>
    ),
  },
  {
    label: "Finance",
    pane: "finance",
    icon: modIcon(<path d="M6 4v16M18 4v16M4 9h16M4 15h16" />),
  },
  {
    label: "Marketing & CRM",
    icon: modIcon(
      <>
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19.5c.6-3.3 2.7-5 5.5-5s4.9 1.7 5.5 5" />
        <path d="M15.5 5.8a3.2 3.2 0 0 1 0 5.4" />
        <path d="M17.5 14.8c1.8.7 2.8 2.2 3 4.7" />
      </>
    ),
  },
  {
    label: "Projects",
    icon: modIcon(
      <>
        <rect x="4" y="4" width="4.5" height="12" rx="1" />
        <rect x="9.75" y="4" width="4.5" height="16" rx="1" />
        <rect x="15.5" y="4" width="4.5" height="8" rx="1" />
      </>
    ),
  },
  {
    label: "Messages",
    icon: modIcon(
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
      </>
    ),
  },
  {
    label: "Agents & evals",
    icon: modIcon(
      <>
        <path d="M12 3.5c1 2.6 2.9 4.5 5.5 5.5-2.6 1-4.5 2.9-5.5 5.5-1-2.6-2.9-4.5-5.5-5.5 2.6-1 4.5-2.9 5.5-5.5Z" />
        <path d="M18.5 14.5c.5 1.4 1.6 2.5 3 3-1.4.5-2.5 1.6-3 3-.5-1.4-1.6-2.5-3-3 1.4-.5 2.5-1.6 3-3Z" />
      </>
    ),
  },
];

/* ---------- small parts ---------- */

function FeedDot({ ok }: { ok: boolean }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: 16, height: 16, background: ok ? "#22c55e" : "#e8a723" }}
      aria-hidden
    >
      {ok ? (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
          <path d="m5 13 4.5 4.5L19 8" />
        </svg>
      ) : (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
          <path d="M12 7v6m0 4v.1" />
        </svg>
      )}
    </span>
  );
}

function Kpi({ label, value, sub, d }: { label: string; value: string; sub: string; d: number }) {
  return (
    <motion.div variants={cardV(d)} className="rounded-xl border border-black/6 bg-white px-3 py-2.5 shadow-sm">
      <span className="block text-[9.5px] font-semibold uppercase tracking-wide text-black/40">{label}</span>
      <motion.span
        variants={popV(d + 0.15)}
        className="mt-0.5 block text-[15px] font-bold tracking-tight text-[var(--color-ink)] sm:text-[18px]"
      >
        {value}
      </motion.span>
      <span className="block text-[10px] text-black/45">{sub}</span>
    </motion.div>
  );
}

function FeedCard({
  title,
  rows,
  d,
}: {
  title: string;
  rows: { what: ReactNode; when: string; ok: boolean }[];
  d: number;
}) {
  return (
    <motion.div variants={cardV(d)} className="rounded-xl border border-black/6 bg-white p-3.5 shadow-sm">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-black/40">{title}</span>
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wide text-[var(--color-blue)]">
          audit-logged
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.when}
            variants={rowV(d + 0.25 + i * 0.16)}
            className="flex items-center gap-2 rounded-lg border border-black/5 bg-[#f8faff] px-2.5 py-2"
          >
            <FeedDot ok={r.ok} />
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-[var(--color-ink-soft)]">{r.what}</span>
            <span className="shrink-0 font-mono text-[10px] text-black/40">{r.when}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- panes ---------- */

function OperationsPane() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Kpi d={0.1} label="Sales today" value="₦412,500" sub="23 orders" />
        <Kpi d={0.2} label="Orders" value="23" sub="all confirmed" />
        <Kpi d={0.3} label="Approvals waiting" value="1" sub="needs you" />
      </div>

      <div className="grid gap-2.5 lg:grid-cols-2">
        {/* approvals queue */}
        <motion.div variants={cardV(0.45)} className="rounded-xl border border-black/6 bg-white p-3.5 shadow-sm">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-black/40">Approvals queue</span>
            <span className="rounded-full bg-[#e8a723]/15 px-2 py-0.5 text-[10px] font-bold text-[#a06c05]">
              1 pending
            </span>
          </div>
          <div className="rounded-lg border border-black/5 bg-[#f8faff] px-3 py-2.5">
            <span className="block text-[12.5px] font-semibold text-[var(--color-ink)]">
              Friday restock — ₦96,000
            </span>
            <span className="block text-[10.5px] text-black/45">vendor quote attached · Kola (Operations)</span>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="rounded-full bg-[var(--color-blue)] px-3.5 py-1.5 text-[11.5px] font-semibold text-white">
                Approve
              </span>
              <span className="rounded-full border border-black/12 px-3.5 py-1.5 text-[11.5px] font-semibold text-[var(--color-ink)]">
                Hold
              </span>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[9.5px] font-medium uppercase tracking-wide text-black/35">
            waiting on you — nothing sent
          </p>
        </motion.div>

        {/* agent activity */}
        <FeedCard
          d={0.55}
          title="Agent activity"
          rows={[
            {
              what: (
                <>
                  <b className="font-semibold text-[var(--color-ink)]">Ngozi</b> · sent INV-208 reminder
                </>
              ),
              when: "14:02",
              ok: true,
            },
            {
              what: (
                <>
                  <b className="font-semibold text-[var(--color-ink)]">Kola</b> · updated stock count
                </>
              ),
              when: "13:40",
              ok: true,
            },
            {
              what: (
                <>
                  <b className="font-semibold text-[var(--color-ink)]">Tunde</b> · outreach draft → queue
                </>
              ),
              when: "13:12",
              ok: false,
            },
          ]}
        />
      </div>
    </div>
  );
}

function ChatPane() {
  return (
    <div className="mx-auto flex max-w-[440px] flex-col gap-2">
      <motion.div variants={msgV(0.05)} className="mb-1 flex items-center gap-2.5 border-b border-black/6 pb-2.5">
        <img src="/logo-128.png" alt="" className="h-7 w-7" />
        <span className="text-left leading-tight">
          <span className="block text-[13px] font-bold text-[var(--color-ink)]">Sardauna</span>
          <span className="flex items-center gap-1.5 text-[10.5px] text-black/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" aria-hidden /> Chief of Staff · on duty
          </span>
        </span>
      </motion.div>

      <motion.div
        variants={msgV(0.2)}
        className="max-w-[86%] self-start rounded-2xl rounded-bl-md border border-black/6 bg-white px-3.5 py-2 text-[12.5px] leading-snug text-[var(--color-ink)] shadow-sm"
      >
        Good morning. Overnight: 23 orders, 2 invoices paid, 1 complaint resolved. Your brief:
      </motion.div>

      <motion.div
        variants={msgV(0.55)}
        className="max-w-[86%] self-start rounded-2xl rounded-bl-md border border-black/6 bg-white px-3.5 py-2.5 shadow-sm"
      >
        <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--color-blue)]">
          Tuesday · Company brief
        </span>
        <span className="mt-1 block text-[12px] leading-relaxed text-[var(--color-ink-soft)]">
          Sales — ₦412,500 (23 orders)
          <br />
          Cash in — ₦180,000
          <br />
          Approvals waiting — 1
        </span>
      </motion.div>

      <motion.div
        variants={msgV(0.9)}
        className="max-w-[86%] self-end rounded-2xl rounded-br-md bg-[var(--color-ink)] px-3.5 py-2 text-[12.5px] font-medium leading-snug text-white shadow-[0_10px_24px_rgba(2,6,31,0.25)]"
      >
        Approve the Friday restock — ₦96,000.
      </motion.div>

      <motion.div variants={msgV(1.25)} className="max-w-[86%] self-start">
        <div className="rounded-2xl rounded-bl-md border border-black/6 bg-white px-3.5 py-2 text-[12.5px] leading-snug text-[var(--color-ink)] shadow-sm">
          Done. PO sent — Kola is tracking delivery for Friday.
        </div>
        <span className="mt-1 block pl-1 font-mono text-[9.5px] uppercase tracking-wide text-black/35">
          delegated to Operations · audit-logged
        </span>
      </motion.div>
    </div>
  );
}

function FinancePane() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Kpi d={0.1} label="Cash in today" value="₦180,000" sub="2 invoices paid" />
        <Kpi d={0.2} label="Overdue" value="₦95,000" sub="INV-208 · 7 days" />
        <Kpi d={0.3} label="VAT filing" value="6 days" sub="pack compiled" />
      </div>
      <FeedCard
        d={0.45}
        title="Ngozi · Finance"
        rows={[
          { what: "INV-208 reminder sent — Harmony Stores", when: "14:02", ok: true },
          { what: "VAT pack compiled — ready for review", when: "13:55", ok: true },
          { what: "INV-214 reminder → approvals queue", when: "13:20", ok: false },
        ]}
      />
    </div>
  );
}

/* ---------- sidebar ---------- */

const listV = { hide: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const itemV = {
  hide: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

function Sidebar({
  run,
  active,
  onSelect,
}: {
  run: number;
  active: PaneKey;
  onSelect: (p: PaneKey) => void;
}) {
  return (
    <motion.nav
      key={run}
      initial="hide"
      animate="show"
      variants={listV}
      aria-label="Suite modules"
      className="w-[54px] shrink-0 border-r border-white/8 bg-[#0a102c] px-1.5 py-3 md:w-[188px] md:px-2.5"
    >
      <div className="mb-3 hidden items-center gap-2 px-2 md:flex">
        <img src="/logo-128.png" alt="" className="h-5 w-5" />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/70">
          Business Suite
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {MODULES.map((m) => {
          const paneKey = m.pane;
          if (paneKey) {
            const isActive = active === paneKey;
            return (
              <motion.button
                key={m.label}
                type="button"
                variants={itemV}
                onClick={() => onSelect(paneKey)}
                className={`flex items-center justify-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors md:justify-start ${
                  isActive ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/6 hover:text-white/90"
                }`}
              >
                <span className="shrink-0">{m.icon}</span>
                <span className="hidden min-w-0 flex-1 truncate text-[12px] font-semibold md:block">
                  {m.label}
                </span>
                {isActive && (
                  <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-cyan)] md:block" aria-hidden />
                )}
              </motion.button>
            );
          }
          return (
            <motion.div
              key={m.label}
              variants={itemV}
              className="flex items-center justify-center gap-2.5 rounded-lg px-2 py-2 text-white/40 md:justify-start"
            >
              <span className="shrink-0">{m.icon}</span>
              <span className="hidden min-w-0 flex-1 truncate text-[12px] font-semibold md:block">{m.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ---------- the framed dashboard ---------- */

export default function SuiteDashboard() {
  const [run, setRun] = useState(0);
  const [pane, setPane] = useState<PaneKey>("operations");

  return (
    <motion.div
      onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))}
      onHoverStart={() => setRun((r) => r + 1)}
      viewport={{ once: true, margin: "-60px" }}
      className="liquid-glass glass-ring relative rounded-[32px] text-left shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(8,60,255,0.18)]"
    >
      <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
      <div className="bg-azure-dawn-hero relative m-3 rounded-3xl border border-white/10 p-3 sm:p-6">
        {/* browser chrome */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(2,10,50,0.45)]">
          <div className="relative flex items-center border-b border-black/6 bg-[#f4f6fb] px-3.5 py-2.5">
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-black/8 bg-white px-3 py-1 text-[11px] font-medium text-black/55">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
              </svg>
              app.safetyline.com.ng
            </span>
          </div>

          {/* sidebar + main pane */}
          <div className="flex items-stretch">
            <Sidebar run={run} active={pane} onSelect={setPane} />
            <div className="min-h-[330px] min-w-0 flex-1 bg-[#f6f8fe] p-3 sm:p-4">
              <motion.div key={`${pane}:${run}`} initial="hide" animate="show">
                {pane === "chat" ? <ChatPane /> : pane === "finance" ? <FinancePane /> : <OperationsPane />}
              </motion.div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/50">
          Figures illustrative — the seven modules are the real Suite
        </p>
      </div>
    </motion.div>
  );
}
