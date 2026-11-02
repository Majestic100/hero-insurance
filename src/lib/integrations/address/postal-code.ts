import "server-only";

import { datafordelerQuery } from "@/lib/integrations/datafordeler/client";
import { createTtlCache } from "../cache";
import {
  cityFromResponse,
  POSTAL_CODE_PATTERN,
  type DarPostnummerResponse,
} from "./postal-code-parse";

/** Postal codes almost never change: remember answers for a day. */
const cache = createTtlCache<string | null>(24 * 60 * 60 * 1000);

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
  if (cached !== undefined) {
    return cached;
  }

  const data = await datafordelerQuery<DarPostnummerResponse>(
    "DAR",
    `query ($postalCode: String, $now: DafDateTime!) {
      DAR_Postnummer(first: 5, virkningstid: $now, where: { postnr: { eq: $postalCode } }) {
        nodes { postnr navn }
      }
    }`,
    { postalCode, now: new Date().toISOString() },
  );
  const city = cityFromResponse(postalCode, data) ?? null;
  cache.set(postalCode, city);
  return city;
}
