import type { Metadata } from "next";
import Link from "next/link";

import { CompanyDetails } from "@/components/marketing/company-details";
import { ContentPage } from "@/components/marketing/content-page";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Om os",
  description: `Hvem står bag ${SITE.name}, og hvad vil vi?`,
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
      <h2>Vores mission</h2>
      <p>
        Vi vil ændre den måde, danskerne får tilbud på forsikringer. Du har
        ret til at kende dine muligheder, og du fortjener forsikringer, der
        passer til dit liv, som det ser ud i dag.
      </p>
      <p>
        Alligevel bliver mange hængende i den samme forsikring i årevis,
        fordi det tager tid at ringe rundt og udfylde de samme oplysninger
        igen og igen. Hos os udfylder du det hele én gang, og vi henter så
        meget som muligt i de offentlige registre for dig: boligens data i
        BBR og bilens data i Motorregistret. Så kommer selskaberne til dig.
      </p>
      <p>
        Det er gratis og uforpligtende. Vi sælger ikke forsikringer og
        giver ikke rådgivning: du får tilbuddene, og du vælger selv.
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
