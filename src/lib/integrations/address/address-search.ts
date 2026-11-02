import "server-only";

import { datafordelerQuery } from "@/lib/integrations/datafordeler/client";
import { createTtlCache } from "../cache";
import {
  ADDRESS_SUGGESTION_LIMIT,
  casingVariants,
  mergeSuggestions,
  normalizeAddressQuery,
  type AddressSuggestion,
  type DarHusnummerResponse,
} from "./address-search-parse";

const cache = createTtlCache<AddressSuggestion[]>(60 * 60 * 1000, 2000);

// Only the current registration of addresses in use (2 = provisional,
// 3 = valid), so old versions do not show up as duplicates.
const QUERY = `query ($prefix: String, $now: DafDateTime!, $first: Int) {
  DAR_Husnummer(
    first: $first
    virkningstid: $now
    registreringstid: $now
    where: { adgangsadressebetegnelse: { startsWith: $prefix }, status: { in: ["2", "3"] } }
  ) {
    nodes { id_lokalId adgangsadressebetegnelse }
  }
}`;

/**
 * Address suggestions (street and house number) for what the user has
 * typed so far. Empty for queries that are too short. Throws
 * DatafordelerError when Datafordeler cannot be reached.
 */
export async function searchAddresses(query: string): Promise<AddressSuggestion[]> {
  const normalized = normalizeAddressQuery(query);
  if (!normalized) {
    return [];
  }
  const cached = cache.get(normalized);
  if (cached) {
    return cached;
  }

  const now = new Date().toISOString();
  const responses = await Promise.all(
    casingVariants(normalized).map((prefix) =>
      datafordelerQuery<DarHusnummerResponse>("DAR", QUERY, {
        prefix,
        now,
        first: ADDRESS_SUGGESTION_LIMIT,
      }),
    ),
  );
  const suggestions = mergeSuggestions(responses);
  cache.set(normalized, suggestions);
  return suggestions;
}
