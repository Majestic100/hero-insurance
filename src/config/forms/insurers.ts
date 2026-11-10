import type { ChoiceOption, SelectField } from "./types";

/**
 * Danish insurers offered in "Nuværende selskab". Values are stored in the
 * answers, so never rename one; add new ones and keep "other" and "none"
 * last. The list follows the insurers Findforsikring offers (2026-11-10),
 * alphabetical; Codan and Topdanmark stay, as many still know their policy
 * by that name. TODO(owner): review against the partners' list.
 */
export const INSURER_OPTIONS = [
  { value: "abc", label: "ABC Forsikring" },
  { value: "alka", label: "Alka" },
  { value: "alm_brand", label: "Alm. Brand" },
  { value: "aros", label: "Aros Forsikring" },
  { value: "bauta", label: "Bauta" },
  { value: "certus", label: "Certus Forsikring" },
  { value: "codan", label: "Codan" },
  { value: "coop", label: "Coop Forsikring" },
  { value: "dansk_boligforsikring", label: "Dansk Boligforsikring" },
  { value: "dfa", label: "Dansk Forsikrings Agentur (DFA)" },
  { value: "danske_forsikring", label: "Danske Forsikring" },
  { value: "diba", label: "DiBa Forsikring" },
  { value: "dit_forsikringshus", label: "Dit Forsikringshus" },
  { value: "easysure", label: "easySure" },
  { value: "fdm", label: "FDM Forsikring" },
  { value: "fomo", label: "FOMO Forsikring" },
  { value: "vendsyssel", label: "Forsikringsselskabet Vendsyssel" },
  { value: "gavmild", label: "Gavmild" },
  { value: "gf", label: "GF Forsikring" },
  { value: "gjensidige", label: "Gjensidige" },
  { value: "global", label: "Global Forsikring" },
  { value: "hedvig", label: "Hedvig" },
  { value: "ida", label: "IDA Forsikring" },
  { value: "if", label: "If" },
  { value: "jysk_lokal", label: "Jysk Lokal Forsikring" },
  { value: "kommuneforsikring", label: "Kommuneforsikring" },
  { value: "kobstaedernes", label: "Købstædernes Forsikring" },
  { value: "lb", label: "LB Forsikring (Lærerstandens Brandforsikring)" },
  { value: "lokal", label: "Lokal Forsikring" },
  { value: "mondo", label: "Mondo Forsikring" },
  { value: "mondux", label: "Mondux" },
  { value: "nem", label: "NEM Forsikring" },
  { value: "nordjylland", label: "Nordjylland Forsikring" },
  { value: "nykredit", label: "Nykredit Forsikring" },
  { value: "ok", label: "OK Forsikring" },
  { value: "pensam", label: "PenSam" },
  { value: "privatsikring", label: "Privatsikring" },
  { value: "prosam", label: "Prosam" },
  { value: "runa", label: "Runa Forsikring" },
  { value: "storstroem", label: "Storstrøms Forsikring" },
  { value: "soenderjysk", label: "Sønderjysk Forsikring" },
  { value: "tjm", label: "TJM Forsikring" },
  { value: "topdanmark", label: "Topdanmark" },
  { value: "trekroner", label: "Trekroner Forsikring" },
  { value: "tryg", label: "Tryg" },
  { value: "vardia", label: "Vardia" },
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
