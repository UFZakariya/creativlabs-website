import type { Metadata } from "next";
import SeoLanding from "@/components/SeoLanding";

export const metadata: Metadata = {
  alternates: { canonical: "/food-business-operations-nigeria" },
  openGraph: { url: "/food-business-operations-nigeria" },
  title: "Food Business Operations in Nigeria — Orders to closeout | Safetyline",
  description:
    "Run a Nigerian food business end to end: orders in by chat and app, stock and vendors managed, cash reconciled daily. Built on TruckVille OS, proven live — now offered with Sardauna's agents.",
};

export default function Page() {
  return (
    <SeoLanding
      eyebrow="Food & hospitality"
      h1={["From order to closeout,", "without the chaos."]}
      intro="Orders arriving on WhatsApp and a customer app, stock moving, cash that has to agree at the end of the day — Sardauna runs the operational spine we first built and proved as TruckVille OS."
      points={[
        {
          title: "Orders in one queue",
          body: "Chat orders and app orders land in the same system, so nothing gets cooked twice or missed entirely.",
        },
        {
          title: "Closeout made routine",
          body: "End-of-day reconciliation — cash, stock, orders — compiled for you instead of scribbled at midnight.",
        },
        {
          title: "Customers answered",
          body: "Where-is-my-order, menu questions and follow-ups handled by agents in the chat your customers already use.",
        },
      ]}
      proof={{
        text: "The pattern is proven: TruckVille OS runs a real food business's admin and ordering today. Your version comes with a house of agents on top.",
        href: "/customers/truckville",
        label: "Read the TruckVille story",
      }}
    />
  );
}
