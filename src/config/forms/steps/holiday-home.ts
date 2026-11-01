import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { ROOF_TYPES, YES_NO } from "./shared";

export const holidayHomeFields: readonly FieldConfig[] = [
  {
    type: "number",
    name: "livingArea",
    label: "Areal",
    description: "Står i BBR eller på din ejendomsvurdering.",
    placeholder: "Fx 70",
    min: 10,
    max: 1000,
    unit: "m²",
  },
  {
    type: "year",
    name: "buildYear",
    label: "Byggeår",
    placeholder: "Fx 1980",
    minYear: 1600,
  },
  {
    type: "single-choice",
    name: "roofType",
    label: "Hvad er taget lavet af?",
    options: ROOF_TYPES,
  },
  {
    type: "single-choice",
    name: "rentedOut",
    label: "Lejer du fritidshuset ud?",
    layout: "grid",
    options: YES_NO,
  },
  currentInsurerField(),
];
