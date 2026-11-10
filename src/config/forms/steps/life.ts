import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";
import { otherInfoField } from "./shared";

/**
 * No health or smoking questions on purpose: that is health data, a special
 * category under GDPR (art. 9). The partner asks for it with the right consent.
 */
export const lifeFields: readonly FieldConfig[] = [
  {
    type: "single-choice",
    name: "payout",
    label: "Hvor stort et beløb skal udbetales?",
    description: "Udbetales til dine efterladte, hvis du dør.",
    options: [
      { value: "under_500000", label: "Under 500.000 kr." },
      { value: "500000_1000000", label: "500.000-1.000.000 kr." },
      { value: "1000000_2000000", label: "1-2 mio. kr." },
      { value: "over_2000000", label: "Over 2 mio. kr." },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  {
    type: "single-choice",
    name: "purpose",
    label: "Hvad skal forsikringen sikre?",
    options: [
      { value: "family", label: "Min familie" },
      { value: "mortgage", label: "Mit boliglån" },
      { value: "other", label: "Andet" },
    ],
  },
  {
    type: "select",
    name: "industry",
    label: "Hvilken branche arbejder du i?",
    description: "Nogle selskaber prissætter efter branche.",
    optional: true,
    placeholder: "Vælg branche",
    options: [
      { value: "agriculture", label: "Landbrug, skovbrug og fiskeri" },
      { value: "manufacturing", label: "Industri og fremstilling" },
      { value: "construction", label: "Bygge og anlæg" },
      { value: "retail", label: "Handel og detail" },
      { value: "transport", label: "Transport og logistik" },
      { value: "hospitality", label: "Hotel og restauration" },
      { value: "it", label: "IT og kommunikation" },
      { value: "finance", label: "Finans og forsikring" },
      { value: "real_estate", label: "Ejendomme og udlejning" },
      { value: "consulting", label: "Rådgivning og videnskab" },
      { value: "administration", label: "Administration og service" },
      { value: "public", label: "Offentlig forvaltning" },
      { value: "education", label: "Undervisning" },
      { value: "healthcare", label: "Sundhed og omsorg" },
      { value: "culture", label: "Kultur, fritid og sport" },
      { value: "utilities", label: "Energi, forsyning og havne" },
      { value: "security", label: "Politi, forsvar og sikkerhed" },
      { value: "childcare", label: "Pædagogisk arbejde" },
      { value: "student", label: "Under uddannelse" },
      { value: "other", label: "Anden branche" },
      { value: "unknown", label: "Ved ikke" },
    ],
  },
  currentInsurerField(),
  otherInfoField(),
];
