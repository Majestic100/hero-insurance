import type { Metadata } from "next";
import Link from "next/link";

import { CompanyDetails } from "@/components/marketing/company-details";
import { ContentPage } from "@/components/marketing/content-page";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontakt ${SITE.name}.`,
};

export default function ContactPage() {
  return (
    <ContentPage
      title="Kontakt os"
      intro={
        <p>
          Skriv til os på e-mail, så svarer vi så hurtigt som muligt.
        </p>
      }
    >
      <CompanyDetails />

      <h2>Spørgsmål om dit tilbud</h2>
      <p>
        Tilbuddene kommer fra forsikringsselskaberne. Har du spørgsmål til et
        tilbud, en pris eller vilkår, så kontakt det selskab, der har givet dig
        tilbuddet.
      </p>

      <h2>Dine oplysninger</h2>
      <p>
        Vil du se, rette eller slette de oplysninger, vi har om dig, eller
        trække dit samtykke tilbage? Skriv til{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Læs mere i vores{" "}
        <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>

      <h2>Forsikringsselskaber</h2>
      <p>
        Vil I modtage forespørgsler fra os? Læs mere på{" "}
        <Link href="/bliv-partner">Bliv partner</Link>.
      </p>
    </ContentPage>
  );
}
