import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { otherInfoField } from "./shared";

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
  {
    type: "select",
    name: "engineType",
    label: "Motortype",
    placeholder: "Vælg",
    options: [
      { value: "inboard", label: "Indenbords" },
      { value: "outboard", label: "Påhængsmotor" },
      { value: "none", label: "Ingen motor" },
      { value: "other", label: "Andet" },
      { value: "unknown", label: "Ved ikke" },
    ],
    width: "half",
  },
  {
    type: "year",
    name: "buildYear",
    label: "Byggeår",
    placeholder: "Fx 2005",
    minYear: 1900,
    width: "half",
  },
  {
    type: "single-choice",
    name: "mooring",
    label: "Hvor ligger båden?",
    layout: "grid",
    options: [
      { value: "harbour", label: "I havn" },
      { value: "trailer", label: "På trailer" },
      { value: "land", label: "På land" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "single-choice",
    name: "sailingArea",
    label: "Hvor sejler du?",
    layout: "grid",
    options: [
      { value: "danish", label: "Danske farvande" },
      { value: "scandinavian", label: "Skandinavien" },
      { value: "european", label: "Europa" },
      { value: "international", label: "Hele verden" },
      { value: "unknown", label: "Ved ikke" },
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
        description: "Også skader på din egen båd",
      },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  currentInsurerField(),
  otherInfoField(),
];
