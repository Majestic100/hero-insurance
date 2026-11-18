import type { MetadataRoute } from "next";

import { IS_INDEXABLE, SITE_URL } from "@/config/site";

/**
 * Production lets search engines in, except the API and the thank-you page.
 * Every other environment (the test address, local builds) keeps them out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/tilbud/tak"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
