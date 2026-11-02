/**
 * Picks the home among the buildings on an address and reads the facts the
 * form asks for. Pure, so it is unit tested.
 */

export type BbrBuilding = {
  status?: string | null;
  byg021BygningensAnvendelse?: string | null;
  byg026Opfoerelsesaar?: number | null;
  byg033Tagdaekningsmateriale?: string | null;
  byg039BygningensSamledeBoligAreal?: number | null;
};

export type BbrBygningResponse = {
  BBR_Bygning?: { nodes?: BbrBuilding[] };
};

/** What we fill in. Every fact is optional: BBR is often incomplete. */
export type BuildingFacts = {
  buildYear?: number;
  livingArea?: number;
  /** A value of ROOF_TYPES in src/config/forms/steps/shared.ts. */
  roofType?: string;
};

/**
 * BBR use codes (byg021) for a single home: farmhouse, detached, semi-
 * detached and terraced houses, other year-round homes, holiday homes and
 * allotment houses. Apartment blocks (140) are left out on purpose: the
 * building's area is not the apartment's.
 */
const HOME_USE_CODES = new Set([
  "110", "120", "121", "122", "130", "131", "132", "190", "510", "540",
]);

/** BBR status codes for buildings that no longer exist or were cancelled. */
const GONE_STATUS = new Set(["9", "10", "11"]);

/** BBR roof material (byg033) to our ROOF_TYPES values. */
export const ROOF_TYPE_BY_BBR_CODE: Record<string, string | undefined> = {
  "1": "felt", // built-up roofing (flat felt)
  "2": "felt", // roofing felt
  "3": "fiber_cement", // fibre cement, incl. asbestos
  "4": "concrete_tiles", // cement / concrete tiles
  "5": "tiles", // clay tiles
  "6": "other", // metal
  "7": "thatch",
  "10": "fiber_cement", // fibre cement without asbestos
  "11": "other", // PVC
  "12": "other", // glass
  "20": "other", // green roof
  "80": undefined, // no roof
  "90": "other",
};

/** The main home on the address: the largest current home building. */
export function pickHome(buildings: readonly BbrBuilding[]): BbrBuilding | undefined {
  return buildings
    .filter(
      (building) =>
        !GONE_STATUS.has(building.status ?? "") &&
        HOME_USE_CODES.has(building.byg021BygningensAnvendelse ?? ""),
    )
    .sort(
      (a, b) =>
        (b.byg039BygningensSamledeBoligAreal ?? 0) -
        (a.byg039BygningensSamledeBoligAreal ?? 0),
    )[0];
}

export function buildingFacts(data: BbrBygningResponse): BuildingFacts | undefined {
  const home = pickHome(data.BBR_Bygning?.nodes ?? []);
  if (!home) {
    return undefined;
  }
  const facts: BuildingFacts = {};
  if (home.byg026Opfoerelsesaar && home.byg026Opfoerelsesaar > 1000) {
    facts.buildYear = home.byg026Opfoerelsesaar;
  }
  if (home.byg039BygningensSamledeBoligAreal && home.byg039BygningensSamledeBoligAreal > 0) {
    facts.livingArea = home.byg039BygningensSamledeBoligAreal;
  }
  const roof = ROOF_TYPE_BY_BBR_CODE[home.byg033Tagdaekningsmateriale ?? ""];
  if (roof) {
    facts.roofType = roof;
  }
  return Object.keys(facts).length > 0 ? facts : undefined;
}
