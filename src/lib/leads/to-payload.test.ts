import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { consentFields } from "@/config/forms/consents";
import { buildFormSchema } from "@/lib/schemas/build-schema";
import { toLeadPayload } from "./to-payload";

const raw = {
  insuranceTypes: ["travel", "car"],
  travel: { tripType: "annual", area: "europe", travellers: "me" },
  car: {
    hasLicensePlate: "yes",
    licensePlate: "ab 12 345",
    makeAndModel: "should be dropped",
    mainDriver: "me",
    annualMileage: "under_10000",
    coverage: "liability",
    claimFreeYears: "0",
  },
  // Not selected: must not end up in the payload.
  boat: { boatType: "sailboat" },
  firstName: " Test ",
  lastName: "Testesen",
  email: "Test@Example.DK",
  phone: "+45 12 34 56 78",
  streetAddress: "Testvej 1",
  postalCode: "2100",
  city: "København Ø",
  birthYear: 1985,
  consentPartnerContact: true,
  consentMarketing: false,
};

describe("toLeadPayload", () => {
  const parsed = buildFormSchema(formConfig, raw).parse(raw);
  const payload = toLeadPayload(formConfig, parsed, "11111111-1111-4111-8111-111111111111");

  it("maps normalized contact details to lead columns", () => {
    expect(payload).toMatchObject({
      submission_id: "11111111-1111-4111-8111-111111111111",
      first_name: "Test",
      last_name: "Testesen",
      email: "test@example.dk",
      phone: "12345678",
      street_address: "Testvej 1",
      postal_code: "2100",
      city: "København Ø",
      birth_year: 1985,
    });
  });

  it("has one insurance per selected type, with only the shown answers", () => {
    expect(payload.insurances.map((item) => item.insurance_type)).toEqual([
      "car",
      "travel",
    ]);
    const car = payload.insurances.find((item) => item.insurance_type === "car");
    expect(car?.answers).toMatchObject({ licensePlate: "AB12345" });
    expect(car?.answers).not.toHaveProperty("makeAndModel");
    expect(car?.form_version).toBe(formConfig.version);
  });

  it("stores every consent with the server's text and version", () => {
    expect(payload.consents).toEqual(
      consentFields.map((field) => ({
        consent_type: field.type === "consent" ? field.consentType : undefined,
        granted: field.name === "consentPartnerContact",
        consent_text: field.type === "consent" ? field.text : undefined,
        consent_version: field.type === "consent" ? field.version : undefined,
      })),
    );
  });
});
