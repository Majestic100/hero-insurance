import type { ChoiceOption } from "../types";

/**
 * Option lists used by several insurance types. Values are stored in the
 * answers, so never rename one.
 */

export const YES_NO = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nej" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];

export const CLAIM_FREE_YEARS = [
  { value: "0", label: "0 år" },
  { value: "1_2", label: "1-2 år" },
  { value: "3_5", label: "3-5 år" },
  { value: "6_plus", label: "6 år eller mere" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];

/** Who the insurance should cover (accident and health, travel). */
export const INSURED_PERSONS = [
  { value: "me", label: "Kun mig" },
  { value: "me_and_partner", label: "Mig og min partner" },
  { value: "family", label: "Hele familien med børn" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];

/** Danish plates: standard (AB12345) and personal plates, 2-7 characters. */
export const LICENSE_PLATE_PATTERN = "^[A-ZÆØÅ0-9]{2,7}$";
export const LICENSE_PLATE_MESSAGE =
  "Tjek nummerpladen. Den består af bogstaver og tal.";

export const ROOF_TYPES = [
  { value: "tiles", label: "Tegl" },
  { value: "fiber_cement", label: "Fibercement eller eternit" },
  { value: "thatch", label: "Strå" },
  { value: "felt", label: "Tagpap" },
  { value: "other", label: "Andet" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];
