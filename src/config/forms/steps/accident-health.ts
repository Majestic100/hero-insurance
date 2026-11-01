import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { INSURED_PERSONS } from "./shared";

/**
 * No health questions on purpose: health data is a special category under
 * GDPR (art. 9). The partner asks for it directly, with the right consent.
 */
export const accidentHealthFields: readonly FieldConfig[] = [
  {
    type: "multi-choice",
    name: "coverageTypes",
    label: "Hvad vil du have dækket?",
    description: "Du kan vælge flere.",
    options: [
      {
        value: "accident",
        label: "Ulykke",
        description: "Erstatning ved varigt mén efter en ulykke",
      },
      {
        value: "health",
        label: "Sundhed og behandling",
        description: "Fx fysioterapi, psykolog og operation",
      },
      {
        value: "critical_illness",
        label: "Kritisk sygdom",
        description: "Et engangsbeløb ved fx kræft eller blodprop",
      },
    ],
    minSelected: 1,
    minSelectedMessage: "Vælg mindst én dækning.",
  },
  {
    type: "single-choice",
    name: "insuredPersons",
    label: "Hvem skal være dækket?",
    options: INSURED_PERSONS,
  },
  {
    type: "single-choice",
    name: "occupation",
    label: "Hvad laver du til daglig?",
    description: "Prisen afhænger af, hvor fysisk dit arbejde er.",
    options: [
      { value: "office", label: "Kontorarbejde eller lignende" },
      { value: "physical", label: "Fysisk arbejde" },
      { value: "student", label: "Studerende" },
      { value: "retired", label: "Pensionist" },
      { value: "other", label: "Andet" },
    ],
  },
  currentInsurerField(),
];
