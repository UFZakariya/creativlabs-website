/* Per-page openGraph, done safely.

   Next.js metadata does NOT deep-merge nested objects: a page exporting
   `openGraph: { url }` replaces the root layout's openGraph wholesale, which
   silently dropped og:image, og:type, og:site_name and og:locale on 13 of 15
   routes — shares to WhatsApp/X lost the card image. Any page that wants an
   og:url must therefore restate the whole object; this helper is that object,
   stated once. */

const IMAGE = {
  url: "/share-card.png",
  width: 1200,
  height: 630,
  alt: "Sardauna by Safetyline — a house of agents for your business",
};

export function og(url: string) {
  return {
    type: "website" as const,
    siteName: "Safetyline",
    locale: "en_NG",
    url,
    images: [IMAGE],
  };
}
