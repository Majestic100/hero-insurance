import "server-only";

import { getSupabaseServerClient } from "@/lib/db/server";
import { OUTCOME_META_EVENTS, outcomeTime, type OutcomeReport } from "./outcomes";

export type OutcomeResult = {
  lead_id: string;
  status: string;
  /** unknown_lead: no lead with this id was delivered to this partner. */
  result: "accepted" | "duplicate" | "unknown_lead";
};

/**
 * Saves what a partner reports. A partner can only report on leads it was
 * sent, and each status once per lead (repeats are answered "duplicate",
 * so partners can safely retry). Throws on database errors.
 */
export async function recordOutcomes(
  partnerId: string,
  reports: readonly OutcomeReport[],
  now: Date,
): Promise<OutcomeResult[]> {
  const supabase = getSupabaseServerClient();
  const leadIds = [...new Set(reports.map((report) => report.lead_id))];

  const { data: delivered, error } = await supabase
    .from("lead_deliveries")
    .select("lead_id")
    .eq("partner_id", partnerId)
    .in("lead_id", leadIds);
  if (error) {
    throw new Error(`recordOutcomes: loading deliveries failed (${error.code})`);
  }
  const known = new Set(delivered.map((row) => row.lead_id));

  const rows = new Map<string, {
    lead_id: string;
    partner_id: string;
    status: string;
    occurred_at: string;
    meta_status: string;
  }>();
  for (const report of reports) {
    const key = `${report.lead_id}:${report.status}`;
    if (known.has(report.lead_id) && !rows.has(key)) {
      rows.set(key, {
        lead_id: report.lead_id,
        partner_id: partnerId,
        status: report.status,
        occurred_at: outcomeTime(report, now).toISOString(),
        meta_status: OUTCOME_META_EVENTS[report.status] ? "pending" : "not_sent",
      });
    }
  }

  const inserted = new Set<string>();
  if (rows.size > 0) {
    const { data, error: insertError } = await supabase
      .from("lead_outcomes")
      .upsert([...rows.values()], {
        onConflict: "lead_id,partner_id,status",
        ignoreDuplicates: true,
      })
      .select("lead_id, status");
    if (insertError) {
      throw new Error(`recordOutcomes: saving failed (${insertError.code})`);
    }
    for (const row of data) {
      inserted.add(`${row.lead_id}:${row.status}`);
    }
  }

  return reports.map((report) => {
    const key = `${report.lead_id}:${report.status}`;
    const result = !known.has(report.lead_id)
      ? "unknown_lead"
      : inserted.delete(key)
        ? "accepted"
        : "duplicate";
    return { lead_id: report.lead_id, status: report.status, result };
  });
}
