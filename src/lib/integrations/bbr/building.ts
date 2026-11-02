import "server-only";

import { DAR_ID_PATTERN } from "@/lib/integrations/address/address-search-parse";
import { datafordelerQuery } from "@/lib/integrations/datafordeler/client";
import { createTtlCache } from "../cache";
import { buildingFacts, type BbrBygningResponse, type BuildingFacts } from "./building-parse";

const cache = createTtlCache<BuildingFacts | null>(24 * 60 * 60 * 1000, 2000);

const QUERY = `query ($address: String, $now: DafDateTime!) {
  BBR_Bygning(
    first: 50
    virkningstid: $now
    registreringstid: $now
    where: { husnummer: { eq: $address } }
  ) {
    nodes {
      status
      byg021BygningensAnvendelse
      byg026Opfoerelsesaar
      byg033Tagdaekningsmateriale
      byg039BygningensSamledeBoligAreal
    }
  }
}`;

/**
 * Build year, living area and roof of the home on a DAR address (husnummer
 * id), or null when BBR has no single home there (e.g. an apartment block).
 * Throws DatafordelerError when Datafordeler cannot be reached.
 */
export async function lookupBuilding(addressId: string): Promise<BuildingFacts | null> {
  if (!DAR_ID_PATTERN.test(addressId)) {
    return null;
  }
  const key = addressId.toLowerCase();
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const data = await datafordelerQuery<BbrBygningResponse>("BBR", QUERY, {
    address: key,
    now: new Date().toISOString(),
  });
  const facts = buildingFacts(data) ?? null;
  cache.set(key, facts);
  return facts;
}
