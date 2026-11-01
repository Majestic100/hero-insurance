import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { ROOF_TYPES } from "./shared";

export const houseFields: readonly FieldConfig[] = [
  {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    description: "Står i BBR eller på din ejendomsvurdering.",
    placeholder: "Fx 140",
    min: 20,
    max: 2000,
    unit: "m²",
  },
  {
    type: "year",
    name: "buildYear",
    label: "Byggeår",
    placeholder: "Fx 1975",
    minYear: 1600,
  },
  {
    type: "single-choice",
    name: "roofType",
    label: "Hvad er taget lavet af?",
    options: ROOF_TYPES,
  },
  currentInsurerField(),
];
