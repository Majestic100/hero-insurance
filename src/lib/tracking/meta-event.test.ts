import { describe, expect, it } from "vitest";

import { buildMetaLeadEvent, normalizeForMeta, sha256 } from "./meta-event";

describe("buildMetaLeadEvent", () => {
  const input = {
    eventId: "11111111-1111-4111-8111-111111111111",
    eventTime: new Date("2026-11-02T12:00:00Z"),
    sourceUrl: "https://example.dk/tilbud?trin=afslut",
    email: " Test@Example.DK ",
    phone: "12345678",
    insuranceTypes: ["car", "house"],
    fbc: "fb.1.1700000000000.abc",
    fbp: "fb.1.1700000000000.123",
    ipAddress: "192.0.2.1",
    userAgent: "Mozilla/5.0",
  };

  it("normalizes e-mail and adds the Danish country code to phones", () => {
    expect(normalizeForMeta(" Test@Example.DK ", "12345678")).toEqual({
      email: "test@example.dk",
      phone: "4512345678",
    });
  });

  it("hashes contact data and keeps the shared event id", () => {
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
        fbc: input.fbc,
        fbp: input.fbp,
        client_ip_address: input.ipAddress,
        client_user_agent: input.userAgent,
      },
      custom_data: { content_category: "car,house" },
    });
    // No clear-text contact data anywhere in the event.
    const json = JSON.stringify(event);
    expect(json).not.toContain("example.dk\"");
    expect(json).not.toContain("12345678\"");
    expect(event.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/);
  });

  it("leaves out ids that are missing", () => {
    const event = buildMetaLeadEvent({ ...input, fbc: undefined, ipAddress: undefined });
    expect(event.user_data).not.toHaveProperty("fbc");
    expect(event.user_data).not.toHaveProperty("client_ip_address");
  });
});
