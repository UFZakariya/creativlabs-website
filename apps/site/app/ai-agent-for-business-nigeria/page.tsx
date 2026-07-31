import type { Metadata } from "next";
import SeoLanding from "@/components/SeoLanding";
import { og } from "@/lib/og";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-agent-for-business-nigeria" },
  openGraph: og("/ai-agent-for-business-nigeria"),
  title: "AI Agent for Business in Nigeria — Sardauna | Safetyline",
  description:
    "Sardauna is the AI business assistant built for Nigerian reality: a chief-of-staff agent running departments of specialists on WhatsApp — orders, money, marketing and reports, under your approval.",
};

export default function Page() {
  return (
    <SeoLanding
      eyebrow="AI for business"
      h1={["Not a chatbot.", "A workforce."]}
      intro="Sardauna is a house of agents: a chief of staff who runs department specialists across operations, finance, growth and support — on the WhatsApp your business already uses, priced in naira, aware of VAT and CAMA."
      points={[
        {
          title: "Work comes back finished",
          body: "Ask once and the job is broken down, delegated and returned done — with the receipt, the report or the booking attached.",
        },
        {
          title: "WhatsApp-first, proven",
          body: "Our own front desk and working farm agents run on WhatsApp in production today. This is deployed reality, not a roadmap.",
        },
        {
          title: "You hold the keys",
          body: "Anything outbound waits for your approval, every action is logged, and every agent is tested before it's trusted.",
        },
      ]}
      proof={{
        text: "Start where every customer starts: the free readiness audit. One WhatsApp conversation, and you'll know exactly what a house of agents would take off your plate.",
        href: "/contact",
        label: "Start the free audit",
      }}
    />
  );
}
