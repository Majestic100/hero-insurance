import { checkBotId } from "botid/server";

import { DAR_ID_PATTERN } from "@/lib/integrations/address/address-search-parse";
import { lookupBuilding } from "@/lib/integrations/bbr/building";

/**
 * GET /api/bbr/<DAR address id> → { buildYear?, livingArea?, roofType? }
 *
 * Facts about the home on an address from BBR, so the form can fill them
 * in. 404 when BBR has no single home there (e.g. an apartment block), 503
 * when unavailable: the user then types the values. Protected by BotID
 * (see src/instrumentation-client.ts).
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/bbr/[id]">) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return Response.json({ error: "Forespørgslen blev afvist." }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (!DAR_ID_PATTERN.test(id)) {
    return Response.json({ error: "Ugyldig adresse." }, { status: 400 });
  }

  try {
    const facts = await lookupBuilding(id);
    if (!facts) {
      return Response.json({ error: "Ingen bolig fundet i BBR." }, { status: 404 });
    }
    return Response.json(facts, {
      headers: { "Cache-Control": "private, max-age=86400" },
    });
  } catch (error) {
    console.error(
      "[bbr] lookup failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json({ error: "Opslag ikke muligt lige nu." }, { status: 503 });
  }
}
