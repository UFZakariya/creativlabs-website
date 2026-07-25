"use client";

/* The hero showcase: a live-feeling messaging workspace where the House of
   Agents visibly does the work. WhatsApp skin = two-pane business inbox with
   scripted threads playing themselves out; Instagram skin = single DM thread.
   Original implementation: fixed-height panes with auto-scroll (authentic to
   real messaging apps), staggered message entrances, crossfade thread swaps. */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  INSTAGRAM_THREAD,
  WHATSAPP_THREADS,
  type ShowMessage,
  type ShowThread,
} from "@/lib/showcase-data";

type Skin = "whatsapp" | "instagram";

const STEP_MS = 1150;

function useScriptPlayback(thread: ShowThread, enabled: boolean) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? thread.messages.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(thread.messages.length);
      return;
    }
    setCount(0);
    if (!enabled) return;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= thread.messages.length) clearInterval(t);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [thread, enabled, reduced]);

  return thread.messages.slice(0, count);
}

function Bubble({ m, skin }: { m: ShowMessage; skin: Skin }) {
  const isAgent = m.from === "agent";
  const isOwner = m.from === "owner";
  const isSystem = m.from === "system";
  const outgoing = isAgent || isOwner;

  if (isSystem) {
    return (
      <div className="my-2 text-center text-[11px] font-medium uppercase tracking-wide text-black/40">
        {m.text}
      </div>
    );
  }

  const bubbleBase =
    "relative max-w-[78%] rounded-2xl px-3 py-2 text-[13.5px] leading-snug shadow-sm";
  const skinOut =
    skin === "whatsapp"
      ? "bg-[#d9fdd3] text-[#111b21]"
      : "bg-gradient-to-br from-[#7b2ff7] to-[#083cff] text-white";
  const skinIn =
    skin === "whatsapp" ? "bg-white text-[#111b21]" : "bg-black/5 text-[#111]";

  return (
    <div className={`flex ${outgoing ? "justify-end" : "justify-start"}`}>
      <div className={`${bubbleBase} ${outgoing ? skinOut : skinIn}`}>
        {isAgent && m.name && (
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#083cff]">
            {m.name}
            <span className="rounded bg-[#083cff]/10 px-1 py-px text-[9px] font-bold uppercase tracking-wide">
              Agent
            </span>
          </div>
        )}
        {m.text && <p>{m.text}</p>}
        {m.card && (
          <div className="mt-1.5 rounded-xl border border-black/10 bg-white/80 p-2.5 text-[12.5px]">
            <div className="mb-1 font-semibold">{m.card.title}</div>
            <ul className="space-y-0.5 text-black/70">
              {m.card.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            {m.card.cta && (
              <div className="mt-2 rounded-lg bg-[#083cff] px-3 py-1.5 text-center text-[12px] font-semibold text-white">
                {m.card.cta}
              </div>
            )}
          </div>
        )}
        {m.status && (
          <div className="mt-1.5 border-t border-black/10 pt-1 text-[10.5px] font-medium text-black/45">
            {m.status}
          </div>
        )}
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            outgoing && skin === "instagram" ? "text-white/70" : "text-black/40"
          }`}
        >
          {m.time}
          {outgoing && (
            <span className={skin === "whatsapp" ? "text-[#53bdeb]" : ""}>✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Thread({ thread, skin }: { thread: ShowThread; skin: Skin }) {
  const shown = useScriptPlayback(thread, true);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div
      ref={scroller}
      className={`h-full overflow-y-auto px-3 py-3 ${
        skin === "whatsapp" ? "bg-[#efeae2]" : "bg-white"
      }`}
    >
      <div className="flex min-h-full flex-col justify-end gap-2">
        {shown.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Bubble m={m} skin={skin} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ShowcasePlayer() {
  const [skin, setSkin] = useState<Skin>("whatsapp");
  const [activeKey, setActiveKey] = useState(WHATSAPP_THREADS[0].key);

  const active = useMemo(
    () =>
      skin === "instagram"
        ? INSTAGRAM_THREAD
        : WHATSAPP_THREADS.find((t) => t.key === activeKey) ?? WHATSAPP_THREADS[0],
    [skin, activeKey]
  );

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl">
      {/* skin toggle */}
      <div className="mb-4 flex justify-center">
        <div className="glass-surface glass-ring relative flex rounded-full p-1 text-sm font-semibold text-white">
          {(["whatsapp", "instagram"] as Skin[]).map((s) => (
            <button
              key={s}
              onClick={() => setSkin(s)}
              className="relative z-10 rounded-full px-5 py-2 capitalize transition-colors"
              style={{ color: skin === s ? "#10142a" : "rgba(255,255,255,.85)" }}
            >
              {skin === s && (
                <motion.span
                  layoutId="skin-thumb"
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {s === "whatsapp" ? "WhatsApp" : "Instagram"}
            </button>
          ))}
        </div>
      </div>

      {/* device card */}
      <div className="glass-ring relative overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_rgba(2,6,31,0.45)]">
        {/* header bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3 ${
            skin === "whatsapp" ? "bg-[#008069] text-white" : "border-b border-black/10 bg-white text-black"
          }`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-sm">
            {active.emoji}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {skin === "whatsapp" ? `${active.label} · Safetyline` : "safetyline.ng"}
            </div>
            <div className={`text-[11px] ${skin === "whatsapp" ? "text-white/75" : "text-black/50"}`}>
              {active.agent} · online
            </div>
          </div>
          {/* mobile thread switcher */}
          {skin === "whatsapp" && (
            <select
              aria-label="Switch conversation"
              value={activeKey}
              onChange={(e) => setActiveKey(e.target.value)}
              className="ml-auto rounded-lg bg-white/15 px-2 py-1 text-xs font-medium text-white md:hidden"
            >
              {WHATSAPP_THREADS.map((t) => (
                <option key={t.key} value={t.key} className="text-black">
                  {t.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex h-[430px]">
          {/* sidebar — desktop, WhatsApp skin only */}
          {skin === "whatsapp" && (
            <aside className="hidden w-60 shrink-0 flex-col border-r border-black/10 bg-white md:flex">
              {WHATSAPP_THREADS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveKey(t.key)}
                  className={`flex items-center gap-3 border-b border-black/5 px-3 py-3 text-left transition-colors ${
                    t.key === activeKey ? "bg-[#f0f2f5]" : "hover:bg-black/[.03]"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#083cff]/10 text-lg">
                    {t.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold text-[#111b21]">
                      {t.label}
                    </span>
                    <span className="block truncate text-[11.5px] text-black/50">
                      {t.preview}
                    </span>
                  </span>
                </button>
              ))}
              <div className="mt-auto px-3 py-3 text-[10.5px] font-medium uppercase tracking-wider text-black/35">
                House of Agents · live
              </div>
            </aside>
          )}

          {/* thread pane with crossfade on switch */}
          <div className="relative min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${skin}-${active.key}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Thread thread={active} skin={skin} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-white/55">
        {skin === "whatsapp"
          ? "Real flows from live deployments — orders, support, finance, growth, and the owner's daily brief."
          : "Instagram, Facebook, X, Teams and Slack ride the same House of Agents."}
      </p>
    </div>
  );
}
