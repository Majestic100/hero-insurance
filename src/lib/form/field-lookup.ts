import type { FieldLookup } from "@/config/forms/types";

/**
 * Field lookups: a register lookup of a field's own value, shown under the
 * field (`lookup` in the field config). They call our own server endpoints,
 * so no keys reach the browser, and they never block the form.
 */

type LookupDefinition = {
  /** The endpoint for this value, or undefined while it is incomplete. */
  url: (value: string) => string | undefined;
  /** The line to show when found. */
  read: (body: unknown) => string | undefined;
  /** Danish hint when the register does not know the value. */
  notFound: string;
};

const LOOKUPS: Record<FieldLookup, LookupDefinition> = {
  "dk-license-plate": {
    url: (value) => {
      const plate = value.toUpperCase().replace(/[\s-]/g, "");
      return /^[A-ZÆØÅ0-9]{2,7}$/.test(plate)
        ? `/api/nummerplade/${encodeURIComponent(plate)}`
        : undefined;
    },
    read: (body) => {
      const description = (body as { description?: unknown } | null)?.description;
      return typeof description === "string" && description ? description : undefined;
    },
    notFound: "Vi kan ikke finde nummerpladen. Tjek, at den er skrevet rigtigt.",
  },
};

export type FieldLookupResult =
  | { status: "found"; text: string }
  | { status: "not-found"; text: string };

export function fieldLookupUrl(lookup: FieldLookup, value: string): string | undefined {
  return LOOKUPS[lookup].url(value);
}

/** Answers per URL for this page view; failures are not remembered. */
const answers = new Map<string, FieldLookupResult>();

/**
 * Runs a lookup. Resolves to what to show, or undefined when there is
 * nothing to say (endpoint unavailable, network error). Never throws.
 */
export async function runFieldLookup(
  lookup: FieldLookup,
  url: string,
  signal?: AbortSignal,
): Promise<FieldLookupResult | undefined> {
  const cached = answers.get(url);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(url, { signal });
    let result: FieldLookupResult | undefined;
    if (response.status === 404) {
      result = { status: "not-found", text: LOOKUPS[lookup].notFound };
    } else if (response.ok) {
      const text = LOOKUPS[lookup].read(await response.json());
      result = text ? { status: "found", text } : undefined;
    }
    if (result) {
      answers.set(url, result);
    }
    return result;
  } catch {
    return undefined;
  }
}
