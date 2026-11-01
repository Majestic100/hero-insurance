import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";

export const homeContentsFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "residenceType",
    label: "Hvor bor du?",
    layout: "grid",
    options: [
      { value: "apartment", label: "Lejlighed" },
      { value: "terraced_house", label: "Rækkehus" },
      { value: "detached_house", label: "Villa eller parcelhus" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "single-choice",
    name: "tenure",
    label: "Ejer eller lejer du?",
    options: [
      { value: "owner", label: "Ejer" },
      { value: "tenant", label: "Lejer" },
      { value: "cooperative", label: "Andelshaver" },
    ],
  },
  {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    placeholder: "Fx 85",
    min: 10,
    max: 1000,
    unit: "m²",
  },
  {
    type: "single-choice",
    name: "householdSize",
    label: "Hvor mange bor i husstanden?",
    layout: "grid",
    options: [
      { value: "1", label: "1 person" },
      { value: "2", label: "2 personer" },
      { value: "3", label: "3 personer" },
      { value: "4", label: "4 personer" },
      { value: "5_plus", label: "5 eller flere" },
    ],
  },
  {
    type: "single-choice",
    name: "sumInsured",
    label: "Hvor meget er dit indbo værd?",
    description: "Et skøn er nok. Tænk på, hvad det koster at købe alt nyt.",
    options: [
      { value: "under_500000", label: "Under 500.000 kr." },
      { value: "500000_1000000", label: "500.000-1.000.000 kr." },
      { value: "over_1000000", label: "Over 1.000.000 kr." },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  currentInsurerField(),
];
