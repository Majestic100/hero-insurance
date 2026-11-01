import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";

export const caravanFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "caravanType",
    label: "Hvad skal forsikres?",
    options: [
      { value: "caravan", label: "Campingvogn" },
      { value: "motorhome", label: "Autocamper" },
      { value: "folding", label: "Telt- eller foldevogn" },
    ],
  },
  {
    type: "year",
    name: "modelYear",
    label: "Årgang",
    placeholder: "Fx 2015",
    minYear: 1950,
  },
  {
    type: "single-choice",
    name: "value",
    label: "Hvad er den værd?",
    options: [
      { value: "under_50000", label: "Under 50.000 kr." },
      { value: "50000_150000", label: "50.000-150.000 kr." },
      { value: "150000_400000", label: "150.000-400.000 kr." },
      { value: "over_400000", label: "Over 400.000 kr." },
    ],
  },
  currentInsurerField(),
];
