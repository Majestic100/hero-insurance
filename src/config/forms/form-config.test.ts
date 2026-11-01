import { describe, expect, it } from "vitest";

import { buildStepSchema } from "@/lib/schemas/build-schema";
import { formConfig } from "./index";
import type { FieldConfig, StepConfig } from "./types";

const steps: readonly StepConfig[] = formConfig.steps;

function stepById(id: string): StepConfig {
  const step = steps.find((candidate) => candidate.id === id);
  if (!step) {
    throw new Error(`No step ${id}`);
  }
  return step;
}

function hasOptions(
  field: FieldConfig,
): field is Extract<FieldConfig, { options: unknown }> {
  return "options" in field;
}

describe("form config integrity", () => {
  it("has unique field names within each step", () => {
    for (const step of steps) {
      const names = step.fields.map((field) => field.name);
      expect(new Set(names).size, step.id).toBe(names.length);
    }
  });

  it("only uses showIf on earlier choice fields with real option values", () => {
    for (const step of steps) {
      step.fields.forEach((field, index) => {
        if (!field.showIf) {
          return;
        }
        const parentIndex = step.fields.findIndex(
          (candidate) => candidate.name === field.showIf?.field,
        );
        const parent = step.fields[parentIndex];
        const where = `${step.id}.${field.name}`;
        expect(parentIndex, where).toBeGreaterThanOrEqual(0);
        expect(parentIndex, where).toBeLessThan(index);
        expect(hasOptions(parent), where).toBe(true);

        const allowed = hasOptions(parent)
          ? parent.options.map((option) => option.value)
          : [];
        const expected =
          typeof field.showIf.equals === "string"
            ? [field.showIf.equals]
            : field.showIf.equals;
        for (const value of expected) {
          expect(allowed, where).toContain(value);
        }
      });
    }
  });
});

describe("insurance steps accept a realistic answer", () => {
  function parse(stepId: string, answers: Record<string, unknown>) {
    const step = stepById(stepId);
    const values = { [step.insuranceType as string]: answers };
    return buildStepSchema(step, values).safeParse(values);
  }

  it("car, with and without a license plate", () => {
    const withPlate = parse("bil", {
      hasLicensePlate: "yes",
      licensePlate: "ab 12 345",
      mainDriver: "me",
      annualMileage: "10000_15000",
      coverage: "comprehensive",
      claimFreeYears: "6_plus",
    });
    expect(withPlate.success).toBe(true);
    expect(withPlate.data?.car).toMatchObject({ licensePlate: "AB12345" });

    const withoutPlate = parse("bil", {
      hasLicensePlate: "no",
      makeAndModel: "Toyota Yaris",
      modelYear: 2021,
      mainDriver: "someone_else",
      mainDriverBirthYear: 1990,
      annualMileage: "under_10000",
      coverage: "unknown",
      claimFreeYears: "0",
      currentInsurer: "tryg",
    });
    expect(withoutPlate.success).toBe(true);
  });

  it("home contents", () => {
    const result = parse("indbo", {
      residenceType: "apartment",
      tenure: "tenant",
      livingArea: 72,
      householdSize: "2",
      sumInsured: "under_500000",
    });
    expect(result.success).toBe(true);
  });

  it("house", () => {
    const result = parse("hus", {
      livingArea: 140,
      buildYear: 1975,
      roofType: "tiles",
    });
    expect(result.success).toBe(true);
  });

  it.each([
    [
      "ulykke-sundhed",
      {
        coverageTypes: ["accident", "health"],
        insuredPersons: "me",
        occupation: "office",
      },
    ],
    ["rejse", { tripType: "annual", area: "worldwide", travellers: "family" }],
    [
      "fritidshus",
      { livingArea: 70, buildYear: 1980, roofType: "thatch", rentedOut: "no" },
    ],
    [
      "mc-atv-knallert",
      { vehicleType: "moped_30", coverage: "liability", claimFreeYears: "0" },
    ],
    [
      "baad",
      { boatType: "sailboat", lengthFeet: 28, value: "50000_200000" },
    ],
    [
      "camping",
      { caravanType: "motorhome", modelYear: 2015, value: "over_400000" },
    ],
    [
      "dyr",
      {
        animal: "cat",
        breed: "Blanding",
        birthYear: 2022,
        coverageTypes: ["illness"],
      },
    ],
    ["liv", { payout: "unknown", purpose: "mortgage" }],
    [
      "ejerskifte",
      {
        role: "seller",
        salePrice: 3500000,
        buildYear: 1975,
        livingArea: 140,
        conditionReport: "yes",
      },
    ],
  ])("%s", (stepId, answers) => {
    expect(parse(stepId, answers).success).toBe(true);
  });

  it("has questions for every insurance type", () => {
    for (const step of steps.filter((candidate) => candidate.insuranceType)) {
      expect(step.fields.length, step.id).toBeGreaterThan(0);
    }
  });

  it("rejects a car step with missing answers", () => {
    const result = parse("bil", { hasLicensePlate: "yes" });
    expect(result.success).toBe(false);
  });

  it("asks dog and horse owners about liability, but not cat owners", () => {
    const dog = parse("dyr", {
      animal: "dog",
      breed: "Labrador",
      birthYear: 2020,
      coverageTypes: ["illness"],
    });
    expect(dog.success).toBe(false);
    expect(dog.error?.issues[0]?.path).toEqual(["pet", "liability"]);

    const cat = parse("dyr", {
      animal: "cat",
      breed: "Huskat",
      birthYear: 2020,
      coverageTypes: ["life"],
      liability: "yes",
    });
    expect(cat.success).toBe(true);
    // The hidden answer is dropped.
    expect(cat.data?.pet).not.toHaveProperty("liability");
  });
});

describe("contact and consent steps", () => {
  it("accept realistic answers", () => {
    const contact = stepById("kontakt");
    const values = {
      firstName: "Sinan",
      lastName: "Akdag",
      email: "Sinan@Example.dk",
      phone: "+45 12 34 56 78",
      streetAddress: "Testvej 1, 2. tv.",
      postalCode: "2100",
      city: "København Ø",
      birthYear: 1985,
    };
    const result = buildStepSchema(contact, values).safeParse(values);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      email: "sinan@example.dk",
      phone: "12345678",
    });
  });

  it("requires the partner consent but not marketing", () => {
    const consent = stepById("afslut");
    const declined = { consentPartnerContact: false, consentMarketing: false };
    expect(buildStepSchema(consent, declined).safeParse(declined).success).toBe(
      false,
    );
    const given = { consentPartnerContact: true, consentMarketing: false };
    expect(buildStepSchema(consent, given).safeParse(given).success).toBe(true);
  });
});
