import { INSURANCE_SELECTION_FIELD } from "@/config/forms";
import {
  INSURANCE_TYPES,
  type InsuranceType,
} from "@/config/forms/insurance-types";
import type { FormConfig, StepConfig } from "@/config/forms/types";

export type FormValues = Record<string, unknown>;

/** The insurance types picked in the form, in canonical order. */
export function getSelectedTypes(values: FormValues): InsuranceType[] {
  const raw = values[INSURANCE_SELECTION_FIELD];
  if (!Array.isArray(raw)) {
    return [];
  }
  return INSURANCE_TYPES.filter((type) => raw.includes(type));
}

/**
 * The steps the user goes through: all general steps, plus the steps for
 * the selected insurance types, in config order.
 */
export function getActiveSteps(
  config: FormConfig,
  selected: readonly InsuranceType[],
): StepConfig[] {
  return config.steps.filter(
    (step) => !step.insuranceType || selected.includes(step.insuranceType),
  );
}
