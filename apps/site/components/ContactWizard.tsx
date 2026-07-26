"use client";

/* Three-step contact wizard → the existing Safetyline lead intake
   (POST /web/lead, same pipeline as chat leads: scored, alerted, in the
   morning digest). Contract mirrored from the live site's form: JSON
   {name, phone, email, business, need, readiness_score, bot-field},
   at least one reachable channel, 400 errors are customer-safe to show,
   network failure falls back to a prefilled WhatsApp link. */

import { useState } from "react";
import { motion } from "framer-motion";

const LEAD_URL =
  process.env.NEXT_PUBLIC_LEAD_URL || "https://chat.safetyline.com.ng/web/lead";
const WA_NUMBER = "2348102354786";

const FOCUS_OPTIONS = [
  "Orders & customer chat",
  "Invoicing & money",
  "Marketing & follow-ups",
  "Stock & operations",
  "Reports & compliance",
  "Not sure yet — audit me",
];

const STEPS = ["About you", "The work", "Reach you"];

/* variants (not inline objects) — inline initial/animate tweens can strand
   content invisible when frames aren't compositing; see the AnimatePresence
   lesson on UseCaseThreads */
const stepVariants = {
  hide: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string; waHref?: string };

export default function ContactWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [f, setF] = useState({
    name: "",
    company: "",
    focus: [] as string[],
    message: "",
    phone: "",
    email: "",
    botField: "",
  });
  const [stepError, setStepError] = useState("");

  const set = (k: keyof typeof f, v: string | string[]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const toggleFocus = (opt: string) =>
    set(
      "focus",
      f.focus.includes(opt) ? f.focus.filter((x) => x !== opt) : [...f.focus, opt]
    );

  const next = () => {
    if (step === 0 && !f.name.trim()) {
      setStepError("Tell us your name so we know who we're talking to.");
      return;
    }
    setStepError("");
    setStep((s) => Math.min(s + 1, 2));
  };

  const composeEnquiry = () => {
    const parts = [
      `Name: ${f.name.trim()}`,
      f.phone.trim() ? `WhatsApp: ${f.phone.trim()}` : null,
      f.email.trim() ? `Email: ${f.email.trim()}` : null,
      f.company.trim() ? `Company: ${f.company.trim()}` : null,
      f.focus.length ? `Wants to systemize: ${f.focus.join(", ")}` : null,
    ].filter(Boolean);
    return parts.join("\n") + (f.message.trim() ? "\n\n" + f.message.trim() : "");
  };

  const submit = async () => {
    if (!f.phone.trim() && !f.email.trim()) {
      setStepError("Add a WhatsApp number or an email so we can reach you.");
      return;
    }
    setStepError("");
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(LEAD_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.trim(),
          phone: f.phone.trim(),
          email: f.email.trim(),
          business: [f.company.trim(), f.focus.join(", ")]
            .filter(Boolean)
            .join(" — "),
          need: f.message.trim(),
          readiness_score: "",
          "bot-field": f.botField,
        }),
      });
      if (res.status === 400) {
        let msg = "";
        try {
          msg = String((await res.json()).error || "");
        } catch {}
        setStatus({
          kind: "error",
          message: msg || "Please check your contact details and try again.",
        });
        return;
      }
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message: "That didn't go through — ",
        waHref:
          `https://wa.me/${WA_NUMBER}?text=` +
          encodeURIComponent(
            "Hi Safetyline, consultation request:\n\n" + composeEnquiry()
          ),
      });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="glass-ring mx-auto max-w-xl rounded-[32px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(16,20,42,0.08)]">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#22c55e]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" aria-hidden>
            <path d="m5 13 4.5 4.5L19 8" />
          </svg>
        </span>
        <h2 className="text-display-3">Talk soon, {f.name.trim().split(" ")[0] || "friend"}.</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
          Your enquiry is in — a real person reads every one. Expect a
          WhatsApp message or email from us shortly.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-black/35 outline-none transition-colors focus:border-[var(--color-blue)]/60";

  return (
    <div className="glass-ring mx-auto max-w-xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(16,20,42,0.08)]">
      {/* step header */}
      <div className="flex items-center gap-2 border-b border-black/6 px-7 py-5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-[12.5px] font-bold ${
                i < step
                  ? "bg-[#22c55e] text-white"
                  : i === step
                    ? "bg-[var(--color-blue)] text-white"
                    : "bg-black/6 text-black/45"
              }`}
            >
              {i < step ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" aria-hidden>
                  <path d="m5 13 4.5 4.5L19 8" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span
              className={`text-[13px] font-semibold ${
                i === step ? "text-[var(--color-ink)]" : "text-black/40"
              } ${i > 0 ? "hidden sm:inline" : ""}`}
            >
              {s}
            </span>
            {i < 2 && <span className="h-px w-6 bg-black/10" />}
          </div>
        ))}
      </div>

      {/* honeypot — mirrors the live form's bot-field */}
      <input
        type="text"
        name="bot-field"
        value={f.botField}
        onChange={(e) => set("botField", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      {/* keyed remount per step — enter animation, no exit dependency */}
      <motion.div
        key={step}
        variants={stepVariants}
        initial="hide"
        animate="show"
        className="flex flex-col gap-4 px-7 py-7"
      >
        {step === 0 && (
          <>
            <div>
              <label htmlFor="cw-name" className="mb-1.5 block text-[13.5px] font-semibold">
                Your name
              </label>
              <input
                id="cw-name"
                className={input}
                placeholder="e.g. Amina Yusuf"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="cw-company" className="mb-1.5 block text-[13.5px] font-semibold">
                Business name <span className="font-normal text-black/40">(optional)</span>
              </label>
              <input
                id="cw-company"
                className={input}
                placeholder="What's the business called?"
                value={f.company}
                onChange={(e) => set("company", e.target.value)}
                autoComplete="organization"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <p className="mb-2 text-[13.5px] font-semibold">
                What should the house take over first?{" "}
                <span className="font-normal text-black/40">(pick any)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map((opt) => {
                  const on = f.focus.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleFocus(opt)}
                      aria-pressed={on}
                      className={`rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                        on
                          ? "border-[var(--color-blue)] bg-[var(--color-blue)] text-white"
                          : "border-black/10 bg-white text-[var(--color-ink-soft)] hover:border-[var(--color-blue)]/40"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="cw-message" className="mb-1.5 block text-[13.5px] font-semibold">
                Anything else? <span className="font-normal text-black/40">(optional)</span>
              </label>
              <textarea
                id="cw-message"
                className={`${input} min-h-[96px] resize-y`}
                placeholder="Tell us how the business runs today — or what's eating your week."
                value={f.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="cw-phone" className="mb-1.5 block text-[13.5px] font-semibold">
                WhatsApp number <span className="font-normal text-black/40">(how most people hear back)</span>
              </label>
              <input
                id="cw-phone"
                type="tel"
                className={input}
                placeholder="+234 800 000 0000"
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="cw-email" className="mb-1.5 block text-[13.5px] font-semibold">
                Email <span className="font-normal text-black/40">(if you prefer)</span>
              </label>
              <input
                id="cw-email"
                type="email"
                className={input}
                placeholder="you@business.com"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </div>
            <p className="text-[12.5px] leading-relaxed text-black/45">
              One of the two is enough. Your enquiry goes straight into our own
              lead pipeline — the same one Sardauna runs — and a real person
              follows up.
            </p>
          </>
        )}

        {(stepError || status.kind === "error") && (
          <p className="text-[13.5px] font-medium text-[#c0392b]" role="alert">
            {stepError || (status.kind === "error" && status.message)}
            {status.kind === "error" && status.waHref && (
              <>
                <a
                  href={status.waHref}
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-[var(--color-blue)] underline"
                >
                  send it on WhatsApp instead
                </a>{" "}
                (your details are already filled in).
              </>
            )}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setStepError("");
                setStep((s) => s - 1);
              }}
              className="rounded-full px-5 py-3 text-[14px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={status.kind === "sending"}
              className="rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status.kind === "sending" ? "Sending…" : "Send my enquiry"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
