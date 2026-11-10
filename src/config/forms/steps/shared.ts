import type { AddressField, ChoiceOption, FieldConfig, TextField } from "../types";

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

/** How many children, when the whole family is covered (accident, travel). */
export function childrenCountField(dependsOn: string): FieldConfig {
  return {
    type: "single-choice",
    name: "childrenCount",
    label: "Hvor mange børn?",
    layout: "inline",
    options: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4_plus", label: "4+" },
    ],
    showIf: { field: dependsOn, equals: "family" },
  };
}

/** Danish plates: standard (AB12345) and personal plates, 2-7 characters. */
export const LICENSE_PLATE_PATTERN = "^[A-ZÆØÅ0-9]{2,7}$";
export const LICENSE_PLATE_MESSAGE =
  "Tjek nummerpladen. Den består af bogstaver og tal.";

/**
 * Roof types as Findforsikring asks (owner, 2026-11-10): the groups the
 * insurers price by. BBR's detailed roof material is mapped to these
 * (src/lib/integrations/bbr/building-parse.ts).
 */
export const ROOF_TYPES = [
  { value: "hard", label: "Hårdt tag", description: "Fx tegl, betontagsten, eternit, skifer eller metal" },
  { value: "flat", label: "Fladt tag", description: "Fx tagpap" },
  { value: "thatch", label: "Stråtag" },
  { value: "other", label: "Andet" },
  { value: "unknown", label: "Ved ikke" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];

/**
 * The address of the property, first in the property steps. Picking it
 * from the list fills in the BBR facts below it (see `autofill`).
 */
export function propertyAddressField(label: string): AddressField {
  return {
    type: "address",
    name: "address",
    label,
    description: "Vælg adressen på listen, så henter vi boligens data fra BBR.",
    placeholder: "Fx Strandvejen 12, 2900",
    noDraft: true,
  };
}

/**
 * Free text for anything the questions do not cover, shown under "Vis
 * flere detaljer". Partners read it, so we warn against health data
 * (GDPR art. 9).
 */
export function otherInfoField(): TextField {
  return {
    type: "text",
    name: "otherInfo",
    label: "Andre oplysninger til selskaberne",
    description: "Fx tidligere skader eller særlige ønsker. Skriv ikke om helbred.",
    placeholder: "Skriv her",
    multiline: true,
    maxLength: 500,
    optional: true,
    advanced: true,
  };
}
