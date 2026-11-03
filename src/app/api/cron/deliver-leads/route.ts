import { timingSafeEqual } from "node:crypto";

import { connection } from "next/server";

import { processDeliveries } from "@/lib/delivery/deliver";
import { sendPendingOutcomeEvents } from "@/lib/delivery/outcome-meta";
import { getCronSecret } from "@/lib/env/server";

/** Room for a batch of slow partner webhooks (10 s timeout each, in parallel). */
export const maxDuration = 60;

function authorized(header: string | null): boolean {
  const secret = getCronSecret();
  if (!secret || !header) {
    return false;
  }
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * GET /api/cron/deliver-leads
 *
 * Called by Vercel Cron (schedule in vercel.json) with
 * `Authorization: Bearer <CRON_SECRET>`. Retries the lead deliveries that
 * are due and sends pending partner outcomes to Meta. Deliveries are
 * normally sent right after the submit; this only catches the failures.
 * Answers with counts only.
 */
export async function GET(request: Request) {
  await connection();
  if (!authorized(request.headers.get("authorization"))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const deliveries = await processDeliveries({ maxRows: 50 });
  const outcomes = await sendPendingOutcomeEvents();
  return Response.json(
    { deliveries, outcomes },
    { headers: { "Cache-Control": "no-store" } },
  );
}
