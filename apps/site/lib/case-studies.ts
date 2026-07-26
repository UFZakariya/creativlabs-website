/* Case-study content — real deployments, structural truths only.
   No invented metrics: figures land at the owner's copy review. */

export type CaseSection = {
  id: string;
  title: string;
  paras: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  name: string;
  statSentence: [string, string]; // [plain, gradient tail]
  intro: string;
  meta: { k: string; v: string }[];
  sections: CaseSection[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ufms",
    name: "UFMS",
    statSentence: ["Every egg, every batch,", "on one ledger."],
    intro:
      "The farm-management system Safetyline built and runs for a working commercial poultry operation — its daily ledger for eggs, feed, birds and money.",
    meta: [
      { k: "Sector", v: "Agriculture — poultry" },
      { k: "What it is", v: "Farm operations system" },
      { k: "Surface", v: "Dashboard + WhatsApp agents" },
      { k: "Status", v: "Live in production" },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paras: [
          "UFMS is not a demo built for this website — it is the system a real poultry farm opens every day. Safetyline designed, built and operates it: the production ledger, the dashboards the owner reads, and the WhatsApp agents the farm reports through.",
          "It exists because poultry margins live and die on daily discipline. Miss a day of records and the week is a guess; miss a week and the month is a story you tell yourself.",
        ],
      },
      {
        id: "system",
        title: "What the system does",
        paras: [
          "The dashboard is a cockpit for the whole operation, centred on the egg ledger — every collection logged against its batch — with the numbers an owner actually acts on around it:",
        ],
        bullets: [
          "A KPI strip for the day's headline figures",
          "Lay-rate trends per batch, so a dip shows up while it's still cheap to fix",
          "Mortality tracking with day-by-day history",
          "Stock flow — feed and inputs in, crates out",
          "Per-batch economics from placement onward",
        ],
      },
      {
        id: "agents",
        title: "Where the agents come in",
        paras: [
          "Farm staff don't fill forms — they message. UFMS's WhatsApp agents run in production today: reports arrive as chat, land in the ledger as structured records, and the owner reads the result on the dashboard.",
          "This is the deployment we point to when we say WhatsApp-first is proven, not promised.",
        ],
      },
      {
        id: "why",
        title: "Why it matters to your business",
        paras: [
          "Swap eggs for your stock, lay rates for your sales, and the shape is the same: daily operational truth, collected in chat, kept in one place, read at a glance. That shape — built here first — is what Sardauna brings to your business.",
        ],
      },
    ],
  },
  {
    slug: "truckville",
    name: "TruckVille OS",
    statSentence: ["A food business,", "closed out daily."],
    intro:
      "The operations system behind a working food business — orders, vendors and end-of-day closeouts — plus the customer ordering app in front of it.",
    meta: [
      { k: "Sector", v: "Food & hospitality" },
      { k: "What it is", v: "Ops admin + ordering app" },
      { k: "Surface", v: "Web admin + mobile web" },
      { k: "Status", v: "Live" },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        paras: [
          "TruckVille OS is two systems that meet in the middle: an operations admin where the business runs its day, and a customer ordering app where the day's work comes from. Safetyline built both.",
          "Food operations fail quietly, at the end of the day — when cash, stock and orders are supposed to agree and don't. TruckVille OS was built around that moment.",
        ],
      },
      {
        id: "system",
        title: "What the system does",
        paras: ["The admin gives the operator one place to run everything:"],
        bullets: [
          "KPI cards for the day at a glance",
          "Order management from placement to fulfilment",
          "Vendor and menu management",
          "Daily closeout bands — the end-of-day reconciliation, made routine",
        ],
      },
      {
        id: "app",
        title: "The ordering app",
        paras: [
          "Customers order from a phone-first app — browse the menu, pick a vendor, check out in a few taps. Orders land in the same system the closeouts reconcile against, so the front of house and the back office never drift apart.",
        ],
      },
      {
        id: "why",
        title: "Why it matters to your business",
        paras: [
          "TruckVille OS is proof of the build discipline behind Sardauna: real software, run daily, where the numbers have to agree. When your house of agents takes over order flow or daily reconciliation, it stands on patterns proven here.",
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
