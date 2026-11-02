import { describe, expect, it } from "vitest";

import { ROOF_TYPES } from "@/config/forms/steps/shared";
import { buildingFacts, ROOF_TYPE_BY_BBR_CODE } from "./building-parse";

const house = {
  status: "6",
  byg021BygningensAnvendelse: "120",
  byg026Opfoerelsesaar: 1964,
  byg033Tagdaekningsmateriale: "3",
  byg039BygningensSamledeBoligAreal: 124,
};

describe("buildingFacts", () => {
  it("reads the home and ignores sheds and garages", () => {
    const shed = { ...house, byg021BygningensAnvendelse: "930", byg039BygningensSamledeBoligAreal: 300 };
    expect(buildingFacts({ BBR_Bygning: { nodes: [shed, house] } })).toEqual({
      buildYear: 1964,
      livingArea: 124,
      roofType: "fiber_cement",
    });
  });

  it("ignores buildings that are gone", () => {
    const demolished = { ...house, status: "11", byg026Opfoerelsesaar: 1900, byg039BygningensSamledeBoligAreal: 500 };
    expect(buildingFacts({ BBR_Bygning: { nodes: [demolished, house] } })?.buildYear).toBe(1964);
  });

  it("gives nothing for apartment blocks, so the block's area is never used", () => {
    const block = { ...house, byg021BygningensAnvendelse: "140", byg039BygningensSamledeBoligAreal: 2262 };
    expect(buildingFacts({ BBR_Bygning: { nodes: [block] } })).toBeUndefined();
    expect(buildingFacts({})).toBeUndefined();
  });

  it("leaves out facts BBR does not have", () => {
    const sparse = { ...house, byg026Opfoerelsesaar: null, byg033Tagdaekningsmateriale: "80" };
    expect(buildingFacts({ BBR_Bygning: { nodes: [sparse] } })).toEqual({ livingArea: 124 });
  });

  it("maps every BBR roof to a roof option in the form", () => {
    const options: string[] = ROOF_TYPES.map((option) => option.value);
    for (const value of Object.values(ROOF_TYPE_BY_BBR_CODE)) {
      if (value) {
        expect(options).toContain(value);
      }
    }
  });
});
