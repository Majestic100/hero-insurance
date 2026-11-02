import { initBotId } from "botid/client/core";

import { rememberClickId } from "./lib/tracking/meta-ids";

// Keep a Meta click id (?fbclid=) in memory; it is only stored as a cookie
// once the user gives marketing consent (src/lib/tracking/meta-ids.ts).
rememberClickId();

/**
 * Vercel BotID: runs an invisible check in the browser and attaches its
 * result to requests to the protected routes. The server verifies it with
 * checkBotId() (see src/app/api/leads/route.ts). Every route listed here
 * must call checkBotId(), and every route that calls it must be listed.
 *
 * Loaded on Vercel and in `next dev` (where BotID lets everything through).
 * Not loaded in a production build outside Vercel, where it cannot work;
 * see NEXT_PUBLIC_BOTID_ENABLED in next.config.ts.
 */
if (
  process.env.NEXT_PUBLIC_BOTID_ENABLED === "true" ||
  process.env.NODE_ENV === "development"
) {
  initBotId({
    protect: [
      { path: "/api/leads", method: "POST" },
      { path: "/api/postnummer/*", method: "GET" },
    ],
  });
}
