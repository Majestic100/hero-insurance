import type { InsuranceType } from "./insurance-types";

/**
 * Types for the form configuration. The form is rendered from this data and
 * the zod schemas are generated from it (src/lib/schemas). New field types
 * are added to the `FieldConfig` union; the renderer and the schema
 * generator then handle the new type.
 */

/**
 * Shows a field only when another field in the same step has one of the
 * given values (or, for a multi-choice field, includes one of them).
 * Hidden fields are not validated and are dropped from the parsed values.
 */
export type FieldCondition = {
  field: string;
  equals: string | readonly string[];
};

type BaseField = {
  /** Key in the form values. Unique within its step's namespace. */
  name: string;
  /** Danish label shown to the user. */
  label: string;
  /** Hides the label visually (still read by screen readers). */
  hideLabel?: boolean;
  /** Optional Danish help text shown under the label. */
  description?: string;
  /** Fields are required unless set to true. Shown as "(valgfri)". */
  optional?: boolean;
  /** Danish error shown when a required field is empty. */
  requiredMessage?: string;
  showIf?: FieldCondition;
  /** Browser autofill hint, e.g. "given-name", "email", "bday-year". */
  autoComplete?: string;
  /**
   * Personal data: never saved in the sessionStorage draft, so it is gone
   * when the tab closes or the page reloads. Consent fields are always
   * excluded.
   */
  noDraft?: boolean;
  /**
   * Fills this field from another field, e.g. the city from the postal
   * code, or the build year from the address (BBR). `from` is a field in
   * the same step, or "<insurance type>.<field>" for an insurance step
   * (the first one that is selected and filled in counts). It only writes
   * when this field is empty or still holds the last filled-in value, so
   * it never overwrites what the user typed, and only values the field
   * accepts. If the lookup fails, the user simply fills in the field.
   */
  autofill?: { from: string | readonly string[]; lookup: AutofillLookup };
};

export type ChoiceOption = {
  value: string;
  label: string;
  description?: string;
  /** Icon key, resolved by src/components/form/option-icons.ts. */
  icon?: string;
};

type ChoiceOptions = readonly [ChoiceOption, ...ChoiceOption[]];

/** Several options as large tappable cards; the value is an array. */
export type MultiChoiceField = BaseField & {
  type: "multi-choice";
  options: ChoiceOptions;
  /** "list": full-width rows (default). "grid": compact tiles for many options. */
  layout?: "list" | "grid";
  /** Minimum number of options the user must pick. Defaults to 0. */
  minSelected?: number;
  /** Danish error shown when fewer than `minSelected` are picked. */
  minSelectedMessage?: string;
};

/** One option as large tappable cards; the value is the option value. */
export type SingleChoiceField = BaseField & {
  type: "single-choice";
  options: ChoiceOptions;
  /** "list": full-width rows (default). "grid": 2 per row, for short labels. */
  layout?: "list" | "grid";
};

/** A dropdown, for long lists of options. */
export type SelectField = BaseField & {
  type: "select";
  options: ChoiceOptions;
  /** Text shown before anything is picked. */
  placeholder?: string;
};

/**
 * Built-in formats: each sets the keyboard on mobile, normalizes the value
 * and checks it with a Danish error message.
 * - email: lowercased, must look like an email address
 * - phone-dk: spaces and +45 removed, must be 8 digits
 * - postal-code-dk: must be 4 digits
 */
export type TextFormat = "email" | "phone-dk" | "postal-code-dk";

/**
 * Built-in lookups that fill a field from another field (see
 * src/lib/form/autofill.ts):
 * - dk-postal-code-city: the city for a Danish postal code (DAR)
 * - bbr-build-year, bbr-living-area, bbr-roof-type: facts about the home
 *   on an address picked from the list (BBR)
 * - address-street, address-postal-code: parts of an address picked from
 *   the list
 */
export type AutofillLookup =
  | "dk-postal-code-city"
  | "bbr-build-year"
  | "bbr-living-area"
  | "bbr-roof-type"
  | "address-street"
  | "address-postal-code";

export type TextField = BaseField & {
  type: "text";
  placeholder?: string;
  /** Defaults to 100. */
  maxLength?: number;
  format?: TextFormat;
  /** Uppercases and removes spaces before validating (license plates). */
  normalize?: "uppercase-no-spaces";
  /** Regex (as a string) the normalized value must match. */
  pattern?: string;
  /** Danish error shown when the value does not match `pattern`. */
  patternMessage?: string;
  /**
   * Looks the value up in a register while the user types, and shows what
   * was found under the field (see src/lib/form/field-lookup.ts):
   * - dk-license-plate: the vehicle for a Danish plate (motor register).
   *   The server also saves the full vehicle data with the lead.
   * Never blocks the form: an unknown value only shows a hint.
   */
  lookup?: FieldLookup;
};

export type FieldLookup = "dk-license-plate";

/**
 * The value of an address field: the text, plus the DAR address id when
 * the user picked the address from the list (it is then a real address,
 * and the id is used for BBR lookups).
 */
export type AddressValue = { text: string; id?: string };

/**
 * A Danish address (street and house number) with suggestions from DAR
 * while typing. If the address is not on the list, the user can type it
 * in full; it is then saved without an id.
 */
export type AddressField = BaseField & {
  type: "address";
  placeholder?: string;
};

export type ConsentType = "partner_contact" | "marketing";

/**
 * A consent checkbox. The exact `text` and `version` are stored with the
 * lead as proof of what the user agreed to. Required consents must be
 * checked; the value is a boolean and is never saved in the draft.
 */
export type ConsentField = BaseField & {
  type: "consent";
  consentType: ConsentType;
  /** The full Danish consent text shown next to the checkbox. */
  text: string;
  /** Bump when `text` changes. */
  version: string;
  /** Optional link shown after the text, e.g. the privacy policy. */
  link?: { href: string; label: string };
};

/** A whole number, typed with the numeric keyboard on mobile. */
export type NumberField = BaseField & {
  type: "number";
  min: number;
  max: number;
  /** Shown after the input, e.g. "m²", "kr.", "fod", "hk". */
  unit?: string;
  placeholder?: string;
};

/** A year, between `minYear` and the current year minus `maxYearsAgo`. */
export type YearField = BaseField & {
  type: "year";
  minYear: number;
  /** E.g. 17 for a driver's birth year. Defaults to 0 (this year). */
  maxYearsAgo?: number;
  placeholder?: string;
};

export type FieldConfig =
  | MultiChoiceField
  | SingleChoiceField
  | SelectField
  | TextField
  | AddressField
  | NumberField
  | YearField
  | ConsentField;

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
