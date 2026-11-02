import { afterEach, describe, expect, it, vi } from "vitest";

import { fieldLookupUrl, runFieldLookup } from "./field-lookup";

describe("fieldLookupUrl", () => {
  it("looks up complete plates only, normalized", () => {
    expect(fieldLookupUrl("dk-license-plate", "ab 12 345")).toBe("/api/nummerplade/AB12345");
    expect(fieldLookupUrl("dk-license-plate", "æø 1")).toBe(
      `/api/nummerplade/${encodeURIComponent("ÆØ1")}`,
    );
    expect(fieldLookupUrl("dk-license-plate", "A")).toBeUndefined();
    expect(fieldLookupUrl("dk-license-plate", "")).toBeUndefined();
  });
});

describe("runFieldLookup", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows the vehicle, and remembers it", async () => {
    const fetchMock = vi.fn(async () => Response.json({ description: "Toyota Yaris 1.0 (2018)" }));
    vi.stubGlobal("fetch", fetchMock);
    const url = "/api/nummerplade/AB12345";
    expect(await runFieldLookup("dk-license-plate", url)).toEqual({
      status: "found",
      text: "Toyota Yaris 1.0 (2018)",
    });
    await runFieldLookup("dk-license-plate", url);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("gives a hint for unknown plates", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 404 })));
    expect(await runFieldLookup("dk-license-plate", "/api/nummerplade/ZZ99999")).toMatchObject({
      status: "not-found",
    });
  });

  it("says nothing when the lookup is unavailable, and tries again later", async () => {
    const url = "/api/nummerplade/CD12345";
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 503 })));
    expect(await runFieldLookup("dk-license-plate", url)).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("offline"); }));
    expect(await runFieldLookup("dk-license-plate", url)).toBeUndefined();
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ description: "Ford Fiesta" })));
    expect(await runFieldLookup("dk-license-plate", url)).toMatchObject({ status: "found" });
  });
});
