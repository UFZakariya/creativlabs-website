"use client";

/* TierName — the pricing ladder's nameplates. Renders "Sardauna" in the
   card's base heading style plus a qualifier word that carries its own
   living animation: a restrained silver/cyan shimmer-wave for Lite, a
   spring-spinning glow badge (with hover sparks) for the "+" of Plus+, an
   electric charge-flicker for Elite, and a champagne sheen with a rising
   star for Premier. Everything idles subtly and amplifies on hover.

   All ornament sizing and travel is em-relative, so a nameplate renders
   correctly at any font-size the card gives it (the pricing cards render
   these large — the qualifier is the headline, not the price).

   Repo rules respected: named variants only (hide/show/amp — never inline
   initial/animate objects); continuous motion lives in `show`/`amp` states
   with repeating transitions; hover-replay via a run counter keyed onto the
   remountable art (the sparks, the star). Every animated span is
   inline-block and animates transform / opacity / paint properties only,
   so the heading never reflows. */

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export type TierKey = "lite" | "plus" | "elite" | "premier";

/* ------------------------------------------------------------------ Lite */
/* Airy shimmer: thin letters, each carrying its own silver/cyan sweep with
   a staggered delay (so the light passes across the word), floating on a
   gentle per-letter wave. */

const LITE_GRADIENT =
  "linear-gradient(100deg, #64748f 0%, #64748f 34%, #d7f4fa 46%, #46bfd8 52%, #64748f 62%, #64748f 100%)";

const liteLetterV: Variants = {
  hide: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    y: [0, -1, 0, 0.6, 0],
    backgroundPosition: ["132% 0%", "-32% 0%"],
    transition: {
      opacity: { duration: 0.4, delay: i * 0.05, ease: EASE },
      y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.24 },
      backgroundPosition: { duration: 4.2, repeat: Infinity, ease: "linear", delay: i * 0.13 },
    },
  }),
  amp: (i: number) => ({
    opacity: 1,
    y: [0, -2.5, 0, 1.2, 0],
    backgroundPosition: ["132% 0%", "-32% 0%"],
    transition: {
      y: { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 },
      backgroundPosition: { duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.06 },
    },
  }),
};

function LiteWord({ hov }: { hov: boolean }) {
  return (
    <span className="inline-flex font-light tracking-[0.02em]">
      {"Lite".split("").map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={liteLetterV}
          initial="hide"
          animate={hov ? "amp" : "show"}
          className="inline-block"
          style={{
            backgroundImage: LITE_GRADIENT,
            backgroundSize: "240% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ----------------------------------------------------------------- Plus+ */
/* The word stays solid (inherits the featured card's cyan); the trailing
   "+" is a badge that pulses its glow and spring-spins 90° every few
   seconds (a plus is 90°-symmetric, so the loop reset is invisible). On
   hover it bursts to 1.4× and emits four cyan sparks, keyed by run. */

const plusBadgeV: Variants = {
  hide: { opacity: 0, scale: 0.6, rotate: 0 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 90,
    boxShadow: [
      "0 0 4px rgba(126,242,255,0.25)",
      "0 0 14px rgba(126,242,255,0.65)",
      "0 0 4px rgba(126,242,255,0.25)",
    ],
    transition: {
      opacity: { duration: 0.3, ease: EASE },
      scale: { type: "spring", stiffness: 300, damping: 16 },
      rotate: { type: "spring", stiffness: 210, damping: 11, repeat: Infinity, repeatDelay: 2.6 },
      boxShadow: { duration: 2.1, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] },
    },
  },
  amp: {
    opacity: 1,
    scale: 1.4,
    rotate: 90,
    boxShadow: "0 0 20px rgba(126,242,255,0.9)",
    transition: {
      scale: { type: "spring", stiffness: 380, damping: 9 },
      rotate: { type: "spring", stiffness: 210, damping: 11, repeat: Infinity, repeatDelay: 1.3 },
      boxShadow: { duration: 0.3, ease: EASE },
    },
  },
};

/* em-relative so the burst scales with the nameplate (these were px-tuned
   to a 15px heading; as ems they hold that geometry at any size) */
const SPARK_DIRS = [
  { x: "1em", y: "-0.8em" },
  { x: "-0.87em", y: "-0.93em" },
  { x: "1em", y: "0.73em" },
  { x: "-0.8em", y: "0.87em" },
];

const sparkV: Variants = {
  hide: { opacity: 0, x: 0, y: 0, scale: 0.4 },
  show: (d: { x: string; y: string }) => ({
    opacity: [1, 1, 0],
    scale: [1, 1, 0.2],
    x: [0, d.x],
    y: [0, d.y],
    transition: { duration: 0.55, ease: "easeOut" },
  }),
};

function PlusWord({ hov, run }: { hov: boolean; run: number }) {
  return (
    <span className="inline-flex items-center">
      <span>Plus</span>
      <span className="relative ml-[0.3em] inline-block">
        <motion.span
          variants={plusBadgeV}
          initial="hide"
          animate={hov ? "amp" : "show"}
          className="grid h-[1.3em] w-[1.3em] place-items-center rounded-[0.32em] border border-[var(--color-cyan)]/45 bg-[var(--color-cyan)]/12 text-[var(--color-cyan)]"
        >
          <svg width="0.72em" height="0.72em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden>
            <path d="M12 4.5v15M4.5 12h15" />
          </svg>
          <span className="sr-only">+</span>
        </motion.span>
        {run > 0 && (
          <span key={run} className="pointer-events-none absolute inset-0" aria-hidden>
            {SPARK_DIRS.map((d, i) => (
              <motion.span
                key={i}
                custom={d}
                variants={sparkV}
                initial="hide"
                animate="show"
                className="absolute left-1/2 top-1/2 h-[0.2em] w-[0.2em] rounded-full bg-[var(--color-cyan)]"
                style={{ marginLeft: "-0.1em", marginTop: "-0.1em" }}
              />
            ))}
          </span>
        )}
      </span>
    </span>
  );
}

/* ----------------------------------------------------------------- Elite */
/* Electric blue→violet gradient with a periodic charge: every ~3s a brief
   brightness/saturation surge and a whisper of scaleX (transform only — no
   letter-spacing, so zero layout jitter). Hover turns it into a live wire. */

const eliteWordV: Variants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    scaleX: [1, 1, 1.03, 1],
    filter: ["brightness(1)", "brightness(1)", "brightness(1.7) saturate(1.35)", "brightness(1)"],
    transition: {
      opacity: { duration: 0.4, ease: EASE },
      scaleX: { duration: 3, repeat: Infinity, times: [0, 0.86, 0.92, 1], ease: "easeInOut" },
      filter: { duration: 3, repeat: Infinity, times: [0, 0.86, 0.92, 1], ease: "easeInOut" },
    },
  },
  amp: {
    opacity: 1,
    scaleX: [1, 1.045, 1, 1.03, 1],
    filter: [
      "brightness(1.15) saturate(1.2)",
      "brightness(1.9) saturate(1.5)",
      "brightness(1.2) saturate(1.2)",
      "brightness(1.75) saturate(1.45)",
      "brightness(1.15) saturate(1.2)",
    ],
    transition: {
      scaleX: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
      filter: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

function EliteWord({ hov }: { hov: boolean }) {
  return (
    <motion.span
      variants={eliteWordV}
      initial="hide"
      animate={hov ? "amp" : "show"}
      className="inline-block"
      style={{
        backgroundImage:
          "linear-gradient(95deg, var(--color-blue) 0%, #4b3dff 48%, var(--color-violet) 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        transformOrigin: "50% 70%",
      }}
    >
      Elite
    </motion.span>
  );
}

/* --------------------------------------------------------------- Premier */
/* Cinematic: violet→blue word crossed by a warm champagne sheen (the
   Premier card is light glass, where the warm note is allowed), while a
   small cyan-glow star rises and settles beside it, then twinkles. The
   star remounts (key=run) so it re-rises on hover. */

const premWordV: Variants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    backgroundPosition: ["140% 0%, 0% 0%", "-40% 0%, 0% 0%"],
    transition: {
      opacity: { duration: 0.4, ease: EASE },
      backgroundPosition: { duration: 3.2, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" },
    },
  },
  amp: {
    opacity: 1,
    backgroundPosition: ["140% 0%, 0% 0%", "-40% 0%, 0% 0%"],
    transition: {
      backgroundPosition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.15, ease: "easeInOut" },
    },
  },
};

const starRiseV: Variants = {
  hide: { opacity: 0, y: 9, scale: 0.4, rotate: -40 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 13, delay: 0.15 },
  },
};

const starTwinkleV: Variants = {
  hide: {},
  show: {
    scale: [1, 1.18, 1],
    opacity: [1, 0.72, 1],
    rotate: 0,
    transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
  },
  amp: {
    scale: [1, 1.4, 1],
    opacity: 1,
    /* 72° per turn — a five-point star's symmetry, so the loop is seamless */
    rotate: [0, 72],
    transition: {
      scale: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 0.9, repeat: Infinity, ease: "linear" },
    },
  },
};

function PremierWord({ hov, run }: { hov: boolean; run: number }) {
  return (
    <span className="inline-flex items-center gap-[0.28em]">
      <motion.span
        variants={premWordV}
        initial="hide"
        animate={hov ? "amp" : "show"}
        className="inline-block"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(247,229,196,0) 42%, rgba(247,229,196,0.9) 50%, rgba(247,229,196,0) 58%), linear-gradient(100deg, var(--color-violet) 0%, #4b3dff 52%, var(--color-blue) 100%)",
          backgroundSize: "260% 100%, 100% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Premier
      </motion.span>
      <motion.span
        key={run}
        variants={starRiseV}
        initial="hide"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="inline-block"
        style={{ filter: "drop-shadow(0 0 4px rgba(126,242,255,0.8))" }}
        aria-hidden
      >
        <motion.span
          variants={starTwinkleV}
          initial="hide"
          animate={hov ? "amp" : "show"}
          className="inline-block"
        >
          <svg width="0.73em" height="0.73em" viewBox="0 0 24 24" aria-hidden>
            <defs>
              <linearGradient id="tn-star-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--color-cyan)" />
                <stop offset="1" stopColor="var(--color-azure)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.9 6.26 6.85.6-5.18 4.53 1.53 6.72L12 16.56l-6.1 3.55 1.53-6.72L2.25 8.86l6.85-.6L12 2z"
              fill="url(#tn-star-g)"
            />
          </svg>
        </motion.span>
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ root */

export default function TierName({ tier }: { tier: TierKey }) {
  const [hov, setHov] = useState(false);
  const [run, setRun] = useState(0);
  return (
    <motion.span
      /* wraps rather than overflows: at display size the longer names need
         most of a column, so on very narrow phones the qualifier drops to
         its own line instead of running past the card edge */
      className="inline-flex flex-wrap items-baseline gap-x-[0.35em] leading-[1.05]"
      onHoverStart={() => {
        setHov(true);
        setRun((r) => r + 1);
      }}
      onHoverEnd={() => setHov(false)}
    >
      <span>Sardauna</span>{" "}
      {tier === "lite" && <LiteWord hov={hov} />}
      {tier === "plus" && <PlusWord hov={hov} run={run} />}
      {tier === "elite" && <EliteWord hov={hov} />}
      {tier === "premier" && <PremierWord hov={hov} run={run} />}
    </motion.span>
  );
}
