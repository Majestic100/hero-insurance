import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import type { FormConfig } from "@/config/forms/types";
import {
  buildDefaultValues,
  buildFormSchema,
  buildStepSchema,
  findFirstInvalidStep,
} from "./build-schema";

const selectionStep = formConfig.steps[0];

describe("buildStepSchema", () => {
  it("requires at least one insurance type with a Danish message", () => {
    const result = buildStepSchema(selectionStep).safeParse({
      insuranceTypes: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Vælg mindst én forsikring.");
    expect(result.error?.issues[0]?.path).toEqual(["insuranceTypes"]);
  });

  it("rejects values that are not options", () => {
    const result = buildStepSchema(selectionStep).safeParse({
      insuranceTypes: ["spaceship"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid selection", () => {
    const result = buildStepSchema(selectionStep).safeParse({
      insuranceTypes: ["car", "house"],
    });
    expect(result.success).toBe(true);
  });
});

describe("buildFormSchema", () => {
  it("nests insurance-specific fields under their type", () => {
    const config: FormConfig = {
      version: "test",
      steps: [
        selectionStep,
        {
          id: "bil",
          title: "Bil",
          insuranceType: "car",
          fields: [
            {
              type: "multi-choice",
              name: "extras",
              label: "Tilvalg",
              options: [{ value: "glass", label: "Glas" }],
              minSelected: 1,
            },
          ],
        },
      ],
    };

    const schema = buildFormSchema(config, ["car"]);
    expect(
      schema.safeParse({ insuranceTypes: ["car"], car: { extras: ["glass"] } })
        .success,
    ).toBe(true);
    expect(
      schema.safeParse({ insuranceTypes: ["car"], car: { extras: [] } }).success,
    ).toBe(false);

    // A type that is not selected is not validated.
    const withoutCar = buildFormSchema(config, []);
    expect(withoutCar.safeParse({ insuranceTypes: ["house"] }).success).toBe(
      true,
    );
  });
});

describe("buildDefaultValues", () => {
  it("creates empty values and a namespace per insurance type", () => {
    expect(buildDefaultValues(formConfig)).toEqual({
      insuranceTypes: [],
      ...Object.fromEntries(INSURANCE_TYPES.map((type) => [type, {}])),
    });
  });

  it("passes every step schema except the empty selection", () => {
    const values = buildDefaultValues(formConfig);
    expect(findFirstInvalidStep(formConfig.steps, values)).toBe(0);

    values.insuranceTypes = ["car"];
    expect(findFirstInvalidStep(formConfig.steps, values)).toBe(-1);
  });
});
