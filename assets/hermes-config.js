/* Hermes site-assistant configuration.
   When the Hermes agent is live on the VPS, set `endpoint` to its chat URL
   and the dock switches from scripted answers to the real agent — no other
   code changes needed.

   Expected API contract (POST, JSON):
     request:  { message: string, sessionId: string, page: string }
     response: { reply: string }
*/
window.HERMES = {
  endpoint: "", // e.g. "https://hermes.safetyline.africa/api/site-chat"
  greeting: "Hi! I'm Hermes, the Safetyline assistant. Ask me anything about AI agents, what we build, or your own business — or take the 60-second readiness test above.",
  offlineNote: "The full Hermes agent is being connected right now. Meanwhile I can point you to the right place:"
};
