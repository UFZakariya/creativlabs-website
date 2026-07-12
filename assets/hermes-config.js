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
  // Live web-chat endpoint — the dedicated Safetyline front-desk Hermes
  // (Bari/Biba). "" = offline scripted fallback.
  endpoint: "https://desk.187.77.174.115.sslip.io/web/chat",

  // The two front-desk personas the visitor can choose between in the dock.
  // `key` MUST match a persona in the backend (adapter.PERSONAS: bari | biba).
  // The widget sends the chosen `key` as `agent` on every live turn; the
  // backend selects that character's voice. Order = display order in the picker.
  personas: [
    {
      key: "bari",
      name: "Bari",
      tagline: "Straight to business",
      greeting: "Hi, I'm Bari from Safetyline. What does your business do, and what are you trying to fix or build? I'll tell you straight whether we can help — and what it would take."
    },
    {
      key: "biba",
      name: "Biba",
      tagline: "Warm & helpful",
      greeting: "Hi, I'm Biba from Safetyline — lovely to meet you. I'd love to hear a bit about your business: what do you do, and what made you look us up today?"
    }
  ],
  // Persona shown if the visitor never picks, and the default `agent` sent.
  defaultPersona: "biba",

  // Back-compat single-name fallback (used only if `personas` is removed).
  persona: "Biba",
  greeting: "Hi — I help out here at Safetyline. Ask me anything about what we build, or how an agent could work for your business. No rush.",
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
