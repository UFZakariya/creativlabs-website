"use client";

/* Use-cases starter demo, rebuilt to the homepage ShowcasePlayer's standard:
   real WhatsApp chrome per breakpoint (Web two-pane on md+, phone app below),
   sequenced simulation playback with conversational pacing, header "typing…",
   tick progression and hover-to-replay — plus an Instagram DM skin running
   the same house. Five owner-side department threads; approvals gate anything
   that leaves the house. Original copy; WhatsApp mirrors proven flows. */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  USECASE_INSTAGRAM_THREAD,
  type ShowMessage,
} from "@/lib/showcase-data";

type Skin = "whatsapp" | "instagram";

const EASE = [0.22, 1, 0.36, 1] as const;

/* conversational pacing: a beat to read, typing time scaled to the reply */
const READ_PAUSE = 520;
const typingTime = (m: ShowMessage) =>
  Math.min(1400, 550 + (m.text?.length ?? 24) * 14);

/* ── the five department threads (owner ↔ agent) ── */
type UcThread = {
  key: string;
  tab: string;
  agent: string;
  dept: string;
  accent: string;
  preview: string;
  rowTime: string;
  unread?: number;
  messages: ShowMessage[];
};

const THREADS: UcThread[] = [
  {
    key: "support",
    tab: "#Support",
    agent: "Zara",
    dept: "Comms",
    accent: "#7b2ff7",
    preview: "Inbox is clear.",
    rowTime: "09:14",
    messages: [
      { id: "s1", from: "agent", name: "Zara", time: "09:02", text: "New message on WhatsApp — Chidinma is asking where her order is." },
      { id: "s2", from: "agent", name: "Zara", time: "09:03", text: "Found it: #1082 left this morning. I've sent her the rider's number and a 2pm ETA." },
      { id: "s3", from: "owner", time: "09:12", text: "Perfect. Anything else waiting?" },
      { id: "s4", from: "agent", name: "Zara", time: "09:14", text: "Two product questions — both answered from the catalogue. Inbox is clear." },
      { id: "s5", from: "agent", name: "Zara", time: "09:14", card: { title: "3 conversations handled", lines: ["avg. reply under 2 min"] } },
    ],
  },
  {
    key: "sales",
    tab: "#Sales",
    agent: "Tunde",
    dept: "Growth",
    accent: "#083cff",
    preview: "She's in the CRM — follow-up set.",
    rowTime: "11:31",
    unread: 1,
    messages: [
      { id: "l1", from: "agent", name: "Tunde", time: "11:20", text: "New lead from the Instagram ad — Mrs Bello, asking about bulk pricing." },
      { id: "l2", from: "agent", name: "Tunde", time: "11:22", text: "She fits the wholesale profile. I've sent the price list and proposed Thursday for a call." },
      { id: "l3", from: "owner", time: "11:29", text: "Good. Put her in the pipeline." },
      { id: "l4", from: "agent", name: "Tunde", time: "11:31", text: "Done — she's in the CRM under Wholesale with a follow-up set for Friday morning." },
      { id: "l5", from: "agent", name: "Tunde", time: "11:31", card: { title: "CRM updated", lines: ["1 new lead · follow-up Fri 9:00"] } },
    ],
  },
  {
    key: "ops",
    tab: "#Ops",
    agent: "Kola",
    dept: "Operations",
    accent: "#0ea5e9",
    preview: "PO-114 sent — delivery Tuesday.",
    rowTime: "13:07",
    messages: [
      { id: "k1", from: "agent", name: "Kola", time: "12:55", text: "Stock check: the ankara tote is down to 6 units — below your 10-unit floor." },
      {
        id: "k2", from: "agent", name: "Kola", time: "12:56",
        text: "Restock order drafted — 40 units from Alhaji Musa at the usual price. Send it?",
        buttons: ["Approve", "Hold"],
      },
      { id: "k3", from: "owner", time: "13:05", text: "Approve." },
      { id: "k4", from: "agent", name: "Kola", time: "13:07", text: "Sent. Delivery expected Tuesday — I'll log it in the moment it lands." },
      { id: "k5", from: "agent", name: "Kola", time: "13:07", card: { title: "PO-114 sent", lines: ["40 units · awaiting delivery"] } },
    ],
  },
  {
    key: "finance",
    tab: "#Finance",
    agent: "Ngozi",
    dept: "Finance",
    accent: "#16a34a",
    preview: "Receipt issued — books current.",
    rowTime: "15:42",
    unread: 2,
    messages: [
      { id: "f1", from: "agent", name: "Ngozi", time: "15:18", text: "INV-208 is 9 days overdue. I've sent Mr Adewale a polite reminder." },
      { id: "f2", from: "agent", name: "Ngozi", time: "15:36", text: "Update — he just paid. ₦85,000 received and matched to the invoice." },
      { id: "f3", from: "owner", time: "15:40", text: "Send him the receipt." },
      { id: "f4", from: "agent", name: "Ngozi", time: "15:42", text: "Receipt issued, WHT noted, books updated. Outstanding invoices: two." },
      { id: "f5", from: "agent", name: "Ngozi", time: "15:42", card: { title: "Receipt-208.pdf", lines: ["₦85,000 · books current"] } },
    ],
  },
  {
    key: "growth",
    tab: "#Growth",
    agent: "Emeka",
    dept: "Analyst",
    accent: "#e8a723",
    preview: "Best sales week this month.",
    rowTime: "07:25",
    messages: [
      { id: "g1", from: "agent", name: "Emeka", time: "07:00", text: "Your 07:00 brief is ready." },
      { id: "g2", from: "agent", name: "Emeka", time: "07:00", card: { title: "Monday-Brief.pdf", lines: ["sales · cash · stock — 4 pages"] } },
      { id: "g3", from: "agent", name: "Emeka", time: "07:00", text: "Headline: best sales week this month, but two products drive 70% of it. One decision is waiting — the restock approval in #Ops." },
      { id: "g4", from: "owner", time: "07:24", text: "What would you push this week?" },
      { id: "g5", from: "agent", name: "Emeka", time: "07:25", text: "The two movers. Tunde has a promo draft ready whenever you want to see it." },
    ],
  },
];

/* ── tiny hand-drawn icon set (same idiom as the homepage player) ── */
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
  pen: (c = "currentColor") => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20Z"/><path d="m14.5 6 3 3"/></svg>
  ),
  funnel: (c = "currentColor") => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M4 5h16l-6.3 7.5V19l-3.4 1.5v-8L4 5Z"/></svg>
  ),
  sticker: (c = "currentColor") => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7"><path d="M3.5 8A4.5 4.5 0 0 1 8 3.5h8A4.5 4.5 0 0 1 20.5 8v5L13 20.5H8A4.5 4.5 0 0 1 3.5 16V8Z"/><path d="M20.5 13H17a4 4 0 0 0-4 4v3.5"/><circle cx="9" cy="10" r="1" fill={c} stroke="none"/><circle cx="15" cy="10" r="1" fill={c} stroke="none"/></svg>
  ),
  verified: () => (
    <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#3797f0" d="M12 1.8 14.7 4l3.4-.4 1 3.3 3 1.7-1.3 3.2 1.3 3.2-3 1.7-1 3.3-3.4-.4L12 22l-2.7-2.2-3.4.4-1-3.3-3-1.7 1.3-3.2L1.9 8.8l3-1.7 1-3.3 3.4.4z"/><path fill="#fff" d="m10.6 15.6-2.8-2.8 1.2-1.2 1.6 1.6 4.4-4.4 1.2 1.2z"/></svg>
  ),
};

/* WhatsApp's real double-check: one drawn glyph, checks overlapping */
function Ticks({ read }: { read: boolean }) {
  return (
    <svg
      width="15"
      height="10"
      viewBox="0 0 16 11"
      fill="none"
      aria-hidden
      className={read ? "text-[#53bdeb]" : "text-[#8696a0]"}
    >
      <path d="M11.3 1 5.6 8.1 3.1 5.7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 1 9.3 8.1l-1-.95" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* sequenced playback — identical behaviour to the homepage player */
function useScriptPlayback(
  script: { messages: ShowMessage[] },
  enabled: boolean,
  replay: number,
  onDone?: () => void
) {
  // NOTE: no reduced-motion shortcut — the sequenced conversation IS the
  // content of this demo. Bubble entry stays a gentle fade.
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState<null | "in" | "out">(null);

  useEffect(() => {
    setCount(0);
    setTyping(null);
    if (!enabled) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));
    };
    let at = 400;
    // perspective: customer threads are viewed as the business (agent = sent);
    // owner threads are viewed as the owner (agent = received, left side)
    const hasCustomer = script.messages.some((m) => m.from === "customer");
    script.messages.forEach((m, i) => {
      const fromHouse = hasCustomer
        ? m.from === "agent" || m.from === "owner"
        : m.from === "owner";
      const think = i === 0 ? 0 : m.from === "system" ? 300 : typingTime(m);
      if (think > 350) later(() => setTyping(fromHouse ? "out" : "in"), at);
      at += think;
      const idx = i + 1;
      later(() => {
        setTyping(null);
        setCount(idx);
        if (idx >= script.messages.length) onDone?.();
      }, at);
      at += READ_PAUSE;
    });
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, enabled, replay]);

  return {
    shown: script.messages.slice(0, count),
    typing,
    done: count >= script.messages.length,
  };
}

const bubbleV = {
  hide: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};
const paneV = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

/* Instagram typing-dots bubble */
function IgTypingBubble() {
  return (
    <div className="flex justify-start px-3">
      <div className="rounded-[20px] bg-[#efefef] px-3 py-1.5">
        <span className="flex items-center gap-[3px] px-1 py-1">
          {[0, 1, 2].map((d) => (
            <span key={d} className="typing-dot h-[6px] w-[6px] rounded-full bg-[#667781]" />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ── WhatsApp bubble: 7.5px radius, squared tail corner on group-first,
   tight timestamp+ticks, template buttons as full-width divider rows ── */
function WaBubble({ m, first, read, mine }: { m: ShowMessage; first: boolean; read: boolean; mine: boolean }) {
  const stamp = (
    <span className="float-right ml-1.5 flex translate-y-[4px] items-center gap-[3px] text-[10.5px] leading-none text-[#667781]">
      {m.time}
      {mine && <Ticks read={read} />}
    </span>
  );
  const doc = m.card ? m.card.title.endsWith(".pdf") : false;
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} px-[6%]`}>
      <div
        className={`relative max-w-[82%] rounded-[7.5px] px-2 py-[5px] text-[13.2px] leading-[1.35] text-[#111b21] shadow-[0_1px_.5px_rgba(11,20,26,.13)] ${
          mine ? "bg-[#d9fdd3]" : "bg-white"
        } ${first ? (mine ? "wa-tail-out rounded-tr-none" : "wa-tail-in rounded-tl-none") : ""} ${
          m.buttons ? "w-64" : ""
        }`}
      >
        {m.from === "agent" && m.name && first && (
          <div className="flex items-center gap-1 pb-0.5 text-[12px] font-semibold text-[#008069]">
            {m.name}
            <span className="rounded-[4px] bg-[#008069]/10 px-1 text-[8.5px] font-bold tracking-wide">AGENT</span>
          </div>
        )}
        {m.text && (
          <p className="[overflow-wrap:anywhere]">
            {m.text}
            {!m.card && stamp}
          </p>
        )}
        {m.card && (
          doc ? (
            /* WA document message: file row on the light chip */
            <div className="w-60 max-w-full py-0.5">
              <div className="flex items-center gap-2.5 rounded-lg bg-[#f0f2f5] px-2.5 py-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#083cff]/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#083cff" strokeWidth="2" aria-hidden>
                    <path d="M6 2.8h8L19.2 8v13.2H6z" />
                    <path d="M13.5 3v5.5H19M9.5 13h5m-5 4h5" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-semibold text-[#111b21]">{m.card.title}</span>
                  <span className="block truncate text-[11px] text-black/50">{m.card.lines[0]}</span>
                </span>
              </div>
            </div>
          ) : (
            /* WA Business template card: content in the bubble */
            <div className="-mx-2 -my-[5px] w-60 max-w-full px-2 py-[5px] text-[12.6px]">
              <div className="mb-0.5 font-semibold">{m.card.title}</div>
              <ul className="space-y-0.5 text-black/70">
                {m.card.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              {m.card.cta && (
                <div className="-mx-2 mt-2 border-t border-black/10 px-2 pb-0.5 pt-1.5 text-center text-[13px] font-medium text-[#00a5f4]">
                  {m.card.cta}
                </div>
              )}
            </div>
          )
        )}
        {m.status && (
          <div className="mt-1 border-t border-black/8 pt-1 text-[10.3px] text-black/45">{m.status}</div>
        )}
        {m.card && stamp}
        {m.buttons && (
          /* WA template quick-reply actions: divider + full-width rows */
          <div className="-mx-2 -mb-[5px] mt-1.5">
            {m.buttons.map((b) => (
              <div
                key={b}
                className="border-t border-black/10 py-[7px] text-center text-[13px] font-medium text-[#00a5f4]"
              >
                {b}
              </div>
            ))}
          </div>
        )}
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
            <span className="text-lg">🛍️</span>
            <span className="text-[12.5px] font-semibold leading-tight">{m.image.label}</span>
            <span className="mt-0.5 text-[10.5px] text-white/70">View story</span>
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
function WaThread({
  thread,
  enabled,
  replay,
  onTyping,
  onDone,
}: {
  thread: UcThread;
  enabled: boolean;
  replay: number;
  onTyping?: (t: null | "in" | "out") => void;
  onDone?: () => void;
}) {
  const { shown, typing, done } = useScriptPlayback(thread, enabled, replay, onDone);
  const scroller = useRef<HTMLDivElement>(null);
  const mine = (m: ShowMessage) =>
    thread.messages.some((x) => x.from === "customer")
      ? m.from === "agent" || m.from === "owner"
      : m.from === "owner";

  // real WhatsApp signals the other side's typing in the HEADER, not a bubble
  useEffect(() => {
    onTyping?.(typing);
    return () => onTyping?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing]);

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
            variants={bubbleV}
            initial="hide"
            animate="show"
            className={i > 0 && thread.messages[i - 1]?.from !== m.from ? "mt-2" : ""}
          >
            <WaBubble
              m={m}
              first={i === 0 || thread.messages[i - 1]?.from !== m.from}
              read={i < shown.length - 1 || done}
              mine={mine(m)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function IgThread({
  enabled,
  replay,
  onDone,
}: {
  enabled: boolean;
  replay: number;
  onDone?: () => void;
}) {
  const thread = USECASE_INSTAGRAM_THREAD;
  const { shown, typing, done } = useScriptPlayback(thread, enabled, replay, onDone);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown.length, typing]);

  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-white py-3">
      <div className="flex min-h-full flex-col justify-end gap-2.5">
        {shown.map((m) => (
          <motion.div key={m.id} variants={bubbleV} initial="hide" animate="show">
            <IgBubble m={m} />
          </motion.div>
        ))}
        {/* Instagram authentically shows the other side's typing as a dots bubble */}
        {typing === "in" && <IgTypingBubble />}
        {done && (
          <div className="px-4 text-right text-[10.5px] font-medium text-black/40">Seen 17:24</div>
        )}
      </div>
    </div>
  );
}

/* ── main ── */
export default function UseCaseThreads() {
  const [skin, setSkin] = useState<Skin>("whatsapp");
  const [activeKey, setActiveKey] = useState(THREADS[2].key); // open on #Ops — the approval story
  // the simulation starts on hover; touch devices (no hover) start in-view
  const [engaged, setEngaged] = useState(false);
  const [waTyping, setWaTyping] = useState<null | "in" | "out">(null);
  const [replay, setReplay] = useState(0);
  const doneRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // deep-link / QA hook: ?t=<thread key> (or ig) opens that scene on load
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("t");
    if (!q) return;
    if (q === "ig" || q === "instagram") setSkin("instagram");
    else if (THREADS.some((t) => t.key === q)) setActiveKey(q);
  }, []);

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

  const waActive = useMemo(
    () => THREADS.find((t) => t.key === activeKey) ?? THREADS[0],
    [activeKey]
  );

  // clicking the active thread (or active skin) restarts its scene
  const selectThread = (k: string) => {
    doneRef.current = false;
    if (k === activeKey && skin === "whatsapp") setReplay((r) => r + 1);
    else {
      setSkin("whatsapp");
      setActiveKey(k);
    }
    if (!engaged) setEngaged(true);
  };
  const selectSkin = (s: Skin) => {
    doneRef.current = false;
    if (s === skin) setReplay((r) => r + 1);
    else setSkin(s);
  };

  return (
    <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-4 inline-block rounded-full border border-white/25 bg-[#0a1d7a] px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
            The starter demo
          </p>
          <h2 className="text-display-2 mx-auto max-w-3xl text-white">
            Pick a department. <span className="text-dawn-gradient-bright">Watch it work.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Five threads from a running house — the conversations you&apos;d have
            with staff, minus the payroll. Flip to Instagram and the same house
            answers your DMs. Anything that leaves the house waits for your
            approval.
          </p>
        </div>

        {/* skin toggle — real platform glyphs, like the homepage player */}
        <div className="mb-5 flex justify-center">
          <div className="glass-surface glass-ring relative flex rounded-full p-1 text-sm font-semibold">
            {(["whatsapp", "instagram"] as Skin[]).map((s) => (
              <button
                key={s}
                onClick={() => selectSkin(s)}
                aria-label={s === "whatsapp" ? "WhatsApp" : "Instagram"}
                title={s === "whatsapp" ? "WhatsApp" : "Instagram"}
                className="relative isolate z-10 grid place-items-center rounded-full px-5 py-2 transition-colors"
                style={{ color: skin === s ? (s === "whatsapp" ? "#25d366" : "#d62976") : "rgba(255,255,255,.9)" }}
              >
                {skin === s && (
                  <motion.span
                    layoutId="uc-skin-thumb"
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

        {/* device card — hovering it starts (or replays) the simulation */}
        <div
          ref={cardRef}
          onMouseEnter={() => {
            if (!engaged) setEngaged(true);
            else if (doneRef.current) {
              // hovering a finished scene replays it
              doneRef.current = false;
              setReplay((r) => r + 1);
            }
          }}
          className="glass-ring relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white text-left shadow-[0_40px_90px_rgba(2,6,31,0.45)] transition-shadow duration-500 hover:shadow-[0_50px_100px_rgba(2,6,31,0.55)]"
        >
          {skin === "whatsapp" ? (
            <>
              {/* ── WhatsApp Web header (tablet/desktop two-pane) ── */}
              <div className="hidden items-center gap-3 border-b border-black/5 bg-[#f0f2f5] px-4 py-2.5 text-[#111b21] md:flex">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: waActive.accent }}
                >
                  {waActive.agent[0]}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[14.5px] font-semibold">
                    {waActive.tab} · {waActive.agent}
                  </div>
                  <div className="text-[11.5px] text-[#667781]">
                    {waTyping === "in" ? "typing…" : `${waActive.dept} · online`}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-4 text-[#54656f]">
                  <span>{I.video()}</span>
                  <span>{I.phone()}</span>
                  <span>{I.search()}</span>
                  <span>{I.kebab()}</span>
                </div>
              </div>

              {/* ── WhatsApp phone-app header ── */}
              <div className="flex items-center gap-2.5 border-b border-black/5 bg-white px-2.5 py-2 text-[#111b21] md:hidden">
                <span className="text-[#54656f]">{I.back()}</span>
                <span
                  className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold text-white"
                  style={{ background: waActive.accent }}
                >
                  {waActive.agent[0]}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-[15px] font-semibold">
                    {waActive.tab} · {waActive.agent}
                  </div>
                  <div className="text-[11.5px] text-[#667781]">
                    {waTyping === "in" ? "typing…" : "online"}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-4 text-[#54656f]">
                  <span>{I.video()}</span>
                  <span>{I.phone()}</span>
                  <span>{I.kebab()}</span>
                </div>
              </div>

              {/* phone thread switcher — chips, since the app has no sidebar */}
              <div className="flex gap-1.5 overflow-x-auto border-b border-black/5 bg-white px-2.5 py-1.5 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
                {THREADS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => selectThread(t.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${
                      t.key === activeKey
                        ? "bg-[#00a884]/12 text-[#008069]"
                        : "bg-black/5 text-[#54656f]"
                    }`}
                  >
                    {t.tab}
                  </button>
                ))}
              </div>
            </>
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
            {/* WhatsApp Web sidebar — desktop only */}
            {skin === "whatsapp" && (
              <aside className="hidden w-[264px] shrink-0 flex-col border-r border-black/10 bg-white md:flex">
                {/* WA Web sidebar top bar: profile, new chat, menu */}
                <div className="flex items-center justify-between bg-[#f0f2f5] px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white">
                    <img src="/logo-128.png" alt="" className="h-6 w-6" />
                  </span>
                  <span className="flex items-center gap-4 text-[#54656f]">
                    <button type="button" aria-label="New chat" className="hover:text-[#111b21]">{I.pen()}</button>
                    <button type="button" aria-label="Menu" className="hover:text-[#111b21]">{I.kebab()}</button>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="flex h-8 flex-1 items-center gap-2 rounded-lg bg-[#f0f2f5] px-3 text-[12.5px] text-[#667781]">
                    {I.search("#667781")}
                    Search or start a new chat
                  </div>
                  <button type="button" aria-label="Filter unread" className="text-[#54656f] hover:text-[#111b21]">
                    {I.funnel()}
                  </button>
                </div>
                {/* WA Web filter chips */}
                <div className="flex gap-1.5 px-3 pb-2">
                  {["All", "Unread", "Favourites", "Groups"].map((f, i) => (
                    <button
                      key={f}
                      type="button"
                      className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                        i === 0
                          ? "bg-[#d9fdd3] text-[#008069]"
                          : "bg-[#f0f2f5] text-[#54656f] hover:bg-black/8"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {THREADS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => selectThread(t.key)}
                      className={`flex w-full items-center gap-3 px-3 py-[9px] text-left transition-colors ${
                        t.key === activeKey ? "bg-[#f0f2f5]" : "hover:bg-black/[.03]"
                      }`}
                    >
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white"
                        style={{ background: t.accent }}
                      >
                        {t.agent[0]}
                      </span>
                      <span className="min-w-0 flex-1 border-b border-black/5 pb-[9px]">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[14px] font-medium text-[#111b21]">
                            {t.tab} · {t.agent}
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
                {/* keyed remount restarts playback on every switch — no exit
                    phase, so a swap can never strand a blank pane */}
                <motion.div
                  key={`${skin}-${skin === "whatsapp" ? waActive.key : "ig"}`}
                  variants={paneV}
                  initial="hide"
                  animate="show"
                  className="absolute inset-0"
                >
                  {skin === "whatsapp" ? (
                    <WaThread
                      thread={waActive}
                      enabled={engaged}
                      replay={replay}
                      onTyping={setWaTyping}
                      onDone={() => { doneRef.current = true; }}
                    />
                  ) : (
                    <IgThread
                      enabled={engaged}
                      replay={replay}
                      onDone={() => { doneRef.current = true; }}
                    />
                  )}
                </motion.div>
              </div>

              {/* composer */}
              {skin === "whatsapp" ? (
                <>
                  {/* Web composer */}
                  <div className="hidden items-center gap-3 border-t border-black/5 bg-[#f0f2f5] px-3 py-2 text-[#54656f] md:flex">
                    {I.smile()}
                    {I.plus()}
                    <div className="h-9 flex-1 rounded-lg bg-white px-3 text-[13px] leading-9 text-black/40">
                      Type a message
                    </div>
                    {I.mic()}
                  </div>
                  {/* phone composer — pill input over the wallpaper + green mic */}
                  <div className="flex items-center gap-1.5 bg-[#f0ece4] px-1.5 py-1.5 md:hidden">
                    <div className="flex h-10 flex-1 items-center gap-2 rounded-full bg-white px-3 text-[#54656f] shadow-sm">
                      {I.smile()}
                      <span className="flex-1 text-[13.5px] text-black/40">Message</span>
                      {I.plus()}
                      {I.camera()}
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-white shadow-sm">
                      {I.mic("#fff")}
                    </span>
                  </div>
                </>
              ) : (
                /* Instagram composer — camera-blue circle + rounded field */
                <div className="flex items-center gap-2.5 border-t border-black/10 bg-white px-3 py-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3797f0] text-white">
                    {I.camera("#fff")}
                  </span>
                  <div className="flex h-9 flex-1 items-center justify-between rounded-full border border-black/15 px-3.5 text-[13px] text-black/40">
                    Message…
                    <span className="flex items-center gap-2.5 text-black/70">
                      {I.mic()}
                      {I.photo()}
                      {I.sticker()}
                      {I.plus()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12.5px] text-white/70">
          {skin === "whatsapp"
            ? "Transcripts are illustrative — the WhatsApp flow mirrors how Sardauna runs in production today."
            : "Instagram DMs ride the same House of Agents — demo scene with generic specifics."}
        </p>
      </div>
    </section>
  );
}
