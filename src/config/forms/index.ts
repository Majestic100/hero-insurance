import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
  type InsuranceType,
} from "./insurance-types";
import { carFields } from "./steps/car";
import { homeContentsFields } from "./steps/home-contents";
import { houseFields } from "./steps/house";
import type {
  ChoiceOption,
  FieldConfig,
  FormConfig,
  StepConfig,
} from "./types";

/** Name of the field that holds the selected insurance types. */
export const INSURANCE_SELECTION_FIELD = "insuranceTypes";

const insuranceOptions = INSURANCE_TYPES.map(
  (type): ChoiceOption => ({
    value: type,
    label: INSURANCE_TYPE_INFO[type].shortLabel,
    icon: type,
  }),
) as [ChoiceOption, ...ChoiceOption[]];

/**
 * The questions per insurance type, one file each in ./steps. Types not
 * listed yet get a placeholder step (module 3b adds them).
 */
const INSURANCE_FIELDS: Partial<Record<InsuranceType, readonly FieldConfig[]>> =
  {
    car: carFields,
    home_contents: homeContentsFields,
    house: houseFields,
  };

function insuranceStep(type: InsuranceType): StepConfig {
  const fields = INSURANCE_FIELDS[type];
  return {
    id: INSURANCE_TYPE_INFO[type].slug,
    title: INSURANCE_TYPE_INFO[type].label,
    description: fields
      ? undefined
      : "Her kommer spørgsmålene om din forsikring.",
    insuranceType: type,
    fields: fields ?? [],
  };
}

export const formConfig = {
  version: "2026-11-01.3",
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
          hideLabel: true,
          options: insuranceOptions,
          layout: "grid",
          minSelected: 1,
          minSelectedMessage: "Vælg mindst én forsikring.",
        },
      ],
    },
    ...INSURANCE_TYPES.map(insuranceStep),
    {
      id: "afslut",
      title: "Næsten færdig",
      description: "Indsendelse er ikke åbnet endnu.",
      fields: [],
    },
  ],
} satisfies FormConfig;

export type { FormConfig, StepConfig, FieldConfig } from "./types";
