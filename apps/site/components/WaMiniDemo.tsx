"use client";

/* Channels featured band: the shea-butter WhatsApp exchange as a sequenced
   simulation in the homepage-player style. Messages type in one by one
   (typing time scaled to text length), the customer side gets a typing-dots
   bubble, group-first bubbles keep their wa-tails, and the order chip pops at
   the end. Starts on hover (in-view on touch), replays on hover once done.
   Named variants only (repo rule). */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Msg = { from: "in" | "out"; text: string; time: string };

/* exact conversation copy from the static band */
const MESSAGES: Msg[] = [
  { from: "in", text: "Good morning — is the shea butter 500g in stock?", time: "08:12" },
  { from: "out", text: "It is — ₦7,200 each. How many should I reserve for delivery today?", time: "08:12" },
  { from: "in", text: "Two, please!", time: "08:14" },
];

/* conversational pacing (same shape as the homepage ShowcasePlayer) */
const READ_PAUSE = 520;
const typingTime = (m: Msg) => Math.min(1400, 550 + m.text.length * 14);

const bubbleV = {
  hide: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chipV = {
  hide: { opacity: 0, y: 8, scale: 0.6 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 420, damping: 22 },
  },
};

const dotsV = {
  hide: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function WaMiniDemo() {
  // the simulation starts on hover; touch devices (no hover) start in-view
  const [engaged, setEngaged] = useState(false);
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false); // customer-side dots
  const [chip, setChip] = useState(false);
  const doneRef = useRef(false);
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

  // NOTE: no reduced-motion shortcut — the sequenced conversation IS the
  // content of this demo (same call as the homepage player).
  useEffect(() => {
    setCount(0);
    setTyping(false);
    setChip(false);
    if (!engaged) return;
    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(() => { if (!cancelled) fn(); }, ms));
    };
    let at = 400;
    MESSAGES.forEach((m, i) => {
      const think = typingTime(m);
      // only the customer's typing is visible from the business side
      if (m.from === "in") later(() => setTyping(true), at);
      at += think;
      const idx = i + 1;
      later(() => {
        setTyping(false);
        setCount(idx);
      }, at);
      at += READ_PAUSE;
    });
    at += 300;
    later(() => {
      setChip(true);
      doneRef.current = true;
    }, at);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [engaged, run]);

  const shown = MESSAGES.slice(0, count);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => {
        if (!engaged) setEngaged(true);
        else if (doneRef.current) {
          // hovering a finished scene replays it
          doneRef.current = false;
          setRun((r) => r + 1);
        }
      }}
      className="wa-wallpaper glass-ring w-full rounded-[24px] p-4 shadow-[0_40px_90px_rgba(2,6,31,0.45)]"
    >
      <div className="flex min-h-[224px] flex-col justify-end gap-1.5">
        <div className="self-center rounded-md bg-white/95 px-2.5 py-1 text-[10.5px] font-medium uppercase text-black/50 shadow-sm">
          Today
        </div>
        {shown.map((m, i) => {
          const first = i === 0 || MESSAGES[i - 1].from !== m.from;
          return (
            <motion.div
              key={`${run}-${i}`}
              variants={bubbleV}
              initial="hide"
              animate="show"
              className={`relative max-w-[85%] rounded-lg px-3 py-1.5 shadow-sm ${
                m.from === "out"
                  ? "self-end bg-[#d9fdd3]"
                  : "self-start bg-white"
              } ${first ? (m.from === "out" ? "wa-tail-out" : "wa-tail-in") : ""}`}
            >
              <p className="text-[13.5px] leading-snug text-[#111b21]">
                {m.text}
                <span className="float-right ml-2 mt-[7px] text-[10px] leading-none text-black/40">
                  {m.time}
                </span>
              </p>
            </motion.div>
          );
        })}
        {typing && (
          <motion.div
            key={`dots-${run}-${count}`}
            variants={dotsV}
            initial="hide"
            animate="show"
            className="relative self-start rounded-lg bg-white px-3 py-2 shadow-sm"
          >
            <span className="flex items-center gap-[3px] px-1 py-0.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="typing-dot h-[6px] w-[6px] rounded-full bg-[#667781]"
                />
              ))}
            </span>
          </motion.div>
        )}
        {chip && (
          <motion.div
            key={`chip-${run}`}
            variants={chipV}
            initial="hide"
            animate="show"
            className="mt-1 flex items-center gap-2 self-center rounded-full bg-white/95 px-4 py-1.5 shadow-sm"
          >
            <span
              className="grid place-items-center rounded-full bg-[#22c55e]"
              style={{ width: 16, height: 16 }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4">
                <path d="m5 13 4.5 4.5L19 8" />
              </svg>
            </span>
            <span className="text-[12px] font-semibold text-[#111b21]">
              Order #1104 · 2 reserved
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
