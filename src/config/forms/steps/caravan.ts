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
    // An amount, not a range: fits every insurer's price groups.
    type: "number",
    name: "value",
    label: "Hvad er den værd?",
    description: "Ca. hvad du ville kunne sælge den for.",
    placeholder: "Fx 150.000",
    min: 1000,
    max: 10000000,
    unit: "kr.",
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
