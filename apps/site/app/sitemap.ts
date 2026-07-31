import type { MetadataRoute } from "next";

const BASE = "https://safetyline.com.ng";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/product",
    "/use-cases",
    "/pricing",
    "/channels",
    "/security",
    "/customers",
    "/customers/ufms",
    "/customers/truckville",
    "/about",
    "/contact",
    "/farm-management-system-nigeria",
    "/food-business-operations-nigeria",
    "/membership-management-nigeria",
    "/ai-agent-for-business-nigeria",
    "/privacy",
    "/terms",
  ];
  /* lastModified was omitted, so crawlers had no signal about freshness and
     re-fetched on their own schedule. Build time is the honest value for a
     fully static site. */
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r.startsWith("/customers/") ? 0.6 : 0.8,
  }));
}
