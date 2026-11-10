import type { Metadata } from "next";
import Link from "next/link";

import { CompanyDetails } from "@/components/marketing/company-details";
import { ContentPage } from "@/components/marketing/content-page";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Betingelser",
  description: `Betingelser for brug af ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Betingelser for brug"
      updated="10. november 2026"
      intro={
        <p>
          Disse betingelser gælder, når du bruger {SITE.domain}. Ved at bruge
          siden accepterer du dem.
        </p>
      }
    >
      <h2>Om tjenesten</h2>
      <p>
        {SITE.name} drives af {COMPANY.name}. Vi hjælper dig med at få tilbud
        på forsikringer: du udfylder én formular, og med dit samtykke sender
        vi din forespørgsel til forsikringsselskaber, som kontakter dig med
        tilbud.
      </p>
      <ul>
        <li>Tjenesten er gratis for dig.</li>
        <li>
          Du er ikke forpligtet til at tage imod et tilbud, og der indgås
          ingen aftale, før du selv accepterer et tilbud fra et selskab.
        </li>
        <li>
          Vi sælger ikke forsikringer og giver ikke rådgivning om, hvilken
          forsikring du skal vælge. Vi viser ikke priser og sammenligner ikke
          selskaber eller produkter. Vi sender kun dine oplysninger videre.
        </li>
        <li>
          Vi får betaling fra forsikringsselskaberne for at formidle
          forespørgsler.
        </li>
      </ul>

      <h2>Tilbuddene</h2>
      <p>
        Tilbud, priser og vilkår kommer fra forsikringsselskaberne, og
        selskaberne er selv ansvarlige for dem. Vi kan ikke garantere, at du
        får et bestemt antal tilbud, et bestemt beløb i besparelse eller et
        tilbud overhovedet. Læs altid selskabets vilkår, før du siger ja.
      </p>

      <h2>Dine oplysninger</h2>
      <p>
        Du skal give korrekte oplysninger om dig selv. Oplysninger, vi henter
        i offentlige registre (fx BBR og Motorregistret), kan være forkerte
        eller forældede, så tjek dem, før du sender. Selskabernes tilbud
        bygger på de oplysninger, du giver.
      </p>
      <p>
        Du må kun udfylde formularen for dig selv eller med samtykke fra den,
        det handler om. Det er ikke tilladt at sende falske eller automatiske
        forespørgsler.
      </p>
      <p>
        Sådan behandler vi dine oplysninger: se vores{" "}
        <Link href="/privatlivspolitik">privatlivspolitik</Link> og{" "}
        <Link href="/samtykke">samtykke</Link>.
      </p>

      <h2>Ansvar</h2>
      <p>
        Indholdet på siden er generel information og ikke rådgivning. Vi
        bestræber os på, at siden virker og er korrekt, men kan ikke garantere,
        at den altid er tilgængelig eller fejlfri. Vi er ikke ansvarlige for
        forsikringsselskabernes tilbud, vilkår, rådgivning eller behandling af
        skader, eller for tab, der opstår, fordi du har brugt siden, i det
        omfang loven tillader det.
      </p>

      <h2>Rettigheder</h2>
      <p>
        Tekster, design og kode på siden tilhører {COMPANY.name} og må ikke
        kopieres uden tilladelse.
      </p>

      <h2>Ændringer</h2>
      <p>
        Vi kan ændre betingelserne. Den version, der står her, gælder, når du
        bruger siden.
      </p>

      <h2>Lovvalg og kontakt</h2>
      <p>
        Dansk ret gælder. Har du en klage, så skriv til os, så finder vi en
        løsning.
      </p>
      <CompanyDetails />
    </ContentPage>
  );
}
