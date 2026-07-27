"use client";

/* Opens the legacy Hermes chat dock in place of a page jump. The dock module
   (public/legacy/hermes-dock.js) exposes window.SL_DOCK = { open, isOpen } and
   nothing else — no message-injection API — and it already greets in persona
   on first open (chooseAgent → greeting), so we simply open it: no fake-sent
   user message, no network call. If the module hasn't loaded (blocked script,
   legacy page without the dock), fall back to the contact page. */

import type { ReactNode } from "react";

declare global {
  interface Window {
    SL_DOCK?: { open?: () => void; isOpen?: () => boolean };
  }
}

export default function DockOpenButton({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const handleClick = () => {
    if (window.SL_DOCK?.open) window.SL_DOCK.open();
    else window.location.href = "/contact";
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children ?? label}
    </button>
  );
}
