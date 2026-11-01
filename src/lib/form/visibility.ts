import type {
  FieldCondition,
  FieldConfig,
  StepConfig,
} from "@/config/forms/types";
import type { FormValues } from "./step-sequence";

/** The values a step's fields read and write: its insurance namespace or the root. */
export function stepValues(step: StepConfig, values: FormValues): FormValues {
  if (!step.insuranceType) {
    return values;
  }
  const nested = values[step.insuranceType];
  return nested && typeof nested === "object" ? (nested as FormValues) : {};
}

function conditionMet(condition: FieldCondition, values: FormValues): boolean {
  const expected =
    typeof condition.equals === "string" ? [condition.equals] : condition.equals;
  const actual = values[condition.field];
  if (Array.isArray(actual)) {
    return actual.some((item) => expected.includes(item));
  }
  return typeof actual === "string" && expected.includes(actual);
}

/**
 * The fields of a step that are currently shown. A field with `showIf` is
 * shown only if its condition is met and the field it depends on is itself
 * shown, so chains of conditions behave as expected.
 */
export function getVisibleFields(
  step: StepConfig,
  values: FormValues,
): FieldConfig[] {
  const own = stepValues(step, values);
  const byName = new Map(step.fields.map((field) => [field.name, field]));

  function isVisible(field: FieldConfig, seen: Set<string>): boolean {
    if (!field.showIf) {
      return true;
    }
    const parent = byName.get(field.showIf.field);
    if (!parent || seen.has(parent.name)) {
      return false;
    }
    seen.add(field.name);
    return isVisible(parent, seen) && conditionMet(field.showIf, own);
  }

  return step.fields.filter((field) => isVisible(field, new Set()));
}
