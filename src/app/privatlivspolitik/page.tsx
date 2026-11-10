import type { Metadata } from "next";
import Link from "next/link";

import { CompanyDetails } from "@/components/marketing/company-details";
import { ContentPage } from "@/components/marketing/content-page";
import { RETENTION } from "@/config/retention";
import { COMPANY, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
  description: `Sådan behandler ${SITE.name} dine personoplysninger.`,
};

/**
 * Privacy policy. Must describe what the code actually does: update it
 * whenever we collect new data, add a processor or change retention.
 * Legal review: docs/huskeliste.md.
 */
export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      title="Privatlivspolitik"
      updated="10. november 2026"
      intro={
        <p>
          Her kan du læse, hvilke oplysninger vi indsamler, hvorfor, hvem vi
          deler dem med, og hvilke rettigheder du har.
        </p>
      }
    >
      <h2>Dataansvarlig</h2>
      <p>
        {COMPANY.name} er dataansvarlig for de oplysninger, du giver på{" "}
        {SITE.domain}. Har du spørgsmål, eller vil du bruge dine rettigheder,
        så kontakt os:
      </p>
      <CompanyDetails />

      <h2>Hvilke oplysninger vi indsamler</h2>
      <h3>Når du udfylder formularen</h3>
      <ul>
        <li>
          <strong>Kontaktoplysninger:</strong> navn, e-mail, telefonnummer,
          adresse, postnummer, by og fødselsår, og om du er registreret i RKI
          (det spørger selskaberne altid om).
        </li>
        <li>
          <strong>Oplysninger om det, der skal forsikres:</strong> de svar, du
          giver om fx din bil, bolig, rejser eller dyr, og hvilket selskab du
          er forsikret i i dag.
        </li>
        <li>
          <strong>Oplysninger fra offentlige registre:</strong> skriver du en
          nummerplade, henter vi bilens data (fx mærke, model og motor) i
          Motorregistret. Vælger du en adresse, henter vi boligens data (fx
          areal, byggeår og tagtype) i BBR.
        </li>
        <li>
          <strong>Dine samtykker:</strong> hvilke samtykker du har givet,
          hvornår, og den præcise tekst, du sagde ja til.
        </li>
      </ul>
      <p>
        Vi spørger ikke om dit helbred eller andre følsomme oplysninger. Hvis
        et forsikringsselskab har brug for det, spørger det dig selv.
      </p>
      <h3>Når du besøger siden</h3>
      <ul>
        <li>
          Dit valg i cookiebanneret.
        </li>
        <li>
          Siger du ja til marketingcookies: Metas cookies (<code>_fbp</code>{" "}
          og <code>_fbc</code>), som vi gemmer sammen med din forespørgsel.
          Læs mere i vores <Link href="/cookiepolitik">cookiepolitik</Link>.
        </li>
        <li>
          Dine svar gemmes midlertidigt i din egen browser, mens du udfylder
          formularen, så du ikke mister dem, hvis siden genindlæses. De
          slettes, når du lukker fanen.
        </li>
      </ul>

      <h2>Hvorfor vi behandler oplysningerne</h2>
      <ol>
        <li>
          <strong>For at sende din forespørgsel til forsikringsselskaberne</strong>
          , så de kan kontakte dig med tilbud. Det sker på grundlag af dit
          samtykke (databeskyttelsesforordningens artikel 6, stk. 1, litra a).
        </li>
        <li>
          <strong>For at kunne dokumentere dit samtykke.</strong> Det er
          nødvendigt for at overholde reglerne (artikel 6, stk. 1, litra c, og
          vores legitime interesse efter litra f).
        </li>
        <li>
          <strong>For at sende dig nyheder og tilbud på e-mail</strong>, hvis
          du har sagt ja til det (artikel 6, stk. 1, litra a, og
          markedsføringslovens § 10).
        </li>
        <li>
          <strong>For at måle og forbedre vores annoncer på Facebook og
          Instagram</strong>, hvis du har sagt ja til marketingcookies (artikel
          6, stk. 1, litra a). Se afsnittet om Meta nedenfor.
        </li>
        <li>
          <strong>For at forbedre kvaliteten af vores formidling.</strong>{" "}
          Forsikringsselskaberne fortæller os, hvordan det gik med din
          forespørgsel (fx om de fik kontakt med dig, eller om du fik et
          tilbud). Det sker på grundlag af vores legitime interesse i at
          forbedre tjenesten (artikel 6, stk. 1, litra f).
        </li>
        <li>
          <strong>For at følge op på din forespørgsel.</strong> Et par dage
          efter spørger vi dig på e-mail eller SMS, om selskaberne har
          kontaktet dig, og hvor tilfreds du er. Svarer du, at ingen har
          kontaktet dig, kan vi ringe til dig for at hjælpe. Det sker på
          grundlag af vores legitime interesse i at sikre, at tjenesten
          virker (artikel 6, stk. 1, litra f). Du kan altid sige fra.
        </li>
        <li>
          <strong>For at beskytte siden mod misbrug</strong>, fx automatiske
          forespørgsler fra robotter (artikel 6, stk. 1, litra f).
        </li>
      </ol>

      <h2>Hvem vi deler oplysningerne med</h2>
      <h3>Forsikringsselskaber</h3>
      <p>
        Med dit samtykke sender vi din forespørgsel til de forsikringsselskaber
        på vores <Link href="/partnere">partnerliste</Link>, som tilbyder de
        forsikringer, du har valgt. Selskaberne er selv dataansvarlige for de
        oplysninger, de modtager, og behandler dem efter deres egen
        privatlivspolitik.
      </p>
      <h3>Meta (Facebook og Instagram)</h3>
      <p>
        Siger du ja til marketingcookies, sender vi besked til Meta Platforms
        Ireland Ltd., når du har sendt en forespørgsel, og senere, hvis
        forespørgslen førte til kontakt, et tilbud eller et køb. Vi sender din
        e-mail, dit telefonnummer, dit navn, postnummer og by i hashet form
        (omdannet til en kode, så de ikke kan læses direkte), din IP-adresse, din browsertype og
        Metas cookie-id&apos;er. Vi sender aldrig dine svar om forsikringerne.
        Meta bruger oplysningerne til at måle og forbedre vores annoncer. Vi og
        Meta er fælles dataansvarlige for indsamlingen og overførslen. Læs
        mere i{" "}
        <a href="https://www.facebook.com/privacy/policy" rel="noopener noreferrer">
          Metas privatlivspolitik
        </a>
        .
      </p>
      <h3>Databehandlere</h3>
      <p>
        Vi bruger leverandører, der behandler oplysninger på vores vegne og
        efter vores instruks:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong>: database. Oplysningerne gemmes i EU
          (Frankfurt).
        </li>
        <li>
          <strong>Vercel</strong>: drift af hjemmesiden. Serverne, der
          behandler din forespørgsel, står i EU (Frankfurt).
        </li>
        <li>
          <strong>MotorAPI</strong>: opslag af nummerplader. MotorAPI ser kun
          nummerpladen, ikke hvem du er.
        </li>
        <li>
          <strong>GoHighLevel</strong>: vores kundesystem til opfølgning på
          e-mail, SMS og telefon. Får hele din forespørgsel (kontaktoplysninger,
          adresse, fødselsår, svaret om RKI og dine svar i formularen), så vi
          kan hjælpe dig, hvis noget går galt. Slettes efter samme frister som
          hos os.
        </li>
      </ul>
      <p>
        Adresser og boligdata slår vi op i de offentlige registre via
        Datafordeleren, som drives af den danske stat.
      </p>

      <h2>Overførsel til lande uden for EU</h2>
      <p>
        Vercel, Meta og GoHighLevel er en del af koncerner med hovedsæde i USA, og
        oplysninger kan derfor blive overført dertil. Overførslen sker på
        grundlag af EU-Kommissionens afgørelse om EU-US Data Privacy Framework
        eller EU-Kommissionens standardkontraktbestemmelser.
      </p>

      <h2>Hvor længe vi gemmer oplysningerne</h2>
      <p>Vi sletter automatisk, hver dag:</p>
      <ul>
        <li>
          Din forespørgsel sletter vi {RETENTION.answersMonths} måneder efter,
          at du sendte den: dine svar, din adresse, dit fødselsår, dit svar om
          RKI og Metas cookie-id&apos;er.
        </li>
        <li>
          Dit navn, din e-mail og dit telefonnummer gemmer vi sammen med dine
          samtykker som dokumentation for, hvem der har givet samtykke til
          hvad. Det sletter vi efter {RETENTION.consentProofYears} år.
        </li>
        <li>
          Har du sagt ja til nyheder på e-mail, bruger vi din e-mail til det,
          indtil du afmelder dig, dog højst i {RETENTION.consentProofYears} år.
        </li>
      </ul>

      <h2>Dine rettigheder</h2>
      <p>Du har ret til at:</p>
      <ul>
        <li>få indsigt i de oplysninger, vi har om dig</li>
        <li>få forkerte oplysninger rettet</li>
        <li>få dine oplysninger slettet</li>
        <li>få behandlingen begrænset</li>
        <li>få dine oplysninger udleveret i et almindeligt format (dataportabilitet)</li>
        <li>gøre indsigelse mod behandling, der sker på grundlag af vores legitime interesse</li>
        <li>
          trække dit samtykke tilbage når som helst. Det påvirker ikke
          lovligheden af den behandling, der skete, før du trak det tilbage.
        </li>
      </ul>
      <p>
        Skriv til <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, så svarer
        vi hurtigst muligt og senest inden for en måned. Vil du trække dit
        samtykke til forsikringsselskaberne tilbage, giver vi også selskaberne
        besked. Dit samtykke til cookies kan du ændre under
        &quot;Cookieindstillinger&quot; nederst på siden.
      </p>

      <h2>Klage</h2>
      <p>
        Du kan klage over vores behandling af dine oplysninger til
        Datatilsynet,{" "}
        <a href="https://www.datatilsynet.dk" rel="noopener noreferrer">
          datatilsynet.dk
        </a>
        .
      </p>

      <h2>Ændringer</h2>
      <p>
        Vi opdaterer privatlivspolitikken, når vi ændrer, hvordan vi behandler
        oplysninger. Datoen øverst viser, hvornår den sidst blev ændret.
      </p>
    </ContentPage>
  );
}
