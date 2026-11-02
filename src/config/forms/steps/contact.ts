import type { FieldConfig } from "../types";

/**
 * Contact details, asked once for the whole lead and stored in the `leads`
 * table (not in the per-insurance answers). All personal data, so none of
 * it is kept in the draft. Max lengths match the database constraints.
 */
export const contactFields: readonly FieldConfig[] = [
  {
    type: "text",
    name: "firstName",
    label: "Fornavn",
    maxLength: 100,
    autoComplete: "given-name",
    noDraft: true,
  },
  {
    type: "text",
    name: "lastName",
    label: "Efternavn",
    maxLength: 100,
    autoComplete: "family-name",
    noDraft: true,
  },
  {
    type: "text",
    name: "email",
    label: "E-mail",
    format: "email",
    maxLength: 254,
    autoComplete: "email",
    noDraft: true,
  },
  {
    type: "text",
    name: "phone",
    label: "Telefonnummer",
    format: "phone-dk",
    maxLength: 20,
    autoComplete: "tel-national",
    noDraft: true,
  },
  {
    type: "text",
    name: "streetAddress",
    label: "Adresse",
    description: "Vejnavn og husnummer, evt. etage og dør.",
    maxLength: 200,
    autoComplete: "address-line1",
    noDraft: true,
  },
  {
    type: "text",
    name: "postalCode",
    label: "Postnummer",
    format: "postal-code-dk",
    maxLength: 4,
    autoComplete: "postal-code",
    noDraft: true,
  },
  {
    type: "text",
    name: "city",
    label: "By",
    maxLength: 100,
    autoComplete: "address-level2",
    autofill: { from: "postalCode", lookup: "dk-postal-code-city" },
    noDraft: true,
  },
  {
    type: "year",
    name: "birthYear",
    label: "Dit fødselsår",
    description: "Prisen på mange forsikringer afhænger af alder.",
    placeholder: "Fx 1985",
    minYear: 1920,
    maxYearsAgo: 18,
    autoComplete: "bday-year",
    noDraft: true,
  },
];
