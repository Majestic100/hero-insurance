import { describe, expect, it } from "vitest";

import { formConfig } from "@/config/forms";
import { INSURANCE_TYPES } from "@/config/forms/insurance-types";
import type { FieldConfig, FormConfig, StepConfig } from "@/config/forms/types";
import {
  buildDefaultValues,
  buildFieldSchema,
  buildFormSchema,
  buildStepSchema,
  findFirstInvalidStep,
} from "./build-schema";

const selectionStep = formConfig.steps[0];

/** First error message for a field, or undefined if it is valid. */
function errorFor(field: FieldConfig, value: unknown): string | undefined {
  const result = buildFieldSchema(field).safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("selection step", () => {
  it("requires at least one insurance type with a Danish message", () => {
    const result = buildStepSchema(selectionStep, {}).safeParse({
      insuranceTypes: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Vælg mindst én forsikring.");
    expect(result.error?.issues[0]?.path).toEqual(["insuranceTypes"]);
  });

  it("rejects values that are not options and accepts valid ones", () => {
    const schema = buildStepSchema(selectionStep, {});
    expect(schema.safeParse({ insuranceTypes: ["spaceship"] }).success).toBe(
      false,
    );
    expect(schema.safeParse({ insuranceTypes: ["car", "house"] }).success).toBe(
      true,
    );
  });
});

describe("single-choice and select", () => {
  const field: FieldConfig = {
    type: "single-choice",
    name: "coverage",
    label: "Dækning",
    options: [
      { value: "liability", label: "Ansvar" },
      { value: "comprehensive", label: "Kasko" },
    ],
  };

  it("requires an option, with a Danish message", () => {
    expect(errorFor(field, undefined)).toBe("Vælg en mulighed.");
    expect(errorFor(field, "boat")).toBe("Vælg en mulighed.");
    expect(errorFor(field, "liability")).toBeUndefined();
  });

  it("accepts nothing when optional", () => {
    expect(errorFor({ ...field, optional: true }, undefined)).toBeUndefined();
    expect(
      errorFor({ ...field, type: "select", optional: true }, "nope"),
    ).toBeDefined();
  });
});

describe("text", () => {
  const plate: FieldConfig = {
    type: "text",
    name: "licensePlate",
    label: "Nummerplade",
    normalize: "uppercase-no-spaces",
    pattern: "^[A-ZÆØÅ0-9]{2,7}$",
    patternMessage: "Tjek nummerpladen.",
  };

  it("normalizes before checking", () => {
    const result = buildFieldSchema(plate).safeParse(" ab 12 345 ");
    expect(result.success && result.data).toBe("AB12345");
  });

  it("reports empty, too long and wrong format in Danish", () => {
    expect(errorFor(plate, "")).toBe("Udfyld feltet.");
    expect(errorFor(plate, undefined)).toBe("Udfyld feltet.");
    expect(errorFor(plate, "AB-12")).toBe("Tjek nummerpladen.");
    expect(errorFor({ ...plate, maxLength: 3 }, "ABCD")).toBe("Højst 3 tegn.");
  });

  it("turns an empty optional value into undefined, but still checks input", () => {
    const optional = { ...plate, optional: true };
    const empty = buildFieldSchema(optional).safeParse("  ");
    expect(empty.success && empty.data).toBeUndefined();
    expect(errorFor(optional, "AB-12")).toBe("Tjek nummerpladen.");
  });
});

describe("number and year", () => {
  const area: FieldConfig = {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    min: 10,
    max: 1000,
    unit: "m²",
  };

  it("checks range with Danish messages and units", () => {
    expect(errorFor(area, undefined)).toBe("Udfyld feltet.");
    expect(errorFor(area, 5)).toBe("Skal være mindst 10 m².");
    expect(errorFor(area, 1500)).toBe("Må højst være 1.000 m².");
    expect(errorFor(area, 120)).toBeUndefined();
  });

  it("limits years to the allowed range", () => {
    const thisYear = new Date().getFullYear();
    const birthYear: FieldConfig = {
      type: "year",
      name: "birthYear",
      label: "Fødselsår",
      minYear: 1920,
      maxYearsAgo: 17,
    };
    expect(errorFor(birthYear, 1900)).toBe(
      "Årstallet skal være 1920 eller senere.",
    );
    expect(errorFor(birthYear, thisYear)).toBe(
      `Årstallet må højst være ${thisYear - 17}.`,
    );
    expect(errorFor(birthYear, thisYear - 30)).toBeUndefined();
  });
});

describe("conditional fields", () => {
  const step: StepConfig = {
    id: "bil",
    title: "Bil",
    insuranceType: "car",
    fields: [
      {
        type: "single-choice",
        name: "hasPlate",
        label: "Har bilen nummerplade?",
        options: [
          { value: "yes", label: "Ja" },
          { value: "no", label: "Nej" },
        ],
      },
      {
        type: "text",
        name: "plate",
        label: "Nummerplade",
        showIf: { field: "hasPlate", equals: "yes" },
      },
      {
        type: "text",
        name: "model",
        label: "Mærke og model",
        showIf: { field: "hasPlate", equals: "no" },
      },
    ],
  };

  it("validates only the fields that are shown", () => {
    const values = { car: { hasPlate: "no", plate: "", model: "Toyota" } };
    const result = buildStepSchema(step, values).safeParse(values);
    expect(result.success).toBe(true);
    // The hidden field is dropped from the parsed output.
    expect(result.data?.car).toEqual({ hasPlate: "no", model: "Toyota" });

    const missing = { car: { hasPlate: "yes", plate: "", model: "" } };
    const failed = buildStepSchema(step, missing).safeParse(missing);
    expect(failed.success).toBe(false);
    expect(failed.error?.issues[0]?.path).toEqual(["car", "plate"]);
  });
});

describe("buildFormSchema", () => {
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

  it("validates only the selected insurance types", () => {
    const valid = { insuranceTypes: ["car"], car: { extras: ["glass"] } };
    expect(buildFormSchema(config, valid).safeParse(valid).success).toBe(true);

    const invalid = { insuranceTypes: ["car"], car: { extras: [] } };
    expect(buildFormSchema(config, invalid).safeParse(invalid).success).toBe(
      false,
    );

    const other = { insuranceTypes: ["house"] };
    expect(buildFormSchema(config, other).safeParse(other).success).toBe(true);
  });
});

describe("buildDefaultValues", () => {
  it("creates a namespace per insurance type", () => {
    const values = buildDefaultValues(formConfig);
    expect(values.insuranceTypes).toEqual([]);
    for (const type of INSURANCE_TYPES) {
      expect(values[type]).toBeTypeOf("object");
    }
  });

  it("makes the selection the first invalid step", () => {
    const values = buildDefaultValues(formConfig);
    expect(findFirstInvalidStep(formConfig.steps, values)).toBe(0);
  });
});

describe("text formats", () => {
  const base = { type: "text", name: "x", label: "X" } as const;

  it("lowercases and checks e-mail addresses", () => {
    const email: FieldConfig = { ...base, format: "email" };
    const result = buildFieldSchema(email).safeParse("  Sinan@Example.DK ");
    expect(result.success && result.data).toBe("sinan@example.dk");
    expect(errorFor(email, "sinan@example")).toBe(
      "Skriv en gyldig e-mailadresse.",
    );
  });

  it("normalizes Danish phone numbers to 8 digits", () => {
    const phone: FieldConfig = { ...base, format: "phone-dk" };
    for (const input of ["12 34 56 78", "+45 12345678", "0045 1234-5678"]) {
      const result = buildFieldSchema(phone).safeParse(input);
      expect(result.success && result.data, input).toBe("12345678");
    }
    expect(errorFor(phone, "1234567")).toBe(
      "Skriv et dansk telefonnummer med 8 cifre.",
    );
  });

  it("checks postal codes", () => {
    const postal: FieldConfig = { ...base, format: "postal-code-dk" };
    expect(errorFor(postal, "2100")).toBeUndefined();
    expect(errorFor(postal, "210")).toBe("Skriv et postnummer med 4 cifre.");
  });
});

describe("consent", () => {
  const consent: FieldConfig = {
    type: "consent",
    name: "consentPartnerContact",
    label: "Samtykke",
    consentType: "partner_contact",
    version: "1",
    text: "Jeg giver samtykke.",
  };

  it("must be given when required", () => {
    expect(errorFor(consent, false)).toBe(
      "Du skal give samtykke for at kunne få tilbud.",
    );
    expect(errorFor(consent, undefined)).toBeDefined();
    expect(errorFor(consent, true)).toBeUndefined();
  });

  it("may be declined when optional", () => {
    expect(errorFor({ ...consent, optional: true }, false)).toBeUndefined();
    expect(errorFor({ ...consent, optional: true }, undefined)).toBeUndefined();
    expect(errorFor({ ...consent, optional: true }, "yes")).toBeDefined();
  });
});
