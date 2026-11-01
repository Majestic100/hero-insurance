import { initBotId } from "botid/client/core";

/**
 * Vercel BotID: runs an invisible check in the browser and attaches its
 * result to requests to the protected routes. The server verifies it with
 * checkBotId() (see src/app/api/leads/route.ts). Every route listed here
 * must call checkBotId(), and every route that calls it must be listed.
 */
initBotId({
  protect: [{ path: "/api/leads", method: "POST" }],
});
