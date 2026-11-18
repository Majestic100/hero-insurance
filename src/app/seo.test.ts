import { afterEach, describe, expect, it, vi } from "vitest";

import { LANDING_PAGE_LIST } from "@/config/landing-pages";

/** robots.ts and sitemap.ts read VERCEL_ENV at import, so import fresh. */
async function load(vercelEnv: string | undefined) {
  vi.resetModules();
  vi.stubEnv("VERCEL_ENV", vercelEnv);
  const robots = (await import("./robots")).default;
  const sitemap = (await import("./sitemap")).default;
  return { robots: robots(), sitemap: sitemap() };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots.txt", () => {
  it("keeps search engines out of the test address and local builds", async () => {
    for (const env of [undefined, "preview", "development"]) {
      const { robots } = await load(env);
      expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
      expect(robots.sitemap).toBeUndefined();
    }
  });

  it("lets them into production, except the API and the thank-you page", async () => {
    const { robots } = await load("production");
    expect(robots.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/tilbud/tak"],
    });
    expect(robots.sitemap).toMatch(/^https:\/\/[^/]+\/sitemap\.xml$/);
  });
});

describe("sitemap.xml", () => {
  it("lists the homepage, the form and every landing page, once each", async () => {
    const { sitemap } = await load("production");
    const paths = sitemap.map((entry) => new URL(entry.url).pathname);
    expect(paths).toContain("/");
    expect(paths).toContain("/tilbud");
    for (const page of LANDING_PAGE_LIST) {
      expect(paths).toContain(page.path);
    }
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("leaves out the thank-you page and the API", async () => {
    const { sitemap } = await load("production");
    for (const entry of sitemap) {
      expect(entry.url).not.toMatch(/\/tilbud\/tak|\/api\//);
    }
  });
});
