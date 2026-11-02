import type {
  AutofillLookup,
  FieldConfig,
  StepConfig,
} from "@/config/forms/types";
import type { FormValues } from "./step-sequence";
import { stepValues } from "./visibility";

/**
 * Autofill: fields that are filled in from another field in the same step
 * (`autofill` in the field config). The lookups call our own server
 * endpoints, which call the registers; no keys in the browser.
 */

type Lookup = {
  /** The endpoint to call for this source value, or undefined to skip. */
  url: (source: string) => string | undefined;
  /** The value to fill in from the endpoint's JSON response. */
  read: (body: unknown) => string | undefined;
};

const LOOKUPS: Record<AutofillLookup, Lookup> = {
  "dk-postal-code-city": {
    url: (source) => {
      const code = source.trim();
      return /^\d{4}$/.test(code) ? `/api/postnummer/${code}` : undefined;
    },
    read: (body) => {
      const city = (body as { city?: unknown } | null)?.city;
      return typeof city === "string" && city.trim() ? city.trim() : undefined;
    },
  },
};

export type AutofillRequest = {
  /** Name of the field to fill, within the step's values. */
  target: string;
  lookup: AutofillLookup;
  url: string;
};

/** The lookups to run for a step's current values. */
export function getAutofillRequests(
  step: StepConfig,
  fields: readonly FieldConfig[],
  values: FormValues,
): AutofillRequest[] {
  const own = stepValues(step, values);
  return fields.flatMap((field) => {
    if (field.type !== "text" || !field.autofill) {
      return [];
    }
    const source = own[field.autofill.from];
    const url =
      typeof source === "string"
        ? LOOKUPS[field.autofill.lookup].url(source)
        : undefined;
    return url ? [{ target: field.name, lookup: field.autofill.lookup, url }] : [];
  });
}

/**
 * Whether a lookup may write the field: only when it is empty or still
 * holds the value we filled in last time (the user has not changed it).
 */
export function mayAutofill(current: unknown, lastFilled: string | undefined): boolean {
  if (current === undefined || current === null) {
    return true;
  }
  if (typeof current !== "string") {
    return false;
  }
  return current.trim() === "" || current === lastFilled;
}

/** Answers per URL for this page view; failed lookups are not remembered. */
const cache = new Map<string, string | null>();

/**
 * Runs a lookup. Resolves to the value, or undefined when there is none
 * (unknown code, endpoint unavailable, aborted). Never throws.
 */
export async function fetchAutofill(
  request: AutofillRequest,
  signal?: AbortSignal,
): Promise<string | undefined> {
  const cached = cache.get(request.url);
  if (cached !== undefined) {
    return cached ?? undefined;
  }
  try {
    const response = await fetch(request.url, { signal });
    if (response.status === 404) {
      cache.set(request.url, null);
      return undefined;
    }
    if (!response.ok) {
      return undefined;
    }
    const value = LOOKUPS[request.lookup].read(await response.json());
    cache.set(request.url, value ?? null);
    return value;
  } catch {
    return undefined;
  }
}
