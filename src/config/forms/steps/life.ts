import { currentInsurerField } from "../insurers";
import type { FieldConfig } from "../types";

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
  currentInsurerField(),
];
