import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import {
  INSURED_PERSONS,
  otherInfoField,
  YES_NO,
} from "./shared";

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
  {
    type: "single-choice",
    name: "cancellation",
    label: "Vil du også have afbestillingsforsikring?",
    description: "Dækker, hvis du må aflyse rejsen, fx på grund af sygdom.",
    layout: "grid",
    options: YES_NO,
  },
  currentInsurerField(),
  otherInfoField(),
];
