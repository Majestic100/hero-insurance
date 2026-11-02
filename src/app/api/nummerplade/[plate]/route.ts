import { checkBotId } from "botid/server";

import { lookupVehicle } from "@/lib/integrations/license-plate/motorapi";
import { describeVehicle, normalizePlate } from "@/lib/integrations/license-plate/vehicle-parse";

/**
 * GET /api/nummerplade/AB12345 → { "description": "Toyota Yaris 1.0 (2018)" }
 *
 * Shows the user which vehicle a plate belongs to, so typos are caught.
 * Only the description reaches the browser; the full vehicle data is
 * looked up again on the server when the lead is saved. 404 for unknown
 * plates, 503 when unavailable (the form works without it). Protected by
 * BotID (see src/instrumentation-client.ts).
 */
export async function GET(_request: Request, ctx: RouteContext<"/api/nummerplade/[plate]">) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return Response.json({ error: "Forespørgslen blev afvist." }, { status: 403 });
  }

  const plate = normalizePlate(decodeURIComponent((await ctx.params).plate));
  if (!plate) {
    return Response.json({ error: "Ugyldig nummerplade." }, { status: 400 });
  }

  try {
    const vehicle = await lookupVehicle(plate);
    if (!vehicle) {
      return Response.json({ error: "Ukendt nummerplade." }, { status: 404 });
    }
    return Response.json(
      { description: describeVehicle(vehicle) },
      { headers: { "Cache-Control": "private, max-age=86400" } },
    );
  } catch (error) {
    console.error(
      "[nummerplade] lookup failed:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json({ error: "Opslag ikke muligt lige nu." }, { status: 503 });
  }
}
