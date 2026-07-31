/* SINGLE SOURCE OF TRUTH for the pricing ladder.

   The figures were duplicated across the pricing page and the Offer schema, and
   a visitor can see both at once (the page in front of them, the schema in the
   search result that brought them). Two copies of a commercial promise drift;
   this makes them one.

   There is a THIRD copy that cannot be imported from here: the agents' own
   knowledge base at seed_kb/pricing.md on the desk VPS, which Bari and Biba
   answer pricing questions from. It is a separate deployment, so if a figure
   below changes, that file must change with it — otherwise the chat widget
   starts contradicting the page it sits on. Update procedure is in the header
   comment of that file. */

export type TierKey = "lite" | "plus" | "elite" | "premier";

export type PricingTier = {
  key: TierKey;
  name: string;
  /** what the card shows */
  display: string;
  /** naira amount for schema.org; null when quoted per project */
  amount: number | null;
  /** true for the monthly subscription rungs */
  monthly: boolean;
  priceSub: string;
  blurb: string;
  /** first entry is the cumulative "Everything in …" line, where applicable */
  features: string[];
  cta: { label: string; href: string };
  featured: boolean;
  /** condensed line used by the Offer schema */
  schemaDescription: string;
};

export const PRICING: PricingTier[] = [
  {
    key: "lite",
    name: "Sardauna Lite",
    display: "Free",
    amount: 0,
    monthly: false,
    priceSub: "tier 1 · get seen · 2.5% of remote sales",
    blurb:
      "Get your business onto the platform and see it work — a clean website, a WhatsApp door for customers, and a mini-audit of what an AI employee would take off your plate. No monthly fee: we earn 2.5% of the remote sales the platform brings you, so it only costs you when it works.",
    features: [
      "A professional business website — one clean template",
      "AI-readiness & WhatsApp-response mini-audit",
      "Basic contact capture, consent-gated",
      "WhatsApp click-to-chat wired to your number",
      "No monthly fee — 2.5% of remote sales instead",
    ],
    cta: { label: "Start free", href: "/contact" },
    featured: false,
    schemaDescription:
      "Free with no monthly fee — Safetyline keeps 2.5% of the remote sales the platform brings the business. Includes a business website, an AI-readiness and WhatsApp-response mini-audit, consent-gated contact capture and WhatsApp click-to-chat.",
  },
  {
    key: "plus",
    name: "Sardauna Plus+",
    display: "₦19,999",
    amount: 19999,
    monthly: true,
    priceSub: "per month · tier 2 · get answered",
    blurb:
      "The core AI-employee promise: your business stops losing enquiries. Messages, calls, bookings and reviews — answered around the clock on your site and WhatsApp.",
    features: [
      "Everything in Sardauna Lite, plus:",
      "AI chat that answers 24/7 — website and WhatsApp",
      "Online booking and calendar",
      "Missed-call text-back, so no enquiry rings out",
      "Review automation",
      "CRM, contacts and a lead pipeline",
      "Basic content & social",
    ],
    cta: { label: "Get answered", href: "/contact" },
    featured: true,
    schemaDescription:
      "Everything in Lite, plus AI chat answering 24/7 on the website and WhatsApp, online booking and calendar, missed-call text-back, review automation, and a CRM with a lead pipeline.",
  },
  {
    key: "elite",
    name: "Sardauna Elite",
    display: "₦49,999",
    amount: 49999,
    monthly: true,
    priceSub: "per month · tier 3 · get run",
    blurb:
      "Your business isn't just answered — it's operated. The full back-office AI staff: money, follow-ups, funnels, compliance, content and a daily brief.",
    features: [
      "Everything in Sardauna Plus+, plus:",
      "Payments integrated — Paystack, Moniepoint, OPay and the rest",
      "Follow-up sequences, nurture and a funnel builder",
      "Unified inbox across your channels",
      "Finance & invoicing — NGN, WHT/VAT-aware — plus proposals",
      "Support tickets and multi-channel social",
      "Compliance calendar (Nigeria), SOPs, operating plans and the daily brief",
      "The full AI-staff org — voice AI receptionist as a premium add-on",
    ],
    cta: { label: "Talk about Elite", href: "/contact" },
    featured: false,
    schemaDescription:
      "Everything in Plus+, plus integrated payments (Paystack, Moniepoint, OPay), follow-up sequences and funnels, a unified inbox, NGN finance and invoicing, support tickets, a Nigeria compliance calendar and the daily brief.",
  },
  {
    key: "premier",
    name: "Sardauna Premier",
    display: "Per project",
    amount: null,
    monthly: false,
    priceSub: "tier 4 · on top of any tier",
    blurb:
      "A full custom build layered on whichever tier you’re on: the systems your business needs that nothing off the shelf covers — designed, built and delivered on a board you can watch.",
    features: [
      "Everything in your current tier, plus:",
      "Full custom build — bespoke features on demand",
      "Custom AI systems and automation builds",
      "A projects & delivery board with honest status",
      "Scoped and quoted before any work starts",
    ],
    cta: { label: "Scope a build", href: "/contact" },
    featured: false,
    schemaDescription:
      "A full custom build layered on whichever tier the business is on: bespoke features on demand, custom AI systems and automation, and a delivery board. Scoped and quoted per project before any work starts.",
  },
];

/* the three monthly rungs render as columns; Premier is a project engagement
   layered on any of them, so it gets its own wide row below */
export const SUBSCRIPTION_TIERS = PRICING.filter((t) => t.key !== "premier");
export const PREMIER = PRICING.find((t) => t.key === "premier")!;
