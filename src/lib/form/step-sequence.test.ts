import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { getActiveSteps, getSelectedTypes } from "./step-sequence";

describe("getSelectedTypes", () => {
  it("returns the selected types in canonical order", () => {
    expect(getSelectedTypes({ insuranceTypes: ["house", "car"] })).toEqual([
      "car",
      "house",
    ]);
  });

  it("ignores unknown values and missing selections", () => {
    expect(getSelectedTypes({ insuranceTypes: ["boat", "car"] })).toEqual([
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
    expect(ids([])).toEqual(["forsikringer", "afslut"]);
  });

  it("adds a step per selected type, in config order", () => {
    expect(ids(["house", "car"])).toEqual([
      "forsikringer",
      "bil",
      "hus",
      "afslut",
    ]);
    expect(ids(["car", "home_contents", "house"])).toEqual([
      "forsikringer",
      "bil",
      "indbo",
      "hus",
      "afslut",
    ]);
  });
});
