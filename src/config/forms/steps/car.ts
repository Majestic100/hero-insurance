import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { CLAIM_FREE_YEARS, YES_NO } from "./shared";

/** Danish plates: standard (AB12345) and personal plates, 2-7 characters. */
const LICENSE_PLATE_PATTERN = "^[A-ZÆØÅ0-9]{2,7}$";

export const carFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "hasLicensePlate",
    label: "Har bilen nummerplade?",
    layout: "grid",
    options: YES_NO,
  },
  {
    type: "text",
    name: "licensePlate",
    label: "Nummerplade",
    placeholder: "AB 12 345",
    maxLength: 10,
    normalize: "uppercase-no-spaces",
    pattern: LICENSE_PLATE_PATTERN,
    patternMessage: "Tjek nummerpladen. Den består af bogstaver og tal.",
    showIf: { field: "hasLicensePlate", equals: "yes" },
  },
  {
    type: "text",
    name: "makeAndModel",
    label: "Mærke og model",
    placeholder: "Fx Toyota Yaris",
    maxLength: 80,
    showIf: { field: "hasLicensePlate", equals: "no" },
  },
  {
    type: "year",
    name: "modelYear",
    label: "Årgang",
    placeholder: "Fx 2021",
    minYear: 1950,
    showIf: { field: "hasLicensePlate", equals: "no" },
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
        description: "Det lovpligtige: skader du gør på andre",
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
];
