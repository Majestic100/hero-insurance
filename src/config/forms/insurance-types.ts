/**
 * The insurance types we collect quotes for. The ids match the
 * `insurance_type` check constraint in the database
 * (supabase/migrations/20261031165735_create_lead_tables.sql).
 */
export const INSURANCE_TYPES = ["car", "home_contents", "house"] as const;

export type InsuranceType = (typeof INSURANCE_TYPES)[number];

export type InsuranceTypeInfo = {
  /** Danish name shown to users. */
  label: string;
  /** Short Danish description shown on cards. */
  description: string;
  /** Danish URL slug, used to preselect a type: /tilbud?forsikring=bil */
  slug: string;
};

export const INSURANCE_TYPE_INFO: Record<InsuranceType, InsuranceTypeInfo> = {
  car: {
    label: "Bilforsikring",
    description: "Ansvar og kasko til din bil",
    slug: "bil",
  },
  home_contents: {
    label: "Indboforsikring",
    description: "Dine ting derhjemme",
    slug: "indbo",
  },
  house: {
    label: "Husforsikring",
    description: "Selve bygningen, hvis du ejer et hus",
    slug: "hus",
  },
};

export function isInsuranceType(value: unknown): value is InsuranceType {
  return (
    typeof value === "string" &&
    (INSURANCE_TYPES as readonly string[]).includes(value)
  );
}

export function insuranceTypeFromSlug(slug: string): InsuranceType | undefined {
  return INSURANCE_TYPES.find((type) => INSURANCE_TYPE_INFO[type].slug === slug);
}
