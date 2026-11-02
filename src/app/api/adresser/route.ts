import { checkBotId } from "botid/server";
import { connection, type NextRequest } from "next/server";

import { searchAddresses } from "@/lib/integrations/address/address-search";

/**
 * GET /api/adresser?q=Strandvejen 10 → { "suggestions": [{ id, text }] }
 *
 * Address suggestions from DAR (Datafordeler) while the user types. The id
 * is used for the BBR lookup (/api/bbr/[id]). Protected by BotID (see
 * src/instrumentation-client.ts). 503 when unavailable: the user can still
 * type the address by hand.
 */
export async function GET(request: NextRequest) {
  // Per request, never prerendered at build time (Cache Components).
  await connection();
  const verification = await checkBotId();
  if (verification.isBot) {
    return Response.json({ error: "Forespørgslen blev afvist." }, { status: 403 });
  }

  const query = request.nextUrl.searchParams.get("q") ?? "";
  try {
    const suggestions = await searchAddresses(query);
    return Response.json(
      { suggestions },
      { headers: { "Cache-Control": "private, max-age=3600" } },
    );
  } catch (error) {
    console.error(
      "[adresser] search failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json({ error: "Søgning ikke mulig lige nu." }, { status: 503 });
  }
}
