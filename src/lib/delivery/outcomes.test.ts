import { describe, expect, it } from "vitest";

import { metaSkipReason, outcomeRequestSchema, outcomeTime } from "./outcomes";

const leadId = "33333333-3333-4333-8333-333333333333";
const now = new Date("2026-11-02T12:00:00Z");

describe("outcomeRequestSchema", () => {
  it("accepts known statuses with or without a time", () => {
    const result = outcomeRequestSchema.safeParse({
      outcomes: [
        { lead_id: leadId, status: "quoted" },
        { lead_id: leadId, status: "sold", occurred_at: "2026-11-02T10:00:00+01:00" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown statuses, bad ids and empty batches", () => {
    for (const outcomes of [
      [{ lead_id: leadId, status: "great" }],
      [{ lead_id: "123", status: "sold" }],
      [],
    ]) {
      expect(outcomeRequestSchema.safeParse({ outcomes }).success).toBe(false);
    }
  });
});

describe("outcomeTime", () => {
  it("defaults to now and never lies in the future", () => {
    expect(outcomeTime({ lead_id: leadId, status: "sold" }, now)).toEqual(now);
    expect(
      outcomeTime(
        { lead_id: leadId, status: "sold", occurred_at: "2027-01-01T00:00:00Z" },
        now,
      ),
    ).toEqual(now);
  });
});

describe("metaSkipReason", () => {
  const hourAgo = new Date(now.getTime() - 3_600_000);

  it("sends good outcomes with consent", () => {
    expect(metaSkipReason("quoted", hourAgo, true, now)).toBeNull();
  });

  it("skips bad outcomes, missing consent and events Meta would reject", () => {
    expect(metaSkipReason("invalid", hourAgo, true, now)).toBe("not_sent");
    expect(metaSkipReason("sold", hourAgo, false, now)).toBe("no_consent");
    const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 3_600_000);
    expect(metaSkipReason("sold", eightDaysAgo, true, now)).toBe("too_old");
  });
});
