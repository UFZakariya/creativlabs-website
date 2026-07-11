/* Hermes site-assistant configuration.
   When the Hermes web-chat backend is live, set `endpoint` to its /web/chat URL
   and the dock switches from scripted answers to the real streaming agent —
   no other code changes needed.

   WIRE CONTRACT v1 (Milestone 2 web widget)
   -----------------------------------------
   `endpoint` is the POST /web/chat URL, e.g. "https://hermes.safetyline.africa/web/chat".
   The dock POSTs { message, page } with credentials:"include" and reads the
   response as a Server-Sent-Events stream on the SAME response (fetch +
   ReadableStream — NOT EventSource, which can't POST a body). Named events:
     event: session             data: { anon_id }
     event: assistant.delta     data: { text }        (incremental reply chunks)
     event: tool.activity       data: { tool, phase } (phase: started|completed|failed)
     event: assistant.completed data: { text }        (full final reply)
     event: limit               data: { message }     (per-session turn limit — no model call)
     event: error               data: { message }
     event: done                data: {}              (always last)
   Session identity lives in an httpOnly "sl_sid" cookie the server sets — the
   widget stores nothing sensitive. When `endpoint` is live the dock also fires
   fire-and-forget page analytics (page_view / cta_click) to POST /t (derived
   from `endpoint`) — conversation metrics are recorded server-side, not here —
   and sends a hidden honeypot field so the backend can drop bots. All of this
   is inert while `endpoint` is "".

   Leave endpoint = "" to keep the dock in OFFLINE scripted mode. This is the
   shipped default until the backend goes live.
*/
window.HERMES = {
  // The Milestone-2 web-chat endpoint. "" = offline scripted fallback.
  endpoint: "", // e.g. "https://hermes.safetyline.africa/web/chat"

  // The front-desk persona's first name — shown in the header and openers, and
  // kept in sync with the backend character sheet
  // (hermes-farm-fork/plugins/safetyline_web/seed_playbooks/*/SKILL.md). Change
  // it in BOTH places. "Hermes" is an internal codename and must never surface.
  persona: "Ada",

  greeting: "Hi, I'm Ada — I help out here at Safetyline. Ask me anything about what we build, or how an agent could work for your business. No rush.",
  offlineNote: "Let me point you to the right place:",

  // NDPA one-liner, rendered once inside the panel on first open. This is the
  // only privacy surface in the widget for Milestone 2.
  consentText: "This chat is powered by our AI agent and stored to serve you better.",

  // Shown when the live agent degrades (network failure / non-200 / 429) and the
  // dock falls back to the offline scripted path so it never dead-ends.
  degradedCopy: "I'm having trouble reaching the live agent, so I'll keep helping from here.",

  // One-line teaser bubble shown once per session beside the closed button.
  teaserText: "Questions about agents? Ask me →",

  // WhatsApp fallback number (digits only, international, no + or spaces).
  // Used by the 'limit' event to move the conversation to WhatsApp. Keep in
  // sync with the site-wide [data-wa] number in app.js (module 8a).
  waNumber: "2348102354786"
};
