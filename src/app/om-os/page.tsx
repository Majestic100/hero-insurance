import type { Metadata } from "next";
import Link from "next/link";

import { CompanyDetails } from "@/components/marketing/company-details";
import { ContentPage } from "@/components/marketing/content-page";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Om os",
  description: `Hvem står bag ${SITE.name}, og hvordan tjener vi penge?`,
};

export default function AboutPage() {
  return (
    <ContentPage
      title={`Om ${SITE.name}`}
      intro={
        <p>
          Vi gør det nemt at få tilbud på dine forsikringer. Du udfylder én
          formular, og forsikringsselskaberne kontakter dig med et bud.
        </p>
      }
    >
      <h2>Hvorfor vi findes</h2>
      <p>
        Mange betaler for meget for deres forsikringer, fordi det tager tid at
        ringe rundt og udfylde de samme oplysninger igen og igen. Hos os
        udfylder du det hele én gang, og vi henter så meget som muligt i de
        offentlige registre for dig: boligens data i BBR og bilens data i
        Motorregistret.
      </p>

      <h2>Sådan tjener vi penge</h2>
      <p>
        Det er gratis for dig at bruge {SITE.name}. Forsikringsselskaberne
        betaler os for at formidle din forespørgsel. Vi sælger ikke
        forsikringer selv og giver ikke rådgivning, og du er aldrig forpligtet
        til at tage imod et tilbud.
      </p>

      <h2>Dine oplysninger</h2>
      <p>
        Vi spørger kun om det, selskaberne skal bruge for at give dig en pris,
        og aldrig om dit helbred. Vi sender kun dine oplysninger til de
        selskaber på vores <Link href="/partnere">partnerliste</Link>, og kun
        når du har givet samtykke. Læs mere i vores{" "}
        <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>

      <h2>Hvem står bag</h2>
      <p>
        {SITE.name} drives af {COMPANY.name}.
      </p>
      <CompanyDetails />
      <p>
        Er du et forsikringsselskab? <Link href="/bliv-partner">Bliv partner</Link>.
      </p>
    </ContentPage>
  );
}
