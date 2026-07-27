/* Control & safety band — the tiered-autonomy story (a real product
   mechanism): approvals for anything outbound, everything audit-logged,
   agents proven before they're trusted. Original copy. */

import GlowingEffect from "./GlowingEffect";
import TiltCard from "./TiltCard";

const CONTROLS = [
  {
    title: "You approve what leaves the house",
    body: "Internal work runs on its own. Anything outbound — customer messages at scale, spending, admin changes — waits for your one-tap approval.",
    icon: "🛡️",
  },
  {
    title: "Every action on the record",
    body: "Who did what, when, and why — every agent action is logged and reviewable, so trust is something you can check, not something you have to feel.",
    icon: "📜",
  },
  {
    title: "Tested before trusted",
    body: "Agents earn their place: evaluated, shadowed and trialled on a small slice before going live — with instant rollback if quality ever slips.",
    icon: "🧪",
  },
];

export default function ControlSafety() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-[var(--color-blue)]">
          Autonomy with a leash
        </p>
        <h2 className="text-display-3 mx-auto max-w-2xl">
          Agents do the work. You keep the keys.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {CONTROLS.map((c) => (
          <TiltCard key={c.title} maxTilt={8}>
            <div className="liquid-glass glass-ring relative h-full rounded-3xl p-6 shadow-[0_20px_60px_rgba(16,20,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(8,60,255,0.16)]">
              <GlowingEffect spread={40} proximity={64} inactiveZone={0.55} borderWidth={3} />
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-blue)]/8 text-xl">
                {c.icon}
              </span>
              <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                {c.body}
              </p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
