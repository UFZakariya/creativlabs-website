/* Organization + WebSite JSON-LD. The site shipped with zero structured data
   on any route, so search engines had to infer the company, its contact route
   and its logo from prose. Every claim here is one the site already makes in
   visible copy — nothing invented, no ratings, no fake review counts.

   Server component: this renders into the static HTML, so crawlers that do not
   execute JavaScript still see it. */

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Safetyline Communications Ltd",
  alternateName: "Safetyline",
  url: "https://safetyline.com.ng",
  logo: "https://safetyline.com.ng/logo-128.png",
  image: "https://safetyline.com.ng/share-card.png",
  description:
    "Safetyline builds Sardauna, an AI business assistant that runs a house of specialist agents for Nigerian businesses — WhatsApp first.",
  telephone: "+234 810 235 4786",
  areaServed: { "@type": "Country", name: "Nigeria" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+234 810 235 4786",
    contactType: "sales",
    areaServed: "NG",
    availableLanguage: ["en"],
  },
};

const SITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Safetyline",
  url: "https://safetyline.com.ng",
  publisher: { "@type": "Organization", name: "Safetyline Communications Ltd" },
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE) }}
      />
    </>
  );
}
