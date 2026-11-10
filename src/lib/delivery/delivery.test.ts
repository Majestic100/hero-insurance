import { describe, expect, it } from "vitest";

import { buildDeliveryPayload, type StoredLead } from "./payload";
import { MAX_ATTEMPTS, nextRetryAt } from "./retry";
import { PARTNER_ID_PATTERN, routeLead } from "./routing";
import { signDelivery, verifyDeliverySignature } from "./signature";

describe("routeLead", () => {
  const partners = [
    { id: "alpha", name: "Alpha", insuranceTypes: ["car", "house"] as const },
    { id: "beta", name: "Beta", insuranceTypes: ["life"] as const },
  ];

  it("gives each partner only the selected types it covers", () => {
    expect(routeLead(partners, ["house", "car", "travel"])).toEqual([
      { partner_id: "alpha", insurance_types: ["house", "car"] },
    ]);
  });

  it("routes to nobody when no partner covers the types", () => {
    expect(routeLead(partners, ["boat"])).toEqual([]);
    expect(routeLead([], ["car"])).toEqual([]);
  });

  it("sends to at most three partners, covering every type first", () => {
    const many = [
      { id: "p1", name: "P1", insuranceTypes: ["car"] as const },
      { id: "p2", name: "P2", insuranceTypes: ["car"] as const },
      { id: "p3", name: "P3", insuranceTypes: ["car"] as const },
      { id: "p4", name: "P4", insuranceTypes: ["boat"] as const },
      { id: "p5", name: "P5", insuranceTypes: ["car", "boat"] as const },
    ];
    // Car only: the first three by priority.
    expect(routeLead(many, ["car"]).map((d) => d.partner_id)).toEqual(["p1", "p2", "p3"]);
    // Car and boat: p4 is taken so the boat is covered, then filled by priority.
    expect(routeLead(many, ["car", "boat"]).map((d) => d.partner_id)).toEqual(["p1", "p2", "p4"]);
    expect(routeLead(many, ["car"], 1)).toEqual([{ partner_id: "p1", insurance_types: ["car"] }]);
  });

  it("matches the database's partner id rule", () => {
    expect(PARTNER_ID_PATTERN.test("tryg_2")).toBe(true);
    expect(PARTNER_ID_PATTERN.test("Tryg")).toBe(false);
    expect(PARTNER_ID_PATTERN.test("a")).toBe(false);
  });
});

describe("nextRetryAt", () => {
  const now = new Date("2026-11-02T12:00:00Z");

  it("waits a minute after the first attempt, longer after later ones", () => {
    expect(nextRetryAt(1, now)?.toISOString()).toBe("2026-11-02T12:01:00.000Z");
    expect(nextRetryAt(2, now)?.toISOString()).toBe("2026-11-02T12:05:00.000Z");
  });

  it("gives up after the last attempt", () => {
    expect(nextRetryAt(MAX_ATTEMPTS - 1, now)).not.toBeNull();
    expect(nextRetryAt(MAX_ATTEMPTS, now)).toBeNull();
  });
});

describe("delivery signature", () => {
  const secret = "s".repeat(32);
  const body = '{"lead_id":"x"}';
  const now = new Date("2026-11-02T12:00:00Z");

  it("verifies a signature made with the same secret and body", () => {
    const header = signDelivery(secret, body, now);
    expect(header).toMatch(/^t=\d+,v1=[0-9a-f]{64}$/);
    expect(verifyDeliverySignature(secret, body, header, now)).toBe(true);
  });

  it("rejects another body, another secret and old timestamps", () => {
    const header = signDelivery(secret, body, now);
    expect(verifyDeliverySignature(secret, `${body} `, header, now)).toBe(false);
    expect(verifyDeliverySignature("t".repeat(32), body, header, now)).toBe(false);
    const later = new Date(now.getTime() + 301_000);
    expect(verifyDeliverySignature(secret, body, header, later)).toBe(false);
    expect(verifyDeliverySignature(secret, body, "nonsense", now)).toBe(false);
  });
});

describe("buildDeliveryPayload", () => {
  const lead: StoredLead = {
    id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-11-02T12:00:00+00:00",
    first_name: "Søren",
    last_name: "Hansen",
    email: "soren@example.dk",
    phone: "12345678",
    street_address: "Vej 1",
    postal_code: "2100",
    city: "København Ø",
    birth_year: 1980,
    rki_status: "no",
    membership: null,
    lead_insurances: [
      { insurance_type: "car", answers: { plate: "AB12345" }, form_version: "v1" },
      { insurance_type: "life", answers: { payout: "1m" }, form_version: "v1" },
    ],
    consents: [
      {
        consent_type: "partner_contact",
        granted: true,
        consent_text: "Jeg giver samtykke ...",
        consent_version: "2026-11-01.1",
        recorded_at: "2026-11-02T12:00:00+00:00",
      },
      {
        consent_type: "marketing",
        granted: true,
        consent_text: "Ja tak ...",
        consent_version: "2026-11-01.1",
        recorded_at: "2026-11-02T12:00:00+00:00",
      },
    ],
  };

  it("contains only the routed types and the partner consent", () => {
    const payload = buildDeliveryPayload("d1", ["car"], lead);
    expect(payload).toMatchObject({
      schema_version: 1,
      delivery_id: "d1",
      lead_id: lead.id,
      contact: { first_name: "Søren", birth_year: 1980 },
      insurances: [{ type: "car", answers: { plate: "AB12345" } }],
      consent: { version: "2026-11-01.1", text: "Jeg giver samtykke ..." },
    });
    expect(payload.insurances).toHaveLength(1);
    expect(JSON.stringify(payload)).not.toContain("Ja tak");
  });

  it("refuses a lead without partner consent", () => {
    const declined = {
      ...lead,
      consents: [{ ...lead.consents[0], granted: false }],
    };
    expect(() => buildDeliveryPayload("d1", ["car"], declined)).toThrow();
  });
});
