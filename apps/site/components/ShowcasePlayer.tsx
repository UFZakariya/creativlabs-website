"use client";

/* The hero showcase: a live-feeling messaging workspace where the House of
   Agents visibly does the work. Hand-built platform chrome (all icons/CSS
   drawn here): WhatsApp-style business inbox — wallpaper, date chip, E2E
   notice, bubble tails, ticks, composer — and an Instagram-style DM thread
   with story-ring avatar, product photo, reaction and Seen state. Messages
   play in with stagger + auto-scroll; threads crossfade; skins toggle. */

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

/* ── tiny hand-drawn icon set ── */
const I = {
  video: (c = "currentColor") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5z"/></svg>
  ),
  phone: (c = "currentColor") => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
  ),
  search: (c = "currentColor") => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  kebab: (c = "currentColor") => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={c}><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
  ),
  smile: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r="1" fill={c} stroke="none"/><circle cx="15" cy="10" r="1" fill={c} stroke="none"/></svg>
  ),
  plus: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
  ),
  mic: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
  ),
  camera: (c = "currentColor") => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="m9 7 1.5-2.5h3L15 7"/><circle cx="12" cy="13.5" r="3.5"/></svg>
  ),
  back: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="m15 5-7 7 7 7"/></svg>
  ),
  photo: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m4 17 5-5 4 4 3-3 4 4"/></svg>
  ),
  verified: () => (
    <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#3797f0" d="M12 1.8 14.7 4l3.4-.4 1 3.3 3 1.7-1.3 3.2 1.3 3.2-3 1.7-1 3.3-3.4-.4L12 22l-2.7-2.2-3.4.4-1-3.3-3-1.7 1.3-3.2L1.9 8.8l3-1.7 1-3.3 3.4.4z"/><path fill="#fff" d="m10.6 15.6-2.8-2.8 1.2-1.2 1.6 1.6 4.4-4.4 1.2 1.2z"/></svg>
  ),
};

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

/* ── WhatsApp bubble ── */
function WaBubble({ m, first }: { m: ShowMessage; first: boolean }) {
  const outgoing = m.from === "agent" || m.from === "owner";
  return (
    <div className={`flex ${outgoing ? "justify-end" : "justify-start"} px-[6%]`}>
      <div
        className={`relative max-w-[82%] rounded-lg px-2.5 py-1.5 text-[13.2px] leading-[1.35] text-[#111b21] shadow-[0_1px_.5px_rgba(11,20,26,.13)] ${
          outgoing ? "bg-[#d9fdd3]" : "bg-white"
        } ${first ? (outgoing ? "wa-tail-out rounded-tr-none" : "wa-tail-in rounded-tl-none") : ""}`}
      >
        {m.from === "agent" && m.name && first && (
          <div className="flex items-center gap-1 pb-0.5 text-[12px] font-semibold text-[#008069]">
            {m.name}
            <span className="rounded-[4px] bg-[#008069]/10 px-1 text-[8.5px] font-bold tracking-wide">AGENT</span>
          </div>
        )}
        {m.text && <p className="[overflow-wrap:anywhere]">{m.text}</p>}
        {m.card && (
          <div className="mt-1 w-56 max-w-full rounded-lg border border-black/8 bg-[#f7f8fa] p-2.5 text-[12.3px]">
            <div className="mb-1 font-semibold">{m.card.title}</div>
            <ul className="space-y-0.5 text-black/65">
              {m.card.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            {m.card.cta && (
              <div className="mt-2 rounded-md border border-[#008069]/35 py-1.5 text-center text-[12.5px] font-semibold text-[#008069]">
                {m.card.cta}
              </div>
            )}
          </div>
        )}
        {m.status && (
          <div className="mt-1 border-t border-black/8 pt-1 text-[10.3px] text-black/45">{m.status}</div>
        )}
        <span className="float-right ml-2 mt-1 flex translate-y-[3px] items-center gap-0.5 text-[10.2px] text-[#667781]">
          {m.time}
          {outgoing && <span className="text-[#53bdeb]">✓✓</span>}
        </span>
      </div>
    </div>
  );
}

/* ── Instagram bubble ── */
function IgBubble({ m }: { m: ShowMessage }) {
  const outgoing = m.from === "agent";
  if (m.from === "system") {
    return <div className="py-1 text-center text-[11px] font-medium text-black/40">{m.text}</div>;
  }
  return (
    <div className={`flex ${outgoing ? "justify-end" : "justify-start"} px-3`}>
      <div className="relative max-w-[78%]">
        {m.image ? (
          <div
            className="flex h-44 w-44 flex-col justify-end rounded-2xl p-3 text-white shadow-sm"
            style={{ background: m.image.gradient }}
          >
            <span className="text-lg">🧵</span>
            <span className="text-[12.5px] font-semibold leading-tight">{m.image.label}</span>
            <span className="mt-0.5 text-[10.5px] text-white/70">View post</span>
          </div>
        ) : (
          <div
            className={`rounded-[20px] px-3.5 py-2 text-[13.5px] leading-snug ${
              outgoing ? "bg-[#3797f0] text-white" : "bg-[#efefef] text-[#111]"
            }`}
          >
            {m.text && <p>{m.text}</p>}
            {m.card && (
              <div className="mt-1 w-52 max-w-full rounded-xl bg-white/95 p-2.5 text-[12.3px] text-[#111]">
                <div className="mb-1 font-semibold">{m.card.title}</div>
                <ul className="space-y-0.5 text-black/65">
                  {m.card.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                {m.card.cta && (
                  <div className="mt-2 rounded-lg bg-[#3797f0] py-1.5 text-center text-[12.5px] font-semibold text-white">
                    {m.card.cta}
                  </div>
                )}
              </div>
            )}
            {m.status && (
              <div className={`mt-1 pt-1 text-[10.3px] ${outgoing ? "text-white/65" : "text-black/45"}`}>
                {m.status}
              </div>
            )}
          </div>
        )}
        {m.reaction && (
          <span className="absolute -bottom-3 left-2 rounded-full border border-white bg-[#efefef] px-1.5 py-px text-[11px] shadow-sm">
            {m.reaction}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── thread panes ── */
function WaThread({ thread, enabled }: { thread: ShowThread; enabled: boolean }) {
  const shown = useScriptPlayback(thread, enabled);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div ref={scroller} className="wa-wallpaper h-full overflow-y-auto py-3">
      <div className="flex min-h-full flex-col justify-end gap-[3px]">
        <div className="mb-1 flex justify-center">
          <span className="rounded-md bg-white px-2.5 py-1 text-[10.5px] font-medium uppercase text-[#54656f] shadow-sm">
            Today
          </span>
        </div>
        <div className="mb-2 flex justify-center px-[8%]">
          <span className="rounded-md bg-[#ffeecd] px-3 py-1.5 text-center text-[10.8px] leading-snug text-[#54656f] shadow-sm">
            🔒 Messages are end-to-end encrypted. Only people in this chat can read them.
          </span>
        </div>
        {shown.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={i > 0 && thread.messages[i - 1]?.from !== m.from ? "mt-2" : ""}
          >
            <WaBubble m={m} first={i === 0 || thread.messages[i - 1]?.from !== m.from} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IgThread({ thread, enabled }: { thread: ShowThread; enabled: boolean }) {
  const shown = useScriptPlayback(thread, enabled);
  const scroller = useRef<HTMLDivElement>(null);
  const done = shown.length === thread.messages.length;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown.length]);

  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-white py-3">
      <div className="flex min-h-full flex-col justify-end gap-2.5">
        {shown.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <IgBubble m={m} />
          </motion.div>
        ))}
        {done && (
          <div className="px-4 text-right text-[10.5px] font-medium text-black/40">Seen 12:09</div>
        )}
      </div>
    </div>
  );
}

/* ── main ── */
export default function ShowcasePlayer() {
  const [skin, setSkin] = useState<Skin>("whatsapp");
  const [activeKey, setActiveKey] = useState(WHATSAPP_THREADS[0].key);
  // the simulation starts on hover; touch devices (no hover) start in-view
  const [engaged, setEngaged] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (engaged) return;
    if (!window.matchMedia("(hover: hover)").matches) {
      const el = cardRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setEngaged(true);
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(el);
      return () => io.disconnect();
    }
  }, [engaged]);

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
        <div className="glass-surface glass-ring relative flex rounded-full p-1 text-sm font-semibold">
          {(["whatsapp", "instagram"] as Skin[]).map((s) => (
            <button
              key={s}
              onClick={() => setSkin(s)}
              aria-label={s === "whatsapp" ? "WhatsApp" : "Instagram"}
              title={s === "whatsapp" ? "WhatsApp" : "Instagram"}
              className="relative isolate z-10 grid place-items-center rounded-full px-5 py-2 transition-colors"
              style={{ color: skin === s ? (s === "whatsapp" ? "#25d366" : "#d62976") : "rgba(255,255,255,.9)" }}
            >
              {skin === s && (
                <motion.span
                  layoutId="skin-thumb"
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {s === "whatsapp" ? (
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden>
                  <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />
                  <path d="M8.8 9.2c.3 1.9 2.1 3.8 4 4.2l1.3-1c.9.3 1.6.7 1.9 1.3" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5.5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* device card — hovering it starts the simulation */}
      <div
        ref={cardRef}
        onMouseEnter={() => setEngaged(true)}
        className="glass-ring relative overflow-hidden rounded-3xl bg-white text-left shadow-[0_40px_80px_rgba(2,6,31,0.45)] transition-shadow duration-500 hover:shadow-[0_50px_100px_rgba(2,6,31,0.55)]"
      >
        {skin === "whatsapp" ? (
          /* ── WhatsApp Web-style header ── */
          <div className="flex items-center gap-3 border-b border-black/5 bg-[#f0f2f5] px-4 py-2.5 text-[#111b21]">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#083cff]/10 text-base">
              {active.emoji}
            </span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14.5px] font-semibold">
                {active.label} · Safetyline
              </div>
              <div className="text-[11.5px] text-[#667781]">{active.agent} · online</div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-[#54656f]">
              <span className="hidden sm:block">{I.video()}</span>
              <span className="hidden sm:block">{I.phone()}</span>
              <span>{I.search()}</span>
              <span>{I.kebab()}</span>
            </div>
            <select
              aria-label="Switch conversation"
              value={activeKey}
              onChange={(e) => setActiveKey(e.target.value)}
              className="rounded-lg bg-black/5 px-2 py-1 text-xs font-medium md:hidden"
            >
              {WHATSAPP_THREADS.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* ── Instagram DM header ── */
          <div className="flex items-center gap-3 border-b border-black/10 bg-white px-4 py-2.5 text-black">
            <span className="text-black/80">{I.back()}</span>
            <span className="ig-ring grid h-9 w-9 place-items-center rounded-full p-[2px]">
              <span className="grid h-full w-full place-items-center rounded-full bg-white">
                <img src="/logo-128.png" alt="" className="h-6 w-6" />
              </span>
            </span>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1 text-[14px] font-semibold">
                sardauna {I.verified()}
              </div>
              <div className="text-[11.5px] text-black/50">Active now</div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-black/80">
              <span>{I.phone()}</span>
              <span>{I.video()}</span>
            </div>
          </div>
        )}

        <div className="flex h-[430px]">
          {/* WhatsApp sidebar — desktop only */}
          {skin === "whatsapp" && (
            <aside className="hidden w-[264px] shrink-0 flex-col border-r border-black/10 bg-white md:flex">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex h-8 flex-1 items-center gap-2 rounded-lg bg-[#f0f2f5] px-3 text-[12.5px] text-[#667781]">
                  {I.search("#667781")}
                  Search or start a new chat
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {WHATSAPP_THREADS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveKey(t.key)}
                    className={`flex w-full items-center gap-3 px-3 py-[9px] text-left transition-colors ${
                      t.key === activeKey ? "bg-[#f0f2f5]" : "hover:bg-black/[.03]"
                    }`}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#083cff]/10 text-lg">
                      {t.emoji}
                    </span>
                    <span className="min-w-0 flex-1 border-b border-black/5 pb-[9px]">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[14px] font-medium text-[#111b21]">
                          {t.label}
                        </span>
                        <span
                          className={`shrink-0 text-[10.5px] ${
                            t.unread ? "font-semibold text-[#25d366]" : "text-[#667781]"
                          }`}
                        >
                          {t.rowTime}
                        </span>
                      </span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[12px] text-[#667781]">
                          <span className="text-[#53bdeb]">✓✓ </span>
                          {t.preview}
                        </span>
                        {t.unread ? (
                          <span className="grid h-[18px] min-w-[18px] shrink-0 place-items-center rounded-full bg-[#25d366] px-1 text-[10px] font-bold text-white">
                            {t.unread}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                ))}
                <div className="px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-black/30">
                  House of Agents · live
                </div>
              </div>
            </aside>
          )}

          {/* thread pane + composer */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${skin}-${active.key}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {skin === "whatsapp" ? (
                    <WaThread thread={active} enabled={engaged} />
                  ) : (
                    <IgThread thread={active} enabled={engaged} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* composer */}
            {skin === "whatsapp" ? (
              <div className="flex items-center gap-3 border-t border-black/5 bg-[#f0f2f5] px-3 py-2 text-[#54656f]">
                {I.smile()}
                {I.plus()}
                <div className="h-9 flex-1 rounded-lg bg-white px-3 text-[13px] leading-9 text-black/40">
                  Type a message
                </div>
                {I.mic()}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 border-t border-black/10 bg-white px-3 py-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3797f0] text-white">
                  {I.camera("#fff")}
                </span>
                <div className="flex h-9 flex-1 items-center justify-between rounded-full border border-black/15 px-3.5 text-[13px] text-black/40">
                  Message…
                  <span className="flex items-center gap-2.5 text-black/70">
                    {I.mic()}
                    {I.photo()}
                  </span>
                </div>
              </div>
            )}
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
