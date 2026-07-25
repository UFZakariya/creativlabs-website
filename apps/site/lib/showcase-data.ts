/* Showcase player scripts — original demo conversations for the hero.
   Grounded in the real Sardauna roster (chief of staff + department heads).
   WhatsApp threads mirror proven flows (orders, support, finance, growth,
   daily brief); the Instagram skin is product-vision with generic specifics
   per the brief's demo-honesty line. */

export type Sender = "agent" | "customer" | "owner" | "system";

export interface ShowMessage {
  id: string;
  from: Sender;
  name?: string;        // display name for agent messages
  text?: string;
  /** small structured artifact card rendered inside the thread */
  card?: { title: string; lines: string[]; cta?: string };
  /** subtle status line, e.g. "logged to CRM · receipt sent" */
  status?: string;
  time: string;
}

export interface ShowThread {
  key: string;
  label: string;         // sidebar name
  agent: string;         // responsible agent
  emoji: string;         // avatar stand-in
  preview: string;       // sidebar last-message preview
  messages: ShowMessage[];
}

export const WHATSAPP_THREADS: ShowThread[] = [
  {
    key: "brief",
    label: "Daily brief",
    agent: "Sardauna",
    emoji: "🎩",
    preview: "Morning brief ready — one approval waiting",
    messages: [
      {
        id: "b1", from: "agent", name: "Sardauna", time: "07:00",
        text: "Good morning. Overnight: 23 orders, 2 invoices paid, 1 complaint resolved. Your brief:",
      },
      {
        id: "b2", from: "agent", name: "Sardauna", time: "07:00",
        card: {
          title: "Tuesday · Company brief",
          lines: ["Sales — ₦412,500 (23 orders)", "Cash in — ₦180,000", "Complaints — 1 resolved, 0 open", "Approvals waiting — 1"],
        },
      },
      {
        id: "b3", from: "agent", name: "Sardauna", time: "07:01",
        text: "One decision needed: Friday restock at ₦96,000 — vendor quote attached. Approve?",
      },
      { id: "b4", from: "owner", time: "07:04", text: "Approved ✅" },
      {
        id: "b5", from: "agent", name: "Sardauna", time: "07:04",
        text: "Done. PO sent — Kola is tracking delivery for Friday.",
        status: "delegated to Operations · audit-logged",
      },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    agent: "Kola · Operations",
    emoji: "⚙️",
    preview: "Order #1042 confirmed — ₦18,400 received",
    messages: [
      { id: "o1", from: "customer", time: "10:12", text: "Do you deliver to Gwarinpa? I want 2 cartons." },
      {
        id: "o2", from: "agent", name: "Kola", time: "10:12",
        text: "We do — ₦18,400 including delivery, arriving Thursday. Pay securely here:",
      },
      {
        id: "o3", from: "agent", name: "Kola", time: "10:12",
        card: { title: "Order #1042", lines: ["2 × carton — ₦16,000", "Delivery (Gwarinpa) — ₦2,400", "Total — ₦18,400"], cta: "Pay now" },
      },
      { id: "o4", from: "customer", time: "10:18", text: "Paid ✅" },
      {
        id: "o5", from: "agent", name: "Kola", time: "10:18",
        text: "Received, thank you! Order confirmed — dispatch is scheduled and you'll get updates right here.",
        status: "receipt sent · logged to CRM · dispatch scheduled",
      },
    ],
  },
  {
    key: "support",
    label: "Support",
    agent: "Zara · Comms",
    emoji: "✉️",
    preview: "Replacement booked — delivery credit added",
    messages: [
      { id: "s1", from: "customer", time: "14:03", text: "My order arrived with one carton missing 😡" },
      { id: "s2", from: "agent", name: "Zara", time: "14:03", text: "So sorry about that — checking order #1029 now." },
      {
        id: "s3", from: "agent", name: "Zara", time: "14:04",
        text: "Confirmed: 1 of 3 cartons missed dispatch. I can send a replacement tomorrow morning, or refund ₦6,200 now — which do you prefer?",
      },
      { id: "s4", from: "customer", time: "14:06", text: "Replacement please" },
      {
        id: "s5", from: "agent", name: "Zara", time: "14:06",
        text: "Booked for tomorrow before noon, and I've added a ₦500 delivery credit to your account for the trouble.",
        status: "incident logged · owner notified",
      },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    agent: "Ngozi · Finance",
    emoji: "💰",
    preview: "INV-208 reminder sent · VAT pack ready",
    messages: [
      {
        id: "f1", from: "agent", name: "Ngozi", time: "09:00",
        text: "Invoice INV-208 (₦95,000) is 7 days overdue. I've drafted a polite reminder — approve to send?",
      },
      {
        id: "f2", from: "agent", name: "Ngozi", time: "09:00",
        card: { title: "INV-208 · Reminder draft", lines: ["Client — Harmony Stores", "Amount — ₦95,000 (7 days overdue)", "Tone — friendly, WHT-aware"], cta: "Review draft" },
      },
      { id: "f3", from: "owner", time: "09:11", text: "Send" },
      {
        id: "f4", from: "agent", name: "Ngozi", time: "09:11",
        text: "Sent. Also: VAT filing is due in 6 days — your pack is compiled and ready for review.",
        status: "approval recorded · compliance calendar updated",
      },
    ],
  },
  {
    key: "growth",
    label: "Growth",
    agent: "Tunde · Growth",
    emoji: "📈",
    preview: "New lead qualified — added to pipeline",
    messages: [
      {
        id: "g1", from: "agent", name: "Tunde", time: "16:40",
        text: "New lead from Instagram: a restaurant owner in Yaba asking about weekend catering.",
      },
      {
        id: "g2", from: "agent", name: "Tunde", time: "16:41",
        text: "Qualified ✅ — fits our customer profile. I've replied with the menu and proposed a call Thursday 2pm.",
      },
      {
        id: "g3", from: "agent", name: "Tunde", time: "16:41",
        card: { title: "Pipeline · new deal", lines: ["Bukka & Grill (Yaba)", "Weekend catering — est. ₦150,000", "Stage — call booked (Thu 2pm)"] },
      },
      { id: "g4", from: "owner", time: "16:55", text: "👍" },
    ],
  },
];

/* Instagram DM skin — product vision, generic specifics */
export const INSTAGRAM_THREAD: ShowThread = {
  key: "ig",
  label: "Instagram DMs",
  agent: "Sardauna",
  emoji: "📸",
  preview: "Comment → order, handled in DMs",
  messages: [
    { id: "i1", from: "system", time: "", text: "Replying to a comment on your post" },
    { id: "i2", from: "customer", time: "12:02", text: "Is this available in blue? 😍" },
    {
      id: "i3", from: "agent", name: "Sardauna", time: "12:02",
      text: "It is! Two left in blue — I can hold one for you for 24 hours. Want the payment link?",
    },
    { id: "i4", from: "customer", time: "12:05", text: "Yes please!" },
    {
      id: "i5", from: "agent", name: "Sardauna", time: "12:05",
      card: { title: "Your order", lines: ["1 × Blue — held till tomorrow 12:00", "Delivery or pickup — your choice"], cta: "Pay securely" },
    },
    {
      id: "i6", from: "agent", name: "Sardauna", time: "12:09",
      text: "Payment received — thank you! Your order is confirmed and updates will land right here. 🎉",
      status: "logged to CRM · owner dashboard updated",
    },
  ],
};
