import {
  INSURANCE_TYPE_INFO,
  INSURANCE_TYPES,
  type InsuranceType,
} from "./insurance-types";
import { consentFields } from "./consents";
import { accidentHealthFields } from "./steps/accident-health";
import { contactFields } from "./steps/contact";
import { boatFields } from "./steps/boat";
import { carFields } from "./steps/car";
import { caravanFields } from "./steps/caravan";
import { changeOfOwnershipFields } from "./steps/change-of-ownership";
import { holidayHomeFields } from "./steps/holiday-home";
import { homeContentsFields } from "./steps/home-contents";
import { houseFields } from "./steps/house";
import { lifeFields } from "./steps/life";
import { motorcycleAtvMopedFields } from "./steps/motorcycle-atv-moped";
import { petFields } from "./steps/pet";
import { travelFields } from "./steps/travel";
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
 * The questions per insurance type, one file each in ./steps. A Record, so
 * adding an insurance type without questions fails the typecheck.
 */
const INSURANCE_FIELDS: Record<InsuranceType, readonly FieldConfig[]> = {
  car: carFields,
  home_contents: homeContentsFields,
  house: houseFields,
  accident_health: accidentHealthFields,
  travel: travelFields,
  holiday_home: holidayHomeFields,
  motorcycle_atv_moped: motorcycleAtvMopedFields,
  boat: boatFields,
  caravan: caravanFields,
  pet: petFields,
  life: lifeFields,
  change_of_ownership: changeOfOwnershipFields,
};

function insuranceStep(type: InsuranceType): StepConfig {
  return {
    id: INSURANCE_TYPE_INFO[type].slug,
    title: INSURANCE_TYPE_INFO[type].label,
    insuranceType: type,
    fields: INSURANCE_FIELDS[type],
  };
}

export const formConfig = {
  version: "2026-11-02.1",
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
      id: "kontakt",
      title: "Dine oplysninger",
      description: "Så forsikringsselskaberne kan sende dig deres tilbud.",
      fields: contactFields,
    },
    {
      id: "afslut",
      title: "Send din forespørgsel",
      description: "Tjek dine valg, og giv samtykke til at modtage tilbud.",
      fields: consentFields,
    },
  ],
} satisfies FormConfig;

export type { FormConfig, StepConfig, FieldConfig } from "./types";
