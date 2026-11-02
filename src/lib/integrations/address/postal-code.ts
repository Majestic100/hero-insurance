import "server-only";

import { datafordelerQuery } from "@/lib/integrations/datafordeler/client";
import {
  cityFromResponse,
  POSTAL_CODE_PATTERN,
  type DarPostnummerResponse,
} from "./postal-code-parse";

/** Postal codes almost never change: remember answers for a day. */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { city: string | null; expires: number }>();

/**
 * The city for a Danish postal code from DAR (Datafordeler), or null when
 * the code does not exist. Throws DatafordelerError when the lookup fails
 * (not configured, network, Datafordeler down), so callers can tell
 * "unknown code" from "could not check".
 */
export async function lookupCity(postalCode: string): Promise<string | null> {
  if (!POSTAL_CODE_PATTERN.test(postalCode)) {
    return null;
  }
  const cached = cache.get(postalCode);
  if (cached && cached.expires > Date.now()) {
    return cached.city;
  }

  // The postal code is validated as 4 digits above, so it is safe inline.
  const now = new Date().toISOString();
  const data = await datafordelerQuery<DarPostnummerResponse>(
    "DAR",
    `{ DAR_Postnummer(first: 5, virkningstid: "${now}", where: { postnr: { eq: "${postalCode}" } }) { nodes { postnr navn } } }`,
  );
  const city = cityFromResponse(postalCode, data) ?? null;
  cache.set(postalCode, { city, expires: Date.now() + CACHE_TTL_MS });
  return city;
}
