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

  it("rejects a car step with missing answers", () => {
    const result = parse("bil", { hasLicensePlate: "yes" });
    expect(result.success).toBe(false);
  });
});
