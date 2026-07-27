"use client";

/* 3D pointer-tilt wrapper — modeled on the 21st.dev tilt-card pattern.
   A [perspective:1000px] wrapper around a preserve-3d motion.div whose
   rotateX/rotateY chase the pointer through springs (and settle back to
   flat on leave), plus a whisper of scale lift while hovered.

   Notes for use in this repo:
   - Pointer handlers only observe events (no capture / stopPropagation),
     so children's own hover handlers keep firing.
   - GlowingEffect stays position-absolute INSIDE the card shell, so the
     glow tilts with the card; nothing about its pointer tracking changes
     (it listens on document.body and reads getBoundingClientRect).
   - This is a plain motion.div with `style` motion values only — no
     variants — so it never intercepts variant propagation. Keep any
     variant-driven entrance on an ancestor (or descendant) motion node. */

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

const SPRING = { stiffness: 220, damping: 18 };

export default function TiltCard({
  children,
  className,
  maxTilt = 10,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lift = useMotionValue(1);
  const rotateX = useSpring(rx, SPRING);
  const rotateY = useSpring(ry, SPRING);
  const scale = useSpring(lift, { stiffness: 220, damping: 24 });

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // Tilt is a fine-pointer affordance — skip it for touch.
      if (e.pointerType === "touch") return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (cx === 0 || cy === 0) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ry.set(((x - cx) / cx) * maxTilt);
      rx.set(-((y - cy) / cy) * maxTilt);
      lift.set(1.005);
    },
    [maxTilt, rx, ry, lift]
  );

  const onPointerLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    lift.set(1);
  }, [rx, ry, lift]);

  return (
    <div className={`[perspective:1000px] ${className ?? ""}`}>
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, scale }}
        className="relative h-full [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </div>
  );
}
