/* Offer JSON-LD for the pricing ladder.

   Only worth shipping now that the figures are public: search engines cannot
   surface a price they cannot parse, and until this release every tier was
   "priced on the intro call". The numbers here MUST stay in step with
   app/pricing/page.tsx and the agents' seed_kb/pricing.md — three copies of
   the same commercial promise, and a visitor can see two of them at once.

   Deliberately conservative: no aggregateRating, no review counts, no
   availability claims we cannot stand behind. Lite is modelled as a zero-price
   offer with its commission stated in the description rather than as a fake
   price, because 2.5% of remote sales is not something schema.org can express
   as a monetary amount.

   Server component, so this lands in the static HTML for crawlers that do not
   run JavaScript. */

const BASE = "https://safetyline.com.ng";

type Tier = {
  name: string;
  price: string;          // "0" | monthly naira amount
  description: string;
  perMonth: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Sardauna Lite",
    price: "0",
    perMonth: false,
    description:
      "Free with no monthly fee — Safetyline keeps 2.5% of the remote sales the platform brings the business. Includes a business website, an AI-readiness and WhatsApp-response mini-audit, consent-gated contact capture and WhatsApp click-to-chat.",
  },
  {
    name: "Sardauna Plus+",
    price: "19999",
    perMonth: true,
    description:
      "Everything in Lite, plus AI chat answering 24/7 on the website and WhatsApp, online booking and calendar, missed-call text-back, review automation, and a CRM with a lead pipeline.",
  },
  {
    name: "Sardauna Elite",
    price: "49999",
    perMonth: true,
    description:
      "Everything in Plus+, plus integrated payments (Paystack, Moniepoint, OPay), follow-up sequences and funnels, a unified inbox, NGN finance and invoicing, support tickets, a Nigeria compliance calendar and the daily brief.",
  },
];

const SERVICE = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sardauna — AI business assistant",
  serviceType: "AI business automation",
  provider: {
    "@type": "Organization",
    name: "Safetyline Communications Ltd",
    url: BASE,
  },
  areaServed: { "@type": "Country", name: "Nigeria" },
  url: `${BASE}/pricing`,
  offers: [
    ...TIERS.map((t) => ({
      "@type": "Offer",
      name: t.name,
      description: t.description,
      url: `${BASE}/pricing`,
      priceCurrency: "NGN",
      price: t.price,
      ...(t.perMonth
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: t.price,
              priceCurrency: "NGN",
              /* schema.org duration for "per month" */
              billingDuration: 1,
              billingIncrement: 1,
              unitCode: "MON",
            },
          }
        : {}),
    })),
    {
      "@type": "Offer",
      name: "Sardauna Premier",
      description:
        "Everything in Elite, plus a full custom build: bespoke features on demand, custom AI systems and automation, and a delivery board. Scoped and quoted per project before any work starts.",
      url: `${BASE}/pricing`,
      priceCurrency: "NGN",
      /* quoted per project — no figure to publish, and inventing one would be
         a false commercial claim */
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NGN",
        valueAddedTaxIncluded: false,
        description: "Quoted per project after scoping.",
      },
    },
  ],
};

export default function PricingSchema() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE) }}
    />
  );
}
