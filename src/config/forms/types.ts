import type { InsuranceType } from "./insurance-types";

/**
 * Types for the form configuration. The form is rendered from this data and
 * the zod schemas are generated from it (src/lib/schemas). New field types
 * are added to the `FieldConfig` union; the renderer and the schema
 * generator then handle the new type.
 */

type BaseField = {
  /** Key in the form values. Unique within its step's namespace. */
  name: string;
  /** Danish label shown to the user. */
  label: string;
  /** Optional Danish help text shown under the label. */
  description?: string;
};

export type ChoiceOption = {
  value: string;
  label: string;
  description?: string;
  /** Icon key, resolved by src/components/form/option-icons.ts. */
  icon?: string;
};

/** Several options as large tappable cards; the value is an array. */
export type MultiChoiceField = BaseField & {
  type: "multi-choice";
  options: readonly [ChoiceOption, ...ChoiceOption[]];
  /** "list": full-width rows (default). "grid": compact tiles for many options. */
  layout?: "list" | "grid";
  /** Minimum number of options the user must pick. Defaults to 0. */
  minSelected?: number;
  /** Danish error shown when fewer than `minSelected` are picked. */
  minSelectedMessage?: string;
};

export type FieldConfig = MultiChoiceField;

export type FieldType = FieldConfig["type"];

export type StepConfig = {
  /** Stable id, also used in the URL (?trin=<id>), so it is Danish. */
  id: string;
  /** Danish heading for the step. */
  title: string;
  description?: string;
  /**
   * When set, the step is only shown if this insurance type is selected,
   * and its field values are stored under `values[insuranceType]`.
   */
  insuranceType?: InsuranceType;
  fields: readonly FieldConfig[];
};

export type FormConfig = {
  /**
   * Version of this configuration. Stored with each lead
   * (lead_insurances.form_version) and used to discard stale drafts.
   * Bump it whenever fields change.
   */
  version: string;
  steps: readonly [StepConfig, ...StepConfig[]];
};
