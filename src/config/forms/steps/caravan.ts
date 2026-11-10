import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import {
  LICENSE_PLATE_MESSAGE,
  LICENSE_PLATE_PATTERN,
  otherInfoField,
} from "./shared";

export const caravanFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "caravanType",
    label: "Hvad skal forsikres?",
    options: [
      { value: "caravan", label: "Campingvogn" },
      { value: "motorhome", label: "Autocamper" },
      { value: "folding", label: "Telt- eller foldevogn" },
    ],
  },
  {
    type: "text",
    name: "licensePlate",
    label: "Nummerplade",
    description: "Så henter vi oplysningerne i Motorregistret. Lad feltet stå tomt, hvis du ikke kender den.",
    optional: true,
    placeholder: "AB 12 345",
    maxLength: 10,
    normalize: "uppercase-no-spaces",
    pattern: LICENSE_PLATE_PATTERN,
    patternMessage: LICENSE_PLATE_MESSAGE,
    lookup: "dk-license-plate",
  },
  {
    type: "text",
    name: "makeAndModel",
    label: "Mærke og model",
    placeholder: "Fx Hobby De Luxe",
    maxLength: 80,
  },
  {
    type: "year",
    name: "modelYear",
    label: "Årgang",
    placeholder: "Fx 2015",
    minYear: 1950,
  },
  {
    type: "single-choice",
    name: "value",
    label: "Hvad er den værd?",
    options: [
      { value: "under_50000", label: "Under 50.000 kr." },
      { value: "50000_150000", label: "50.000-150.000 kr." },
      { value: "150000_400000", label: "150.000-400.000 kr." },
      { value: "over_400000", label: "Over 400.000 kr." },
    ],
  },
  {
    type: "single-choice",
    name: "coverage",
    label: "Hvilken dækning ønsker du?",
    options: [
      {
        value: "liability",
        label: "Kun ansvar",
        description: "Skader, du laver på andre og deres ting",
      },
      {
        value: "comprehensive",
        label: "Ansvar og kasko",
        description: "Også skader på din egen vogn",
      },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  currentInsurerField(),
  otherInfoField(),
];
