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
 * the selected insurance types, in config order. Types in `addedLater`
 * (added from a suggestion while filling in the form) come last among the
 * insurance steps, in the order they were added, so the user is never sent
 * back to an earlier step.
 */
export function getActiveSteps(
  config: FormConfig,
  selected: readonly InsuranceType[],
  addedLater: readonly InsuranceType[] = [],
): StepConfig[] {
  const active = config.steps.filter(
    (step) => !step.insuranceType || selected.includes(step.insuranceType),
  );
  const later = addedLater.filter((type) => selected.includes(type));
  if (later.length === 0) return active;

  const isLater = (step: StepConfig) =>
    step.insuranceType !== undefined && later.includes(step.insuranceType);
  const moved = later.map(
    (type) => active.find((step) => step.insuranceType === type) as StepConfig,
  );
  const rest = active.filter((step) => !isLater(step));
  // Insert after the last insurance step that stays (or after the first step).
  const lastInsurance = rest.findLastIndex((step) => step.insuranceType);
  const at = lastInsurance === -1 ? 1 : lastInsurance + 1;
  return [...rest.slice(0, at), ...moved, ...rest.slice(at)];
}
