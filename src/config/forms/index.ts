import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
  type InsuranceType,
} from "./insurance-types";
import type { ChoiceOption, FormConfig, StepConfig } from "./types";

/** Name of the field that holds the selected insurance types. */
export const INSURANCE_SELECTION_FIELD = "insuranceTypes";

const insuranceOptions = INSURANCE_TYPES.map(
  (type): ChoiceOption => ({
    value: type,
    label: INSURANCE_TYPE_INFO[type].label,
    description: INSURANCE_TYPE_INFO[type].description,
  }),
) as [ChoiceOption, ...ChoiceOption[]];

/**
 * One step per insurance type. The fields are added in module 3; until then
 * the steps only carry a title, so the flow can be built and tested.
 */
function insuranceStep(type: InsuranceType, id: string): StepConfig {
  return {
    id,
    title: INSURANCE_TYPE_INFO[type].label,
    description: "Her kommer spørgsmålene om din forsikring.",
    insuranceType: type,
    fields: [],
  };
}

export const formConfig = {
  version: "2026-11-01.1",
  steps: [
    {
      id: "forsikringer",
      title: "Hvilke forsikringer vil du have tilbud på?",
      description: "Du kan vælge flere.",
      fields: [
        {
          type: "multi-choice",
          name: INSURANCE_SELECTION_FIELD,
          label: "Forsikringer",
          options: insuranceOptions,
          minSelected: 1,
          minSelectedMessage: "Vælg mindst én forsikring.",
        },
      ],
    },
    insuranceStep("car", "bil"),
    insuranceStep("home_contents", "indbo"),
    insuranceStep("house", "hus"),
    {
      id: "afslut",
      title: "Næsten færdig",
      description: "Indsendelse er ikke åbnet endnu.",
      fields: [],
    },
  ],
} satisfies FormConfig;

export type { FormConfig, StepConfig, FieldConfig } from "./types";
