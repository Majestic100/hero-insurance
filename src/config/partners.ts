import type { InsuranceType } from "./forms/insurance-types";

/**
 * The insurance partners that receive leads, and which insurance types each
 * one gets. A lead is routed when it is submitted: every partner here that
 * covers at least one of the selected types gets one delivery with those
 * types (table `lead_deliveries`).
 *
 * Secrets are not here but in env vars, per partner and environment (see
 * `getPartnerWebhookEnv` in src/lib/env/server.ts):
 *   PARTNER_<ID>_WEBHOOK_URL     where we POST the lead (https)
 *   PARTNER_<ID>_WEBHOOK_SECRET  signs each delivery (HMAC-SHA256)
 *   PARTNER_<ID>_API_KEY         the partner's key for reporting outcomes
 * Set them for Production only (or point Preview at the partner's test
 * endpoint), so test leads never reach a partner.
 *
 * TODO(owner): empty until the partner agreements are in place, see
 * docs/huskeliste.md. The partner consent text in
 * src/config/forms/consents.ts must name these recipients (or a clear
 * category) before a partner is added here.
 */

export type PartnerConfig = {
  /**
   * Stored in `lead_deliveries.partner_id` and used in the env var names
   * (uppercased). Lowercase letters, digits and underscores. Never rename.
   */
  id: string;
  /** Display name, e.g. in the privacy policy. */
  name: string;
  insuranceTypes: readonly InsuranceType[];
};

export const PARTNERS: readonly PartnerConfig[] = [];
