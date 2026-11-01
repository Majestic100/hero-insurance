import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  env: {
    // Vercel BotID only works on Vercel (VERCEL=1 during its builds). A
    // production build run elsewhere (next start in CI and e2e tests) must
    // not load the BotID client, or every protected request fails.
    NEXT_PUBLIC_BOTID_ENABLED: process.env.VERCEL === "1" ? "true" : "false",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
