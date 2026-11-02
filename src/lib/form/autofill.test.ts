import { afterEach, describe, expect, it, vi } from "vitest";

import type { StepConfig } from "@/config/forms/types";
import { fetchAutofill, getAutofillRequests, mayAutofill } from "./autofill";

const step: StepConfig = {
  id: "kontakt",
  title: "Kontakt",
  fields: [
    { type: "text", name: "postalCode", label: "Postnummer", format: "postal-code-dk" },
    {
      type: "text",
      name: "city",
      label: "By",
      autofill: { from: "postalCode", lookup: "dk-postal-code-city" },
    },
  ],
};

describe("getAutofillRequests", () => {
  it("asks for the city once the postal code has 4 digits", () => {
    expect(getAutofillRequests(step, step.fields, { postalCode: " 2100 " })).toEqual([
      { target: "city", lookup: "dk-postal-code-city", url: "/api/postnummer/2100" },
    ]);
  });

  it("does nothing for incomplete or invalid codes", () => {
    for (const postalCode of [undefined, "", "210", "21000", "21a0"]) {
      expect(getAutofillRequests(step, step.fields, { postalCode })).toEqual([]);
    }
  });

  it("skips fields that are not shown", () => {
    expect(getAutofillRequests(step, [step.fields[0]], { postalCode: "2100" })).toEqual([]);
  });

  it("reads the source from the step's insurance namespace", () => {
    const nested: StepConfig = { ...step, insuranceType: "house" };
    expect(
      getAutofillRequests(nested, nested.fields, { house: { postalCode: "8000" } }),
    ).toHaveLength(1);
  });
});

describe("mayAutofill", () => {
  it("fills empty fields and its own earlier value", () => {
    expect(mayAutofill(undefined, undefined)).toBe(true);
    expect(mayAutofill("  ", undefined)).toBe(true);
    expect(mayAutofill("København Ø", "København Ø")).toBe(true);
  });

  it("never overwrites what the user typed", () => {
    expect(mayAutofill("Østerbro", undefined)).toBe(false);
    expect(mayAutofill("Østerbro", "København Ø")).toBe(false);
  });
});

describe("fetchAutofill", () => {
  afterEach(() => vi.unstubAllGlobals());

  const request = (url: string) =>
    ({ target: "city", lookup: "dk-postal-code-city", url }) as const;

  it("returns the city and remembers it", async () => {
    const fetchMock = vi.fn(async () => Response.json({ city: "Aarhus C" }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchAutofill(request("/api/postnummer/8000"))).toBe("Aarhus C");
    expect(await fetchAutofill(request("/api/postnummer/8000"))).toBe("Aarhus C");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns undefined for unknown codes and failures, without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 404 })));
    expect(await fetchAutofill(request("/api/postnummer/0001"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 503 })));
    expect(await fetchAutofill(request("/api/postnummer/0002"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("offline"); }));
    expect(await fetchAutofill(request("/api/postnummer/0003"))).toBeUndefined();
  });

  it("does not remember failures, so a later try can succeed", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 503 })));
    expect(await fetchAutofill(request("/api/postnummer/5000"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ city: "Odense C" })));
    expect(await fetchAutofill(request("/api/postnummer/5000"))).toBe("Odense C");
  });
});
