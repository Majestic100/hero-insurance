import "server-only";

import { getSupabaseServerClient } from "@/lib/db/server";
import { getGhlWebhookUrl } from "@/lib/env/server";
import { buildGhlContactPayload } from "./payload";

const TIMEOUT_MS = 10_000;
/** Leads older than this are not sent anymore: the follow-up would be late. */
const MAX_AGE_DAYS = 7;

export type GhlSyncResult = {
  status: "not_configured" | "done";
  sent: number;
  failed: number;
};

/**
 * Sends leads that have not reached GoHighLevel yet to the GHL inbound
 * webhook, which starts the follow-up workflow. Called right after a lead
 * is saved (for that lead) and by the daily cron (retries). Marks each
 * sent lead with `ghl_synced_at`. Never throws; logs no personal data.
 */
export async function syncLeadsToGhl(
  options: { leadId?: string; maxRows?: number } = {},
): Promise<GhlSyncResult> {
  const url = getGhlWebhookUrl();
  if (!url) {
    return { status: "not_configured", sent: 0, failed: 0 };
  }
  const supabase = getSupabaseServerClient();
  const since = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("leads")
    .select(
      "id, created_at, first_name, last_name, email, phone, " +
        "lead_insurances (insurance_type), consents (consent_type, granted)",
    )
    .is("ghl_synced_at", null)
    .is("answers_purged_at", null)
    .gte("created_at", since)
    .order("created_at")
    .limit(options.maxRows ?? 50);
  if (options.leadId) {
    query = query.eq("id", options.leadId);
  }
  const { data, error } = await query;
  if (error) {
    console.error("[ghl] loading leads failed:", error.code);
    return { status: "done", sent: 0, failed: 0 };
  }

  type Row = {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    lead_insurances: { insurance_type: string }[];
    consents: { consent_type: string; granted: boolean }[];
  };
  let sent = 0;
  let failed = 0;
  for (const lead of (data ?? []) as unknown as Row[]) {
    const payload = buildGhlContactPayload({
      ...lead,
      insurance_types: lead.lead_insurances.map((row) => row.insurance_type),
      marketing_consent: lead.consents.some(
        (row) => row.consent_type === "marketing" && row.granted,
      ),
    });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      await supabase
        .from("leads")
        .update({ ghl_synced_at: new Date().toISOString() })
        .eq("id", lead.id);
      sent++;
    } catch (cause) {
      failed++;
      console.error("[ghl] sending a lead failed:", cause instanceof Error ? cause.message : "unknown");
    }
  }
  return { status: "done", sent, failed };
}
