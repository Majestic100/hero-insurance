import { z } from "zod";

import type { InsuranceType } from "@/config/forms/insurance-types";
import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import type {
  FieldConfig,
  FormConfig,
  StepConfig,
  TextField,
  TextFormat,
} from "@/config/forms/types";
import {
  getActiveSteps,
  getSelectedTypes,
  type FormValues,
} from "@/lib/form/step-sequence";
import { getVisibleFields } from "@/lib/form/visibility";

/**
 * Generates zod schemas from the form configuration. This is the only place
 * schemas are defined: the client form and the server endpoint both use
 * these functions, so validation can never drift apart (CLAUDE.md, rule 3).
 *
 * Values of steps tied to an insurance type are nested under that type:
 * { insuranceTypes: [...], car: { ... }, house: { ... } }
 *
 * Schemas depend on the values, because fields with `showIf` are only
 * validated while shown. Parsing drops hidden fields from the output.
 */

type Shape = Record<string, z.ZodType>;

const DEFAULT_REQUIRED = "Udfyld feltet.";
const DEFAULT_CHOOSE = "Vælg en mulighed.";
const DEFAULT_TEXT_MAX_LENGTH = 100;

function formatNumber(value: number): string {
  return value.toLocaleString("da-DK");
}

function optionValues(field: { options: readonly { value: string }[] }) {
  return field.options.map((option) => option.value) as [string, ...string[]];
}

function requiredSchema(field: FieldConfig): z.ZodType {
  switch (field.type) {
    case "multi-choice": {
      const schema = z.array(z.enum(optionValues(field)));
      const min = field.minSelected ?? 0;
      return min > 0
        ? schema.min(min, field.minSelectedMessage ?? `Vælg mindst ${min}.`)
        : schema;
    }

    case "single-choice":
    case "select":
      return z.enum(optionValues(field), {
        error: field.requiredMessage ?? DEFAULT_CHOOSE,
      });

    case "text":
      return buildTextSchema(field);

    case "number": {
      const unit = field.unit ? ` ${field.unit}` : "";
      return z
        .number({ error: field.requiredMessage ?? DEFAULT_REQUIRED })
        .int("Skriv et helt tal.")
        .min(field.min, `Skal være mindst ${formatNumber(field.min)}${unit}.`)
        .max(field.max, `Må højst være ${formatNumber(field.max)}${unit}.`);
    }

    case "year": {
      const maxYear = new Date().getFullYear() - (field.maxYearsAgo ?? 0);
      return z
        .number({ error: field.requiredMessage ?? DEFAULT_REQUIRED })
        .int("Skriv et årstal med fire cifre.")
        .min(field.minYear, `Årstallet skal være ${field.minYear} eller senere.`)
        .max(maxYear, `Årstallet må højst være ${maxYear}.`);
    }

    case "consent":
      // A required consent must be given; an optional one may be left out,
      // which counts as not given.
      return field.optional
        ? z.boolean().optional()
        : z.literal(true, {
            error:
              field.requiredMessage ??
              "Du skal give samtykke for at kunne få tilbud.",
          });
  }
}

/** Normalization and check for each built-in text format. */
const TEXT_FORMATS: Record<
  TextFormat,
  { normalize: (text: string) => string; pattern: RegExp; message: string }
> = {
  email: {
    normalize: (text) => text.trim().toLowerCase(),
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Skriv en gyldig e-mailadresse.",
  },
  "phone-dk": {
    normalize: (text) => text.replace(/[\s-]/g, "").replace(/^(\+45|0045)/, ""),
    pattern: /^\d{8}$/,
    message: "Skriv et dansk telefonnummer med 8 cifre.",
  },
  "postal-code-dk": {
    normalize: (text) => text.replace(/\s/g, ""),
    pattern: /^\d{4}$/,
    message: "Skriv et postnummer med 4 cifre.",
  },
};

/**
 * Text is normalized first (trimmed, uppercased without spaces, or by its
 * format), then checked. An empty optional field becomes undefined. One
 * pipeline, no union, so every error message stays the Danish one.
 */
function buildTextSchema(field: TextField): z.ZodType {
  const required = field.requiredMessage ?? DEFAULT_REQUIRED;
  const maxLength = field.maxLength ?? DEFAULT_TEXT_MAX_LENGTH;
  const format = field.format ? TEXT_FORMATS[field.format] : undefined;
  const normalize = (text: string) =>
    format
      ? format.normalize(text)
      : field.normalize === "uppercase-no-spaces"
        ? text.toUpperCase().replace(/\s+/g, "")
        : text.trim();

  let check = z.string();
  if (!field.optional) {
    check = check.min(1, required);
  }
  check = check.max(maxLength, `Højst ${maxLength} tegn.`);
  if (format) {
    check = check.regex(format.pattern, format.message);
  }
  if (field.pattern) {
    check = check.regex(
      new RegExp(field.pattern),
      field.patternMessage ?? "Tjek, at feltet er udfyldt korrekt.",
    );
  }

  if (!field.optional) {
    return z.string({ error: required }).transform(normalize).pipe(check);
  }
  return z
    .string()
    .optional()
    .transform((text) => normalize(text ?? "") || undefined)
    .pipe(check.optional());
}

export function buildFieldSchema(field: FieldConfig): z.ZodType {
  const schema = requiredSchema(field);
  // Text and consent handle "optional" themselves; multi-choice uses
  // minSelected instead.
  if (
    !field.optional ||
    field.type === "text" ||
    field.type === "consent" ||
    field.type === "multi-choice"
  ) {
    return schema;
  }
  return schema.optional();
}

function buildSchemaForSteps(
  steps: readonly StepConfig[],
  values: FormValues,
) {
  const root: Shape = {};
  const nested: Partial<Record<InsuranceType, Shape>> = {};

  for (const step of steps) {
    const target = step.insuranceType
      ? (nested[step.insuranceType] ??= {})
      : root;
    for (const field of getVisibleFields(step, values)) {
      target[field.name] = buildFieldSchema(field);
    }
  }

  for (const [type, shape] of Object.entries(nested)) {
    root[type] = z.object(shape);
  }

  return z.object(root);
}

/** Schema for a single step: used to validate before moving on. */
export function buildStepSchema(step: StepConfig, values: FormValues) {
  return buildSchemaForSteps([step], values);
}

/**
 * Schema for the whole form. The server builds it from the submitted
 * values: the selection decides which steps apply, and conditions decide
 * which fields are validated.
 */
export function buildFormSchema(config: FormConfig, values: FormValues) {
  return buildSchemaForSteps(
    getActiveSteps(config, getSelectedTypes(values)),
    values,
  );
}

/** Index of the first step whose values are invalid, or -1 if all are valid. */
export function findFirstInvalidStep(
  steps: readonly StepConfig[],
  values: FormValues,
): number {
  return steps.findIndex(
    (step) => !buildStepSchema(step, values).safeParse(values).success,
  );
}

function defaultFieldValue(field: FieldConfig): unknown {
  switch (field.type) {
    case "multi-choice":
      return [];
    case "text":
      return "";
    case "consent":
      return false;
    case "single-choice":
    case "select":
    case "number":
    case "year":
      return undefined;
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
