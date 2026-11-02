import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { propertyAddressField, ROOF_TYPES } from "./shared";

export const houseFields: readonly FieldConfig[] = [
  propertyAddressField("Husets adresse"),
  {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    description: "Står i BBR eller på din ejendomsvurdering.",
    placeholder: "Fx 140",
    min: 20,
    max: 2000,
    unit: "m²",
    autofill: { from: "address", lookup: "bbr-living-area" },
  },
  {
    type: "year",
    name: "buildYear",
    label: "Byggeår",
    placeholder: "Fx 1975",
    minYear: 1600,
    autofill: { from: "address", lookup: "bbr-build-year" },
  },
  {
    type: "single-choice",
    name: "roofType",
    label: "Hvad er taget lavet af?",
    options: ROOF_TYPES,
    autofill: { from: "address", lookup: "bbr-roof-type" },
  },
  currentInsurerField(),
];
