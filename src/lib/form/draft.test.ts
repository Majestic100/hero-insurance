import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { draftableValues } from "./draft";

describe("draftableValues", () => {
  it("keeps answers but drops personal data and consents", () => {
    const values = {
      insuranceTypes: ["car"],
      car: { coverage: "comprehensive" },
      firstName: "Sinan",
      email: "sinan@example.dk",
      phone: "12345678",
      birthYear: 1985,
      consentPartnerContact: true,
      consentMarketing: true,
    };
    expect(draftableValues(formConfig, values)).toEqual({
      insuranceTypes: ["car"],
      car: { coverage: "comprehensive" },
    });
    // The input is not changed.
    expect(values.firstName).toBe("Sinan");
  });
});
