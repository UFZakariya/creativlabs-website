import type { NextConfig } from "next";

/* Security response headers. The site shipped with none: it was framable by
   any origin, sent a full Referer cross-site, and let browsers sniff content
   types. Deliberately NOT adding a Content-Security-Policy here — the app
   ships inline styles (Tailwind v4, framer-motion transforms) and injects two
   legacy scripts, so a CSP has to be authored against a real page audit or it
   silently breaks the chat dock and the device showcase. */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
