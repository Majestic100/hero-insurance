import { afterEach, describe, expect, it, vi } from "vitest";

import type { FieldConfig, StepConfig } from "@/config/forms/types";
import {
  fitsField,
  getAutofillRequests,
  mayAutofill,
  runAutofill,
  splitAddress,
} from "./autofill";

const ADDRESS_ID = "0a3f5081-1b18-32b8-e044-0003ba298018";
const picked = { text: "Egevej 5, 4030 Tune", id: ADDRESS_ID };

const contact: StepConfig = {
  id: "kontakt",
  title: "Kontakt",
  fields: [
    {
      type: "text",
      name: "streetAddress",
      label: "Adresse",
      autofill: { from: ["house.address", "home_contents.address"], lookup: "address-street" },
    },
    {
      type: "text",
      name: "postalCode",
      label: "Postnummer",
      format: "postal-code-dk",
      autofill: { from: "house.address", lookup: "address-postal-code" },
    },
    {
      type: "text",
      name: "city",
      label: "By",
      autofill: { from: "postalCode", lookup: "dk-postal-code-city" },
    },
  ],
};

const house: StepConfig = {
  id: "hus",
  title: "Hus",
  insuranceType: "house",
  fields: [
    { type: "address", name: "address", label: "Adresse" },
    {
      type: "year",
      name: "buildYear",
      label: "Byggeår",
      minYear: 1600,
      autofill: { from: "address", lookup: "bbr-build-year" },
    },
    {
      type: "single-choice",
      name: "roofType",
      label: "Tag",
      options: [
        { value: "tiles", label: "Tegl" },
        { value: "other", label: "Andet" },
      ],
      autofill: { from: "address", lookup: "bbr-roof-type" },
    },
  ],
};

describe("getAutofillRequests", () => {
  it("asks for the city once the postal code has 4 digits", () => {
    expect(getAutofillRequests(contact, [contact.fields[2]], { postalCode: " 2100 " })).toEqual([
      { target: "city", lookup: "dk-postal-code-city", url: "/api/postnummer/2100" },
    ]);
  });

  it("does nothing for incomplete or invalid codes", () => {
    for (const postalCode of [undefined, "", "210", "21000", "21a0"]) {
      expect(getAutofillRequests(contact, [contact.fields[2]], { postalCode })).toEqual([]);
    }
  });

  it("asks BBR only for an address picked from the list", () => {
    const urls = (address: unknown) =>
      getAutofillRequests(house, house.fields, { house: { address } }).map((r) => r.url);
    expect(urls(picked)).toEqual([`/api/bbr/${ADDRESS_ID}`, `/api/bbr/${ADDRESS_ID}`]);
    expect(urls({ text: "Egevej 5, 4030 Tune" })).toEqual([]);
    expect(urls(undefined)).toEqual([]);
  });

  it("reuses the home address in the contact step while that insurance is selected", () => {
    const values = { insuranceTypes: ["house"], house: { address: picked } };
    expect(getAutofillRequests(contact, contact.fields.slice(0, 2), values)).toEqual([
      { target: "streetAddress", lookup: "address-street", value: "Egevej 5" },
      { target: "postalCode", lookup: "address-postal-code", value: "4030" },
    ]);
    // House deselected: its address no longer counts.
    expect(
      getAutofillRequests(contact, contact.fields.slice(0, 2), { ...values, insuranceTypes: ["car"] }),
    ).toEqual([]);
  });

  it("takes the first filled-in source", () => {
    const values = {
      insuranceTypes: ["house", "home_contents"],
      house: { address: undefined },
      home_contents: { address: { text: "Strandvejen 100, 2900 Hellerup", id: ADDRESS_ID } },
    };
    expect(getAutofillRequests(contact, [contact.fields[0]], values)).toEqual([
      { target: "streetAddress", lookup: "address-street", value: "Strandvejen 100" },
    ]);
  });
});

describe("splitAddress", () => {
  it("splits addresses picked from the list, also with a district", () => {
    expect(splitAddress({ text: "Strandvejen 100, Reersø, 4281 Gørlev", id: ADDRESS_ID })).toEqual({
      street: "Strandvejen 100",
      postalCode: "4281",
      city: "Gørlev",
    });
  });

  it("leaves typed addresses alone", () => {
    expect(splitAddress({ text: "Egevej 5, 4030 Tune" })).toBeUndefined();
    expect(splitAddress({ text: "Egevej 5", id: ADDRESS_ID })).toBeUndefined();
  });
});

describe("mayAutofill", () => {
  it("fills empty fields and its own earlier value", () => {
    expect(mayAutofill(undefined, undefined)).toBe(true);
    expect(mayAutofill("  ", undefined)).toBe(true);
    expect(mayAutofill("København Ø", "København Ø")).toBe(true);
    expect(mayAutofill(1964, 1964)).toBe(true);
  });

  it("never overwrites what the user typed", () => {
    expect(mayAutofill("Østerbro", undefined)).toBe(false);
    expect(mayAutofill("Østerbro", "København Ø")).toBe(false);
    expect(mayAutofill(1970, 1964)).toBe(false);
  });
});

describe("fitsField", () => {
  const [, year, roof] = house.fields;
  const area: FieldConfig = { type: "number", name: "a", label: "A", min: 20, max: 2000 };

  it("accepts only values the field allows", () => {
    expect(fitsField(year, 1964)).toBe(true);
    expect(fitsField(year, 1200)).toBe(false);
    expect(fitsField(year, new Date().getFullYear() + 1)).toBe(false);
    expect(fitsField(area, 124)).toBe(true);
    expect(fitsField(area, 5)).toBe(false);
    expect(fitsField(area, "124")).toBe(false);
    expect(fitsField(roof, "tiles")).toBe(true);
    expect(fitsField(roof, "thatch")).toBe(false);
  });
});

describe("runAutofill", () => {
  afterEach(() => vi.unstubAllGlobals());

  const city = (url: string) => ({ target: "city", lookup: "dk-postal-code-city", url }) as const;

  it("returns the city and remembers it", async () => {
    const fetchMock = vi.fn(async () => Response.json({ city: "Aarhus C" }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await runAutofill(city("/api/postnummer/8000"))).toBe("Aarhus C");
    expect(await runAutofill(city("/api/postnummer/8000"))).toBe("Aarhus C");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shares one call between the BBR facts", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({ buildYear: 1964, livingArea: 124, roofType: "fiber_cement" }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const url = `/api/bbr/${ADDRESS_ID}`;
    const [year, roof] = await Promise.all([
      runAutofill({ target: "buildYear", lookup: "bbr-build-year", url }),
      runAutofill({ target: "roofType", lookup: "bbr-roof-type", url }),
    ]);
    expect([year, roof]).toEqual([1964, "fiber_cement"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns undefined for unknown codes and failures, without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 404 })));
    expect(await runAutofill(city("/api/postnummer/0001"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 503 })));
    expect(await runAutofill(city("/api/postnummer/0002"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("offline"); }));
    expect(await runAutofill(city("/api/postnummer/0003"))).toBeUndefined();
  });

  it("does not remember failures, so a later try can succeed", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 503 })));
    expect(await runAutofill(city("/api/postnummer/5000"))).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ city: "Odense C" })));
    expect(await runAutofill(city("/api/postnummer/5000"))).toBe("Odense C");
  });

  it("returns derived values directly", async () => {
    expect(await runAutofill({ target: "streetAddress", lookup: "address-street", value: "Egevej 5" })).toBe(
      "Egevej 5",
    );
  });
});
