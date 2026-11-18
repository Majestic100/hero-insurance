import type { MetadataRoute } from "next";

import { LANDING_PAGE_LIST } from "@/config/landing-pages";
import { SITE_URL } from "@/config/site";

/** Pages that are not landing pages, most important first. */
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/tilbud", priority: 0.9 },
  { path: "/om-os", priority: 0.5 },
  { path: "/partnere", priority: 0.4 },
  { path: "/bliv-partner", priority: 0.4 },
  { path: "/kontakt", priority: 0.4 },
  { path: "/privatlivspolitik", priority: 0.2 },
  { path: "/samtykke", priority: 0.2 },
  { path: "/cookiepolitik", priority: 0.2 },
  { path: "/betingelser", priority: 0.2 },
] as const;

/** All public pages. The thank-you page and the API are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    priority,
  }));
  const landing = LANDING_PAGE_LIST.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    priority: 0.8,
  }));
  return [...pages, ...landing];
}
