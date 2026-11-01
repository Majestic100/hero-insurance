import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { YES_NO } from "./shared";

export const petFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "animal",
    label: "Hvilket dyr skal forsikres?",
    layout: "grid",
    options: [
      { value: "dog", label: "Hund" },
      { value: "cat", label: "Kat" },
      { value: "horse", label: "Hest" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "text",
    name: "breed",
    label: "Race",
    description: "Skriv \"blanding\", hvis dyret ikke har en bestemt race.",
    placeholder: "Fx Labrador",
    maxLength: 60,
  },
  {
    type: "year",
    name: "birthYear",
    label: "Dyrets fødselsår",
    placeholder: "Fx 2022",
    minYear: 1990,
  },
  {
    type: "multi-choice",
    name: "coverageTypes",
    label: "Hvad vil du have dækket?",
    description: "Du kan vælge flere.",
    options: [
      { value: "illness", label: "Sygdom og dyrlæge" },
      { value: "life", label: "Livsforsikring", description: "Udbetaling, hvis dyret dør" },
    ],
    minSelected: 1,
    minSelectedMessage: "Vælg mindst én dækning.",
  },
  {
    type: "single-choice",
    name: "liability",
    label: "Vil du også have tilbud på ansvarsforsikring?",
    description: "Dækker skader, dyret gør på andre. For hunde er den lovpligtig.",
    layout: "grid",
    options: YES_NO,
    showIf: { field: "animal", equals: ["dog", "horse"] },
  },
  currentInsurerField(),
];
