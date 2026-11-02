import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import {
  CLAIM_FREE_YEARS,
  LICENSE_PLATE_MESSAGE,
  LICENSE_PLATE_PATTERN,
} from "./shared";

export const motorcycleAtvMopedFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "vehicleType",
    label: "Hvad skal forsikres?",
    layout: "grid",
    options: [
      { value: "motorcycle", label: "Motorcykel" },
      { value: "atv", label: "ATV" },
      { value: "moped_30", label: "Knallert 30" },
      { value: "moped_45", label: "Knallert 45" },
    ],
  },
  {
    type: "text",
    name: "licensePlate",
    label: "Nummerplade",
    description: "Lad feltet stå tomt, hvis køretøjet ikke har nummerplade endnu.",
    optional: true,
    placeholder: "Fx AB 123",
    maxLength: 10,
    normalize: "uppercase-no-spaces",
    pattern: LICENSE_PLATE_PATTERN,
    patternMessage: LICENSE_PLATE_MESSAGE,
    lookup: "dk-license-plate",
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
        value: "comprehensive",
        label: "Ansvar og kasko",
        description: "Også skader på dit eget køretøj",
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
