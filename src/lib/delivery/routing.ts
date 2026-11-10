import type { InsuranceType } from "@/config/forms/insurance-types";
import { MAX_PARTNERS_PER_LEAD, type PartnerConfig } from "@/config/partners";

/**
 * Decides which partners get a lead. Pure, so it is unit tested.
 */

export type RoutedDelivery = {
  partner_id: string;
  insurance_types: InsuranceType[];
};

/** Partner ids must fit the `partner_id` check constraint in the database. */
export const PARTNER_ID_PATTERN = /^[a-z][a-z0-9_]{1,49}$/;

/**
 * Up to `max` partners get the lead, each with only the selected types it
 * covers (in the order they were selected). Partners are taken in priority
 * order (their order in the list), but first so that every selected type
 * is covered by someone if possible, then filled up to `max`.
 */
export function routeLead(
  partners: readonly PartnerConfig[],
  selectedTypes: readonly InsuranceType[],
  max: number = MAX_PARTNERS_PER_LEAD,
): RoutedDelivery[] {
  const covering = partners
    .map((partner) => ({
      partner,
      types: selectedTypes.filter((type) => partner.insuranceTypes.includes(type)),
    }))
    .filter((candidate) => candidate.types.length > 0);

  const chosen = new Set<string>();
  const covered = new Set<InsuranceType>();
  // 1. Cover every selected type, by priority.
  for (const candidate of covering) {
    if (chosen.size >= max) break;
    if (candidate.types.some((type) => !covered.has(type))) {
      chosen.add(candidate.partner.id);
      candidate.types.forEach((type) => covered.add(type));
    }
  }
  // 2. Fill the remaining places, by priority.
  for (const candidate of covering) {
    if (chosen.size >= max) break;
    chosen.add(candidate.partner.id);
  }

  return covering
    .filter((candidate) => chosen.has(candidate.partner.id))
    .map((candidate) => ({ partner_id: candidate.partner.id, insurance_types: candidate.types }));
}
