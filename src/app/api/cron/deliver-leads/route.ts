import { timingSafeEqual } from "node:crypto";

import { connection } from "next/server";

import { processDeliveries } from "@/lib/delivery/deliver";
import { sendPendingOutcomeEvents } from "@/lib/delivery/outcome-meta";
import { syncLeadsToGhl } from "@/lib/integrations/ghl/sync";
import { purgeOldLeads, type RetentionResult } from "@/lib/leads/retention";
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
 * are due, sends pending partner outcomes to Meta, sends leads that did
 * not reach GoHighLevel (follow-up survey), and deletes old lead
 * data (retention, see src/config/retention.ts). Deliveries are normally
 * sent right after the submit; this only catches the failures. Answers
 * with counts only.
 */
export async function GET(request: Request) {
  await connection();
  if (!authorized(request.headers.get("authorization"))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const deliveries = await processDeliveries({ maxRows: 50 });
  const outcomes = await sendPendingOutcomeEvents();
  // Leads that did not reach GoHighLevel right after the submit.
  const ghl = await syncLeadsToGhl({ maxRows: 50 });
  // Retention must not block deliveries, and a failure must be visible.
  let retention: RetentionResult | { error: string };
  try {
    retention = await purgeOldLeads();
  } catch (error) {
    console.error("[cron] retention failed:", error instanceof Error ? error.message : "unknown");
    retention = { error: "retention_failed" };
  }
  return Response.json(
    { deliveries, outcomes, ghl, retention },
    { headers: { "Cache-Control": "no-store" } },
  );
}
