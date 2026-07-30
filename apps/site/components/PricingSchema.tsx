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

import { PRICING, PREMIER } from "@/lib/pricing";

const BASE = "https://safetyline.com.ng";

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
    ...PRICING.filter((t) => t.amount !== null).map((t) => ({
      "@type": "Offer",
      name: t.name,
      description: t.schemaDescription,
      url: `${BASE}/pricing`,
      priceCurrency: "NGN",
      price: String(t.amount),
      ...(t.monthly
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(t.amount),
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
      name: PREMIER.name,
      description: PREMIER.schemaDescription,
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
