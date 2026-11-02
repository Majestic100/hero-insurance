import { checkBotId } from "botid/server";

import { lookupCity } from "@/lib/integrations/address/postal-code";
import { POSTAL_CODE_PATTERN } from "@/lib/integrations/address/postal-code-parse";

/**
 * GET /api/postnummer/2100 → { "city": "København Ø" }
 *
 * Looks up the city for a Danish postal code in DAR (Datafordeler), so the
 * form can fill in "By". Protected by BotID like /api/leads (see
 * src/instrumentation-client.ts), so others cannot spend our Datafordeler
 * quota. 404 for unknown codes, 503 when the lookup is unavailable: the
 * user then simply types the city.
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/postnummer/[postnr]">) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return Response.json({ error: "Forespørgslen blev afvist." }, { status: 403 });
  }

  const { postnr } = await ctx.params;
  if (!POSTAL_CODE_PATTERN.test(postnr)) {
    return Response.json({ error: "Ugyldigt postnummer." }, { status: 400 });
  }

  try {
    const city = await lookupCity(postnr);
    if (!city) {
      return Response.json({ error: "Ukendt postnummer." }, { status: 404 });
    }
    return Response.json(
      { city },
      // The browser may reuse the answer; it does not change.
      { headers: { "Cache-Control": "private, max-age=86400" } },
    );
  } catch (error) {
    console.error(
      "[postnummer] lookup failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json({ error: "Opslag ikke muligt lige nu." }, { status: 503 });
  }
}
