import { describe, expect, it } from "vitest";

import { buildGhlContactPayload, parseGhlFeedback } from "./payload";

const LEAD_ID = "11111111-1111-4111-8111-111111111111";

describe("buildGhlContactPayload", () => {
  it("sends only contact details, the types and the lead id", () => {
    const payload = buildGhlContactPayload({
      id: LEAD_ID,
      created_at: "2026-11-10T12:00:00Z",
      first_name: "Test",
      last_name: "Testesen",
      email: "test@example.dk",
      phone: "12345678",
      insurance_types: ["car", "house", "spaceship"],
      marketing_consent: false,
    });
    expect(payload).toEqual({
      lead_id: LEAD_ID,
      submitted_at: "2026-11-10T12:00:00Z",
      first_name: "Test",
      last_name: "Testesen",
      email: "test@example.dk",
      phone: "+4512345678",
      insurance_types: "Bil, Hus",
      insurance_type_codes: "car,house",
      marketing_consent: false,
      source: "nemforsikringstilbud",
    });
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
