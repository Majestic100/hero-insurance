import type { FieldConfig } from "./types";

/**
 * The consents shown on the last step. The exact text and version are
 * stored with every lead as proof (table `consents`), so bump the version
 * whenever a text changes.
 *
 * TODO(owner): legal review before launch, see docs/huskeliste.md. The
 * partner text must name the recipients (or a clear category) and how
 * many partners receive each lead.
 */
export const consentFields: readonly FieldConfig[] = [
  {
    type: "consent",
    name: "consentPartnerContact",
    label: "Samtykke til at blive kontaktet med tilbud",
    consentType: "partner_contact",
    version: "2026-11-01.1",
    text:
      "Jeg giver samtykke til, at mine oplysninger fra denne formular sendes " +
      "til vores samarbejdspartnere blandt forsikringsselskaberne, så de kan " +
      "kontakte mig på telefon og e-mail med tilbud på de forsikringer, jeg " +
      "har valgt. Jeg kan til enhver tid trække samtykket tilbage.",
    link: { href: "/privatlivspolitik", label: "Læs vores privatlivspolitik" },
    requiredMessage:
      "Du skal give samtykke, for at forsikringsselskaberne kan sende dig tilbud.",
  },
  {
    type: "consent",
    name: "consentMarketing",
    label: "Samtykke til nyheder og tilbud",
    consentType: "marketing",
    version: "2026-11-01.1",
    optional: true,
    text:
      "Ja tak, I må sende mig nyheder og gode tilbud om forsikring på e-mail. " +
      "Jeg kan altid afmelde mig igen.",
  },
];
