import { describe, expect, it } from "vitest";

import type { StepConfig } from "@/config/forms/types";
import { getVisibleFields } from "./visibility";

const step: StepConfig = {
  id: "dyr",
  title: "Dyr",
  insuranceType: "pet",
  fields: [
    {
      type: "single-choice",
      name: "animal",
      label: "Dyr",
      options: [
        { value: "dog", label: "Hund" },
        { value: "cat", label: "Kat" },
      ],
    },
    {
      type: "multi-choice",
      name: "coverage",
      label: "Dækning",
      options: [
        { value: "illness", label: "Sygdom" },
        { value: "liability", label: "Ansvar" },
      ],
      showIf: { field: "animal", equals: ["dog", "horse"] },
    },
    {
      type: "text",
      name: "liabilityNote",
      label: "Note",
      showIf: { field: "coverage", equals: "liability" },
    },
  ],
};

const names = (values: Record<string, unknown>) =>
  getVisibleFields(step, { pet: values }).map((field) => field.name);

describe("getVisibleFields", () => {
  it("shows a field when the condition matches one of several values", () => {
    expect(names({ animal: "dog" })).toEqual(["animal", "coverage"]);
    expect(names({ animal: "cat" })).toEqual(["animal"]);
    expect(names({})).toEqual(["animal"]);
  });

  it("matches multi-choice values and follows chains of conditions", () => {
    expect(names({ animal: "dog", coverage: ["liability"] })).toEqual([
      "animal",
      "coverage",
      "liabilityNote",
    ]);
    // The parent is hidden, so the child is hidden too.
    expect(names({ animal: "cat", coverage: ["liability"] })).toEqual([
      "animal",
    ]);
  });
});
