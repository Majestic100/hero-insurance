import type { ChoiceOption, SelectField } from "./types";

/**
 * Danish insurers offered in "Nuværende selskab". Values are stored in the
 * answers, so never rename one; add new ones and keep "other" and "none"
 * last. TODO(owner): review against the partners' list before launch.
 */
export const INSURER_OPTIONS = [
  { value: "alm_brand", label: "Alm. Brand" },
  { value: "codan", label: "Codan" },
  { value: "gf", label: "GF Forsikring" },
  { value: "gjensidige", label: "Gjensidige" },
  { value: "if", label: "If" },
  { value: "lb", label: "LB Forsikring" },
  { value: "kobstaedernes", label: "Købstædernes Forsikring" },
  { value: "privatsikring", label: "Privatsikring" },
  { value: "runa", label: "Runa Forsikring" },
  { value: "topdanmark", label: "Topdanmark" },
  { value: "tryg", label: "Tryg" },
  { value: "other", label: "Andet selskab" },
  { value: "none", label: "Har ingen forsikring i dag" },
] as const satisfies readonly [ChoiceOption, ...ChoiceOption[]];

/** The optional "Nuværende selskab" field, shared by every insurance type. */
export function currentInsurerField(): SelectField {
  return {
    type: "select",
    name: "currentInsurer",
    label: "Nuværende selskab",
    optional: true,
    placeholder: "Vælg selskab",
    options: INSURER_OPTIONS,
  };
}
