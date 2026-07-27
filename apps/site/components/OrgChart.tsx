"use client";

/* The House of Agents org chart — the section only Sardauna can show:
   a real chief of staff commanding real department heads. The bare glowing
   mark sits on top; animated SVG connectors draw down and flow into six
   frosted-glass department nodes on the azure-dawn band. Variants-based,
   whileInView-triggered, replays on hover via keyed remount. */

import { useState } from "react";
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

/* fan geometry — on lg the grid below is always exactly max-w-4xl (896px)
   wide with 6 columns and gap-3, so the drop points are the column centres */
const FAN_W = 896;
const FAN_H = 80;
const DROPS = [69.7, 221, 372.3, 523.7, 675, 826.3];
const fanPath = (x: number) =>
  `M${FAN_W / 2} 2 C${FAN_W / 2} 44, ${x} 30, ${x} ${FAN_H - 2}`;

/* ---------- variants ---------- */

const chiefV = {
  hide: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: [0.5, 1.15, 1],
    transition: { duration: 0.5, times: [0, 0.6, 1], ease: EASE },
  },
};

/* faint solid guide draws itself down… */
const drawV = {
  hide: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.3 + i * 0.07, duration: 0.55, ease: EASE },
  }),
};

/* …then the flowing dashed current fades in on top */
const flowV = {
  hide: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { delay: 0.85 + i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

const stemV = {
  hide: { scaleY: 0, opacity: 0 },
  show: { scaleY: 1, opacity: 1, transition: { delay: 0.3, duration: 0.4, ease: EASE } },
};
const railV = {
  hide: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { delay: 0.5, duration: 0.45, ease: EASE } },
};

const nodeV = (i: number) => ({
  hide: { opacity: 0, y: 12, scale: 0.5 },
  show: {
    opacity: 1,
    y: 0,
    scale: [0.5, 1.15, 1],
    transition: { delay: 0.7 + i * 0.1, duration: 0.45, times: [0, 0.6, 1], ease: EASE },
  },
});

function Chart({ run }: { run: number }) {
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
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          Chief of Staff
        </span>
      </motion.div>

      {/* lg+: connectors draw down, then current flows along them */}
      <div className="mt-2 hidden h-20 w-full max-w-4xl lg:block" aria-hidden>
        <svg className="h-full w-full" viewBox={`0 0 ${FAN_W} ${FAN_H}`} fill="none">
          {DROPS.map((x, i) => (
            <g key={x}>
              <motion.path
                custom={i}
                variants={drawV}
                d={fanPath(x)}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <motion.path
                custom={i}
                variants={flowV}
                d={fanPath(x)}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.6"
                strokeDasharray="2 5"
                strokeLinecap="round"
                className="[animation:dash-flow_2.2s_linear_infinite]"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* below lg: simple stem + rail */}
      <div className="mt-3 flex w-full flex-col items-center lg:hidden" aria-hidden>
        <motion.span variants={stemV} className="block h-6 w-px origin-top bg-white/40" />
        <motion.span variants={railV} className="mt-0 hidden h-px w-[min(620px,86%)] bg-white/30 sm:block" />
      </div>

      {/* six frosted department nodes */}
      <div className="mt-4 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-0 lg:grid-cols-6">
        {DEPARTMENTS.map((d, i) => (
          <motion.div
            key={d.name}
            variants={nodeV(i)}
            className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/40 bg-white/15 px-3 py-4 shadow-[0_10px_28px_rgba(2,6,31,0.25)] backdrop-blur-sm"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/15">
              {d.icon}
            </span>
            <span className="text-center leading-tight">
              <span className="block text-[14px] font-bold tracking-tight text-white">{d.name}</span>
              <span className="block text-[11px] font-medium text-white/65">{d.role}</span>
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
        <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[var(--color-cyan)]">
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
          <p className="mt-9 text-[12.5px] font-medium uppercase tracking-[0.18em] text-white/45">
            Hire more agents any time — the house grows with you
          </p>
        </motion.div>
      </div>
    </section>
  );
}
