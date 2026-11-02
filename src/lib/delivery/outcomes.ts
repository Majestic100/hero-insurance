import { z } from "zod";

/**
 * What partners report back about a lead, and which reports are sent to
 * Meta as a sign of a good lead. Pure, so it is unit tested.
 *
 * Must match the `status` check constraint on `lead_outcomes`.
 *
 * TODO(owner): agree on the statuses with the partners, and choose which
 * event the campaigns optimize for, see docs/huskeliste.md.
 */
export const OUTCOME_STATUSES = [
  "contacted",
  "quoted",
  "sold",
  "not_interested",
  "unreachable",
  "invalid",
] as const;

export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

/**
 * Good outcomes and the custom Meta event each becomes. Meta only uses
 * events for optimizing ads within days of the click, so the early ones
 * (contacted, quoted) matter most. Bad outcomes are not sent.
 */
export const OUTCOME_META_EVENTS: Partial<Record<OutcomeStatus, string>> = {
  contacted: "LeadContacted",
  quoted: "LeadQuoted",
  sold: "LeadSold",
};

/** Meta rejects events with an event_time older than 7 days. */
export const META_MAX_EVENT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** The body of POST /api/partners/outcomes. */
export const outcomeRequestSchema = z.object({
  outcomes: z
    .array(
      z.object({
        lead_id: z.uuid(),
        status: z.enum(OUTCOME_STATUSES),
        /** When it happened; defaults to when we receive it. */
        occurred_at: z.iso.datetime({ offset: true }).optional(),
      }),
    )
    .min(1)
    .max(100),
});

export type OutcomeReport = z.infer<typeof outcomeRequestSchema>["outcomes"][number];

/** A report's time, never in the future (clocks differ). */
export function outcomeTime(report: OutcomeReport, now: Date): Date {
  if (!report.occurred_at) {
    return now;
  }
  const time = new Date(report.occurred_at);
  return time > now ? now : time;
}

/** Why an outcome is not sent to Meta, or null when it should be sent. */
export function metaSkipReason(
  status: string,
  occurredAt: Date,
  trackingConsent: boolean,
  now: Date,
): "not_sent" | "no_consent" | "too_old" | null {
  if (!OUTCOME_META_EVENTS[status as OutcomeStatus]) {
    return "not_sent";
  }
  if (!trackingConsent) {
    return "no_consent";
  }
  // A minute of margin, so an event is not rejected on its way to Meta.
  if (now.getTime() - occurredAt.getTime() > META_MAX_EVENT_AGE_MS - 60_000) {
    return "too_old";
  }
  return null;
}
