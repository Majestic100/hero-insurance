import { describe, expect, it } from "vitest";

import { buildMetaLeadEvent, normalizeForMeta, sha256 } from "./meta-event";

const input = {
  eventId: "11111111-1111-4111-8111-111111111111",
  eventTime: new Date("2026-11-02T12:00:00Z"),
  sourceUrl: "https://example.dk/tilbud?trin=afslut",
  email: " Test@Example.DK ",
  phone: "12345678",
  firstName: " Søren ",
  lastName: "Ager-Ødegaard",
  postalCode: "2100",
  city: "København Ø",
  insuranceTypes: ["car", "house"],
  fbc: "fb.1.1700000000000.abc",
  fbp: "fb.1.1700000000000.123",
  ipAddress: "192.0.2.1",
  userAgent: "Mozilla/5.0",
};

describe("normalizeForMeta", () => {
  it("follows Meta's rules and keeps Danish letters", () => {
    expect(normalizeForMeta(input)).toEqual({
      email: "test@example.dk",
      phone: "4512345678",
      firstName: "søren",
      lastName: "agerødegaard",
      postalCode: "2100",
      city: "københavnø",
    });
  });
});

describe("buildMetaLeadEvent", () => {
  it("hashes every match key and keeps the shared event id", () => {
    const event = buildMetaLeadEvent(input);
    expect(event).toMatchObject({
      event_name: "Lead",
      event_id: input.eventId,
      event_time: 1793620800,
      action_source: "website",
      event_source_url: input.sourceUrl,
      user_data: {
        em: [sha256("test@example.dk")],
        ph: [sha256("4512345678")],
        fn: [sha256("søren")],
        ln: [sha256("agerødegaard")],
        zp: [sha256("2100")],
        ct: [sha256("københavnø")],
        country: [sha256("dk")],
        external_id: [sha256(input.eventId)],
        fbc: input.fbc,
        fbp: input.fbp,
        client_ip_address: input.ipAddress,
        client_user_agent: input.userAgent,
      },
      custom_data: { content_category: "car,house" },
    });
  });

  it("sends no contact data in clear text", () => {
    const json = JSON.stringify(buildMetaLeadEvent(input).user_data);
    for (const clear of ["example.dk", "12345678", "Søren", "søren", "Ødegaard", "København"]) {
      expect(json, clear).not.toContain(clear);
    }
  });

  it("leaves out ids that are missing", () => {
    const event = buildMetaLeadEvent({ ...input, fbc: undefined, ipAddress: undefined });
    expect(event.user_data).not.toHaveProperty("fbc");
    expect(event.user_data).not.toHaveProperty("client_ip_address");
  });
});
