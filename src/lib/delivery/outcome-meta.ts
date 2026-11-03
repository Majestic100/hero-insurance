import "server-only";

import { getSupabaseServerClient } from "@/lib/db/server";
import { postMetaEvents } from "@/lib/tracking/meta-capi";
import { buildMetaOutcomeEvent } from "@/lib/tracking/meta-event";
import { metaSkipReason, OUTCOME_META_EVENTS, type OutcomeStatus } from "./outcomes";

type PendingOutcome = {
  id: string;
  status: string;
  occurred_at: string;
  leads: {
    submission_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    postal_code: string | null;
    city: string | null;
    tracking_consent: boolean;
    fbc: string | null;
    fbp: string | null;
  };
};

export type OutcomeMetaResult = { sent: number; skipped: number; waiting: number };

/**
 * Sends good partner outcomes to Meta as events for the same lead (the
 * owner requirement "lead quality back to Meta" in CLAUDE.md). Only with
 * the user's tracking consent, and only within Meta's 7 days. Each outcome
 * ends as sent or with the reason it was not; when Meta does not answer
 * (or is not configured) it stays pending and the cron job tries again.
 *
 * Never throws. Logs no personal data.
 */
export async function sendPendingOutcomeEvents(limit = 100): Promise<OutcomeMetaResult> {
  const result: OutcomeMetaResult = { sent: 0, skipped: 0, waiting: 0 };
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("lead_outcomes")
      .select(
        "id, status, occurred_at, leads (submission_id, email, phone, first_name, " +
          "last_name, postal_code, city, tracking_consent, fbc, fbp)",
      )
      .eq("meta_status", "pending")
      .order("occurred_at")
      .limit(limit)
      .overrideTypes<PendingOutcome[], { merge: false }>();
    if (error) {
      console.error("[outcomes] loading pending Meta events failed:", error.code);
      return result;
    }

    const now = new Date();
    const skipped = new Map<string, string[]>();
    const toSend: PendingOutcome[] = [];
    for (const outcome of data) {
      const reason = metaSkipReason(
        outcome.status,
        new Date(outcome.occurred_at),
        outcome.leads.tracking_consent,
        now,
      );
      if (reason) {
        skipped.set(reason, [...(skipped.get(reason) ?? []), outcome.id]);
      } else {
        toSend.push(outcome);
      }
    }

    for (const [reason, ids] of skipped) {
      await setMetaStatus(ids, { meta_status: reason });
      result.skipped += ids.length;
    }
    if (toSend.length === 0) {
      return result;
    }

    const sendResult = await postMetaEvents(
      toSend.map((outcome) =>
        buildMetaOutcomeEvent({
          eventName: OUTCOME_META_EVENTS[outcome.status as OutcomeStatus] ?? "",
          status: outcome.status,
          occurredAt: new Date(outcome.occurred_at),
          submissionId: outcome.leads.submission_id,
          email: outcome.leads.email,
          phone: outcome.leads.phone,
          firstName: outcome.leads.first_name,
          lastName: outcome.leads.last_name,
          postalCode: outcome.leads.postal_code ?? "",
          city: outcome.leads.city ?? "",
          fbc: outcome.leads.fbc,
          fbp: outcome.leads.fbp,
        }),
      ),
    );
    const ids = toSend.map((outcome) => outcome.id);
    if (sendResult === "ok") {
      await setMetaStatus(ids, { meta_status: "sent", meta_sent_at: now.toISOString() });
      result.sent = ids.length;
    } else if (sendResult === "rejected") {
      await setMetaStatus(ids, { meta_status: "error" });
      result.skipped += ids.length;
    } else {
      result.waiting = ids.length;
    }
  } catch (error) {
    console.error(
      "[outcomes] sending Meta events failed:",
      error instanceof Error ? error.message : "unknown",
    );
  }
  return result;
}

async function setMetaStatus(
  ids: string[],
  values: { meta_status: string; meta_sent_at?: string },
) {
  const { error } = await getSupabaseServerClient()
    .from("lead_outcomes")
    .update(values)
    .in("id", ids);
  if (error) {
    console.error("[outcomes] updating Meta status failed:", error.code);
  }
}
