"use client";

/* The House of Agents org chart — a clean org TREE. The bare glowing mark
   sits top-centre; ONE trunk draws down to a horizontal rail that sweeps out
   from the centre; six rounded-elbow connectors drop into six BARE department
   nodes (icon medallion + name + role — no card around them, so the drawn
   tree is the structure rather than a row of tiles).

   The reveal is one continuous stroke travelling top -> bottom: trunk, then
   rail, then elbows, then the nodes fading up under the line as it lands on
   them. Each stage starts as the one above finishes, so it reads as a single
   line being drawn rather than four separate animations. After the draw,
   glowing pulses travel from Sardauna along a random connector every ~2.5s.

   Variants-based, whileInView-triggered, replays on hover via keyed remount.
   Connectors render at lg+ only, where the grid is a fixed 896px and DROPS
   are its column centres; below lg a drawn stem stands in. */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const deptIcon = (paths: React.ReactNode) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {paths}
  </svg>
);

const DEPARTMENTS = [
  {
    name: "Kola",
    role: "Operations",
    icon: deptIcon(
      <>
        <path d="M12 2.8 20 7v10l-8 4.2L4 17V7l8-4.2Z" />
        <path d="M4 7l8 4.2L20 7M12 11.2v10" />
      </>
    ),
  },
  {
    name: "Ngozi",
    role: "Finance",
    icon: deptIcon(<path d="M6 4v16M18 4v16M4 9h16M4 15h16" />),
  },
  {
    name: "Tunde",
    role: "Growth",
    icon: deptIcon(
      <>
        <path d="m4 17 5.5-5.5 3.5 3L19 8.5" />
        <path d="M14.5 8.5H19V13" />
      </>
    ),
  },
  {
    name: "Zara",
    role: "Comms",
    icon: deptIcon(<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20l1-4.6A8.5 8.5 0 1 1 21 11.5Z" />),
  },
  {
    name: "Amara",
    role: "Delivery",
    icon: deptIcon(
      <>
        <path d="M2.5 6.5h11v10h-11z" />
        <path d="M13.5 10h4.2l3.3 3.4v3.1h-7.5" />
        <circle cx="6.8" cy="18.2" r="1.7" />
        <circle cx="16.6" cy="18.2" r="1.7" />
      </>
    ),
  },
  {
    name: "Emeka",
    role: "Analyst",
    icon: deptIcon(<path d="M3 12h4l2-5 4 10 2-5h6" />),
  },
];

/* ---------- lg geometry ----------
   On lg the grid below is always exactly max-w-4xl (896px) wide with six
   columns and gap-3, so drop points are the column centres. Every connector
   is computed from these constants — lines always land on nodes. */
const W = 896;
const H = 128;
const CX = W / 2; // trunk x
const TOP = 2; // trunk start y
const RAIL_Y = 56; // rail y
const BOT = 127; // connector landing y (card top edge)
const R = 12; // elbow corner radius
const DROPS = [69.7, 221, 372.3, 523.7, 675, 826.3];

const TRUNK_PATH = `M${CX} ${TOP} L${CX} ${RAIL_Y}`;
/* rail drawn as two halves so pathLength sweeps it out from the centre */
const RAIL_LEFT = `M${CX} ${RAIL_Y} L${DROPS[0] + R} ${RAIL_Y}`;
const RAIL_RIGHT = `M${CX} ${RAIL_Y} L${DROPS[5] - R} ${RAIL_Y}`;

/* rounded elbow: leaves the rail tangentially, quarter-turn, straight drop */
const elbowPath = (x: number) => {
  const sx = x < CX ? x + R : x - R;
  return `M${sx} ${RAIL_Y} Q${x} ${RAIL_Y} ${x} ${RAIL_Y + R} L${x} ${BOT}`;
};

/* ---------- pulse tracks ----------
   Each track is the full route Sardauna → trunk → rail → elbow → node,
   sampled at uniform arc length so a linear keyframe animation over the
   cx/cy arrays moves the pulse at constant speed (robust everywhere —
   no offset-path support worries). */
const buildTrack = (x: number) => {
  const sx = x < CX ? x + R : x - R;
  const segs = [RAIL_Y - TOP, Math.abs(sx - CX), R * 1.57, BOT - RAIL_Y - R];
  const total = segs.reduce((a, b) => a + b, 0);
  const pointAt = (s: number): [number, number] => {
    let d = s;
    if (d <= segs[0]) return [CX, TOP + d];
    d -= segs[0];
    if (d <= segs[1]) return [CX + (sx - CX) * (d / segs[1]), RAIL_Y];
    d -= segs[1];
    if (d <= segs[2]) {
      const u = d / segs[2];
      const k = 1 - (1 - u) * (1 - u);
      return [sx + (x - sx) * k, RAIL_Y + u * u * R];
    }
    d -= segs[2];
    return [x, RAIL_Y + R + d];
  };
  const N = 28;
  const cx: number[] = [];
  const cy: number[] = [];
  for (let k = 0; k <= N; k++) {
    const [px, py] = pointAt((k / N) * total);
    cx.push(Math.round(px * 10) / 10);
    cy.push(Math.round(py * 10) / 10);
  }
  return { cx, cy, dur: total / 420 };
};
const TRACKS = DROPS.map(buildTrack);

/* ---------- variants ---------- */

const chiefV = {
  hide: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: [0.5, 1.15, 1],
    transition: { duration: 0.5, times: [0, 0.6, 1], ease: EASE },
  },
};

/* one continuous stroke: each stage starts as the previous one lands, and
   every segment draws in its own direction of travel (down, then out from
   the centre, then down again) so the eye follows a single moving tip */
const trunkV = {
  hide: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.34, duration: 0.42, ease: "easeInOut" as const },
  },
};

const railV = {
  hide: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.74, duration: 0.44, ease: "easeInOut" as const },
  },
};

const jointV = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    r: [0, 4, 2.6],
    transition: { delay: 0.72, duration: 0.34, times: [0, 0.6, 1], ease: EASE },
  },
};

/* elbows drop outward-in step, the outermost pair last, so the drawing tip
   appears to run along the rail and turn down at each branch in turn */
const elbowV = {
  hide: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      delay: 1.1 + Math.abs(i - 2.5) * 0.09,
      duration: 0.36,
      ease: "easeInOut" as const,
    },
  }),
};

const pulseV = {
  hide: { opacity: 0 },
  show: (i: number) => ({
    cx: TRACKS[i].cx,
    cy: TRACKS[i].cy,
    opacity: [0, 1, 1, 1, 0],
    transition: { duration: TRACKS[i].dur, ease: "linear" as const },
  }),
};

const stemV = {
  hide: { scaleY: 0, opacity: 0 },
  show: {
    scaleY: 1,
    opacity: 1,
    transition: { delay: 0.34, duration: 0.5, ease: "easeInOut" as const },
  },
};

/* nodes rise into place just as their connector lands on them — no overshoot,
   so nothing competes with the line for attention */
const nodeV = (i: number) => ({
  hide: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.34 + Math.abs(i - 2.5) * 0.09, duration: 0.42, ease: EASE },
  },
});

const DOT_DELAYS = [
  "group-hover:delay-0",
  "group-hover:delay-150",
  "group-hover:delay-300",
];

function Chart({ run }: { run: number }) {
  /* continuous life: after the draw, fire a pulse down a random connector
     every ~2.5s (never the same connector twice in a row) */
  const [pulse, setPulse] = useState({ id: 0, drop: 2 });
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    let iv: number | undefined;
    const fire = () =>
      setPulse((p) => ({
        id: p.id + 1,
        drop: (p.drop + 1 + Math.floor(Math.random() * 5)) % 6,
      }));
    const t0 = window.setTimeout(() => {
      fire();
      iv = window.setInterval(fire, 2500);
    }, 2200);
    return () => {
      window.clearTimeout(t0);
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, []);

  return (
    <motion.div key={run} initial="hide" animate="show" className="flex w-full flex-col items-center">
      {/* chief of staff — bare mark, breathing halo */}
      <motion.div variants={chiefV} className="flex flex-col items-center">
        <span className="relative grid place-items-center">
          <span
            aria-hidden
            className="absolute -inset-6 rounded-full bg-[var(--color-cyan)]/30 blur-xl [animation:halo-pulse_3.5s_ease-in-out_infinite]"
          />
          <img
            src="/logo-128.png"
            alt=""
            className="relative h-14 w-14 drop-shadow-[0_10px_26px_rgba(2,6,31,0.55)]"
          />
        </span>
        <span className="mt-3 text-[17px] font-bold tracking-tight text-white">Sardauna</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
          Chief of Staff
        </span>
      </motion.div>

      {/* lg+: trunk → rail → rounded elbows, then travelling pulses */}
      <div className="mt-2 hidden h-32 w-full max-w-4xl lg:block" aria-hidden>
        <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`} fill="none">
          <motion.path
            variants={trunkV}
            d={TRUNK_PATH}
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.path
            variants={railV}
            d={RAIL_LEFT}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <motion.path
            variants={railV}
            d={RAIL_RIGHT}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <motion.circle
            variants={jointV}
            cx={CX}
            cy={RAIL_Y}
            fill="rgba(255,255,255,0.75)"
            style={{ filter: "drop-shadow(0 0 5px rgba(126,242,255,0.7))" }}
          />
          {DROPS.map((x, i) => (
            <motion.path
              key={x}
              custom={i}
              variants={elbowV}
              d={elbowPath(x)}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
          {pulse.id > 0 && (
            <motion.circle
              key={pulse.id}
              custom={pulse.drop}
              variants={pulseV}
              initial="hide"
              animate="show"
              r={3.2}
              style={{
                fill: "var(--color-cyan)",
                filter:
                  "drop-shadow(0 0 5px rgba(126,242,255,0.95)) drop-shadow(0 0 12px rgba(126,242,255,0.5))",
              }}
            />
          )}
        </svg>
      </div>

      {/* below lg: one drawn stem standing in for the tree */}
      <div className="mb-7 mt-3 flex w-full flex-col items-center lg:hidden" aria-hidden>
        <motion.span
          variants={stemV}
          className="block h-10 w-px origin-top rounded-full bg-gradient-to-b from-white/55 to-white/20"
        />
      </div>

      {/* six bare department nodes — no card; the drawn tree is the structure.
          Three-up on a phone (two tidy rows) rather than a cramped two-up.
          gap-x stays 3 at lg because DROPS are derived from that column pitch */}
      <div className="grid w-full max-w-4xl grid-cols-3 gap-x-4 gap-y-9 lg:mt-0 lg:grid-cols-6 lg:gap-x-3 lg:gap-y-0">
        {DEPARTMENTS.map((d, i) => (
          <motion.div
            key={d.name}
            variants={nodeV(i)}
            className="group flex w-full flex-col items-center text-center"
          >
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 group-hover:border-[var(--color-cyan)]/60 group-hover:bg-white/[0.18] group-hover:shadow-[0_0_22px_rgba(126,242,255,0.35)]">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 rounded-[20px] bg-[var(--color-cyan)]/0 blur-md transition-colors duration-200 group-hover:bg-[var(--color-cyan)]/20"
              />
              <span className="relative">{d.icon}</span>
            </span>
            <span className="mt-2.5 block text-[14px] font-bold leading-tight tracking-tight text-white">
              {d.name}
            </span>
            <span className="block text-[11px] font-medium leading-tight text-white/60">
              {d.role}
            </span>
            <span className="mt-2 flex items-center gap-1.5" aria-hidden>
              {DOT_DELAYS.map((delay) => (
                <span
                  key={delay}
                  className={`h-1 w-1 rounded-full bg-white/30 transition-[background-color,box-shadow] duration-200 group-hover:bg-[var(--color-cyan)] group-hover:shadow-[0_0_8px_rgba(126,242,255,0.85)] ${delay}`}
                />
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function OrgChart() {
  const [run, setRun] = useState(0);
  return (
    <section className="bg-azure-dawn rounded-[var(--radius-band)] mx-3 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 inline-block rounded-full border border-white/25 bg-[#0a1d7a] px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
          The House of Agents
        </p>
        <h2 className="text-display-2 mx-auto max-w-3xl text-white">
          One chief of staff. Six departments.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
          You talk to Sardauna. Sardauna runs the departments — and every
          department head runs specialists of its own.
        </p>

        <motion.div
          className="mt-12"
          onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))}
          onHoverStart={() => setRun((r) => r + 1)}
          viewport={{ once: true, margin: "-60px" }}
        >
          <Chart run={run} />
          <p className="mt-9 text-[12.5px] font-medium uppercase tracking-[0.18em] text-white/70">
            Hire more agents any time — the house grows with you
          </p>
        </motion.div>
      </div>
    </section>
  );
}
