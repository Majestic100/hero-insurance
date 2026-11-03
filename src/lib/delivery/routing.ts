import type { InsuranceType } from "@/config/forms/insurance-types";
import type { PartnerConfig } from "@/config/partners";

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
 * One delivery per partner that covers at least one of the selected
 * insurance types, with only those types (in the order they were selected).
 */
export function routeLead(
  partners: readonly PartnerConfig[],
  selectedTypes: readonly InsuranceType[],
): RoutedDelivery[] {
  return partners.flatMap((partner) => {
    const types = selectedTypes.filter((type) =>
      partner.insuranceTypes.includes(type),
    );
    return types.length > 0
      ? [{ partner_id: partner.id, insurance_types: types }]
      : [];
  });
}
