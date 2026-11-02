/**
 * Funnel and conversion events. They only reach Meta when the pixel is
 * loaded, i.e. with marketing consent and a configured pixel id; otherwise
 * they do nothing. Client only.
 *
 * The Lead event uses the submission id as event id, and the server sends
 * the same event with the same id (Conversions API), so Meta counts it once.
 */

/** A step of the quote form was shown (funnel: where do people drop off?). */
export function trackStepViewed(stepId: string, stepNumber: number) {
  window.fbq?.("trackCustom", "QuoteStepViewed", {
    step: stepId,
    step_number: stepNumber,
  });
}

/** A lead was saved. */
export function trackLead(eventId: string, insuranceTypes: readonly string[]) {
  window.fbq?.(
    "track",
    "Lead",
    { content_category: insuranceTypes.join(",") },
    { eventID: eventId },
  );
}
