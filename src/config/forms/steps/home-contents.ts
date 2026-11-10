import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import {
  otherInfoField,
  propertyAddressField,
} from "./shared";

export const homeContentsFields: readonly FieldConfig[] = [
  propertyAddressField("Din adresse"),
  {
    type: "single-choice",
    name: "residenceType",
    label: "Hvor bor du?",
    layout: "grid",
    options: [
      { value: "apartment", label: "Lejlighed" },
      { value: "terraced_house", label: "Rækkehus" },
      { value: "detached_house", label: "Villa eller parcelhus" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "single-choice",
    name: "tenure",
    label: "Ejer eller lejer du?",
    options: [
      { value: "owner", label: "Ejer" },
      { value: "tenant", label: "Lejer" },
      { value: "cooperative", label: "Andelshaver" },
    ],
  },
  {
    type: "number",
    name: "livingArea",
    label: "Boligareal",
    placeholder: "Fx 85",
    min: 10,
    max: 1000,
    unit: "m²",
    // BBR only knows the area of houses; for apartments it is left empty.
    autofill: { from: "address", lookup: "bbr-living-area" },
  },
  {
    type: "single-choice",
    name: "householdSize",
    label: "Hvor mange bor i husstanden?",
    layout: "grid",
    options: [
      { value: "1", label: "1 person" },
      { value: "2", label: "2 personer" },
      { value: "3", label: "3 personer" },
      { value: "4", label: "4 personer" },
      { value: "5_plus", label: "5 eller flere" },
    ],
  },
  {
    // Finer than the insurers' sums, so each partner can merge them into its
    // own groups. Most people only know it roughly, so no exact number.
    type: "single-choice",
    name: "sumInsured",
    label: "Hvor meget er dit indbo værd?",
    description: "Hvad ville det koste at købe alt nyt: møbler, tøj, elektronik osv.",
    layout: "grid",
    options: [
      { value: "under_250000", label: "Under 250.000 kr." },
      { value: "250000_500000", label: "250.000-500.000 kr." },
      { value: "500000_750000", label: "500.000-750.000 kr." },
      { value: "750000_1000000", label: "750.000-1 mio. kr." },
      { value: "1000000_1500000", label: "1-1,5 mio. kr." },
      { value: "over_1500000", label: "Over 1,5 mio. kr." },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  currentInsurerField(),
  otherInfoField(),
];
