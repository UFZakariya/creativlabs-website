"use client";

/* The old site's Bari & Biba dock, brought over whole: original shell markup,
   original CSS (legacy-dock.css, imported in the layout), and the original
   vanilla JS module served from /legacy/hermes-dock.js. This component only
   injects the shell and loads config + module once. */

import { useEffect, useRef } from "react";

const SHELL = `
  <div class="dock" id="hermes-dock">
    <button class="dock-btn" id="dock-btn" type="button" aria-expanded="false" aria-controls="dock-panel" aria-label="Chat with the Safetyline assistant">
      <img src="/logo-128.png" alt="" width="30" height="32">
      <span class="dock-pulse" aria-hidden="true"></span>
    </button>
    <div class="dock-panel glass-panel" id="dock-panel" role="dialog" aria-label="Safetyline assistant" hidden>
      <header class="dock-head">
        <img src="/logo-128.png" alt="" width="30" height="32">
        <div>
          <strong id="dock-name">Safetyline</strong>
          <small id="dock-status">Safetyline assistant</small>
        </div>
        <button class="dock-close" id="dock-close" type="button" aria-label="Close chat">&#10005;</button>
      </header>
      <div class="dock-msgs" id="dock-msgs"></div>
      <div class="sr-only" id="dock-live" aria-live="polite" role="status"></div>
      <form class="dock-form" id="dock-form">
        <input type="text" id="dock-input" placeholder="Ask about agents, pricing, your business…" autocomplete="off" aria-label="Message">
        <button class="glass-btn glass-btn--accent dock-send" type="submit" aria-label="Send">&#10148;</button>
      </form>
    </div>
  </div>
`;

export default function LegacyDock() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("hermes-dock")) return; // once per page load
    const el = host.current;
    if (!el) return;
    el.innerHTML = SHELL;

    const load = (src: string) =>
      new Promise<void>((res, rej) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej(new Error(src));
        document.body.appendChild(s);
      });

    load("/legacy/hermes-config.js")
      .then(() => load("/legacy/hermes-dock.js"))
      .catch(() => {});
  }, []);

  return <div ref={host} />;
}
