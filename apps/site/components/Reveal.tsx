"use client";

/* Scroll-reveal wrapper: fade-and-lift once when the block enters the
   viewport. Variants-based (repo rule — inline animate objects can strand
   content invisible off-compositor). Children stay server-rendered. */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /* Above-the-fold blocks opt out. A Reveal renders its children at opacity 0
     until framer-motion hydrates, so wrapping the hero headline meant the LCP
     element was invisible in the server HTML and the paint waited on JS. Here
     the right answer is to render visible and animate nothing — the entrance
     is not worth the delay on the first thing a visitor sees. */
  immediate?: boolean;
}) {
  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hide: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}
