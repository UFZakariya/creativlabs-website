"use client";

import { MotionConfig } from "framer-motion";

/* framer-motion does not consult prefers-reduced-motion on its own, so every
   Reveal, TiltCard and variant on the site animated regardless of the OS
   setting. `reducedMotion="user"` makes framer honour it globally: transform
   and opacity animations are skipped and the element renders at its final
   state, which is exactly what we want (the content is already correct at the
   end of every variant).

   This has to be a client component — MotionConfig uses context, and
   app/layout.tsx is a server component. Server children pass straight
   through, so nothing is forced into the client bundle by wrapping them. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
