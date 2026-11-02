import "server-only";

import { PARTNERS } from "@/config/partners";
import { getSupabaseServerClient } from "@/lib/db/server";
import type { Database } from "@/lib/db/types";
import { getPartnerWebhookEnv } from "@/lib/env/server";
import { buildDeliveryPayload, type StoredLead } from "./payload";
import { nextRetryAt } from "./retry";
import { postToWebhook, type WebhookResult } from "./webhook";

type DeliveryRow = Database["public"]["Tables"]["lead_deliveries"]["Row"];

/** Longer than a webhook timeout, so a live attempt is never claimed twice. */
const LEASE_SECONDS = 60;

const LEAD_COLUMNS =
  "id, created_at, first_name, last_name, email, phone, street_address, " +
  "postal_code, city, birth_year, " +
  "lead_insurances (insurance_type, answers, form_version), " +
  "consents (consent_type, granted, consent_text, consent_version, recorded_at)";

export type ProcessResult = {
  claimed: number;
  sent: number;
  retrying: number;
  failed: number;
};

/**
 * Sends the deliveries that are due: right after a submit (one lead) and
 * from the cron job (everything due). Claiming is atomic in the database,
 * so overlapping runs never send the same delivery at the same time. A
 * sender that dies mid-way leaves a lease that expires, and the delivery is
 * retried; partners ignore repeats by the delivery id.
 *
 * Never throws. Logs ids, partner ids and error codes only.
 */
export async function processDeliveries(
  options: { leadId?: string; maxRows?: number } = {},
): Promise<ProcessResult> {
  const result: ProcessResult = { claimed: 0, sent: 0, retrying: 0, failed: 0 };
  try {
    const supabase = getSupabaseServerClient();
    const { data: claimed, error } = await supabase.rpc("claim_lead_deliveries", {
      max_rows: options.maxRows ?? 25,
      lease_seconds: LEASE_SECONDS,
      only_lead: options.leadId,
    });
    if (error) {
      console.error("[delivery] claim failed:", error.code, error.message);
      return result;
    }
    result.claimed = claimed.length;
    if (claimed.length === 0) {
      return result;
    }

    const leadIds = [...new Set(claimed.map((delivery) => delivery.lead_id))];
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select(LEAD_COLUMNS)
      .in("id", leadIds)
      .overrideTypes<StoredLead[], { merge: false }>();
    if (leadsError) {
      // The claimed rows keep their lease and are retried when it expires.
      console.error("[delivery] loading leads failed:", leadsError.code);
      return result;
    }
    const leadsById = new Map(leads.map((lead) => [lead.id, lead]));

    const outcomes = await Promise.all(
      claimed.map((delivery) => deliverOne(delivery, leadsById.get(delivery.lead_id))),
    );
    for (const outcome of outcomes) {
      result[outcome] += 1;
    }
  } catch (error) {
    console.error(
      "[delivery] run failed:",
      error instanceof Error ? error.message : "unknown",
    );
  }
  return result;
}

async function deliverOne(
  delivery: DeliveryRow,
  lead: StoredLead | undefined,
): Promise<"sent" | "retrying" | "failed"> {
  const supabase = getSupabaseServerClient();
  const attempt = await attemptDelivery(delivery, lead);
  const now = new Date();

  if (attempt.ok) {
    const { error } = await supabase
      .from("lead_deliveries")
      .update({
        status: "sent",
        sent_at: now.toISOString(),
        partner_reference: attempt.reference ?? null,
        last_error: null,
      })
      .eq("id", delivery.id);
    if (error) {
      // Delivered, but the lease will expire and it is sent once more.
      console.error("[delivery] marking sent failed:", delivery.id, error.code);
    }
    return "sent";
  }

  const retryAt = nextRetryAt(delivery.attempts, now);
  const { error } = await supabase
    .from("lead_deliveries")
    .update({
      status: retryAt ? "pending" : "failed",
      next_attempt_at: (retryAt ?? now).toISOString(),
      last_error: attempt.error,
    })
    .eq("id", delivery.id);
  if (error) {
    console.error("[delivery] marking failure failed:", delivery.id, error.code);
  }
  if (retryAt) {
    console.warn(
      "[delivery] attempt failed, will retry:",
      delivery.id,
      delivery.partner_id,
      attempt.error,
    );
    return "retrying";
  }
  console.error("[delivery] gave up:", delivery.id, delivery.partner_id, attempt.error);
  return "failed";
}

async function attemptDelivery(
  delivery: DeliveryRow,
  lead: StoredLead | undefined,
): Promise<WebhookResult> {
  if (!PARTNERS.some((partner) => partner.id === delivery.partner_id)) {
    return { ok: false, error: "unknown_partner" };
  }
  const webhook = getPartnerWebhookEnv(delivery.partner_id);
  if (!webhook) {
    return { ok: false, error: "not_configured" };
  }
  if (!lead) {
    return { ok: false, error: "lead_not_found" };
  }
  let body: string;
  try {
    body = JSON.stringify(
      buildDeliveryPayload(delivery.id, delivery.insurance_types, lead),
    );
  } catch {
    return { ok: false, error: "no_partner_consent" };
  }
  return postToWebhook(webhook, delivery.id, body);
}
