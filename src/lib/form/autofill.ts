import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import type {
  AddressValue,
  AutofillLookup,
  FieldConfig,
  StepConfig,
} from "@/config/forms/types";
import { getSelectedTypes, type FormValues } from "./step-sequence";
import { stepValues } from "./visibility";

/**
 * Autofill: fields that are filled in from another field (`autofill` in
 * the field config). Lookups either call our own server endpoints, which
 * call the registers (no keys in the browser), or derive the value
 * directly from the source (parts of an address).
 */

type Lookup =
  | {
      /** The endpoint to call for this source value, or undefined to skip. */
      url: (source: unknown) => string | undefined;
      /** The value to fill in from the endpoint's JSON response. */
      read: (body: unknown) => unknown;
    }
  | { derive: (source: unknown) => unknown };

/** The DAR id of an address picked from the list. */
function addressId(source: unknown): string | undefined {
  const id = (source as Partial<AddressValue> | null | undefined)?.id;
  return typeof id === "string" && id ? id : undefined;
}

/**
 * Splits a DAR address text: "Strandvejen 100, Reersø, 4281 Gørlev" ->
 * street "Strandvejen 100", postal code "4281", city "Gørlev". Only for
 * addresses picked from the list, whose format we know.
 */
export function splitAddress(
  source: unknown,
): { street: string; postalCode: string; city: string } | undefined {
  if (!addressId(source)) {
    return undefined;
  }
  const parts = (source as AddressValue).text.split(",").map((part) => part.trim());
  const match = /^(\d{4}) (.+)$/.exec(parts.at(-1) ?? "");
  if (parts.length < 2 || !match || !parts[0]) {
    return undefined;
  }
  return { street: parts[0], postalCode: match[1], city: match[2] };
}

function bbr(key: "buildYear" | "livingArea" | "roofType"): Lookup {
  return {
    url: (source) => {
      const id = addressId(source);
      return id ? `/api/bbr/${id}` : undefined;
    },
    read: (body) => (body as Record<string, unknown> | null)?.[key],
  };
}

const LOOKUPS: Record<AutofillLookup, Lookup> = {
  "dk-postal-code-city": {
    url: (source) => {
      const code = typeof source === "string" ? source.trim() : "";
      return /^\d{4}$/.test(code) ? `/api/postnummer/${code}` : undefined;
    },
    read: (body) => {
      const city = (body as { city?: unknown } | null)?.city;
      return typeof city === "string" && city.trim() ? city.trim() : undefined;
    },
  },
  "bbr-build-year": bbr("buildYear"),
  "bbr-living-area": bbr("livingArea"),
  "bbr-roof-type": bbr("roofType"),
  "address-street": { derive: (source) => splitAddress(source)?.street },
  "address-postal-code": { derive: (source) => splitAddress(source)?.postalCode },
};

export type AutofillRequest = {
  /** Name of the field to fill, within the step's values. */
  target: string;
  lookup: AutofillLookup;
  /** Set for lookups that call an endpoint. */
  url?: string;
  /** Set for lookups derived directly from the source. */
  value?: unknown;
};

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim() !== "";
  }
  if (typeof value === "object" && "text" in value) {
    return typeof value.text === "string" && value.text.trim() !== "";
  }
  return true;
}

/**
 * The source value: a field in the same step, or "<type>.<field>" in an
 * insurance step, counted only while that insurance is selected.
 */
function readSource(
  step: StepConfig,
  values: FormValues,
  from: string | readonly string[],
): unknown {
  const own = stepValues(step, values);
  const selected = getSelectedTypes(values);
  for (const path of typeof from === "string" ? [from] : from) {
    const dot = path.indexOf(".");
    const first = dot === -1 ? path : path.slice(0, dot);
    const rest = path.slice(dot + 1);
    const isInsurance =
      dot !== -1 && (INSURANCE_TYPES as readonly string[]).includes(first);
    const value = isInsurance
      ? selected.includes(first as (typeof selected)[number])
        ? (values[first] as FormValues | undefined)?.[rest]
        : undefined
      : own[path];
    if (isFilled(value)) {
      return value;
    }
  }
  return undefined;
}

/** The lookups to run for a step's current values. */
export function getAutofillRequests(
  step: StepConfig,
  fields: readonly FieldConfig[],
  values: FormValues,
): AutofillRequest[] {
  return fields.flatMap((field): AutofillRequest[] => {
    if (!field.autofill) {
      return [];
    }
    const { lookup } = field.autofill;
    const source = readSource(step, values, field.autofill.from);
    if (!isFilled(source)) {
      return [];
    }
    const definition = LOOKUPS[lookup];
    if ("derive" in definition) {
      const value = definition.derive(source);
      return value === undefined ? [] : [{ target: field.name, lookup, value }];
    }
    const url = definition.url(source);
    return url ? [{ target: field.name, lookup, url }] : [];
  });
}

/**
 * Whether a lookup may write the field: only when it is empty or still
 * holds the value we filled in last time (the user has not changed it).
 */
export function mayAutofill(current: unknown, lastFilled: unknown): boolean {
  return !isFilled(current) || current === lastFilled;
}

/** Whether the field accepts the value, so autofill never makes it invalid. */
export function fitsField(field: FieldConfig, value: unknown): boolean {
  switch (field.type) {
    case "text":
      return (
        typeof value === "string" &&
        value.trim() !== "" &&
        value.length <= (field.maxLength ?? 100)
      );
    case "number":
      return (
        Number.isInteger(value) &&
        (value as number) >= field.min &&
        (value as number) <= field.max
      );
    case "year": {
      const maxYear = new Date().getFullYear() - (field.maxYearsAgo ?? 0);
      return (
        Number.isInteger(value) &&
        (value as number) >= field.minYear &&
        (value as number) <= maxYear
      );
    }
    case "single-choice":
    case "select":
      return field.options.some((option) => option.value === value);
    default:
      return false;
  }
}

/**
 * Responses per URL for this page view. Several lookups share one call
 * (the BBR facts). Failed calls are forgotten, so a later try can work.
 */
const responses = new Map<string, Promise<unknown>>();

async function fetchBody(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Lookup answered ${response.status}`);
  }
  return response.json();
}

/**
 * Runs a lookup. Resolves to the value, or undefined when there is none
 * (unknown, endpoint unavailable). Never throws.
 */
export async function runAutofill(request: AutofillRequest): Promise<unknown> {
  if (!request.url) {
    return request.value;
  }
  const definition = LOOKUPS[request.lookup];
  if (!("read" in definition)) {
    return undefined;
  }
  let body = responses.get(request.url);
  if (!body) {
    body = fetchBody(request.url);
    responses.set(request.url, body);
  }
  try {
    const result = await body;
    return result === null ? undefined : definition.read(result);
  } catch {
    responses.delete(request.url);
    return undefined;
  }
}
