import { CAR_MAKES } from "../car-brands";
import { currentInsurerField } from "../insurers";
import type { ChoiceOption, FieldConfig } from "../types";
import {
  CLAIM_FREE_YEARS,
  LICENSE_PLATE_MESSAGE,
  LICENSE_PLATE_PATTERN,
  otherInfoField,
  YES_NO,
} from "./shared";

/** 0, 1, ..., 10, 10+ */
const OWN_CAR_YEARS: readonly [ChoiceOption, ...ChoiceOption[]] = [
  { value: "0", label: "0" },
  ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  { value: "10_plus", label: "10+" },
];

/** Shown only without a plate: with one, the motor register has the car. */
const NO_PLATE = { field: "hasLicensePlate", equals: "no" } as const;

export const carFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "hasLicensePlate",
    label: "Kender du nummerpladen?",
    layout: "grid",
    options: YES_NO,
  },
  {
    type: "text",
    name: "licensePlate",
    label: "Nummerplade",
    description: "Så henter vi bilens mærke, model og motor i Motorregistret.",
    placeholder: "AB 12 345",
    maxLength: 10,
    normalize: "uppercase-no-spaces",
    pattern: LICENSE_PLATE_PATTERN,
    patternMessage: LICENSE_PLATE_MESSAGE,
    lookup: "dk-license-plate",
    showIf: { field: "hasLicensePlate", equals: "yes" },
  },
  {
    type: "select",
    name: "make",
    label: "Mærke",
    placeholder: "Vælg mærke",
    options: CAR_MAKES,
    width: "half",
    showIf: NO_PLATE,
  },
  {
    type: "text",
    name: "model",
    label: "Model",
    placeholder: "Fx Yaris",
    maxLength: 60,
    width: "half",
    showIf: NO_PLATE,
  },
  {
    type: "select",
    name: "fuelType",
    label: "Drivmiddel",
    placeholder: "Vælg",
    options: [
      { value: "petrol", label: "Benzin" },
      { value: "diesel", label: "Diesel" },
      { value: "electric", label: "El" },
      { value: "hybrid_petrol", label: "Hybrid (benzin)" },
      { value: "hybrid_diesel", label: "Hybrid (diesel)" },
      { value: "unknown", label: "Ved ikke" },
    ],
    width: "half",
    showIf: NO_PLATE,
  },
  {
    type: "year",
    name: "modelYear",
    label: "Årgang",
    placeholder: "Fx 2021",
    minYear: 1950,
    width: "half",
    showIf: NO_PLATE,
  },
  {
    type: "text",
    name: "engineSize",
    label: "Motorstørrelse",
    description: "I liter, fx 1,6. Står på registreringsattesten.",
    placeholder: "Fx 1,6",
    inputMode: "decimal",
    maxLength: 4,
    pattern: "^\\d{1,2}([.,]\\d)?$",
    patternMessage: "Skriv motorstørrelsen i liter, fx 1,6.",
    optional: true,
    showIf: NO_PLATE,
  },
  {
    type: "single-choice",
    name: "mainDriver",
    label: "Hvem kører mest i bilen?",
    layout: "grid",
    options: [
      { value: "me", label: "Mig" },
      { value: "someone_else", label: "En anden" },
    ],
  },
  {
    type: "year",
    name: "mainDriverBirthYear",
    label: "Fødselsår for den, der kører mest",
    placeholder: "Fx 1985",
    minYear: 1920,
    maxYearsAgo: 17,
    showIf: { field: "mainDriver", equals: "someone_else" },
  },
  {
    type: "single-choice",
    name: "annualMileage",
    label: "Hvor meget kører bilen om året?",
    layout: "grid",
    options: [
      { value: "under_10000", label: "Under 10.000 km" },
      { value: "10000_15000", label: "10.000-15.000 km" },
      { value: "15000_20000", label: "15.000-20.000 km" },
      { value: "20000_30000", label: "20.000-30.000 km" },
      { value: "over_30000", label: "Over 30.000 km" },
    ],
  },
  {
    type: "single-choice",
    name: "coverage",
    label: "Hvilken dækning ønsker du?",
    options: [
      {
        value: "liability",
        label: "Ansvar",
        description: "Lovpligtig. Dækker skader, du laver på andre og deres ting.",
      },
      {
        value: "partial",
        label: "Ansvar og delkasko",
        description: "Også brand, tyveri og glas",
      },
      {
        value: "comprehensive",
        label: "Ansvar og kasko",
        description: "Også skader på din egen bil",
      },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  {
    type: "single-choice",
    name: "claimFreeYears",
    label: "Hvor mange år har du kørt uden skader?",
    layout: "grid",
    options: CLAIM_FREE_YEARS,
  },
  currentInsurerField(),
  {
    type: "single-choice",
    name: "ownCarYears",
    label: "Hvor mange år har du haft bil i eget navn?",
    layout: "inline",
    options: OWN_CAR_YEARS,
    optional: true,
    advanced: true,
  },
  otherInfoField(),
];
