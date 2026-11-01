import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";

export const boatFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "boatType",
    label: "Hvilken type båd har du?",
    layout: "grid",
    options: [
      { value: "sailboat", label: "Sejlbåd" },
      { value: "motorboat", label: "Motorbåd" },
      { value: "speedboat", label: "Speedbåd" },
      { value: "dinghy", label: "Jolle, kajak eller kano" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "number",
    name: "lengthFeet",
    label: "Bådens længde",
    placeholder: "Fx 28",
    min: 5,
    max: 150,
    unit: "fod",
  },
  {
    type: "single-choice",
    name: "value",
    label: "Hvad er båden værd?",
    options: [
      { value: "under_50000", label: "Under 50.000 kr." },
      { value: "50000_200000", label: "50.000-200.000 kr." },
      { value: "200000_500000", label: "200.000-500.000 kr." },
      { value: "over_500000", label: "Over 500.000 kr." },
    ],
  },
  {
    type: "number",
    name: "enginePower",
    label: "Motorens hestekræfter",
    description: "Lad feltet stå tomt, hvis båden ikke har motor.",
    optional: true,
    placeholder: "Fx 20",
    min: 1,
    max: 2000,
    unit: "hk",
  },
  currentInsurerField(),
];
