import { describe, expect, it } from "vitest";

import { buildGhlContactPayload, parseGhlFeedback } from "./payload";

const LEAD_ID = "11111111-1111-4111-8111-111111111111";

describe("buildGhlContactPayload", () => {
  it("sends the whole lead, with a readable summary", () => {
    const payload = buildGhlContactPayload({
      id: LEAD_ID,
      created_at: "2026-11-10T12:00:00Z",
      first_name: "Test",
      last_name: "Testesen",
      email: "test@example.dk",
      phone: "12345678",
      street_address: "Testvej 1",
      postal_code: "2100",
      city: "København Ø",
      birth_year: 1985,
      rki_status: "no",
      insurances: [
        {
          insurance_type: "car",
          answers: {
            hasLicensePlate: "yes",
            licensePlate: "AB12345",
            mainDriver: "me",
            annualMileage: "under_10000",
            coverage: "comprehensive",
            claimFreeYears: "6_plus",
            registry: {
              licensePlate: {
                vehicle: { make: "Toyota", model: "Yaris", variant: "1.0", modelYear: 2018 },
              },
            },
          },
        },
        { insurance_type: "spaceship", answers: {} },
      ],
      marketing_consent: false,
    });
    expect(payload).toMatchObject({
      lead_id: LEAD_ID,
      phone: "+4512345678",
      insurance_types: "Bil",
      insurance_type_codes: "car",
      address: "Testvej 1",
      postal_code: "2100",
      city: "København Ø",
      birth_year: "1985",
      rki: "Nej",
      marketing_consent: false,
      source: "nemforsikringstilbud",
    });
    expect(payload.answers_summary).toContain("Bilforsikring");
    expect(payload.answers_summary).toContain("- Hvor meget kører bilen om året?: Under 10.000 km");
    expect(payload.answers_summary).toContain("- Hvilken dækning ønsker du?: Ansvar og kasko");
    expect(payload.answers_summary).toContain("- Fra Motorregistret: Toyota Yaris 1.0 (årgang 2018)");
    expect(payload.answers_summary).not.toContain("spaceship");
    expect(JSON.parse(payload.answers_json).car.annualMileage).toBe("under_10000");
  });
});

describe("parseGhlFeedback", () => {
  it("reads answers from customData, in Danish", () => {
    expect(
      parseGhlFeedback({
        contact_id: "abc",
        customData: { lead_id: LEAD_ID, contacted: "Ja", quoted: "Nej", satisfaction: "4 - Tilfreds" },
      }),
    ).toEqual({ leadId: LEAD_ID, contacted: true, quoted: false, satisfaction: 4 });
  });

  it("reads answers at the top level, and leaves unknown answers empty", () => {
    expect(parseGhlFeedback({ lead_id: LEAD_ID, satisfaction: 5, contacted: "måske" })).toEqual({
      leadId: LEAD_ID,
      contacted: null,
      quoted: null,
      satisfaction: 5,
    });
  });

  it("rejects a missing or invalid lead id, or no answers at all", () => {
    expect(parseGhlFeedback({ contacted: "Ja" })).toBeNull();
    expect(parseGhlFeedback({ lead_id: "not-a-uuid", contacted: "Ja" })).toBeNull();
    expect(parseGhlFeedback({ lead_id: LEAD_ID })).toBeNull();
    expect(parseGhlFeedback("nonsense")).toBeNull();
  });
});
