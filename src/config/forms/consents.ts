import { UNION_VALUES } from "./steps/membership";
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
    version: "2026-11-10.1",
    // Market practice (Findforsikring, Forsikringsportalen, 2026-11-10):
    // named recipients via the partner list, "op til 3", phone, e-mail and
    // SMS, our own follow-up, and how to withdraw. MAX_PARTNERS_PER_LEAD in
    // src/config/partners.ts must match "op til 3".
    text:
      "Jeg giver samtykke til, at mine oplysninger fra denne formular sendes " +
      "til op til 3 forsikringsselskaber på partnerlisten, som tilbyder de " +
      "forsikringer, jeg har valgt, så de kan kontakte mig på telefon, e-mail " +
      "og SMS med et tilbud. Nemforsikringstilbud må kontakte mig for at følge " +
      "op på min forespørgsel. Jeg kan til enhver tid trække samtykket tilbage " +
      "ved at skrive til kontakt@nemforsikringstilbud.dk.",
    link: { href: "/partnere", label: "Se partnerlisten" },
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
  {
    // GDPR art. 9: trade union membership needs explicit consent for this
    // purpose. Only shown (and required) when a union is picked; without
    // it, the user picks "Nej" or another answer instead.
    type: "consent",
    name: "consentMembership",
    label: "Samtykke til at dele medlemskab",
    consentType: "membership",
    version: "2026-11-10.1",
    text:
      "Jeg giver udtrykkeligt samtykke til, at oplysningen om mit medlemskab " +
      "af en fagforening sendes til forsikringsselskaberne sammen med min " +
      "forespørgsel, så de kan give mig medlemsrabat. Samtykket er frivilligt, " +
      "og jeg kan trække det tilbage ved at skrive til kontakt@nemforsikringstilbud.dk.",
    requiredMessage:
      "Giv samtykke, eller vælg et andet svar ved medlemskab, hvis du ikke vil dele det.",
    showIf: { field: "membership", equals: UNION_VALUES },
  },
];
