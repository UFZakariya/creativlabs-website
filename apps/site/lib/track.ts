/* First-party funnel analytics — same /t ingest as the old site (derived
   from the chat endpoint), fire-and-forget, nothing stored client-side. */

export const CHAT_ENDPOINT =
  process.env.NEXT_PUBLIC_CHAT_URL || "https://chat.safetyline.com.ng/web/chat";

const TRACK_URL = CHAT_ENDPOINT ? CHAT_ENDPOINT.replace(/\/chat\/?$/, "/t") : "";

export function slTrack(kind: string, extra?: Record<string, string>) {
  // never report dev/staging traffic into the live funnel
  if (process.env.NODE_ENV !== "production") return;
  if (!TRACK_URL || typeof window === "undefined") return;
  try {
    fetch(TRACK_URL, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...extra }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
