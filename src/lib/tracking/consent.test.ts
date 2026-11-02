import { describe, expect, it } from "vitest";

import { parseConsent, readCookie, serializeConsent } from "./consent";

describe("consent cookie", () => {
  it("round-trips both choices", () => {
    for (const marketing of [true, false]) {
      expect(parseConsent(serializeConsent({ marketing }))).toEqual({ marketing });
    }
  });

  it("treats missing, garbage and old versions as no choice", () => {
    expect(parseConsent(undefined)).toBeUndefined();
    expect(parseConsent("yes")).toBeUndefined();
    expect(parseConsent("v0.marketing-1")).toBeUndefined();
  });

  it("reads one cookie from a Cookie header", () => {
    const header = "_fbp=fb.1.1.2; hi_consent=v1.marketing-1; other=a%3Db";
    expect(readCookie(header, "hi_consent")).toBe("v1.marketing-1");
    expect(readCookie(header, "other")).toBe("a=b");
    expect(readCookie(header, "_fbc")).toBeUndefined();
    expect(readCookie(null, "hi_consent")).toBeUndefined();
  });
});
