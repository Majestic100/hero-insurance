import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import { getActiveSteps, getSelectedTypes } from "./step-sequence";

describe("getSelectedTypes", () => {
  it("returns the selected types in canonical order", () => {
    expect(getSelectedTypes({ insuranceTypes: ["house", "car"] })).toEqual([
      "car",
      "house",
    ]);
  });

  it("ignores unknown values and missing selections", () => {
    expect(getSelectedTypes({ insuranceTypes: ["spaceship", "car"] })).toEqual([
      "car",
    ]);
    expect(getSelectedTypes({})).toEqual([]);
    expect(getSelectedTypes({ insuranceTypes: "car" })).toEqual([]);
  });
});

describe("getActiveSteps", () => {
  const ids = (selected: Parameters<typeof getActiveSteps>[1]) =>
    getActiveSteps(formConfig, selected).map((step) => step.id);

  it("shows only general steps when nothing is selected", () => {
    expect(ids([])).toEqual(["forsikringer", "kontakt", "afslut"]);
  });

  it("adds a step per selected type, in config order", () => {
    expect(ids(["house", "car"])).toEqual([
      "forsikringer",
      "bil",
      "hus",
      "kontakt",
      "afslut",
    ]);
    expect(ids(["boat", "car", "pet"])).toEqual([
      "forsikringer",
      "bil",
      "baad",
      "dyr",
      "kontakt",
      "afslut",
    ]);
  });

  it("has one step per insurance type, with unique ids", () => {
    const all = getActiveSteps(formConfig, INSURANCE_TYPES);
    expect(all).toHaveLength(INSURANCE_TYPES.length + 3);
    expect(new Set(all.map((step) => step.id)).size).toBe(all.length);
  });
});
