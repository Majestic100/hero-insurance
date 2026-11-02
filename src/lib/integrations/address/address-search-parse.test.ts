import { describe, expect, it } from "vitest";

import { casingVariants, mergeSuggestions, normalizeAddressQuery } from "./address-search-parse";

describe("normalizeAddressQuery", () => {
  it("trims and collapses spaces, and rejects too short or long queries", () => {
    expect(normalizeAddressQuery("  Egevej   5 ")).toBe("Egevej 5");
    expect(normalizeAddressQuery("Eg")).toBeUndefined();
    expect(normalizeAddressQuery("x".repeat(81))).toBeUndefined();
  });
});

describe("casingVariants", () => {
  it("tries the spellings DAR uses", () => {
    expect(casingVariants("gammel kongevej 1")).toEqual([
      "gammel kongevej 1",
      "Gammel kongevej 1",
      "Gammel Kongevej 1",
    ]);
  });

  it("uppercases house number letters and skips duplicates", () => {
    expect(casingVariants("Strandvejen 100a, 2900")).toEqual(["Strandvejen 100A, 2900"]);
    expect(casingVariants("ÅBOULEVARDEN 2")).toEqual(["ÅBOULEVARDEN 2", "Åboulevarden 2"]);
  });
});

describe("mergeSuggestions", () => {
  it("merges answers without duplicates and keeps the order", () => {
    const node = (id: string, text: string) => ({ id_lokalId: id, adgangsadressebetegnelse: text });
    expect(
      mergeSuggestions(
        [
          { DAR_Husnummer: { nodes: [node("a", "Egevej 5, 4030 Tune")] } },
          { DAR_Husnummer: { nodes: [node("a", "Egevej 5, 4030 Tune"), node("b", "Egevej 5, 4060 Kirke Såby")] } },
          {},
        ],
        8,
      ),
    ).toEqual([
      { id: "a", text: "Egevej 5, 4030 Tune" },
      { id: "b", text: "Egevej 5, 4060 Kirke Såby" },
    ]);
  });
});
