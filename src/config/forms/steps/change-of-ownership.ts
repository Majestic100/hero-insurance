import type { FieldConfig } from "../types";

/**
 * No "Nuværende selskab": an ownership change insurance is bought once,
 * when a house is sold, so there is no current insurer to switch from.
 */
export const changeOfOwnershipFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "role",
    label: "Er du køber eller sælger?",
    layout: "grid",
    options: [
      { value: "seller", label: "Sælger" },
      { value: "buyer", label: "Køber" },
    ],
  },
  {
    type: "number",
    name: "salePrice",
    label: "Forventet salgspris",
    placeholder: "Fx 3.500.000",
    min: 100000,
    max: 100000000,
    unit: "kr.",
  },
  {
    type: "year",
    name: "buildYear",
    label: "Byggeår",
    placeholder: "Fx 1975",
    minYear: 1600,
  },
  {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    placeholder: "Fx 140",
    min: 20,
    max: 2000,
    unit: "m²",
  },
  {
    type: "single-choice",
    name: "conditionReport",
    label: "Er der lavet tilstandsrapport og elinstallationsrapport?",
    options: [
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nej, ikke endnu" },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
];
