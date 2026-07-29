import type { Metadata } from "next";
import SeoLanding from "@/components/SeoLanding";

export const metadata: Metadata = {
  alternates: { canonical: "/farm-management-system-nigeria" },
  title: "Farm Management System in Nigeria — Run by AI agents | Safetyline",
  description:
    "A farm management system proven on a working Nigerian poultry operation: daily records over WhatsApp, one dashboard for lay rates, stock and batch economics — run by Sardauna's house of agents.",
};

export default function Page() {
  return (
    <SeoLanding
      eyebrow="Farm management"
      h1={["Your farm's daily truth,", "kept by agents."]}
      intro="Records over WhatsApp, a dashboard the owner actually opens, and a house of agents keeping the ledger honest — proven in production on a working Nigerian poultry farm before it was ever offered to yours."
      points={[
        {
          title: "Report by chat",
          body: "Farm staff message what happened — collections, feed, losses — and agents turn it into structured records. No forms, no training.",
        },
        {
          title: "See the whole farm",
          body: "Lay rates, mortality, stock flow and per-batch economics on one dashboard, so a dip shows up while it's still cheap to fix.",
        },
        {
          title: "Under your approval",
          body: "Restocks and anything that spends money wait for your yes — with every action logged and reviewable.",
        },
      ]}
      proof={{
        text: "This isn't a concept page. UFMS — the system this page describes — runs a real poultry operation today, with WhatsApp agents live in production.",
        href: "/customers/ufms",
        label: "Read the UFMS story",
      }}
    />
  );
}
