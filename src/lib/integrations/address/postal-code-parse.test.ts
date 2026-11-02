import { describe, expect, it } from "vitest";

import { cityFromResponse } from "./postal-code-parse";

describe("cityFromResponse", () => {
  it("returns the name once when DAR returns several versions", () => {
    const data = {
      DAR_Postnummer: {
        nodes: [
          { postnr: "2100", navn: "København Ø" },
          { postnr: "2100", navn: "København Ø" },
        ],
      },
    };
    expect(cityFromResponse("2100", data)).toBe("København Ø");
  });

  it("returns undefined for unknown codes and odd answers", () => {
    expect(cityFromResponse("0001", { DAR_Postnummer: { nodes: [] } })).toBeUndefined();
    expect(cityFromResponse("0001", {})).toBeUndefined();
    expect(
      cityFromResponse("2100", { DAR_Postnummer: { nodes: [{ postnr: "8000", navn: "Aarhus C" }] } }),
    ).toBeUndefined();
    expect(
      cityFromResponse("2100", { DAR_Postnummer: { nodes: [{ postnr: "2100", navn: null }] } }),
    ).toBeUndefined();
  });
});
