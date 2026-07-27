"use client";

/* Mission control — rebuilt to mirror the REAL Safetyline Business Suite
   (suite-v2 source). Faithful details:
   · "Quiet glass" light workspace: #f7f9ff canvas, white panels, #e3e8f4
     hairlines, rounded-xl cards, dense 13px Linear-style type, tabular nums.
   · Brand glow radial (#083CFF → #00B7FF → #33F2FF) on the S mark, the raised
     centre dock tab and the "Ask Sardauna" pill — exactly where the app uses it.
   · Desktop ≥md: compact 72px icon rail (icons + 10.5px labels — the app's
     768–1199px tier), active item = soft indigo pill + blue text.
   · Phone <md: the app's real mobile chrome — sticky ContextTopBar (S mark +
     page title + search) and the five-destination bottom Command Dock with the
     raised glow orb in the centre.
   Chat / Operations / Finance switch via keyed remounts (no AnimatePresence);
   variants-based, replays on hover. Same demo figures as the homepage. */

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import GlowingEffect from "./GlowingEffect";

const EASE = [0.22, 1, 0.36, 1] as const;

type PaneKey = "chat" | "operations" | "finance";
type TabKey = "today" | "chat";

/* ── the suite's own tokens (ported verbatim from suite-v2 globals.css) ── */
const S = {
  bg: "#f7f9ff",
  subtle: "#eef2ff",
  ink: "#061027",
  muted: "#5b6479",
  faint: "#636c88",
  line: "#e3e8f4",
  accent: "#083cff",
  accentSoft: "#e7edff",
  accentInk: "#0a2ba6",
  success: "#059669",
  successSoft: "#ecfdf5",
  warning: "#d97706",
  warningSoft: "#fffbeb",
} as const;
const GLOW =
  "radial-gradient(120% 120% at 0% 0%, #083cff 0%, #00b7ff 55%, #33f2ff 100%)";

/* ── variants ── */
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
const listV = { hide: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } };
const itemV = {
  hide: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.38, ease: EASE } },
};
const dockItemV = {
  hide: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } },
};

/* ── lucide-style icons (the suite uses lucide-react) ── */
function Icon({ d, size = 18 }: { d: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {d}
    </svg>
  );
}
const ic = {
  home: (
    <>
      <path d="m3 9.6 9-7 9 7V20a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 20Z" />
      <path d="M9.5 21.5v-7.6h5v7.6" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="7.5" width="18" height="13" rx="2" />
      <path d="M8.5 7.5v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3c.9 2.8 2.9 4.8 5.7 5.7-2.8.9-4.8 2.9-5.7 5.7-.9-2.8-2.9-4.8-5.7-5.7C9.1 7.8 11.1 5.8 12 3Z" />
      <path d="M19 14.5c.4 1.3 1.2 2.1 2.5 2.5-1.3.4-2.1 1.2-2.5 2.5-.4-1.3-1.2-2.1-2.5-2.5 1.3-.4 2.1-1.2 2.5-2.5Z" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12.5h-5.5l-2 3h-5l-2-3H2" />
      <path d="M5.4 5.6 2 12.5V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5l-3.4-6.9A2 2 0 0 0 16.8 4.5H7.2a2 2 0 0 0-1.8 1.1Z" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  banknote: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 18-6v14L3 13v-2Z" />
      <path d="M11.6 16.9a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  kanban: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 7v9M12 7v5M16 7v7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.2-4.2" />
    </>
  ),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
};

/* ── tiny suite primitives ── */

function SMark({ size, radius }: { size: number; radius: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center font-bold text-white"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: GLOW,
        fontSize: size * 0.38,
        boxShadow: "0 4px 14px rgb(8 60 255 / 0.35)",
      }}
      aria-hidden
    >
      S
    </span>
  );
}

function Chip({ tone, children }: { tone: "accent" | "success" | "warning"; children: ReactNode }) {
  const t = {
    accent: { background: S.accentSoft, color: S.accentInk },
    success: { background: S.successSoft, color: S.success },
    warning: { background: S.warningSoft, color: S.warning },
  }[tone];
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium leading-4"
      style={t}
    >
      {children}
    </span>
  );
}

function Dot({ tone }: { tone: "success" | "accent" | "warning" }) {
  const bg = { success: S.success, accent: S.accent, warning: S.warning }[tone];
  return <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: bg }} aria-hidden />;
}

function SectionH({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-1.5 text-[12px] font-semibold" style={{ color: S.ink }}>
      {children}
    </h4>
  );
}

function Metric({ label, value, sub, d }: { label: string; value: string; sub: string; d: number }) {
  return (
    <motion.div
      variants={cardV(d)}
      className="min-w-0 rounded-xl border bg-white p-2.5"
      style={{ borderColor: S.line, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
    >
      <span className="block truncate text-[9.5px] font-medium uppercase tracking-wide" style={{ color: S.faint }}>
        {label}
      </span>
      <motion.span
        variants={popV(d + 0.15)}
        className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight sm:text-[17px]"
        style={{ color: S.ink, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </motion.span>
      <span className="block truncate text-[10px]" style={{ color: S.muted }}>
        {sub}
      </span>
    </motion.div>
  );
}

function ActivityCard({
  title,
  rows,
  d,
}: {
  title: string;
  rows: { tone: "success" | "accent" | "warning"; what: ReactNode; status: string; when: string }[];
  d: number;
}) {
  return (
    <motion.div variants={cardV(d)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: S.ink }}>
          {title}
        </span>
        <Chip tone="accent">audit-logged</Chip>
      </div>
      <div
        className="divide-y rounded-xl border bg-white"
        style={{ borderColor: S.line, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
      >
        {rows.map((r, i) => (
          <motion.div
            key={r.when}
            variants={rowV(d + 0.2 + i * 0.14)}
            className="flex items-center gap-2 px-2.5 py-2 text-[11.5px]"
            style={{ borderColor: S.line }}
          >
            <Dot tone={r.tone} />
            <span className="min-w-0 flex-1 truncate" style={{ color: S.ink }}>
              {r.what}
            </span>
            <span className="shrink-0 text-[10px]" style={{ color: S.faint }}>
              {r.status}
            </span>
            <span className="shrink-0 text-[10px]" style={{ color: S.faint, fontVariantNumeric: "tabular-nums" }}>
              {r.when}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RestockDecision({ d, compact }: { d: number; compact?: boolean }) {
  return (
    <motion.div variants={cardV(d)}>
      <SectionH>Top decisions</SectionH>
      <div
        className="rounded-xl border bg-white p-3"
        style={{ borderColor: S.line, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-medium leading-tight" style={{ color: S.ink }}>
              Friday restock — ₦96,000
            </span>
            <span className="mt-0.5 block truncate text-[11px]" style={{ color: S.muted }}>
              Vendor quote attached · Kola (Operations)
            </span>
          </div>
          <Chip tone="accent">approval</Chip>
          <span style={{ color: S.faint }}>
            <Icon d={ic.chevron} size={14} />
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className="inline-flex h-7 items-center rounded-lg px-3 text-[11.5px] font-medium text-white"
            style={{ background: S.accent }}
          >
            Approve
          </span>
          <span
            className="inline-flex h-7 items-center rounded-lg border bg-white px-3 text-[11.5px] font-medium"
            style={{ borderColor: S.line, color: S.ink }}
          >
            Hold
          </span>
          {!compact && (
            <span className="ml-auto text-[9.5px] font-medium uppercase tracking-wide" style={{ color: S.faint }}>
              held — nothing sent
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AskPill({ d }: { d: number }) {
  return (
    <motion.span
      variants={popV(d)}
      className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full py-2 pl-2 pr-3.5 text-white"
      style={{ background: GLOW, boxShadow: "0 10px 30px rgb(8 60 255 / 0.4)" }}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
        <Icon d={ic.sparkles} size={12} />
      </span>
      <span className="text-[11.5px] font-semibold">Ask Sardauna</span>
    </motion.span>
  );
}

/* ── panes ── */

function OperationsPane() {
  return (
    <div className="flex flex-col gap-3">
      <motion.header variants={cardV(0.02)}>
        <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: S.ink }}>
          Good afternoon
        </h3>
        <p className="mt-0.5 text-[11.5px]" style={{ color: S.muted }}>
          1 decision needs you
        </p>
      </motion.header>

      <motion.div variants={cardV(0.1)}>
        <SectionH>Business pulse</SectionH>
        <div className="grid grid-cols-3 gap-2">
          <Metric d={0.12} label="Sales today" value="₦412,500" sub="23 orders" />
          <Metric d={0.2} label="Orders" value="23" sub="all confirmed" />
          <Metric d={0.28} label="Approvals" value="1" sub="waiting on you" />
        </div>
      </motion.div>

      <RestockDecision d={0.42} />

      <ActivityCard
        d={0.56}
        title="Agents"
        rows={[
          {
            tone: "success",
            what: (
              <>
                <b className="font-semibold">Ngozi</b> · sent INV-208 reminder
              </>
            ),
            status: "completed",
            when: "14:02",
          },
          {
            tone: "success",
            what: (
              <>
                <b className="font-semibold">Kola</b> · updated stock count
              </>
            ),
            status: "completed",
            when: "13:40",
          },
          {
            tone: "warning",
            what: (
              <>
                <b className="font-semibold">Tunde</b> · outreach draft
              </>
            ),
            status: "pending",
            when: "13:12",
          },
        ]}
      />
    </div>
  );
}

function FinancePane() {
  return (
    <div className="flex flex-col gap-3">
      <motion.header variants={cardV(0.02)}>
        <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: S.ink }}>
          Finance
        </h3>
        <p className="mt-0.5 text-[11.5px]" style={{ color: S.muted }}>
          Ngozi keeps the ledger current
        </p>
      </motion.header>

      <motion.div variants={cardV(0.1)}>
        <SectionH>Business pulse</SectionH>
        <div className="grid grid-cols-3 gap-2">
          <Metric d={0.12} label="Cash in today" value="₦180,000" sub="2 invoices paid" />
          <Metric d={0.2} label="Overdue" value="₦95,000" sub="INV-208 · 7 days" />
          <Metric d={0.28} label="VAT filing" value="6 days" sub="pack compiled" />
        </div>
      </motion.div>

      <ActivityCard
        d={0.42}
        title="Ngozi · Finance"
        rows={[
          { tone: "success", what: "INV-208 reminder sent — Harmony Stores", status: "sent", when: "14:02" },
          { tone: "success", what: "VAT pack compiled — ready for review", status: "completed", when: "13:55" },
          { tone: "warning", what: "INV-214 reminder → approvals queue", status: "pending", when: "13:20" },
        ]}
      />
    </div>
  );
}

function ChatPane({ compact }: { compact?: boolean }) {
  return (
    <div className={`mx-auto flex w-full flex-col gap-2 ${compact ? "" : "max-w-[460px]"}`}>
      <motion.div
        variants={msgV(0.05)}
        className="mb-1 flex items-center gap-2.5 border-b pb-2.5"
        style={{ borderColor: S.line }}
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: GLOW }}
          aria-hidden
        >
          <Icon d={ic.sparkles} size={15} />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[13px] font-semibold" style={{ color: S.ink }}>
            Sardauna
          </span>
          <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: S.muted }}>
            <Dot tone="success" /> Chief of Staff · on duty
          </span>
        </span>
      </motion.div>

      <motion.div
        variants={msgV(0.2)}
        className="max-w-[88%] self-start rounded-xl rounded-bl-sm border bg-white px-3 py-2 text-[12px] leading-snug"
        style={{ borderColor: S.line, color: S.ink, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
      >
        Good morning. Overnight: 23 orders, 2 invoices paid, 1 complaint resolved. Your brief:
      </motion.div>

      <motion.div
        variants={msgV(0.55)}
        className="max-w-[88%] self-start rounded-xl rounded-bl-sm border bg-white px-3 py-2.5"
        style={{ borderColor: S.line, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
      >
        <span className="block text-[9.5px] font-semibold uppercase tracking-wide" style={{ color: S.accent }}>
          Tuesday · Company brief
        </span>
        <span
          className="mt-1 block text-[11.5px] leading-relaxed"
          style={{ color: S.muted, fontVariantNumeric: "tabular-nums" }}
        >
          Sales — ₦412,500 (23 orders)
          <br />
          Cash in — ₦180,000
          <br />
          Approvals waiting — 1
        </span>
      </motion.div>

      <motion.div
        variants={msgV(0.9)}
        className="max-w-[88%] self-end rounded-xl rounded-br-sm px-3 py-2 text-[12px] font-medium leading-snug text-white"
        style={{ background: S.accent, boxShadow: "0 8px 20px rgb(8 60 255 / 0.25)" }}
      >
        Approve the Friday restock — ₦96,000.
      </motion.div>

      <motion.div variants={msgV(1.25)} className="max-w-[88%] self-start">
        <div
          className="rounded-xl rounded-bl-sm border bg-white px-3 py-2 text-[12px] leading-snug"
          style={{ borderColor: S.line, color: S.ink, boxShadow: "0 1px 2px rgb(6 16 39 / 0.05)" }}
        >
          Done. PO sent — Kola is tracking delivery for Friday.
        </div>
        <span
          className="mt-1 block pl-1 text-[9.5px] font-medium uppercase tracking-wide"
          style={{ color: S.faint }}
        >
          delegated to Operations · audit-logged
        </span>
      </motion.div>

      <motion.div variants={msgV(1.5)} className="mt-1 flex items-center gap-1.5">
        <span
          className="flex h-8 min-w-0 flex-1 items-center rounded-lg border bg-white px-2.5 text-[11.5px]"
          style={{ borderColor: S.line, color: S.faint }}
        >
          Message Sardauna…
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: S.accent }}
          aria-hidden
        >
          <Icon d={ic.send} size={13} />
        </span>
      </motion.div>
    </div>
  );
}

/* ── desktop: 72px icon rail (the suite's real 768–1199px tier) ── */

const RAIL_PRIMARY: { label: string; icon: ReactNode; pane?: PaneKey }[] = [
  { label: "Today", icon: ic.home },
  { label: "Work", icon: ic.work },
  { label: "Sardauna", icon: ic.sparkles, pane: "chat" },
  { label: "Inbox", icon: ic.inbox },
  { label: "More", icon: ic.more },
];
const RAIL_MODULES: { label: string; icon: ReactNode; pane?: PaneKey }[] = [
  { label: "Operations", icon: ic.wrench, pane: "operations" },
  { label: "Finance", icon: ic.banknote, pane: "finance" },
  { label: "Marketing", icon: ic.megaphone },
  { label: "Projects", icon: ic.kanban },
];

function RailItem({
  item,
  active,
  onSelect,
}: {
  item: { label: string; icon: ReactNode; pane?: PaneKey };
  active: boolean;
  onSelect: (p: PaneKey) => void;
}) {
  const cls = "flex w-full flex-col items-center justify-center gap-1 rounded-lg py-1.5 transition-colors";
  const style = active ? { background: S.subtle, color: S.accent } : { color: S.muted };
  const inner = (
    <>
      <span className="shrink-0">
        <Icon d={item.icon} size={17} />
      </span>
      <span className="text-[9.5px] font-medium leading-3">{item.label}</span>
    </>
  );
  if (item.pane) {
    const pane = item.pane;
    return (
      <motion.button
        type="button"
        variants={itemV}
        onClick={() => onSelect(pane)}
        className={`${cls} cursor-pointer hover:bg-[#eef2ff]`}
        style={style}
        aria-pressed={active}
      >
        {inner}
      </motion.button>
    );
  }
  return (
    <motion.div variants={itemV} className={cls} style={style}>
      {inner}
    </motion.div>
  );
}

function Rail({ run, pane, onSelect }: { run: number; pane: PaneKey; onSelect: (p: PaneKey) => void }) {
  return (
    <motion.nav
      key={run}
      initial="hide"
      animate="show"
      variants={listV}
      aria-label="Suite navigation"
      className="flex w-[68px] shrink-0 flex-col border-r bg-white px-1.5 py-3"
      style={{ borderColor: S.line }}
    >
      <motion.div variants={itemV} className="mb-3 flex justify-center">
        <SMark size={34} radius={11} />
      </motion.div>
      <div className="flex flex-col gap-0.5">
        {RAIL_PRIMARY.map((item) => (
          <RailItem key={item.label} item={item} active={item.pane === pane} onSelect={onSelect} />
        ))}
      </div>
      <motion.div variants={itemV} className="mx-auto my-2 h-px w-6" style={{ background: S.line }} aria-hidden />
      <div className="flex flex-col gap-0.5">
        {RAIL_MODULES.map((item) => (
          <RailItem key={item.label} item={item} active={item.pane === pane} onSelect={onSelect} />
        ))}
      </div>
      <div className="mt-auto flex flex-col items-center gap-2 pt-2" style={{ color: S.muted }}>
        <motion.span variants={itemV}>
          <Icon d={ic.search} size={16} />
        </motion.span>
        <motion.span variants={itemV}>
          <Icon d={ic.moon} size={16} />
        </motion.span>
      </div>
    </motion.nav>
  );
}

function DesktopFrame({
  run,
  pane,
  onSelect,
}: {
  run: number;
  pane: PaneKey;
  onSelect: (p: PaneKey) => void;
}) {
  return (
    <div className="hidden w-full overflow-hidden rounded-xl shadow-[0_24px_70px_rgba(2,10,50,0.45)] md:block">
      {/* browser chrome */}
      <div className="relative flex items-center border-b bg-[#f4f6fb] px-3.5 py-2.5" style={{ borderColor: S.line }}>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-[11px] font-medium"
          style={{ borderColor: S.line, color: S.muted }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
          app.safetyline.com.ng
        </span>
      </div>

      {/* rail + page */}
      <div className="flex items-stretch" style={{ background: S.bg }}>
        <Rail run={run} pane={pane} onSelect={onSelect} />
        <div className="relative min-h-[430px] min-w-0 flex-1 p-4">
          <motion.div key={`d:${pane}:${run}`} initial="hide" animate="show">
            {pane === "chat" ? <ChatPane /> : pane === "finance" ? <FinancePane /> : <OperationsPane />}
            {pane !== "chat" && <AskPill d={0.8} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── phone: ContextTopBar + five-destination Command Dock (the suite's real
      mobile chrome) inside a device bezel ── */

const DOCK: { label: string; icon: ReactNode; tab?: TabKey; raised?: boolean }[] = [
  { label: "Today", icon: ic.home, tab: "today" },
  { label: "Work", icon: ic.work },
  { label: "Sardauna", icon: ic.sparkles, tab: "chat", raised: true },
  { label: "Inbox", icon: ic.inbox },
  { label: "More", icon: ic.more },
];

function TodayTab() {
  return (
    <div className="flex flex-col gap-3">
      <motion.header variants={cardV(0.02)}>
        <h3 className="text-[16px] font-semibold tracking-tight" style={{ color: S.ink }}>
          Good afternoon
        </h3>
        <p className="mt-0.5 text-[11px]" style={{ color: S.muted }}>
          1 decision needs you
        </p>
      </motion.header>

      <RestockDecision d={0.14} compact />

      <motion.div variants={cardV(0.3)}>
        <SectionH>Business pulse</SectionH>
        <div className="grid grid-cols-2 gap-2">
          <Metric d={0.32} label="Sales today" value="₦412,500" sub="23 orders" />
          <Metric d={0.4} label="Cash in" value="₦180,000" sub="2 invoices paid" />
          <Metric d={0.48} label="Orders" value="23" sub="all confirmed" />
          <Metric d={0.56} label="Approvals" value="1" sub="waiting on you" />
        </div>
      </motion.div>

      <ActivityCard
        d={0.68}
        title="Agents"
        rows={[
          {
            tone: "success",
            what: (
              <>
                <b className="font-semibold">Ngozi</b> · INV-208 reminder
              </>
            ),
            status: "completed",
            when: "14:02",
          },
          {
            tone: "success",
            what: (
              <>
                <b className="font-semibold">Kola</b> · stock count
              </>
            ),
            status: "completed",
            when: "13:40",
          },
          {
            tone: "warning",
            what: (
              <>
                <b className="font-semibold">Tunde</b> · outreach draft
              </>
            ),
            status: "pending",
            when: "13:12",
          },
        ]}
      />
    </div>
  );
}

function PhoneFrame({
  run,
  tab,
  onSelect,
}: {
  run: number;
  tab: TabKey;
  onSelect: (t: TabKey) => void;
}) {
  return (
    <div
      className="mx-auto w-full max-w-[330px] rounded-[34px] p-[7px] shadow-[0_24px_70px_rgba(2,10,50,0.5)] md:hidden"
      style={{ background: "#0b1226" }}
    >
      <div className="flex flex-col overflow-hidden rounded-[27px]" style={{ background: S.bg }}>
        {/* ContextTopBar */}
        <div
          className="flex h-11 shrink-0 items-center gap-2 border-b bg-white/95 px-3"
          style={{ borderColor: S.line }}
        >
          <SMark size={26} radius={8} />
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold" style={{ color: S.ink }}>
            {tab === "chat" ? "Sardauna" : "Today"}
          </span>
          <span style={{ color: S.muted }}>
            <Icon d={ic.search} size={16} />
          </span>
        </div>

        {/* page */}
        <div className="min-h-[430px] flex-1 p-3">
          <motion.div key={`m:${tab}:${run}`} initial="hide" animate="show">
            {tab === "chat" ? <ChatPane compact /> : <TodayTab />}
          </motion.div>
        </div>

        {/* Command Dock */}
        <motion.nav
          key={`dock:${run}`}
          initial="hide"
          animate="show"
          variants={listV}
          aria-label="Suite tabs"
          className="grid shrink-0 grid-cols-5 items-stretch border-t bg-white/95 px-1 pb-1.5 pt-1"
          style={{ borderColor: S.line }}
        >
          {DOCK.map((item) => {
            const active = item.tab === tab;
            const color = active ? S.accent : S.muted;
            const inner = item.raised ? (
              <>
                <span
                  className="-mt-5 flex h-[46px] w-[46px] items-center justify-center rounded-full text-white"
                  style={{ background: GLOW, boxShadow: "0 8px 24px rgb(8 60 255 / 0.35)" }}
                >
                  <Icon d={item.icon} size={20} />
                </span>
                <span className="text-[9.5px] font-medium leading-3" style={{ color }}>
                  {item.label}
                </span>
              </>
            ) : (
              <>
                <span style={{ color }}>
                  <Icon d={item.icon} size={19} />
                </span>
                <span className="text-[9.5px] font-medium leading-3" style={{ color }}>
                  {item.label}
                </span>
              </>
            );
            const cls = "flex w-full flex-col items-center justify-center gap-1 py-1.5";
            if (item.tab) {
              const t = item.tab;
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  variants={dockItemV}
                  onClick={() => onSelect(t)}
                  className={`${cls} cursor-pointer`}
                  aria-pressed={active}
                >
                  {inner}
                </motion.button>
              );
            }
            return (
              <motion.div key={item.label} variants={dockItemV} className={cls}>
                {inner}
              </motion.div>
            );
          })}
        </motion.nav>
      </div>
    </div>
  );
}

/* ── the framed showcase ── */

export default function SuiteDashboard() {
  const [run, setRun] = useState(0);
  const [pane, setPane] = useState<PaneKey>("operations");
  const [tab, setTab] = useState<TabKey>("today");

  return (
    <motion.div
      onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))}
      onHoverStart={() => setRun((r) => r + 1)}
      viewport={{ once: true, margin: "-60px" }}
      className="liquid-glass glass-ring relative mx-auto w-full max-w-[400px] rounded-[32px] text-left shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(8,60,255,0.18)] md:max-w-none"
    >
      <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
      <div className="bg-azure-dawn-hero relative m-3 rounded-3xl border border-white/10 p-4 sm:p-8">
        <DesktopFrame run={run} pane={pane} onSelect={setPane} />
        <PhoneFrame run={run} tab={tab} onSelect={setTab} />

        <p className="mt-4 text-center text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/50">
          Figures illustrative — the interface is the real Business Suite
        </p>
      </div>
    </motion.div>
  );
}
