import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { INSURED_PERSONS } from "./shared";

export const travelFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "tripType",
    label: "Hvilken rejseforsikring søger du?",
    options: [
      {
        value: "annual",
        label: "Helårsrejseforsikring",
        description: "Dækker alle rejser i et år",
      },
      {
        value: "single_trip",
        label: "Til en enkelt rejse",
      },
    ],
  },
  {
    type: "single-choice",
    name: "area",
    label: "Hvor skal forsikringen gælde?",
    layout: "grid",
    options: [
      { value: "europe", label: "Europa" },
      { value: "worldwide", label: "Hele verden" },
    ],
  },
  {
    type: "single-choice",
    name: "travellers",
    label: "Hvem skal være dækket?",
    options: INSURED_PERSONS,
  },
  currentInsurerField(),
];
