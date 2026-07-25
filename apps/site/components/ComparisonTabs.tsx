"use client";

/* Tabbed comparison: the same customer question answered by a plain chatbot
   vs the House of Agents — the argument made visible. Original demo copy. */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "chatbot" | "sardauna";

export default function ComparisonTabs() {
  const [tab, setTab] = useState<Tab>("sardauna");

  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-4 text-center sm:pb-32">
      <h2 className="text-display-2">
        A reply is <span className="text-dawn-gradient">not a result.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-soft)]">
        Same customer. Same question. Watch the difference between answering
        and actually handling it.
      </p>

      {/* tab pill */}
      <div className="mt-8 flex justify-center">
        <div className="relative flex rounded-full border border-black/10 bg-white p-1 text-sm font-semibold shadow-sm">
          {(["chatbot", "sardauna"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative z-10 rounded-full px-5 py-2 transition-colors"
              style={{ color: tab === t ? "#fff" : "var(--color-ink-soft)" }}
            >
              {tab === t && (
                <motion.span
                  layoutId="cmp-thumb"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--color-ink)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {t === "chatbot" ? "A chatbot" : "Sardauna"}
            </button>
          ))}
        </div>
      </div>

      {/* panes */}
      <div className="mx-auto mt-6 max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-azure-dawn glass-ring rounded-3xl p-5 text-left shadow-[0_30px_60px_rgba(2,6,31,0.35)]"
          >
            {/* customer message — identical in both panes */}
            <div className="mb-3 flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2 text-[13.5px] text-[#111b21] shadow-sm">
                Good afternoon, where is my order? It was meant to arrive today.
                <span className="mt-1 block text-right text-[10px] text-black/40">15:02</span>
              </div>
            </div>

            {tab === "chatbot" ? (
              <>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-white/15 px-3.5 py-2 text-[13.5px] text-white/85 backdrop-blur-sm">
                    Thank you for contacting us! For order enquiries, please
                    call our support line during business hours (9am–5pm).
                    <span className="mt-1 block text-right text-[10px] text-white/50">15:02</span>
                  </div>
                </div>
                <p className="mt-4 text-center text-[12.5px] font-medium text-white/60">
                  The customer still doesn&apos;t know. Now they&apos;re calling you.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3.5 py-2 text-[13.5px] text-[#111b21] shadow-sm">
                    <div className="mb-0.5 flex items-center gap-1 text-[12px] font-semibold text-[#008069]">
                      Kola
                      <span className="rounded-[4px] bg-[#008069]/10 px-1 text-[8.5px] font-bold tracking-wide">AGENT</span>
                    </div>
                    Good afternoon! Order #1042 is out for delivery — the rider
                    is 3 stops away, arriving before 4pm. Tracking link below.
                    I&apos;ll confirm the moment it lands. 🚚
                    <div className="mt-1 border-t border-black/8 pt-1 text-[10.3px] text-black/45">
                      checked dispatch · sent tracking · flagged ETA to owner dashboard
                    </div>
                    <span className="mt-1 block text-right text-[10px] text-[#667781]">
                      15:02 <span className="text-[#53bdeb]">✓✓</span>
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-center text-[12.5px] font-medium text-white/60">
                  Answered, tracked, closed — and you never touched it.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
