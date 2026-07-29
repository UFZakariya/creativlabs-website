import type { Metadata } from "next";
import SeoLanding from "@/components/SeoLanding";

export const metadata: Metadata = {
  alternates: { canonical: "/membership-management-nigeria" },
  title: "Membership Management in Nigeria — Registers that scale | Safetyline",
  description:
    "Membership registration, records and printable slips for Nigerian organisations — structured down to state, LGA and ward. Built and proven on a national portal, offered with Sardauna's agents.",
};

export default function Page() {
  return (
    <SeoLanding
      eyebrow="Membership & civic"
      h1={["A member register,", "down to the ward."]}
      intro="From a church roll to a national structure: registration, records and printable membership slips organised the way Nigeria actually is — state by state, LGA by LGA, ward by ward — with agents handling the busywork."
      points={[
        {
          title: "Registration that flows",
          body: "Members join by form or chat; records land structured, deduplicated and searchable from day one.",
        },
        {
          title: "The Nigerian structure",
          body: "State, LGA and ward hierarchies built in — reports and slips that match how your organisation is actually organised.",
        },
        {
          title: "Agents on the desk",
          body: "Member questions answered, records chased, renewal follow-ups sent — under your approval, on the record.",
        },
      ]}
      proof={{
        text: "We built and ran a national organisation's membership portal — registration to printable slips. That build discipline is what your register gets.",
        href: "/customers",
        label: "See the deployments",
      }}
    />
  );
}
