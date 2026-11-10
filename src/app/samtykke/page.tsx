import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/marketing/content-page";
import { consentFields } from "@/config/forms/consents";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Samtykke",
  description: "De samtykker, du kan give, når du beder om tilbud.",
};

/**
 * The consents, rendered from the same config the form uses, so the text
 * here is always the text the user agrees to.
 */
export default function ConsentPage() {
  const consents = consentFields.filter((field) => field.type === "consent");
  return (
    <ContentPage
      title="Samtykke"
      updated="10. november 2026"
      intro={
        <p>
          Når du beder om tilbud, giver du samtykke på det sidste trin i
          formularen. Her kan du læse den præcise tekst.
        </p>
      }
    >
      {consents.map((consent) => (
        <section key={consent.name} className="space-y-3">
          <h2>{consent.label}</h2>
          <blockquote className="border-l-4 border-brand bg-cream p-4">
            {consent.text}
          </blockquote>
          <p className="text-sm text-muted-foreground">
            {consent.optional ? "Frivilligt. " : "Nødvendigt for at få tilbud. "}
            Version {consent.version}.
          </p>
        </section>
      ))}

      <h2>Hvem modtager mine oplysninger?</h2>
      <p>
        De forsikringsselskaber på vores{" "}
        <Link href="/partnere">partnerliste</Link>, som tilbyder de
        forsikringer, du har valgt.
      </p>

      <h2>Sådan trækker du dit samtykke tilbage</h2>
      <p>
        Skriv til <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Så holder
        vi op med at behandle dine oplysninger til det formål og giver
        forsikringsselskaberne besked. Nyhedsbreve kan du også afmelde via
        linket i hver e-mail. Læs mere i vores{" "}
        <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>
    </ContentPage>
  );
}
