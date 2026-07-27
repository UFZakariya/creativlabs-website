"use client";

/* Pointer-tracking border glow — adapted from the glowing-effect component
   (21st.dev / aceternity), recolored to the brand ramp (cyan → azure →
   blue → violet). Renders inside a `relative rounded` card; the conic
   highlight chases the pointer along the border and fades when idle. */

import { memo, useCallback, useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  movementDuration?: number;
  borderWidth?: number;
  disabled?: boolean;
}

const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.6,
  proximity = 72,
  spread = 40,
  movementDuration = 1.6,
  borderWidth = 3,
  disabled = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  const handleMove = useCallback(
    (e?: { x: number; y: number }) => {
      if (!containerRef.current) return;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;
        if (e) lastPosition.current = { x: mouseX, y: mouseY };
        const cx = left + width * 0.5;
        const cy = top + height * 0.5;
        const distance = Math.hypot(mouseX - cx, mouseY - cy);
        if (distance < 0.5 * Math.min(width, height) * inactiveZone) {
          el.style.setProperty("--active", "0");
          return;
        }
        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;
        el.style.setProperty("--active", isActive ? "1" : "0");
        if (!isActive) return;
        const current = parseFloat(el.style.getPropertyValue("--start")) || 0;
        const target = (180 * Math.atan2(mouseY - cy, mouseX - cx)) / Math.PI + 90;
        const diff = ((target - current + 180) % 360) - 180;
        animate(current, current + diff, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => el.style.setProperty("--start", String(v)),
        });
      });
    },
    [inactiveZone, proximity, movementDuration]
  );

  useEffect(() => {
    if (disabled) return;
    // touch devices have no hover pointer — the chase never shows, so skip the
    // body-wide listener and its rAF work entirely (real win on low-end phones,
    // where several of these run per page)
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    const onScroll = () => handleMove();
    const onPointer = (e: PointerEvent) => handleMove({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.body.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      document.body.removeEventListener("pointermove", onPointer);
    };
  }, [handleMove, disabled]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={
        {
          "--blur": `${blur}px`,
          "--spread": spread,
          "--start": "0",
          "--active": "0",
          "--gborder": `${borderWidth}px`,
          "--gradient": `radial-gradient(circle, #7ef2ff 10%, #7ef2ff00 20%),
            radial-gradient(circle at 40% 40%, #38bdf8 8%, #38bdf800 18%),
            radial-gradient(circle at 60% 60%, #083cff 10%, #083cff00 20%),
            radial-gradient(circle at 40% 60%, #7b2ff7 10%, #7b2ff700 20%),
            repeating-conic-gradient(from 236.84deg at 50% 50%, #7ef2ff 0%, #38bdf8 25%, #083cff 50%, #7b2ff7 75%, #7ef2ff 100%)`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${blur > 0 ? "blur-[var(--blur)]" : ""} ${disabled ? "hidden" : ""}`}
    >
      <div
        className={
          'rounded-[inherit] after:absolute after:inset-[calc(-1*var(--gborder))] after:rounded-[inherit] after:content-[""] ' +
          "after:[background:var(--gradient)] after:[background-attachment:fixed] " +
          "after:[border:var(--gborder)_solid_transparent] " +
          "after:opacity-[var(--active)] after:transition-opacity after:duration-300 " +
          "after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] " +
          "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
        }
      />
    </div>
  );
});

export default GlowingEffect;
