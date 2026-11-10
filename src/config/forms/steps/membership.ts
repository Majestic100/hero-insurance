import type { ChoiceOption } from "../types";

/**
 * Unions and associations for insurers' member discounts (Findforsikring
 * asks the same). Membership of a TRADE UNION is special category data
 * (GDPR art. 9): it is only kept with the separate, explicit consent
 * "consentMembership" (src/config/forms/consents.ts), which the form shows
 * as soon as a union is picked.
 */
export const UNION_OPTIONS = [
  { value: "3f", label: "3F" },
  { value: "blik_roer", label: "Blik- og Rørarbejderforbundet" },
  { value: "bupl", label: "BUPL" },
  { value: "dlf", label: "Danmarks Lærerforening" },
  { value: "el_forbund", label: "Dansk El-Forbund" },
  { value: "dm", label: "Dansk Magisterforening" },
  { value: "metal", label: "Dansk Metal" },
  { value: "djoef", label: "Djøf" },
  { value: "foa", label: "FOA" },
  { value: "hk", label: "HK" },
  { value: "ida", label: "IDA" },
  { value: "krifa", label: "Krifa" },
  { value: "lederne", label: "Lederne" },
  { value: "other_union", label: "Anden fagforening" },
] as const satisfies readonly ChoiceOption[];

/** Not trade unions: no special consent needed. */
export const ASSOCIATION_OPTIONS = [
  { value: "fdm", label: "FDM" },
  { value: "aeldresagen", label: "Ældresagen" },
  { value: "other_association", label: "Anden forening" },
] as const satisfies readonly ChoiceOption[];

export const UNION_VALUES: readonly string[] = UNION_OPTIONS.map((option) => option.value);

export const MEMBERSHIP_OPTIONS = [
  { value: "none", label: "Nej" },
  ...UNION_OPTIONS,
  ...ASSOCIATION_OPTIONS,
] as [ChoiceOption, ...ChoiceOption[]];
