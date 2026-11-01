/**
 * The insurance types we collect quotes for, in the order they are shown.
 * The ids are stored in the database and must match the `insurance_type`
 * check constraint (supabase/migrations). Never rename an id; add a
 * migration when adding one.
 */
export const INSURANCE_TYPES = [
  "car",
  "home_contents",
  "house",
  "accident_health",
  "travel",
  "holiday_home",
  "motorcycle_atv_moped",
  "boat",
  "caravan",
  "pet",
  "life",
  "change_of_ownership",
] as const;

export type InsuranceType = (typeof INSURANCE_TYPES)[number];

export type InsuranceTypeInfo = {
  /** Full Danish name, used as step title and in summaries. */
  label: string;
  /** Short Danish name for tiles. */
  shortLabel: string;
  /**
   * Danish URL slug: preselects the type (/tilbud?forsikring=bil) and is
   * the id of its step (?trin=bil). ASCII only.
   */
  slug: string;
};

export const INSURANCE_TYPE_INFO: Record<InsuranceType, InsuranceTypeInfo> = {
  car: { label: "Bilforsikring", shortLabel: "Bil", slug: "bil" },
  home_contents: {
    label: "Indboforsikring",
    shortLabel: "Indbo",
    slug: "indbo",
  },
  house: { label: "Husforsikring", shortLabel: "Hus", slug: "hus" },
  accident_health: {
    label: "Ulykkes- og sundhedsforsikring",
    shortLabel: "Ulykke og sundhed",
    slug: "ulykke-sundhed",
  },
  travel: { label: "Rejseforsikring", shortLabel: "Rejse", slug: "rejse" },
  holiday_home: {
    label: "Fritidshusforsikring",
    shortLabel: "Fritidshus",
    slug: "fritidshus",
  },
  motorcycle_atv_moped: {
    label: "Forsikring til MC, ATV og knallert",
    shortLabel: "MC, ATV og knallert",
    slug: "mc-atv-knallert",
  },
  boat: { label: "Bådforsikring", shortLabel: "Båd", slug: "baad" },
  caravan: {
    label: "Campingforsikring",
    shortLabel: "Camping",
    slug: "camping",
  },
  pet: { label: "Dyreforsikring", shortLabel: "Dyr", slug: "dyr" },
  life: { label: "Livsforsikring", shortLabel: "Liv", slug: "liv" },
  change_of_ownership: {
    label: "Ejerskifteforsikring",
    shortLabel: "Ejerskifte",
    slug: "ejerskifte",
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
