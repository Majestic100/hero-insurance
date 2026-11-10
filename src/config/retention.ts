/**
 * How long we keep leads, as promised in the privacy policy (which reads
 * these values). Enforced daily by the database function `purge_old_leads`
 * (supabase/migrations/20261110150000_lead_retention.sql), called from the
 * cron job.
 *
 * TODO(owner): confirm with the lawyer, see docs/huskeliste.md.
 */
export const RETENTION = {
  /** The request (answers, address, birth year, RKI, Meta ids) is deleted. */
  answersMonths: 12,
  /** Name, e-mail, phone and the consents (proof) are deleted too. */
  consentProofYears: 5,
} as const;
