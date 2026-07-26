"use client";

/* Bari & Biba front-desk dock — React island port of the old site's widget,
   honoring WIRE CONTRACT v1: POST {message, agent, page, contact_time} to
   /web/chat with credentials:"include", reply read as SSE on the same
   response (assistant.delta / tool.activity / assistant.completed / limit /
   error / done). Session identity = httpOnly sl_sid cookie; nothing sensitive
   stored here. Transcript persists 3 days in localStorage for continuity. */

import { useEffect, useRef, useState } from "react";
import { CHAT_ENDPOINT, slTrack } from "@/lib/track";

const WA_NUMBER = "2348102354786";
const CHAT_KEY = "sl-chat-v2";
const CHAT_TTL = 3 * 24 * 3600 * 1000;

const PERSONAS = {
  bari: {
    name: "Bari",
    tagline: "Straight to business",
    greeting:
      "Hi, I'm Bari from Safetyline. What does your business do, and what are you trying to fix or build? I'll tell you straight whether we can help — and what it would take.",
  },
  biba: {
    name: "Biba",
    tagline: "Warm & thorough",
    greeting:
      "Hello! I'm Biba from Safetyline. Tell me a little about your business and what's eating your time — I'll walk you through what Sardauna could take off your plate.",
  },
} as const;

type PersonaKey = keyof typeof PERSONAS;
type Msg = { who: "you" | "bot"; text: string; time: string };

const fmtTime = () => {
  try {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

export default function HermesDock() {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState<PersonaKey>("bari");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [limited, setLimited] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // restore a recent conversation; otherwise greet
  useEffect(() => {
    let restored: Msg[] | null = null;
    let savedAgent: PersonaKey | null = null;
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.v === 1 && Date.now() - s.at < CHAT_TTL && Array.isArray(s.msgs) && s.msgs.length) {
          restored = s.msgs;
          if (s.agent === "bari" || s.agent === "biba") savedAgent = s.agent;
        }
      }
    } catch {}
    if (savedAgent) setAgent(savedAgent);
    setMsgs(
      restored ?? [{ who: "bot", text: PERSONAS.bari.greeting, time: fmtTime() }]
    );
  }, []);

  // persist + keep scrolled to the latest message
  useEffect(() => {
    if (!msgs.length) return;
    try {
      localStorage.setItem(
        CHAT_KEY,
        JSON.stringify({ v: 1, agent, at: Date.now(), msgs: msgs.slice(-40) })
      );
    } catch {}
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, agent]);

  const pickPersona = (k: PersonaKey) => {
    if (k === agent) return;
    setAgent(k);
    setMsgs((m) => [...m, { who: "bot", text: PERSONAS[k].greeting, time: fmtTime() }]);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy || limited || !CHAT_ENDPOINT) return;
    setInput("");
    setMsgs((m) => [...m, { who: "you", text, time: fmtTime() }]);
    setBusy(true);

    // grow one bot bubble as deltas stream in
    let acc = "";
    let finalText: string | null = null;
    let botAdded = false;
    const paint = (t: string) => {
      setMsgs((m) => {
        const copy = [...m];
        if (botAdded) copy[copy.length - 1] = { ...copy[copy.length - 1], text: t };
        else {
          copy.push({ who: "bot", text: t, time: fmtTime() });
          botAdded = true;
        }
        return copy;
      });
    };

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agent,
          page: window.location.pathname,
          contact_time: honeypot.current?.value || "",
        }),
      });
      if (!res.ok || !res.body) throw new Error(`http ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let evName = "";
      const handle = (name: string, dataStr: string) => {
        let data: { text?: string; message?: string } = {};
        try {
          data = dataStr ? JSON.parse(dataStr) : {};
        } catch {}
        if (name === "assistant.delta" && typeof data.text === "string") {
          acc += data.text;
          paint(acc);
        } else if (name === "assistant.completed") {
          finalText = typeof data.text === "string" ? data.text : acc;
          paint(finalText || acc);
        } else if (name === "limit") {
          setLimited(true);
          paint(
            data.message ||
              "You've reached the limit for this chat — let's continue on WhatsApp."
          );
        } else if (name === "error") {
          throw new Error("stream error");
        }
      };
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("event:")) evName = line.slice(6).trim();
          else if (line.startsWith("data:")) {
            handle(evName, line.slice(5).trim());
            evName = "";
          }
        }
      }
      if (!botAdded && !finalText) throw new Error("empty stream");
    } catch {
      paint(
        "I couldn't reach the desk just now — message us on WhatsApp and a human picks it up: +234 810 235 4786."
      );
      slTrack("dock_error", { path: window.location.pathname });
    } finally {
      setBusy(false);
    }
  };

  if (!CHAT_ENDPOINT) return null;

  return (
    <>
      {/* launcher */}
      <button
        aria-label={open ? "Close chat" : "Chat with Bari & Biba"}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) slTrack("dock_open", { path: window.location.pathname });
        }}
        className="glass-ring fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-full bg-white/60 py-2.5 pl-3 pr-5 shadow-[0_18px_45px_rgba(2,6,31,0.3)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      >
        <img src="/logo-128.png" alt="" className="h-8 w-8" />
        <span className="text-[13.5px] font-semibold text-[var(--color-ink)]">
          {open ? "Close" : "Chat with us"}
        </span>
      </button>

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Safetyline"
          className="fixed bottom-20 right-5 z-[60] flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_40px_90px_rgba(2,6,31,0.45)]"
        >
          <div className="bg-azure-dawn px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14.5px] font-bold text-white">Safetyline front desk</p>
                <p className="text-[11.5px] text-white/70">Bari &amp; Biba · live</p>
              </div>
              <div className="flex gap-1 rounded-full bg-white/12 p-1">
                {(Object.keys(PERSONAS) as PersonaKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => pickPersona(k)}
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                      agent === k ? "bg-white text-[var(--color-ink)]" : "text-white/75"
                    }`}
                  >
                    {PERSONAS[k].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div ref={scroller} className="wa-wallpaper flex-1 overflow-y-auto px-3 py-3">
            <div className="flex flex-col gap-1.5">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[13.5px] leading-snug text-[#111b21] shadow-sm ${
                    m.who === "you" ? "self-end bg-[#d9fdd3]" : "self-start bg-white"
                  }`}
                >
                  {m.text}
                  <span className="float-right ml-2 mt-[7px] text-[10px] leading-none text-black/40">
                    {m.time}
                  </span>
                </div>
              ))}
              {busy && (
                <div className="self-start rounded-lg bg-white px-3 py-2 shadow-sm">
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/30"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {limited ? (
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener"
              className="bg-[#25d366] px-4 py-3.5 text-center text-[13.5px] font-semibold text-white"
            >
              Continue on WhatsApp →
            </a>
          ) : (
            <div className="flex items-center gap-2 border-t border-black/8 bg-white px-3 py-2.5">
              <input
                ref={honeypot}
                type="text"
                name="contact_time"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type a message"
                aria-label="Message"
                className="flex-1 rounded-full bg-[#f0f2f5] px-4 py-2.5 text-[13.5px] text-[#111b21] outline-none placeholder:text-black/40"
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-blue)] text-white transition-opacity disabled:opacity-40"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
