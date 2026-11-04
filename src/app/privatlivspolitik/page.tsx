import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PARTNERS } from "@/config/partners";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
};

/**
 * The privacy policy. A DRAFT until legal review (docs/huskeliste.md):
 * the company details, the retention period and the brand name are
 * placeholders, and the whole text must be approved before launch.
 *
 * Keep it true to what the code does. When the data we collect, the
 * recipients or the sub-processors change, update this page and bump
 * POLICY_VERSION. The partner list is rendered from src/config/partners.ts,
 * so it always matches who actually receives leads.
 */

// TODO(owner): fill in the legal entity behind the site.
const CONTROLLER = {
  name: "[Virksomhedens navn ApS]",
  cvr: "[CVR-nummer]",
  address: "[Adresse, postnummer og by]",
  email: "[kontakt-e-mail]",
};

// TODO(owner): decide the retention period. Automatic deletion is not
// built yet (docs/huskeliste.md): it must exist before this text is true.
const RETENTION_MONTHS = 12;

const POLICY_VERSION = "Udkast, 4. november 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privatlivspolitik</h1>
      <p className="mt-2 text-sm text-muted-foreground">{POLICY_VERSION}</p>

      <p className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
        Denne privatlivspolitik er et udkast, som er ved at blive gennemgået
        juridisk. Den endelige version offentliggøres her, før vi begynder at
        tage imod forespørgsler.
      </p>

      <div className="mt-8 space-y-8 leading-relaxed">
        <Section title="1. Hvem er dataansvarlig?">
          <p>
            Den dataansvarlige for behandlingen af dine personoplysninger på
            denne hjemmeside er:
          </p>
          <p>
            {CONTROLLER.name}
            <br />
            CVR: {CONTROLLER.cvr}
            <br />
            {CONTROLLER.address}
            <br />
            E-mail: {CONTROLLER.email}
          </p>
          <p>
            Har du spørgsmål til, hvordan vi behandler dine oplysninger, eller
            vil du bruge dine rettigheder, så skriv til os på e-mailen ovenfor.
          </p>
        </Section>

        <Section title="2. Hvad vi gør, og hvad vi ikke gør">
          <p>
            Vi hjælper dig med at få tilbud på dine forsikringer. Du udfylder
            én formular, og med dit samtykke sender vi oplysningerne videre til
            de forsikringsselskaber, vi samarbejder med, så de kan kontakte dig
            med et tilbud.
          </p>
          <p>
            Vi er ikke et forsikringsselskab og ikke en forsikringsmægler. Vi
            sælger ikke forsikringer, vi giver ikke personlig rådgivning, og vi
            forhandler ikke på dine vegne. Det er altid dit eget valg, om du vil
            tage imod et tilbud. Vi får betaling fra de forsikringsselskaber, vi
            samarbejder med, når vi sender dem en forespørgsel. Det koster ikke
            dig noget.
          </p>
        </Section>

        <Section title="3. Hvilke oplysninger vi behandler">
          <p>Når du udfylder formularen, behandler vi:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Kontaktoplysninger:</strong> navn, e-mail, telefonnummer
              og adresse.
            </li>
            <li>
              <strong>Fødselsår</strong> for den, der skal være
              forsikringstager.
            </li>
            <li>
              <strong>Dine svar om de forsikringer, du vil have tilbud på</strong>,
              fx om din bil, din bolig, dit indbo, din båd eller dit dyr, og hvilket
              selskab du er forsikret i i dag.
            </li>
            <li>
              <strong>Oplysninger fra offentlige registre:</strong> skriver du en
              nummerplade, henter vi bilens data fra Motorregistret (fx mærke,
              model, brændstof og første registrering). Vælger du en adresse,
              henter vi oplysninger om boligen fra Bygnings- og Boligregistret
              (BBR), fx boligareal, byggeår og tagtype. Du kan altid rette
              oplysningerne.
            </li>
            <li>
              <strong>Dine samtykker:</strong> hvilke samtykker du har givet,
              hvornår, og den præcise tekst og version, du sagde ja til.
            </li>
            <li>
              <strong>Tekniske oplysninger:</strong> hvis du har sagt ja til
              marketingcookies, de id&apos;er, Meta bruger til at genkende et
              klik på en annonce og din browser (se afsnit 7 og 9).
            </li>
          </ul>
          <p>
            Vi spørger ikke om helbred, rygning, fagforeningsmedlemskab eller
            andre følsomme oplysninger. Det skal forsikringsselskabet selv
            spørge om, hvis det er nødvendigt for dit tilbud.
          </p>
        </Section>

        <Section title="4. Formål og retsgrundlag">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>At sende din forespørgsel videre</strong> til
              forsikringsselskaberne, så de kan kontakte dig med tilbud på
              telefon og e-mail. Retsgrundlaget er dit samtykke
              (databeskyttelsesforordningens artikel 6, stk. 1, litra a).
            </li>
            <li>
              <strong>At kunne dokumentere dit samtykke</strong>, hvis du eller
              en myndighed spørger. Retsgrundlaget er vores retlige forpligtelse
              til at kunne påvise samtykke (artikel 7, stk. 1, og artikel 6,
              stk. 1, litra c).
            </li>
            <li>
              <strong>At sende dig nyheder og tilbud om forsikring</strong> på
              e-mail, kun hvis du har sagt ja til det. Retsgrundlaget er dit
              samtykke (artikel 6, stk. 1, litra a, og markedsføringslovens §
              10).
            </li>
            <li>
              <strong>At måle og forbedre vores annoncer på Meta</strong>
              (Facebook og Instagram), kun hvis du har sagt ja til
              marketingcookies. Retsgrundlaget er dit samtykke (artikel 6, stk.
              1, litra a, og cookiebekendtgørelsen).
            </li>
            <li>
              <strong>At beskytte formularen mod robotter og misbrug</strong> og
              holde hjemmesiden sikker og stabil. Retsgrundlaget er vores
              legitime interesse i en sikker tjeneste med ægte forespørgsler
              (artikel 6, stk. 1, litra f).
            </li>
          </ul>
        </Section>

        <Section title="5. Hvem vi videregiver oplysningerne til">
          <p>
            Med dit samtykke sender vi din forespørgsel til de
            forsikringsselskaber, der tilbyder de forsikringer, du har valgt.
            Et selskab får kun oplysningerne om de forsikringstyper, det
            tilbyder, sammen med dine kontaktoplysninger.
          </p>
          {PARTNERS.length > 0 ? (
            <>
              <p>Vi samarbejder i dag med:</p>
              <ul className="list-disc space-y-1 pl-5">
                {PARTNERS.map((partner) => (
                  <li key={partner.id}>{partner.name}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>
              Listen over de forsikringsselskaber, vi samarbejder med, bliver
              offentliggjort her, før vi begynder at sende forespørgsler videre.
            </p>
          )}
          <p>
            Når et forsikringsselskab har modtaget dine oplysninger, er det
            selvstændigt dataansvarligt for sin egen behandling af dem. Læs
            selskabets egen privatlivspolitik for at se, hvordan det behandler
            dine oplysninger.
          </p>
          <p>
            Selskaberne fortæller os, hvordan det er gået med din forespørgsel
            (fx at de har kontaktet dig, eller at du har fået et tilbud). Det
            bruger vi til at måle, om vores tjeneste virker, og, hvis du har
            sagt ja til marketingcookies, til at forbedre vores annoncer (se
            afsnit 7).
          </p>
          <p>Vi sælger aldrig dine oplysninger til andre.</p>
        </Section>

        <Section title="6. Databehandlere">
          <p>
            Vi bruger disse leverandører til at drive hjemmesiden. De behandler
            kun oplysninger efter vores instruks og har indgået en
            databehandleraftale med os:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Supabase</strong> (database). Dine oplysninger gemmes på
              servere i Frankfurt i Tyskland.
            </li>
            <li>
              <strong>Vercel</strong> (hosting og beskyttelse mod robotter).
              Hjemmesidens servere kører i Frankfurt i Tyskland. Vercel er en
              amerikansk virksomhed. Hvis oplysninger overføres til USA, sker
              det på grundlag af EU&apos;s og USA&apos;s databeskyttelsesramme
              (Data Privacy Framework) eller EU-Kommissionens
              standardkontraktbestemmelser.
            </li>
            <li>
              <strong>MotorAPI</strong> (opslag af nummerplader). MotorAPI ser
              den nummerplade, du skriver, men ikke hvem du er.
            </li>
          </ul>
          <p>
            Adresser og BBR-oplysninger slår vi op hos Datafordeleren, som er
            den offentlige platform for grunddata. Vi sender kun den adresse,
            du vælger, ikke hvem du er.
          </p>
        </Section>

        <Section title="7. Meta (Facebook og Instagram)">
          <p>
            Vi annoncerer på Facebook og Instagram. Kun hvis du siger ja til
            marketingcookies, bruger vi Meta Pixel på hjemmesiden og sender
            oplysninger til Meta fra vores server (Meta Conversions API), når
            du sender en forespørgsel, og når et forsikringsselskab fortæller
            os, hvordan det er gået med den.
          </p>
          <p>
            Vi sender krypterede (hashede) udgaver af din e-mail,
            telefonnummer, navn, postnummer og by, din IP-adresse og browser
            samt Metas id&apos;er for dit klik og din browser. Vi sender
            aldrig dine svar om forsikringerne til Meta.
          </p>
          <p>
            Formålet er at måle, hvilke annoncer der giver forespørgsler, og
            at vise vores annoncer til personer, der får gavn af tjenesten. Vi
            og Meta Platforms Ireland Ltd. er fælles dataansvarlige for
            indsamlingen og overførslen af oplysningerne til Meta. Metas egen
            behandling bagefter er Meta ansvarlig for alene, se Metas
            privatlivspolitik. Meta kan overføre oplysninger til USA på
            grundlag af EU&apos;s og USA&apos;s databeskyttelsesramme.
          </p>
          <p>
            Du kan altid trække dit samtykke tilbage under
            &quot;Cookie-indstillinger&quot; nederst på siden.
          </p>
        </Section>

        <Section title="8. Hvor længe vi gemmer oplysningerne">
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Din forespørgsel og dine svar slettes senest {RETENTION_MONTHS}{" "}
              måneder efter, at du har sendt den.
            </li>
            <li>
              Bevis for dine samtykker gemmer vi, så længe vi gemmer
              forespørgslen, så vi kan dokumentere, at oplysningerne blev sendt
              videre med dit samtykke.
            </li>
            <li>
              Samtykke til nyheder gælder, indtil du afmelder dig.
            </li>
          </ul>
          <p>
            Trækker du dit samtykke tilbage, eller beder du os slette dine
            oplysninger, sletter vi dem hurtigst muligt, medmindre vi har pligt
            til at gemme dem.
          </p>
        </Section>

        <Section title="9. Cookies og lokal lagring">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>hi_consent</strong> (nødvendig): husker dit valg i
              cookie-banneret. Gemmes i 6 måneder.
            </li>
            <li>
              <strong>Kladde af formularen</strong> (nødvendig): dine svar
              gemmes midlertidigt i din browser (sessionStorage), så du ikke
              mister dem, hvis siden genindlæses. Navn, e-mail, telefon og
              andre kontaktoplysninger gemmes ikke i kladden. Den slettes, når
              du lukker fanen, eller når du har sendt formularen.
            </li>
            <li>
              <strong>_fbc og _fbp</strong> (marketing, kun med samtykke): Metas
              cookies, der genkender et klik på en annonce og din browser.
              Gemmes i op til 90 dage.
            </li>
          </ul>
          <p>
            Vi bruger desuden Vercel BotID, som laver en usynlig kontrol i din
            browser, når du bruger formularen, så vi kan stoppe automatiserede
            robotter.
          </p>
        </Section>

        <Section title="10. Dine rettigheder">
          <p>Du har ret til at:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>få indsigt i de oplysninger, vi har om dig</li>
            <li>få rettet forkerte oplysninger</li>
            <li>få slettet dine oplysninger</li>
            <li>få begrænset behandlingen</li>
            <li>gøre indsigelse mod behandling, der bygger på vores legitime interesse</li>
            <li>få dine oplysninger udleveret i et almindeligt format (dataportabilitet)</li>
            <li>
              trække et samtykke tilbage når som helst. Det påvirker ikke den
              behandling, der er sket, før du trak det tilbage.
            </li>
          </ul>
          <p>
            Skriv til os på {CONTROLLER.email}. Har vi allerede sendt dine
            oplysninger til et forsikringsselskab, skal du også kontakte
            selskabet, hvis du ikke vil kontaktes mere. Vi hjælper gerne.
          </p>
          <p>
            Du kan klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby,
            www.datatilsynet.dk.
          </p>
        </Section>

        <Section title="11. Ændringer">
          <p>
            Vi opdaterer privatlivspolitikken, når vores behandling ændrer sig.
            Datoen øverst viser, hvornår den sidst blev ændret.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
