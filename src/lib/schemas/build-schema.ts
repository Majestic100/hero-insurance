import { z } from "zod";

import type { InsuranceType } from "@/config/forms/insurance-types";
import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import type { FieldConfig, FormConfig, StepConfig } from "@/config/forms/types";
import { getActiveSteps, type FormValues } from "@/lib/form/step-sequence";

/**
 * Generates zod schemas from the form configuration. This is the only place
 * schemas are defined: the client form and the server endpoint both use
 * these functions, so validation can never drift apart (CLAUDE.md, rule 3).
 *
 * Values of steps tied to an insurance type are nested under that type:
 * { insuranceTypes: [...], car: { ... }, house: { ... } }
 */

type Shape = Record<string, z.ZodType>;

export function buildFieldSchema(field: FieldConfig): z.ZodType {
  switch (field.type) {
    case "multi-choice": {
      const values = field.options.map((option) => option.value) as [
        string,
        ...string[],
      ];
      const schema = z.array(z.enum(values));
      const min = field.minSelected ?? 0;
      return min > 0
        ? schema.min(min, field.minSelectedMessage ?? `Vælg mindst ${min}.`)
        : schema;
    }
  }
}

function buildSchemaForSteps(steps: readonly StepConfig[]) {
  const root: Shape = {};
  const nested: Partial<Record<InsuranceType, Shape>> = {};

  for (const step of steps) {
    const target = step.insuranceType
      ? (nested[step.insuranceType] ??= {})
      : root;
    for (const field of step.fields) {
      target[field.name] = buildFieldSchema(field);
    }
  }

  for (const [type, shape] of Object.entries(nested)) {
    root[type] = z.object(shape);
  }

  return z.object(root);
}

/** Schema for a single step: used to validate before moving on. */
export function buildStepSchema(step: StepConfig) {
  return buildSchemaForSteps([step]);
}

/** Schema for the whole form, given the selected insurance types. */
export function buildFormSchema(
  config: FormConfig,
  selected: readonly InsuranceType[],
) {
  return buildSchemaForSteps(getActiveSteps(config, selected));
}

/** Index of the first step whose values are invalid, or -1 if all are valid. */
export function findFirstInvalidStep(
  steps: readonly StepConfig[],
  values: FormValues,
): number {
  return steps.findIndex(
    (step) => !buildStepSchema(step).safeParse(values).success,
  );
}

function defaultFieldValue(field: FieldConfig): unknown {
  switch (field.type) {
    case "multi-choice":
      return [];
  }
}

/** Empty values for every field, including every insurance namespace. */
export function buildDefaultValues(config: FormConfig): FormValues {
  const values: FormValues = {};
  for (const type of INSURANCE_TYPES) {
    values[type] = {};
  }
  for (const step of config.steps) {
    const target = step.insuranceType
      ? (values[step.insuranceType] as FormValues)
      : values;
    for (const field of step.fields) {
      target[field.name] = defaultFieldValue(field);
    }
  }
  return values;
}
